import { useState } from 'react';
import { UserCardProps } from '@/types/User';
import AudioPlayer from "@/Components/Speaking/Shared/AudioPlayer";
import YouTubeEmbed from "@/Components/Speaking/Shared/YouTubeEmbed";

export default function UserCard({ user, isAuthenticated, onContactClick }: UserCardProps) {
    const [showContact, setShowContact] = useState(false);

    const handleContactClick = () => {
        if (!isAuthenticated) {
            // Redirect to login page
            window.location.href = route('login');
            return;
        }

        if (showContact) {
            setShowContact(false);
        } else {
            onContactClick(user);
            setShowContact(true);
        }
    };

    const getPurposeBadgeColor = (purpose: string) => {
        switch (purpose) {
            case 'IELTS':
                return 'bg-blue-100 text-blue-800';
            case 'TOEFL':
                return 'bg-green-100 text-green-800';
            case 'Fluency':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Header with Profile Picture and Basic Info */}
            <div className="p-6 pb-4">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        {user.profile_picture ? (
                            <img
                                src={user.profile_picture}
                                alt={user.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                        <div className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPurposeBadgeColor(user.purpose_of_practice)}`}>
                                {user.purpose_of_practice}
                            </span>
                        </div>
                        {user.expected_score && (
                            <p className="text-sm text-gray-600 mt-1">Expected Score: {user.expected_score}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Education & Location */}
            <div className="px-6 py-2">
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" clipRule="evenodd" />
                        </svg>
                        <span>{user.education}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{user.district}, {user.city}</span>
                    </div>
                </div>
            </div>

            {/* Career Plan */}
            <div className="px-6 py-2">
                <p className="text-sm text-gray-700 line-clamp-3">{user.career_plan}</p>
            </div>

            {/* Audio Player */}
            {user.voice_intro_url && (
                <div className="px-6 py-2">
                    <AudioPlayer src={user.voice_intro_url} />
                </div>
            )}

            {/* YouTube Video */}
            {user.youtube_video_url && (
                <div className="px-6 py-2">
                    <YouTubeEmbed videoUrl={user.youtube_video_url} />
                </div>
            )}

            {/* Contact Section */}
            <div className="px-6 py-4 bg-gray-50 border-t">
                {showContact && isAuthenticated ? (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                        <div className="flex flex-wrap gap-2">
                            {user.contact_links.facebook && (
                                <a
                                    href={user.contact_links.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    Facebook
                                </a>
                            )}
                            {user.contact_links.whatsapp && (
                                <a
                                    href={`https://wa.me/${user.contact_links.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                    </svg>
                                    WhatsApp
                                </a>
                            )}
                            {user.contact_links.telegram && (
                                <a
                                    href={`https://t.me/${user.contact_links.telegram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                    </svg>
                                    Telegram
                                </a>
                            )}
                        </div>
                        <button
                            onClick={() => setShowContact(false)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Hide contact
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleContactClick}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        {isAuthenticated ? 'View Contact' : 'Sign up to view contact'}
                    </button>
                )}
            </div>
        </div>
    );
}
