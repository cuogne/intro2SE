import React from "react";
import { X } from "lucide-react";

interface TrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    trailerLink?: string;
    movieTitle?: string;
}

const TrailerModal: React.FC<TrailerModalProps> = ({ isOpen, onClose, trailerLink, movieTitle = "Movie" }) => {
    if (!isOpen) return null;

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        const videoId = match && match[2].length === 11 ? match[2] : null;
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-1">
                    <X className="w-6 h-6" />
                </button>
                {trailerLink ? (
                    <iframe
                        src={getYoutubeEmbedUrl(trailerLink)}
                        title={`${movieTitle} Trailer`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="flex items-center justify-center h-full text-white">Phim này chưa cập nhật Trailer</div>
                )}
            </div>
        </div>
    );
};

export default TrailerModal;
