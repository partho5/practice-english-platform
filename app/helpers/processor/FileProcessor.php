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
    public static function buildFullImagePath(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return asset('storage/' . $path);
    }

    // Add more static file processing reusable methods here as needed.
}
