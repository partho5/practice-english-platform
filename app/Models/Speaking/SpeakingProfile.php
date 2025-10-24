<?php

namespace App\Models\Speaking;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SpeakingProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'purpose_of_practice',
        'expected_score',
        'education',
        'institution',
        'district',
        'city',
        'career_plan',
        'profile_picture',
        'voice_intro_url',
        'youtube_video_url',
        'timezone',
        'available_hours',
        'preferred_days',
        'skill_level',
        'native_language',
        'interests',
        'is_online',
        'is_available',
        'is_verified',
        'last_active_at',
    ];

    protected $casts = [
        'available_hours' => 'array',
        'preferred_days' => 'array',
        'interests' => 'array',
        'is_online' => 'boolean',
        'is_available' => 'boolean',
        'is_verified' => 'boolean',
        'last_active_at' => 'datetime',
    ];

    /**
     * Get the user that owns the speaking profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the contact links for the user.
     */
    public function contactLinks(): HasMany
    {
        return $this->hasMany(ContactLink::class, 'user_id', 'user_id');
    }

    /**
     * Get the purchase of practice badge color.
     */
    public function getPurposeBadgeColorAttribute(): string
    {
        return match ($this->purpose_of_practice) {
            'IELTS' => 'bg-blue-100 text-blue-800',
            'TOEFL' => 'bg-green-100 text-green-800',
            'Fluency' => 'bg-purple-100 text-purple-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get the skill level badge color.
     */
    public function getSkillLevelBadgeColorAttribute(): string
    {
        return match ($this->skill_level) {
            'Beginner' => 'bg-yellow-100 text-yellow-800',
            'Intermediate' => 'bg-blue-100 text-blue-800',
            'Advanced' => 'bg-green-100 text-green-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Scope for available users.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Scope for online users.
     */
    public function scopeOnline($query)
    {
        return $query->where('is_online', true);
    }

    /**
     * Scope for verified users.
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope for users by purpose of practice.
     */
    public function scopeByPurpose($query, string $purpose)
    {
        return $query->where('purpose_of_practice', $purpose);
    }

    /**
     * Scope for users by location.
     */
    public function scopeByLocation($query, string $city, string $district = null)
    {
        $query->where('city', 'like', "%{$city}%");
        
        if ($district) {
            $query->where('district', 'like', "%{$district}%");
        }
        
        return $query;
    }

    /**
     * Scope for users by skill level.
     */
    public function scopeBySkillLevel($query, string $skillLevel)
    {
        return $query->where('skill_level', $skillLevel);
    }

    /**
     * Get compatibility score with another user.
     */
    public function getCompatibilityScore(SpeakingProfile $otherProfile): int
    {
        $score = 0;
        
        // Purpose of practice match (30 points)
        if ($this->purpose_of_practice === $otherProfile->purpose_of_practice) {
            $score += 30;
        }
        
        // Location match (25 points)
        if ($this->city === $otherProfile->city) {
            $score += 25;
        } elseif ($this->district === $otherProfile->district) {
            $score += 15;
        }
        
        // Skill level match (20 points)
        if ($this->skill_level === $otherProfile->skill_level) {
            $score += 20;
        }
        
        // Common interests (15 points)
        if ($this->interests && $otherProfile->interests) {
            $commonInterests = array_intersect($this->interests, $otherProfile->interests);
            $score += min(15, count($commonInterests) * 3);
        }
        
        // Expected score similarity (10 points)
        if ($this->expected_score && $otherProfile->expected_score) {
            if ($this->expected_score === $otherProfile->expected_score) {
                $score += 10;
            }
        }
        
        return min(100, $score);
    }
}
