// resources/js/Pages/Speaking/Partners.tsx

import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PartnerCard from '@/Components/Speaking/PartnerCard';

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
    sentRequests: Partner[];
    receivedRequests: Partner[];
    favorites: Partner[];
    activeTab?: 'sent' | 'received' | 'favorites';
}

type TabType = 'sent' | 'received' | 'favorites';

export default function Partners({ sentRequests, receivedRequests, favorites, activeTab: initialTab = 'received' }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);

    // Update active tab when URL changes
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        // Update URL without full page reload
        router.visit(`/speaking/partners/${tab}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const tabs: { key: TabType; label: string; count: number; data: Partner[] }[] = [
        { key: 'received', label: 'Received', count: receivedRequests.length, data: receivedRequests },
        { key: 'sent', label: 'Sent', count: sentRequests.length, data: sentRequests },
        { key: 'favorites', label: 'Favorites', count: favorites.length, data: favorites },
    ];

    const activeData = tabs.find(tab => tab.key === activeTab)?.data || [];

    return (
        <>
            <Head title="Speaking Partners" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <a href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Home
                        </a>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            My Partners
                        </h1>
                    </div>

                    {/* Mobile-First Tabs */}
                    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
                        <div className="flex overflow-x-auto scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                    className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium text-center transition-colors relative
                                        ${activeTab === tab.key
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex flex-col items-center space-y-1">
                                        <span>{tab.label}</span>
                                        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full
                                            ${activeTab === tab.key
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    </div>
                                    {activeTab === tab.key && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-4">
                        {activeData.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    No {activeTab === 'sent' ? 'Sent Requests' : activeTab === 'received' ? 'Received Requests' : 'Favorites'} Yet
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {activeTab === 'sent' && 'You haven\'t sent any connection requests yet.'}
                                    {activeTab === 'received' && 'No one has sent you a connection request yet.'}
                                    {activeTab === 'favorites' && 'You haven\'t added anyone to your favorites yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {activeData.map((partner) => (
                                    <PartnerCard key={`${partner.partner_type}-${partner.id}`} partner={partner} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
