<?php

namespace App\Services\Speaking;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    protected array $config;

    public function __construct()
    {
        $this->config = config('speaking.file_upload');
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(UploadedFile $file, int $userId): string
    {
        $config = $this->config['profile_picture'];
        
        // Validate file
        $this->validateFile($file, $config);
        
        // Generate unique filename
        $extension = $file->getClientOriginalExtension();
        $filename = "profile_{$userId}_" . Str::random(10) . ".{$extension}";
        
        // Store file
        $path = $file->storeAs(
            $this->config['storage_path'] . '/profile-pictures',
            $filename,
            $this->config['storage_disk']
        );
        
        return $path;
    }

    /**
     * Upload voice intro
     */
    public function uploadVoiceIntro(UploadedFile $file, int $userId): string
    {
        $config = $this->config['voice_intro'];
        
        // Validate file
        $this->validateFile($file, $config);
        
        // Generate unique filename
        $extension = $file->getClientOriginalExtension();
        $filename = "voice_{$userId}_" . Str::random(10) . ".{$extension}";
        
        // Store file
        $path = $file->storeAs(
            $this->config['storage_path'] . '/voice-intros',
            $filename,
            $this->config['storage_disk']
        );
        
        return $path;
    }

    /**
     * Validate YouTube URL
     */
    public function validateYouTubeUrl(string $url): bool
    {
        $allowedDomains = $this->config['youtube_video']['allowed_domains'];
        
        foreach ($allowedDomains as $domain) {
            if (str_contains($url, $domain)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Delete file
     */
    public function deleteFile(string $path): bool
    {
        if (Storage::disk($this->config['storage_disk'])->exists($path)) {
            return Storage::disk($this->config['storage_disk'])->delete($path);
        }
        
        return true;
    }

    /**
     * Get file URL
     */
    public function getFileUrl(string $path): string
    {
        return Storage::disk($this->config['storage_disk'])->url($path);
    }

    /**
     * Validate file against configuration
     */
    protected function validateFile(UploadedFile $file, array $config): void
    {
        // Check file size
        if ($file->getSize() > $config['max_size']) {
            throw new \InvalidArgumentException(
                'File size exceeds maximum allowed size of ' . 
                $this->formatBytes($config['max_size'])
            );
        }

        // Check file type
        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, $config['allowed_types'])) {
            throw new \InvalidArgumentException(
                'File type not allowed. Allowed types: ' . 
                implode(', ', $config['allowed_types'])
            );
        }
    }

    /**
     * Format bytes to human readable format
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get image dimensions for validation
     */
    public function getImageDimensions(): array
    {
        return $this->config['profile_picture']['dimensions'];
    }

    /**
     * Get allowed file types for profile pictures
     */
    public function getAllowedProfilePictureTypes(): array
    {
        return $this->config['profile_picture']['allowed_types'];
    }

    /**
     * Get allowed file types for voice intros
     */
    public function getAllowedVoiceIntroTypes(): array
    {
        return $this->config['voice_intro']['allowed_types'];
    }
}
