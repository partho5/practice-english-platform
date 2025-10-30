import { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {statusLabels} from "@/Pages/Speaking/SpeakingData";
import {getAvailableStatusLabels} from "@/utils/speakingConnectHandler";

interface Partner {
    id: number;
    name: string;
    profile_picture: string;
    voice_intro_url: string;
    purpose_of_practice: string;
    education: string;
    institution: string;
    district: string;
    city: string;
    expected_score: string;
    career_plan: string;
    youtube_video_url: string;
    contact_links: Record<string, string>;
    connection_status: string | null;
    connection_id: number | null;
    partner_type: 'sent_request' | 'received_request' | 'favorite';
    request_message?: string;
    request_date?: string;
    favorite_category?: string;
    favorite_notes?: string;
    favorite_date?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    partner: Partner;
    activeTab: string;
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    connected: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};


export default function PartnerCard({ partner, activeTab }: Props) {
    const [connectionStatus, setConnectionStatus] = useState(partner.connection_status);
    const [connectionId, setConnectionId] = useState(partner.connection_id);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSendingRequest, setIsSendingRequest] = useState(false);

    const availableStatuses = getAvailableStatusLabels(activeTab, partner.connection_status);

    const handleStatusChange = async (newStatus: string) => {
        if (!connectionId) return;

        setIsUpdating(true);
        try {
            await axios.patch(`/speaking/connections/${connectionId}/status`, {
                status: newStatus,
            });
            setConnectionStatus(newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update connection status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSendRequest = async () => {
        setIsSendingRequest(true);
        try {
            const response = await axios.post(`/speaking/partners/view/${partner.id}/connect`);

            if (response.data.success) {
                // Update local state
                setConnectionId(response.data.connection.id);
                setConnectionStatus(response.data.connection.status);

                // Show success message
                alert(response.data.message);

                // Reload page to update tabs
                router.reload();
            }
        } catch (error: any) {
            console.error('Failed to send connection request:', error);
            const errorMessage = error.response?.data?.error || 'Failed to send connection request. Please try again.';
            alert(errorMessage);
        } finally {
            setIsSendingRequest(false);
        }
    };

    const getPartnerTypeLabel = () => {
        switch (partner.partner_type) {
            case 'sent_request':
                return 'Sent Request';
            case 'received_request':
                return 'Received Request';
            case 'favorite':
                return 'Favorite';
            default:
                return '';
        }
    };

    const getPartnerTypeBadgeColor = () => {
        switch (partner.partner_type) {
            case 'sent_request':
                return 'bg-blue-100 text-blue-800';
            case 'received_request':
                return 'bg-purple-100 text-purple-800';
            case 'favorite':
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Partner Type Badge */}
            <div className="px-4 pt-3 pb-2">
                <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getPartnerTypeBadgeColor()}`}>
                    {getPartnerTypeLabel()}
                </span>
            </div>

            {/* Profile Picture */}
            <div className="px-4 pb-3 flex items-center space-x-3">
                <div className="flex-shrink-0">
                    {partner.profile_picture ? (
                        <img
                            src={partner.profile_picture}
                            alt={partner.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
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
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{partner.name}</h3>
                    <p className="text-sm text-gray-600">{partner.purpose_of_practice}</p>
                </div>
            </div>

            {/* Connect Button (only for favorites without connection) */}
            {partner.partner_type === 'favorite' && !connectionId && (
                <div className="px-4 pb-3">
                    <button
                        onClick={handleSendRequest}
                        disabled={isSendingRequest}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            isSendingRequest
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {isSendingRequest ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Sending...
                            </span>
                        ) : (
                            'Send Connection Request'
                        )}
                    </button>
                </div>
            )}

            {/* Connection Status Dropdown (only if connection exists) */}
            {connectionId && (
                <div className="px-4 pb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Connection Status</label>

                    <select
                        value={connectionStatus || 'pending'}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isUpdating}
                        className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            connectionStatus ? statusColors[connectionStatus as keyof typeof statusColors] : ''
                        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {Object.entries(availableStatuses).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* User Info */}
            <div className="px-4 pb-3 space-y-2 text-sm">
                {partner.education && (
                    <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-gray-700">{partner.education}</p>
                            {partner.institution && <p className="text-gray-500 text-xs">{partner.institution}</p>}
                        </div>
                    </div>
                )}

                {(partner.city || partner.district) && (
                    <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-gray-700">
                            {partner.district && partner.city ? `${partner.district}, ${partner.city}` : partner.city || partner.district}
                        </p>
                    </div>
                )}

                {partner.expected_score && (
                    <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="text-gray-700">Target Score: {partner.expected_score}</p>
                    </div>
                )}
            </div>

            {/* Voice Introduction */}
            {partner.voice_intro_url && (
                <div className="px-4 pb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Voice Introduction</label>
                    <audio controls className="w-full h-10">
                        <source src={partner.voice_intro_url} type="audio/mpeg" />
                        Your browser does not support audio.
                    </audio>
                </div>
            )}

            {/* Contact Links */}
            {Object.keys(partner.contact_links || {}).length > 0 && (
                <div className="px-4 pb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Contact</label>
                    <div>
                        {activeTab == 'sent' &&
                        <span className="text-amber-600">You can contact them after they accept request</span>
                        }
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {activeTab !== 'sent' && Object.entries(partner.contact_links).map(([platform, value]) => (
                            <a
                                key={platform}
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                {platform === 'facebook' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                )}
                                {platform === 'whatsapp' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                )}
                                {platform === 'telegram' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                    </svg>
                                )}
                                {platform === 'email' && (
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                )}
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Request Message (if exists) */}
            {partner.request_message && (
                <div className="px-4 pb-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">{partner.request_message}</p>
                </div>
            )}

            {/* Footer with Date */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                    {partner.partner_type === 'favorite' && partner.favorite_date && `Added on ${new Date(partner.favorite_date).toLocaleDateString()}`}
                    {partner.partner_type !== 'favorite' && partner.request_date && `Requested on ${new Date(partner.request_date).toLocaleDateString()}`}
                </p>
            </div>
        </div>
    );
}
