// resources/js/Pages/Speaking/Requests.tsx

import { Head } from '@inertiajs/react';

export default function Requests() {
    return (
        <>
            <Head title="Speaking Requests" />

            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Speaking Practice Requests</h1>

                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <svg
                            className="w-16 h-16 mx-auto mb-4 text-gray-400"
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

                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            No Requests Yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            When someone sends you a speaking practice request, it will appear here.
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Tip:</strong> Make sure you've enabled notifications to receive connection requests instantly!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
