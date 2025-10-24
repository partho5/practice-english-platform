export interface User {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    purpose_of_practice: PracticePurpose;
    education: string;
    institution: string;
    district: string;
    city: string;
    expected_score?: string;
    career_plan: string;
    voice_intro_url?: string;
    youtube_video_url?: string;
    contact_links: ContactLinks;
    created_at: string;
    updated_at: string;
}

export interface ContactLinks {
    facebook?: string;
    whatsapp?: string;
    telegram?: string;
}

export type PracticePurpose = 'IELTS' | 'TOEFL' | 'Fluency' | 'Other';

export interface UserCardProps {
    user: User;
    isAuthenticated: boolean;
    onContactClick: (user: User) => void;
}

export interface AudioPlayerProps {
    src: string;
    className?: string;
}

export interface YouTubeEmbedProps {
    videoUrl: string;
    className?: string;
}
