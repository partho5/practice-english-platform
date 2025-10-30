import React, { useState } from 'react';

export default function SpeakingHintsSection() {
    const passages = [
        `Every morning, I start my day with a cup of tea and some light exercise. It helps me stay focused and positive throughout the day. After that, I plan my work tasks carefully to manage time effectively.`,
        `Technology has completely changed the way we live and communicate. I can now work with people from different countries without leaving home. However, I think we should also learn to disconnect and spend time offline.`,
        `Last year, I visited a hill station with my friends. The fresh air and peaceful scenery made me feel relaxed and happy. Traveling always helps me learn more about different cultures and lifestyles.`,
        `Education plays a vital role in shaping our future. I want to continue improving my English so I can study abroad. Good communication skills can open many doors for career success.`,
        `One of my favorite hobbies is reading motivational books. They inspire me to think positively and work harder every day. I believe a good book can change the way you see the world.`,
    ];

    const [showHints, setShowHints] = useState(false);
    const [hint, setHint] = useState('');

    const handleClickSpeakingHints = () => {
        const randomHint = passages[Math.floor(Math.random() * passages.length)];
        setHint(randomHint);
        setShowHints(!showHints);
    };

    return (
        <div className="my-2">
            <button
                onClick={handleClickSpeakingHints}
                className="relative px-6 py-2.5 text-sm font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.85) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(59, 130, 246, 0.85) 100%)',
                    border: '2px solid',
                    borderImageSlice: 1,
                    borderImageSource: 'linear-gradient(135deg, #db2777 0%, #7c3aed 50%, #2563eb 100%)',
                }}
            >
                <span className="relative z-10 drop-shadow-sm">
                    ✨ Get Hints
                </span>
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
                    style={{
                        background: 'radial-gradient(circle at center, white 0%, transparent 70%)'
                    }}
                />
            </button>

            {showHints && (
                <p className="mt-2 mb-4 text-gray-700 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-purple-200">
                    {hint}
                </p>
            )}
        </div>
    );
}
