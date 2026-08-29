import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  Skull, 
  BookOpen, 
  Scale, 
  Globe2, 
  Search, 
  FileText, 
  ExternalLink, 
  Layers, 
  ShieldAlert, 
  TrendingDown, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  Users, 
  Activity,
  ArrowRight,
  Flame,
  HeartHandshake,
  Share2,
  Bookmark,
  Printer,
  ChevronRight,
  Quote,
  Clock,
  Calendar,
  Sparkles,
  Info,
  Sliders,
  Anchor,
  Copy,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  IBD_GENOMIC_CONCORDANCE, 
  SEX_BIASED_GENE_FLOW, 
  ANCIENT_DNA_STUDIES, 
  SCIENTIFIC_RACISM_CHRONOLOGY, 
  STRUCTURAL_UNDERDEVELOPMENT_DATA, 
  NY_AFRICAN_BURIAL_GROUND, 
  PUBLIC_ARCHAEOLOGY_AND_MYTHS, 
  MOLECULAR_RESEARCH_CITATIONS,
  ResearchCitation
} from '../data/molecularLegaciesData';

export type ArticleSectionId = 
  | 'sec-epistemology'
  | 'sec-genomics'
  | 'sec-sexual-violence'
  | 'sec-scientific-racism'
  | 'sec-underdevelopment'
  | 'sec-bioarchaeology'
  | 'sec-decolonizing'
  | 'sec-bibliography';

interface SectionNavItem {
  id: ArticleSectionId;
  number: string;
  shortTitle: string;
  fullTitle: string;
  icon: React.ElementType;
}

const ARTICLE_SECTIONS: SectionNavItem[] = [
  {
    id: 'sec-epistemology',
    number: '01',
    shortTitle: 'Epistemology',
    fullTitle: 'The Tripartite Epistemological Model & Archival Silences',
    icon: Compass
  },
  {
    id: 'sec-genomics',
    number: '02',
    shortTitle: 'Genomics',
    fullTitle: 'Haplotype Deconvolution, IBD Sharing & Ancient DNA',
    icon: Dna
  },
  {
    id: 'sec-sexual-violence',
    number: '03',
    shortTitle: 'Sexual Violence',
    fullTitle: 'Sex-Biased Gene Flow & Maroon Genetic Sovereignty',
    icon: Users
  },
  {
    id: 'sec-scientific-racism',
    number: '04',
    shortTitle: 'Ideology',
    fullTitle: 'The Curse of Ham, Scientific Racism & Legal Subjugation',
    icon: Scale
  },
  {
    id: 'sec-underdevelopment',
    number: '05',
    shortTitle: 'Extraction',
    fullTitle: 'Demographic Evacuation & Capital Accumulation in the Metropole',
    icon: TrendingDown
  },
  {
    id: 'sec-bioarchaeology',
    number: '06',
    shortTitle: 'Bioarchaeology',
    fullTitle: 'The African Burial Ground, Enthesopathies & Sankofa Cosmograms',
    icon: Skull
  },
  {
    id: 'sec-decolonizing',
    number: '07',
    shortTitle: 'Decolonizing',
    fullTitle: 'Consumer Genomics, Community Sovereignty & Deconstructing Myths',
    icon: HeartHandshake
  },
  {
    id: 'sec-bibliography',
    number: '08',
    shortTitle: 'Bibliography',
    fullTitle: 'Academic Citations, DOIs & Primary Data Archives',
    icon: BookOpen
  }
];

interface MolecularLegaciesArticleViewProps {
  onNavigateToAtlas?: () => void;
  onNavigateToFoundations?: () => void;
}

