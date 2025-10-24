<?php

namespace App\Http\Controllers;

use App\helpers\processor\FileProcessor;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Speaking\SpeakingPushSubscription;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function showHomepage()
    {
        // Fetch users with speaking profiles for the homepage
        $users = \App\Models\Speaking\SpeakingProfile::with(['user', 'contactLinks'])
            ->available()
            ->orderBy('is_online', 'desc')
            ->orderBy('last_active_at', 'desc')
            ->limit(12)
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->user_id,
                    'name' => $profile->user->name,
                    'profile_picture' => FileProcessor::buildFullImagePath($profile->profile_picture) ?? '',
                    'voice_intro_url' => FileProcessor::buildFullImagePath($profile->voice_intro_url) ?? '',
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
            });


        $hasSubscriptions = false;
        if (Auth::check()) {
            $hasSubscriptions = SpeakingPushSubscription::where('user_id', Auth::id())->exists();
        }

        return Inertia::render('Welcome', [
            'users' => $users,
            'hasSubscriptions' => $hasSubscriptions,
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
