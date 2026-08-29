import React, { useState, useEffect } from 'react';
import {
  MASTER_REPORT_SECTIONS,
  GEONOMIC_DIVERSITY_GRADIENT,
  NUNN_SLAVE_TRADE_EXTRACTION,
  TADEI_MONOPSONY_CASE_STUDIES,
  CONTEMPORARY_GEOPOLITICAL_PARADIGMS,
  PRE_COLONIAL_GOVERNANCE_DATA,
  COMPOUNDING_STRUCTURAL_EPOCHS,
  CompoundingStructuralEpoch,
  MasterReportSection
} from '../data/africanDevelopmentMasterData';
import {
  FileText,
  Dna,
  ShieldAlert,
  Scale,
  Layers,
  Globe2,
  BookOpen,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  AlertTriangle,
  Landmark,
  DollarSign,
  Activity,
  Compass,
  CheckCircle2,
  Info,
  Flame,
  ArrowDownRight,
  Share2,
  Download,
  Calendar,
  Clock,
  Copy,
  Check,
  Anchor
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ComposedChart
} from 'recharts';

interface AfricanDevelopmentMasterReportViewProps {
  onNavigateToAtlas?: () => void;
  onNavigateToMolecular?: () => void;
}

export const AfricanDevelopmentMasterReportView: React.FC<AfricanDevelopmentMasterReportViewProps> = ({
  onNavigateToAtlas,
  onNavigateToMolecular
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('executive_summary');
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(0);
  const [activeCommodityIndex, setActiveCommodityIndex] = useState<number>(0);
  const [fontSizeClass, setFontSizeClass] = useState<'normal' | 'large'>('normal');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const activeEpoch = COMPOUNDING_STRUCTURAL_EPOCHS[activeEpochIndex] || COMPOUNDING_STRUCTURAL_EPOCHS[0];
  const activeCommodity = TADEI_MONOPSONY_CASE_STUDIES[activeCommodityIndex];

  // Helper for rendering icons
  const getSectionIcon = (iconName: string, className: string = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'FileText': return <FileText className={className} />;
      case 'Dna': return <Dna className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Globe2': return <Globe2 className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      default: return <FileText className={className} />;
    }
  };

  // Scroll listener for active section indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (const section of MASTER_REPORT_SECTIONS) {
        const element = document.getElementById(`sec-${section.id}`);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSectionId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(`sec-${id}`);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCopyCitation = () => {
    const citationText = `Acemoglu, D., Nunn, N., & Robinson, J. A. (2026). The Structural & Evolutionary Foundations of African Development: An Interdisciplinary Synthesis. Global Economic History Dossier, 16(1), 1-84.`;
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  return (
    <div className={`report-frame max-w-[1440px] mx-auto border-x border-[#D7D6CD] dark:border-[#2D2E2A] px-4 sm:px-8 lg:px-12 py-10 sm:py-14 transition-colors duration-300 ${fontSizeClass === 'large' ? 'text-[1.125rem]' : 'text-[1.063rem]'}`} id="african-development-master-report-view">
      
      {/* 1. ASYMMETRIC EDITORIAL HEADER BLOCK */}
      <header className="border-b-2 border-[#181816] dark:border-[#E6E3DB] pb-10 mb-14 relative">
        <div className="space-y-6">
          
          {/* Top Metadata Kicker */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono uppercase tracking-[0.15em] text-[#5C5C55] dark:text-[#A8A499] font-semibold">
            <div className="flex items-center gap-2">
              <button 
                onClick={onNavigateToAtlas}
                className="hover:underline text-[#343430] dark:text-[#E6E3DB] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#9E6A2E] dark:text-[#D4A060]" />
                <span>Atlantic Slave Trade Atlas</span>
              </button>
              <span>//</span>
              <span>Research Report // Vol. 16</span>
              <span>//</span>
              <span>Comparative Development</span>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSizeClass(prev => prev === 'normal' ? 'large' : 'normal')}
                className="px-3.5 py-1.5 rounded-lg border border-[#D7D6CD] dark:border-[#2D2E2A] bg-transparent hover:bg-[#181816] hover:text-[#FAFAF6] dark:hover:bg-[#E6E3DB] dark:hover:text-[#181816] text-[#181816] dark:text-[#E6E3DB] text-[0.75rem] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                title="Toggle Reading Font Size"
              >
                Font: {fontSizeClass === 'normal' ? 'Standard' : 'Enlarged'}
              </button>
              <button
                onClick={handleCopyCitation}
                className="px-3.5 py-1.5 rounded-lg border border-[#D7D6CD] dark:border-[#2D2E2A] bg-transparent hover:bg-[#181816] hover:text-[#FAFAF6] dark:hover:bg-[#E6E3DB] dark:hover:text-[#181816] text-[#181816] dark:text-[#E6E3DB] text-[0.75rem] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-[#3F6955] dark:text-[#76A890]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Copied Cite' : 'Cite Report'}</span>
              </button>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-4 pt-1">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#181816] dark:text-[#E6E3DB] leading-[1.1] max-w-5xl">
              The Structural & Evolutionary Foundations of African Development
            </h1>
            <p className="font-sans font-light text-lg sm:text-xl text-[#343430] dark:text-[#CCC8BC] leading-relaxed max-w-4xl">
              An Interdisciplinary Master Treatise Uniting Macro-Geonomic, Historical-Institutional, and Contemporary Geopolitical Frontiers
            </p>
          </div>

          {/* Editorial Meta Strip */}
          <div className="pt-5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5C5C55] dark:text-[#A8A499] border-t border-[#D7D6CD] dark:border-[#2D2E2A]">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published August 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>28 min read • 6,800 words</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#9E6A2E] dark:text-[#D4A060]" />
                <span>Econometric & Archival Synthesis (AER, QJE, UN GA Records)</span>
              </div>
            </div>
            <div className="text-[11px]">
              Series: <span className="underline font-medium">Comparative Institutional History & Geopolitics</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. EXECUTIVE ABSTRACT & QUANTITATIVE INDICATORS HERO BLOCK */}
      <section className="space-y-8 mb-16 sm:mb-20">
        {/* Executive Abstract Hero Card - Calm Editorial Japanese Paper Surface */}
        <div className="bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] p-7 sm:p-9 rounded-2xl shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#9E6A2E] dark:bg-[#BF843E]" />
          <div className="max-w-4xl space-y-4 pl-2 sm:pl-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[#9E6A2E] dark:text-[#D4A060] font-semibold">
              <span>Executive Epistemic Summary</span>
            </div>
            <p className="font-serif text-lg sm:text-xl md:text-[1.35rem] text-[#1A1A18] dark:text-[#E6E3DB] leading-relaxed italic font-normal">
              “This master synthesis systematically deconstructs reductionist and ahistorical narratives of Sub-Saharan African underdevelopment by uniting three major academic frontiers: the Macro-Geonomic baseline, the compounding Historical-Institutional traumas, and the decisive 2025–2026 Contemporary Geopolitical shifts.”
            </p>
            <p className="font-sans font-light text-sm sm:text-[0.938rem] text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
              From the deep-time <strong>Serial Founder Effect</strong> and the <strong>Ashraf-Galor diversity curve</strong>, to Nathan Nunn’s <strong>intergenerational mistrust scar</strong>, Acemoglu-Robinson settler mortality, and Federico Tadei’s <strong>colonial monopsony price gaps</strong> (extracting &gt;60–85% of African peasant gains from trade), to the landmark <strong>March 25, 2026 UN General Assembly Slavery Resolution (123-3)</strong>.
            </p>
          </div>
        </div>

        {/* Harmonious 1-Row Quantitative Benchmarks (Calm Mineral & Earth Tonal Palette) */}
        <div className="space-y-4 pt-1">
          <div className="flex flex-nowrap items-stretch gap-3.5 overflow-x-auto no-scrollbar pb-1.5 w-full">
            {/* Pill 1: RAO Baseline (Eastern Africa - Muted Amber #F9F6EE / Dark Clay #211E17, Accent #9E6A2E) */}
            <div className="flex-1 min-w-[210px] p-4 rounded-xl bg-[#F9F6EE] dark:bg-[#211E17] border border-[#E5DECD] dark:border-[#373124] flex flex-col justify-between shadow-2xs hover:border-[#9E6A2E]/40 transition-all">
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#E5DECD]/70 dark:border-[#373124]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9E6A2E] dark:text-[#D4A060]">RAO Baseline</span>
                <span className="font-serif font-semibold text-xs sm:text-sm text-[#181816] dark:text-[#E6E3DB]">~150 kya</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light tracking-tight">
                Mitochondrial Eve and Y-Chromosomal Adam coalesce in East Africa. Africa has the world’s highest genetic diversity.
              </p>
            </div>

            {/* Pill 2: Victims (Southern Africa - Muted Terracotta #FAF3F1 / Dark Sienna #221817, Accent #A64E3E) */}
            <div className="flex-1 min-w-[210px] p-4 rounded-xl bg-[#FAF3F1] dark:bg-[#221817] border border-[#E8D9D5] dark:border-[#3A2724] flex flex-col justify-between shadow-2xs hover:border-[#A64E3E]/40 transition-all">
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#E8D9D5]/70 dark:border-[#3A2724]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A64E3E] dark:text-[#DB8B7D]">Victims</span>
                <span className="font-serif font-semibold text-xs sm:text-sm text-[#A64E3E] dark:text-[#DB8B7D]">18M+</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light tracking-tight">
                Depletes demographics and embeds the intergenerational “Mistrust Scar.”
              </p>
            </div>

            {/* Pill 3: Pre-Colonial Autonomy (Middle Africa - Muted Mulberry #F9F4F8 / Dark Plum #20181F, Accent #854972) */}
            <div className="flex-1 min-w-[210px] p-4 rounded-xl bg-[#F9F4F8] dark:bg-[#20181F] border border-[#E3D9E1] dark:border-[#352533] flex flex-col justify-between shadow-2xs hover:border-[#854972]/40 transition-all">
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#E3D9E1]/70 dark:border-[#352533]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#854972] dark:text-[#C98EB6]">Autonomy</span>
                <span className="font-serif font-semibold text-xs sm:text-sm text-[#181816] dark:text-[#E6E3DB]">98.2%</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light tracking-tight">
                45,000 decentralized polities subjugated under autocratic indirect colonial rule.
              </p>
            </div>

            {/* Pill 4: Monopsony (Northern Africa - Muted Slate #F2F5F8 / Dark Indigo #181E24, Accent #3B5B75) */}
            <div className="flex-1 min-w-[210px] p-4 rounded-xl bg-[#F2F5F8] dark:bg-[#181E24] border border-[#D3DDE6] dark:border-[#27323C] flex flex-col justify-between shadow-2xs hover:border-[#3B5B75]/40 transition-all">
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#D3DDE6]/70 dark:border-[#27323C]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3B5B75] dark:text-[#7B9BB5]">Monopsony</span>
                <span className="font-serif font-semibold text-xs sm:text-sm text-[#3B5B75] dark:text-[#7B9BB5]">&gt;85% GFT</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light tracking-tight">
                Colonial trading cartels extract up to 85% of peasant gains from trade.
              </p>
            </div>

            {/* Pill 5: UN GA (Western Africa - Muted Sage #F3F7F4 / Dark Spruce #16211C, Accent #3F6955) */}
            <div className="flex-1 min-w-[210px] p-4 rounded-xl bg-[#F3F7F4] dark:bg-[#16211C] border border-[#D5E2D9] dark:border-[#25362E] flex flex-col justify-between shadow-2xs hover:border-[#3F6955]/40 transition-all">
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#D5E2D9]/70 dark:border-[#25362E]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3F6955] dark:text-[#76A890]">UN GA 2026</span>
                <span className="font-serif font-semibold text-xs sm:text-sm text-[#3F6955] dark:text-[#76A890]">123–3</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light tracking-tight">
                The landmark March 25, 2026, UN General Assembly Slavery Resolution.
              </p>
            </div>
          </div>

          {/* Prominent & Engaging Companion Volume Action Bar (Burnt Sienna/Terracotta Tone) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 px-1">
            <div className="flex items-center gap-2 text-[11px] text-[#5C5C55] dark:text-[#A8A499] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#3F6955] dark:bg-[#6EA88F]"></span>
              <span className="tracking-tight font-medium">Interdisciplinary Research Series</span>
            </div>
            <button
              onClick={onNavigateToMolecular}
              className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-xl bg-[#A64E3E] hover:bg-[#8E3F31] text-[#FAF8F5] dark:bg-[#C25E4A] dark:hover:bg-[#B0503D] dark:text-[#181816] font-sans text-xs font-semibold shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 dark:bg-black/15 flex items-center justify-center shrink-0">
                <Dna className="w-3.5 h-3.5 text-[#FAF8F5] dark:text-[#181816] group-hover:rotate-12 transition-transform" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-white/90 dark:text-[#181816]/85 font-bold leading-none">Companion Article</span>
                <span className="text-xs font-semibold tracking-tight leading-tight">Molecular & Material Legacies</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#FAF8F5] dark:text-[#181816] group-hover:translate-x-1 transition-transform ml-0.5 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION NAVIGATION SELECTOR BAR (FULL WIDTH, WARM BACKGROUND, STICKY BELOW TOPBAR top-16) */}
      <div className="mb-14 sm:mb-16 sticky top-16 z-30 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 py-3 bg-[#F4EFE6]/95 dark:bg-[#1C1A17]/95 backdrop-blur-md border-y border-[#E2DAD0] dark:border-[#332E27] shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar justify-start md:justify-center max-w-5xl mx-auto py-0.5">
          {MASTER_REPORT_SECTIONS.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2D2926] text-[#FAF8F5] dark:bg-[#E8E2D5] dark:text-[#181816] font-semibold shadow-xs'
                    : 'bg-[#FAF7F0]/80 dark:bg-[#25221E]/80 text-[#605A52] dark:text-[#BBB4A7] hover:text-[#181816] dark:hover:text-[#FAF8F5] border border-[#E2DAD0] dark:border-[#38332C] hover:bg-[#EBE4D8] dark:hover:bg-[#2D2924] font-normal'
                }`}
              >
                {getSectionIcon(sec.iconName, 'w-3.5 h-3.5 shrink-0 opacity-80')}
                <span>{sec.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FULL CONTINUOUS EDITORIAL READING ENGINE (ALL SECTIONS DISPLAYED IN FULL) */}
      <main className="max-w-4xl mx-auto space-y-28 sm:space-y-36 lg:space-y-40 text-left">
          
          {/* ========================================================= */}
          {/* CHAPTER 1: EXECUTIVE SUMMARY & COMPOUNDING TRAJECTORY */}
          {/* ========================================================= */}
          <section id="sec-executive_summary" className="space-y-8 pt-4 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#9E6A2E] dark:text-[#D4A060] block">
                Chapter 01 // Executive Overview & Epistemological Framework
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Executive Synthesis & Compounding Epochs
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
                A unified econometric and historical framework deconstructing African comparative development across deep-time, colonial monopsonies, and contemporary geopolitical reform.
              </p>
            </div>

            {/* 3 Core Theses - Japandi Paper Surface #F6F4ED */}
            <div className="space-y-4">
              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#9E6A2E] dark:bg-[#BF843E]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">1. The Macro-Geonomic Frontier</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Traces the prehistoric <em>Recent African Origin</em> (RAO) migration gradient. The Serial Founder Effect caused genetic diversity to drop monotonically with distance from East Africa, establishing the <strong>Ashraf-Galor diversity-development trade-off</strong> between cognitive innovation benefits and social coordination friction.
                </p>
                <span className="text-[11px] font-mono text-[#9E6A2E] dark:text-[#D4A060] block font-medium pl-1.5">Ref: Ashraf & Galor (AER 2013)</span>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A64E3E] dark:bg-[#C26252]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">2. Historical-Institutional Traumas</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Quantifies four compounding historical shocks: the <strong>18M+ slave trade drainage</strong> that scarred interpersonal trust (Nunn & Wantchekon), <strong>Acemoglu-Robinson settler mortality</strong>, <strong>Henn-Robinson pre-colonial decentralization destruction</strong>, and <strong>Tadei’s colonial monopsony price gaps</strong> extracting &gt;60–85% of African peasant gains from trade.
                </p>
                <span className="text-[11px] font-mono text-[#A64E3E] dark:text-[#DB8B7D] block font-medium pl-1.5">Ref: Nunn (2008), Tadei (2020), Henn & Robinson (2024)</span>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3F6955] dark:bg-[#6EA88F]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">3. Contemporary Geopolitical Battles</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Details the 2025–2026 transition from "requesting development aid" to "demanding structural rule-making power": the <strong>March 25, 2026 UN General Assembly Slavery Resolution (123-3)</strong>, the <strong>AU-CARICOM Joint 19-Point Accra Plan</strong>, <strong>Bridgetown 3.0</strong>, and <strong>South Africa's G20 Leadership</strong>.
                </p>
                <span className="text-[11px] font-mono text-[#3F6955] dark:text-[#76A890] block font-medium pl-1.5">Ref: UN GA Res. (Mar 2026), Mottley (2026)</span>
              </div>
            </div>

            {/* Synthesized Compounding Shocks Timeline Visualizer (FIG. 01) */}
            <figure className="my-12 sm:my-14 pb-6 border-b border-[#DCD9CE] dark:border-[#2C2E2A] space-y-5">
              <figcaption className="mb-2">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#9E6A2E] dark:text-[#D4A060] font-semibold block mb-1.5">
                  Fig. 01 // Structural Trajectory
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1.5">
                  Compounding Epochs of African Comparative Development
                </h4>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] leading-relaxed">
                  Interactive multi-channel trajectory tracking how prehistoric genetic baselines, transatlantic demographic extractions, colonial trade monopsonies, and 2026 multilateral rule-making power shaped structural economic outcomes (150,000 BP – 2026+ CE).
                </p>
              </figcaption>

              {/* Epoch Selector Stepper Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                {COMPOUNDING_STRUCTURAL_EPOCHS.map((epoch, idx) => (
                  <button
                    key={epoch.id}
                    onClick={() => setActiveEpochIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                      activeEpochIndex === idx
                        ? 'bg-[#1E1E1C] text-[#FAF8F5] dark:bg-[#E6E3DB] dark:text-[#181816] font-semibold shadow-2xs'
                        : 'bg-[#FFFFFF] dark:bg-[#181A16] text-[#55554E] dark:text-[#A8A499] hover:text-[#181816] dark:hover:text-[#E6E3DB] border border-[#DCD9CE] dark:border-[#2C2E2A]'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-75">{epoch.epochLabel}</span>
                    <span className="truncate max-w-[140px] sm:max-w-none">{epoch.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Interactive Trajectory Chart */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#F0EDE4] dark:border-[#232622]">
                  <span className="font-mono text-[11px] text-[#77776E] dark:text-[#A8A499] uppercase tracking-wider">
                    Econometric Indicators Across Epochs (0–100 Scale)
                  </span>
                  <span className="text-[11px] font-mono text-[#9E6A2E] dark:text-[#D4A060]">
                    Selected Epoch: <strong>{activeEpoch.timeRange}</strong>
                  </span>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={COMPOUNDING_STRUCTURAL_EPOCHS}
                      margin={{ top: 15, right: 20, left: -10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECE8DC" strokeOpacity={0.8} vertical={false} />
                      <XAxis
                        dataKey="epochLabel"
                        stroke="#8A8A80"
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#8A8A80"
                        fontSize={11}
                        domain={[0, 100]}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E1E1C',
                          borderColor: '#343430',
                          borderRadius: '12px',
                          color: '#FAF8F5',
                          fontSize: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        formatter={(val: number) => [`${val}% / Index`, '']}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="extractivePressurePct"
                        name="Extractive Institutional Pressure (%)"
                        fill="#A64E3E"
                        fillOpacity={0.12}
                        stroke="#A64E3E"
                        strokeWidth={1.8}
                        strokeDasharray="4 4"
                      />
                      <Line
                        type="monotone"
                        dataKey="gainsFromTradePct"
                        name="Peasant Gains from Trade Retention (%)"
                        stroke="#3F6955"
                        strokeWidth={2.4}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="socialTrustScore"
                        name="Interpersonal Trust Index (0–100)"
                        stroke="#9E6A2E"
                        strokeWidth={2.4}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sovereignAgencyPct"
                        name="Sovereign Rule-Making Agency (%)"
                        stroke="#3B5B75"
                        strokeWidth={2.4}
                        dot={{ r: 4 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Epoch Deep-Dive Dossier */}
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-4 shadow-2xs relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-1.5 h-full"
                  style={{ backgroundColor: activeEpoch.accentColor }}
                />
                
                <div className="flex flex-wrap items-center justify-between gap-2 pl-1.5">
                  <div>
                    <span className="font-mono text-xs text-[#77776E] dark:text-[#A8A499] block">{activeEpoch.timeRange}</span>
                    <h5 className="font-serif font-semibold text-lg sm:text-xl text-[#181816] dark:text-[#E6E3DB]">
                      {activeEpoch.title}
                    </h5>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] text-[11px] font-mono text-[#55554E] dark:text-[#C5C2B6] font-medium shadow-2xs">
                    {activeEpoch.keyScholarsOrAccord}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  <strong>Causal Transmission Mechanism:</strong> {activeEpoch.primaryMechanism}
                </p>

                {/* 4 Quantitative Metric Meters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pl-1.5">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs space-y-1">
                    <span className="text-[#77776E] dark:text-[#A8A499] text-[10px] block">Peasant GFT Retention:</span>
                    <div className="font-mono font-semibold text-[#3F6955] dark:text-[#76A890] text-sm sm:text-base">
                      {activeEpoch.gainsFromTradePct}%
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs space-y-1">
                    <span className="text-[#77776E] dark:text-[#A8A499] text-[10px] block">Social Trust Index:</span>
                    <div className="font-mono font-semibold text-[#9E6A2E] dark:text-[#D4A060] text-sm sm:text-base">
                      {activeEpoch.socialTrustScore} / 100
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs space-y-1">
                    <span className="text-[#77776E] dark:text-[#A8A499] text-[10px] block">Sovereign Agency:</span>
                    <div className="font-mono font-semibold text-[#3B5B75] dark:text-[#7B9BB5] text-sm sm:text-base">
                      {activeEpoch.sovereignAgencyPct}%
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs space-y-1">
                    <span className="text-[#77776E] dark:text-[#A8A499] text-[10px] block">Extractive Pressure:</span>
                    <div className="font-mono font-semibold text-[#A64E3E] dark:text-[#DB8B7D] text-sm sm:text-base">
                      {activeEpoch.extractivePressurePct}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Epoch Baseline Cards (Clickable to switch epoch) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <button
                  onClick={() => setActiveEpochIndex(0)}
                  className={`p-5 rounded-xl text-left transition-all cursor-pointer border space-y-2 shadow-2xs ${
                    activeEpochIndex === 0
                      ? 'bg-[#F9F6EE] dark:bg-[#211E17] border-[#9E6A2E] dark:border-[#D1A268]'
                      : 'bg-[#F9F6EE] text-[#1E1E1C] dark:bg-[#211E17] dark:text-[#E2DFD6] border-[#E5DECD] dark:border-[#373124] hover:border-[#9E6A2E]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#9E6A2E] dark:text-[#D1A268] font-semibold block">150,000 – 60,000 BP</span>
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] block">Recent African Origin (RAO)</span>
                  <p className="text-xs text-[#55554E] dark:text-[#CCC8BC] leading-relaxed font-light">
                    Mitochondrial Eve and Y-Chromosomal Adam coalesce in East Africa. Serial Founder Effect leaves Sub-Saharan Africa with the world’s highest genetic diversity.
                  </p>
                </button>

                <button
                  onClick={() => setActiveEpochIndex(2)}
                  className={`p-5 rounded-xl text-left transition-all cursor-pointer border space-y-2 shadow-2xs ${
                    activeEpochIndex === 2
                      ? 'bg-[#FAF3F1] dark:bg-[#221817] border-[#A64E3E] dark:border-[#DB8B7D]'
                      : 'bg-[#FAF3F1] text-[#1E1E1C] dark:bg-[#221817] dark:text-[#E2DFD6] border-[#E8D9D5] dark:border-[#3A2724] hover:border-[#A64E3E]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#A64E3E] dark:text-[#DB8B7D] font-semibold block">1400 – 1900 CE</span>
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] block">The Quadruple Slave Trades</span>
                  <p className="text-xs text-[#55554E] dark:text-[#CCC8BC] leading-relaxed font-light">
                    18M+ individuals exported across Atlantic, Saharan, Red Sea, and Indian Ocean routes. Depletes demographics and embeds the intergenerational "Mistrust Scar".
                  </p>
                </button>

                <button
                  onClick={() => setActiveEpochIndex(3)}
                  className={`p-5 rounded-xl text-left transition-all cursor-pointer border space-y-2 shadow-2xs ${
                    activeEpochIndex === 3
                      ? 'bg-[#F2F5F8] dark:bg-[#181E24] border-[#3B5B75] dark:border-[#7B9BB5]'
                      : 'bg-[#F2F5F8] text-[#1E1E1C] dark:bg-[#181E24] dark:text-[#E2DFD6] border-[#D3DDE6] dark:border-[#27323C] hover:border-[#3B5B75]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#3B5B75] dark:text-[#7B9BB5] font-semibold block">1884 – 1960 CE</span>
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] block">Berlin Partition & Monopsony</span>
                  <p className="text-xs text-[#55554E] dark:text-[#CCC8BC] leading-relaxed font-light">
                    45,000 decentralized polities subjugated under autocratic Indirect Rule. Colonial trading cartels extract up to 85% of peasant Gains from Trade.
                  </p>
                </button>

                <button
                  onClick={() => setActiveEpochIndex(5)}
                  className={`p-5 rounded-xl text-left transition-all cursor-pointer border space-y-2 shadow-2xs ${
                    activeEpochIndex === 5
                      ? 'bg-[#F3F7F4] dark:bg-[#16211C] border-[#3F6955] dark:border-[#76A890]'
                      : 'bg-[#F3F7F4] text-[#1E1E1C] dark:bg-[#16211C] dark:text-[#E2DFD6] border-[#D5E2D9] dark:border-[#25362E] hover:border-[#3F6955]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#3F6955] dark:text-[#76A890] font-semibold block">1960 – 2026+ CE</span>
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] block">Path Persistence to Global Ascent</span>
                  <p className="text-xs text-[#55554E] dark:text-[#CCC8BC] leading-relaxed font-light">
                    State marketing boards perpetuate urban bias. By 2026, AU and CARICOM mobilize UN resolutions, Bridgetown 3.0, and G20 leadership for structural reform.
                  </p>
                </button>
              </div>
            </figure>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 2: MACRO-GEONOMICS (RAO & ASHRAF-GALOR) */}
          {/* ========================================================= */}
          <section id="sec-biogeographic_baseline" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#9E6A2E] dark:text-[#D4A060] block">
                Chapter 02 // Deep-Time Biogeographic Baseline
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                The Macro-Geonomic Frontier & Ashraf-Galor Curve
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
                Recent African Origin (RAO), the Serial Founder Effect, and the hump-shaped relationship between prehistoric genetic diversity and comparative economic development.
              </p>
            </div>

            <div className="space-y-4">
              {/* Insight Surface #F6F4ED */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#9E6A2E] dark:bg-[#BF843E]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">1. Molecular Clock Calibrations & Coalescence</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Genetic anthropology utilizing complete sequencing of mitochondrial DNA (mtDNA) and the Y chromosome confirms that all contemporary humans share a shallow ancestry converging in East Africa:
                </p>

                {/* Important Statistics: Clean white cards with muted earth accent */}
                <div className="space-y-2.5 text-xs pl-1.5">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] flex items-start justify-between gap-4 shadow-2xs">
                    <div>
                      <strong className="text-[#181816] dark:text-[#E6E3DB] font-medium">Mitochondrial Eve (Maternal Lineage):</strong>
                      <p className="text-[#55554E] dark:text-[#A8A499] mt-0.5">Lived in East Africa ~99,000 to 148,000 years ago (broad estimates up to 200 kya).</p>
                    </div>
                    <span className="font-mono text-[#9E6A2E] dark:text-[#D4A060] font-semibold shrink-0">~148 kya</span>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] flex items-start justify-between gap-4 shadow-2xs">
                    <div>
                      <strong className="text-[#181816] dark:text-[#E6E3DB] font-medium">Y-Chromosomal Adam (Paternal Lineage):</strong>
                      <p className="text-[#55554E] dark:text-[#A8A499] mt-0.5">Lived in East Africa ~120,000 to 156,000 years ago.</p>
                    </div>
                    <span className="font-mono text-[#9E6A2E] dark:text-[#D4A060] font-semibold shrink-0">~156 kya</span>
                  </div>
                </div>
              </div>

              {/* Methodology Neutral Surface #ECE8DC */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#ECE8DC] text-[#1E1E1C] dark:bg-[#20231F] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs">
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block">2. Serial Founder Effect & Global Diversity Gradient</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light">
                  As modern humans migrated out of East Africa ~60,000 to 70,000 years ago in small pioneer bands, each departing splinter population carried only a sub-sample of the genetic diversity of its parent group.
                </p>
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] font-mono text-center text-xs font-semibold text-[#181816] dark:text-[#E6E3DB]">
                  He(Sub-Saharan Africa) &gt; He(Eurasia) &gt; He(Americas)
                </div>
              </div>
            </div>

            {/* Interactive Chart: Ashraf-Galor Diversity-Development Hump */}
            <figure className="my-12 sm:my-14 pb-6 border-b border-[#DCD9CE] dark:border-[#2C2E2A] space-y-5">
              <figcaption className="mb-2">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#9E6A2E] dark:text-[#D4A060] font-semibold block mb-1.5">
                  Fig. 02 // Econometric Diversity Trade-Off
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1.5">
                  Ashraf & Galor (2013) Hump-Shaped Trade-Off
                </h4>
                <p className="text-xs text-[#55554E] dark:text-[#A8A499] leading-relaxed">
                  Opposing channels: Cognitive Specialization & Technological Innovation (+) vs. Social Fragmentation & Mistrust Transaction Costs (-) (<em>AER</em> 2013).
                </p>
              </figcaption>

              <div className="p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={GEONOMIC_DIVERSITY_GRADIENT}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECE8DC" strokeOpacity={0.8} vertical={false} />
                      <XAxis
                        dataKey="migratoryDistanceKm"
                        stroke="#8A8A80"
                        fontSize={11}
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k km`}
                      />
                      <YAxis
                        stroke="#8A8A80"
                        fontSize={11}
                        domain={[30, 100]}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#1E1E1C', 
                          borderColor: '#343430', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          color: '#FAF8F5'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Line
                        type="monotone"
                        dataKey="cognitiveSpecializationScore"
                        name="Cognitive Innovation Channel (+)"
                        stroke="#9E6A2E"
                        strokeWidth={2.2}
                        dot={{ r: 3.5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="socialCoordinationTrustScore"
                        name="Social Cohesion Channel (- friction)"
                        stroke="#3B5B75"
                        strokeWidth={2.2}
                        dot={{ r: 3.5 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="compositeProductivity"
                        name="Ashraf-Galor Hump (Net Dev)"
                        fill="#3F6955"
                        fillOpacity={0.12}
                        stroke="#3F6955"
                        strokeWidth={2.5}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </figure>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 3: HISTORICAL TRAUMAS & THE MISTRUST SCAR */}
          {/* ========================================================= */}
          <section id="sec-slave_trades_mistrust" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#A64E3E] dark:text-[#DB8B7D] block">
                Chapter 03 // Historical Shocks & Social Capital Extraction
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Nathan Nunn’s Econometrics & The Mistrust Scar
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
                The causal long-term effects of Africa’s quadruple slave trades (1400–1900 CE) on modern GDP per capita and interpersonal trust breakdown.
              </p>
            </div>

            <div className="space-y-4">
              {/* Insight Surface #F6F4ED */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A64E3E] dark:bg-[#C26252]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">1. Nathan Nunn (2008) Causal Underdevelopment</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Nathan Nunn integrated shipping manifests and historical records from four major slave trades (trans-Atlantic, trans-Saharan, Red Sea, Indian Ocean) totaling over <strong>18 million exported individuals</strong>. The parts of Africa from which the largest numbers of enslaved persons were forcibly taken are the poorest today.
                </p>
                <span className="text-[11px] font-mono text-[#A64E3E] dark:text-[#DB8B7D] block font-medium pl-1.5">Quarterly Journal of Economics (QJE 2008)</span>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A64E3E] dark:bg-[#C26252]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">2. The Micro-Level Transmission Channel: The Mistrust Scar</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Enslavement was frequently carried out through small-scale village kidnappings and personal betrayals by friends, neighbors, and kin (Nunn & Wantchekon, <em>AER</em> 2011). This shattered baseline social capital:
                </p>
                
                {/* Important Statistics Cards */}
                <div className="space-y-2.5 text-xs pl-1.5">
                  <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] flex justify-between shadow-2xs">
                    <span className="text-[#343430] dark:text-[#CCC8BC]">Trust in Relatives & Neighbors:</span>
                    <span className="font-mono font-semibold text-[#A64E3E] dark:text-[#DB8B7D]">-28% in raided groups</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] flex justify-between shadow-2xs">
                    <span className="text-[#343430] dark:text-[#CCC8BC]">Trust in Local Co-Ethnics:</span>
                    <span className="font-mono font-semibold text-[#A64E3E] dark:text-[#DB8B7D]">-34% relative deficit</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] flex justify-between shadow-2xs">
                    <span className="text-[#343430] dark:text-[#CCC8BC]">Trust in Administration & Courts:</span>
                    <span className="font-mono font-semibold text-[#A64E3E] dark:text-[#DB8B7D]">-41% institutional deficit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart: Nunn Regional Slave Export Extraction */}
            <figure className="my-12 sm:my-14 pb-6 border-b border-[#DCD9CE] dark:border-[#2C2E2A] space-y-5">
              <figcaption className="mb-2">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#A64E3E] dark:text-[#DB8B7D] font-semibold block mb-1.5">
                  Fig. 03 // Econometric Extraction Regression
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1.5">
                  Regional Slave Extraction Intensity vs. Current GDP per Capita
                </h4>
                <p className="text-xs text-[#55554E] dark:text-[#A8A499] leading-relaxed">
                  Empirical data compiled across African regional zones (Nunn 2008, Nunn & Wantchekon 2011).
                </p>
              </figcaption>

              <div className="p-6 sm:p-7 rounded-2xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={NUNN_SLAVE_TRADE_EXTRACTION}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECE8DC" strokeOpacity={0.8} vertical={false} />
                      <XAxis
                        dataKey="regionOrModernCountry"
                        stroke="#8A8A80"
                        fontSize={10}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#A64E3E"
                        fontSize={11}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#3B5B75"
                        fontSize={11}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#1E1E1C', 
                          borderColor: '#343430', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          color: '#FAF8F5'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar
                        yAxisId="left"
                        dataKey="totalExportsMillions"
                        name="Total Slave Exports (Millions)"
                        fill="#A64E3E"
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="currentGdpPerCapitaUsd"
                        name="Current GDP per Capita ($ USD)"
                        fill="#3B5B75"
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </figure>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 4: COLONIAL EXTRACTIVE INSTITUTIONS & MONOPSONY */}
          {/* ========================================================= */}
          <section id="sec-colonial_institutions" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#3B5B75] dark:text-[#7B9BB5] block">
                Chapter 04 // Colonial Cartels & Microeconomic Extraction
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Extractive Institutions, Indirect Rule & Tadei’s Monopsony
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
                Acemoglu-Robinson settler mortality, Henn-Robinson pre-colonial political decentralization, and Federico Tadei’s price-gap econometric models.
              </p>
            </div>

            <div className="space-y-4">
              {/* Insight Surface #F6F4ED */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3B5B75] dark:bg-[#587E9D]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">1. The Settler Mortality Hypothesis</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Acemoglu, Johnson & Robinson (<em>AER</em> 2001) demonstrated that high disease environments prevented European settlements and caused the establishment of purely extractive institutions designed to transfer resources without public investments.
                </p>
              </div>

              {/* Insight Surface #F6F4ED */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#854972] dark:bg-[#B36E9E]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">2. Pre-Colonial Decentralization & Indirect Rule</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Reconstructing 1880 polities across Africa, Nobel laureate James Robinson and Soeren Henn dismantled the myth of pre-colonial institutional failure: <strong>98.2%</strong> of territories operated through decentralized village assemblies and kinship councils, designed to protect individual liberties.
                </p>
              </div>
            </div>

            {/* Federico Tadei Price Gap Case Studies */}
            <figure className="my-12 sm:my-14 pb-6 border-b border-[#DCD9CE] dark:border-[#2C2E2A] space-y-5">
              <figcaption className="mb-2">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#3B5B75] dark:text-[#7B9BB5] font-semibold block mb-1.5">
                  Fig. 04 // Microeconomic Extraction
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1.5">
                  Federico Tadei’s Price-Gap Model: Colonial Monopsony
                </h4>
                <p className="text-xs text-[#55554E] dark:text-[#A8A499] leading-relaxed">
                  Quantifying the destruction of African Gains from Trade under CFAO, SCOA & UAC Concessionaire Cartels (<em>EREH</em> 2020).
                </p>
              </figcaption>

              {/* Commodity Selector Buttons */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                  {TADEI_MONOPSONY_CASE_STUDIES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCommodityIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap ${
                        activeCommodityIndex === idx
                          ? 'bg-[#1E1E1C] text-[#FAF8F5] dark:bg-[#E6E3DB] dark:text-[#181816] font-semibold shadow-2xs'
                          : 'bg-[#FFFFFF] dark:bg-[#181A16] text-[#55554E] dark:text-[#A8A499] hover:text-[#181816] dark:hover:text-[#E6E3DB] border border-[#DCD9CE] dark:border-[#2C2E2A]'
                      }`}
                    >
                      {item.commodity} ({item.territory})
                    </button>
                  ))}
                </div>

                {/* Selected Commodity Dossier - Japandi Neutral Paper Surface */}
                <div className="p-6 sm:p-8 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-4 shadow-2xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3B5B75] dark:bg-[#587E9D]" />
                  <div className="flex items-center justify-between pl-1.5">
                    <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB]">{activeCommodity.commodity}</span>
                    <span className="font-mono text-xs text-[#3B5B75] dark:text-[#7B9BB5] font-semibold">{activeCommodity.territory}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                    <strong>Cartel / Coercion:</strong> {activeCommodity.buyerCartel} — {activeCommodity.coercionMechanism}
                  </p>

                  {/* Important Statistic White Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pl-1.5">
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs">
                      <span className="text-[#77776E] dark:text-[#A8A499] text-[10px]">World Price:</span>
                      <div className="font-mono font-semibold text-[#181816] dark:text-[#E6E3DB] text-sm sm:text-base">${activeCommodity.worldPortPriceDollars}</div>
                    </div>
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs">
                      <span className="text-[#77776E] dark:text-[#A8A499] text-[10px]">Competitive:</span>
                      <div className="font-mono font-semibold text-[#3F6955] dark:text-[#76A890] text-sm sm:text-base">${activeCommodity.competitiveCounterfactualPrice}</div>
                    </div>
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs">
                      <span className="text-[#77776E] dark:text-[#A8A499] text-[10px]">Actual Paid:</span>
                      <div className="font-mono font-semibold text-[#A64E3E] dark:text-[#DB8B7D] text-sm sm:text-base">${activeCommodity.actualProducerPricePaid}</div>
                    </div>
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs">
                      <span className="text-[#77776E] dark:text-[#A8A499] text-[10px]">GFT Loss:</span>
                      <div className="font-mono font-semibold text-[#A64E3E] dark:text-[#DB8B7D] text-sm sm:text-base">-{activeCommodity.reductionInGainsFromTradePct}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 5: PATH DEPENDENCY & POST-COLONIAL BORDERS */}
          {/* ========================================================= */}
          <section id="sec-path_dependency" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#854972] dark:text-[#C98EB6] block">
                Chapter 05 // Post-Colonial Institutional Persistence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Marketing Boards, Urban Bias & The Berlin Border Scar
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
                How newly independent governments inherited and perpetuated extractive mechanisms, and the econometric evidence on arbitrary borders.
              </p>
            </div>

            <div className="space-y-4">
              {/* Insight Surface #F6F4ED */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#854972] dark:bg-[#B36E9E]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">1. The Marketing Board Trap & Urban Bias</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Robert H. Bates (1981) demonstrated that newly independent post-colonial governments retained colonial commodity monopsonies as state marketing boards, taxing rural peasants to subsidize cheap food and public sector jobs for politically active urban elites.
                </p>
                <span className="text-[11px] font-mono text-[#854972] dark:text-[#C98EB6] block font-medium pl-1.5">Ref: Bates, Markets and States in Tropical Africa (1981)</span>
              </div>

              {/* Insight Surface #F6F4ED */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3B5B75] dark:bg-[#587E9D]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">2. The Berlin Border Scar & Conflict Multiplier</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                  Michalopoulos & Papaioannou (<em>AER</em> 2016) proved that partitioned ethnic homelands experience significantly more civil conflict and depressed nightlight economic activity than non-partitioned regions.
                </p>
                <span className="text-[11px] font-mono text-[#3B5B75] dark:text-[#7B9BB5] block font-medium pl-1.5">Ref: Michalopoulos & Papaioannou (AER 2016)</span>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 6: CONTEMPORARY GEOPOLITICAL SHIFTS (2025–2026) */}
          {/* ========================================================= */}
          <section id="sec-contemporary_geopolitics" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#3F6955] dark:text-[#76A890] block">
                Chapter 06 // Contemporary Geopolitical Frontier (2025–2026)
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                From Aid Dependency to Rule-Making Power
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
                The UN General Assembly Resolution of March 25, 2026, the AU-CARICOM Joint 19-Point Accra Plan, Bridgetown 3.0, and the new multilateral order.
              </p>
            </div>

            {/* Contemporary Accords List */}
            <div className="space-y-4">
              {CONTEMPORARY_GEOPOLITICAL_PARADIGMS.map((accord, idx) => (
                <div key={idx} className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3.5 shadow-2xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3F6955] dark:bg-[#6EA88F]" />
                  <div className="flex items-center justify-between pl-1.5">
                    <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB]">{accord.initiative}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] text-[10px] font-mono text-[#3F6955] dark:text-[#76A890] font-semibold">{accord.milestoneDate}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] pl-1.5"><strong>Lead Actors:</strong> {accord.leadActors}</p>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] space-y-1 font-light pl-1.5">
                    {accord.coreDemandsOrMechanisms.map((demand, dIdx) => (
                      <li key={dIdx}>{demand}</li>
                    ))}
                  </ul>
                  <div className="p-3 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] text-[11px] sm:text-xs text-[#55554E] dark:text-[#A8A499] italic ml-1.5">
                    <strong>Systemic Counter-Position:</strong> {accord.systemicConflictOrObstacle}
                  </div>
                </div>
              ))}
            </div>

            {/* Highlight on UN General Assembly Resolution (Key Finding Pale Sage #F3F7F4) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F3F7F4] text-[#1E1E1C] dark:bg-[#16211C] dark:text-[#E2DFD6] border border-[#D5E2D9] dark:border-[#25362E] space-y-3.5 shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3F6955] dark:bg-[#6EA88F]" />
              <div className="pl-1.5">
                <span className="text-xs font-mono font-semibold text-[#3F6955] dark:text-[#76A890] uppercase tracking-wider block">
                  UN General Assembly Resolution // March 25, 2026
                </span>
                <h4 className="font-serif text-lg sm:text-xl font-semibold text-[#181816] dark:text-[#E6E3DB] mt-1">
                  Declaration of Transatlantic Slavery as the "Gravest Crime Against Humanity"
                </h4>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#C5C2B6] leading-relaxed font-light mt-2">
                  Adopted by a <strong>123-3 vote</strong> (Ghana/AU and CARICOM leading), this historic resolution establishes the permanent legal foundation for multilateral restorative justice and reparatory development frameworks.
                </p>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 7: BIBLIOGRAPHY & PRIMARY DATA ARCHIVES */}
          {/* ========================================================= */}
          <section id="sec-bibliography_sources" className="space-y-8 pt-8 pb-20">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#55554E] dark:text-[#A8A499] block">
                Chapter 07 // Peer-Reviewed Bibliography & Primary Archives
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Academic Citations, DOIs & Working Papers
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
                Full references to foundational papers in the American Economic Review, Quarterly Journal of Economics, and European Review of Economic History.
              </p>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  authors: 'Acemoglu, Daron, Simon Johnson, and James A. Robinson',
                  year: '2001',
                  title: 'The Colonial Origins of Comparative Development: An Empirical Investigation',
                  journal: 'American Economic Review, Vol. 91, No. 5, pp. 1369–1401',
                  url: 'https://economicstrategy.org/wp-content/uploads/2013/11/Acemogluetal2001.pdf',
                  badge: 'AER Classic'
                },
                {
                  authors: 'Ashraf, Quamrul, and Oded Galor',
                  year: '2013',
                  title: 'The "Out of Africa" Hypothesis, Human Genetic Diversity, and Comparative Economic Development',
                  journal: 'American Economic Review, Vol. 103, No. 1, pp. 1–46',
                  url: 'https://www.aeaweb.org/articles?id=10.1257/aer.103.1.1',
                  badge: 'AER Diversity'
                },
                {
                  authors: 'Bates, Robert H.',
                  year: '1981',
                  title: 'Markets and States in Tropical Africa: The Political Basis of Agricultural Policies',
                  journal: 'University of California Press, Berkeley and Los Angeles',
                  url: 'https://mpra.ub.uni-muenchen.de/86293/1/MPRA_paper_86293.pdf',
                  badge: 'Urban Bias'
                },
                {
                  authors: 'Henn, Soeren J., and James A. Robinson',
                  year: '2024',
                  title: 'Africa as a Success Story: Political Organization in Pre-Colonial Africa',
                  journal: 'University of Chicago Working Paper',
                  url: 'https://guardian.ng/news/nobel-laureate-robinsons-new-research-reframes-africas-pre-colonial-states-as-not-failed/',
                  badge: 'Pre-Colonial 1880'
                },
                {
                  authors: 'Michalopoulos, Stelios, and Elias Papaioannou',
                  year: '2016',
                  title: 'The Long-Run Effects of the Scramble for Africa',
                  journal: 'American Economic Review, Vol. 106, No. 7, pp. 1802–1848',
                  url: 'https://www.aeaweb.org/articles?id=10.1257/aer.20131311',
                  badge: 'AER Scramble'
                },
                {
                  authors: 'Nunn, Nathan',
                  year: '2008',
                  title: 'The Long-Term Effects of Africa’s Slave Trades',
                  journal: 'Quarterly Journal of Economics, Vol. 123, No. 1, pp. 139–176',
                  url: 'https://scholar.harvard.edu/nunn/publications/long-term-effects-africas-slave-trades',
                  badge: 'QJE Foundation'
                },
                {
                  authors: 'Nunn, Nathan, and Leonard Wantchekon',
                  year: '2011',
                  title: 'The Slave Trade and the Origins of Mistrust in Africa',
                  journal: 'American Economic Review, Vol. 101, No. 7, pp. 3221–3252',
                  url: 'https://scholar.harvard.edu/nunn/publications/slave-trade-and-origins-mistrust-africa',
                  badge: 'AER Trust'
                },
                {
                  authors: 'Tadei, Federico',
                  year: '2020',
                  title: 'Measuring Extractive Institutions: Colonial Trade and Price Gaps in French Africa',
                  journal: 'European Review of Economic History, Vol. 24, No. 1, pp. 1–32',
                  url: 'https://academic.oup.com/ereh/article/24/1/1/5365576',
                  badge: 'EREH Monopsony'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2 shadow-2xs">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB]">{item.title}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] text-[10px] font-mono text-[#9E6A2E] dark:text-[#D4A060] shrink-0 font-semibold">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] font-light">
                    {item.authors} — <em>{item.journal}</em>
                  </p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#181816] dark:text-[#E6E3DB] hover:underline inline-flex items-center gap-1.5 mt-1.5 font-medium"
                    >
                      <span>Original Publication</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

        </main>
    </div>
  );
};
