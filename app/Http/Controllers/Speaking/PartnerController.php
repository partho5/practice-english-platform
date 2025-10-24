<?php

namespace App\Http\Controllers\Speaking;

use App\Http\Controllers\Controller;
use App\Models\Speaking\SpeakingProfile;
use App\Models\Speaking\Favorite;
use App\Models\Speaking\UserInteraction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    /**
     * Display a listing of potential speaking partners.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $userProfile = $user->speakingProfile;

        if (!$userProfile) {
            return Redirect::route('speaking.profile.edit')
                ->with('status', 'Please complete your speaking profile first.');
        }

        $query = SpeakingProfile::with(['user', 'contactLinks'])
            ->where('user_id', '!=', $user->id)
            ->available();

        // Apply filters
        $filters = $request->only([
            'purpose_of_practice',
            'skill_level',
            'city',
            'district',
            'is_online',
            'is_verified'
        ]);

        foreach ($filters as $key => $value) {
            if ($value) {
                $query->where($key, $value);
            }
        }

        // Search by interests
        if ($request->filled('interests')) {
            $interests = is_array($request->interests) ? $request->interests : [$request->interests];
            $query->where(function ($q) use ($interests) {
                foreach ($interests as $interest) {
                    $q->orWhereJsonContains('interests', $interest);
                }
            });
        }

        // Sort results
        $sortBy = $request->get('sort_by', 'relevance');
        switch ($sortBy) {
            case 'distance':
                // TODO: Implement distance-based sorting
                $query->orderBy('city');
                break;
            case 'recent':
                $query->orderBy('last_active_at', 'desc');
                break;
            case 'compatibility':
                // TODO: Implement compatibility-based sorting
                $query->orderBy('created_at', 'desc');
                break;
            default: // relevance
                $query->orderBy('is_online', 'desc')
                    ->orderBy('is_verified', 'desc')
                    ->orderBy('last_active_at', 'desc');
        }

        $partners = $query->paginate(12);

        // Add compatibility scores
        $partners->getCollection()->transform(function ($partner) use ($userProfile) {
            $partner->compatibility_score = $userProfile->getCompatibilityScore($partner);
            $partner->is_favorited = $user->favorites()
                ->where('favorite_user_id', $partner->user_id)
                ->exists();
            return $partner;
        });

        return Inertia::render('Speaking/Partners/Index', [
            'partners' => $partners,
            'filters' => $filters,
            'userProfile' => $userProfile,
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
}
