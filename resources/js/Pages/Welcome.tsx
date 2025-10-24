import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { User } from '@/types/User';
import Navbar from '@/Components/Navbar';
import PartnerCard from '@/Components/Speaking/Partners/PartnerCard';
import {useEffect} from "react";
import {initOneSignal} from "@/utils/speakingOneSignal";
import {handleConnectRequest} from "@/utils/speakingConnectHandler";
import NotificationBanner from "@/Components/Speaking/NotificationBanner";

interface WelcomePageProps extends PageProps {
    users: User[];
    hasSubscriptions: boolean;
}

export default function Welcome({ auth, users, hasSubscriptions  }: WelcomePageProps) {
    useEffect(() => {
        // Initialize OneSignal on page load
        const ONESIGNAL_APP_ID = '35167c0c-b200-4d42-aff8-75731c633d22';
        initOneSignal(ONESIGNAL_APP_ID);
    }, []);

    const handleConnect = (userId: number) => {
        handleConnectRequest(userId);
    };
    const handleContactClick = (user: User) => {
        // This will be handled by the PartnerCard component
        console.log('Contact clicked for user:', user.name);
    };

    const handleFavoriteToggle = (userId: number) => {
        // This will be handled by the PartnerCard component
        console.log('Favorite toggled for user:', userId);
    };

    //console.log('users', users);

    return (
        <>
            <Head title="Practice English - Find Speaking Partners" />

            {/* Show banner if user hasn't subscribed */}
            <NotificationBanner hasSubscriptions={hasSubscriptions} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-100 to-purple-100">
                <Navbar auth={auth} />

                <main className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-8 py-8 ">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Find Your Perfect Speaking Partner
                        </h1>
                    </div>

                    {/* Users Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {users.map((user) => (
                            <PartnerCard
                                key={user.id}
                                user={user}
                                onContactClick={handleContactClick}
                                onFavoriteToggle={handleFavoriteToggle}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Be the first to join our community of English learners.
                                        </p>
                                    </div>
                    )}
                        </main>
            </div>
        </>
    );
}
