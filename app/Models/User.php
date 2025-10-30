<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Speaking\SpeakingProfile;
use App\Models\Speaking\ContactLink;
use App\Models\Speaking\Favorite;
use App\Models\Speaking\UserInteraction;
use App\Models\Speaking\ConnectionRequest;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's speaking profile.
     */
    public function speakingProfile(): HasOne
    {
        return $this->hasOne(SpeakingProfile::class);
    }

    /**
     * Get the user's contact links.
     */
    public function contactLinks(): HasMany
    {
        return $this->hasMany(ContactLink::class);
    }

    /**
     * Get the user's favorites.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Get the user's interactions.
     */
    public function interactions(): HasMany
    {
        return $this->hasMany(UserInteraction::class);
    }

    /**
     * Get the user's interactions as target.
     */
    public function targetInteractions(): HasMany
    {
        return $this->hasMany(UserInteraction::class, 'target_user_id');
    }

    /**
     * Check if user has completed speaking profile.
     */
    public function hasCompletedSpeakingProfile(): bool
    {
        return $this->speakingProfile()->exists();
    }

    /**
     * Check if user is favorited by another user.
     */
    public function isFavoritedBy(int $userId): bool
    {
        return $this->targetInteractions()
            ->where('user_id', $userId)
            ->where('action_type', 'favorite')
            ->exists();
    }

    /**
     * Get compatibility score with another user.
     */
    public function getCompatibilityScore(User $otherUser): int
    {
        $myProfile = $this->speakingProfile;
        $otherProfile = $otherUser->speakingProfile;

        if (!$myProfile || !$otherProfile) {
            return 0;
        }

        return $myProfile->getCompatibilityScore($otherProfile);
    }

    /**
     * Get connection requests sent by this user.
     */
    public function sentConnectionRequests(): HasMany
    {
        return $this->hasMany(ConnectionRequest::class, 'sender_id');
    }

    /**
     * Get connection requests received by this user.
     */
    public function receivedConnectionRequests(): HasMany
    {
        return $this->hasMany(ConnectionRequest::class, 'receiver_id');
    }
}
