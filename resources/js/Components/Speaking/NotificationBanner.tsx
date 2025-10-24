// resources/js/Components/Speaking/NotificationBanner.tsx

import { useState } from 'react';
import {subscribeToOneSignal} from "@/utils/speakingOneSignal";

interface NotificationBannerProps {
    hasSubscriptions: boolean;
}

export default function NotificationBanner({ hasSubscriptions }: NotificationBannerProps) {
    const [isVisible, setIsVisible] = useState(!hasSubscriptions);
    const [isLoading, setIsLoading] = useState(false);

    if (!isVisible) return null;

    const handleAllow = async () => {
        setIsLoading(true);
        try {
            const success = await subscribeToOneSignal();
            if (success) {
                setIsVisible(false);
                window.location.reload(); // Refresh to update hasSubscriptions
            } else {
                alert('Failed to enable notifications. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to enable notifications. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLater = () => {
        setIsVisible(false);
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-200 text-gray-900 shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <svg
                            className="w-6 h-6 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                        </svg>
                        <p className="text-sm md:text-base">
                            To connect with others
                            <strong className="mx-1">Enable</strong>
                            notifications
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleAllow}
                            disabled={isLoading}
                            className="px-4 py-2 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100 transition disabled:opacity-50"
                        >
                            {isLoading ? 'Enabling...' : 'Enable'}
                        </button>
                        <button
                            onClick={handleLater}
                            disabled={isLoading}
                            className="px-4 py-2 bg-transparent border border-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
