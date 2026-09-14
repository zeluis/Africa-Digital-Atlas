import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { 
  Compass, 
  BookOpen, 
  Globe2, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  TrendingUp, 
  Cpu, 
  Landmark, 
  Anchor, 
  Activity, 
  FileText, 
  Layers, 
  Maximize2,
  TreeDeciduous,
  Database
} from 'lucide-react';
import { CanonicalNavTab } from './NavigationDrawer';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { AfricaUnLogo } from './AfricaUnLogo';
import { OnboardingContinentVisualizer } from './OnboardingContinentVisualizer';
import { speakAfricaliaGreeting, stopAfricaliaSpeech, playWarmAfricanChime } from '../utils/africaliaVoiceEngine';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: CanonicalNavTab) => void;
}

interface OnboardingScreenDef {
  id: number;
  stageNumber: string;
  stageBadge: string;
  header: string;
  body: string;
  artTheme: 'history' | 'economy' | 'future';
  regionFocus: string;
  primaryTone: string;
  secondaryTone: string;
  fullscreenBackdrop: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  headerColor: string;
  bodyColor: string;
  accentBadgeBg: string;
  accentBadgeBorder: string;
  accentBadgeText: string;
  actionBtnBg: string;
  actionBtnBorder: string;
  actionBtnText: string;
  actionBtnHover: string;
}

const ONBOARDING_SCREENS: OnboardingScreenDef[] = [
  {
    id: 1,
    stageNumber: '01',
    stageBadge: 'Screen 1: The Foundation (History & Heritage)',
    header: 'Unpacking the Diaspora',
    body: 'Welcome to Africalia, a curated gateway honoring the Atlantic Ethnic Explorer. Immerse yourself in the profound histories, resilience, and interconnected heritages that bridge Europe, Africa, and the Americas.',
    artTheme: 'history',
    regionFocus: 'Eastern & Northern Africa Tonal Axis',
    primaryTone: '#EA580C',
    secondaryTone: '#D97706',
    fullscreenBackdrop: 'from-[#341105] via-[#431407] to-[#1f0a02]',
    cardBg: 'bg-[#451a03]',
    cardBorder: 'border-[#ea580c]/60',
    cardShadow: 'shadow-[#2c0b02]/90',
    headerColor: 'text-[#fff7ed]',
    bodyColor: 'text-[#ffedd5]',
    accentBadgeBg: 'bg-[#ea580c]/30',
    accentBadgeBorder: 'border-[#ea580c]/60',
    accentBadgeText: 'text-[#fed7aa]',
    actionBtnBg: 'bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#d97706]',
    actionBtnBorder: 'border-[#fdba74]',
    actionBtnText: 'text-[#2a0800]',
    actionBtnHover: 'hover:from-[#f97316] hover:to-[#ea580c]'
  },
  {
    id: 2,
    stageNumber: '02',
    stageBadge: 'Screen 2: The Evolution (Socioeconomic Reality)',
    header: 'Shaping Development',
    body: 'Engage deeply with the complex socioeconomic forces, structural realities, and local innovations defining the continent today. Move beyond single narratives to understand Africa’s true economic landscape.',
    artTheme: 'economy',
    regionFocus: 'Western & Southern Africa Tonal Axis',
    primaryTone: '#059669',
    secondaryTone: '#E11D48',
    fullscreenBackdrop: 'from-[#022c22] via-[#064e3b] to-[#012019]',
    cardBg: 'bg-[#043d2f]',
    cardBorder: 'border-[#059669]/60',
    cardShadow: 'shadow-[#011a14]/90',
    headerColor: 'text-[#f0fdf4]',
    bodyColor: 'text-[#d1fae5]',
    accentBadgeBg: 'bg-[#059669]/30',
    accentBadgeBorder: 'border-[#059669]/60',
    accentBadgeText: 'text-[#a7f3d0]',
    actionBtnBg: 'bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857]',
    actionBtnBorder: 'border-[#6ee7b7]',
    actionBtnText: 'text-[#012419]',
    actionBtnHover: 'hover:from-[#10b981] hover:to-[#059669]'
  },
  {
    id: 3,
    stageNumber: '03',
    stageBadge: 'Screen 3: The Horizon (The Future)',
    header: 'A Dynamic Tomorrow',
    body: 'Discover a forward-looking, rising Africa driven by vibrant youth demographics, tech-driven markets, and a sustainable future. Join us as we explore the continent\'s next chapter.',
    artTheme: 'future',
    regionFocus: 'Central Africa & Pan-African Innovation Axis',
    primaryTone: '#6366F1',
    secondaryTone: '#059669',
    fullscreenBackdrop: 'from-[#1e1b4b] via-[#2e1065] to-[#0f0d26]',
    cardBg: 'bg-[#24174d]',
    cardBorder: 'border-[#6366f1]/60',
    cardShadow: 'shadow-[#0d0926]/90',
    headerColor: 'text-[#eef2ff]',
    bodyColor: 'text-[#e0e7ff]',
    accentBadgeBg: 'bg-[#6366f1]/30',
    accentBadgeBorder: 'border-[#6366f1]/60',
    accentBadgeText: 'text-[#c7d2fe]',
    actionBtnBg: 'bg-gradient-to-r from-[#d97706] via-[#ea580c] to-[#f59e0b]',
    actionBtnBorder: 'border-[#fde68a]',
    actionBtnText: 'text-[#2a0800]',
    actionBtnHover: 'hover:from-[#f59e0b] hover:to-[#ea580c]'
  },
  {
    id: 4,
    stageNumber: '04',
    stageBadge: 'Screen 4: Academic Integrity & Dual Space Entry',
    header: 'Historical Context & Content Continuity',
    body: 'Africalia operates under rigorous scholarly and socio-educational protocols. Review the ethical research framework and data provenance below, then choose your curated entry destination.',
    artTheme: 'economy',
    regionFocus: 'Scholarly Integrity & Transatlantic Synthesis',
    primaryTone: '#059669',
    secondaryTone: '#D97706',
    fullscreenBackdrop: 'from-[#022c22] via-[#064e3b] to-[#012019]',
    cardBg: 'bg-[#043d2f]',
    cardBorder: 'border-[#059669]/60',
    cardShadow: 'shadow-[#011a14]/90',
    headerColor: 'text-[#f0fdf4]',
    bodyColor: 'text-[#d1fae5]',
    accentBadgeBg: 'bg-[#059669]/30',
    accentBadgeBorder: 'border-[#059669]/60',
    accentBadgeText: 'text-[#a7f3d0]',
    actionBtnBg: 'bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706]',
    actionBtnBorder: 'border-[#fde68a]',
    actionBtnText: 'text-[#1f0600]',
    actionBtnHover: 'hover:from-[#fbbf24] hover:to-[#ea580c]'
  }
];

