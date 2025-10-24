import { useState } from 'react';
interface YouTubeEmbedProps {
    videoUrl: string;
    className?: string;
}

export default function YouTubeEmbed({ videoUrl, className = '' }: YouTubeEmbedProps) {
    const [isLoading, setIsLoading] = useState(true);

    // Extract video ID from various YouTube URL formats
    const getVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getVideoId(videoUrl);
    
    if (!videoId) {
        return (
            <div className={`bg-gray-100 rounded-lg p-4 text-center text-gray-500 ${className}`}>
                <p>Invalid YouTube URL</p>
            </div>
        );
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
            
            <iframe
                className="w-full h-48 sm:h-56 lg:h-48"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                style={{ display: isLoading ? 'none' : 'block' }}
            />
        </div>
    );
}
