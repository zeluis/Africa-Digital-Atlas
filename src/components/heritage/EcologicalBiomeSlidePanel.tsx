import React, { useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  Globe2,
  Trees,
  Sun,
  Compass,
  Waves,
  Mountain,
  Flower2,
  Shield,
  Landmark,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { BiomeFilter, BIOME_OPTIONS } from '../../data/unescoHeritageRegistry';

export interface EcologicalBiomeSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBiome: BiomeFilter;
  onSelectBiome: (biome: BiomeFilter) => void;
  biomeCounts: Record<string, number>;
  totalSitesCount: number;
}

interface BiomeMetadata {
  id: BiomeFilter;
  title: string;
  tagline: string;
  description: string;
  representativeSites: string[];
  icon: React.ElementType;
  colors: {
    iconBg: string;
    iconText: string;
    borderActive: string;
    bgActive: string;
    badgeBg: string;
    badgeText: string;
  };
}

const BIOME_CATALOG: BiomeMetadata[] = [
  {
    id: 'All Biomes',
    title: 'All Ecological Biomes',
    tagline: 'Complete 210-Property Registry',
    description: 'All natural biospheres, mixed biodiversity complexes, and cultural landscapes across Africa and the Arab States.',
    representativeSites: ['Serengeti', 'Virunga', 'Aldabra Atoll', 'Ténéré', 'Lalibela'],
    icon: Globe2,
    colors: {
      iconBg: 'bg-stone-200/80 dark:bg-stone-800 text-stone-800 dark:text-stone-200',
      iconText: 'text-stone-800 dark:text-stone-200',
      borderActive: 'border-stone-900 dark:border-stone-100 ring-2 ring-stone-900/20 dark:ring-stone-100/20',
      bgActive: 'bg-stone-100/90 dark:bg-stone-900/90',
      badgeBg: 'bg-stone-200 dark:bg-stone-800',
      badgeText: 'text-stone-900 dark:text-stone-100'
    }
  },
  {
    id: 'Congo Basin Rainforest',
    title: 'Congo Basin Rainforest',
    tagline: 'Guineo-Congolian Moist Broadleaf Forest',
    description: 'Dense equatorial evergreen canopy, Earth’s second largest contiguous tropical rainforest, critical carbon sink and endangered great ape habitat.',
    representativeSites: ['Salonga National Park', 'Dja Faunal Reserve', 'Lopé-Okanda', 'Taï National Park'],
    icon: Trees,
    colors: {
      iconBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
      iconText: 'text-emerald-700 dark:text-emerald-400',
      borderActive: 'border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-500/20',
      bgActive: 'bg-emerald-500/10 dark:bg-emerald-950/30',
      badgeBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
      badgeText: 'text-emerald-800 dark:text-emerald-300'
    }
  },
  {
    id: 'Hyper-Arid & Desert Erg',
    title: 'Hyper-Arid & Desert Erg',
    tagline: 'Sahara & Namib Hyper-Arid Formations',
    description: 'Massive active dune fields (ergs), rocky plateaus, paleoclimatic fossil beds, and prehistoric rock art galleries surviving extreme aridity.',
    representativeSites: ['Air and Ténéré Natural Reserves', 'Wadi Al-Hitan', 'Namib Sand Sea', 'Tassili n’Ajjer'],
    icon: Sun,
    colors: {
      iconBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
      iconText: 'text-amber-700 dark:text-amber-400',
      borderActive: 'border-amber-600 dark:border-amber-500 ring-2 ring-amber-500/20',
      bgActive: 'bg-amber-500/10 dark:bg-amber-950/30',
      badgeBg: 'bg-amber-500/15 dark:bg-amber-500/20',
      badgeText: 'text-amber-800 dark:text-amber-300'
    }
  },
  {
    id: 'Savanna & Alluvial Delta',
    title: 'Savanna & Alluvial Delta',
    tagline: 'Acacia Savannas & Inland Delta Basins',
    description: 'Vast open grasslands, annual ungulate migration corridors, and endorheic wetland inundations maintaining unmatched wildlife biomass.',
    representativeSites: ['Serengeti National Park', 'Ngorongoro Crater', 'Okavango Delta', 'Mana Pools'],
    icon: Compass,
    colors: {
      iconBg: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400',
      iconText: 'text-yellow-700 dark:text-yellow-400',
      borderActive: 'border-yellow-600 dark:border-yellow-500 ring-2 ring-yellow-500/20',
      bgActive: 'bg-yellow-500/10 dark:bg-yellow-950/30',
      badgeBg: 'bg-yellow-500/15 dark:bg-yellow-500/20',
      badgeText: 'text-yellow-800 dark:text-yellow-300'
    }
  },
  {
    id: 'Marine & Coastal Atoll',
    title: 'Marine & Coastal Atoll',
    tagline: 'Oceanic Coral Atolls & Mangrove Coastlines',
    description: 'Pristine coral reef ecosystems, elevated atolls, mangrove estuaries, and oceanic biodiversity havens with high marine endemism.',
    representativeSites: ['Aldabra Atoll', 'Banc d’Arguin National Park', 'Sanganeb Marine Reserve', 'iSimangaliso'],
    icon: Waves,
    colors: {
      iconBg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400',
      iconText: 'text-cyan-700 dark:text-cyan-400',
      borderActive: 'border-cyan-600 dark:border-cyan-500 ring-2 ring-cyan-500/20',
      bgActive: 'bg-cyan-500/10 dark:bg-cyan-950/30',
      badgeBg: 'bg-cyan-500/15 dark:bg-cyan-500/20',
      badgeText: 'text-cyan-800 dark:text-cyan-300'
    }
  },
  {
    id: 'Afroalpine & Rift Montane',
    title: 'Afroalpine & Rift Montane',
    tagline: 'Great Rift Valley & Glaciated Volcanic Peaks',
    description: 'High-elevation afroalpine moorlands, giant dendrosenecio lobelias, volcanic massifs, and remnant tropical glaciers along the Albertine & Gregory Rifts.',
    representativeSites: ['Mount Kilimanjaro', 'Mount Kenya National Park', 'Simien National Park', 'Rwenzori Mountains'],
    icon: Mountain,
    colors: {
      iconBg: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400',
      iconText: 'text-indigo-700 dark:text-indigo-400',
      borderActive: 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20',
      bgActive: 'bg-indigo-500/10 dark:bg-indigo-950/30',
      badgeBg: 'bg-indigo-500/15 dark:bg-indigo-500/20',
      badgeText: 'text-indigo-800 dark:text-indigo-300'
    }
  },
  {
    id: 'Cape Floral Mediterranean',
    title: 'Cape Floral Mediterranean',
    tagline: 'Cape Fynbos & Succulent Karoo Kingdom',
    description: 'One of Earth’s six recognized floral kingdoms, with over 9,000 vascular plant species exhibiting nearly 70% regional endemism.',
    representativeSites: ['Cape Floral Region Protected Areas', 'Table Mountain', 'Baviaanskloof Mega-Reserve'],
    icon: Flower2,
    colors: {
      iconBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
      iconText: 'text-rose-700 dark:text-rose-400',
      borderActive: 'border-rose-600 dark:border-rose-500 ring-2 ring-rose-500/20',
      bgActive: 'bg-rose-500/10 dark:bg-rose-950/30',
      badgeBg: 'bg-rose-500/15 dark:bg-rose-500/20',
      badgeText: 'text-rose-800 dark:text-rose-300'
    }
  },
  {
    id: 'Equatorial Biosphere Reserve',
    title: 'Equatorial Biosphere Reserve',
    tagline: 'Primary Protected Refugia & Sanctuaries',
    description: 'Intact biological sanctuaries and UNESCO Man and the Biosphere (MAB) reserves dedicated to endemic and threatened species.',
    representativeSites: ['Mount Nimba Strict Nature Reserve', 'Comoe National Park', 'Kahuzi-Biega'],
    icon: Shield,
    colors: {
      iconBg: 'bg-teal-500/15 text-teal-700 dark:text-teal-400',
      iconText: 'text-teal-700 dark:text-teal-400',
      borderActive: 'border-teal-600 dark:border-teal-500 ring-2 ring-teal-500/20',
      bgActive: 'bg-teal-500/10 dark:bg-teal-950/30',
      badgeBg: 'bg-teal-500/15 dark:bg-teal-500/20',
      badgeText: 'text-teal-800 dark:text-teal-300'
    }
  },
  {
    id: 'Cultural Landscape',
    title: 'Cultural Landscape',
    tagline: 'Anthropogenic Heritage & Ancient Settlements',
    description: 'Historic trade crossroads, rock-hewn monuments, fortified ksars, ancient universities, and millennium-old urban architectures.',
    representativeSites: ['Rock-Hewn Churches of Lalibela', 'Timbuktu', 'Old Towns of Djenné', 'Pyramids of Giza'],
    icon: Landmark,
    colors: {
      iconBg: 'bg-stone-500/15 text-stone-700 dark:text-stone-300',
      iconText: 'text-stone-700 dark:text-stone-300',
      borderActive: 'border-stone-600 dark:border-stone-400 ring-2 ring-stone-500/20',
      bgActive: 'bg-stone-500/10 dark:bg-stone-900/40',
      badgeBg: 'bg-stone-500/15 dark:bg-stone-500/20',
      badgeText: 'text-stone-800 dark:text-stone-200'
    }
  }
];