interface TopicCtaDef {
  id: CanonicalNavTab;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  microMetrics: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  titleHover: string;
}

const TOPIC_CTAS: TopicCtaDef[] = [
  {
    id: 'explore',
    title: 'Explore',
    subtitle: '54 Sovereign Nations, 8 Thematic Pillars & Blocs',
    icon: Compass,
    tag: '54 Nations',
    microMetrics: '54 Countries • 8 Pillars • 1.4B Pop',
    cardBg: 'bg-[#033b2c] hover:bg-[#044d3b]',
    cardBorder: 'border-[#059669]/60',
    cardHoverBorder: 'hover:border-[#34d399]',
    badgeBg: 'bg-[#059669]/40',
    badgeBorder: 'border-[#34d399]/50',
    badgeText: 'text-[#a7f3d0]',
    iconBg: 'bg-[#059669]/30',
    iconColor: 'text-[#34d399]',
    titleHover: 'group-hover:text-[#6ee7b7]'
  },
  {
    id: 'slave-trade',
    title: 'History',
    subtitle: 'Atlantic Slave Trade Archive & Ethnic Tree',
    icon: Anchor,
    tag: 'TAST & Genetics',
    microMetrics: '36k+ Voyages • Ancestral Trees',
    cardBg: 'bg-[#400e1f] hover:bg-[#521328]',
    cardBorder: 'border-[#e11d48]/60',
    cardHoverBorder: 'hover:border-[#fb7185]',
    badgeBg: 'bg-[#e11d48]/40',
    badgeBorder: 'border-[#fb7185]/50',
    badgeText: 'text-[#fecdd3]',
    iconBg: 'bg-[#e11d48]/30',
    iconColor: 'text-[#fb7185]',
    titleHover: 'group-hover:text-[#fda4af]'
  },
  {
    id: 'research-directory',
    title: 'Reports',
    subtitle: 'Peer-Reviewed Treatises & Reparatory Jurisprudence',
    icon: BookOpen,
    tag: 'Academic',
    microMetrics: '42 Treatises • AU Agenda 2063',
    cardBg: 'bg-[#231b5c] hover:bg-[#2c2273]',
    cardBorder: 'border-[#6366f1]/60',
    cardHoverBorder: 'hover:border-[#a5b4fc]',
    badgeBg: 'bg-[#6366f1]/40',
    badgeBorder: 'border-[#a5b4fc]/50',
    badgeText: 'text-[#c7d2fe]',
    iconBg: 'bg-[#6366f1]/30',
    iconColor: 'text-[#a5b4fc]',
    titleHover: 'group-hover:text-[#c7d2fe]'
  },
  {
    id: 'regions',
    title: 'Regions',
    subtitle: '5 UN Macro-Regions & Living Mother Tongues',
    icon: Globe2,
    tag: '5 Ecosystems',
    microMetrics: '5 UN Zones • 2,000+ Tongues',
    cardBg: 'bg-[#4a1d08] hover:bg-[#5e250b]',
    cardBorder: 'border-[#ea580c]/60',
    cardHoverBorder: 'hover:border-[#fdba74]',
    badgeBg: 'bg-[#ea580c]/40',
    badgeBorder: 'border-[#fdba74]/50',
    badgeText: 'text-[#fed7aa]',
    iconBg: 'bg-[#ea580c]/30',
    iconColor: 'text-[#fdba74]',
    titleHover: 'group-hover:text-[#fed7aa]'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Multilateral Indicators & Cartographic Trends',
    icon: BarChart3,
    tag: 'Live Feeds',
    microMetrics: 'WB, IMF & UNESCO Feeds',
    cardBg: 'bg-[#452805] hover:bg-[#593407]',
    cardBorder: 'border-[#d97706]/60',
    cardHoverBorder: 'hover:border-[#fcd34d]',
    badgeBg: 'bg-[#d97706]/40',
    badgeBorder: 'border-[#fcd34d]/50',
    badgeText: 'text-[#fef08a]',
    iconBg: 'bg-[#d97706]/30',
    iconColor: 'text-[#fcd34d]',
    titleHover: 'group-hover:text-[#fef08a]'
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { t, language } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState<boolean>(false);
  const [showDualEntryPanels, setShowDualEntryPanels] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const activeScreen = ONBOARDING_SCREENS[currentStepIndex];

  // Stop speech when step changes or modal closes
  useEffect(() => {
    stopAfricaliaSpeech();
    setIsSpeaking(false);
  }, [currentStepIndex, isOpen]);

  // Reset dual entry panel state when leaving screen 4
  useEffect(() => {
    if (currentStepIndex !== 3) {
      setShowDualEntryPanels(false);
    }
  }, [currentStepIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDirectCloseToDefaultApp();
        return;
      }
      if (e.key === 'ArrowRight' && currentStepIndex < ONBOARDING_SCREENS.length - 1) {
        setSlideDirection(1);
        setCurrentStepIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        setSlideDirection(-1);
        setCurrentStepIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < ONBOARDING_SCREENS.length - 1) {
      setSlideDirection(1);
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setShowDualEntryPanels(true);
    }
  };

  const handlePrev = () => {
    if (showDualEntryPanels) {
      setShowDualEntryPanels(false);
    } else if (currentStepIndex > 0) {
      setSlideDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleJumpToStep = (index: number) => {
    setSlideDirection(index > currentStepIndex ? 1 : -1);
    setCurrentStepIndex(index);
    setShowDualEntryPanels(false);
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && currentStepIndex < ONBOARDING_SCREENS.length - 1) {
      setSlideDirection(1);
      setCurrentStepIndex(prev => prev + 1);
    } else if (info.offset.x > swipeThreshold && currentStepIndex > 0) {
      setSlideDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleAdvanceToScreen4FromTopic = (_targetTab: CanonicalNavTab) => {
    setSlideDirection(1);
    setCurrentStepIndex(3);
    setShowDualEntryPanels(true);
  };

  const handleDirectCloseToDefaultApp = () => {
    stopAfricaliaSpeech();
    setIsSpeaking(false);
    setShowDualEntryPanels(false);
    try {
      localStorage.setItem('africalia_onboarding_v1', 'true');
    } catch {
      // safe fallback
    }
    onClose();
    onNavigate('overview');
  };

  const handleChooseDestination = (destinationTab: CanonicalNavTab) => {
    stopAfricaliaSpeech();
    setIsSpeaking(false);
    playWarmAfricanChime();
    try {
      localStorage.setItem('africalia_onboarding_v1', 'true');
    } catch {
      // safe fallback
    }
    onNavigate(destinationTab);
    onClose();
  };

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopAfricaliaSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const narrationText = `${activeScreen.header}. ${activeScreen.body}`;
      speakAfricaliaGreeting({
        text: narrationText,
        langTag: language,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none"
      id="africalia-onboarding-container"
      role="dialog"
      aria-modal="true"
      aria-label="Africalia Onboarding Experience"
    >
      {/* 1. Fullscreen Seamless Solid Atmospheric Backdrop with UN Geoscheme Tonal Variations */}
      <motion.div
        key={`backdrop-${activeScreen.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`fixed inset-0 bg-gradient-to-br ${activeScreen.fullscreenBackdrop} pointer-events-none transition-colors duration-700`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      />

      {/* 2. Ambient Universal Continental Vector (AfricaUnLogo) Aura & Thematic Color Transitions */}
      {/* Positioned in the top-left quadrant cleanly underneath the onboarding header bar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`ambient-continent-${activeScreen.id}`}
            initial={{ opacity: 0, scale: 0.88, rotate: -2 }}
            animate={{ opacity: 0.2, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.08, rotate: 2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-16 sm:top-20 md:top-24 -left-8 sm:-left-4 md:left-2 flex items-center justify-center select-none"
          >
            {/* Ambient Radial Color Under-Glow synced with active screen tones */}
            <div 
              className="absolute w-[400px] sm:w-[560px] h-[400px] sm:h-[560px] rounded-full blur-[110px] transition-colors duration-700 opacity-55 pointer-events-none"
              style={{ backgroundColor: activeScreen.primaryTone }}
            />
            <div 
              className="absolute w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full blur-[85px] transition-colors duration-700 opacity-40 pointer-events-none translate-x-16 translate-y-16"
              style={{ backgroundColor: activeScreen.secondaryTone }}
            />

            {/* Grand Continental Silhouette Watermark */}
            <AfricaUnLogo
              size="min(72vw, 580px)"
              interactive={false}
              glow={true}
              variant="themed"
              strokeColor={activeScreen.secondaryTone}
              strokeWidth={1.2}
              singleColor={activeScreen.primaryTone}
              className="filter drop-shadow-[0_0_50px_rgba(0,0,0,0.85)] pointer-events-none"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Central Application Shell Wrapper */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        {/* Header Bar: Brand, Step Indicator, Narration & Direct Close Button */}
        <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-[#059669]/40 bg-[#022c22] shrink-0 z-20 shadow-lg shadow-[#011a14]/60">
          {/* Brand & Progress Label */}
          <div className="flex items-center gap-3">
            <AfricaUnLogo 
              className="w-10 h-10 shrink-0" 
              interactive={false} 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-extrabold tracking-wider text-sm sm:text-base uppercase text-[#d1fae5]">
                  Africalia
                </span>
                <span className="text-[#34d399] font-bold text-xs tracking-widest uppercase">
                  • Data Atlas
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#a7f3d0] font-medium">
                <span>{t('onboarding.curated_orientation', 'Curated Orientation')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <span className="font-mono text-[#fde68a] font-bold">{`${activeScreen.stageNumber} / 04`}</span>
              </div>
            </div>
          </div>

          {/* Action Controls: Voice Narration, Language Selector & Skip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Voice Narration Button with Dynamic Equalizer Waveform */}
            <button
              onClick={handleToggleVoice}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                isSpeaking 
                  ? 'bg-[#d97706]/40 text-[#fef3c7] border-[#fbbf24] ring-2 ring-[#fbbf24]/40 shadow-lg shadow-[#451a03]/80' 
                  : 'bg-[#044d3b] text-[#d1fae5] border-[#059669]/60 hover:bg-[#065f46] hover:border-[#34d399]'
              }`}
              title={isSpeaking ? 'Mute narrator voice' : 'Listen with natural African female narrator'}
              aria-label="Toggle voice narration"
            >
              {isSpeaking ? (
                <>
                  <div className="flex items-end gap-0.5 h-3.5 w-4">
                    <span className="w-1 bg-[#fde68a] rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
                    <span className="w-1 bg-[#fbbf24] rounded-full animate-bounce [animation-delay:-0.15s] h-2/3" />
                    <span className="w-1 bg-[#f59e0b] rounded-full animate-bounce h-full" />
                  </div>
                  <span className="hidden sm:inline font-bold text-[#fef3c7]">Narrating</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#34d399]" />
                  <span className="hidden sm:inline">Audio</span>
                </>
              )}
            </button>

            {/* Multilingual Selector */}
            <div className="shrink-0">
              <LanguageSelector />
            </div>

            {/* Direct Close & Enter Default App */}
            <button
              onClick={handleDirectCloseToDefaultApp}
              className="p-2 rounded-xl text-[#a7f3d0] hover:text-white hover:bg-[#065f46] border border-[#059669]/50 hover:border-[#34d399] transition-colors cursor-pointer"
              title="Close & Enter Data Atlas"
              aria-label="Close onboarding and enter default app"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 4. Centered Content Slides & Cards Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex items-center justify-center min-h-0 z-10 transition-opacity duration-300">
          <div className="w-full max-w-5xl mx-auto my-auto">
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={currentStepIndex}
                custom={slideDirection}
                initial={{ opacity: 0, x: slideDirection * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection * -60 }}
                transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                drag={currentStepIndex < 3 ? "x" : undefined}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className={`rounded-3xl border-2 ${activeScreen.cardBorder} ${activeScreen.cardBg} ${activeScreen.cardShadow} shadow-2xl p-4 sm:p-6 md:p-8 relative overflow-hidden flex flex-col justify-between gap-4 sm:gap-5 touch-pan-y`}
              >
                {/* Subtle Chromatic Mesh Pattern in Card */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fed7aa_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

                {/* Stage Header, Badge & Narrative */}
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${activeScreen.accentBadgeBg} ${activeScreen.accentBadgeBorder} ${activeScreen.accentBadgeText}`}>
                      <Sparkles className="w-3.5 h-3.5 text-[#fde68a]" />
                      <span>{activeScreen.stageBadge}</span>
                    </span>

                    <span className="text-[11px] font-mono text-[#a7f3d0] font-semibold bg-[#022c22]/80 px-2.5 py-1 rounded-lg border border-[#059669]/40">
                      {activeScreen.regionFocus}
                    </span>
                  </div>

                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight ${activeScreen.headerColor} mb-2 drop-shadow-sm`}>
                    {activeScreen.header}
                  </h1>

                  <p className={`text-sm sm:text-base md:text-lg ${activeScreen.bodyColor} leading-relaxed font-light`}>
                    {activeScreen.body}
                  </p>
                </div>

                {/* Dynamic Vector Continent Visualizer with Flanking Data Panels (Screens 1, 2, 3) */}
                {currentStepIndex < 3 && (
                  <div className="relative z-10 w-full">
                    <OnboardingContinentVisualizer theme={activeScreen.artTheme} />
                  </div>
                )}

                {/* ========================================================= */}
                {/* SCREEN 3: THE HORIZON - TOPIC DESTINATION CARDS           */}
                {/* ========================================================= */}
                {currentStepIndex === 2 && (
                  <div className="relative z-10 w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#fde68a]">
                          Curated Exploratory Gateways
                        </h3>
                      </div>
                      <span className="text-xs text-[#c7d2fe] font-medium hidden sm:inline">
                        Tap any topic card to review advisory & choose space
                      </span>
                    </div>

                    {/* MD3-Inspired UN Geoscheme Tonal Topic Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {TOPIC_CTAS.map((topic) => {
                        const Icon = topic.icon;
                        return (
                          <button
                            key={topic.id}
                            onClick={() => handleAdvanceToScreen4FromTopic(topic.id)}
                            className={`text-left p-3.5 rounded-2xl border ${topic.cardBorder} ${topic.cardHoverBorder} ${topic.cardBg} hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between gap-2`}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className={`p-2 rounded-xl ${topic.iconBg}`}>
                                <Icon className={`w-4 h-4 ${topic.iconColor}`} />
                              </div>
                              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-lg border ${topic.badgeBg} ${topic.badgeBorder} ${topic.badgeText}`}>
                                {topic.tag}
                              </span>
                            </div>
                            <div>
                              <h4 className={`font-serif font-bold text-sm text-white flex items-center justify-between ${topic.titleHover} transition-colors`}>
                                <span>{topic.title}</span>
                                <ChevronRight className="w-4 h-4 text-[#a7f3d0] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </h4>
                              <p className="text-[11px] text-[#e0e7ff] leading-snug mt-0.5 font-light">
                                {topic.subtitle}
                              </p>
                              <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-[#a5b4fc]">
                                <span className="w-1 h-1 rounded-full bg-[#34d399]" />
                                <span>{topic.microMetrics}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}

                      {/* Master Continental Dashboard Entry Card */}
                      <button
                        onClick={() => handleAdvanceToScreen4FromTopic('overview')}
                        className="text-left p-3.5 rounded-2xl border-2 border-dashed border-[#34d399]/60 bg-[#033b2c] hover:bg-[#044d3b] hover:border-[#6ee7b7] transition-all duration-300 cursor-pointer group flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="p-1.5 rounded-xl bg-[#059669]/40 text-[#6ee7b7] flex items-center justify-center">
                            <AfricaUnLogo size={22} interactive={false} />
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-lg bg-[#059669]/40 border border-[#34d399]/50 text-[#a7f3d0]">
                            Core Atlas
                          </span>
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-white flex items-center justify-between group-hover:text-[#6ee7b7] transition-colors">
                            <span>Complete Overview</span>
                            <ChevronRight className="w-4 h-4 text-[#34d399] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </h4>
                          <p className="text-[11px] text-[#d1fae5] leading-snug mt-0.5 font-light">
                            Master Continental Dashboard, Map, Weather & Indicators
                          </p>
                          <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-[#6ee7b7]">
                            <span className="w-1 h-1 rounded-full bg-[#34d399]" />
                            <span>54 Flags • Real-time Data Feeds</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* SCREEN 4: FULL ACADEMIC ADVISORY & DUAL ENTRY PANELS       */}
                {/* ========================================================= */}
                {currentStepIndex === 3 && (
                  <div className="relative z-10 w-full space-y-4">
                    {/* State 1: Academic Advisory Protocol & Methodology */}
                    {!showDualEntryPanels ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-[#022c22]/90 border border-[#059669]/60 text-sm text-[#d1fae5] leading-relaxed shadow-lg">
                          <div className="flex items-center gap-2 mb-2 text-[#fde68a] font-bold font-serif text-base">
                            <ShieldCheck className="w-5 h-5 text-[#fbbf24]" />
                            <span>Academic & Socio-Educational Protocol</span>
                          </div>
                          <p className="font-medium text-[#f0fdf4] text-sm sm:text-base border-l-4 border-[#f59e0b] pl-3 py-1 bg-[#d97706]/20 rounded-r-xl mb-3">
                            Africalia is an academic and socio-educational space dedicated to exploring transatlantic histories, the transatlantic slave trade, and evolving contemporary developments.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                            <div className="p-3 rounded-xl bg-[#033b2c] border border-[#059669]/40">
                              <strong className="text-[#fde68a] text-xs font-bold block mb-1">
                                Curated Framework:
                              </strong>
                              <span className="text-[11px] text-[#d1fae5] font-light leading-snug block">
                                Some modules contain direct archival documentation, sensitive historical records, and academic terminology surrounding ethnic forced migration.
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-[#033b2c] border border-[#059669]/40">
                              <strong className="text-[#a7f3d0] text-xs font-bold block mb-1">
                                Community Standard:
                              </strong>
                              <span className="text-[11px] text-[#d1fae5] font-light leading-snug block">
                                All discussions, data visualizations, and shared research are handled with dignity, educational intent, and respect for cultural heritage.
                              </span>
                            </div>

                            <div className="p-3 rounded-xl bg-[#033b2c] border border-[#059669]/40">
                              <strong className="text-[#c7d2fe] text-xs font-bold block mb-1">
                                Data & Engagement:
                              </strong>
                              <span className="text-[11px] text-[#d1fae5] font-light leading-snug block">
                                By proceeding, you acknowledge entering a space committed to transparent historical exploration and contemporary socioeconomic analysis.
                              </span>
                            </div>
                          </div>

                          {/* Toggleable Scholarly Methodology */}
                          <div className="mt-3 pt-3 border-t border-[#059669]/40">
                            <button
                              type="button"
                              onClick={() => setIsMethodologyOpen(!isMethodologyOpen)}
                              className="text-xs text-[#a7f3d0] hover:text-[#fde68a] flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>{isMethodologyOpen ? 'Hide Scholarly Methodology' : 'View Scholarly Methodology & Archival Data Sources'}</span>
                            </button>

                            {isMethodologyOpen && (
                              <div className="mt-2 p-3 rounded-xl bg-[#012019] border border-[#059669]/50 text-xs text-[#d1fae5] space-y-1.5">
                                <div className="font-bold text-[#fde68a] flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>Harmonized Data Sources:</span>
                                </div>
                                <p className="font-light">
                                  • <strong>Trans-Atlantic Slave Trade Database (TAST)</strong>: Emory University & W.E.B. Du Bois Institute (36,000+ voyages).
                                </p>
                                <p className="font-light">
                                  • <strong>Multilateral Development Indicators</strong>: World Bank WDI, IMF Regional Economic Outlooks, UN DESA & UNESCO.
                                </p>
                                <p className="font-light">
                                  • <strong>Pan-African Integration</strong>: AfCFTA Secretariat, African Union Agenda 2063, and regional power pools (WAPP, EAPP, SAPP, CAPP).
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Primary Action Button: I Understand & Enter Space */}
                        <button
                          onClick={() => setShowDualEntryPanels(true)}
                          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] hover:from-[#fbbf24] hover:to-[#ea580c] text-[#1f0600] font-black text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl shadow-[#1f0600]/90 border-2 border-[#fde68a] active:scale-[0.99] hover:brightness-110"
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#1f0600]" />
                          <span>[ I Understand & Enter Space ]</span>
                        </button>
                      </div>
                    ) : (
                      /* State 2: Dual Entry Panels (Smoothly Slides Up) */
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-pulse" />
                            <h3 className="font-serif font-bold text-sm sm:text-base text-[#fde68a]">
                              Select Your Curated Entry Space
                            </h3>
                          </div>
                          <button
                            onClick={() => setShowDualEntryPanels(false)}
                            className="text-xs text-[#a7f3d0] hover:text-white underline cursor-pointer"
                          >
                            ← Review Academic Protocol
                          </button>
                        </div>

                        {/* Two Master Interactive Panels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                          {/* ========================================================= */}
                          {/* OPTION 1: ETHNIC TREE EXPLORER                            */}
                          {/* ========================================================= */}
                          <div
                            onClick={() => handleChooseDestination('ethnic-tree')}
                            className="group relative p-5 rounded-3xl bg-gradient-to-br from-[#431407] via-[#2d0f05] to-[#1a0702] border-2 border-[#ea580c]/60 hover:border-[#fb923c] shadow-2xl shadow-[#1f0600]/80 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 hover:scale-[1.01]"
                          >
                            <div>
                              {/* Option Header & Badge */}
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-950 border border-amber-300 shadow-sm">
                                    <TreeDeciduous className="w-5 h-5 text-amber-700" />
                                  </div>
                                  <div>
                                    <span className="text-[11px] uppercase font-bold tracking-widest text-amber-200 block">
                                      Option 1 • Atlantic Lineages
                                    </span>
                                    <h4 className="font-serif font-black text-lg sm:text-xl text-[#fff7ed] group-hover:text-amber-200 transition-colors">
                                      Ethnic Tree Explorer
                                    </h4>
                                  </div>
                                </div>
                                <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 shadow-sm">
                                  TAST & Lineages
                                </span>
                              </div>

                              {/* Visual Asset: Ethnic Tree Full-Cover Centered Container */}
                              <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-2xl overflow-hidden bg-[#180802] border border-amber-400/50 flex items-center justify-center p-0 mb-3 shadow-md">
                                <img 
                                  src="/africalia-ethnic-tree.svg" 
                                  alt="Ethnic Tree of Life Vector Diagram" 
                                  className="w-full h-full object-cover object-center filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    // Fallback to stylized SVG icon if raw image loading fails
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                                {/* Clean, High-Legibility Floating Image Legend */}
                                <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-white/95 text-stone-900 border border-amber-300/80 shadow-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md">
                                  <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
                                  <span className="font-bold text-amber-950">Ethnolinguistic Tree</span>
                                  <span className="text-stone-500 font-normal">| 36K+ Voyages</span>
                                </div>
                              </div>

                              {/* Engaging, Clean & High-Legibility Description Card (No Dark Background) */}
                              <div className="p-3.5 rounded-2xl bg-amber-50/95 border border-amber-200/90 shadow-sm text-stone-900 space-y-1">
                                <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold uppercase tracking-wider">
                                  <Compass className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Ancestral Homeland & Genetic Blueprint</span>
                                </div>
                                <p className="text-xs sm:text-sm text-stone-900 leading-relaxed font-medium">
                                  Immerse in the Transatlantic Ethnic Tree of Life — indexing 36,000+ historical slave trade voyages, ancestral homelands, linguistic branches, and molecular genetic blueprints connecting the Atlantic Diaspora across continents.
                                </p>
                              </div>
                            </div>

                            {/* Direct Action Button (Clean, Bright, Non-Dark Gradient) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChooseDestination('ethnic-tree');
                              }}
                              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-amber-950 font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-200 shadow-lg shadow-amber-950/20 group-hover:shadow-xl group-hover:scale-[1.01] active:scale-[0.99]"
                            >
                              <span>Launch Ethnic Tree Explorer</span>
                              <ArrowRight className="w-4 h-4 text-amber-950 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>

                          {/* ========================================================= */}
                          {/* OPTION 2: DIGITAL DATA ATLAS                              */}
                          {/* ========================================================= */}
                          <div
                            onClick={() => handleChooseDestination('overview')}
                            className="group relative p-5 rounded-3xl bg-gradient-to-br from-[#023326] via-[#043d2f] to-[#011a14] border-2 border-[#059669]/60 hover:border-[#34d399] shadow-2xl shadow-[#011a14]/80 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 hover:scale-[1.01]"
                          >
                            <div>
                              {/* Option Header & Badge */}
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-sm">
                                    <Database className="w-5 h-5 text-emerald-700" />
                                  </div>
                                  <div>
                                    <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-200 block">
                                      Option 2 • Continental Intelligence
                                    </span>
                                    <h4 className="font-serif font-black text-lg sm:text-xl text-[#f0fdf4] group-hover:text-emerald-200 transition-colors">
                                      Digital Data Atlas
                                    </h4>
                                  </div>
                                </div>
                                <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-sm">
                                  Overview & GIS
                                </span>
                              </div>

                              {/* Visual Asset: Overview / Data Atlas Full-Cover Centered Preview */}
                              <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-2xl overflow-hidden bg-[#011f16] border border-emerald-400/50 flex items-center justify-center p-0 mb-3 shadow-md">
                                <img 
                                  src="/atlas-hero-preview.jpg" 
                                  alt="Digital Data Atlas Continental Overview Screenshot" 
                                  className="w-full h-full object-cover object-center filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    // Fallback to SVG logo if image loading fails
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <AfricaUnLogo size={80} interactive={false} glow={true} />
                                </div>
                                {/* Clean, High-Legibility Floating Image Legend */}
                                <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-white/95 text-stone-900 border border-emerald-300/80 shadow-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md">
                                  <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
                                  <span className="font-bold text-emerald-950">54 Nations GIS</span>
                                  <span className="text-stone-500 font-normal">| Real-time Data</span>
                                </div>
                              </div>

                              {/* Engaging, Clean & High-Legibility Description Card (No Dark Background) */}
                              <div className="p-3.5 rounded-2xl bg-emerald-50/95 border border-emerald-200/90 shadow-sm text-stone-900 space-y-1">
                                <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                                  <Activity className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Multilateral Indicators & AfCFTA Corridor</span>
                                </div>
                                <p className="text-xs sm:text-sm text-stone-900 leading-relaxed font-medium">
                                  Engage with Africa's definitive geospatial and econometric intelligence engine — real-time multilateral indicator feeds, 54 sovereign country dossiers, $3.4T AfCFTA trade corridors, and AU Agenda 2063 benchmarks.
                                </p>
                              </div>
                            </div>

                            {/* Direct Action Button (Clean, Bright, Non-Dark Gradient) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChooseDestination('overview');
                              }}
                              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 text-emerald-950 font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-200 shadow-lg shadow-emerald-950/20 group-hover:shadow-xl group-hover:scale-[1.01] active:scale-[0.99]"
                            >
                              <span>Launch Digital Data Atlas</span>
                              <ArrowRight className="w-4 h-4 text-emerald-950 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 5. Bottom Navigation Footer */}
        <footer className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-t border-[#059669]/40 bg-[#022c22] shrink-0 z-20 shadow-lg shadow-[#011a14]/60">
          {/* Step Progression Indicators */}
          <div className="flex items-center gap-2">
            {ONBOARDING_SCREENS.map((screen, idx) => (
              <button
                key={screen.id}
                onClick={() => handleJumpToStep(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === currentStepIndex 
                    ? 'w-10 bg-gradient-to-r from-[#fbbf24] via-[#34d399] to-[#2dd4bf] shadow-lg shadow-[#059669]/60' 
                    : 'w-3 bg-[#044d3b] hover:bg-[#065f46] border border-[#059669]/50'
                }`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-3">
            {(currentStepIndex > 0 || showDualEntryPanels) && (
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border-2 border-[#059669]/60 bg-[#044d3b] text-[#d1fae5] hover:bg-[#065f46] hover:border-[#34d399] text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {currentStepIndex < ONBOARDING_SCREENS.length - 1 ? (
              <button
                onClick={handleNext}
                className={`px-6 py-2.5 rounded-xl ${activeScreen.actionBtnBg} ${activeScreen.actionBtnHover} ${activeScreen.actionBtnText} text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#011a14]/80 border-2 ${activeScreen.actionBtnBorder} hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : !showDualEntryPanels ? (
              <button
                onClick={() => setShowDualEntryPanels(true)}
                className={`px-6 py-2.5 rounded-xl ${activeScreen.actionBtnBg} ${activeScreen.actionBtnHover} ${activeScreen.actionBtnText} text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#011a14]/80 border-2 ${activeScreen.actionBtnBorder} hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span>Enter Space</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </footer>
      </div>
    </div>
  );
};
