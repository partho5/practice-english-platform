<?php

namespace App\helpers\processor;

class FileProcessor
{
    /**
     * Build full image path with storage prefix
     *
     * @param string|null $path
     * @return string|null
     */
    public function buildFullFilePath(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        // If it's already a full URL, return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // Check if we're on production (config compatible to  Hostinger shared hosting)
        if (app()->environment('production')) {
            return asset('storage/app/public/' . $path);
        }

        // Return path with storage prefix
        return asset('storage/' . $path);
    }

}