export const EcologicalBiomeSlidePanel: React.FC<EcologicalBiomeSlidePanelProps> = ({
  isOpen,
  onClose,
  selectedBiome,
  onSelectBiome,
  biomeCounts,
  totalSitesCount
}) => {
  const headingId = useId();

  // Escape key handler to close panel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const activeMeta = BIOME_CATALOG.find(b => b.id === selectedBiome) || BIOME_CATALOG[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="region" aria-label="Ecological Biomes Filter Overlay">
          {/* Backdrop with refined dark glassmorphism */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-over Panel Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 340,
                mass: 0.8
              }}
              className="w-screen max-w-md md:max-w-lg lg:max-w-xl bg-[#FAF8F5] dark:bg-[#151413] border-l border-stone-200/90 dark:border-stone-800 shadow-2xl flex flex-col h-full overflow-hidden pointer-events-auto"
            >
              {/* Header Bar */}
              <header className="px-5 sm:px-6 py-4 border-b border-stone-200/90 dark:border-stone-800 bg-[#F4EFE6]/95 dark:bg-stone-950/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-emerald-600/10 dark:bg-emerald-400/15 border border-emerald-600/20 dark:border-emerald-400/25 text-emerald-800 dark:text-emerald-400 shrink-0">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2
                      id={headingId}
                      className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 truncate"
                    >
                      Ecological Biomes &amp; Habitats
                    </h2>
                    <p className="text-[11px] font-mono text-stone-600 dark:text-stone-400 truncate">
                      Curated classification across 7 major biosphere zones
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedBiome !== 'All Biomes' && (
                    <button
                      onClick={() => onSelectBiome('All Biomes')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                      title="Reset to All Biomes"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                    aria-label="Close Biomes Panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Active Selection Status Banner */}
              <div className="px-5 sm:px-6 py-2.5 bg-stone-100/90 dark:bg-stone-900/80 border-b border-stone-200/70 dark:border-stone-800/70 flex items-center justify-between text-xs font-mono shrink-0">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-stone-500 dark:text-stone-400 uppercase text-[10px] tracking-wider font-semibold">
                    Current Filter:
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 truncate">
                    {activeMeta.title}
                  </span>
                </div>
                <span className="font-bold text-emerald-800 dark:text-emerald-400 shrink-0">
                  {biomeCounts[selectedBiome] || 0} of {totalSitesCount} sites
                </span>
              </div>

              {/* Biomes List Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sleek-scrollbar">
                {BIOME_CATALOG.map(biome => {
                  const isSelected = selectedBiome === biome.id;
                  const count = biomeCounts[biome.id] ?? 0;
                  const Icon = biome.icon;

                  return (
                    <button
                      key={biome.id}
                      onClick={() => onSelectBiome(biome.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col gap-2.5 ${
                        isSelected
                          ? `${biome.colors.bgActive} ${biome.colors.borderActive} shadow-md`
                          : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-xs'
                      }`}
                    >
                      {/* Top Row: Icon, Title, Site Count & Checkmark */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${biome.colors.iconBg}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                              {biome.title}
                            </h3>
                            <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                              {biome.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                              isSelected
                                ? `${biome.colors.badgeBg} ${biome.colors.badgeText}`
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            {count} {count === 1 ? 'site' : 'sites'}
                          </span>

                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-emerald-600 text-white scale-100'
                                : 'border border-stone-300 dark:border-stone-700 group-hover:border-emerald-500'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Ecological Description */}
                      <p className="text-xs font-serif text-stone-600 dark:text-stone-300 leading-relaxed pl-11">
                        {biome.description}
                      </p>

                      {/* Bottom Row: Representative Sites Snippets */}
                      <div className="pl-11 pt-1 flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-stone-500 dark:text-stone-400">
                        <span className="uppercase tracking-wider text-[9.5px] font-semibold text-stone-400 dark:text-stone-500">
                          Examples:
                        </span>
                        {biome.representativeSites.map((siteName, idx) => (
                          <React.Fragment key={siteName}>
                            <span className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                              {siteName}
                            </span>
                            {idx < biome.representativeSites.length - 1 && (
                              <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">
                                ·
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer Drawer Action Bar */}
              <footer className="p-4 sm:p-5 border-t border-stone-200/90 dark:border-stone-800 bg-[#F4EFE6]/95 dark:bg-stone-950/95 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                <div className="text-xs font-mono text-stone-600 dark:text-stone-400 truncate">
                  Filtered: <strong className="text-stone-900 dark:text-stone-100">{biomeCounts[selectedBiome] || 0}</strong> of{' '}
                  <strong className="text-stone-900 dark:text-stone-100">{totalSitesCount}</strong> sites
                </div>

                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-950 text-xs font-mono font-bold shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <span>Apply &amp; Inspect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </footer>
            </motion.section>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
