<?php

namespace App\Http\Requests\Speaking;

use Illuminate\Foundation\Http\FormRequest;

class ProfileDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Core profile data
            'purpose_of_practice' => 'required|in:IELTS,TOEFL,Fluency,Other',
            'expected_score' => 'nullable|string|max:50',
            'education' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'district' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'career_plan' => 'required|string|max:1000',
            
            // Media
            'profile_picture' => 'nullable|string|max:255',
            'voice_intro_url' => 'nullable|string|max:255',
            'youtube_video_url' => 'nullable|string|max:255',
            
            // Availability & preferences
            'timezone' => 'nullable|string|max:50',
            'available_hours' => 'nullable|array',
            'available_hours.*' => 'string|in:morning,afternoon,evening,night',
            'preferred_days' => 'nullable|array',
            'preferred_days.*' => 'string|in:weekdays,weekends',
            'skill_level' => 'required|in:Beginner,Intermediate,Advanced',
            'native_language' => 'nullable|string|max:50',
            'interests' => 'nullable|array',
            'interests.*' => 'string|max:50',
            
            // Status
            'is_online' => 'boolean',
            'is_available' => 'boolean',
            
            // Contact links
            'contact_links' => 'nullable|array',
            'contact_links.*.platform' => 'required_with:contact_links.*.value|in:facebook,whatsapp,telegram,email',
            'contact_links.*.value' => 'required_with:contact_links.*.platform|string|max:255',
            'contact_links.*.is_public' => 'boolean',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'purpose_of_practice' => 'purpose of practice',
            'expected_score' => 'expected score',
            'career_plan' => 'career plan',
            'profile_picture' => 'profile picture',
            'voice_intro_url' => 'voice introduction URL',
            'youtube_video_url' => 'YouTube video URL',
            'available_hours' => 'available hours',
            'preferred_days' => 'preferred days',
            'skill_level' => 'skill level',
            'native_language' => 'native language',
            'contact_links' => 'contact links',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'purpose_of_practice.required' => 'Please select your purpose of practice.',
            'purpose_of_practice.in' => 'Please select a valid purpose of practice.',
            'education.required' => 'Please enter your education background.',
            'institution.required' => 'Please enter your institution name.',
            'district.required' => 'Please enter your district.',
            'city.required' => 'Please enter your city.',
            'career_plan.required' => 'Please describe your career plan.',
            'skill_level.required' => 'Please select your skill level.',
            'skill_level.in' => 'Please select a valid skill level.',
            'contact_links.*.platform.in' => 'Please select a valid contact platform.',
            'contact_links.*.value.required_with' => 'Please enter the contact value.',
        ];
    }
}
