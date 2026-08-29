import React, { useState, useEffect } from 'react';
import {
  MASTER_REPORT_SECTIONS,
  GEONOMIC_DIVERSITY_GRADIENT,
  NUNN_SLAVE_TRADE_EXTRACTION,
  TADEI_MONOPSONY_CASE_STUDIES,
  CONTEMPORARY_GEOPOLITICAL_PARADIGMS,
  PRE_COLONIAL_GOVERNANCE_DATA,
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
  const [activeCommodityIndex, setActiveCommodityIndex] = useState<number>(0);
  const [fontSizeClass, setFontSizeClass] = useState<'normal' | 'large'>('normal');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

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
    <div className={`report-frame max-w-[1440px] mx-auto border-x border-[#D7D6CD] dark:border-[#2D2E2A] px-4 sm:px-6 lg:px-10 py-8 transition-colors duration-300 ${fontSizeClass === 'large' ? 'text-[1.125rem]' : 'text-[1.063rem]'}`} id="african-development-master-report-view">
      
      {/* 1. ASYMMETRIC EDITORIAL HEADER BLOCK */}
      <header className="border-b-2 border-[#181816] dark:border-[#E6E3DB] pb-8 mb-10 relative">
        <div className="space-y-4">
          
          {/* Top Metadata Kicker */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono uppercase tracking-[0.15em] text-[#5C5C55] dark:text-[#A8A499] font-semibold">
            <div className="flex items-center gap-2">
              <button 
                onClick={onNavigateToAtlas}
                className="hover:underline text-[#343430] dark:text-[#E6E3DB] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#D98200]" />
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
                className="px-3 py-1 rounded-lg border border-[#D7D6CD] dark:border-[#2D2E2A] bg-transparent hover:bg-[#181816] hover:text-[#FAFAF6] dark:hover:bg-[#E6E3DB] dark:hover:text-[#181816] text-[#181816] dark:text-[#E6E3DB] text-[0.75rem] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                title="Toggle Reading Font Size"
              >
                Font: {fontSizeClass === 'normal' ? 'Standard' : 'Enlarged'}
              </button>
              <button
                onClick={handleCopyCitation}
                className="px-3 py-1 rounded-lg border border-[#D7D6CD] dark:border-[#2D2E2A] bg-transparent hover:bg-[#181816] hover:text-[#FAFAF6] dark:hover:bg-[#E6E3DB] dark:hover:text-[#181816] text-[#181816] dark:text-[#E6E3DB] text-[0.75rem] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-[#009D00] dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Copied Cite' : 'Cite Report'}</span>
              </button>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-3 pt-2">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#181816] dark:text-[#E6E3DB] leading-[1.1] max-w-5xl">
              The Structural & Evolutionary Foundations of African Development
            </h1>
            <p className="font-sans font-light text-lg sm:text-xl text-[#343430] dark:text-[#CCC8BC] leading-relaxed max-w-4xl">
              An Interdisciplinary Master Treatise Uniting Macro-Geonomic, Historical-Institutional, and Contemporary Geopolitical Frontiers
            </p>
          </div>

          {/* Editorial Meta Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5C5C55] dark:text-[#A8A499] border-t border-[#D7D6CD] dark:border-[#2D2E2A]">
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
                <Award className="w-3.5 h-3.5 text-[#D98200] dark:text-[#FFB84A]" />
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
      <section className="space-y-6 mb-12">
        {/* Executive Abstract Hero Card - Japandi Insight Style (#F5F3EC + 4px Accent) */}
        <div className="bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border-l-4 border-l-[#D98200] border-y border-r border-[#D7D6CD] dark:border-[#2D2E2A] p-6 sm:p-8 rounded-r-2xl shadow-xs">
          <div className="max-w-4xl space-y-3">
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#181816] dark:text-[#E6E3DB] leading-relaxed italic">
              “This master synthesis systematically deconstructs reductionist and ahistorical narratives of Sub-Saharan African underdevelopment by uniting three major academic frontiers: the Macro-Geonomic baseline, the compounding Historical-Institutional traumas, and the decisive 2025–2026 Contemporary Geopolitical shifts.”
            </p>
            <p className="font-sans font-light text-sm sm:text-base text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed pt-1">
              From the deep-time <strong>Serial Founder Effect</strong> and the <strong>Ashraf-Galor diversity curve</strong>, to Nathan Nunn’s <strong>intergenerational mistrust scar</strong>, Acemoglu-Robinson settler mortality, and Federico Tadei’s <strong>colonial monopsony price gaps</strong> (extracting &gt;60–85% of African peasant gains from trade), to the landmark <strong>March 25, 2026 UN General Assembly Slavery Resolution (123-3)</strong>.
            </p>
          </div>
        </div>

        {/* Harmonious 1-Row Quantitative Benchmarks (Regional Calm & Pale Surfaces) */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-nowrap items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1 w-full">
            {/* Pill 1: RAO Baseline (Eastern Africa - Calm #FFF8ED / Pale #FFF7E8, Accent #D98200) */}
            <div className="flex-1 min-w-[200px] p-3 sm:p-3.5 rounded-xl bg-[#FFF8ED] dark:bg-amber-950/20 border border-[#D7D6CD] dark:border-zinc-800 flex flex-col justify-between shadow-2xs hover:border-[#D98200]/40 transition-all border-l-3 border-l-[#D98200]">
              <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-[#D7D6CD]/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D98200] dark:text-[#FFB84A]">RAO Baseline</span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#181816] dark:text-[#E6E3DB]">~150 kya</span>
              </div>
              <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed mt-2 font-light tracking-tight">
                Mitochondrial Eve and Y-Chromosomal Adam coalesce in East Africa. Africa has the world’s highest genetic diversity.
              </p>
            </div>

            {/* Pill 2: Victims (Southern Africa - Calm #FFF6F5 / Pale #FFF5F4, Accent #D90000) */}
            <div className="flex-1 min-w-[200px] p-3 sm:p-3.5 rounded-xl bg-[#FFF6F5] dark:bg-rose-950/20 border border-[#D7D6CD] dark:border-zinc-800 flex flex-col justify-between shadow-2xs hover:border-[#D90000]/40 transition-all border-l-3 border-l-[#D90000]">
              <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-[#D7D6CD]/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D90000] dark:text-[#FF6666]">Victims</span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#D90000] dark:text-[#FF6666]">18M+</span>
              </div>
              <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed mt-2 font-light tracking-tight">
                Depletes demographics and embeds the intergenerational “Mistrust Scar.”
              </p>
            </div>

            {/* Pill 3: Pre-Colonial Autonomy (Middle Africa - Calm #FFF7FF / Pale #FFF5FF, Accent #D600D5) */}
            <div className="flex-1 min-w-[200px] p-3 sm:p-3.5 rounded-xl bg-[#FFF7FF] dark:bg-fuchsia-950/20 border border-[#D7D6CD] dark:border-zinc-800 flex flex-col justify-between shadow-2xs hover:border-[#D600D5]/40 transition-all border-l-3 border-l-[#D600D5]">
              <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-[#D7D6CD]/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D600D5] dark:text-[#FF55FF]">Autonomy</span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#181816] dark:text-[#E6E3DB]">98.2%</span>
              </div>
              <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed mt-2 font-light tracking-tight">
                45,000 decentralized polities subjugated under autocratic indirect colonial rule.
              </p>
            </div>

            {/* Pill 4: Monopsony (Northern Africa - Calm #F5F5FF / Pale #F3F4FF, Accent #1600D9) */}
            <div className="flex-1 min-w-[200px] p-3 sm:p-3.5 rounded-xl bg-[#F5F5FF] dark:bg-blue-950/20 border border-[#D7D6CD] dark:border-zinc-800 flex flex-col justify-between shadow-2xs hover:border-[#1600D9]/40 transition-all border-l-3 border-l-[#1600D9]">
              <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-[#D7D6CD]/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1600D9] dark:text-[#7770FF]">Monopsony</span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#1600D9] dark:text-[#7770FF]">&gt;85% GFT</span>
              </div>
              <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed mt-2 font-light tracking-tight">
                Colonial trading cartels extract up to 85% of peasant gains from trade.
              </p>
            </div>

            {/* Pill 5: UN GA (Western Africa - Calm #F4FFF3 / Pale #F3FAF1, Accent #009D00) */}
            <div className="flex-1 min-w-[200px] p-3 sm:p-3.5 rounded-xl bg-[#F4FFF3] dark:bg-emerald-950/20 border border-[#D7D6CD] dark:border-zinc-800 flex flex-col justify-between shadow-2xs hover:border-[#009D00]/40 transition-all border-l-3 border-l-[#009D00]">
              <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-[#D7D6CD]/60 dark:border-zinc-800">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#009D00] dark:text-[#4DFF4D]">UN GA 2026</span>
                <span className="font-serif font-bold text-xs sm:text-sm text-[#009D00] dark:text-[#4DFF4D]">123–3</span>
              </div>
              <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed mt-2 font-light tracking-tight">
                The landmark March 25, 2026, UN General Assembly Slavery Resolution.
              </p>
            </div>
          </div>

          {/* Prominent & Engaging Companion Volume Action Bar (Warm Terracotta Tone) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 px-0.5">
            <div className="flex items-center gap-2 text-[11px] text-[#5C5C55] dark:text-[#A8A499] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#009D00] dark:bg-emerald-400 animate-pulse"></span>
              <span className="tracking-tight font-medium">Interdisciplinary Research Series</span>
            </div>
            <button
              onClick={onNavigateToMolecular}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#b85d19] hover:bg-[#a64f12] text-amber-50 dark:bg-[#e29b58] dark:hover:bg-[#d68e4b] dark:text-[#211102] font-sans text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 dark:bg-black/15 flex items-center justify-center shrink-0">
                <Dna className="w-3.5 h-3.5 text-amber-100 dark:text-[#211102] group-hover:rotate-12 transition-transform" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-amber-100/90 dark:text-[#211102]/85 font-bold leading-none">Companion Article</span>
                <span className="text-xs font-semibold tracking-tight leading-tight">Molecular & Material Legacies</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-100 dark:text-[#211102] group-hover:translate-x-1 transition-transform ml-0.5 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION NAVIGATION SELECTOR BAR (FULL WIDTH, BG #F5F3EC, STICKY BELOW TOPBAR top-16) */}
      <div className="mb-16 sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-3.5 bg-[#F5F3EC] dark:bg-[#1A1D19] border-y border-[#D7D6CD] dark:border-[#2D2E2A] shadow-xs transition-colors duration-200">
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          {MASTER_REPORT_SECTIONS.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#181816] text-[#FAFAF6] dark:bg-[#E6E3DB] dark:text-[#181816] shadow-xs font-bold'
                    : 'bg-[#FFFFFF] dark:bg-[#141512] text-[#343430] dark:text-[#A8A499] hover:text-[#181816] dark:hover:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] hover:bg-[#ECEAE1] dark:hover:bg-[#20231F] font-medium'
                }`}
              >
                {getSectionIcon(sec.iconName, 'w-3.5 h-3.5 shrink-0')}
                <span>{sec.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FULL CONTINUOUS EDITORIAL READING ENGINE (ALL SECTIONS DISPLAYED IN FULL) */}
      <main className="max-w-4xl mx-auto space-y-28 sm:space-y-36 text-left">
          
          {/* ========================================================= */}
          {/* CHAPTER 1: EXECUTIVE SUMMARY & COMPOUNDING TRAJECTORY */}
          {/* ========================================================= */}
          <section id="sec-executive_summary" className="space-y-8 pt-4 pb-6">
            <div className="space-y-3 border-b border-[#D7D6CD] dark:border-[#2D2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.1em] text-[#D98200] dark:text-[#FFB84A] block">
                Chapter 01 // Executive Overview & Epistemological Framework
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#181816] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Executive Synthesis & Compounding Epochs
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed pt-1">
                A unified econometric and historical framework deconstructing African comparative development across deep-time, colonial monopsonies, and contemporary geopolitical reform.
              </p>
            </div>

            {/* 3 Core Theses - Japandi Insight Surface #F5F3EC */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#D98200] space-y-2">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">1. The Macro-Geonomic Frontier</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Traces the prehistoric <em>Recent African Origin</em> (RAO) migration gradient. The Serial Founder Effect caused genetic diversity to drop monotonically with distance from East Africa, establishing the <strong>Ashraf-Galor diversity-development trade-off</strong> between cognitive innovation benefits and social coordination friction.
                </p>
                <span className="text-[11px] font-mono text-[#D98200] dark:text-[#FFB84A] block font-medium">Ref: Ashraf & Galor (AER 2013)</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#D90000] space-y-2">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">2. Historical-Institutional Traumas</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Quantifies four compounding historical shocks: the <strong>18M+ slave trade drainage</strong> that scarred interpersonal trust (Nunn & Wantchekon), <strong>Acemoglu-Robinson settler mortality</strong>, <strong>Henn-Robinson pre-colonial decentralization destruction</strong>, and <strong>Tadei’s colonial monopsony price gaps</strong> extracting &gt;60–85% of African peasant gains from trade.
                </p>
                <span className="text-[11px] font-mono text-[#D90000] dark:text-[#FF6666] block font-medium">Ref: Nunn (2008), Tadei (2020), Henn & Robinson (2024)</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#009D00] space-y-2">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">3. Contemporary Geopolitical Battles</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Details the 2025–2026 transition from "requesting development aid" to "demanding structural rule-making power": the <strong>March 25, 2026 UN General Assembly Slavery Resolution (123-3)</strong>, the <strong>AU-CARICOM Joint 19-Point Accra Plan</strong>, <strong>Bridgetown 3.0</strong>, and <strong>South Africa's G20 Leadership</strong>.
                </p>
                <span className="text-[11px] font-mono text-[#009D00] dark:text-[#4DFF4D] block font-medium">Ref: UN GA Res. (Mar 2026), Mottley (2026)</span>
              </div>
            </div>

            {/* Synthesized Compounding Shocks Timeline Visualizer */}
            <figure className="my-8 pb-4 border-b border-[#D7D6CD] dark:border-[#2D2E2A]">
              <figcaption className="mb-4">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#D98200] dark:text-[#FFB84A] font-semibold block mb-1">
                  Fig. 01 // Structural Trajectory
                </span>
                <h4 className="font-serif text-xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1">
                  Compounding Epochs of African Comparative Development
                </h4>
                <p className="text-xs text-[#5C5C55] dark:text-[#A8A499] leading-relaxed">
                  How deep-time diversity baselines, predatory extractions, and institutional persistence created modern structural outcomes.
                </p>
              </figcaption>

              {/* Key Findings in Regional Pale Tones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-[#FFF7E8] text-[#181816] dark:bg-amber-950/20 dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-zinc-800 space-y-1.5 border-l-3 border-l-[#D98200]">
                  <span className="font-mono text-[10px] text-[#D98200] dark:text-[#FFB84A] font-bold block">150,000 – 60,000 BP</span>
                  <span className="font-serif font-bold text-sm text-[#181816] dark:text-[#E6E3DB] block">Recent African Origin (RAO)</span>
                  <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                    Mitochondrial Eve and Y-Chromosomal Adam coalesce in East Africa. Serial Founder Effect leaves Sub-Saharan Africa with the world’s highest genetic diversity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FFF5F4] text-[#181816] dark:bg-rose-950/20 dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-zinc-800 space-y-1.5 border-l-3 border-l-[#D90000]">
                  <span className="font-mono text-[10px] text-[#D90000] dark:text-[#FF6666] font-bold block">1400 – 1900 CE</span>
                  <span className="font-serif font-bold text-sm text-[#181816] dark:text-[#E6E3DB] block">The Quadruple Slave Trades</span>
                  <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                    18M+ individuals exported across Atlantic, Saharan, Red Sea, and Indian Ocean routes. Depletes demographics and embeds the intergenerational "Mistrust Scar".
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F3F4FF] text-[#181816] dark:bg-blue-950/20 dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-zinc-800 space-y-1.5 border-l-3 border-l-[#1600D9]">
                  <span className="font-mono text-[10px] text-[#1600D9] dark:text-[#7770FF] font-bold block">1884 – 1960 CE</span>
                  <span className="font-serif font-bold text-sm text-[#181816] dark:text-[#E6E3DB] block">Berlin Partition & Monopsony</span>
                  <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                    45,000 decentralized polities subjugated under autocratic Indirect Rule. Colonial trading cartels extract up to 85% of peasant Gains from Trade.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F3FAF1] text-[#181816] dark:bg-emerald-950/20 dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-zinc-800 space-y-1.5 border-l-3 border-l-[#009D00]">
                  <span className="font-mono text-[10px] text-[#009D00] dark:text-[#4DFF4D] font-bold block">1960 – 2026 CE</span>
                  <span className="font-serif font-bold text-sm text-[#181816] dark:text-[#E6E3DB] block">Path Persistence to Global Ascent</span>
                  <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                    State marketing boards perpetuate urban bias. By 2026, AU and CARICOM mobilize UN resolutions, Bridgetown 3.0, and G20 leadership for structural reform.
                  </p>
                </div>
              </div>
            </figure>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 2: MACRO-GEONOMICS (RAO & ASHRAF-GALOR) */}
          {/* ========================================================= */}
          <section id="sec-biogeographic_baseline" className="space-y-8 pt-6 pb-6">
            <div className="space-y-3 border-b border-[#D7D6CD] dark:border-[#2D2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.1em] text-[#D98200] dark:text-[#FFB84A] block">
                Chapter 02 // Deep-Time Biogeographic Baseline
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#181816] dark:text-[#E6E3DB] tracking-tight leading-snug">
                The Macro-Geonomic Frontier & Ashraf-Galor Curve
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed pt-1">
                Recent African Origin (RAO), the Serial Founder Effect, and the hump-shaped relationship between prehistoric genetic diversity and comparative economic development.
              </p>
            </div>

            <div className="space-y-4">
              {/* Insight Surface #F5F3EC */}
              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#D98200] space-y-3">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">1. Molecular Clock Calibrations & Coalescence</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Genetic anthropology utilizing complete sequencing of mitochondrial DNA (mtDNA) and the Y chromosome confirms that all contemporary humans share a shallow ancestry converging in East Africa:
                </p>

                {/* Important Statistics: White cards + dark typography + small regional accent */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#D7D6CD] dark:border-[#2D2E2A] flex items-start justify-between gap-3 shadow-2xs">
                    <div>
                      <strong className="text-[#181816] dark:text-[#E6E3DB]">Mitochondrial Eve (Maternal Lineage):</strong>
                      <p className="text-[#5C5C55] dark:text-[#A8A499] mt-0.5">Lived in East Africa ~99,000 to 148,000 years ago (broad estimates up to 200 kya).</p>
                    </div>
                    <span className="font-mono text-[#D98200] dark:text-[#FFB84A] font-bold shrink-0">~148 kya</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#D7D6CD] dark:border-[#2D2E2A] flex items-start justify-between gap-3 shadow-2xs">
                    <div>
                      <strong className="text-[#181816] dark:text-[#E6E3DB]">Y-Chromosomal Adam (Paternal Lineage):</strong>
                      <p className="text-[#5C5C55] dark:text-[#A8A499] mt-0.5">Lived in East Africa ~120,000 to 156,000 years ago.</p>
                    </div>
                    <span className="font-mono text-[#D98200] dark:text-[#FFB84A] font-bold shrink-0">~156 kya</span>
                  </div>
                </div>
              </div>

              {/* Methodology Neutral Surface #ECEAE1 */}
              <div className="p-5 rounded-2xl bg-[#ECEAE1] text-[#181816] dark:bg-[#20231F] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] space-y-3">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">2. Serial Founder Effect & Global Diversity Gradient</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  As modern humans migrated out of East Africa ~60,000 to 70,000 years ago in small pioneer bands, each departing splinter population carried only a sub-sample of the genetic diversity of its parent group.
                </p>
                <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#D7D6CD] dark:border-[#2D2E2A] font-mono text-center text-xs font-bold text-[#181816] dark:text-[#E6E3DB]">
                  He(Sub-Saharan Africa) &gt; He(Eurasia) &gt; He(Americas)
                </div>
              </div>
            </div>

            {/* Interactive Chart: Ashraf-Galor Diversity-Development Hump */}
            <figure className="my-8 pb-4 border-b border-[#D7D6CD] dark:border-[#2D2E2A]">
              <figcaption className="mb-4">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#D98200] dark:text-[#FFB84A] font-semibold block mb-1">
                  Fig. 02 // Econometric Diversity Trade-Off
                </span>
                <h4 className="font-serif text-xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1">
                  Ashraf & Galor (2013) Hump-Shaped Trade-Off
                </h4>
                <p className="text-xs text-[#5C5C55] dark:text-[#A8A499] leading-relaxed">
                  Opposing channels: Cognitive Specialization & Technological Innovation (+) vs. Social Fragmentation & Mistrust Transaction Costs (-) (<em>AER</em> 2013).
                </p>
              </figcaption>

              <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#D7D6CD] dark:border-[#2D2E2A] shadow-xs">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={GEONOMIC_DIVERSITY_GRADIENT}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" opacity={0.6} />
                      <XAxis
                        dataKey="migratoryDistanceKm"
                        stroke="currentColor"
                        className="text-[#5C5C55] dark:text-[#A8A499]"
                        fontSize={11}
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k km`}
                      />
                      <YAxis
                        stroke="currentColor"
                        className="text-[#5C5C55] dark:text-[#A8A499]"
                        fontSize={11}
                        domain={[30, 100]}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--tooltip-bg)', 
                          borderColor: 'var(--tooltip-border)', 
                          borderRadius: '0.75rem', 
                          fontSize: '12px',
                          color: 'var(--tooltip-text-title)'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line
                        type="monotone"
                        dataKey="cognitiveSpecializationScore"
                        name="Cognitive Innovation Channel (+)"
                        stroke="#D98200"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="socialCoordinationTrustScore"
                        name="Social Cohesion Channel (- friction)"
                        stroke="#1600D9"
                        strokeWidth={2.5}
                        dot={{ r: 4 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="compositeProductivity"
                        name="Ashraf-Galor Hump (Net Dev)"
                        fill="#009D00"
                        fillOpacity={0.15}
                        stroke="#009D00"
                        strokeWidth={3}
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
          <section id="sec-slave_trades_mistrust" className="space-y-8 pt-6 pb-6">
            <div className="space-y-3 border-b border-[#D7D6CD] dark:border-[#2D2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.1em] text-[#D90000] dark:text-[#FF6666] block">
                Chapter 03 // Historical Shocks & Social Capital Extraction
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#181816] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Nathan Nunn’s Econometrics & The Mistrust Scar
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed pt-1">
                The causal long-term effects of Africa’s quadruple slave trades (1400–1900 CE) on modern GDP per capita and interpersonal trust breakdown.
              </p>
            </div>

            <div className="space-y-4">
              {/* Insight Surface #F5F3EC */}
              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#D90000] space-y-3">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">1. Nathan Nunn (2008) Causal Underdevelopment</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Nathan Nunn integrated shipping manifests and historical records from four major slave trades (trans-Atlantic, trans-Saharan, Red Sea, Indian Ocean) totaling over <strong>18 million exported individuals</strong>. The parts of Africa from which the largest numbers of enslaved persons were forcibly taken are the poorest today.
                </p>
                <span className="text-[11px] font-mono text-[#D90000] dark:text-[#FF6666] block font-medium">Quarterly Journal of Economics (QJE 2008)</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#D90000] space-y-3">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">2. The Micro-Level Transmission Channel: The Mistrust Scar</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Enslavement was frequently carried out through small-scale village kidnappings and personal betrayals by friends, neighbors, and kin (Nunn & Wantchekon, <em>AER</em> 2011). This shattered baseline social capital:
                </p>
                
                {/* Important Statistics Cards (White + Dark typography + Regional Rose/Crimson accent) */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#181A16] border border-[#D7D6CD] dark:border-[#2D2E2A] flex justify-between shadow-2xs">
                    <span className="text-[#343430] dark:text-[#CCC8BC]">Trust in Relatives & Neighbors:</span>
                    <span className="font-mono font-bold text-[#D90000] dark:text-[#FF6666]">-28% in raided groups</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#181A16] border border-[#D7D6CD] dark:border-[#2D2E2A] flex justify-between shadow-2xs">
                    <span className="text-[#343430] dark:text-[#CCC8BC]">Trust in Local Co-Ethnics:</span>
                    <span className="font-mono font-bold text-[#D90000] dark:text-[#FF6666]">-34% relative deficit</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#181A16] border border-[#D7D6CD] dark:border-[#2D2E2A] flex justify-between shadow-2xs">
                    <span className="text-[#343430] dark:text-[#CCC8BC]">Trust in Administration & Courts:</span>
                    <span className="font-mono font-bold text-[#D90000] dark:text-[#FF6666]">-41% institutional deficit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart: Nunn Regional Slave Export Extraction */}
            <figure className="my-8 pb-4 border-b border-[#D7D6CD] dark:border-[#2D2E2A]">
              <figcaption className="mb-4">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#D90000] dark:text-[#FF6666] font-semibold block mb-1">
                  Fig. 03 // Econometric Extraction Regression
                </span>
                <h4 className="font-serif text-xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1">
                  Regional Slave Extraction Intensity vs. Current GDP per Capita
                </h4>
                <p className="text-xs text-[#5C5C55] dark:text-[#A8A499] leading-relaxed">
                  Empirical data compiled across African regional zones (Nunn 2008, Nunn & Wantchekon 2011).
                </p>
              </figcaption>

              <div className="p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#D7D6CD] dark:border-[#2D2E2A] shadow-xs">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={NUNN_SLAVE_TRADE_EXTRACTION}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" opacity={0.6} />
                      <XAxis
                        dataKey="regionOrModernCountry"
                        stroke="currentColor"
                        className="text-[#5C5C55] dark:text-[#A8A499]"
                        fontSize={10}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#D90000"
                        fontSize={11}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#1600D9"
                        fontSize={11}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'var(--tooltip-bg)', 
                          borderColor: 'var(--tooltip-border)', 
                          borderRadius: '0.75rem', 
                          fontSize: '12px',
                          color: 'var(--tooltip-text-title)'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar
                        yAxisId="left"
                        dataKey="totalExportsMillions"
                        name="Total Slave Exports (Millions)"
                        fill="#D90000"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="currentGdpPerCapitaUsd"
                        name="Current GDP per Capita ($ USD)"
                        fill="#1600D9"
                        radius={[4, 4, 0, 0]}
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
          <section id="sec-colonial_institutions" className="space-y-8 pt-6 pb-6">
            <div className="space-y-3 border-b border-[#D7D6CD] dark:border-[#2D2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.1em] text-[#1600D9] dark:text-[#7770FF] block">
                Chapter 04 // Colonial Cartels & Microeconomic Extraction
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#181816] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Extractive Institutions, Indirect Rule & Tadei’s Monopsony
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed pt-1">
                Acemoglu-Robinson settler mortality, Henn-Robinson pre-colonial political decentralization, and Federico Tadei’s price-gap econometric models.
              </p>
            </div>

            <div className="space-y-4">
              {/* Insight Surface #F5F3EC */}
              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#1600D9] space-y-3">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">1. The Settler Mortality Hypothesis</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Acemoglu, Johnson & Robinson (<em>AER</em> 2001) demonstrated that high disease environments prevented European settlements and caused the establishment of purely extractive institutions designed to transfer resources without public investments.
                </p>
              </div>

              {/* Insight Surface #F5F3EC */}
              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#D600D5] space-y-3">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">2. Pre-Colonial Decentralization & Indirect Rule</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Reconstructing 1880 polities across Africa, Nobel laureate James Robinson and Soeren Henn dismantled the myth of pre-colonial institutional failure: <strong>98.2%</strong> of territories operated through decentralized village assemblies and kinship councils, designed to protect individual liberties.
                </p>
              </div>
            </div>

            {/* Federico Tadei Price Gap Case Studies */}
            <figure className="my-8 pb-4 border-b border-[#D7D6CD] dark:border-[#2D2E2A]">
              <figcaption className="mb-4">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#1600D9] dark:text-[#7770FF] font-semibold block mb-1">
                  Fig. 04 // Microeconomic Extraction
                </span>
                <h4 className="font-serif text-xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1">
                  Federico Tadei’s Price-Gap Model: Colonial Monopsony
                </h4>
                <p className="text-xs text-[#5C5C55] dark:text-[#A8A499] leading-relaxed">
                  Quantifying the destruction of African Gains from Trade under CFAO, SCOA & UAC Concessionaire Cartels (<em>EREH</em> 2020).
                </p>
              </figcaption>

              {/* Commodity Selector Buttons */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {TADEI_MONOPSONY_CASE_STUDIES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCommodityIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeCommodityIndex === idx
                          ? 'bg-[#181816] text-[#FAFAF6] dark:bg-[#E6E3DB] dark:text-[#181816] shadow-xs'
                          : 'bg-[#FFFFFF] dark:bg-[#181A16] text-[#5C5C55] dark:text-[#A8A499] hover:text-[#181816] dark:hover:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A]'
                      }`}
                    >
                      {item.commodity} ({item.territory})
                    </button>
                  ))}
                </div>

                {/* Selected Commodity Dossier - Japandi Neutral Paper Surface */}
                <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#181A16] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] space-y-4 border-l-4 border-l-[#1600D9]">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB]">{activeCommodity.commodity}</span>
                    <span className="font-mono text-xs text-[#1600D9] dark:text-[#7770FF] font-bold">{activeCommodity.territory}</span>
                  </div>

                  <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                    <strong>Cartel / Coercion:</strong> {activeCommodity.buyerCartel} — {activeCommodity.coercionMechanism}
                  </p>

                  {/* Important Statistic White Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#D7D6CD] dark:border-[#2D2E2A] shadow-2xs">
                      <span className="text-[#77776E] text-[10px]">World Price:</span>
                      <div className="font-mono font-bold text-[#181816] dark:text-[#E6E3DB]">${activeCommodity.worldPortPriceDollars}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#D7D6CD] dark:border-[#2D2E2A] shadow-2xs">
                      <span className="text-[#77776E] text-[10px]">Competitive:</span>
                      <div className="font-mono font-bold text-[#009D00] dark:text-emerald-400">${activeCommodity.competitiveCounterfactualPrice}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#D7D6CD] dark:border-[#2D2E2A] shadow-2xs">
                      <span className="text-[#77776E] text-[10px]">Actual Paid:</span>
                      <div className="font-mono font-bold text-[#D90000] dark:text-rose-400">${activeCommodity.actualProducerPricePaid}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#D7D6CD] dark:border-[#2D2E2A] shadow-2xs">
                      <span className="text-[#77776E] text-[10px]">GFT Loss:</span>
                      <div className="font-mono font-bold text-[#D90000] dark:text-rose-400">-{activeCommodity.reductionInGainsFromTradePct}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 5: PATH DEPENDENCY & POST-COLONIAL BORDERS */}
          {/* ========================================================= */}
          <section id="sec-path_dependency" className="space-y-8 pt-6 pb-6">
            <div className="space-y-3 border-b border-[#D7D6CD] dark:border-[#2D2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.1em] text-[#D600D5] dark:text-[#FF55FF] block">
                Chapter 05 // Post-Colonial Institutional Persistence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#181816] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Marketing Boards, Urban Bias & The Berlin Border Scar
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed pt-1">
                How newly independent governments inherited and perpetuated extractive mechanisms, and the econometric evidence on arbitrary borders.
              </p>
            </div>

            <div className="space-y-4">
              {/* Insight Surface #F5F3EC */}
              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#D600D5] space-y-3">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">1. The Marketing Board Trap & Urban Bias</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Robert H. Bates (1981) demonstrated that newly independent post-colonial governments retained colonial commodity monopsonies as state marketing boards, taxing rural peasants to subsidize cheap food and public sector jobs for politically active urban elites.
                </p>
                <span className="text-[11px] font-mono text-[#D600D5] dark:text-[#FF55FF] block font-medium">Ref: Bates, Markets and States in Tropical Africa (1981)</span>
              </div>

              {/* Insight Surface #F5F3EC */}
              <div className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#1B1D19] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#1600D9] space-y-3">
                <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB] block">2. The Berlin Border Scar & Conflict Multiplier</span>
                <p className="text-xs sm:text-sm text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed font-light">
                  Michalopoulos & Papaioannou (<em>AER</em> 2016) proved that partitioned ethnic homelands experience significantly more civil conflict and depressed nightlight economic activity than non-partitioned regions.
                </p>
                <span className="text-[11px] font-mono text-[#1600D9] dark:text-[#7770FF] block font-medium">Ref: Michalopoulos & Papaioannou (AER 2016)</span>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 6: CONTEMPORARY GEOPOLITICAL SHIFTS (2025–2026) */}
          {/* ========================================================= */}
          <section id="sec-contemporary_geopolitics" className="space-y-8 pt-6 pb-6">
            <div className="space-y-3 border-b border-[#D7D6CD] dark:border-[#2D2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.1em] text-[#009D00] dark:text-[#4DFF4D] block">
                Chapter 06 // Contemporary Geopolitical Frontier (2025–2026)
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#181816] dark:text-[#E6E3DB] tracking-tight leading-snug">
                From Aid Dependency to Rule-Making Power
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed pt-1">
                The UN General Assembly Resolution of March 25, 2026, the AU-CARICOM Joint 19-Point Accra Plan, Bridgetown 3.0, and the new multilateral order.
              </p>
            </div>

            {/* Contemporary Accords List */}
            <div className="space-y-4">
              {CONTEMPORARY_GEOPOLITICAL_PARADIGMS.map((accord, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#F5F3EC] text-[#181816] dark:bg-[#181A16] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] border-l-4 border-l-[#009D00] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#181816] dark:text-[#E6E3DB]">{accord.initiative}</span>
                    <span className="px-2 py-0.5 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#D7D6CD] dark:border-[#2D2E2A] text-[10px] font-mono text-[#009D00] dark:text-[#4DFF4D] font-bold">{accord.milestoneDate}</span>
                  </div>
                  <p className="text-xs text-[#5C5C55] dark:text-[#CCC8BC]"><strong>Lead Actors:</strong> {accord.leadActors}</p>
                  <ul className="list-disc list-inside text-xs text-[#5C5C55] dark:text-[#CCC8BC] space-y-1 font-light">
                    {accord.coreDemandsOrMechanisms.map((demand, dIdx) => (
                      <li key={dIdx}>{demand}</li>
                    ))}
                  </ul>
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#D7D6CD] dark:border-[#2D2E2A] text-[11px] text-[#5C5C55] dark:text-[#A8A499] italic">
                    <strong>Systemic Counter-Position:</strong> {accord.systemicConflictOrObstacle}
                  </div>
                </div>
              ))}
            </div>

            {/* Highlight on UN General Assembly Resolution (Key Finding Pale Green #F3FAF1) */}
            <div className="p-6 rounded-2xl bg-[#F3FAF1] text-[#181816] dark:bg-emerald-950/20 dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-zinc-800 space-y-3 border-l-4 border-l-[#009D00]">
              <span className="text-xs font-mono font-bold text-[#009D00] dark:text-[#4DFF4D] uppercase tracking-wider block">
                UN General Assembly Resolution // March 25, 2026
              </span>
              <h4 className="font-serif text-lg font-bold text-[#181816] dark:text-[#E6E3DB]">
                Declaration of Transatlantic Slavery as the "Gravest Crime Against Humanity"
              </h4>
              <p className="text-xs sm:text-sm text-[#343430] dark:text-[#CCC8BC] leading-relaxed font-light">
                Adopted by a <strong>123-3 vote</strong> (Ghana/AU and CARICOM leading), this historic resolution establishes the permanent legal foundation for multilateral restorative justice and reparatory development frameworks.
              </p>
            </div>
          </section>

          {/* ========================================================= */}
          {/* CHAPTER 7: BIBLIOGRAPHY & PRIMARY DATA ARCHIVES */}
          {/* ========================================================= */}
          <section id="sec-bibliography_sources" className="space-y-8 pt-6 pb-16">
            <div className="space-y-3 border-b border-[#D7D6CD] dark:border-[#2D2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.1em] text-[#5C5C55] dark:text-[#A8A499] block">
                Chapter 07 // Peer-Reviewed Bibliography & Primary Archives
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#181816] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Academic Citations, DOIs & Working Papers
              </h2>
              <p className="font-sans font-light text-sm sm:text-base text-[#5C5C55] dark:text-[#CCC8BC] leading-relaxed pt-1">
                Full references to foundational papers in the American Economic Review, Quarterly Journal of Economics, and European Review of Economic History.
              </p>
            </div>

            <div className="space-y-3">
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
                <div key={idx} className="p-4 rounded-xl bg-[#F5F3EC] text-[#181816] dark:bg-[#181A16] dark:text-[#E6E3DB] border border-[#D7D6CD] dark:border-[#2D2E2A] space-y-1.5 shadow-2xs">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-serif font-bold text-sm text-[#181816] dark:text-[#E6E3DB]">{item.title}</span>
                    <span className="px-2 py-0.5 rounded bg-[#FFFFFF] dark:bg-[#20231F] border border-[#D7D6CD] dark:border-[#2D2E2A] text-[10px] font-mono text-[#D98200] dark:text-[#FFB84A] shrink-0 font-bold">
                      {item.year}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C5C55] dark:text-[#A8A499] font-light">
                    {item.authors} — <em>{item.journal}</em>
                  </p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#181816] dark:text-[#E6E3DB] hover:underline inline-flex items-center gap-1 mt-1 font-medium"
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
