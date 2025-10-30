<?php

namespace App\Http\Controllers\Speaking;

use App\Http\Controllers\Controller;
use App\Models\Speaking\SpeakingProfile;
use App\Models\Speaking\Favorite;
use App\Models\Speaking\UserInteraction;
use App\Models\Speaking\ConnectionRequest;
use App\Models\User;
use App\helpers\processor\FileProcessor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    /**
     * Display a listing of potential speaking partners.
     */
    public function index(Request $request, $tab = null): Response
    {
        $user = $request->user();
        $fileProcessor = new FileProcessor();

        // Validate and set default tab
        $validTabs = ['received', 'sent', 'favorites'];
        $activeTab = $tab && in_array($tab, $validTabs) ? $tab : 'received';

        // Helper function to format user data
        $formatUserData = function ($profile) use ($fileProcessor) {
            return [
                'id' => $profile->user_id,
                'name' => $profile->user->name,
                'profile_picture' => $fileProcessor->buildFullFilePath($profile->profile_picture) ?? '',
                'voice_intro_url' => $fileProcessor->buildFullFilePath($profile->voice_intro_url) ?? '',
                'purpose_of_practice' => $profile->purpose_of_practice,
                'education' => $profile->education,
                'institution' => $profile->institution,
                'district' => $profile->district,
                'city' => $profile->city,
                'expected_score' => $profile->expected_score,
                'career_plan' => $profile->career_plan,
                'youtube_video_url' => $profile->youtube_video_url,
                'contact_links' => $profile->contactLinks->map(function ($link) {
                    return [
                        $link->platform => $link->value,
                    ];
                })->reduce(function ($carry, $item) {
                    return array_merge($carry, $item);
                }, []),
                'created_at' => $profile->created_at,
                'updated_at' => $profile->updated_at,
            ];
        };

        // 1. Get sent connection requests
        $sentRequests = $user->sentConnectionRequests()
            ->with(['receiver.speakingProfile.contactLinks'])
            ->whereHas('receiver.speakingProfile')
            ->latest()
            ->get()
            ->map(function ($request) use ($formatUserData) {
                $userData = $formatUserData($request->receiver->speakingProfile);
                $userData['connection_status'] = $request->status;
                $userData['connection_id'] = $request->id;
                $userData['partner_type'] = 'sent_request';
                $userData['request_message'] = $request->message;
                $userData['request_date'] = $request->created_at;
                return $userData;
            });

        //dd($sentRequests);

        // 2. Get received connection requests
        $receivedRequests = $user->receivedConnectionRequests()
            ->with(['sender.speakingProfile.contactLinks'])
            ->whereHas('sender.speakingProfile')
            ->latest()
            ->get()
            ->map(function ($request) use ($formatUserData) {
                $userData = $formatUserData($request->sender->speakingProfile);
                $userData['connection_status'] = $request->status;
                $userData['connection_id'] = $request->id;
                $userData['partner_type'] = 'received_request';
                $userData['request_message'] = $request->message;
                $userData['request_date'] = $request->created_at;
                return $userData;
            });

        // 3. Get favorites
        $favorites = $user->favorites()
            ->with(['favoriteUser.speakingProfile.contactLinks'])
            ->whereHas('favoriteUser.speakingProfile')
            ->latest()
            ->get()
            ->map(function ($favorite) use ($formatUserData) {
                $userData = $formatUserData($favorite->favoriteUser->speakingProfile);
                $userData['connection_status'] = null;
                $userData['connection_id'] = null;
                $userData['partner_type'] = 'favorite';
                $userData['favorite_category'] = $favorite->category;
                $userData['favorite_notes'] = $favorite->notes;
                $userData['favorite_date'] = $favorite->created_at;
                return $userData;
            });

        return Inertia::render('Speaking/Partners', [
            'sentRequests' => $sentRequests,
            'receivedRequests' => $receivedRequests,
            'favorites' => $favorites,
            'activeTab' => $activeTab,
        ]);
    }

    /**
     * Display the specified speaking partner.
     */
    public function show(Request $request, User $partner): Response
    {
        $user = $request->user();
        $partnerProfile = $partner->speakingProfile;

        if (!$partnerProfile) {
            abort(404, 'Speaking partner not found.');
        }

        // Track view interaction
        UserInteraction::track($user->id, $partner->id, 'view');

        // Get compatibility score
        $userProfile = $user->speakingProfile;
        $compatibilityScore = $userProfile ? $userProfile->getCompatibilityScore($partnerProfile) : 0;

        // Check if favorited
        $isFavorited = $user->favorites()
            ->where('favorite_user_id', $partner->id)
            ->exists();

        return Inertia::render('Speaking/Partners/Show', [
            'partner' => $partner,
            'partnerProfile' => $partnerProfile,
            'compatibilityScore' => $compatibilityScore,
            'isFavorited' => $isFavorited,
        ]);
    }

    /**
     * Add a partner to favorites.
     */
    public function addToFavorites(Request $request, User $partner): RedirectResponse
    {
        $user = $request->user();

        // Check if already favorited
        $existing = $user->favorites()
            ->where('favorite_user_id', $partner->id)
            ->first();

        if (!$existing) {
            $user->favorites()->create([
                'favorite_user_id' => $partner->id,
                'category' => $request->get('category', 'general'),
                'notes' => $request->get('notes'),
            ]);

            // Track favorite interaction
            UserInteraction::track($user->id, $partner->id, 'favorite');
        }

        return Redirect::back()
            ->with('status', 'Added to favorites successfully.');
    }

    /**
     * Remove a partner from favorites.
     */
    public function removeFromFavorites(Request $request, User $partner): RedirectResponse
    {
        $user = $request->user();

        $user->favorites()
            ->where('favorite_user_id', $partner->id)
            ->delete();

        return Redirect::back()
            ->with('status', 'Removed from favorites successfully.');
    }

    /**
     * Get user's favorites.
     */
    public function favorites(Request $request): Response
    {
        $user = $request->user();
        $category = $request->get('category', 'all');

        $query = $user->favorites()
            ->with(['favoriteUser.speakingProfile', 'favoriteUser.contactLinks']);

        if ($category !== 'all') {
            $query->where('category', $category);
        }

        $favorites = $query->orderBy('created_at', 'desc')->paginate(12);

        return Inertia::render('Speaking/Partners/Favorites', [
            'favorites' => $favorites,
            'category' => $category,
            'categories' => Favorite::getAvailableCategories(),
        ]);
    }


    public function showPartners(Request $request)
    {
        $user = $request->user();
        $fileProcessor = new FileProcessor();

        // Helper function to format user data
        $formatUserData = function ($profile) use ($fileProcessor) {
            return [
                'id' => $profile->user_id,
                'name' => $profile->user->name,
                'profile_picture' => $fileProcessor->buildFullFilePath($profile->profile_picture) ?? '',
                'voice_intro_url' => $fileProcessor->buildFullFilePath($profile->voice_intro_url) ?? '',
                'purpose_of_practice' => $profile->purpose_of_practice,
                'education' => $profile->education,
                'institution' => $profile->institution,
                'district' => $profile->district,
                'city' => $profile->city,
                'expected_score' => $profile->expected_score,
                'career_plan' => $profile->career_plan,
                'youtube_video_url' => $profile->youtube_video_url,
                'contact_links' => $profile->contactLinks->map(function ($link) {
                    return [
                        $link->platform => $link->value,
                    ];
                })->reduce(function ($carry, $item) {
                    return array_merge($carry, $item);
                }, []),
                'created_at' => $profile->created_at,
                'updated_at' => $profile->updated_at,
            ];
        };

        // 1. Get sent connection requests
        $sentRequests = $user->sentConnectionRequests()
            ->with(['receiver.speakingProfile.contactLinks'])
            ->whereHas('receiver.speakingProfile')
            ->latest()
            ->get()
            ->map(function ($request) use ($formatUserData) {
                $userData = $formatUserData($request->receiver->speakingProfile);
                $userData['connection_status'] = $request->status;
                $userData['connection_id'] = $request->id;
                $userData['partner_type'] = 'sent_request';
                $userData['request_message'] = $request->message;
                $userData['request_date'] = $request->created_at;
                return $userData;
            });

        // 2. Get received connection requests
        $receivedRequests = $user->receivedConnectionRequests()
            ->with(['sender.speakingProfile.contactLinks'])
            ->whereHas('sender.speakingProfile')
            ->latest()
            ->get()
            ->map(function ($request) use ($formatUserData) {
                $userData = $formatUserData($request->sender->speakingProfile);
                $userData['connection_status'] = $request->status;
                $userData['connection_id'] = $request->id;
                $userData['partner_type'] = 'received_request';
                $userData['request_message'] = $request->message;
                $userData['request_date'] = $request->created_at;
                return $userData;
            });

        // 3. Get favorites
        $favorites = $user->favorites()
            ->with(['favoriteUser.speakingProfile.contactLinks'])
            ->whereHas('favoriteUser.speakingProfile')
            ->latest()
            ->get()
            ->map(function ($favorite) use ($formatUserData) {
                $userData = $formatUserData($favorite->favoriteUser->speakingProfile);
                $userData['connection_status'] = null; // Favorites don't have connection status initially
                $userData['connection_id'] = null;
                $userData['partner_type'] = 'favorite';
                $userData['favorite_category'] = $favorite->category;
                $userData['favorite_notes'] = $favorite->notes;
                $userData['favorite_date'] = $favorite->created_at;
                return $userData;
            });

        return Inertia::render('Speaking/Partners', [
            'sentRequests' => $sentRequests,
            'receivedRequests' => $receivedRequests,
            'favorites' => $favorites,
        ]);
    }

    /**
     * Update connection request status.
     */
    public function updateConnectionStatus(Request $request, $connectionId)
    {
        $request->validate([
            'status' => 'required|in:pending,connected,rejected,cancelled',
        ]);

        $connectionRequest = ConnectionRequest::findOrFail($connectionId);
        $user = $request->user();

        // Verify user has permission to update this request
        if ($connectionRequest->sender_id !== $user->id && $connectionRequest->receiver_id !== $user->id) {
            abort(403, 'Unauthorized to update this connection request.');
        }

        // Update status
        $connectionRequest->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Connection status updated successfully.',
            'connection' => $connectionRequest,
        ]);
    }

    /**
     * Send a connection request to a partner.
     */
    public function sendConnectionRequest(Request $request, User $targetUser)
    {
        $user = $request->user();

        // Prevent user from sending request to themselves
        if ($user->id === $targetUser->id) {
            return response()->json([
                'success' => false,
                'error' => 'You cannot send a connection request to yourself.',
            ], 400);
        }

        // Check if request already exists
        $existing = ConnectionRequest::where([
            ['sender_id', $user->id],
            ['receiver_id', $targetUser->id],
        ])->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'error' => 'Connection request already sent.',
                'connection' => $existing,
            ], 400);
        }

        // Check if reverse request exists (target already sent request to user)
        $reverseRequest = ConnectionRequest::where([
            ['sender_id', $targetUser->id],
            ['receiver_id', $user->id],
        ])->first();

        if ($reverseRequest && $reverseRequest->status === 'pending') {
            // Auto-connect both users (mutual interest)
            $reverseRequest->update(['status' => 'connected']);

            return response()->json([
                'success' => true,
                'message' => 'Automatically connected! You both wanted to connect.',
                'auto_connected' => true,
                'connection' => $reverseRequest,
            ]);
        }

        // Create new connection request
        $connectionRequest = ConnectionRequest::create([
            'sender_id' => $user->id,
            'receiver_id' => $targetUser->id,
            'status' => 'pending',
            'message' => $request->input('message'),
        ]);

        // TODO: Send OneSignal notification to target user
        // You can integrate NotificationController here if needed

        return response()->json([
            'success' => true,
            'message' => 'Connection request sent successfully!',
            'connection' => $connectionRequest,
        ], 201);
    }








}
