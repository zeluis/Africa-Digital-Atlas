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
  Legend, 
  ComposedChart, 
  Line 
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
    shortTitle: 'Epistemology & Method',
    fullTitle: 'The Tripartite Epistemological Model & Archival Silences',
    icon: Compass
  },
  {
    id: 'sec-genomics',
    number: '02',
    shortTitle: 'The Molecular Witness',
    fullTitle: 'Haplotype Deconvolution, IBD Sharing & Ancient DNA',
    icon: Dna
  },
  {
    id: 'sec-sexual-violence',
    number: '03',
    shortTitle: 'Ledger of Sexual Violence',
    fullTitle: 'Sex-Biased Gene Flow & Maroon Genetic Sovereignty',
    icon: Users
  },
  {
    id: 'sec-scientific-racism',
    number: '04',
    shortTitle: 'Ideological Architecture',
    fullTitle: 'The Curse of Ham, Scientific Racism & Legal Subjugation',
    icon: Scale
  },
  {
    id: 'sec-underdevelopment',
    number: '05',
    shortTitle: 'Structural Underdevelopment',
    fullTitle: 'Demographic Evacuation & Capital Accumulation in the Metropole',
    icon: TrendingDown
  },
  {
    id: 'sec-bioarchaeology',
    number: '06',
    shortTitle: 'Skeletal Counter-Archive',
    fullTitle: 'The African Burial Ground, Enthesopathies & Sankofa Cosmograms',
    icon: Skull
  },
  {
    id: 'sec-decolonizing',
    number: '07',
    shortTitle: 'Decolonizing Heritage',
    fullTitle: 'Consumer Genomics, Community Sovereignty & Deconstructing Myths',
    icon: HeartHandshake
  },
  {
    id: 'sec-bibliography',
    number: '08',
    shortTitle: 'Peer-Reviewed Bibliography',
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
  const [selectedCitation, setSelectedCitation] = useState<ResearchCitation | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [fontSizeClass, setFontSizeClass] = useState<'normal' | 'large'>('normal');

  // Scroll listener for active section indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
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
      const yOffset = -80;
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
    : MOLECULAR_RESEARCH_CITATIONS.filter(c => c.category === citationFilter);

  return (
    <div className={`space-y-12 animate-in fade-in duration-300 text-left ${fontSizeClass === 'large' ? 'text-lg' : 'text-base'}`} id="molecular-legacies-article-view">
      
      {/* 1. EDITORIAL HEADER & METADATA BAR */}
      <header className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-zinc-950 via-slate-950 to-indigo-950/70 border border-zinc-800 text-white shadow-2xl overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Dna className="w-96 h-96 text-indigo-400" />
        </div>

        <div className="relative z-10 space-y-6 max-w-5xl">
          {/* Breadcrumb & Series Label */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button 
              onClick={onNavigateToAtlas}
              className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Anchor className="w-3.5 h-3.5" />
              <span>Atlantic Slave Trade</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-bold">
              Editorial Research Dossier
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Interdisciplinary Synthesis</span>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-tight text-zinc-100 leading-[1.15]">
              The Molecular and Material Legacies of Slavery
            </h1>
            <p className="text-lg md:text-xl font-sans font-light text-indigo-200/90 leading-relaxed">
              An Interdisciplinary Synthesis of Genomic, Historical, and Archaeological Records
            </p>
          </div>

          {/* Editorial Meta Strip */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Published August 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>22 min read • 5,400 words</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Peer-Reviewed Synthesis (AJHG, PNAS, Nature)</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSizeClass(prev => prev === 'normal' ? 'large' : 'normal')}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
                title="Toggle Reading Font Size"
              >
                Font: {fontSizeClass === 'normal' ? 'Standard' : 'Enlarged'}
              </button>
              <button
                onClick={handleCopyCitation}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Copied DOI' : 'Cite Article'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. ARTICLE LEAD & EXECUTIVE METRICS STRIP */}
      <section className="p-8 rounded-3xl bg-zinc-900/60 dark:bg-zinc-900/40 border border-zinc-800 space-y-6">
        <div className="max-w-4xl space-y-4">
          <p className="text-lg md:text-xl font-serif italic text-zinc-200 leading-relaxed border-l-4 border-indigo-500 pl-4 py-1">
            "For centuries, the human cost of the Transatlantic Slave Trade was mediated almost exclusively through the sanitized bookkeeping of enslavers—shipping manifests, bill of sale ledgers, and probate inventories. Modern genome-wide sequencing, high-resolution ancient DNA (aDNA), and skeletal bioarchaeology have opened a biological counter-archive that cannot be expunged."
          </p>
          <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
            By analyzing <strong>haplotype deconvolution</strong> across 50,000+ modern genomes alongside forensic bioarchaeology from the <strong>New York African Burial Ground</strong> and <strong>St. Helena Liberated African graveyards</strong>, this synthesis reveals how demographic dismemberment, extreme sexual violence, and structural capital accumulation transformed human bodies into the biological ledger of empire.
          </p>
        </div>

        {/* 4 Core Empirical Pillars */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Cohort Scale</span>
            <p className="text-2xl font-black text-indigo-400">&gt;50,000</p>
            <p className="text-xs text-zinc-400">Genomes sequenced across 4 Americas regions (Micheletti 2020)</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Sex-Biased Gene Flow</span>
            <p className="text-2xl font-black text-amber-400">15:1 to 20:1</p>
            <p className="text-xs text-zinc-400">Female vs male African genomic contributions across Latin America</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Maroon Retention</span>
            <p className="text-2xl font-black text-emerald-400">98% African DNA</p>
            <p className="text-xs text-zinc-400">Noir Marron communities in Suriname & French Guiana (Fortes-Lima)</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Burial Juvenile Mortality</span>
            <p className="text-2xl font-black text-rose-400">42.7% &lt;15 yrs</p>
            <p className="text-xs text-zinc-400">New York African Burial Ground skeletal sample (Blakey et al.)</p>
          </div>
        </div>
      </section>

      {/* 3. MAIN ARTICLE LAYOUT (STICKY TOC SIDEBAR + ARTICLE NARRATIVE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / STICKY TABLE OF CONTENTS */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                Article Contents
              </span>
              <span className="text-[11px] font-mono text-zinc-500">8 Sections</span>
            </div>

            <nav className="space-y-1.5" aria-label="Article Table of Contents">
              {ARTICLE_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isCurrent = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="font-mono text-[10px] text-zinc-500 shrink-0">{sec.number}</span>
                      <Icon className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span className="truncate">{sec.shortTitle}</span>
                    </div>
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </nav>

            {/* Cross-Link to Sister Master Report */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Companion Publication</span>
              <button
                onClick={onNavigateToFoundations}
                className="w-full p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 hover:bg-amber-900/40 text-amber-200 text-xs font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Foundations of African Development</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT / PROSE NARRATIVE WITH EMBEDDED EXHIBITS */}
        <article className="lg:col-span-8 space-y-16 max-w-none prose prose-invert prose-indigo">
          
          {/* SECTION 1: EPISTEMOLOGY */}
          <section id="sec-epistemology" className="space-y-6 pt-4">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Section 01</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                The Tripartite Epistemological Model & Archival Silences
              </h2>
            </div>

            <div className="space-y-4 text-zinc-300 leading-relaxed font-sans">
              <p>
                In <em>Silencing the Past: Power and the Production of History</em> (1995), Michel-Rolph Trouillot established that historical narratives are systematically conditioned by four distinct moments of erasure: <strong>the moment of fact creation</strong> (the making of sources), <strong>the moment of fact assembly</strong> (the making of archives), <strong>the moment of fact retrieval</strong> (the making of narratives), and <strong>the moment of retrospective significance</strong> (the making of history in the final instance).
              </p>
              <p>
                The primary written archives of the Transatlantic Slave Trade—such as the 36,000+ voyage records preserved in the <em>Trans-Atlantic Slave Trade Database</em> (Voyages)—were authored almost exclusively by ship captains, colonial customs officers, and trading conglomerates like the <em>Royal African Company</em> and the <em>Dutch West India Company</em>. In these ledgers, human beings were quantified strictly as commercial liabilities, physical cargo (*pièces d'Inde*), and mortality losses to be claimed against marine insurance underwriters.
              </p>
            </div>

            {/* Tripartite Model Architecture Box */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <h4 className="text-sm font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4" />
                The Tripartite Epistemological Framework
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-indigo-400">1. Archival Records</span>
                  <p className="text-zinc-400">Quantifies macroeconomic throughput, embarkation ports, voyage coordinates, and commodities.</p>
                  <span className="text-[10px] font-mono text-zinc-500">Subject to colonial bias & omissions</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-emerald-400">2. Population Genomics</span>
                  <p className="text-zinc-400">Measures Identity-by-Descent (IBD), sex-biased admixture, and regional African ancestral contributions.</p>
                  <span className="text-[10px] font-mono text-zinc-500">Objective biological record</span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                  <span className="font-bold text-amber-400">3. Skeletal Bioarchaeology</span>
                  <p className="text-zinc-400">Documents physical biomechanical strain, enthesopathies, childhood malnutrition, and cosmograms.</p>
                  <span className="text-[10px] font-mono text-zinc-500">Direct material counter-archive</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: GENOMICS & IBD */}
          <section id="sec-genomics" className="space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Section 02</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                The Molecular Witness: Haplotype Deconvolution & IBD Sharing
              </h2>
            </div>

            <div className="space-y-4 text-zinc-300 leading-relaxed font-sans">
              <p>
                Recent advances in statistical genetics, particularly <strong>Identity-by-Descent (IBD) segment sharing</strong> and chromosome painting, enable researchers to deconstruct complex multi-generational admixture. In a landmark study of over 50,000 individuals across the Americas, Micheletti et al. (2020) demonstrated both striking concordances and revealing divergences between voyage records and modern genetic ancestry.
              </p>
            </div>

            {/* Interactive Exhibit 1: IBD Concordance Chart */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Figure 1: Voyage Embarkation Share vs. Modern Genomic Ancestry</h4>
                  <p className="text-xs text-zinc-400">Comparing historical embarkations from Voyages Database with modern IBD genetic retention</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-indigo-950 border border-indigo-800 text-[11px] font-mono text-indigo-300">
                  Micheletti et al. (2020)
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={IBD_GENOMIC_CONCORDANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="region" stroke="#71717a" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.75rem', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar dataKey="voyageShare" name="Voyage Manifests (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="geneticRetention" name="Modern Genomic Share (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 space-y-1.5">
                <span className="font-bold text-amber-400">Key Discrepancy Analysis:</span>
                <p>
                  <strong>Nigeria/Bight of Benin</strong> exhibits substantial <em>over-representation</em> in the modern gene pool due to intra-American domestic transfers, while <strong>Senegambia</strong> exhibits severe <em>under-representation</em> in Latin America due to extremely high mortality on early rice/sugar plantations and asymmetric infant mortality.
                </p>
              </div>
            </div>

            {/* Ancient DNA Case Box */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h4 className="text-sm font-mono font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Dna className="w-4 h-4" />
                Ancient DNA (aDNA) Milestones in the African Diaspora
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {ANCIENT_DNA_STUDIES.map(study => (
                  <div key={study.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-200">{study.title}</span>
                      <span className="text-[10px] font-mono text-zinc-400">{study.dating}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-sans">{study.genomicFindings}</p>
                    <p className="text-zinc-400 text-[11px] leading-relaxed italic">{study.historicalSignificance}</p>
                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-400">
                      <span>{study.leadAuthor}</span>
                      <span className="font-mono text-indigo-400">{study.individuals}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 3: SEXUAL VIOLENCE & MAROON GENOMICS */}
          <section id="sec-sexual-violence" className="space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Section 03</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                The Biological Ledger of Sexual Violence & Maroon Resistance
              </h2>
            </div>

            <div className="space-y-4 text-zinc-300 leading-relaxed font-sans">
              <p>
                One of the most profound revelations of diaspora population genetics is the quantitative measurement of <strong>sex-biased gene flow</strong>. By comparing uniparental markers—the strictly matrilineal <strong>mitochondrial DNA (mtDNA)</strong> against the strictly patrilineal <strong>Y-chromosome DNA (Y-DNA)</strong>—geneticists can reconstruct the demographic gender dynamics of enslavement.
              </p>
            </div>

            {/* Exhibit 2: Sex-Biased Gene Flow Chart */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Figure 2: Matrilineal vs Patrilineal African Genetic Admixture</h4>
                  <p className="text-xs text-zinc-400">Disparity between African mtDNA (maternal) and African Y-DNA (paternal)</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-rose-950 border border-rose-800 text-[11px] font-mono text-rose-300">
                  Sex-Biased Admixture
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SEX_BIASED_GENE_FLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="population" stroke="#71717a" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#71717a" tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '0.75rem', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar dataKey="africanMaternalMt" name="African mtDNA (Maternal %)" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="africanPaternalY" name="African Y-DNA (Paternal %)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="europeanPaternalY" name="European Y-DNA (Paternal %)" fill="#eab308" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 space-y-2">
                <p>
                  Across the Americas, <strong>80–95%</strong> of maternal lineages in Afro-descendant populations trace directly to Africa. Conversely, <strong>30–55%</strong> of paternal lineages trace to European males. This asymmetric imbalance reflects institutionalized sexual exploitation, where enslavers systematically fathered children with enslaved women while legally disenfranchising African male reproduction.
                </p>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-200">
                  <strong>The Maroon Counter-Evidence:</strong> In isolated Maroon communities like the <em>Noir Marron</em> of French Guiana and Suriname (Fortes-Lima et al., 2017), African Y-DNA retention exceeds <strong>94%</strong>, providing a biological baseline proving that high European paternal introgression in urban areas was a direct function of chattel domination, not consensual integration.
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: SCIENTIFIC RACISM */}
          <section id="sec-scientific-racism" className="space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Section 04</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                The Ideological Architecture: From Theological Justification to Biological Determinism
              </h2>
            </div>

            <div className="space-y-4 text-zinc-300 leading-relaxed font-sans">
              <p>
                The commodification of human beings required a continuous ideological apparatus to reconcile Christian ethics and Enlightenment philosophies with the brutality of chattel slavery. This evolved from early theological rationalizations into 18th- and 19th-century <strong>scientific racism</strong>.
              </p>
            </div>

            {/* Chronological Timeline */}
            <div className="space-y-3">
              {SCIENTIFIC_RACISM_CHRONOLOGY.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-serif font-bold text-sm text-zinc-100">{item.scholarOrEvent}</span>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">{item.era}</span>
                      <span className="text-indigo-400">{item.paradigm}</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{item.keyVarietiesAndRanking}</p>
                  <div className="p-2.5 rounded-lg bg-zinc-950 text-[11px] text-zinc-400 flex items-start gap-2">
                    <span className="text-amber-400 font-bold shrink-0">Economic & Legal Function:</span>
                    <span>{item.economicAndLegalFunction}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 5: STRUCTURAL UNDERDEVELOPMENT */}
          <section id="sec-underdevelopment" className="space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Section 05</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                Structural Underdevelopment: Demographic Evacuation & Capital Accumulation
              </h2>
            </div>

            <div className="space-y-4 text-zinc-300 leading-relaxed font-sans">
              <p>
                As Walter Rodney detailed in <em>How Europe Underdeveloped Africa</em> (1972) and Eric Williams in <em>Capitalism and Slavery</em> (1944), the Transatlantic Slave Trade was not merely a trade in labor; it was a structural transfer of reproductive and productive capital from Africa to Europe and the Americas.
              </p>
            </div>

            {/* Economic Structural Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="text-sm font-bold text-rose-400">African Demographic Drain</h4>
                <div className="space-y-2 text-xs text-zinc-300">
                  <p><strong>Extracted:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.africanDemographicDrain.totalExtracted}</p>
                  <p><strong>Demographics:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.africanDemographicDrain.ageDemographics}</p>
                  <p className="text-zinc-400">{STRUCTURAL_UNDERDEVELOPMENT_DATA.africanDemographicDrain.economicImpact}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="text-sm font-bold text-amber-400">Plantation Demographic Sink</h4>
                <div className="space-y-2 text-xs text-zinc-300">
                  <p><strong>Primary Crops:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.plantationDemographicSink.commodityCrops.join(', ')}</p>
                  <p className="text-zinc-400">{STRUCTURAL_UNDERDEVELOPMENT_DATA.plantationDemographicSink.mortalityAttrition}</p>
                  <p className="text-zinc-400">{STRUCTURAL_UNDERDEVELOPMENT_DATA.plantationDemographicSink.regimeComparison}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <h4 className="text-sm font-bold text-indigo-400">Global Capital Accumulation</h4>
                <div className="space-y-2 text-xs text-zinc-300">
                  <p><strong>Finance & Banking:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.globalCapitalAccumulation.financialInstitutions}</p>
                  <p className="text-zinc-400">{STRUCTURAL_UNDERDEVELOPMENT_DATA.globalCapitalAccumulation.industrialRevolution}</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: SKELETAL COUNTER-ARCHIVE */}
          <section id="sec-bioarchaeology" className="space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Section 06</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                The Skeletal Counter-Archive: New York African Burial Ground & Forensic Pathologies
              </h2>
            </div>

            <div className="space-y-4 text-zinc-300 leading-relaxed font-sans">
              <p>
                In 1991, during excavation for a federal office tower in Lower Manhattan, workers unearthed the <strong>New York African Burial Ground</strong>, a 6.6-acre cemetery containing an estimated 15,000 to 20,000 enslaved and free Africans interred between the 1690s and 1790s. Under the scientific leadership of <strong>Dr. Michael Blakey</strong> (Howard University), the forensic analysis of 419 individuals transformed the skeletal remains into a profound material counter-archive.
              </p>
            </div>

            {/* Skeletal Evidence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="font-bold text-sm text-zinc-100">Physical Trauma & Heavy Labor</span>
                <p className="text-xs text-zinc-400 leading-relaxed">{NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.traumaAndLabor}</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="font-bold text-sm text-zinc-100">Nutritional Stress & Hypoplasia</span>
                <p className="text-xs text-zinc-400 leading-relaxed">{NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.nutritionalStress}</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="font-bold text-sm text-zinc-100">Infant & Child Mortality</span>
                <p className="text-xs text-zinc-400 leading-relaxed">{NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.childhoodMortality}</p>
              </div>
            </div>

            {/* Cosmogram & Cultural Resistance Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950/40 border border-indigo-900/40 space-y-3">
              <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Cultural Persistence & The Sankofa Cosmogram
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {NY_AFRICAN_BURIAL_GROUND.culturalPersistence.graveGoodsAndBeads}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <strong>Dental Filing & Aesthetic Traditions:</strong> {NY_AFRICAN_BURIAL_GROUND.culturalPersistence.ritualDentalModifications}
              </p>
            </div>
          </section>

          {/* SECTION 7: DECOLONIZING HERITAGE */}
          <section id="sec-decolonizing" className="space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Section 07</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                Decolonizing Heritage, Community Sovereignty & Deconstructing False Narratives
              </h2>
            </div>

            <div className="space-y-4 text-zinc-300 leading-relaxed font-sans">
              <p>
                The intersection of population genomics and African diaspora identity has created both extraordinary opportunities for historical reconnection and critical ethical challenges. Modern scholars emphasize the vital necessity of <strong>descendant community sovereignty</strong> over genomic data.
              </p>
            </div>

            {/* Public Archaeology Issues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <span className="text-sm font-bold text-zinc-100">Consumer Genomics Landscape</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{PUBLIC_ARCHAEOLOGY_AND_MYTHS.consumerGenomicsLandscape.empowermentAndCatharsis}</p>
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-amber-400">
                  {PUBLIC_ARCHAEOLOGY_AND_MYTHS.consumerGenomicsLandscape.limitationsAndRisks}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                <span className="text-sm font-bold text-zinc-100">Deconstructing Family Oral Traditions</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{PUBLIC_ARCHAEOLOGY_AND_MYTHS.theNativeAmericanMythAnalysis.phenomenon}</p>
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed">
                  {PUBLIC_ARCHAEOLOGY_AND_MYTHS.theNativeAmericanMythAnalysis.historicalPsychologicalFunction}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8: BIBLIOGRAPHY */}
          <section id="sec-bibliography" className="space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Section 08</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">
                Peer-Reviewed Bibliography & Primary Data Archives
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Citations' },
                { id: 'Genomics', label: 'Genomics' },
                { id: 'Bioarchaeology', label: 'Bioarchaeology' },
                { id: 'Historiography', label: 'Historiography' },
                { id: 'Public Archaeology', label: 'Public Archaeology' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setCitationFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    citationFilter === f.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Citation List */}
            <div className="space-y-3">
              {filteredCitations.map(cit => (
                <div key={cit.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-xs text-zinc-200">{cit.title}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">{cit.year}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{cit.authors} • <em>{cit.journal}</em></p>
                  <p className="text-xs text-zinc-300 italic">{cit.keyFinding}</p>
                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-indigo-400">{cit.doiOrUrl}</span>
                    {cit.doiOrUrl && (
                      <a 
                        href={cit.doiOrUrl.startsWith('http') ? cit.doiOrUrl : `https://${cit.doiOrUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <span>Open Paper</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ARTICLE FOOTER / RETURN LINKS */}
          <footer className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onNavigateToAtlas}
              className="px-5 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Anchor className="w-4 h-4 text-emerald-400" />
              <span>Return to Slave Voyages Database & Atlas</span>
            </button>

            <button
              onClick={onNavigateToFoundations}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>Read Companion: Foundations of African Development</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </footer>

        </article>
      </div>

    </div>
  );
};
