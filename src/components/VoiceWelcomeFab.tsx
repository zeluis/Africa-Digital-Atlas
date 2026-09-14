import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { speakAfricaliaGreeting, stopAfricaliaSpeech } from '../utils/africaliaVoiceEngine';

interface VoiceWelcomeFabProps {
  text: string;
  langTag?: string;
  tooltip?: string;
  subtitle?: string;
  variant?: 'fab' | 'navbar' | 'inline';
  languageName?: string;
  ariaLabel?: string;
  className?: string;
}

export const VoiceWelcomeFab: React.FC<VoiceWelcomeFabProps> = ({
  text,
  langTag,
  tooltip,
  subtitle,
  variant = 'fab',
  languageName,
  ariaLabel,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up on unmount if playing
      if (isPlaying) {
        stopAfricaliaSpeech();
      }
    };
  }, [isPlaying]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering parent card clicks

    if (isPlaying) {
      stopAfricaliaSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speakAfricaliaGreeting({
      text,
      langTag,
      languageName,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  if (variant === 'navbar') {
    return (
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 select-none ${
            isPlaying
              ? 'bg-emerald-500/20 dark:bg-emerald-500/30 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-md ring-2 ring-emerald-500/30 animate-pulse'
              : 'bg-zinc-100/90 dark:bg-zinc-900/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400'
          } ${className}`}
          title={tooltip || (isPlaying ? 'Stop Voice Welcome' : 'Listen to Africalia Welcome in current language')}
          aria-label={ariaLabel || 'Play warm African female welcome greeting'}
        >
          {isPlaying ? (
            <div className="flex items-center gap-1">
              <span className="flex items-end gap-0.5 h-3.5 w-3.5">
                <span className="w-0.5 h-3 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 h-4 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="hidden xl:inline text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                Playing
              </span>
            </div>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xl:inline text-[11px] font-medium">
                Welcome Audio
              </span>
            </>
          )}
        </button>

        {/* Floating Active Voice Toast Banner when speaking */}
        {isPlaying && (
          <div className="absolute top-full mt-2 right-0 z-50 min-w-[280px] max-w-sm p-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md text-left transition-all animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>AFRICALIA FEMALE VOICE (MID 30's)</span>
              </div>
              <button
                type="button"
                onClick={handleTogglePlay}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                title="Stop Audio"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="mt-1 text-xs font-serif italic text-zinc-800 dark:text-zinc-100 leading-snug">
              "{text}"
            </p>
            {languageName && (
              <div className="mt-1.5 pt-1.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                <span>Language: {languageName}</span>
                <span className="text-emerald-600 dark:text-emerald-400">● Warm & Inviting Accent</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Standard Modern and Polished Floating Action Button (FAB) on Language Family Cards
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`group/fab relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
          isPlaying
            ? 'bg-gradient-to-tr from-emerald-600 to-amber-500 text-white shadow-emerald-600/30 scale-105 ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-zinc-950'
            : 'bg-white/90 dark:bg-zinc-900/90 hover:bg-emerald-500 dark:hover:bg-emerald-600 text-zinc-700 dark:text-zinc-200 hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 hover:shadow-lg'
        }`}
        title={tooltip || 'Listen to authentic greeting: "Welcome to Africalia—The Atlantic Ethnic Explorer. Please enjoy."'}
        aria-label={ariaLabel || `Listen to welcome greeting in ${languageName || 'indigenous language'}`}
      >
        {isPlaying ? (
          <span className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        ) : (
          <Volume2 className="w-4 h-4 transition-transform group-hover/fab:scale-110" />
        )}

        {/* Subtle glowing halo when idle on hover */}
        <span className="absolute inset-0 rounded-full bg-emerald-500/20 opacity-0 group-hover/fab:opacity-100 transition-opacity blur-xs pointer-events-none" />
      </button>

      {/* Floating phonetic and meaning toast if speaking on card */}
      {isPlaying && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute z-40 -bottom-20 right-0 sm:right-auto sm:left-0 min-w-[240px] max-w-xs p-2.5 rounded-2xl bg-zinc-950/95 dark:bg-zinc-900/95 text-white border border-emerald-500/40 shadow-xl text-left backdrop-blur-md animate-in fade-in zoom-in-95"
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
            <span>{languageName || 'Indigenous Phylum Greeting'}</span>
            <span className="cursor-pointer text-zinc-400 hover:text-white" onClick={handleTogglePlay}>Stop</span>
          </div>
          <p className="text-xs font-serif font-semibold text-emerald-200 mt-0.5 leading-tight">
            "{text}"
          </p>
          {subtitle && (
            <p className="text-[10px] text-zinc-400 italic mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
