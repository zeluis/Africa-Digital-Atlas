import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  Languages, 
  Info,
  Radio,
  Sliders,
  Globe2,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { 
  AFRICAN_MOTHER_TONGUES, 
  MotherTongueEntry, 
  MotherTongueSyllable, 
  playMotherTongueAudio 
} from '../data/motherTonguesAudioData';
import { getBestSystemVoice } from '../utils/africaliaVoiceEngine';

interface MotherTonguesWaveformScrubberProps {
  initialLanguageId?: string;
  className?: string;
  onSelectLanguage?: (langId: string) => void;
}

export const MotherTonguesWaveformScrubber: React.FC<MotherTonguesWaveformScrubberProps> = ({
  initialLanguageId = 'yoruba',
  className = '',
  onSelectLanguage
}) => {
  const [selectedLangId, setSelectedLangId] = useState<string>(initialLanguageId);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0.0 to 1.0
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5, 0.75, 1.0
  const [hoveredFraction, setHoveredFraction] = useState<number | null>(null);

  const activeEntry: MotherTongueEntry = AFRICAN_MOTHER_TONGUES[selectedLangId] || AFRICAN_MOTHER_TONGUES.yoruba;
  const duration = activeEntry.durationSeconds || 3.0;
  const waveform = activeEntry.waveformProfile || Array.from({ length: 48 }, (_, i) => 0.2 + 0.6 * Math.sin(i * 0.25));

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const startProgressRef = useRef<number>(0);
  const waveformContainerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play a quick resonant micro-chime on scrub
  const playScrubMicroChime = useCallback((fraction: number) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const harmonics = activeEntry.tonalHarmonics || [440, 554, 659];
      const harmonicIndex = Math.min(harmonics.length - 1, Math.floor(fraction * harmonics.length));
      const freq = harmonics[harmonicIndex];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // Ignore user gesture restrictions
    }
  }, [activeEntry]);

  // Clean speech synthesis & animation loop
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const handleStartPlay = useCallback((fromFraction = progress >= 0.98 ? 0 : progress) => {
    stopAudio();
    setIsPlaying(true);
    setProgress(fromFraction);
    startProgressRef.current = fromFraction;
    startTimeRef.current = performance.now();

    // Trigger Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(activeEntry.greetingText);
      const { voice, langCode } = getBestSystemVoice(activeEntry.bcp47Tag);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = langCode;
      }
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(1.0);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }

    // Also trigger complementary acoustic chord
    if (fromFraction < 0.1) {
      playMotherTongueAudio(activeEntry);
    }

    // Animation progress loop
    const totalDurationMs = (duration * 1000) / playbackSpeed;
    const remainingDurationMs = totalDurationMs * (1 - fromFraction);

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTimeRef.current;
      const currentFrac = Math.min(1.0, fromFraction + elapsed / totalDurationMs);
      setProgress(currentFrac);

      if (currentFrac < 1.0) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
        setProgress(1.0);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [activeEntry, duration, playbackSpeed, progress, stopAudio]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      handleStartPlay();
    }
  };

  const handleReset = () => {
    stopAudio();
    setProgress(0);
  };

  // Scrubber mouse/touch drag handlers
  const handleScrubMove = useCallback((clientX: number) => {
    if (!waveformContainerRef.current) return;
    const rect = waveformContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const frac = Math.max(0, Math.min(1, x / rect.width));
    setProgress(frac);
    playScrubMicroChime(frac);
  }, [playScrubMicroChime]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    if (isPlaying) stopAudio();
    handleScrubMove(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isScrubbing) {
      handleScrubMove(e.clientX);
    } else if (waveformContainerRef.current) {
      const rect = waveformContainerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientXFraction(e.clientX, rect)));
      setHoveredFraction(x);
    }
  };

  const clientXFraction = (clientX: number, rect: DOMRect) => {
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isScrubbing) {
      setIsScrubbing(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  // Syllable jump
  const handleJumpToSyllable = (syllable: MotherTongueSyllable) => {
    stopAudio();
    setProgress(syllable.startFraction);
    playScrubMicroChime(syllable.startFraction);
    handleStartPlay(syllable.startFraction);
  };

  // Change language
  const handleSelectLanguage = (langId: string) => {
    stopAudio();
    setSelectedLangId(langId);
    setProgress(0);
    onSelectLanguage?.(langId);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // Current active syllable
  const currentSyllable = activeEntry.syllables?.find(
    s => progress >= s.startFraction && progress <= s.endFraction
  ) || activeEntry.syllables?.[activeEntry.syllables.length - 1];

  const currentTime = (progress * duration).toFixed(1);
  const totalTime = duration.toFixed(1);

  return (
    <div className={`rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/50 dark:from-emerald-950/40 dark:via-zinc-950 dark:to-zinc-900/60 p-5 sm:p-7 shadow-xl backdrop-blur-md space-y-6 ${className}`}>
      {/* Header with Title and Language Family Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/60 dark:border-emerald-900/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-bold tracking-wide">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              MOTHER TONGUES PHONETIC WAVEFORM
            </span>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              Web Audio &amp; Native Synthesis
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Acoustic Waveform &amp; Syllable Scrubber
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Explore authentic vocal intonation, tonal cadences, and phonetic morphemes across continental African mother tongues. Scrub across the waveform to preview individual syllables and tone heights.
          </p>
        </div>

        {/* Playback speed controls */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-white/80 dark:bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <span className="text-[10px] font-mono text-zinc-500 uppercase px-2 font-bold">Speed:</span>
          {[0.5, 0.75, 1.0].map(speed => (
            <button
              key={speed}
              type="button"
              onClick={() => {
                setPlaybackSpeed(speed);
                if (isPlaying) {
                  handleStartPlay(progress);
                }
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                playbackSpeed === speed
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-300'
              }`}
            >
              {speed}×
            </button>
          ))}
        </div>
      </div>

      {/* Mother Tongue Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.values(AFRICAN_MOTHER_TONGUES).map(lang => {
          const isSelected = lang.id === selectedLangId;
          return (
            <button
              key={lang.id}
              type="button"
              onClick={() => handleSelectLanguage(lang.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20 scale-[1.02]'
                  : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              <span className="font-bold">{lang.language}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {lang.autonym}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Language Greeting Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/90 dark:bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-emerald-500/20 shadow-xs">
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {activeEntry.family}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">
              {activeEntry.country}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-500">
              BCP-47: {activeEntry.bcp47Tag}
            </span>
          </div>

          <div className="flex items-baseline gap-3 pt-1">
            <h4 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950 dark:text-white tracking-tight">
              "{activeEntry.greetingText}"
            </h4>
            <span className="font-mono text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              {activeEntry.greetingPhonetic}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 italic font-medium">
            Meaning: "{activeEntry.greetingMeaning}"
          </p>
        </div>

        {/* Ancestral Proverb Capsule */}
        <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex flex-col justify-between text-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-amber-600" />
            Indigenous Proverb
          </span>
          <p className="font-serif font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm my-1">
            "{activeEntry.proverbText}"
          </p>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            {activeEntry.proverbTranslation}
          </p>
        </div>
      </div>

      {/* Main Interactive Waveform Display & Scrubbing Track */}
      <div className="space-y-3 bg-white/95 dark:bg-zinc-900/95 p-4 sm:p-6 rounded-2xl border border-emerald-500/30 shadow-md">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-emerald-900 dark:text-emerald-200">
              Interactive Waveform Canvas
            </span>
            <span className="text-[10px] text-zinc-400 hidden sm:inline">
              (Click or drag to scrub playhead)
            </span>
          </div>

          {/* Time indicator */}
          <div className="flex items-center gap-1.5 font-bold font-tabular tabular-nums">
            <span className="text-emerald-600 dark:text-emerald-400">{currentTime}s</span>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500">{totalTime}s</span>
          </div>
        </div>

        {/* Waveform Bars Container */}
        <div
          ref={waveformContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onMouseLeave={() => setHoveredFraction(null)}
          className="relative h-28 sm:h-32 w-full bg-gradient-to-b from-zinc-50 to-zinc-100/80 dark:from-zinc-950 dark:to-zinc-900 rounded-xl p-3 flex items-center justify-between gap-1 cursor-pointer select-none overflow-hidden border border-zinc-200/90 dark:border-zinc-800"
        >
          {/* Subtle Graticule Background Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-col justify-between p-2">
            <div className="border-b border-dashed border-zinc-400 w-full" />
            <div className="border-b border-dashed border-zinc-400 w-full" />
            <div className="border-b border-dashed border-zinc-400 w-full" />
          </div>

          {/* Waveform Bars */}
          {waveform.map((amp, idx) => {
            const barFraction = idx / (waveform.length - 1);
            const isPlayed = barFraction <= progress;
            const isHovered = hoveredFraction !== null && Math.abs(barFraction - hoveredFraction) < 0.03;
            const barHeightPct = Math.max(12, Math.min(100, amp * 100));

            return (
              <div
                key={idx}
                className="flex-1 h-full flex items-center justify-center relative"
              >
                <div
                  className={`w-full rounded-full transition-all duration-100 ${
                    isPlayed
                      ? 'bg-gradient-to-t from-emerald-600 to-teal-400 dark:from-emerald-500 dark:to-teal-300 shadow-xs shadow-emerald-500/30'
                      : isHovered
                      ? 'bg-emerald-300 dark:bg-emerald-800'
                      : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                  style={{
                    height: `${barHeightPct}%`,
                    transform: isPlayed ? 'scaleY(1.05)' : 'scaleY(1)'
                  }}
                />
              </div>
            );
          })}

          {/* Floating Playhead Cursor Line with Glow */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none transition-none z-20 flex flex-col items-center"
            style={{ left: `${progress * 100}%`, transform: 'translateX(-50%)' }}
          >
            {/* Top Indicator Handle */}
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 dark:bg-emerald-400 border-2 border-white dark:border-zinc-950 shadow-md ring-2 ring-emerald-500/40 -mt-1" />
            <div className="w-0.5 h-full bg-emerald-600 dark:bg-emerald-400 shadow-sm" />
            <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          </div>

          {/* Hover Preview Marker */}
          {hoveredFraction !== null && !isScrubbing && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-10 w-px bg-zinc-400 dark:bg-zinc-600 border-dashed"
              style={{ left: `${hoveredFraction * 100}%` }}
            />
          )}
        </div>

        {/* Syllable Segments Pill Row */}
        {activeEntry.syllables && activeEntry.syllables.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Syllabic &amp; Tonal Breakdown:
              </span>
              <span>Click any morpheme to listen &amp; isolate</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {activeEntry.syllables.map((syl, i) => {
                const isActive = progress >= syl.startFraction && progress <= syl.endFraction;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleJumpToSyllable(syl)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-md scale-[1.02]'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm sm:text-base font-serif">
                        {syl.text}
                      </span>
                      {syl.tone && (
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? 'bg-emerald-600 text-emerald-100 font-bold'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {syl.tone} Tone
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-mono mt-0.5 ${isActive ? 'text-emerald-100' : 'text-zinc-500'}`}>
                      {syl.phonetic}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Playback Transport Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Greeting' : 'Play Full Greeting'}</span>
            </button>

            {/* Reset / Replay Button */}
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
              title="Reset playhead to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Active Status Badge */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {currentSyllable ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                Active Morpheme: {currentSyllable.text} ({currentSyllable.phonetic})
              </span>
            ) : (
              <span className="text-zinc-400">Ready to play</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
