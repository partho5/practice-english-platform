import React from "react";
import { Phone, Mail, Linkedin, Globe, Play, Volume2 } from 'lucide-react';
import {handleConnectRequest, isRequestSent} from "@/utils/speakingConnectHandler";
import {User} from "@/types/User";
import {usePage} from "@inertiajs/react";


type PartnerCardProps = {
    targetUser: User;
    userMyself: any,
    onContactClick: (user: User) => void;  // Changed from userId: number
    onFavoriteToggle: (userId: number) => void;
};

export default function PartnerCard({
                                        targetUser,
                                        userMyself,
                                        onContactClick,
                                        onFavoriteToggle
                                    }: PartnerCardProps) {

    const handleConnect = (targetUserId: number) => {
        handleConnectRequest(targetUserId, userMyself);
    };

    return (
        <div className="   p-0 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header Gradient */}
                    <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                    </div>

                    {/* Profile Section */}
                    <div className="relative px-2 pb-6">
                        <div className="flex justify-center -mt-16 mb-4">
                            <div className="relative">
                                <img
                                    src={targetUser.profile_picture || "/images/avatar-male.png"}
                                    alt="profile photo"
                                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                                />
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{targetUser.name}</h2>
                            {/*<div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">*/}
                            {/*    Study Partner*/}
                            {/*</div>*/}
                        </div>

                        {/* Media Section */}
                        {(targetUser.voice_intro_url || targetUser.youtube_video_url) && (
                            <div className="space-y-3 mb-6">
                                {targetUser.voice_intro_url && (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                                <Volume2 className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div className="text-sm font-semibold text-gray-700">Voice Introduction</div>
                                        </div>
                                        <audio controls className="w-full h-10">
                                            <source src={targetUser.voice_intro_url} type="audio/mpeg" />
                                            Your browser does not support audio.
                                        </audio>
                                    </div>
                                )}

                                {targetUser.youtube_video_url && (
                                    <a
                                        href={targetUser.youtube_video_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 bg-red-50 rounded-2xl p-4 border border-red-100 hover:bg-red-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                                            <Play className="w-5 h-5 text-white fill-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">Video Introduction</div>
                                            <div className="text-xs text-gray-600">Watch on YouTube</div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Info Cards */}
                        <div className="space-y-3 mb-6">
                            {targetUser.purpose_of_practice && (
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                                    <div className="text-xs font-semibold text-indigo-600  tracking-wider mb-1">Purpose</div>
                                    <div className="text-gray-800 text-sm leading-relaxed">{targetUser.purpose_of_practice}</div>
                                </div>
                            )}

                            {(targetUser.education || targetUser.institution) && (
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                                    <div className="text-xs font-semibold text-blue-600  tracking-wider mb-2">Education</div>
                                    <div className="space-y-1">
                                        {targetUser.education && (
                                            <div className="text-gray-800 text-sm font-medium">{targetUser.education}</div>
                                        )}
                                        {targetUser.institution && (
                                            <div className="text-gray-600 text-sm">{targetUser.institution}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {targetUser.career_plan && (
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                                    <div className="text-xs font-semibold text-purple-600  tracking-wider mb-1">Career Path</div>
                                    <div className="text-gray-800 text-sm leading-relaxed">{targetUser.career_plan}</div>
                                </div>
                            )}
                        </div>

                        {/* Contact Section */}
                        {targetUser.contact_links && Object.keys(targetUser.contact_links).length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                <div className="text-xs font-semibold text-gray-600  tracking-wider mb-3">Contact</div>
                                <div className="space-y-2">
                                    {Object.entries(targetUser.contact_links).map(([method, value]) =>
                                            value && (
                                                <div key={method} className="flex items-center gap-3 text-sm">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                                                        {method === 'email' && <Mail className="w-4 h-4 text-gray-600" />}
                                                        {method === 'phone' && <Phone className="w-4 h-4 text-gray-600" />}
                                                        {method === 'linkedin' && <Linkedin className="w-4 h-4 text-gray-600" />}
                                                        {!['email', 'phone', 'linkedin'].includes(method) && <Globe className="w-4 h-4 text-gray-600" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs text-gray-500 capitalize">{method}</div>
                                                        <div className="text-gray-800 font-medium truncate">{['whatsapp', 'email'].includes(method) ? value.substring(0, 5) + '...' : ['telegram', 'facebook'].includes(method) ? value.split('/').slice(0, -1).join('/') + '/' + value.split('/').pop().substring(0, 2) + '...' : value.substring(0, 20) + '...'}</div>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={() => handleConnect(targetUser.id)}
                            // disabled={isRequestSent(targetUser.id)}
                            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 active:scale-98">
                            Connect {targetUser.name.split(' ')[0]}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