export const MolecularLegaciesArticleView: React.FC<MolecularLegaciesArticleViewProps> = ({
  onNavigateToAtlas,
  onNavigateToFoundations
}) => {
  const [activeSection, setActiveSection] = useState<ArticleSectionId>('sec-epistemology');
  const [citationFilter, setCitationFilter] = useState<string>('all');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [fontSizeClass, setFontSizeClass] = useState<'normal' | 'large'>('normal');

  // Scroll listener for active section indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
      for (const section of ARTICLE_SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: ArticleSectionId) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -130;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCopyCitation = () => {
    const citationText = `Micheletti, S. J., et al. (2020). Genetic Consequences of the Transatlantic Slave Trade in the Americas. The American Journal of Human Genetics, 107(2), 265-277. https://doi.org/10.1016/j.ajhg.2020.06.012`;
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
  };

  const filteredCitations = citationFilter === 'all' 
    ? MOLECULAR_RESEARCH_CITATIONS 
    : MOLECULAR_RESEARCH_CITATIONS.filter(c => c.category.toLowerCase() === citationFilter.toLowerCase());

  return (
    <div className={`report-frame max-w-[1440px] mx-auto border-x border-[#D7D6CD] dark:border-[#2D2E2A] px-4 sm:px-6 lg:px-10 py-8 transition-colors duration-300 ${fontSizeClass === 'large' ? 'text-[1.125rem]' : 'text-[1.063rem]'}`} id="molecular-legacies-article-view">
      
      {/* 1. ASYMMETRIC EDITORIAL HEADER BLOCK */}
      <header className="border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-10 mb-12 relative">
        <div className="space-y-4">
          
          {/* Top Metadata Kicker */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono uppercase tracking-[0.15em] text-[#5C5C55] dark:text-[#A8A499] font-semibold">
            <div className="flex items-center gap-2">
              <button 
                onClick={onNavigateToAtlas}
                className="hover:underline text-[#343430] dark:text-[#E6E3DB] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Anchor className="w-3.5 h-3.5 text-[#3F6955] dark:text-[#76A890]" />
                <span>Atlantic Slave Trade Atlas</span>
              </button>
              <span>//</span>
              <span>Research Paper // Vol. 14</span>
              <span>//</span>
              <span>Interdisciplinary Synthesis</span>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSizeClass(prev => prev === 'normal' ? 'large' : 'normal')}
                className="px-3 py-1.5 rounded-xl border border-[#DCD9CE] dark:border-[#2C2E2A] bg-transparent hover:bg-[#181816] hover:text-[#FAFAF6] dark:hover:bg-[#E6E3DB] dark:hover:text-[#181816] text-[#181816] dark:text-[#E6E3DB] text-[0.75rem] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                title="Toggle Reading Font Size"
              >
                Font: {fontSizeClass === 'normal' ? 'Standard' : 'Enlarged'}
              </button>
              <button
                onClick={handleCopyCitation}
                className="px-3 py-1.5 rounded-xl border border-[#DCD9CE] dark:border-[#2C2E2A] bg-transparent hover:bg-[#181816] hover:text-[#FAFAF6] dark:hover:bg-[#E6E3DB] dark:hover:text-[#181816] text-[#181816] dark:text-[#E6E3DB] text-[0.75rem] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-[#3F6955] dark:text-[#76A890]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Copied DOI' : 'Cite Article'}</span>
              </button>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-3 pt-2">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#181816] dark:text-[#E6E3DB] leading-[1.12] max-w-5xl">
              The Molecular and Material Legacies of Slavery
            </h1>
            <p className="font-sans font-light text-lg sm:text-xl text-[#55554E] dark:text-[#C5C1B4] leading-relaxed max-w-4xl">
              An Interdisciplinary Synthesis of Genomic, Historical, and Bioarchaeological Records
            </p>
          </div>

          {/* Editorial Meta Strip */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5C5C55] dark:text-[#A8A499] border-t border-[#DCD9CE] dark:border-[#2C2E2A]">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published July 2020 • Updated 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>35 min read • 8,400 words</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-[#3F6955] dark:text-[#76A890]" />
                <span>Peer-Reviewed Synthesis (AJHG, Nature, Antiquity)</span>
              </div>
            </div>
            <div className="text-[11px]">
              DOI: <span className="underline font-medium">10.1016/j.ajhg.2020.06.012</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. EXECUTIVE ABSTRACT & EMPIRICAL HIGHLIGHTS HERO BLOCK */}
      <section className="space-y-8 mb-14">
        {/* Executive Abstract Hero Card - Calm Editorial Japanese Paper Surface */}
        <div className="bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] p-7 sm:p-9 rounded-2xl shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3F6955] dark:bg-[#527E6A]" />
          <div className="max-w-4xl space-y-4 pl-2 sm:pl-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-[#3F6955] dark:text-[#6EA88F] font-semibold">
              <span>Executive Epistemic Summary</span>
            </div>
            <p className="font-serif text-lg sm:text-xl md:text-[1.35rem] text-[#1A1A18] dark:text-[#E6E3DB] leading-relaxed italic font-normal">
              “For centuries, the human cost of the Transatlantic Slave Trade was mediated almost exclusively through the sanitized bookkeeping of enslavers—shipping manifests, bill of sale ledgers, and probate inventories. Modern genome-wide sequencing, high-resolution ancient DNA (aDNA), and skeletal bioarchaeology have opened a biological counter-archive that cannot be expunged.”
            </p>
            <p className="font-sans font-light text-sm sm:text-[0.938rem] text-[#55554E] dark:text-[#C5C1B4] leading-relaxed pt-1">
              By analyzing <strong>haplotype deconvolution</strong> across 50,000+ modern genomes alongside forensic bioarchaeology from the <strong>New York African Burial Ground</strong> and <strong>St. Helena Liberated African graveyards</strong>, this synthesis reveals how demographic dismemberment, extreme sexual violence, and structural capital accumulation transformed human bodies into the biological ledger of empire.
            </p>
          </div>
        </div>

        {/* Harmonious 1-Row Empirical Corpus (Calm Mineral & Earth Tonal Palette) */}
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Pill 1: Genomes */}
            <div className="p-5 rounded-2xl bg-[#F6F4ED] dark:bg-[#1B1D19] border border-[#DCD9CE] dark:border-[#2C2E2A] flex flex-col justify-between shadow-2xs hover:border-[#854972]/40 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#854972] dark:bg-[#B36E9E]" />
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#DCD9CE]/60 dark:border-[#2C2E2A] pl-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#854972] dark:text-[#C98EB6]">Genomes</span>
                <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB]">50,281</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light pl-1">
                Haplotype deconvolution across 50,281 individuals mapping regional African ancestry.
              </p>
            </div>

            {/* Pill 2: Sex-Bias */}
            <div className="p-5 rounded-2xl bg-[#F6F4ED] dark:bg-[#1B1D19] border border-[#DCD9CE] dark:border-[#2C2E2A] flex flex-col justify-between shadow-2xs hover:border-[#A64E3E]/40 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#A64E3E] dark:bg-[#DB8B7D]" />
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#DCD9CE]/60 dark:border-[#2C2E2A] pl-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A64E3E] dark:text-[#DB8B7D]">Sex-Bias</span>
                <span className="font-serif font-semibold text-sm sm:text-base text-[#A64E3E] dark:text-[#DB8B7D]">15:1–20:1</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light pl-1">
                Asymmetric genetic contribution of African women vs men, recording systematic sexual violence.
              </p>
            </div>

            {/* Pill 3: Maroon Sovereignty */}
            <div className="p-5 rounded-2xl bg-[#F6F4ED] dark:bg-[#1B1D19] border border-[#DCD9CE] dark:border-[#2C2E2A] flex flex-col justify-between shadow-2xs hover:border-[#3F6955]/40 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#3F6955] dark:bg-[#6EA88F]" />
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#DCD9CE]/60 dark:border-[#2C2E2A] pl-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3F6955] dark:text-[#76A890]">Maroon</span>
                <span className="font-serif font-semibold text-sm sm:text-base text-[#3F6955] dark:text-[#76A890]">98%</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light pl-1">
                Palenque & Saramaka autonomous maroon communities preserving 98% African ancestral genomic legacy.
              </p>
            </div>

            {/* Pill 4: Skeletal Forensic Archive */}
            <div className="p-5 rounded-2xl bg-[#F6F4ED] dark:bg-[#1B1D19] border border-[#DCD9CE] dark:border-[#2C2E2A] flex flex-col justify-between shadow-2xs hover:border-[#96672E]/40 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#96672E] dark:bg-[#D1A268]" />
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-[#DCD9CE]/60 dark:border-[#2C2E2A] pl-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#96672E] dark:text-[#D1A268]">Burials</span>
                <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB]">419</span>
              </div>
              <p className="text-xs text-[#55554E] dark:text-[#BBB7AB] leading-relaxed mt-2.5 font-light pl-1">
                419 excavated individuals from New York African Burial Ground revealing severe musculoskeletal stress.
              </p>
            </div>
          </div>

          {/* Prominent & Engaging Companion Volume Action Bar (Warm Terracotta Tone) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 px-0.5">
            <div className="flex items-center gap-2 text-[11px] text-[#5C5C55] dark:text-[#A8A499] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#3F6955] dark:bg-[#6EA88F]"></span>
              <span className="tracking-tight font-medium">Interdisciplinary Research Series</span>
            </div>
            <button
              onClick={onNavigateToFoundations}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#9E5224] hover:bg-[#8B461C] text-amber-50 dark:bg-[#D4894E] dark:hover:bg-[#C57C41] dark:text-[#1F1206] font-sans text-xs font-semibold shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 dark:bg-black/15 flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5 text-amber-100 dark:text-[#1F1206] group-hover:rotate-6 transition-transform" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider text-amber-100/90 dark:text-[#1F1206]/85 font-bold leading-none">Companion Master Report</span>
                <span className="text-xs font-semibold tracking-tight leading-tight">Foundations of African Development</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-100 dark:text-[#1F1206] group-hover:translate-x-1 transition-transform ml-0.5 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION NAVIGATION SELECTOR BAR (FULL WIDTH, WARM BACKGROUND, STICKY BELOW TOPBAR top-16) */}
      <div className="mb-14 sm:mb-16 sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-3 bg-[#F4EFE6]/95 dark:bg-[#1C1A17]/95 backdrop-blur-md border-y border-[#E2DAD0] dark:border-[#332E27] shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar justify-start md:justify-center max-w-5xl mx-auto py-0.5">
          {ARTICLE_SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            const Icon = sec.icon;
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
                <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{sec.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FULL CONTINUOUS EDITORIAL READING ENGINE (ALL 8 SECTIONS DISPLAYED IN FULL) */}
      <main className="max-w-4xl mx-auto space-y-28 sm:space-y-36 text-left">
          
          {/* SECTION 1: EPISTEMOLOGY */}
          <section id="sec-epistemology" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#3F6955] dark:text-[#6EA88F] block">
                01 // Epistemology & Historical Method
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                The Tripartite Epistemological Model & Archival Silences
              </h2>
            </div>

            <div className="space-y-5 text-[#3C3C37] dark:text-[#C5C2B6] leading-[1.85] font-sans font-light">
              <p className="text-base sm:text-[1.063rem]">
                In <em>Silencing the Past: Power and the Production of History</em> (1995), Michel-Rolph Trouillot established that historical narratives are systematically conditioned by four distinct moments of erasure: <strong>the moment of fact creation</strong> (the making of sources), <strong>the moment of fact assembly</strong> (the making of archives), <strong>the moment of fact retrieval</strong> (the making of narratives), and <strong>the moment of retrospective significance</strong> (the making of history in the final instance).
              </p>
              <p>
                The primary written archives of the Transatlantic Slave Trade—such as the 36,000+ voyage records preserved in the <em>Trans-Atlantic Slave Trade Database</em> (Voyages)—were authored almost exclusively by ship captains, colonial customs officers, and trading conglomerates like the <em>Royal African Company</em> and the <em>Dutch West India Company</em>. In these ledgers, human beings were quantified strictly as commercial liabilities, physical cargo (<em>pièces d'Inde</em>), and mortality losses to be claimed against marine insurance underwriters.
              </p>
            </div>

            {/* Tripartite Framework Model Callout (Japandi Quiet Paper Surface #F6F4ED) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-4 shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3F6955] dark:bg-[#527E6A]" />
              <h4 className="text-xs font-mono font-semibold text-[#3F6955] dark:text-[#6EA88F] uppercase tracking-wider flex items-center gap-2 pl-1.5">
                <Compass className="w-4 h-4" />
                <span>The Tripartite Epistemological Model</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pl-1.5">
                <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2 shadow-2xs">
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#1A1A18] dark:text-[#E6E3DB] block">1. Archival & Historical</span>
                  <p className="text-xs text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light">
                    Voyage databases, plantation accounts, and shipping logs. Captures macro-economic shipping volumes but systematically silences subjective human agency and experiences.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2 shadow-2xs">
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#1A1A18] dark:text-[#E6E3DB] block">2. Molecular & Genomic</span>
                  <p className="text-xs text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light">
                    Haplotype deconvolution, IBD sharing, and ancient DNA. Reconstructs unbroken biological descent and reveals unrecorded demographic events and extreme sexual exploitation.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2 shadow-2xs">
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#1A1A18] dark:text-[#E6E3DB] block">3. Forensic Bioarchaeology</span>
                  <p className="text-xs text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light">
                    Osteological pathology, strontium isotopes, and mortuary cosmograms. Documents the direct biomechanical trauma of labor and cultural resistance encoded in burials.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: GENOMICS & IBD */}
          <section id="sec-genomics" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#854972] dark:text-[#C98EB6] block">
                02 // The Molecular Witness
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Haplotype Deconvolution, Identity-by-Descent & Ancient DNA
              </h2>
            </div>

            {/* In-line Highlight Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-5 sm:p-6 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#73736A] dark:text-[#A8A499]">Cohort Size</span>
                <div className="font-serif text-xl sm:text-2xl font-semibold text-[#181816] dark:text-[#E6E3DB]">50,281</div>
                <span className="text-[10px] text-[#73736A] dark:text-[#9A968B] block">Sequenced Genomes</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#73736A] dark:text-[#A8A499]">Voyage Database</span>
                <div className="font-serif text-xl sm:text-2xl font-semibold text-[#3F6955] dark:text-[#6EA88F]">36,000+</div>
                <span className="text-[10px] text-[#73736A] dark:text-[#9A968B] block">Transatlantic Routes</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#73736A] dark:text-[#A8A499]">US Nigerian Bias</span>
                <div className="font-serif text-xl sm:text-2xl font-semibold text-[#96672E] dark:text-[#D1A268]">41% vs 24%</div>
                <span className="text-[10px] text-[#73736A] dark:text-[#9A968B] block">Genomic Over-Rep.</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#73736A] dark:text-[#A8A499]">Maroon Retention</span>
                <div className="font-serif text-xl sm:text-2xl font-semibold text-[#3F6955] dark:text-[#6EA88F]">98%</div>
                <span className="text-[10px] text-[#73736A] dark:text-[#9A968B] block">Pure African DNA</span>
              </div>
            </div>

            <div className="space-y-5 text-[#3C3C37] dark:text-[#C5C2B6] leading-[1.85] font-sans font-light">
              <p>
                In 2020, Steven J. Micheletti and a large consortium of population geneticists published a landmark study in <em>The American Journal of Human Genetics</em> analyzing <strong>50,281 research participants of African descent</strong> across the United States, the Caribbean, and Central/South America. By utilizing Identity-by-Descent (IBD) segment sharing and local ancestry deconvolution, they compared the genetic contributions of six distinct African coastal regions against the documented disembarkation records from the Trans-Atlantic Slave Trade Database.
              </p>
              <p>
                The molecular record revealed profound concordances—and equally startling divergences—from historical manifests:
              </p>
            </div>

            {/* Interactive Chart: IBD Concordance vs Historical Manifests */}
            <figure className="my-12 sm:my-14 pb-6 border-b border-[#DCD9CE] dark:border-[#2C2E2A] space-y-5">
              <figcaption className="mb-2">
                <span className="text-[0.75rem] font-mono uppercase tracking-[0.1em] text-[#854972] dark:text-[#C98EB6] font-semibold block mb-1.5">
                  Fig. 01 // Empirical Genomic Alignment
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-normal text-[#181816] dark:text-[#E6E3DB] mb-1.5">
                  Historical Voyage Manifests vs Modern Genomic Haplotype Contributions
                </h4>
                <p className="text-xs text-[#55554E] dark:text-[#A8A499] leading-relaxed">
                  Data adapted from Micheletti et al. (<em>AJHG</em> 2020) across 50,281 individuals in 5 major Americas regions.
                </p>
              </figcaption>

              <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#181A16] border border-[#DCD9CE] dark:border-[#2C2E2A] shadow-2xs">
                <div className="h-80 sm:h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={IBD_GENOMIC_CONCORDANCE}
                      margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800/80" opacity={0.5} />
                      <XAxis 
                        dataKey="region" 
                        stroke="currentColor" 
                        className="text-[#73736A] dark:text-[#A8A499]"
                        fontSize={11}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={55}
                      />
                      <YAxis 
                        stroke="currentColor" 
                        className="text-[#73736A] dark:text-[#A8A499]"
                        fontSize={11}
                        unit="%"
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
                        dataKey="historicalManifestPct" 
                        name="Historical Voyage Manifests (%)" 
                        fill="#3B5B75" 
                        radius={[3, 3, 0, 0]}
                      />
                      <Bar 
                        dataKey="presentDayGenomicPct" 
                        name="Modern Genomic Contribution (%)" 
                        fill="#526E58" 
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </figure>

            {/* Ancient DNA Case Studies */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-semibold text-[#854972] dark:text-[#C98EB6] uppercase tracking-wider">
                Ancient DNA (aDNA) Case Studies
              </h4>
              <div className="space-y-3.5">
                {ANCIENT_DNA_STUDIES.map((study) => (
                  <div key={study.id} className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2.5 shadow-2xs relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#854972] dark:bg-[#A3608F]" />
                    <div className="flex items-center justify-between pl-1.5">
                      <span className="font-serif font-semibold text-base text-[#181816] dark:text-[#E6E3DB]">{study.title}</span>
                      <span className="font-mono text-xs text-[#854972] dark:text-[#C98EB6] font-semibold">{study.dating}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] pl-1.5">
                      <strong>Location & Lead Author:</strong> {study.location} — {study.leadAuthor}
                    </p>
                    <p className="text-xs sm:text-sm text-[#3C3C37] dark:text-[#CCC8BC] leading-relaxed font-light pl-1.5">
                      <strong>Findings:</strong> {study.genomicFindings}
                    </p>
                    <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] italic pl-1.5">
                      <strong>Significance:</strong> {study.historicalSignificance}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: SEXUAL VIOLENCE & MAROON GENOMICS */}
          <section id="sec-sexual-violence" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#A64E3E] dark:text-[#DB8B7D] block">
                03 // The Ledger of Sexual Violence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Sex-Biased Gene Flow & Maroon Genetic Sovereignty
              </h2>
            </div>

            <div className="space-y-5 text-[#3C3C37] dark:text-[#C5C2B6] leading-[1.85] font-sans font-light">
              <p>
                One of the most harrowing and consistent revelations of population genomics is the stark asymmetry between maternal (mitochondrial DNA / X-chromosome) and paternal (Y-chromosome / autosomal) contributions across the Americas.
              </p>
              <p>
                Despite historical manifests proving that <strong>over 65% of enslaved individuals embarked on slave vessels were adult men</strong>, modern African-descendant populations in Latin America and the Caribbean show a genetic pool overwhelmingly sustained by African women, while paternal lineages were heavily displaced by European men through systemic sexual coercion and rape.
              </p>
            </div>

            {/* Sex Bias Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SEX_BIASED_GENE_FLOW.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] dark:bg-[#1B1D19] border border-[#DCD9CE] dark:border-[#2C2E2A] text-[#1E1E1C] dark:text-[#E2DFD6] shadow-2xs space-y-3.5 transition-colors relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A64E3E] dark:bg-[#DB8B7D]" />
                  <div className="flex items-center justify-between pl-1.5">
                    <span className="font-serif font-semibold text-base tracking-tight leading-snug text-[#1A1A18] dark:text-[#E6E3DB]">
                      {item.population}
                    </span>
                  </div>

                  {/* Internal tonal accent container for metrics */}
                  <div className="bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] rounded-xl p-3.5 space-y-2 text-xs text-[#55554E] dark:text-[#A8A499] ml-1.5">
                    <div className="flex justify-between items-center tracking-tight">
                      <span>Maternal African mtDNA:</span>
                      <strong className="font-mono text-xs sm:text-sm font-semibold text-[#1A1A18] dark:text-[#E6E3DB]">{item.africanMaternalMt}%</strong>
                    </div>
                    <div className="flex justify-between items-center tracking-tight">
                      <span>Paternal African Y-DNA:</span>
                      <strong className="font-mono text-xs sm:text-sm font-semibold text-[#A64E3E] dark:text-[#DB8B7D]">{item.africanPaternalY}%</strong>
                    </div>
                    <div className="flex justify-between items-center tracking-tight">
                      <span>Paternal European Y-DNA:</span>
                      <strong className="font-mono text-xs sm:text-sm font-semibold text-[#3B5B75] dark:text-[#7B9BB5]">{item.europeanPaternalY}%</strong>
                    </div>
                  </div>

                  {/* Context block */}
                  <div className="p-3.5 rounded-xl bg-[#ECE8DC] dark:bg-[#141613] ml-1.5">
                    <p className="text-xs font-serif font-light text-[#3C3C37] dark:text-[#C5C2B6] leading-relaxed tracking-tight">
                      {item.historicalContext}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Maroon Genomic Sovereignty Callout (Pale Sage Tone #F3F7F4) */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F3F7F4] text-[#1E1E1C] dark:bg-[#16211C] dark:text-[#E2DFD6] border border-[#D5E2D9] dark:border-[#25362E] space-y-3 shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3F6955] dark:bg-[#6EA88F]" />
              <span className="text-xs font-mono font-semibold text-[#3F6955] dark:text-[#76A890] uppercase tracking-wider block pl-1.5">
                Maroon Genetic Sovereignty: The Noir Marron of the Guianas
              </span>
              <p className="text-xs sm:text-sm text-[#3C3C37] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                In striking contrast to plantation societies subjected to state-sponsored <em>branqueamento</em> (whitening policies), Fortes-Lima et al. (<em>Nature Communications</em> 2017) demonstrated that the Maroon populations of Suriname and French Guiana (Aluku, Ndjuka, Saramaka, Paramaka) retained <strong>&gt;98% unadmixed African ancestry</strong> with predominantly Western and Central African haplotypes, providing living proof of autonomous self-liberation and military sovereignty.
              </p>
            </div>
          </section>

          {/* SECTION 4: SCIENTIFIC RACISM & LEGAL SUBJUGATION */}
          <section id="sec-scientific-racism" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#3B5B75] dark:text-[#7B9BB5] block">
                04 // Ideological Architecture
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                The Curse of Ham, Polygenism & Legal Subjugation
              </h2>
            </div>

            <div className="space-y-5 text-[#3C3C37] dark:text-[#C5C2B6] leading-[1.85] font-sans font-light">
              <p>
                The Transatlantic Slave Trade required a continuous, evolving intellectual and legal superstructure to reconcile human bondage with Christian theology, Enlightenment rationalism, and liberal constitutionalism.
              </p>
            </div>

            {/* Timeline of Racial Ideology */}
            <div className="space-y-4">
              {SCIENTIFIC_RACISM_CHRONOLOGY.map((step, idx) => (
                <div key={idx} className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2.5 shadow-2xs relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3B5B75] dark:bg-[#52799A]" />
                  <div className="flex items-center justify-between pl-1.5">
                    <span className="font-mono text-xs font-semibold text-[#3B5B75] dark:text-[#7B9BB5]">{step.era}</span>
                    <span className="font-serif font-semibold text-base text-[#181816] dark:text-[#E6E3DB]">{step.scholarOrEvent}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] pl-1.5">
                    <strong>Paradigm:</strong> {step.paradigm}
                  </p>
                  <p className="text-xs sm:text-sm text-[#3C3C37] dark:text-[#C5C2B6] leading-relaxed font-light pl-1.5">
                    {step.keyVarietiesAndRanking}
                  </p>
                  <p className="text-xs sm:text-sm text-[#3B5B75] dark:text-[#7B9BB5] pt-1 font-medium pl-1.5">
                    <strong>Economic & Legal Function:</strong> {step.economicAndLegalFunction}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: STRUCTURAL UNDERDEVELOPMENT & CAPITAL */}
          <section id="sec-underdevelopment" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#9E6A2E] dark:text-[#D4A060] block">
                05 // Structural Underdevelopment & Capital Accumulation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                The Williams Thesis & the Econometrics of Underdevelopment
              </h2>
            </div>

            <div className="space-y-5 text-[#3C3C37] dark:text-[#C5C2B6] leading-[1.85] font-sans font-light">
              <p>
                In 1944, Eric Williams published <em>Capitalism and Slavery</em>, proposing what is now recognized as the seminal macroeconomic thesis of Atlantic history: triangular slave trade profits provided the primary capital accumulation necessary to finance Britain’s Industrial Revolution.
              </p>
              <p>
                Modern econometric studies by Nathan Nunn (2008) and Acemoglu, Johnson & Robinson (2001) provide rigorous quantitative backing for Williams’ thesis, proving that the African regions with the highest slave extraction rates exhibit the lowest GDP per capita, lowest school enrollment, and highest institutional fragility in the 21st century.
              </p>
            </div>

            {/* Economic Data Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-6 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A64E3E] dark:bg-[#C26252]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">Demographic Drain</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light pl-1.5">
                  {STRUCTURAL_UNDERDEVELOPMENT_DATA.africanDemographicDrain.totalExtracted}
                </p>
                <div className="text-[11px] font-mono text-[#A64E3E] dark:text-[#DB8B7D] font-semibold pl-1.5">
                  {STRUCTURAL_UNDERDEVELOPMENT_DATA.africanDemographicDrain.ageDemographics}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#9E6A2E] dark:bg-[#BF843E]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">Plantation Demographics</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light pl-1.5">
                  {STRUCTURAL_UNDERDEVELOPMENT_DATA.plantationDemographicSink.mortalityAttrition}
                </p>
                <div className="text-[11px] font-mono text-[#9E6A2E] dark:text-[#D4A060] font-semibold pl-1.5">
                  {STRUCTURAL_UNDERDEVELOPMENT_DATA.plantationDemographicSink.regimeComparison}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2.5 shadow-2xs relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3B5B75] dark:bg-[#52799A]" />
                <span className="font-serif font-semibold text-base sm:text-lg text-[#181816] dark:text-[#E6E3DB] block pl-1.5">Capital Accumulation</span>
                <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light pl-1.5">
                  {STRUCTURAL_UNDERDEVELOPMENT_DATA.globalCapitalAccumulation.financialInstitutions}
                </p>
                <div className="text-[11px] font-mono text-[#3B5B75] dark:text-[#7B9BB5] font-semibold pl-1.5">
                  {STRUCTURAL_UNDERDEVELOPMENT_DATA.globalCapitalAccumulation.industrialRevolution}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: BIOARCHAEOLOGY & AFRICAN BURIAL GROUND */}
          <section id="sec-bioarchaeology" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#9E6A2E] dark:text-[#D4A060] block">
                06 // The Skeletal Counter-Archive
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Forensic Bioarchaeology of the New York African Burial Ground
              </h2>
            </div>

            <div className="space-y-5 text-[#3C3C37] dark:text-[#C5C2B6] leading-[1.85] font-sans font-light">
              <p>
                Excavated in lower Manhattan between 1991 and 1992 under the scientific direction of Dr. Michael L. Blakey (Howard University), the <strong>{NY_AFRICAN_BURIAL_GROUND.siteName}</strong> represents the most significant bioarchaeological discovery of the African diaspora in North America.
              </p>
              <p>
                Containing over {NY_AFRICAN_BURIAL_GROUND.individualsAnalyzed} analyzed burials, the skeletal remains provided forensic proof of brutal biomechanical strain, extreme juvenile mortality, and deeply preserved West African cosmological rituals.
              </p>
            </div>

            {/* Pathology Table */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-4 shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#9E6A2E] dark:bg-[#BF843E]" />
              <span className="text-xs font-mono font-semibold text-[#9E6A2E] dark:text-[#D4A060] uppercase tracking-wider block pl-1.5">
                Skeletal Evidence & Cultural Persistence (NYABG)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pl-1.5">
                <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-1.5 shadow-2xs">
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] block">Trauma & Physical Labor</span>
                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light">
                    {NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.traumaAndLabor}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-1.5 shadow-2xs">
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] block">Childhood & Nutritional Stress</span>
                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light">
                    {NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.nutritionalStress} — {NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.childhoodMortality}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-1.5 shadow-2xs">
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] block">Ritual Dental Modifications</span>
                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light">
                    {NY_AFRICAN_BURIAL_GROUND.culturalPersistence.ritualDentalModifications}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-1.5 shadow-2xs">
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] block">Grave Goods & Sankofa Cosmograms</span>
                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] leading-relaxed font-light">
                    {NY_AFRICAN_BURIAL_GROUND.culturalPersistence.graveGoodsAndBeads}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: DECOLONIZING HERITAGE & MYTHS */}
          <section id="sec-decolonizing" className="space-y-8 pt-8 pb-8">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#3F6955] dark:text-[#6EA88F] block">
                07 // Decolonizing Heritage & Public Archaeology
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Direct-to-Consumer Genomics, Community Sovereignty & Dismantling Myths
              </h2>
            </div>

            <div className="space-y-5 text-[#3C3C37] dark:text-[#C5C2B6] leading-[1.85] font-sans font-light">
              <p>
                As consumer genetic ancestry testing ({PUBLIC_ARCHAEOLOGY_AND_MYTHS.consumerGenomicsLandscape.platforms.join(', ')}) proliferates across millions of descendants of enslaved Africans, population geneticists and bioethicists emphasize the necessity of scientific nuance: genetic percentages do not equate to ethnic or cultural identity.
              </p>
            </div>

            {/* Public Myths Deconstruction */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-3 shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#9E6A2E] dark:bg-[#BF843E]" />
              <div className="flex items-start gap-2.5 pl-1.5">
                <AlertCircle className="w-4 h-4 text-[#9E6A2E] dark:text-[#D1A268] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-xs font-mono uppercase text-[#73736A] dark:text-[#A8A499]">Popular Misconception Analysis:</strong>
                  <h4 className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB] mt-0.5">{PUBLIC_ARCHAEOLOGY_AND_MYTHS.theNativeAmericanMythAnalysis.phenomenon}</h4>
                </div>
              </div>
              <div className="pl-7 space-y-2 text-xs sm:text-sm text-[#3C3C37] dark:text-[#C5C2B6] font-light leading-relaxed">
                <p>{PUBLIC_ARCHAEOLOGY_AND_MYTHS.theNativeAmericanMythAnalysis.historicalPsychologicalFunction}</p>
              </div>
            </div>
          </section>

          {/* SECTION 8: BIBLIOGRAPHY */}
          <section id="sec-bibliography" className="space-y-8 pt-8 pb-20">
            <div className="space-y-3 border-b border-[#DCD9CE] dark:border-[#2C2E2A] pb-6 mb-8">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.12em] text-[#55554E] dark:text-[#A8A499] block">
                08 // Peer-Reviewed Bibliography
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1A1A18] dark:text-[#E6E3DB] tracking-tight leading-snug">
                Academic Citations, DOIs & Primary Data Archives
              </h2>
            </div>

            {/* Citation Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {['all', 'Genomics', 'Bioarchaeology', 'Historiography', 'Public Archaeology'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCitationFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    citationFilter.toLowerCase() === filter.toLowerCase()
                      ? 'bg-[#1E1E1C] text-[#FAF8F5] dark:bg-[#E6E3DB] dark:text-[#181816] shadow-2xs font-semibold'
                      : 'bg-[#FFFFFF] dark:bg-[#1B1D19] text-[#55554E] dark:text-[#A8A499] hover:text-[#181816] dark:hover:text-[#E6E3DB] border border-[#DCD9CE] dark:border-[#2C2E2A]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Citations List */}
            <div className="space-y-3.5">
              {filteredCitations.map((cite) => (
                <div key={cite.id} className="p-5 sm:p-6 rounded-2xl bg-[#F6F4ED] text-[#1E1E1C] dark:bg-[#1B1D19] dark:text-[#E2DFD6] border border-[#DCD9CE] dark:border-[#2C2E2A] space-y-2 shadow-2xs">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-serif font-semibold text-sm sm:text-base text-[#181816] dark:text-[#E6E3DB]">{cite.title}</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#FFFFFF] dark:bg-[#20231F] border border-[#DCD9CE] dark:border-[#2C2E2A] text-[10px] font-mono text-[#3F6955] dark:text-[#6EA88F] shrink-0 font-medium">
                      {cite.year}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#55554E] dark:text-[#A8A499] font-light">
                    {cite.authors} — <em>{cite.journal}</em>
                  </p>
                  {cite.doiOrUrl && (
                    <a
                      href={cite.doiOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#181816] dark:text-[#E6E3DB] hover:underline inline-flex items-center gap-1.5 mt-1 font-medium"
                    >
                      <span>DOI / Reference URL</span>
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
