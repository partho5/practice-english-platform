<?php

namespace App\Http\Controllers\Speaking;

use App\helpers\processor\FileProcessor;
use App\Http\Controllers\Controller;
use App\Http\Requests\Speaking\ProfileDetailsRequest;
use App\Models\Speaking\SpeakingProfile;
use App\Models\Speaking\ContactLink;
use App\Services\Speaking\ProfileCompletionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's speaking profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->speakingProfile;
        $contactLinks = $user->contactLinks;

        $fileProcessor = new FileProcessor();

        // Calculate profile completion
        $completionData = null;
        if ($profile) {
//            $completionService = new ProfileCompletionService();
//            $completionData = $completionService->calculateCompletion($profile);
        }

        // Prepare initial data for form
        $initialData = [];
        if ($profile) {
            $initialData = [
                'purpose_of_practice' => $profile->purpose_of_practice,
                'skill_level' => $profile->skill_level,
                'expected_score' => $profile->expected_score ?? '',
                'career_plan' => $profile->career_plan,
                'profile_picture' => $fileProcessor->buildFullFilePath($profile->profile_picture) ?? '',
                'voice_intro_url' => $fileProcessor->buildFullFilePath($profile->voice_intro_url) ?? '',
                'youtube_video_url' => $profile->youtube_video_url ?? '',
                'education' => $profile->education,
                'institution' => $profile->institution,
                'interests' => $profile->interests ? implode(', ', json_decode($profile->interests, true)) : '',
            ];

            // Add contact information
            foreach ($contactLinks as $link) {
                $initialData[$link->platform] = $link->value;
            }
        }

        return Inertia::render('Speaking/Profile/Edit', [
            'profile' => $profile,
            'contactLinks' => $contactLinks,
            'completionData' => $completionData,
            'initialData' => $initialData,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's speaking profile information step by step.
     */
    public function update(Request $request): RedirectResponse|JsonResponse
    {
        $user = $request->user();
        $step = $request->input('step', 0);

        // Handle file uploads first
        $fileUrls = $this->handleFileUploads($request, $user);

        // Prepare data based on step
        $profileData = $this->prepareStepData($request, $step, $fileUrls);

        // Update or create speaking profile
        $profile = $user->speakingProfile()->updateOrCreate(
            ['user_id' => $user->id],
            $profileData
        );

        // Handle contact links for step 1 (Education & Contact)
        if ($step === 1) {
            $this->updateContactLinksFromStep($user, $request);
        }

        // Return appropriate response
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Step saved successfully',
                'file_urls' => $fileUrls,
            ]);
        }

        return Redirect::route('speaking.profile.edit')
            ->with('status', 'Profile updated successfully.');
    }

    /**
     * Handle file uploads for the current step.
     */
    private function handleFileUploads(Request $request, $user): array
    {
        $fileUrls = [];
        $config = config('speaking.file_upload');
        $profile = $user->speakingProfile;

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');

            // Validate file
            if ($this->validateFile($file, 'image')) {
                // Clean up old profile picture if exists
                if ($profile && $profile->profile_picture) {
                    $this->cleanupOldFile($profile->profile_picture);
                }

                $fileUrls['profile_picture'] = $this->storeFileUsingCompleteUrl($file, $config['profile_picture_path'], $user);
            }
        }

        // Handle voice intro upload
        if ($request->hasFile('voice_intro_file')) {
            $file = $request->file('voice_intro_file');

            // Validate file
            if ($this->validateFile($file, 'audio')) {
                // Clean up old voice intro if exists
                if ($profile && $profile->voice_intro_url) {
                    $this->cleanupOldFile($profile->voice_intro_url);
                }

                $fileUrls['voice_intro_url'] = $this->storeFileUsingCompleteUrl($file, $config['voice_intro_path'], $user);
            }
        }

        return $fileUrls;
    }

    /**
     * Validate uploaded file.
     */
    private function validateFile($file, string $type): bool
    {
        $config = config('speaking.file_upload');

        // Check file size
        if ($file->getSize() > $config['max_file_size']) {
            return false;
        }

        // Check file format
        $extension = strtolower($file->getClientOriginalExtension());
        $allowedFormats = $type === 'image'
            ? $config['allowed_image_formats']
            : $config['allowed_audio_formats'];

        return in_array($extension, $allowedFormats);
    }

    /**
     * Store file and return URL.
     */
    private function storeFile($file, string $path, $user): string
    {
        $config = config('speaking.file_upload');

        // Generate unique filename
        $filename = $user->id . '_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

        // Store file
        $storedPath = $file->storeAs($path, $filename, $config['storage_disk']);

        // Return public URL
        return Storage::disk($config['storage_disk'])->url($storedPath);
    }

    private function storeFileUsingCompleteUrl($file, $basePath, $user): string
    {
        $userId = $user->id;
        $timestamp = time();
        $randomString = Str::random(10);
        $extension = $file->getClientOriginalExtension();

        $filename = "{$userId}_{$timestamp}_{$randomString}.{$extension}";
        $path = "{$basePath}/{$filename}";

        $config = config('speaking.file_upload');
        // Store the file
        Storage::disk($config['storage_disk'])->put($path, file_get_contents($file));

        // Return only the storage path (not full URL)
        return $path;
    }

    /**
     * Clean up old file when uploading new one.
     */
    private function cleanupOldFile(string $fileUrl): void
    {
        try {
            $config = config('speaking.file_upload');
            $disk = Storage::disk($config['storage_disk']);

            // Extract file path from URL
            $parsedUrl = parse_url($fileUrl);
            if (isset($parsedUrl['path'])) {
                $filePath = ltrim($parsedUrl['path'], '/storage/');

                // Delete file if it exists
                if ($disk->exists($filePath)) {
                    $disk->delete($filePath);
                }
            }
        } catch (\Exception $e) {
            // Log error but don't fail the upload
            \Log::warning('Failed to cleanup old file: ' . $e->getMessage());
        }
    }

    /**
     * Prepare data for the current step.
     */
    private function prepareStepData(Request $request, int $step, array $fileUrls): array
    {
        $data = [];

        switch ($step) {
            case 0: // Basic Information
                $data = [
                    'purpose_of_practice' => $request->input('purpose_of_practice'),
                    'skill_level' => $request->input('skill_level'),
                    'expected_score' => $request->input('expected_score'),
                    'career_plan' => $request->input('career_plan'),
                    'youtube_video_url' => $request->input('youtube_video_url'),
                ];

                // Add file URLs if uploaded
                if (isset($fileUrls['profile_picture'])) {
                    $data['profile_picture'] = $fileUrls['profile_picture'];
                }
                if (isset($fileUrls['voice_intro_url'])) {
                    $data['voice_intro_url'] = $fileUrls['voice_intro_url'];
                }
                break;

            case 1: // Education & Contact
                $data = [
                    'education' => $request->input('education'),
                    'institution' => $request->input('institution'),
                ];
                break;

            case 2: // Interests
                $data = [
                    'interests' => $request->input('interests') ?
                        json_encode(array_map('trim', explode(',', $request->input('interests')))) :
                        null,
                ];
                break;
        }

        return array_filter($data, function($value) {
            return $value !== null && $value !== '';
        });
    }

    /**
     * Update contact links from step 1 data.
     */
    private function updateContactLinksFromStep($user, Request $request): void
    {
        //dd($request->input());

        // Delete existing contact links
        $user->contactLinks()->delete();

        // Create new contact links
        $contactMethods = ['whatsapp', 'telegram', 'facebook', 'email'];

        foreach ($contactMethods as $method) {
            $value = $request->input($method);
            if (!empty($value)) {
                $user->contactLinks()->create([
                    'platform' => $method,
                    'value' => $value,
                    'is_public' => false, // All contacts are private by default
                ]);
            }
        }
    }

    /**
     * Display the user's speaking profile.
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->speakingProfile;
        $contactLinks = $user->contactLinks;

        if (!$profile) {
            return Redirect::route('speaking.profile.edit')
                ->with('status', 'Please complete your speaking profile first.');
        }

        return Inertia::render('Speaking/Profile/View', [
            'profile' => $profile,
            'contactLinks' => $contactLinks,
        ]);
    }

    /**
     * Update user's online status.
     */
    public function updateStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'is_online' => 'boolean',
            'is_available' => 'boolean',
        ]);

        $user = $request->user();
        $profile = $user->speakingProfile;

        if ($profile) {
            $profile->update([
                'is_online' => $request->boolean('is_online'),
                'is_available' => $request->boolean('is_available'),
                'last_active_at' => now(),
            ]);
        }

        return Redirect::back()
            ->with('status', 'Status updated successfully.');
    }

    /**
     * Update contact links for the user.
     */
    private function updateContactLinks($user, array $contactLinks): void
    {
        // Delete existing contact links
        $user->contactLinks()->delete();

        // Create new contact links
        foreach ($contactLinks as $link) {
            if (!empty($link['value'])) {
                $user->contactLinks()->create([
                    'platform' => $link['platform'],
                    'value' => $link['value'],
                    'is_public' => $link['is_public'] ?? false,
                ]);
            }
        }
    }
}
