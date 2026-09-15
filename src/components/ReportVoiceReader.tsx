import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { speakAfricaliaGreeting, stopAfricaliaSpeech } from '../utils/africaliaVoiceEngine';
import { useTranslation } from '../i18n/LanguageContext';

export interface ReportVoiceReaderProps {
  title: string;
  abstractOrSummary: string;
  sections?: Array<{ id: string; title: string; content: string }>;
  langTag?: string;
  className?: string;
}

export const ReportVoiceReader: React.FC<ReportVoiceReaderProps> = ({
  title,
  abstractOrSummary,
  sections = [],
  langTag,
  className = ''
}) => {
  const { language } = useTranslation();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mode, setMode] = useState<'summary' | 'full'>('summary');
  const [activeVoicePrompt, setActiveVoicePrompt] = useState<string>('');

  const targetLang = langTag || language;

  useEffect(() => {
    return () => {
      stopAfricaliaSpeech();
    };
  }, []);

  const buildFullSpeechText = () => {
    if (mode === 'summary') {
      return `${title}. Executive Overview: ${abstractOrSummary}`;
    }
    
    let text = `${title}. Executive Overview: ${abstractOrSummary}. `;
    sections.slice(0, 4).forEach((sec) => {
      text += ` ${sec.title}. ${sec.content} `;
    });
    return text;
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAfricaliaSpeech();
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    const fullText = buildFullSpeechText();
    setActiveVoicePrompt(title);
    setIsPlaying(true);
    setIsPaused(false);

    speakAfricaliaGreeting({
      text: fullText,
      langTag: targetLang,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
      }
    });
  };

  const handleStop = () => {
    stopAfricaliaSpeech();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 backdrop-blur-md shadow-xs ${className}`}
      id="report-voice-reader-toolbar"
    >
      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
          isPlaying
            ? 'bg-amber-600 text-white border-amber-700 shadow-xs ring-2 ring-amber-400/40'
            : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
        }`}
        title={isPlaying ? 'Stop voice reading' : 'Listen to report narration'}
        aria-label="Toggle voice reading for report"
      >
        {isPlaying ? (
          <>
            <div className="flex items-end gap-0.5 h-3.5 w-3.5">
              <span className="w-0.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
              <span className="w-0.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s] h-2/3" />
              <span className="w-0.5 bg-white rounded-full animate-bounce h-full" />
            </div>
            <span className="text-[11px] font-mono tracking-tight">Narrating</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px]">Listen</span>
          </>
        )}
      </button>

      {/* Scope Selector: Summary vs Full */}
      <div className="hidden sm:flex items-center bg-stone-200/70 dark:bg-stone-800 rounded-lg p-0.5 text-[10px] font-mono">
        <button
          type="button"
          onClick={() => {
            if (isPlaying) handleStop();
            setMode('summary');
          }}
          className={`px-2 py-0.5 rounded-md transition-all ${
            mode === 'summary'
              ? 'bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-bold shadow-2xs'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Summary
        </button>
        {sections.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (isPlaying) handleStop();
              setMode('full');
            }}
            className={`px-2 py-0.5 rounded-md transition-all ${
              mode === 'full'
                ? 'bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-bold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Key Treatises
          </button>
        )}
      </div>

      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Stop narration"
          aria-label="Stop narration"
        >
          <VolumeX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
