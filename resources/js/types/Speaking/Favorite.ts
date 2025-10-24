export interface Favorite {
    id: number;
    user_id: number;
    favorite_user_id: number;
    category: FavoriteCategory;
    notes?: string;
    created_at: string;
    updated_at: string;
    favorite_user?: UserWithProfile;
}

export type FavoriteCategory = 'general' | 'highly_compatible' | 'nearby' | 'recent' | 'custom';

export interface FavoriteFormData {
    category: FavoriteCategory;
    notes?: string;
}

export interface FavoriteFilters {
    category?: FavoriteCategory;
    search?: string;
}

export interface UserWithProfile {
    id: number;
    name: string;
    email: string;
    speaking_profile?: import('./Profile').SpeakingProfile;
    contact_links?: import('./Profile').ContactLink[];
    compatibility_score?: number;
    is_favorited?: boolean;
}
