<?php

return [
    /*
    |--------------------------------------------------------------------------
    | File Upload Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for speaking profile file uploads
    |
    */

    'file_upload' => [
        'max_file_size' => 10 * 1024 * 1024, // 10MB in bytes
        'allowed_audio_formats' => ['mp3', 'wav', 'm4a', 'aac', 'ogg'],
        'allowed_image_formats' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'storage_disk' => 'public', // Use public for easy access
        'profile_picture_path' => 'speaking-profiles/pictures',
        'voice_intro_path' => 'speaking-profiles/voice-intros',
    ],

    /*
    |--------------------------------------------------------------------------
    | Profile Completion Points
    |--------------------------------------------------------------------------
    |
    | Points awarded for completing different profile sections
    |
    */

    'completion_points' => [
        'basic_info' => 20,
        'education_location' => 15,
        'contact_info' => 10,
        'interests' => 5,
        'profile_picture' => 10,
        'voice_intro' => 25, // Highest value as it's the USP
        'youtube_video' => 5,
    ],
];