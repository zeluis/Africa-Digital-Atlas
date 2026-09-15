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
  Layers, 
  Maximize2,
  TreeDeciduous,
  Database,
  Keyboard,
  FileText,
  GraduationCap,
  Building2,
  Scale,
  ExternalLink
} from 'lucide-react';
import { CanonicalNavTab } from './NavigationDrawer';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { AfricaUnLogo } from './AfricaUnLogo';
import { OnboardingContinentVisualizer } from './OnboardingContinentVisualizer';
import { PersonaSelector, PersonaTrack } from './onboarding/PersonaSelector';
import { InteractiveFeatureSpotlight } from './onboarding/InteractiveFeatureSpotlight';
import { speakAfricaliaGreeting, stopAfricaliaSpeech, playWarmAfricanChime } from '../utils/africaliaVoiceEngine';
import { ONBOARDING_TRANSLATIONS } from '../data/onboardingTranslations';

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

// Quiet, calm, warm & inviting light palette with UN GeoScheme tonal variations
const ONBOARDING_SCREENS: OnboardingScreenDef[] = [
  {
    id: 1,
    stageNumber: '01',
    stageBadge: 'Screen 1: The Foundation (History & Heritage)',
    header: 'Discover the Diaspora',
    body: 'Welcome to Africalia, a curated gateway honoring the Atlantic Ethnic Explorer. Immerse yourself in the profound histories, resilience, and interconnected heritages that bridge Europe, Africa, and the Americas.',
    artTheme: 'history',
    regionFocus: 'Eastern & Northern Africa Tonal Axis',
    primaryTone: '#b47b4d', // Warm terracotta ochre
    secondaryTone: '#d4a373',
    fullscreenBackdrop: 'from-[#faf7f2] via-[#f5efe6] to-[#ebe3d5]',
    cardBg: 'bg-[#faf6f0]/97',
    cardBorder: 'border-amber-200/80',
    headerColor: 'text-stone-900',
    bodyColor: 'text-stone-700',
    accentBadgeBg: 'bg-amber-50',
    accentBadgeBorder: 'border-amber-200',
    accentBadgeText: 'text-amber-900',
    actionBtnBg: 'bg-amber-600',
    actionBtnBorder: 'border-amber-700/30',
    actionBtnText: 'text-white',
    actionBtnHover: 'hover:bg-amber-700 shadow-sm'
  },
  {
    id: 2,
    stageNumber: '02',
    stageBadge: 'Screen 2: The Evolution (Socioeconomic Reality)',
    header: 'Shaping Development',
    body: 'Engage deeply with the complex socioeconomic forces, structural realities, and local innovations defining the continent today. Move beyond single narratives to understand Africa’s true economic landscape.',
    artTheme: 'economy',
    regionFocus: 'Western & Southern Africa Tonal Axis',
    primaryTone: '#4a7c59', // Calm warm mineral sage
    secondaryTone: '#6b9e7c',
    fullscreenBackdrop: 'from-[#f4f8f5] via-[#edf5f0] to-[#e1eee6]',
    cardBg: 'bg-[#f4f9f6]/97',
    cardBorder: 'border-emerald-200/80',
    headerColor: 'text-stone-900',
    bodyColor: 'text-stone-700',
    accentBadgeBg: 'bg-emerald-50',
    accentBadgeBorder: 'border-emerald-200',
    accentBadgeText: 'text-emerald-900',
    actionBtnBg: 'bg-emerald-600',
    actionBtnBorder: 'border-emerald-700/30',
    actionBtnText: 'text-white',
    actionBtnHover: 'hover:bg-emerald-700 shadow-sm'
  },
  {
    id: 3,
    stageNumber: '03',
    stageBadge: 'Screen 3: The Horizon (The Future)',
    header: 'A Dynamic Tomorrow',
    body: 'Discover a forward-looking, rising Africa driven by vibrant youth demographics, tech-driven markets, and a sustainable future. Join us as we explore the continent\'s next chapter.',
    artTheme: 'future',
    regionFocus: 'Central Africa & Pan-African Innovation Axis',
    primaryTone: '#6b668f', // Calm warm slate lavender
    secondaryTone: '#8e8ab5',
    fullscreenBackdrop: 'from-[#f7f6fb] via-[#f0eef7] to-[#e6e2f0]',
    cardBg: 'bg-[#f7f6fc]/97',
    cardBorder: 'border-indigo-200/80',
    headerColor: 'text-stone-900',
    bodyColor: 'text-stone-700',
    accentBadgeBg: 'bg-indigo-50',
    accentBadgeBorder: 'border-indigo-200',
    accentBadgeText: 'text-indigo-900',
    actionBtnBg: 'bg-indigo-600',
    actionBtnBorder: 'border-indigo-700/30',
    actionBtnText: 'text-white',
    actionBtnHover: 'hover:bg-indigo-700 shadow-sm'
  },
  {
    id: 4,
    stageNumber: '04',
    stageBadge: 'Screen 4: Academic Integrity & Dual Space Entry',
    header: 'Historical Context & Content Continuity',
    body: 'Africalia operates under rigorous scholarly and socio-educational protocols. Review the ethical research framework and data provenance below, then choose your curated entry destination.',
    artTheme: 'economy',
    regionFocus: 'Scholarly Integrity & Transatlantic Synthesis',
    primaryTone: '#5c7f73',
    secondaryTone: '#7fa497',
    fullscreenBackdrop: 'from-[#fcfaf7] via-[#f6f2eb] to-[#ede7dc]',
    cardBg: 'bg-[#fbfaf8]/97',
    cardBorder: 'border-stone-200',
    headerColor: 'text-stone-900',
    bodyColor: 'text-stone-700',
    accentBadgeBg: 'bg-stone-100',
    accentBadgeBorder: 'border-stone-200',
    accentBadgeText: 'text-stone-800',
    actionBtnBg: 'bg-stone-800',
    actionBtnBorder: 'border-stone-900',
    actionBtnText: 'text-white',
    actionBtnHover: 'hover:bg-stone-900 shadow-sm'
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
    cardBg: 'bg-white hover:bg-emerald-50/40 shadow-xs',
    cardBorder: 'border-emerald-200',
    cardHoverBorder: 'hover:border-emerald-400',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeText: 'text-emerald-800',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    titleHover: 'group-hover:text-emerald-900'
  },
  {
    id: 'slave-trade',
    title: 'History',
    subtitle: 'Atlantic Slave Trade Archive & Ethnic Tree',
    icon: TreeDeciduous,
    tag: 'TAST & Genetics',
    microMetrics: '36k+ Voyages • Ancestral Trees',
    cardBg: 'bg-white hover:bg-rose-50/40 shadow-xs',
    cardBorder: 'border-rose-200',
    cardHoverBorder: 'hover:border-rose-400',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeText: 'text-rose-800',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    titleHover: 'group-hover:text-rose-900'
  },
  {
    id: 'research-directory',
    title: 'Reports',
    subtitle: 'Peer-Reviewed Treatises & Reparatory Jurisprudence',
    icon: BookOpen,
    tag: 'Academic',
    microMetrics: '42 Treatises • AU Agenda 2063',
    cardBg: 'bg-white hover:bg-indigo-50/40 shadow-xs',
    cardBorder: 'border-indigo-200',
    cardHoverBorder: 'hover:border-indigo-400',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeText: 'text-indigo-800',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    titleHover: 'group-hover:text-indigo-900'
  },
  {
    id: 'regions',
    title: 'Regions',
    subtitle: '5 UN Macro-Regions & Living Mother Tongues',
    icon: Globe2,
    tag: '5 Ecosystems',
    microMetrics: '5 UN Zones • 2,000+ Tongues',
    cardBg: 'bg-white hover:bg-amber-50/40 shadow-xs',
    cardBorder: 'border-amber-200',
    cardHoverBorder: 'hover:border-amber-400',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeText: 'text-amber-800',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    titleHover: 'group-hover:text-amber-900'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    subtitle: 'Multilateral Indicators & Cartographic Trends',
    icon: BarChart3,
    tag: 'Live Feeds',
    microMetrics: 'WB, IMF & UNESCO Feeds',
    cardBg: 'bg-white hover:bg-blue-50/40 shadow-xs',
    cardBorder: 'border-blue-200',
    cardHoverBorder: 'hover:border-blue-400',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeText: 'text-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    titleHover: 'group-hover:text-blue-900'
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
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | undefined>(undefined);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState<boolean>(false);

  const baseActiveScreen = ONBOARDING_SCREENS[currentStepIndex];
  
  // Resolve localized text for the active screen based on selected language
  const localizedScreenData = ONBOARDING_TRANSLATIONS[language]?.[baseActiveScreen.id] || 
                              ONBOARDING_TRANSLATIONS['en']?.[baseActiveScreen.id] || 
                              {
                                stageBadge: baseActiveScreen.stageBadge,
                                header: baseActiveScreen.header,
                                body: baseActiveScreen.body,
                                regionFocus: baseActiveScreen.regionFocus
                              };

  const activeScreen = {
    ...baseActiveScreen,
    stageBadge: localizedScreenData.stageBadge,
    header: localizedScreenData.header,
    body: localizedScreenData.body,
    regionFocus: localizedScreenData.regionFocus
  };

  // Stop speech when step changes, language changes, or modal closes
  useEffect(() => {
    stopAfricaliaSpeech();
    setIsSpeaking(false);
  }, [currentStepIndex, isOpen, language]);

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
      } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        setShowKeyboardShortcuts(prev => !prev);
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

  const handleSelectPersonaTrack = (track: PersonaTrack) => {
    setSelectedPersonaId(track.id);
    handleChooseDestination(track.targetTab);
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
      {/* 1. Fullscreen Calmed Atmospheric Backdrop */}
      <motion.div
        key={`backdrop-${activeScreen.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`fixed inset-0 bg-gradient-to-br ${activeScreen.fullscreenBackdrop} pointer-events-none transition-colors duration-700`}
        style={{
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)'
        }}
      />

      {/* 2. Soft, Relaxed Ambient Universal Continental Vector (AfricaUnLogo) Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={`ambient-continent-${activeScreen.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.16, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-16 sm:top-20 md:top-24 -left-8 sm:-left-4 md:left-2 flex items-center justify-center select-none"
          >
            {/* Soft Ambient Underglow */}
            <div 
              className="absolute w-[400px] sm:w-[540px] h-[400px] sm:h-[540px] rounded-full blur-[120px] transition-colors duration-700 opacity-40 pointer-events-none"
              style={{ backgroundColor: activeScreen.primaryTone }}
            />
            <div 
              className="absolute w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] rounded-full blur-[90px] transition-colors duration-700 opacity-25 pointer-events-none translate-x-12 translate-y-12"
              style={{ backgroundColor: activeScreen.secondaryTone }}
            />

            {/* Grand Continental Silhouette Watermark */}
            <AfricaUnLogo
              size="min(70vw, 560px)"
              interactive={false}
              glow={false}
              variant="themed"
              strokeColor={activeScreen.secondaryTone}
              strokeWidth={1}
              singleColor={activeScreen.primaryTone}
              className="filter drop-shadow-[0_0_35px_rgba(0,0,0,0.6)] pointer-events-none opacity-80"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Central Application Shell Wrapper */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        {/* Header Bar: Brand, Step Indicator, Narration & Controls */}
        <header className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-stone-200/80 bg-white/90 backdrop-blur-md shrink-0 z-20 shadow-xs">
          {/* Brand & Progress Label */}
          <div className="flex items-center gap-3">
            <AfricaUnLogo 
              className="w-9 h-9 shrink-0" 
              interactive={false} 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-wider text-sm sm:text-base uppercase text-stone-900">
                  Africalia
                </span>
                <span className="text-emerald-700 font-semibold text-xs tracking-widest uppercase">
                  • Data Atlas
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-600 font-normal">
                <span>{t('onboarding.curated_orientation', 'Curated Orientation')}</span>
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                <span className="font-mono text-amber-800 font-semibold">{`${activeScreen.stageNumber} / 04`}</span>
              </div>
            </div>
          </div>

          {/* Action Controls: Voice Narration, Shortcuts, Language & Skip */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Keyboard Shortcuts Hint */}
            <button
              onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Keyboard navigation shortcuts (← / → / Esc)"
            >
              <Keyboard className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden md:inline text-[11px] font-mono">Shortcuts</span>
            </button>

            {/* Voice Narration Button */}
            <button
              onClick={handleToggleVoice}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                isSpeaking 
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400/40' 
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200 hover:text-stone-900'
              }`}
              title={isSpeaking ? 'Mute narrator voice' : 'Listen with natural African female narrator'}
              aria-label="Toggle voice narration"
            >
              {isSpeaking ? (
                <>
                  <div className="flex items-end gap-0.5 h-3.5 w-4">
                    <span className="w-1 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
                    <span className="w-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s] h-2/3" />
                    <span className="w-1 bg-amber-700 rounded-full animate-bounce h-full" />
                  </div>
                  <span className="hidden sm:inline font-medium text-amber-900">Narrating</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
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
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
              title="Close & Enter Data Atlas"
              aria-label="Close onboarding and enter default app"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Floating Keyboard Shortcuts Drawer */}
        <AnimatePresence>
          {showKeyboardShortcuts && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 sm:px-8 py-2 bg-white/95 border-b border-stone-200 text-xs text-stone-700 flex items-center justify-between z-20 backdrop-blur-md shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
                <span><kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-amber-800 font-semibold">→</kbd> Next Screen</span>
                <span><kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-amber-800 font-semibold">←</kbd> Previous Screen</span>
                <span><kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-amber-800 font-semibold">Esc</kbd> Exit to Atlas</span>
                <span><kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-amber-800 font-semibold">Swipe</kbd> Mobile gesture</span>
              </div>
              <button 
                onClick={() => setShowKeyboardShortcuts(false)}
                className="text-stone-500 hover:text-stone-800 text-xs cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Centered Content Slides & Cards Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 flex items-center justify-center min-h-0 z-10 transition-opacity duration-300">
          <div className="w-full max-w-5xl mx-auto my-auto">
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={currentStepIndex}
                custom={slideDirection}
                initial={{ opacity: 0, x: slideDirection * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection * -40 }}
                transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
                drag={currentStepIndex < 3 ? "x" : undefined}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                className={`rounded-3xl border ${activeScreen.cardBorder} ${activeScreen.cardBg} shadow-[0_12px_40px_rgba(40,25,10,0.06)] p-4 sm:p-6 md:p-8 relative overflow-hidden flex flex-col justify-between gap-4 sm:gap-5 touch-pan-y backdrop-blur-md`}
              >
                {/* Stage Header, Badge & Narrative */}
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${activeScreen.accentBadgeBg} ${activeScreen.accentBadgeBorder} ${activeScreen.accentBadgeText}`}>
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{activeScreen.stageBadge}</span>
                    </span>

                    <span className="text-[11px] font-mono text-stone-600 font-medium bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
                      {activeScreen.regionFocus}
                    </span>
                  </div>

                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight ${activeScreen.headerColor} mb-2`}>
                    {activeScreen.header}
                  </h1>

                  <p className={`text-sm sm:text-base md:text-lg ${activeScreen.bodyColor} leading-relaxed font-normal`}>
                    {activeScreen.body}
                  </p>
                </div>

                {/* ========================================================= */}
                {/* SCREEN 1: PERSONA SELECTOR TRACKS (HISTORY & HERITAGE)    */}
                {/* ========================================================= */}
                {currentStepIndex === 0 && (
                  <div className="relative z-10 w-full pt-1">
                    <PersonaSelector 
                      stage="history"
                      onSelectTrack={handleSelectPersonaTrack} 
                      selectedTrackId={selectedPersonaId}
                    />
                  </div>
                )}

                {/* ========================================================= */}
                {/* SCREEN 2: PERSONA SELECTOR TRACKS (ECONOMY & DEVELOPMENT) */}
                {/* ========================================================= */}
                {currentStepIndex === 1 && (
                  <div className="relative z-10 w-full pt-1">
                    <PersonaSelector 
                      stage="economy"
                      onSelectTrack={handleSelectPersonaTrack} 
                      selectedTrackId={selectedPersonaId}
                    />
                  </div>
                )}

                {/* Dynamic Vector Continent Visualizer (Screens 1, 2, 3) */}
                {currentStepIndex < 3 && (
                  <div className="relative z-10 w-full">
                    <OnboardingContinentVisualizer theme={activeScreen.artTheme} />
                  </div>
                )}

                {/* Interactive Live Mini Feature Spotlights (Screens 1, 2, 3) */}
                {currentStepIndex < 3 && (
                  <div className="relative z-10 w-full">
                    <InteractiveFeatureSpotlight stage={activeScreen.artTheme} />
                  </div>
                )}

                {/* ========================================================= */}
                {/* SCREEN 3: TOPIC DESTINATION CARDS                         */}
                {/* ========================================================= */}
                {currentStepIndex === 2 && (
                  <div className="relative z-10 w-full space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-amber-900">
                          Curated Exploratory Gateways
                        </h3>
                      </div>
                      <span className="text-xs text-stone-500 font-normal hidden sm:inline">
                        Tap any topic gateway to navigate directly to its dedicated page
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {TOPIC_CTAS.map((topic) => {
                        const Icon = topic.icon;
                        return (
                          <button
                            key={topic.id}
                            onClick={() => handleChooseDestination(topic.id)}
                            className={`text-left p-3.5 rounded-2xl border ${topic.cardBorder} ${topic.cardHoverBorder} ${topic.cardBg} transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-2`}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className={`p-2 rounded-xl ${topic.iconBg}`}>
                                <Icon className={`w-4 h-4 ${topic.iconColor}`} />
                              </div>
                              <span className={`text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded-lg border ${topic.badgeBg} ${topic.badgeBorder} ${topic.badgeText}`}>
                                {topic.tag}
                              </span>
                            </div>
                            <div>
                              <h4 className={`font-serif font-bold text-sm text-stone-900 flex items-center justify-between ${topic.titleHover} transition-colors`}>
                                <span>{topic.title}</span>
                                <ChevronRight className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </h4>
                              <p className="text-[11px] text-stone-600 leading-snug mt-0.5 font-normal">
                                {topic.subtitle}
                              </p>
                              <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center gap-1.5 text-[10px] font-mono text-stone-500">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span>{topic.microMetrics}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}

                      {/* Master Continental Dashboard Entry Card */}
                      <button
                        onClick={() => handleChooseDestination('overview')}
                        className="text-left p-3.5 rounded-2xl border border-dashed border-emerald-300 bg-white hover:bg-emerald-50/50 hover:border-emerald-500 transition-all duration-200 cursor-pointer group flex flex-col justify-between gap-2 shadow-xs"
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                            <AfricaUnLogo size={22} interactive={false} />
                          </div>
                          <span className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                            Core Atlas
                          </span>
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-stone-900 flex items-center justify-between group-hover:text-emerald-800 transition-colors">
                            <span>Complete Overview</span>
                            <ChevronRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </h4>
                          <p className="text-[11px] text-stone-600 leading-snug mt-0.5 font-normal">
                            Master Continental Dashboard, Map, Weather & Indicators
                          </p>
                          <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center gap-1.5 text-[10px] font-mono text-emerald-700">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            <span>54 Flags • Real-time Data Feeds</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* SCREEN 4: FULL ACADEMIC ADVISORY & DUAL SPACE ENTRY       */}
                {/* ========================================================= */}
                {currentStepIndex === 3 && (
                  <div className="relative z-10 w-full space-y-4">
                    {!showDualEntryPanels ? (
                      <div className="space-y-4">
                        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/90 border border-stone-200 text-sm text-stone-700 leading-relaxed shadow-xs">
                          {/* Main Title & Status Badge */}
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2 text-amber-900 font-bold font-serif text-base">
                              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                              <span>Academic Protocol, Provenance & Institutional Independence</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100/70 text-amber-900 border border-amber-300/60">
                              Open-Access Scholarly Standard
                            </span>
                          </div>

                          {/* Foundational Framing Callout */}
                          <p className="font-medium text-stone-900 text-xs sm:text-sm md:text-[14.5px] border-l-4 border-amber-600 pl-4 sm:pl-5 pr-4 py-3 sm:py-3.5 bg-amber-50/80 rounded-r-2xl mb-5 leading-relaxed sm:leading-loose shadow-2xs">
                            Africalia is an independent, open-access digital humanities portal dedicated to historical documentation, demographic cartography, and macroeconomic analysis across the African continent and transatlantic diaspora.
                          </p>

                          {/* 4 Structured Academic Protocol Pillars */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1">
                            {/* Pillar 1: Institutional Non-Affiliation */}
                            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Building2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                  <strong className="text-amber-950 text-xs font-bold font-serif">
                                    Institutional Independence:
                                  </strong>
                                </div>
                                <p className="text-[11.5px] text-stone-600 font-normal leading-relaxed">
                                  Africalia is an independent platform and is <strong>not affiliated with, sponsored by, or an official organ</strong> of the United Nations (UN), African Union (AU), World Bank, AfDB, or national governments. Standard taxonomies (UN Geoscheme, AU RECs) are applied solely for analytical standardization.
                                </p>
                              </div>
                            </div>

                            {/* Pillar 2: Authorship & Researcher Autonomy */}
                            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <GraduationCap className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                  <strong className="text-emerald-950 text-xs font-bold font-serif">
                                    Scholarly Authorship & Autonomy:
                                  </strong>
                                </div>
                                <p className="text-[11.5px] text-stone-600 font-normal leading-relaxed">
                                  All indexed academic treatises, peer-reviewed monographs, and historical datasets belong exclusively to their respective authors and journals. <strong>Inclusion does not imply that cited scholars endorse or are associated with Africalia</strong> unless formal bilateral affiliation is explicitly documented.
                                </p>
                              </div>
                            </div>

                            {/* Pillar 3: Source Integrity & Verifiability */}
                            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Database className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                                  <strong className="text-indigo-950 text-xs font-bold font-serif">
                                    Source Integrity & Verifiability:
                                  </strong>
                                </div>
                                <p className="text-[11.5px] text-stone-600 font-normal leading-relaxed">
                                  Primary archival voyage records (TAST 36,000+ voyages) and multilateral indicators (WDI, IMF WEO) link directly to source DOIs and open repositories. Raw historical records and manifests are rendered <strong>without algorithmic alteration or ideological revisionism</strong>.
                                </p>
                              </div>
                            </div>

                            {/* Pillar 4: Ethical Archival Protocol */}
                            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Scale className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                                  <strong className="text-stone-950 text-xs font-bold font-serif">
                                    Sensitive Archival Ethics:
                                  </strong>
                                </div>
                                <p className="text-[11.5px] text-stone-600 font-normal leading-relaxed">
                                  All transatlantic demographic records, captivity manifests, and ethnolinguistic classifications adhere to international digital humanities ethics (UNESCO Slave Route Project), treating sensitive human records with scholarly rigor, dignity, and cultural respect.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Toggleable Scholarly Methodology & Errata Framework */}
                          <div className="mt-3 pt-3 border-t border-stone-200">
                            <button
                              type="button"
                              onClick={() => setIsMethodologyOpen(!isMethodologyOpen)}
                              className="text-xs text-stone-700 hover:text-amber-900 flex items-center justify-between w-full font-medium transition-colors cursor-pointer bg-white/70 hover:bg-white p-2 rounded-xl border border-stone-200/80"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-amber-700" />
                                <span className="font-semibold text-stone-800">
                                  {isMethodologyOpen ? 'Hide Scholarly Citation & Methodology Framework' : 'View Full Scholarly Citation, Methodology & Errata Protocol'}
                                </span>
                              </div>
                              <span className="text-[11px] text-amber-800 font-mono underline">
                                {isMethodologyOpen ? 'Collapse' : 'Expand Details'}
                              </span>
                            </button>

                            {isMethodologyOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2.5 p-3.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 space-y-2.5 shadow-xs"
                              >
                                <div className="font-semibold text-amber-950 flex items-center gap-1.5">
                                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Primary Academic Sources & Data Providers:</span>
                                </div>
                                <ul className="space-y-1 text-[11px] text-stone-600 pl-2">
                                  <li className="list-disc ml-3">
                                    <strong>Trans-Atlantic Slave Trade Database (TAST)</strong>: Emory University, Harvard Hutchins Center, and W.E.B. Du Bois Institute (36,000+ documented voyages; Eltis et al. methodology).
                                  </li>
                                  <li className="list-disc ml-3">
                                    <strong>Multilateral Macroeconomic Indicators</strong>: World Bank World Development Indicators (WDI), IMF World Economic Outlook, UN DESA Population Division & UNESCO Institute for Statistics.
                                  </li>
                                  <li className="list-disc ml-3">
                                    <strong>Regional Integration & Trade</strong>: AfCFTA Secretariat, African Union Commission Agenda 2063 frameworks, and regional power pool synchronizations (SAPP, WAPP, EAPP).
                                  </li>
                                </ul>

                                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-500">
                                  <span><strong>Citation Standard:</strong> APA 7th / Chicago 17th / BibTeX formats available in all export modules.</span>
                                  <span><strong>Peer Errata Policy:</strong> Corrections welcomed via open research repository audit.</span>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Primary Action Button */}
                        <button
                          onClick={() => setShowDualEntryPanels(true)}
                          className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-700/30 shadow-sm active:scale-[0.99]"
                        >
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>I Understand & Enter Space</span>
                        </button>
                      </div>
                    ) : (
                      /* State 2: Dual Entry Panels */
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                              Select Your Curated Entry Space
                            </h3>
                          </div>
                          <button
                            onClick={() => setShowDualEntryPanels(false)}
                            className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                          >
                            ← Review Academic Protocol
                          </button>
                        </div>

                        {/* Dual Interactive Panels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                          {/* OPTION 1: ETHNIC TREE EXPLORER */}
                          <div
                            onClick={() => handleChooseDestination('ethnic-tree')}
                            className="group relative p-5 rounded-3xl bg-white border border-amber-200 hover:border-amber-400 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800 border border-amber-200">
                                    <TreeDeciduous className="w-5 h-5 text-amber-700" />
                                  </div>
                                  <div>
                                    <span className="text-[11px] uppercase font-semibold tracking-widest text-amber-700 block">
                                      Option 1 • Atlantic Lineages
                                    </span>
                                    <h4 className="font-serif font-bold text-lg sm:text-xl text-stone-900 group-hover:text-amber-800 transition-colors">
                                      Ethnic Tree Explorer
                                    </h4>
                                  </div>
                                </div>
                                <span className="text-[11px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                  TAST & Lineages
                                </span>
                              </div>

                              <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-2xl overflow-hidden bg-stone-100 border border-amber-200/80 flex items-center justify-center mb-3">
                                <img 
                                  src="/africalia-ethnic-tree.svg" 
                                  alt="Ethnic Tree of Life Vector Diagram" 
                                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-white/95 text-stone-800 border border-stone-200 text-xs font-medium flex items-center gap-1.5 shadow-sm backdrop-blur-md">
                                  <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                                  <span className="font-semibold text-stone-900">Ethnolinguistic Tree</span>
                                  <span className="text-stone-500">| 36K+ Voyages</span>
                                </div>
                              </div>

                              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 space-y-1">
                                <div className="flex items-center gap-1.5 text-amber-800 text-xs font-semibold uppercase tracking-wider">
                                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Ancestral Homeland & Genetic Blueprint</span>
                                </div>
                                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                  Immerse in the Transatlantic Ethnic Tree of Life — indexing 36,000+ historical slave trade voyages, ancestral homelands, linguistic branches, and molecular genetic blueprints connecting the Atlantic Diaspora across continents.
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChooseDestination('ethnic-tree');
                              }}
                              className="w-full py-3 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-700/30 shadow-sm"
                            >
                              <span>Launch Ethnic Tree Explorer</span>
                              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>

                          {/* OPTION 2: DIGITAL DATA ATLAS */}
                          <div
                            onClick={() => handleChooseDestination('overview')}
                            className="group relative p-5 rounded-3xl bg-white border border-emerald-200 hover:border-emerald-400 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    <Database className="w-5 h-5 text-emerald-700" />
                                  </div>
                                  <div>
                                    <span className="text-[11px] uppercase font-semibold tracking-widest text-emerald-700 block">
                                      Option 2 • Continental Intelligence
                                    </span>
                                    <h4 className="font-serif font-bold text-lg sm:text-xl text-stone-900 group-hover:text-emerald-800 transition-colors">
                                      Digital Data Atlas
                                    </h4>
                                  </div>
                                </div>
                                <span className="text-[11px] uppercase font-semibold tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  Overview & GIS
                                </span>
                              </div>

                              <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-2xl overflow-hidden bg-stone-100 border border-emerald-200/80 flex items-center justify-center mb-3">
                                <img 
                                  src="/atlas-hero-preview.jpg" 
                                  alt="Digital Data Atlas Continental Overview Screenshot" 
                                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <AfricaUnLogo size={70} interactive={false} glow={false} />
                                </div>
                                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-white/95 text-stone-800 border border-stone-200 text-xs font-medium flex items-center gap-1.5 shadow-sm backdrop-blur-md">
                                  <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="font-semibold text-stone-900">54 Nations GIS</span>
                                  <span className="text-stone-500">| Real-time Data</span>
                                </div>
                              </div>

                              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 space-y-1">
                                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Multilateral Indicators & AfCFTA Corridor</span>
                                </div>
                                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                                  Engage with Africa's definitive geospatial and econometric intelligence engine — real-time multilateral indicator feeds, 54 sovereign country dossiers, $3.4T AfCFTA trade corridors, and AU Agenda 2063 benchmarks.
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChooseDestination('overview');
                              }}
                              className="w-full py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-700/30 shadow-sm"
                            >
                              <span>Launch Digital Data Atlas</span>
                              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
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
        <footer className="flex items-center justify-between px-4 sm:px-8 py-3 border-t border-stone-200/80 bg-white/90 backdrop-blur-md shrink-0 z-20 shadow-xs">
          {/* Step Progression Indicators with Step Names */}
          <div className="flex items-center gap-2 sm:gap-3">
            {ONBOARDING_SCREENS.map((screen, idx) => {
              const stepTitles = ['Heritage', 'Realities', 'Horizon', 'Entry'];
              return (
                <button
                  key={screen.id}
                  onClick={() => handleJumpToStep(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    idx === currentStepIndex 
                      ? 'w-12 bg-amber-500' 
                      : 'w-3 bg-stone-200 hover:bg-stone-300'
                  }`}
                  aria-label={`Jump to step ${idx + 1}: ${stepTitles[idx]}`}
                  title={`Step ${idx + 1}: ${stepTitles[idx]}`}
                />
              );
            })}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-2.5">
            {(currentStepIndex > 0 || showDualEntryPanels) && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-900 text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            {currentStepIndex < ONBOARDING_SCREENS.length - 1 ? (
              <button
                onClick={handleNext}
                className={`px-5 py-2 rounded-xl ${activeScreen.actionBtnBg} ${activeScreen.actionBtnHover} ${activeScreen.actionBtnText} text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${activeScreen.actionBtnBorder}`}
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : !showDualEntryPanels ? (
              <button
                onClick={() => setShowDualEntryPanels(true)}
                className={`px-5 py-2 rounded-xl ${activeScreen.actionBtnBg} ${activeScreen.actionBtnHover} ${activeScreen.actionBtnText} text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${activeScreen.actionBtnBorder}`}
              >
                <span>Enter Space</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </footer>
      </div>
    </div>
  );
};
