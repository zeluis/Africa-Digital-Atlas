import React, { useState } from 'react';
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
  Download
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
  ComposedChart,
  Scatter
} from 'recharts';

export const AfricanDevelopmentMasterReportView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('executive_summary');
  const [activeCommodityIndex, setActiveCommodityIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeSection = MASTER_REPORT_SECTIONS.find(s => s.id === activeSectionId) || MASTER_REPORT_SECTIONS[0];
  const activeCommodity = TADEI_MONOPSONY_CASE_STUDIES[activeCommodityIndex];

  // Helper for rendering icons
  const getSectionIcon = (iconName: string, className: string = 'w-5 h-5') => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner / Breadcrumb */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold tracking-wider uppercase">
                <span>Master Dossier & Synthesis</span>
                <span>•</span>
                <span className="text-slate-400">August 25, 2026</span>
              </div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                The Structural & Evolutionary Foundations of African Development
              </h1>
            </div>
          </div>

          {/* Key Metrics Quick Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 whitespace-nowrap">
              <span className="text-slate-400">RAO Baseline:</span>
              <span className="font-mono font-bold text-amber-400">~150 kya Coalescence</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 whitespace-nowrap">
              <span className="text-slate-400">Slave Extraction:</span>
              <span className="font-mono font-bold text-rose-400">18M+ Individuals</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 whitespace-nowrap">
              <span className="text-slate-400">Pre-Colonial Autonomy:</span>
              <span className="font-mono font-bold text-emerald-400">98.2% Decentralized</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 whitespace-nowrap">
              <span className="text-slate-400">UN Slavery Res.:</span>
              <span className="font-mono font-bold text-indigo-400">123-3 (Mar 2026)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Hero Abstract Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-2xl p-6 lg:p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interdisciplinary Master Treatise (3 Compounding Epochs)</span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
              A Comprehensive Synthesis of Macro-Geonomic, Historical-Institutional, and Contemporary Geopolitical Paradigms
            </h2>

            <p className="text-slate-300 text-sm lg:text-base leading-relaxed max-w-5xl">
              This master synthesis systematically deconstructs reductionist and ahistorical narratives of Sub-Saharan African underdevelopment by uniting three major academic frontiers: (1) <strong>The Macro-Geonomic Frontier</strong> (Recent African Origin, Serial Founder Effect, and the Ashraf-Galor diversity curve); (2) <strong>The Historical-Institutional Frontier</strong> (Nathan Nunn’s slave trade mistrust scar, Acemoglu-Robinson settler mortality, Henn-Robinson pre-colonial governance, and Tadei’s colonial trade monopsony price-gap models); and (3) <strong>The Contemporary Geopolitical Frontier</strong> (the landmark March 25, 2026 UN General Assembly Slavery Resolution, the AU-CARICOM Accra Plan, the Bridgetown Initiative 3.0, and the Loss & Damage liquidity crisis).
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-800/80">
              <div><strong className="text-slate-200">Authored for:</strong> Gemini Research & Historical Synthesis Series</div>
              <div>•</div>
              <div><strong className="text-slate-200">Publication Date:</strong> August 25, 2026</div>
              <div>•</div>
              <div><strong className="text-slate-200">Methodology:</strong> Peer-Reviewed Econometrics, Genomic Anthropology, Archival Monopsony Records & UN Diplomatic Transcripts</div>
            </div>
          </div>
        </section>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
          {MASTER_REPORT_SECTIONS.map((sec) => {
            const isActive = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {getSectionIcon(sec.iconName, 'w-4 h-4')}
                <span>{sec.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Active Section Content Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
              <span>Section {activeSection.number}</span>
              <span>—</span>
              <span className="text-slate-400">{activeSection.subtitle}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{activeSection.title}</h3>
            <p className="text-xs text-slate-300 max-w-4xl">{activeSection.summary}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
              AER / QJE / UN Grounded
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION I: EXECUTIVE SUMMARY */}
        {/* ========================================================= */}
        {activeSectionId === 'executive_summary' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Core Theses Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit border border-amber-500/20">
                  <Dna className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-100">1. The Macro-Geonomic Frontier</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Traces the prehistoric <em>Recent African Origin</em> (RAO) migration gradient. The Serial Founder Effect caused genetic diversity to drop monotonically with distance from East Africa, establishing the <strong>Ashraf-Galor diversity-development trade-off</strong> between cognitive innovation benefits and social coordination friction.
                </p>
                <div className="pt-2 text-xs font-mono text-amber-400">
                  Ref: Ashraf & Galor (AER 2013)
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 w-fit border border-rose-500/20">
                  <Scale className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-100">2. Historical-Institutional Traumas</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Quantifies the four compounding historical shocks: the <strong>18M+ slave trade drainage</strong> that scarred interpersonal trust (Nunn & Wantchekon), <strong>Acemoglu-Robinson settler mortality</strong>, <strong>Henn-Robinson pre-colonial decentralization destruction</strong>, and <strong>Tadei’s colonial monopsony price gaps</strong> extracting &gt;60–85% of African gains from trade.
                </p>
                <div className="pt-2 text-xs font-mono text-rose-400">
                  Ref: Nunn (2008), Tadei (2020), Henn (2024)
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit border border-indigo-500/20">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-100">3. Contemporary Geopolitical Battles</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Details the 2025–2026 transition from "requesting development aid" to "demanding structural rule-making power": the <strong>March 25, 2026 UN General Assembly Slavery Resolution</strong>, the <strong>AU-CARICOM Joint 19-Point Accra Plan</strong>, <strong>Bridgetown 3.0</strong>, and <strong>South Africa's historic G20 Presidency</strong>.
                </p>
                <div className="pt-2 text-xs font-mono text-indigo-400">
                  Ref: UN GA Res. (Mar 2026), Mottley (2026)
                </div>
              </div>
            </div>

            {/* Synthesized Compounding Shocks Timeline Visualizer */}
            <div className="p-6 lg:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <span>The Compounding Trajectory of African Comparative Development</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    How evolutionary diversity baselines, predatory extractions, and institutional persistence created modern structural outcomes.
                  </p>
                </div>
                <span className="text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full w-fit">
                  Deep Time to 2026
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-amber-400 font-bold">150,000 – 60,000 BP</div>
                  <h5 className="text-sm font-bold text-slate-200">Recent African Origin (RAO)</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mitochondrial Eve and Y-Chromosomal Adam coalesce in East Africa. Serial Founder Effect leaves Sub-Saharan Africa with the world’s highest genetic diversity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-rose-400 font-bold">1400 – 1900 CE</div>
                  <h5 className="text-sm font-bold text-slate-200">The Quadruple Slave Trades</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    18M+ individuals exported across Atlantic, Saharan, Red Sea, and Indian Ocean routes. Depletes demographics and embeds the intergenerational "Mistrust Scar".
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-orange-400 font-bold">1884 – 1960 CE</div>
                  <h5 className="text-sm font-bold text-slate-200">Berlin Partition & Monopsony</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    45,000 decentralized polities subjugated under autocratic Indirect Rule. Colonial trading cartels extract up to 85% of peasant Gains from Trade.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-emerald-400 font-bold">1960 – 2026 CE</div>
                  <h5 className="text-sm font-bold text-slate-200">Path Persistence to Global Ascent</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    State marketing boards perpetuate urban bias. By 2026, AU and CARICOM mobilize UN resolutions, Bridgetown 3.0, and G20 leadership for structural reform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION II: MACRO-GEONOMICS (RAO & ASHRAF-GALOR) */}
        {/* ========================================================= */}
        {activeSectionId === 'biogeographic_baseline' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Theoretical Framing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Dna className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">1. Molecular Clock Calibrations & Coalescence</h4>
                    <p className="text-xs text-slate-400">Convergent maternal and paternal deep ancestry</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Genetic anthropology utilizing complete sequencing of mitochondrial DNA (mtDNA) and the Y chromosome confirms that all contemporary humans share a shallow ancestry converging in East Africa:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-amber-300">Mitochondrial Eve (Maternal Lineage):</strong>
                      <p className="text-slate-400 mt-0.5">Lived in East Africa ~99,000 to 148,000 years ago (broad estimates up to 200 kya).</p>
                    </div>
                    <span className="font-mono text-amber-400 font-bold shrink-0">~148 kya</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <strong className="text-amber-300">Y-Chromosomal Adam (Paternal Lineage):</strong>
                      <p className="text-slate-400 mt-0.5">Lived in East Africa ~120,000 to 156,000 years ago.</p>
                    </div>
                    <span className="font-mono text-amber-400 font-bold shrink-0">~156 kya</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic">
                  * Landmark findings by Bustamante et al. (Stanford, 2013) proved that these maternal and paternal lines coalesce in roughly the same evolutionary epoch and geographic theater, confirming Sub-Saharan Africa as the cradle of all Homo sapiens.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">2. The Serial Founder Effect & Global Diversity Gradient</h4>
                    <p className="text-xs text-slate-400">Successive bottlenecks out of Addis Ababa</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  As modern humans migrated out of East Africa ~60,000 to 70,000 years ago in small pioneer bands, each departing splinter population carried only a sub-sample of the genetic diversity of its parent group.
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="font-mono font-bold text-indigo-300">The Monotonic Distance-Diversity Law:</div>
                  <p className="text-slate-300 leading-relaxed">
                    Expected genetic heterozygosity ($H_e$) within indigenous populations decreases monotonically with the geographical and migratory distance along overland routes from East Africa:
                  </p>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-center text-amber-400 font-bold">
                    He(Sub-Saharan Africa) &gt; He(Eurasia) &gt; He(Americas)
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Sub-Saharan African populations exhibit the highest genetic diversity on Earth, whereas Native American populations at the migratory terminus exhibit the lowest.
                </p>
              </div>
            </div>

            {/* Interactive Chart: Ashraf-Galor Diversity-Development Hump */}
            <div className="p-6 lg:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    <span>Ashraf & Galor (2013) Diversity-Development Hump-Shaped Trade-Off</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Opposing channels: Cognitive Specialization & Technological Innovation (+) vs. Social Fragmentation & Mistrust Transaction Costs (-)
                  </p>
                </div>
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  American Economic Review (AER 2013)
                </span>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={GEONOMIC_DIVERSITY_GRADIENT}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis
                      dataKey="migratoryDistanceKm"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k km`}
                      label={{ value: 'Overland Migratory Distance from East Africa (km)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      domain={[30, 100]}
                      label={{ value: 'Index Score (0–100)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any, name: string) => [val, name]}
                      labelFormatter={(label: any) => `Migratory Distance: ${Number(label).toLocaleString()} km`}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line
                      type="monotone"
                      dataKey="cognitiveSpecializationScore"
                      name="Cognitive Innovation Channel (+)"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="socialCoordinationTrustScore"
                      name="Social Cohesion / Trust Channel (- friction)"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="compositeProductivity"
                      name="Ashraf-Galor Hump (Net Comparative Development)"
                      fill="#818cf8"
                      fillOpacity={0.25}
                      stroke="#6366f1"
                      strokeWidth={3}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table breakdown */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3">Geographic Region / Out-of-Africa Stage</th>
                      <th className="p-3">Distance (km)</th>
                      <th className="p-3">Expected Heterozygosity (He)</th>
                      <th className="p-3">Innovation Score</th>
                      <th className="p-3">Cohesion Score</th>
                      <th className="p-3">Net Dev Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {GEONOMIC_DIVERSITY_GRADIENT.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/60 transition-colors">
                        <td className="p-3 font-semibold text-slate-200">{item.region}</td>
                        <td className="p-3 font-mono text-slate-400">{item.migratoryDistanceKm.toLocaleString()}</td>
                        <td className="p-3 font-mono text-amber-400 font-bold">{item.expectedHeterozygosity.toFixed(2)}</td>
                        <td className="p-3 font-mono text-amber-300">{item.cognitiveSpecializationScore}</td>
                        <td className="p-3 font-mono text-sky-300">{item.socialCoordinationTrustScore}</td>
                        <td className="p-3 font-mono text-indigo-400 font-bold">{item.compositeProductivity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION III: HISTORICAL TRAUMAS & THE MISTRUST SCAR */}
        {/* ========================================================= */}
        {activeSectionId === 'slave_trades_mistrust' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Nunn (2008) and Nunn-Wantchekon (2011) Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">1. Nathan Nunn (2008) Causal Underdevelopment</h4>
                    <p className="text-xs text-slate-400">Quarterly Journal of Economics (QJE 2008)</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Nathan Nunn integrated shipping manifests and historical records from four major slave trades (trans-Atlantic, trans-Saharan, Red Sea, Indian Ocean) totaling over <strong>18 million exported individuals</strong>:
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="font-mono font-bold text-rose-400">The Causal Empirical Inverse Law:</div>
                  <p className="text-slate-300 leading-relaxed">
                    The parts of Africa from which the largest numbers of enslaved persons were forcibly taken between 1400 and 1900 are the poorest and most economically underdeveloped today.
                  </p>
                  <p className="text-slate-400 italic">
                    Instrumental variable tests (utilizing nautical sailing distance to export destination ports) proved that pre-existing poverty did not cause high slave exports; the slave trade causally generated modern economic deprivation.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">2. The Micro-Level Transmission Channel: The Mistrust Scar</h4>
                    <p className="text-xs text-slate-400">Nunn & Wantchekon (AER 2011)</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Unlike traditional warfare, enslavement was frequently carried out through small-scale village kidnappings and personal betrayals by friends, neighbors, and kin. This shattered the foundational social capital of targeted societies:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Trust in Relatives & Neighbors:</span>
                    <span className="font-mono text-rose-400 font-bold">-28% in heavily raided ethnic groups</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Trust in Local Co-Ethnics:</span>
                    <span className="font-mono text-rose-400 font-bold">-34% relative to non-targeted groups</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Trust in Local Administration & Courts:</span>
                    <span className="font-mono text-rose-400 font-bold">-41% institutional trust deficit</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 italic">
                  This persisting "mistrust scar" increases transaction costs in contemporary African markets, preventing the spontaneous formation of credit networks and efficient legal contract enforcement.
                </p>
              </div>
            </div>

            {/* Nunn Regional Slave Export Extraction vs. Current GDP & Mistrust */}
            <div className="p-6 lg:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-rose-400" />
                    <span>Regional Slave Export Intensity vs. Contemporary Mistrust & GDP per Capita</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Empirical data compiled across African regional zones (Nunn 2008, Nunn & Wantchekon 2011)
                  </p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={NUNN_SLAVE_TRADE_EXTRACTION}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis
                      dataKey="regionOrModernCountry"
                      stroke="#94a3b8"
                      fontSize={10}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#f43f5e"
                      fontSize={11}
                      label={{ value: 'Slave Exports (Millions)', angle: -90, position: 'insideLeft', fill: '#f43f5e', fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#38bdf8"
                      fontSize={11}
                      label={{ value: 'Current GDP / Capita ($)', angle: 90, position: 'insideRight', fill: '#38bdf8', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar
                      yAxisId="left"
                      dataKey="totalExportsMillions"
                      name="Total Slave Exports (Millions)"
                      fill="#f43f5e"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="currentGdpPerCapitaUsd"
                      name="Current GDP per Capita ($ USD)"
                      fill="#38bdf8"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Table of Nunn Dataset */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400 font-mono">
                    <tr>
                      <th className="p-3">Region / Territory</th>
                      <th className="p-3">Exports (M)</th>
                      <th className="p-3">Atlantic %</th>
                      <th className="p-3">Saharan %</th>
                      <th className="p-3">Red Sea / Indian %</th>
                      <th className="p-3">Mistrust Index</th>
                      <th className="p-3">GDP / Cap ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {NUNN_SLAVE_TRADE_EXTRACTION.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/60 transition-colors">
                        <td className="p-3 font-semibold text-slate-200">{row.regionOrModernCountry}</td>
                        <td className="p-3 font-mono text-rose-400 font-bold">{row.totalExportsMillions.toFixed(2)}M</td>
                        <td className="p-3 font-mono text-slate-300">{row.atlanticSharePct}%</td>
                        <td className="p-3 font-mono text-slate-300">{row.transSaharanSharePct}%</td>
                        <td className="p-3 font-mono text-slate-300">{row.redSeaIndianOceanPct}%</td>
                        <td className="p-3 font-mono text-amber-400 font-bold">{row.mistrustIndex}/100</td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">${row.currentGdpPerCapitaUsd.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION IV: COLONIAL EXTRACTIVE INSTITUTIONS & MONOPSONY */}
        {/* ========================================================= */}
        {activeSectionId === 'colonial_institutions' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Acemoglu Settler Mortality + Henn-Robinson Pre-Colonial Baseline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">1. The Settler Mortality Hypothesis</h4>
                    <p className="text-xs text-slate-400">Acemoglu, Johnson & Robinson (AER 2001)</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  European colonizers adopted distinct institutional strategies based on local environmental disease burdens (malaria and yellow fever):
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-1">
                    <div className="font-bold text-emerald-400">Low-Mortality Zones (e.g., North America, Australia):</div>
                    <p className="text-slate-300">
                      Colonizers settled permanently in large numbers and created <strong>inclusive institutions</strong> protecting private property rights and checking autocratic power.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-rose-900/40 space-y-1">
                    <div className="font-bold text-rose-400">High-Mortality Zones (Sub-Saharan Africa):</div>
                    <p className="text-slate-300">
                      European settlement was unviable. Colonizers engineered purely <strong>extractive institutions</strong> with minimal administrative overhead designed strictly to siphon surplus to metropolitan capitals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">2. Pre-Colonial Decentralization & Indirect Rule</h4>
                    <p className="text-xs text-slate-400">Henn & Robinson (2024 Working Paper)</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Reconstructing 1880 polities across the African continent, Nobel laureate James Robinson and Soeren Henn dismantled the myth of pre-colonial institutional failure:
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="font-mono text-2xl font-bold text-emerald-400">{PRE_COLONIAL_GOVERNANCE_DATA.decentralizedNonStatePct}%</div>
                    <div className="text-slate-400 mt-1">Decentralized Polities (Village assemblies & kinship councils)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <div className="font-mono text-2xl font-bold text-amber-400">{PRE_COLONIAL_GOVERNANCE_DATA.centralizedBureaucraticStatePct}%</div>
                    <div className="text-slate-400 mt-1">Centralized Kingdom States (Asante, Sokoto, Buganda)</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>The Active Defense of Liberty:</strong> Extreme decentralization was an intentional, sophisticated design to protect individual liberties from despotism. European "Indirect Rule" destroyed this by empowering autocratic "warrant chiefs" without customary checks.
                </p>
              </div>
            </div>

            {/* Federico Tadei (2020) Price-Gap Mathematical Model */}
            <div className="p-6 lg:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <span>Federico Tadei’s Price-Gap Model: The Microeconomics of Colonial Monopsony</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Quantifying the destruction of African Gains from Trade under CFAO, SCOA & UAC Concessionaire Cartels
                  </p>
                </div>
                <span className="text-xs font-mono bg-slate-800 text-amber-300 px-3 py-1 rounded-full border border-slate-700">
                  European Review of Econ. History (2020)
                </span>
              </div>

              {/* Mathematical Formulation Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Competitive Counterfactual Price:</span>
                  <div className="text-sm font-bold text-emerald-400">P_C = P_M - TC</div>
                  <p className="text-slate-400 text-[11px] font-sans">Metropolitan port price minus real transport & logistical costs.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Extraction Rent & Rate:</span>
                  <div className="text-sm font-bold text-amber-400">GAP = P_C - P_P | ER = GAP / P_C</div>
                  <p className="text-slate-400 text-[11px] font-sans">Actual producer price paid (P_P) suppressed by monopsony power.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Destruction in Gains from Trade (GFT):</span>
                  <div className="text-sm font-bold text-rose-400">ΔGFT = GAP / (P_C - C) &gt; ER</div>
                  <p className="text-slate-400 text-[11px] font-sans">Because marginal costs C &gt; 0, GFT destruction is always greater than raw price extraction.</p>
                </div>
              </div>

              {/* Interactive Commodity Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {TADEI_MONOPSONY_CASE_STUDIES.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCommodityIndex(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeCommodityIndex === idx
                          ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {item.commodity} ({item.territory})
                    </button>
                  ))}
                </div>

                {/* Selected Commodity Dossier */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3 lg:col-span-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                      <span>{activeCommodity.territory}</span>
                      <span>•</span>
                      <span>Cartel: {activeCommodity.buyerCartel}</span>
                    </div>

                    <h5 className="text-lg font-bold text-white">{activeCommodity.commodity}</h5>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="font-bold text-slate-200">Coercion Mechanism & Labor Regimes:</div>
                      <p className="text-slate-300 leading-relaxed">{activeCommodity.coercionMechanism}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">World Port Price:</span>
                        <div className="font-mono text-sm font-bold text-white">${activeCommodity.worldPortPriceDollars}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Competitive Price:</span>
                        <div className="font-mono text-sm font-bold text-emerald-400">${activeCommodity.competitiveCounterfactualPrice}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Actual Price Paid:</span>
                        <div className="font-mono text-sm font-bold text-rose-400">${activeCommodity.actualProducerPricePaid}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-slate-400">Price Gap Rent:</span>
                        <div className="font-mono text-sm font-bold text-amber-400">${activeCommodity.absolutePriceGap}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-900/40 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs font-mono text-rose-300 font-bold uppercase tracking-wider">Extraction Magnitude</span>
                      <div className="text-3xl font-extrabold text-rose-400 font-mono mt-1">
                        -{activeCommodity.reductionInGainsFromTradePct}%
                      </div>
                      <p className="text-xs text-rose-200/80 mt-1">
                        Net Reduction in African Peasant Gains from Trade (GFT)
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-3 border-t border-rose-800/40">
                      <div className="flex justify-between">
                        <span>Raw Price Extraction Rate (ER):</span>
                        <span className="font-mono font-bold text-rose-300">{activeCommodity.rawExtractionRatePct}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monopsony Surplus Transfer:</span>
                        <span className="font-mono font-bold text-amber-300">To Bordeaux/Marseille</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION V: PATH DEPENDENCY & POST-COLONIAL BORDERS */}
        {/* ========================================================= */}
        {activeSectionId === 'path_dependency' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Robert Bates Urban Bias + Michalopoulos Partitioning */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">1. The Marketing Board Trap & "Urban Bias"</h4>
                    <p className="text-xs text-slate-400">Robert H. Bates (1981, UC Press)</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Upon independence, newly empowered African political elites did not abolish colonial monopsonies because doing so would dilute their newly acquired state revenues and political patron-client networks:
                </p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-amber-300">The Post-Colonial Persistence Mechanism:</div>
                  <p className="text-slate-300 leading-relaxed">
                    Colonial concession systems were converted into state-run <strong>agricultural marketing boards</strong>. Post-colonial regimes bought crops at artificially depressed prices to subsidize cheap food and public sector jobs for urban dwellers, systematically starving rural farmers of capital and triggering decades of agricultural stagnation.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">2. The Berlin Border Scar & Conflict Multiplier</h4>
                    <p className="text-xs text-slate-400">Michalopoulos & Papaioannou (AER 2016)</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  The arbitrary borders drawn at the Berlin Conference (1884–1885) partitioned hundreds of unified ethnic homelands across state boundaries:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-rose-400">The Exponential Border Conflict Spike:</div>
                    <p className="text-slate-300">In non-partitioned homelands, conflict is flat across distance. In partitioned homelands, conflict spikes exponentially near borders due to state discrimination and irredentism.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-400">Satellite Nightlight Luminosity Deprivation:</div>
                    <p className="text-slate-300">Partitioned borderlands suffer severe chronic underinvestment and depressed economic development visible in satellite imagery.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Synergistic Conflict Multiplier Dossier */}
            <div className="p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border border-rose-900/50 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">The Interaction Effect: The Border Scar × The Mistrust Scar</h4>
                  <p className="text-xs text-slate-400">The fatal synthesis of historical shocks in modern civil conflict</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                When the <strong>border scar</strong> of arbitrary partitioning interacts with the <strong>mistrust scar</strong> of the slave trades, it acts as a lethal conflict-escalation multiplier. In high-trust environments, communities resolve cross-border disputes over land, cattle, and water through customary pacts. In low-trust partitioned territories (scarred by centuries of predatory slave raiding), lack of baseline social capital causes minor resource frictions to rapidly escalate into armed political violence and inter-ethnic war.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION VI: CONTEMPORARY GEOPOLITICAL SHIFTS (2025–2026) */}
        {/* ========================================================= */}
        {activeSectionId === 'contemporary_geopolitics' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Geopolitical Paradigm Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {CONTEMPORARY_GEOPOLITICAL_PARADIGMS.map((accord, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-[11px] font-mono font-bold border border-amber-500/20">
                        {accord.milestoneDate}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Diplomatic Record {idx + 1}</span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">{accord.initiative}</h4>
                    <p className="text-xs font-semibold text-slate-300">Lead Actors: {accord.leadActors}</p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1.5">
                      <div className="font-bold text-amber-400">Core Demands & Mechanisms:</div>
                      <ul className="space-y-1 list-disc list-inside text-slate-300 text-[11px]">
                        {accord.coreDemandsOrMechanisms.map((demand, dIdx) => (
                          <li key={dIdx}>{demand}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-xs space-y-1">
                    <div className="font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Systemic Conflict / Metropole Defense:</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{accord.systemicConflictOrObstacle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Highlight on the March 25, 2026 UN General Assembly Slavery Resolution */}
            <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 border border-indigo-800/60 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-white">
                    Milestone Declaration: UN General Assembly Resolution (March 25, 2026)
                  </h4>
                  <p className="text-xs text-indigo-300 font-mono">
                    Official Recognition of Transatlantic Slavery as the "Gravest Crime Against Humanity"
                  </p>
                </div>
              </div>

              <p className="text-xs lg:text-sm text-slate-200 leading-relaxed">
                Sponsored by Ghana on behalf of the 54-member African Union and supported in unison by CARICOM, the UN General Assembly adopted a watershed resolution declaring chattel slavery and the transatlantic slave trade the <strong>"gravest crime against humanity."</strong> The vote concluded with an overwhelming <strong>123 in favor, 3 against (United States, Israel, Argentina)</strong>, and 52 abstentions (UK and majority EU member states). This vote marked the decisive transition of the reparations agenda from moral advocacy into binding intergovernmental multilateralism.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-900/40">
                  <span className="text-slate-400">Total in Favor:</span>
                  <div className="font-mono text-xl font-extrabold text-emerald-400">123 States (AU + CARICOM + Global South)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-900/40">
                  <span className="text-slate-400">Opposing Votes:</span>
                  <div className="font-mono text-xl font-extrabold text-rose-400">3 States (USA, Israel, Argentina)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-900/40">
                  <span className="text-slate-400">Abstaining Metropoles:</span>
                  <div className="font-mono text-xl font-extrabold text-amber-400">52 States (UK, France, EU Bloc)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION VII: BIBLIOGRAPHY & SOURCES */}
        {/* ========================================================= */}
        {activeSectionId === 'bibliography_sources' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Peer-Reviewed Academic Grounding & Archival Repositories</span>
              </h4>
              <p className="text-xs text-slate-300">
                Every econometric equation, historical price series, and biological model in this report is anchored in verifiable literature:
              </p>

              <div className="space-y-3 pt-2">
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
                    badge: 'Berlin Borders'
                  },
                  {
                    authors: 'Nunn, Nathan',
                    year: '2008',
                    title: 'The Long-Term Effects of Africa’s Slave Trades',
                    journal: 'Quarterly Journal of Economics, Vol. 123, No. 1, pp. 139–176',
                    url: 'https://dash.harvard.edu/bitstreams/7312037c-846b-6bd4-e053-0100007fdf3b/download',
                    badge: 'QJE Causal'
                  },
                  {
                    authors: 'Nunn, Nathan, and Leonard Wantchekon',
                    year: '2011',
                    title: 'The Slave Trade and the Origins of Mistrust in Africa',
                    journal: 'American Economic Review, Vol. 101, No. 7, pp. 3221–3252',
                    url: 'https://www.aeaweb.org/articles?id=10.1257/aer.101.7.3221',
                    badge: 'Mistrust Scar'
                  },
                  {
                    authors: 'Tadei, Federico',
                    year: '2020',
                    title: 'Measuring extractive institutions: colonial trade and price gaps in French Africa',
                    journal: 'European Review of Economic History, Vol. 24, No. 1, pp. 1–23',
                    url: 'https://ideas.repec.org/a/oup/ereveh/v24y2020i1p1-23..html',
                    badge: 'Price Gaps'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1 max-w-4xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/20 font-bold">
                          {item.badge}
                        </span>
                        <span className="font-bold text-white">{item.authors} ({item.year})</span>
                      </div>
                      <div className="font-semibold text-slate-200 italic">"{item.title}"</div>
                      <div className="text-slate-400">{item.journal}</div>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-[11px] flex items-center gap-1.5 shrink-0 border border-slate-700 w-fit cursor-pointer"
                    >
                      <span>Read Paper</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Portfolios & Diplomatic Documentation */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-indigo-400" />
                <span>Intergovernmental Policy Portfolios & Diplomatic Archives</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-indigo-300">The Bridgetown Initiative Policy Portfolios</div>
                  <p className="text-slate-300 leading-relaxed">
                    Official draft texts for Bridgetown 3.0, credit enhancement mechanisms, SDR rechanneling, and climate debt suspension clauses.
                  </p>
                  <a
                    href="https://www.bridgetown-initiative.org/publications/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 hover:underline pt-1"
                  >
                    <span>Bridgetown Publications Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-indigo-300">UN General Assembly Slavery Resolution Documentation</div>
                  <p className="text-slate-300 leading-relaxed">
                    Official statements by the African Union and CARICOM regarding the March 25, 2026 declaration.
                  </p>
                  <a
                    href="https://caricom.org/caricom-reparations-commission-chair-applauds-adoption-of-un-resolution-recognising-slavery-as-the-greatest-crime-against-humanity/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-400 hover:underline pt-1"
                  >
                    <span>CARICOM UN Resolution Press Release</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
