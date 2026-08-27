import React, { useState } from 'react';
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
  HeartHandshake
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
} from '../../data/molecularLegaciesData';

export type MolecularSubSection = 
  | 'overview'
  | 'genomics'
  | 'sexual_violence'
  | 'scientific_racism'
  | 'underdevelopment'
  | 'bioarchaeology'
  | 'public_archaeology'
  | 'synthesis';

export const MolecularLegaciesView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<MolecularSubSection>('overview');
  const [selectedCitation, setSelectedCitation] = useState<ResearchCitation | null>(null);
  const [citationFilter, setCitationFilter] = useState<string>('all');

  const filteredCitations = citationFilter === 'all' 
    ? MOLECULAR_RESEARCH_CITATIONS 
    : MOLECULAR_RESEARCH_CITATIONS.filter(c => c.category === citationFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-left">
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-zinc-950 via-slate-900 to-indigo-950/80 border border-zinc-800 text-white shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Dna className="w-5 h-5 animate-pulse" />
          </span>
          <span className="px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-700/60 text-xs font-mono font-bold text-indigo-300">
            Genomics • Bioarchaeology • Historiography
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-[11px] font-mono text-zinc-400">
            Interdisciplinary Synthesis
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
          The Molecular and Material Legacies of Slavery
        </h2>
        <p className="text-sm md:text-base text-zinc-300 leading-relaxed max-w-4xl">
          An interdisciplinary synthesis integrating <strong>population genomics</strong> (haplotype deconvolution & IBD sharing), <strong>bioarchaeology</strong> (skeletal trauma & cultural counter-archives), and <strong>historical archival records</strong>. Transforming abstract shipping manifests into a forensic accounting of structural exploitation, biological survival, and resistance.
        </p>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Cohorts Analyzed</span>
            <p className="text-lg font-black text-indigo-400">&gt;50,000 Genomes</p>
            <span className="text-[10px] text-zinc-400">Micheletti et al. (2020)</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Maroon Ancestry Retention</span>
            <p className="text-lg font-black text-emerald-400">98% African DNA</p>
            <span className="text-[10px] text-zinc-400">Noir Marron (Fortes-Lima 2017)</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Oldest Direct aDNA</span>
            <p className="text-lg font-black text-amber-400">c. 1660s Saint Martin</p>
            <span className="text-[10px] text-zinc-400">Zoutsteeg (Schroeder 2015)</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Counter-Archive Site</span>
            <p className="text-lg font-black text-rose-400">419 Ancestors</p>
            <span className="text-[10px] text-zinc-400">NY African Burial Ground</span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800 no-scrollbar">
        {[
          { id: 'overview', label: 'I. Introduction & Paradigm Shift', icon: BookOpen },
          { id: 'genomics', label: 'II. Molecular Witnesses (IBD & aDNA)', icon: Dna },
          { id: 'sexual_violence', label: 'II-B. Ledger of Sexual Violence', icon: ShieldAlert },
          { id: 'scientific_racism', label: 'III. Scientific Racism Evolution', icon: Scale },
          { id: 'underdevelopment', label: 'IV. Demographic & Economic Drain', icon: TrendingDown },
          { id: 'bioarchaeology', label: 'V. Skeletal Counter-Archives (NYABG)', icon: Skull },
          { id: 'public_archaeology', label: 'VI. Public Archaeology & Family Myths', icon: Users },
          { id: 'synthesis', label: 'VII. Modern Consensus & Citations', icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as MolecularSubSection)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SECTION CONTENT */}

      {/* SECTION I: OVERVIEW & INTERSECTION OF BIOLOGY & HISTORY */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <BookOpen className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                  Section I • Theoretical Framework
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  The Intersection of Biology and History: Moving Beyond Archival Silences
                </h3>
              </div>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed space-y-4 text-zinc-700 dark:text-zinc-300">
              <p>
                The historiography of the transatlantic slave trade has traditionally been anchored in the paper trail of the metropole—shipping manifests, plantation ledgers, and colonial probate records. Yet, these archives are often defined as much by their <strong>calculated silences and the erasure of individual personhood</strong> as by their contents.
              </p>
              <p>
                The current <strong>post-genomic shift</strong>, however, allows for an interdisciplinary synthesis where genetics, archaeology, and history converge to transform abstract archival data into a tangible, molecular reality. We are moving toward a framework of <strong className="text-indigo-600 dark:text-indigo-400 font-bold">"molecular witnesses"</strong>, where the very genomes of descendant populations serve as biomolecular ledgers of colonial violence and survival.
              </p>
            </div>

            {/* Tripartite Methodological Framework Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Dna className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">1. Population Genomics</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Identity by Descent (IBD) segment sharing and haplotype deconvolution reveal precise subcontinental origins and trace demographic survivals across colonial labor regimes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Skull className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">2. Bioarchaeological Records</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Skeletal remains preserve forensic proof of occupational trauma, nutritional deprivation (enamel hypoplasia), and intentional cultural persistence (ritual dental modifications).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <FileText className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">3. Archival Historiography</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Historical shipping registers and imperial logs provide the baseline chronology, which genomic and material evidence either corroborate, correct, or dramatically enrich.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION II: GENOMICS & IBD SHARING */}
      {activeSection === 'genomics' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Dna className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                  Section II • Genomic Reconstruction
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  The Molecular Witness: Haplotype Deconvolution & Identity by Descent (IBD)
                </h3>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Population genetics, specifically the application of <strong>haplotype deconvolution</strong> and <strong>Identity by Descent (IBD) sharing</strong>, functions as a vital forensic tool. By identifying shared chromosomal segments inherited from a common ancestor, researchers validate and interrogate shipping documents with unprecedented precision.
            </p>

            {/* IBD Concordance Chart */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                    Archival Manifest Proportions vs. Present-Day Genomic Retention
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Data synthesized from Micheletti et al. (2020) and Fortes-Lima et al. (2017)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold border border-indigo-500/20">
                  IBD Haplotype Analysis
                </span>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={IBD_GENOMIC_CONCORDANCE} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="region" 
                      tick={{ fontSize: 10 }}
                      interval={0}
                      tickFormatter={(v) => v.split('(')[0]}
                    />
                    <YAxis unit="%" />
                    <Tooltip 
                      formatter={(val: any) => [`${val}%`, '']}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem', color: '#f4f4f5' }}
                    />
                    <Legend />
                    <Bar dataKey="historicalManifestPct" name="Historical Shipping Manifest Share (%)" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="presentDayGenomicPct" name="Present-Day Genomic Proportion (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Genomic Nuances & Overrepresentation */}
            <div className="space-y-4 pt-2">
              <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                Regional Molecular Findings & Ancestry Deconvolution
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {IBD_GENOMIC_CONCORDANCE.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {item.region}
                      </h5>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {item.presentDayGenomicPct}% Genomic
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.ibdOverrepresentationNote}
                    </p>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold block mb-1">
                        Primary African Subcontinental Affinities:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.primaryAfricanRoots.map((root, rIdx) => (
                          <span key={rIdx} className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-[11px] font-mono text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {root}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ancient DNA & Maroon Isolates Case Studies */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                Key Molecular Studies: Ancient DNA & Maroon Genomic Isolates
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ANCIENT_DNA_STUDIES.map(study => (
                  <div key={study.id} className="p-5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold">
                        {study.dating}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">{study.leadAuthor}</span>
                    </div>

                    <h5 className="font-extrabold text-base text-zinc-100">
                      {study.title}
                    </h5>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      <strong>Findings:</strong> {study.genomicFindings}
                    </p>

                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-emerald-300 space-y-1">
                      <span className="font-mono uppercase text-[10px] text-zinc-400 font-bold block">Counter-Archive Significance</span>
                      <p>{study.counterArchiveValue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION II-B: THE BIOLOGICAL LEDGER OF SEXUAL VIOLENCE */}
      {activeSection === 'sexual_violence' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                  Section II-B • Biomolecular Forensics
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  The Biological Ledger of Sexual Violence: Sex-Biased Gene Flow
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-sm text-rose-900 dark:text-rose-200 space-y-2">
              <p className="font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                The Molecular Palimpsest of Plantation Exploitation
              </p>
              <p className="text-xs leading-relaxed text-rose-800 dark:text-rose-300">
                The "sex-biased" gene flow discovered across the Americas represents a harrowing biomolecular reflection of systemic colonial control. The disparity—disproportionately high European Y-chromosomes (paternal) paired with an overwhelmingly African mitochondrial DNA pool (maternal)—documents the institutionalized reproductive exploitation of African women by European men as a <strong>structural feature</strong> of the plantation complex rather than an incidental occurrence.
              </p>
            </div>

            {/* Sex-Biased Gene Flow Visualizer Chart */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                Paternal (Y-DNA) vs. Maternal (mtDNA) Lineage Breakdown Across Populations
              </h4>

              <div className="h-80 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SEX_BIASED_GENE_FLOW} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="population" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis unit="%" />
                    <Tooltip 
                      formatter={(val: any) => [`${val}%`, '']}
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem', color: '#f4f4f5' }}
                    />
                    <Legend />
                    <Bar dataKey="europeanPaternalY" name="European Paternal (Y-Chromosome) %" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="africanPaternalY" name="African Paternal (Y-Chromosome) %" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="africanMaternalMt" name="African Maternal (mtDNA) %" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="europeanMaternalMt" name="European Maternal (mtDNA) %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Population Breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SEX_BIASED_GENE_FLOW.map((pop, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <h5 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                    <span>{pop.population}</span>
                  </h5>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40">
                      <span className="text-[10px] font-mono uppercase text-rose-600 dark:text-rose-400 font-bold block">Paternal (Y-DNA)</span>
                      <span className="font-bold text-rose-700 dark:text-rose-300">{pop.europeanPaternalY}% European</span>
                      <span className="block text-[11px] text-zinc-500">{pop.africanPaternalY}% African</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40">
                      <span className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-bold block">Maternal (mtDNA)</span>
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">{pop.africanMaternalMt}% African</span>
                      <span className="block text-[11px] text-zinc-500">{pop.europeanMaternalMt}% European</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                    {pop.historicalContext}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION III: SCIENTIFIC RACISM & IDEOLOGICAL ARCHITECTURE */}
      {activeSection === 'scientific_racism' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Scale className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                  Section III • Ideological Architecture
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  The Evolution of Scientific Racism: Taxonomic Reification & Legal Codification
                </h3>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              The biological realities of exploitation necessitated the creation of ideological frameworks to justify the systemic extraction of human capital. During the Enlightenment, the medieval <strong>"Great Chain of Being" (scala naturae)</strong> was strategically repurposed to defend the slave economy against moral and Christian universalist opposition (Lund, 2024).
            </p>

            {/* Taxonomic Matrix Table */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Taxonomic Frameworks from Theological to Legal Codification
              </h4>

              <div className="space-y-4">
                {SCIENTIFIC_RACISM_CHRONOLOGY.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold border border-amber-500/20">
                          {item.era}
                        </span>
                        <h5 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                          {item.scholarOrEvent}
                        </h5>
                      </div>
                      <span className="text-xs font-mono text-zinc-400">{item.paradigm}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                        <span className="font-mono uppercase text-[10px] text-zinc-400 font-bold block">Classification & Hierarchy</span>
                        <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                          {item.keyVarietiesAndRanking}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1">
                        <span className="font-mono uppercase text-[10px] text-amber-600 dark:text-amber-400 font-bold block">Economic & Legal Enabling Mechanism</span>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {item.economicAndLegalFunction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dred Scott Decision Deep-Dive Callout */}
            <div className="p-5 rounded-2xl bg-zinc-950 text-white border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-400">
                <Scale className="w-5 h-5" />
                <h5 className="font-extrabold text-sm">Constitutional Codification: The Dred Scott Decision (1857)</h5>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                By ruling that Black people had <em>"no rights which the white man was bound to respect,"</em> the U.S. Supreme Court codified pseudo-scientific racism into foundational constitutional law, providing the legal immunity required for the continued extraction of slave labor that financed Northern industrialization.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION IV: STRUCTURAL UNDERDEVELOPMENT & CAPITAL EXTRACTION */}
      {activeSection === 'underdevelopment' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                <TrendingDown className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-red-600 dark:text-red-400 font-bold">
                  Section IV • Political Economy
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Structural Underdevelopment: The Demographic and Economic Drain
                </h3>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              The transatlantic trade was a calculated extraction of human capital on a continental scale. The demographic loss of approximately 12.5 million individuals was not a migration but a <strong>forced deportation that structurally impoverished African regions</strong> while financing the Industrial Revolution in the Global North.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* African Demographic Drain */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <TrendingDown className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm">African Demographic Drain</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Scale:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.africanDemographicDrain.totalExtracted}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Age Bias:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.africanDemographicDrain.ageDemographics}
                </p>
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
                  {STRUCTURAL_UNDERDEVELOPMENT_DATA.africanDemographicDrain.economicImpact}
                </div>
              </div>

              {/* Plantation Demographic Sink */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Flame className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm">Plantation Demographic Sink</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Monocultural Complexes:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.plantationDemographicSink.commodityCrops.join(', ')}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Sugar Attrition:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.plantationDemographicSink.mortalityAttrition}
                </p>
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500">
                  {STRUCTURAL_UNDERDEVELOPMENT_DATA.plantationDemographicSink.regimeComparison}
                </div>
              </div>

              {/* Global Capital Accumulation */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Award className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm">Global Capital Accumulation</h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Financial Institutions:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.globalCapitalAccumulation.financialInstitutions}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Industrialization:</strong> {STRUCTURAL_UNDERDEVELOPMENT_DATA.globalCapitalAccumulation.industrialRevolution}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION V: MEMORY LANDSCAPES & NY AFRICAN BURIAL GROUND */}
      {activeSection === 'bioarchaeology' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Skull className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                  Section V • Bioarchaeological Counter-Archive
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Memory Landscapes: The New York African Burial Ground (1991)
                </h3>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Memory landscapes and bioarchaeology provide a <strong>"counter-archive" to colonial records</strong>, proving that slavery was a domestic reality for the northern European metropole and American urban centers, not merely a distant plantation enterprise.
            </p>

            {/* NY African Burial Ground Deep-Dive Case Study */}
            <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
                <div>
                  <h4 className="text-lg font-extrabold text-zinc-100">{NY_AFRICAN_BURIAL_GROUND.siteName}</h4>
                  <p className="text-xs text-zinc-400">{NY_AFRICAN_BURIAL_GROUND.location} • Discovered in {NY_AFRICAN_BURIAL_GROUND.discoveryYear}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                    {NY_AFRICAN_BURIAL_GROUND.individualsAnalyzed} Individuals Analyzed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Counter-Archive of the Body (Skeletal Trauma) */}
                <div className="space-y-3">
                  <h5 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                    <Skull className="w-4 h-4" />
                    1. Counter-Archives of the Body (Skeletal Pathology)
                  </h5>

                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-xs">
                    <p className="text-zinc-300 leading-relaxed">
                      <strong>Occupational Trauma & Physical Violence:</strong> {NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.traumaAndLabor}
                    </p>
                    <p className="text-zinc-300 leading-relaxed">
                      <strong>Nutritional Stress (LEH):</strong> {NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.nutritionalStress}
                    </p>
                    <p className="text-rose-300 leading-relaxed">
                      <strong>Childhood Attrition:</strong> {NY_AFRICAN_BURIAL_GROUND.skeletalEvidence.childhoodMortality}
                    </p>
                  </div>
                </div>

                {/* Cultural Persistence & Intellectual Resistance */}
                <div className="space-y-3">
                  <h5 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4" />
                    2. Cultural Persistence & Ritual Resistance
                  </h5>

                  <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/40 space-y-1">
                      <span className="font-mono uppercase text-[10px] text-amber-400 font-bold block">
                        Ritual Dental Modifications (Incisor Filing)
                      </span>
                      <p className="text-amber-200 leading-relaxed">
                        {NY_AFRICAN_BURIAL_GROUND.culturalPersistence.ritualDentalModifications}
                      </p>
                    </div>

                    <p className="text-zinc-300 leading-relaxed">
                      <strong>Burial Orientation:</strong> {NY_AFRICAN_BURIAL_GROUND.culturalPersistence.burialOrientation}
                    </p>
                    <p className="text-zinc-300 leading-relaxed">
                      <strong>Grave Cosmograms:</strong> {NY_AFRICAN_BURIAL_GROUND.culturalPersistence.graveGoodsAndBeads}
                    </p>
                  </div>
                </div>
              </div>

              {/* Political Legacy & Michael Blakey Leadership */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                  Political Legacy & Public Archaeology Paradigm (Dr. Michael L. Blakey)
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {NY_AFRICAN_BURIAL_GROUND.politicalLegacy}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION VI: PUBLIC ARCHAEOLOGY & GENOMIC MYTHS */}
      {activeSection === 'public_archaeology' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Users className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                  Section VI • Decolonizing Heritage
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Public Archaeology, Digital Remediation & Deconstructing Family Myths
                </h3>
              </div>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              The field is undergoing a paradigm shift toward <strong>Public Archaeology</strong>, integrating descendant voices and digital tools to bypass state-led colonial archives. Digital platforms (23andMe, AncestryDNA) allow individuals in the diaspora to perform a "cathartic" workaround, accessing ancestral information that was historically silenced (Sarah Abel, 2016).
            </p>

            {/* The Native American Ancestor Myth Analysis */}
            <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-5 h-5" />
                <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                  Critical Case Study: Deconstructing the "Native American Ancestor" Myth
                </h4>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Genomic testing across tens of thousands of African Americans frequently debunks the common family narrative of direct Indigenous ancestry, revealing instead a nuanced sociological dynamic:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase block">
                    1. Psychological Defense
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Provided an alternative, less traumatic explanation for phenotypic variance (lighter skin, hair texture) without confronting the brutal reality of European plantation sexual violence.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase block">
                    2. Jim Crow Legal Shield
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Under racial classification laws and anti-Black statutes, claiming Indigenous heritage offered strategic social mobility and legal distance from chattel-associated legal categories.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase block">
                    3. Genomic Reality
                  </span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Genomic analysis proves that unexpected non-African contributions are overwhelmingly <strong>European paternal Y-DNA</strong> resulting from institutionalized plantation rape, rather than Indigenous grandmothers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION VII: SYNTHESIS & RESEARCH CITATIONS */}
      {activeSection === 'synthesis' && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Award className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                  Section VII • Epistemic Synthesis
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Synthesis: The Modern Consensus, Biological Realities & Research Library
                </h3>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-indigo-950/40 border border-zinc-800 space-y-3 text-zinc-200 text-sm leading-relaxed">
              <p className="font-extrabold text-emerald-400 text-base">
                Core Scientific Conclusion: Race is a Social Construct with Real Biological Consequences
              </p>
              <p className="text-xs md:text-sm text-zinc-300">
                The interdisciplinary record confirms the modern scientific consensus: <strong>race has no biological basis</strong> as a natural taxonomic division. However, this research demonstrates that <strong>race possesses tangible biological consequences</strong>. While the categories are arbitrary socio-political inventions, the consequences of racism—systemic violence, nutritional deprivation, forced migration, and reproductive coercion—are indelibly etched into both the skeletal and genetic records of descendant populations.
              </p>
              <p className="text-xs text-zinc-400 italic">
                To avoid the "conceptual loops" of re-essentializing race through commercial ancestry percentages, genomic data must always be interpreted alongside the material counter-archives of bioarchaeology and the structural realities of historical capitalism.
              </p>
            </div>

            {/* Research Bibliography & Interactive Dossier */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h4 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  Interdisciplinary Research Bibliography & Studies
                </h4>

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
                  {['all', 'Genomics', 'Bioarchaeology', 'Historiography', 'Public Archaeology'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCitationFilter(cat)}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        citationFilter === cat
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                      }`}
                    >
                      {cat === 'all' ? 'All Publications' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCitations.map(cit => (
                  <div 
                    key={cit.id}
                    onClick={() => setSelectedCitation(cit)}
                    className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 transition-all cursor-pointer space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold border border-indigo-500/20">
                        {cit.category} • {cit.year}
                      </span>
                      <span className="text-xs text-zinc-400 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cit.title}
                    </h5>

                    <p className="text-xs text-zinc-500 font-serif italic">
                      {cit.authors} ({cit.year}). <em>{cit.journal}</em>
                    </p>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed pt-1">
                      {cit.keyFinding}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Citation Dossier Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl p-6 rounded-3xl bg-zinc-900 text-white border border-zinc-800 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold">
                {selectedCitation.category} • {selectedCitation.year}
              </span>
              <button
                onClick={() => setSelectedCitation(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h4 className="text-lg font-extrabold text-zinc-100">
              {selectedCitation.title}
            </h4>

            <p className="text-xs text-zinc-400 font-serif italic">
              {selectedCitation.authors} — <em>{selectedCitation.journal}</em>
            </p>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                Key Empirical & Historiographical Finding
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">
                {selectedCitation.keyFinding}
              </p>
            </div>

            {selectedCitation.doiOrUrl && (
              <a
                href={selectedCitation.doiOrUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <span>Read Publication Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
