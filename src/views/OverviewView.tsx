import React, { useState } from 'react';
import { atlas } from '../data/atlas-store';
import { 
  getContinentalSummary, 
  getRegionalSummaries, 
  getIndicatorRankings 
} from '../data/atlas-selectors';
import { AfricanRegion, AtlasEntity } from '../data/types';
import { AfricaMap } from '../components/AfricaMap';
import { CountryFlag } from '../components/CountryFlag';
import { 
  EditorialCard, 
  DataCard, 
  ExplorationCard, 
  ReferenceCard 
} from '../components/CardTaxonomy';
import { FirstViewportClarity, ProgressiveAccordion, ReadMore } from '../components/ProgressiveDisclosure';
import { JapandiTooltip } from '../components/JapandiTooltip';
import { 
  formatPopulation, 
  formatGDP, 
  formatPercentage, 
  formatHDI 
} from '../data/atlas-formatters';
import { 
  Users, 
  DollarSign, 
  Sparkles, 
  HeartHandshake, 
  Zap, 
  Landmark, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Globe2,
  Compass,
  Layers,
  Award
} from 'lucide-react';

interface OverviewViewProps {
  onSelectCountry: (entityId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onSelectCountry,
  onNavigateTab
}) => {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<AfricanRegion | 'All'>('All');
  const continental = getContinentalSummary();
  const regionalSummaries = getRegionalSummaries();
  const topEconomies = getIndicatorRankings('NY.GDP.MKTP.CD', 6);
  const topHdi = getIndicatorRankings('UNDP.HDI.INDEX', 6);

  const regionTabs: (AfricanRegion | 'All')[] = [
    'All',
    'Northern Africa',
    'Western Africa',
    'Central Africa',
    'Eastern Africa',
    'Southern Africa'
  ];

  return (
    <div className="space-y-8 animate-enter-japandi">
      {/* 1. First Viewport Orientation: What is this? Why does it matter? What can I explore? */}
      <div className="cascade-item cascade-1">
        <FirstViewportClarity onExploreClick={onNavigateTab} />
      </div>

      {/* 2. Continental Primary KPIs (Data Cards Taxonomy) */}
      <section aria-label="Continental Key Indicators" className="space-y-3 cascade-item cascade-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Pan-African Macroeconomic & Demographic Benchmarks (2024)
          </h2>
          <span className="text-[11px] font-mono text-zinc-400">UN DESA • IMF • UNDP</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <DataCard
            label="Total Population"
            value={formatPopulation(continental.totalPopulationMillion)}
            unit="Habitants"
            delta={{ value: '+2.4%', isPositive: true, period: 'YoY' }}
            source="UN DESA Midyear 2024"
            icon={<Users className="w-4 h-4" />}
            regionalAccent="#10b981"
          />
          <DataCard
            label="Combined GDP"
            value={formatGDP(continental.totalGdpBillionUsd)}
            unit="USD"
            delta={{ value: '+3.8%', isPositive: true, period: 'Real' }}
            source="IMF WEO Oct 2024"
            icon={<DollarSign className="w-4 h-4" />}
            regionalAccent="#06b6d4"
          />
          <DataCard
            label="GDP Per Capita"
            value={`$${(continental?.weightedGdpPerCapitaUsd ?? 0).toLocaleString()}`}
            unit="Weighted"
            benchmark={{ label: 'Median', value: '$1,840' }}
            icon={<Sparkles className="w-4 h-4" />}
            regionalAccent="#6366f1"
          />
          <DataCard
            label="Continental HDI"
            value={formatHDI(continental.weightedHdi)}
            unit="Score"
            benchmark={{ label: 'Top', value: '0.802' }}
            icon={<HeartHandshake className="w-4 h-4" />}
            regionalAccent="#f59e0b"
          />
          <DataCard
            label="Electrification"
            value={formatPercentage(continental.averageElectricityAccessPct)}
            unit="Access"
            delta={{ value: '+1.6%', isPositive: true, period: 'Annual' }}
            icon={<Zap className="w-4 h-4" />}
            regionalAccent="#10b981"
          />
          <DataCard
            label="World Heritage"
            value={continental.totalHeritageSites}
            unit="Sites"
            benchmark={{ label: 'Countries', value: '42 / 54' }}
            icon={<Landmark className="w-4 h-4" />}
            regionalAccent="#ec4899"
          />
        </div>
      </section>

      {/* 3. Interactive Map & Cartography Section */}
      <section aria-label="Interactive Cartography" className="space-y-4 cascade-item cascade-3">
        {/* Region Filter Chips */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 pr-2">
              <Compass className="w-3.5 h-3.5 text-emerald-500" /> Filter Region:
            </span>
            {regionTabs.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegionFilter(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  selectedRegionFilter === reg
                    ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-md'
                    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            54 Sovereign States + 4 Territories Indexed
          </span>
        </div>

        {/* The Live Interactive Map */}
        <AfricaMap
          onSelectCountry={onSelectCountry}
          selectedRegionFilter={selectedRegionFilter}
        />
      </section>

      {/* 4. Editorial Essay Card (Editorial Taxonomy Archetype) */}
      <section aria-label="Editorial Commentary" className="cascade-item cascade-4">
        <EditorialCard
          category="CONTINENTAL TRAJECTORY"
          title="The Demographic Dividend and Single-Market Convergence"
          subtitle="How demographic expansion and AfCFTA integration are restructuring African economic gravity"
          narrative="With over 1.48 billion people and a median age below 20 years, Africa represents the fastest-growing workforce globally. Macroeconomic structural realignments—accelerated by the African Continental Free Trade Area (AfCFTA)—are unlocking intra-continental manufacturing, digital services, and sustainable energy corridors."
          readMoreContent="Harmonized regional data indicates that regional economic communities (ECOWAS, EAC, SADC) are increasingly converging on standard customs classifications, renewable grid interconnects, and cross-border digital payment systems (PAPSS). This statistical atlas provides continuous verification across trade velocity, human capital investment, and environmental stewardship."
          authorOrSource="African Geospatial Research Initiative"
          regionalAccent="#10b981"
          actionText="Explore 50+ Time-Series Indicators"
          onAction={() => onNavigateTab('analytics')}
        />
      </section>

      {/* 5. Exploration Cards (Exploration Taxonomy Archetype) */}
      <section aria-label="Interactive Destinations" className="space-y-3 cascade-item cascade-5">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-500" />
          Interactive Research Workspaces
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ExplorationCard
            title="Linguistic Diversity Matrix"
            badge="2,000+ LANGUAGES"
            description="Explore the 4 major African language phyla (Niger-Congo, Afroasiatic, Nilo-Saharan, Khoisan) with national distribution matrices and official language status."
            actionPrompt="Launch Linguistics Workspace"
            onClick={() => onNavigateTab('languages')}
            regionalAccent="#06b6d4"
          />

          <ExplorationCard
            title="UNESCO World Heritage Registry"
            badge="104 PROPERTIES"
            description="Inspect verified cultural and natural landmarks across 42 African nations with inscription criteria, danger status monitoring, and spatial coordinate mapping."
            actionPrompt="Launch Heritage Explorer"
            onClick={() => onNavigateTab('heritage')}
            regionalAccent="#ec4899"
          />

          <ExplorationCard
            title="Bilateral Country Comparison"
            badge="SIDE-BY-SIDE AUDIT"
            description="Select any two African nations to compute composite score differentials across GDP, life expectancy, urban access, renewable energy, and demographic profiles."
            actionPrompt="Open Comparison Tool"
            onClick={() => onNavigateTab('compare')}
            regionalAccent="#6366f1"
          />
        </div>
      </section>

      {/* 6. Two Column Section: Regional Snapshots & Performance Leaders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 cascade-item cascade-6">
        {/* Left Column: Regional Snapshots */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-display">
                <Globe2 className="w-5 h-5 text-emerald-500" /> 5 UN Geoscheme Regions
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Aggregated regional macroeconomic and population footprint</p>
            </div>
            <button
              onClick={() => onNavigateTab('regions')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View Regional Blocs →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {regionalSummaries.map(reg => (
              <div 
                key={reg.region}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-4 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-2">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{reg.region}</h4>
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-600 dark:text-zinc-400">
                    {reg.countryCount} States
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-zinc-500">Population</span>
                    <div className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{formatPopulation(reg.totalPopulation)}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Regional GDP</span>
                    <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{formatGDP(reg.totalGdp)}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Avg Growth</span>
                    <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{reg.averageGrowth}%</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Weighted HDI</span>
                    <div className="font-mono font-bold text-amber-600 dark:text-amber-400">{formatHDI(reg.averageHdi)}</div>
                  </div>
                </div>

                {reg.leadingEconomy && (
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Anchor Economy:</span>
                    <button
                      onClick={() => onSelectCountry(reg.leadingEconomy!.id)}
                      className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      <CountryFlag entityId={reg.leadingEconomy.id} size="xs" />
                      <span>{reg.leadingEconomy.name}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Top Economic & HDI Leaders */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Economies Card */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-500" /> Largest African Economies (GDP)
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">Nominal 2024</span>
            </div>

            <div className="space-y-2">
              {topEconomies.map((item, idx) => (
                <div
                  key={item.entity.id}
                  onClick={() => onSelectCountry(item.entity.id)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-mono text-xs font-bold text-zinc-400 group-hover:text-cyan-500">
                      #{idx + 1}
                    </span>
                    <CountryFlag entityId={item.entity.id} size="sm" />
                    <div>
                      <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100">
                        {item.entity.name}
                      </div>
                      <span className="text-[10px] text-zinc-500">{item.entity.region}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-cyan-600 dark:text-cyan-300">
                      ${item.value.toFixed(1)}B
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top HDI Leaders Card */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" /> Highest Human Development (HDI)
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">UNDP 2024</span>
            </div>

            <div className="space-y-2">
              {topHdi.map((item, idx) => (
                <div
                  key={item.entity.id}
                  onClick={() => onSelectCountry(item.entity.id)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center font-mono text-xs font-bold text-zinc-400 group-hover:text-emerald-500">
                      #{idx + 1}
                    </span>
                    <CountryFlag entityId={item.entity.id} size="sm" />
                    <div>
                      <div className="font-semibold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-100">
                        {item.entity.name}
                      </div>
                      <span className="text-[10px] text-zinc-500">{item.entity.region}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-300">
                      {formatHDI(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. Methodology & Reference Cards (Reference Taxonomy Archetype) */}
      <section aria-label="Harmonization & Provenance Methodology" className="space-y-3 cascade-item cascade-7">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Harmonization Standards & Reference Documentation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReferenceCard
            sourceAgency="World Bank Group"
            indicatorCode="WDI.2024.REV3"
            methodologyNote="Macroeconomic and demographic series harmonized via World Development Indicators API. Currency figures standardized in constant 2015 USD and nominal 2024 USD."
            updateCadence="Quarterly Sync"
            license="CC-BY 4.0 Open Access"
            verifiedYear={2024}
            externalUrl="https://data.worldbank.org/"
          />

          <ReferenceCard
            sourceAgency="UN DESA Population Division"
            indicatorCode="WPP.2024.M49"
            methodologyNote="Population estimates, fertility rates, median age, and urban distribution ratios indexed under UN Geoscheme M49 continental standard definitions."
            updateCadence="Biennial Revision"
            license="Public Domain (UN Open Data)"
            verifiedYear={2024}
            externalUrl="https://population.un.org/wpp/"
          />

          <ReferenceCard
            sourceAgency="UNESCO World Heritage Centre"
            indicatorCode="WHC.STAT.104"
            methodologyNote="104 inscribed cultural and natural properties across 42 African state parties, including danger list status tracking and geospatial boundary polygons."
            updateCadence="Annual Committee Session"
            license="Open UNESCO Metadata"
            verifiedYear={2024}
            externalUrl="https://whc.unesco.org/en/list/"
          />
        </div>
      </section>
    </div>
  );
};

