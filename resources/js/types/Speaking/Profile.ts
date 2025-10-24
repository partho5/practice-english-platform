export interface SpeakingProfile {
    id: number;
    user_id: number;
    purpose_of_practice: PracticePurpose;
    expected_score?: string;
    education: string;
    institution: string;
    district: string;
    city: string;
    career_plan: string;
    profile_picture?: string;
    voice_intro_url?: string;
    youtube_video_url?: string;
    timezone?: string;
    available_hours?: string[];
    preferred_days?: string[];
    skill_level: SkillLevel;
    native_language?: string;
    interests?: string[];
    is_online: boolean;
    is_available: boolean;
    is_verified: boolean;
    last_active_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ContactLink {
    id: number;
    user_id: number;
    platform: ContactPlatform;
    value: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserWithProfile {
    id: number;
    name: string;
    email: string;
    speaking_profile?: SpeakingProfile;
    contact_links?: ContactLink[];
    compatibility_score?: number;
    is_favorited?: boolean;
}

export type PracticePurpose = 'IELTS' | 'TOEFL' | 'Fluency' | 'Other';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ContactPlatform = 'facebook' | 'whatsapp' | 'telegram' | 'email';

export interface ProfileFormData {
    purpose_of_practice: PracticePurpose;
    expected_score?: string;
    education: string;
    institution: string;
    district: string;
    city: string;
    career_plan: string;
    profile_picture?: string;
    voice_intro_url?: string;
    youtube_video_url?: string;
    timezone?: string;
    available_hours?: string[];
    preferred_days?: string[];
    skill_level: SkillLevel;
    native_language?: string;
    interests?: string[];
    is_online?: boolean;
    is_available?: boolean;
    contact_links?: ContactLinkFormData[];
}

export interface ContactLinkFormData {
    platform: ContactPlatform;
    value: string;
    is_public: boolean;
}

export interface ProfileFilters {
    purpose_of_practice?: PracticePurpose;
    skill_level?: SkillLevel;
    city?: string;
    district?: string;
    is_online?: boolean;
    is_verified?: boolean;
    interests?: string[];
}

export interface ProfileSearchOptions {
    sort_by?: 'relevance' | 'distance' | 'recent' | 'compatibility';
    show_online?: boolean;
    show_available?: boolean;
    show_verified?: boolean;
}

export interface CompletionData {
    percentage: number;
    points_earned: number;
    points_total: number;
    completed_fields: string[];
    missing_fields: string[];
    completion_level: 'excellent' | 'good' | 'fair' | 'poor' | 'minimal';
}
