<?php

namespace App\Models\Speaking;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserInteraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'target_user_id',
        'action_type',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the user that performed the interaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the target user of the interaction.
     */
    public function targetUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    /**
     * Scope for specific action type.
     */
    public function scopeByAction($query, string $actionType)
    {
        return $query->where('action_type', $actionType);
    }

    /**
     * Scope for recent interactions.
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope for interactions by user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for interactions with target user.
     */
    public function scopeWithTargetUser($query, int $targetUserId)
    {
        return $query->where('target_user_id', $targetUserId);
    }

    /**
     * Get available action types.
     */
    public static function getActionTypes(): array
    {
        return [
            'view' => 'View Profile',
            'favorite' => 'Add to Favorites',
            'message' => 'Send Message',
            'block' => 'Block User',
        ];
    }

    /**
     * Track user interaction.
     */
    public static function track(int $userId, int $targetUserId, string $actionType, array $metadata = []): self
    {
        return self::create([
            'user_id' => $userId,
            'target_user_id' => $targetUserId,
            'action_type' => $actionType,
            'metadata' => $metadata,
        ]);
    }
}
