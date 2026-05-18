'use client';
import { useState, useRef } from 'react';

export default function AudioPlayer({ src }: { src: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
  };

  return (
    <div className="flex items-center gap-3 bg-zinc-800 rounded-full px-4 py-3">
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0 hover:bg-pink-400 transition-colors"
      >
        {isPlaying ? (
          <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-3 h-3 fill-white ml-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div className="flex-1 bg-zinc-700 rounded-full h-1.5">
        <div
          className="bg-pink-500 h-1.5 rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-zinc-400 text-xs flex-shrink-0">语音介绍</span>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => { setIsPlaying(false); setProgress(0); }}
      />
    </div>
  );
}
