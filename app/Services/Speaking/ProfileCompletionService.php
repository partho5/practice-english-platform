<?php

namespace App\Services\Speaking;

use App\Models\Speaking\SpeakingProfile;
use App\Models\Speaking\ContactLink;

class ProfileCompletionService
{
    protected array $config;

    public function __construct()
    {
        $this->config = config('speaking.profile_completion');
    }

    /**
     * Calculate profile completion percentage
     */
    public function calculateCompletion(SpeakingProfile $profile): array
    {
        $totalPoints = 0;
        $earnedPoints = 0;
        $completedFields = [];
        $missingFields = [];

        // Check required fields
        foreach ($this->config['required_fields'] as $field => $points) {
            $totalPoints += $points;

            if ($this->isFieldCompleted($profile, $field)) {
                $earnedPoints += $points;
                $completedFields[] = $field;
            } else {
                $missingFields[] = $field;
            }
        }

        // Check optional fields
        foreach ($this->config['optional_fields'] as $field => $points) {
            $totalPoints += $points;

            if ($this->isFieldCompleted($profile, $field)) {
                $earnedPoints += $points;
                $completedFields[] = $field;
            }
        }

        // Check contact links
        $contactPoints = $this->calculateContactLinkPoints($profile->user_id);
        $totalPoints += $this->config['contact_links']['max_points'];
        $earnedPoints += $contactPoints;

        if ($contactPoints > 0) {
            $completedFields[] = 'contact_links';
        }

        $percentage = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100) : 0;

        return [
            'percentage' => $percentage,
            'points_earned' => $earnedPoints,
            'points_total' => $totalPoints,
            'completed_fields' => $completedFields,
            'missing_fields' => $missingFields,
            'completion_level' => $this->getCompletionLevel($percentage),
        ];
    }

    /**
     * Check if a field is completed
     */
    protected function isFieldCompleted(SpeakingProfile $profile, string $field): bool
    {
        $value = $profile->$field;

        if (is_null($value) || $value === '') {
            return false;
        }

        // Special handling for array fields
        if (in_array($field, ['interests', 'available_hours', 'preferred_days'])) {
            return is_array($value) && count($value) > 0;
        }

        return true;
    }

    /**
     * Calculate points for contact links
     */
    protected function calculateContactLinkPoints(int $userId): int
    {
        $contactLinks = ContactLink::where('user_id', $userId)->count();

        if ($contactLinks >= $this->config['contact_links']['minimum_required']) {
            $points = $contactLinks * $this->config['contact_links']['points_per_link'];
            return min($points, $this->config['contact_links']['max_points']);
        }

        return 0;
    }

    /**
     * Get completion level based on percentage
     */
    protected function getCompletionLevel(int $percentage): string
    {
        if ($percentage >= 90) {
            return 'excellent';
        } elseif ($percentage >= 75) {
            return 'good';
        } elseif ($percentage >= 50) {
            return 'fair';
        } elseif ($percentage >= 25) {
            return 'poor';
        } else {
            return 'minimal';
        }
    }

    /**
     * Get completion status message
     */
    public function getCompletionMessage(int $percentage): string
    {
        return match ($this->getCompletionLevel($percentage)) {
            'excellent' => 'Your profile is complete and looks great!',
            'good' => 'Your profile is well-developed. Add a few more details to make it perfect.',
            'fair' => 'Your profile has good basic information. Consider adding more details.',
            'poor' => 'Your profile needs more information to help others connect with you.',
            'minimal' => 'Please complete your profile to get started.',
            default => 'Complete your profile to get the best experience.',
        };
    }

    /**
     * Get next suggested fields to complete
     */
    public function getNextSuggestedFields(SpeakingProfile $profile): array
    {
        $completion = $this->calculateCompletion($profile);
        $suggestions = [];

        // Prioritize missing required fields
        foreach ($completion['missing_fields'] as $field) {
            if (in_array($field, array_keys($this->config['required_fields']))) {
                $suggestions[] = [
                    'field' => $field,
                    'priority' => 'high',
                    'points' => $this->config['required_fields'][$field],
                    'message' => $this->getFieldMessage($field),
                ];
            }
        }

        // Add optional fields that would give most points
        $optionalFields = $this->config['optional_fields'];
        arsort($optionalFields);

        foreach ($optionalFields as $field => $points) {
            if (!in_array($field, $completion['completed_fields'])) {
                $suggestions[] = [
                    'field' => $field,
                    'priority' => 'medium',
                    'points' => $points,
                    'message' => $this->getFieldMessage($field),
                ];
            }
        }

        return array_slice($suggestions, 0, 3); // Return top 3 suggestions
    }

    /**
     * Get field-specific completion message
     */
    protected function getFieldMessage(string $field): string
    {
        return match ($field) {
            'purpose_of_practice' => 'Add your purpose of practice (IELTS, TOEFL, Fluency, or Other)',
            'education' => 'Add your education background',
            'institution' => 'Add your institution name',
            'district' => 'Add your district',
            'city' => 'Add your city',
            'career_plan' => 'Describe your career goals and plans',
            'skill_level' => 'Select your English skill level',
            'expected_score' => 'Add your expected score',
            'profile_picture' => 'Upload a profile picture',
            'voice_intro_url' => 'Add a voice introduction',
            'youtube_video_url' => 'Add a YouTube video introduction',
            'native_language' => 'Add your native language',
            'interests' => 'Add your interests and hobbies',
            'available_hours' => 'Add your available hours',
            'preferred_days' => 'Add your preferred days',
            default => "Complete the {$field} field",
        };
    }
}
