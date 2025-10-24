<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Speaking\SpeakingProfile;
use App\Models\Speaking\ContactLink;
use Illuminate\Support\Facades\Hash;

class SpeakingProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Bangladeshi names and data
        $usersData = [
            [
                'name' => 'Fatima Ahmed',
                'email' => 'fatima.ahmed@example.com',
                'profile' => [
                    'purpose_of_practice' => 'IELTS',
                    'expected_score' => '7.5',
                    'education' => 'Bachelor of Computer Science',
                    'institution' => 'Dhaka University',
                    'district' => 'Dhaka',
                    'city' => 'Dhaka',
                    'career_plan' => 'I want to pursue a Master\'s degree in Data Science abroad and work as a data scientist in international companies.',
                    'skill_level' => 'Advanced',
                    'native_language' => 'Bengali',
                    'interests' => ['programming', 'machine learning', 'travel', 'photography'],
                    'available_hours' => ['evening', 'night'],
                    'preferred_days' => ['weekdays'],
                    'is_online' => true,
                    'is_available' => true,
                ],
                'contacts' => [
                    ['platform' => 'whatsapp', 'value' => '8801712345678', 'is_public' => true],
                    ['platform' => 'telegram', 'value' => 'fatima_ahmed', 'is_public' => true],
                ]
            ],
            [
                'name' => 'Rashid Hasan',
                'email' => 'rashid.hasan@example.com',
                'profile' => [
                    'purpose_of_practice' => 'TOEFL',
                    'expected_score' => '95',
                    'education' => 'Master of Business Administration',
                    'institution' => 'BRAC University',
                    'district' => 'Chittagong',
                    'city' => 'Chittagong',
                    'career_plan' => 'Planning to apply for PhD in Economics at top US universities and become a professor.',
                    'skill_level' => 'Intermediate',
                    'native_language' => 'Bengali',
                    'interests' => ['economics', 'research', 'books', 'cricket'],
                    'available_hours' => ['morning', 'afternoon'],
                    'preferred_days' => ['weekends'],
                    'is_online' => false,
                    'is_available' => true,
                ],
                'contacts' => [
                    ['platform' => 'facebook', 'value' => 'https://facebook.com/rashid.hasan', 'is_public' => true],
                    ['platform' => 'email', 'value' => 'rashid.hasan@example.com', 'is_public' => false],
                ]
            ],
            [
                'name' => 'Nusrat Jahan',
                'email' => 'nusrat.jahan@example.com',
                'profile' => [
                    'purpose_of_practice' => 'Fluency',
                    'expected_score' => null,
                    'education' => 'Bachelor of English Literature',
                    'institution' => 'University of Rajshahi',
                    'district' => 'Rajshahi',
                    'city' => 'Rajshahi',
                    'career_plan' => 'Want to improve English fluency for better career opportunities in international NGOs.',
                    'skill_level' => 'Beginner',
                    'native_language' => 'Bengali',
                    'interests' => ['literature', 'social work', 'music', 'art'],
                    'available_hours' => ['afternoon', 'evening'],
                    'preferred_days' => ['weekdays', 'weekends'],
                    'is_online' => true,
                    'is_available' => true,
                ],
                'contacts' => [
                    ['platform' => 'whatsapp', 'value' => '8801912345678', 'is_public' => true],
                    ['platform' => 'telegram', 'value' => 'nusrat_jahan', 'is_public' => false],
                ]
            ],
            [
                'name' => 'Karim Uddin',
                'email' => 'karim.uddin@example.com',
                'profile' => [
                    'purpose_of_practice' => 'IELTS',
                    'expected_score' => '8.0',
                    'education' => 'Bachelor of Engineering',
                    'institution' => 'Bangladesh University of Engineering and Technology',
                    'district' => 'Dhaka',
                    'city' => 'Dhaka',
                    'career_plan' => 'Planning to migrate to Canada and work as a software engineer in tech companies.',
                    'skill_level' => 'Advanced',
                    'native_language' => 'Bengali',
                    'interests' => ['software development', 'gaming', 'football', 'technology'],
                    'available_hours' => ['evening', 'night'],
                    'preferred_days' => ['weekdays'],
                    'is_online' => true,
                    'is_available' => true,
                ],
                'contacts' => [
                    ['platform' => 'facebook', 'value' => 'https://facebook.com/karim.uddin', 'is_public' => true],
                    ['platform' => 'whatsapp', 'value' => '8801612345678', 'is_public' => true],
                ]
            ],
            [
                'name' => 'Sultana Begum',
                'email' => 'sultana.begum@example.com',
                'profile' => [
                    'purpose_of_practice' => 'Other',
                    'expected_score' => null,
                    'education' => 'Master of Public Health',
                    'institution' => 'Independent University Bangladesh',
                    'district' => 'Sylhet',
                    'city' => 'Sylhet',
                    'career_plan' => 'Want to work with international health organizations and improve communication skills.',
                    'skill_level' => 'Intermediate',
                    'native_language' => 'Bengali',
                    'interests' => ['public health', 'volunteering', 'cooking', 'gardening'],
                    'available_hours' => ['morning', 'afternoon'],
                    'preferred_days' => ['weekends'],
                    'is_online' => false,
                    'is_available' => true,
                ],
                'contacts' => [
                    ['platform' => 'email', 'value' => 'sultana.begum@example.com', 'is_public' => true],
                    ['platform' => 'telegram', 'value' => 'sultana_begum', 'is_public' => true],
                ]
            ],
            [
                'name' => 'Mohammad Ali',
                'email' => 'mohammad.ali@example.com',
                'profile' => [
                    'purpose_of_practice' => 'TOEFL',
                    'expected_score' => '100',
                    'education' => 'Bachelor of Medicine',
                    'institution' => 'Dhaka Medical College',
                    'district' => 'Dhaka',
                    'city' => 'Dhaka',
                    'career_plan' => 'Planning to specialize in cardiology and work in hospitals abroad.',
                    'skill_level' => 'Advanced',
                    'native_language' => 'Bengali',
                    'interests' => ['medicine', 'research', 'swimming', 'chess'],
                    'available_hours' => ['night'],
                    'preferred_days' => ['weekdays'],
                    'is_online' => true,
                    'is_available' => false,
                ],
                'contacts' => [
                    ['platform' => 'whatsapp', 'value' => '8801512345678', 'is_public' => false],
                    ['platform' => 'email', 'value' => 'mohammad.ali@example.com', 'is_public' => true],
                ]
            ]
        ];

        foreach ($usersData as $userData) {
            // Create user
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]);

            // Create speaking profile
            $profile = SpeakingProfile::create([
                'user_id' => $user->id,
                'last_active_at' => now(),
                ...$userData['profile']
            ]);

            // Create contact links
            foreach ($userData['contacts'] as $contact) {
                ContactLink::create([
                    'user_id' => $user->id,
                    'platform' => $contact['platform'],
                    'value' => $contact['value'],
                    'is_public' => $contact['is_public'],
                ]);
            }
        }
    }
}