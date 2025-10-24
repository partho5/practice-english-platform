<?php

namespace App\Models\Speaking;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'favorite_user_id',
        'category',
        'notes',
    ];

    /**
     * Get the user that owns the favorite.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the favorited user.
     */
    public function favoriteUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'favorite_user_id');
    }

    /**
     * Get the favorited user's speaking profile.
     */
    public function favoriteUserProfile(): BelongsTo
    {
        return $this->belongsTo(SpeakingProfile::class, 'favorite_user_id', 'user_id');
    }

    /**
     * Scope for specific category.
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for recent favorites.
     */
    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Get available categories.
     */
    public static function getAvailableCategories(): array
    {
        return [
            'general' => 'General',
            'highly_compatible' => 'Highly Compatible',
            'nearby' => 'Nearby',
            'recent' => 'Recent',
            'custom' => 'Custom',
        ];
    }
}
