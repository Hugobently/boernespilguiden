'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
}

/**
 * Extract video ID from YouTube or Vimeo URL
 */
function getVideoEmbedUrl(url: string): { embedUrl: string; type: 'youtube' | 'vimeo' | 'direct' } | null {
  // YouTube patterns
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`,
      type: 'youtube'
    };
  }

  // Vimeo patterns
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);

  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      type: 'vimeo'
    };
  }

  // Direct video URL (mp4, webm, etc.)
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return {
      embedUrl: url,
      type: 'direct'
    };
  }

  return null;
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoData = getVideoEmbedUrl(url);

  if (!videoData) {
    return null;
  }

  return (
    <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-[#A2D2FF]/30 to-[#CDB4DB]/30 shadow-lg">
      {!isPlaying && (
        // Thumbnail with play button
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center group cursor-pointer z-10"
          aria-label="Afspil video"
        >
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

          {/* Play button */}
          <div className="relative z-20 w-20 h-20 rounded-full bg-white/95 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <svg
              className="w-10 h-10 text-[#4A4A4A] ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          {/* Label */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white z-20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-sm">Se gameplay video</span>
          </div>
        </button>
      )}

      {isPlaying && videoData.type !== 'direct' && (
        // Embedded iframe for YouTube/Vimeo
        <iframe
          src={videoData.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}

      {isPlaying && videoData.type === 'direct' && (
        // HTML5 video for direct URLs
        <video
          src={videoData.embedUrl}
          controls
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
