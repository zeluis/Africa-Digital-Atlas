import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Database, 
  ExternalLink, 
  FileText, 
  Quote, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { CANONICAL_VOYAGES } from '../../data/slaveVoyagesData';
import { CanonicalVoyage } from '../../data/slaveVoyagesTypes';

export interface StorySlide {
  id: string;
  title: string;
  era: string;
  archiveSource: string;
  image: string;
  quote: string;
  summary: string;
  narrative: string[];
  linkedVoyageId: string;
  linkedEssayId: string;
}

const STORY_SLIDES: StorySlide[] = [
  {
    id: 'story-brookes',
    title: 'The Technical Anatomy of Confinement: The Brookes Ledger',
    era: '1783 · Peak Era',
    archiveSource: 'Society for Effecting the Abolition of the Slave Trade, London (1789)',
    image: '/src/assets/images/story_brookes_1790205613734.jpg',
    quote: 'An influential 1789 engraving depicting the mathematical allocation of human bodies inside the cargo hold of the Liverpool slaver Brookes.',
    summary: ' Thomas Clarkson and London abolitionists turned cold ship capacities into an unforgettable, geometric visual indictment of forced human confinement.',
    narrative: [
      'In 1788, the British Parliament enacted the Dolben Act—the first legislation regulating slaving vessel capacities based on tonnage. In response, abolitionist Thomas Clarkson and his London committee commissioned a precise, to-scale architectural engraving of the ship Brookes.',
      'Rather than depicting physical violence or chains, the diagram relied on clinical, mathematical precision to illustrate 454 captives packed tightly into the lower decks and platform shelves, proving that even under newly-established legal limits, shipboard confinement was an absolute physiological horror.',
      'This single schematic became one of the most effective pieces of human rights propaganda in history, distributed globally to translate abstract cargo ledgers into tangible human tragedy.'
    ],
    linkedVoyageId: 'sv-002',
    linkedEssayId: 'essay-global-magnitude'
  },
  {
    id: 'story-seraphique',
    title: 'The Watercolor Ledger: La Marie-Séraphique off Cabinda',
    era: '1769 · Eighteenth Century',
    archiveSource: 'Musée d\'Histoire de Nantes, Fonds Marie-Séraphique, Inv. 984.7.1',
    image: '/src/assets/images/story_seraphique_1790205628063.jpg',
    quote: 'A rare set of on-site watercolors executed by officers in 1769, capturing the commercial transactions at Cabinda.',
    summary: 'Logbooks and paintings by the ship’s crew offer a rare, chillingly detailed look at coastal negotiations and cargo listings in West Central Africa.',
    narrative: [
      'La Marie-Séraphique was a 150-ton French slaving brigantin out of Nantes. During its 1769 expedition to West Central Africa, the ship’s officers kept an unusually detailed, illustrated logbook and journal.',
      'The resulting watercolors provide historians with an unprecedented visual record of coastal commerce. They depict the ship anchored off Cabinda, the temporary wooden barracks (barracoons) constructed on shore, and the elaborate tents where French officers bartered with local rulers for human captives.',
      'A final painting in the series shows the deck packed with captives on the day of sale in Saint-Domingue, capturing the commercial mechanics of the triangular trade with disturbing, dispassionate clarity.'
    ],
    linkedVoyageId: 'sv-003',
    linkedEssayId: 'essay-eight-regions'
  },
  {
    id: 'story-sao-jose',
    title: 'The Drowned and the Saved: The Wreck of the São José',
    era: '1794 · Late Colonial Period',
    archiveSource: 'Slave Wrecks Project & Western Cape Archives, Cape Town',
    image: '/src/assets/images/story_sao_jose_1790205638645.jpg',
    quote: 'A tragic shipwreck off Cape Town in 1794, rediscovered in 2015, bridging maritime archaeology and historical archives.',
    summary: 'Scientific excavation of the Portuguese vessel São José brought to light the maritime risks and human cost of the Southeast African Indian Ocean trade.',
    narrative: [
      'In December 1794, the Portuguese vessel São José Paquete de Africa was carrying over 500 captives from Mozambique to Brazil. While navigating the treacherous waters around the Cape of Good Hope, the ship struck rocks off Clifton Beach in Cape Town.',
      'Over 200 captives drowned in the heavy surf, chained inside the hold. The survivors were rescued from the wreckage only to be sold into local colonial servitude in Cape Town.',
      'In 2015, an international team of maritime archaeologists discovered the wreckage, retrieving iron shackles, lead ballast blocks, and ship timbers. This represents the first shipwreck of an active slaving vessel ever scientifically excavated and verified.'
    ],
    linkedVoyageId: 'sv-004',
    linkedEssayId: 'essay-middle-passage'
  },
  {
    id: 'story-amistad',
    title: 'The Supreme Court Mutiny: Sengbe Pieh and the Amistad',
    era: '1839 · Suppression Era',
    archiveSource: 'U.S. Supreme Court Case Files, United States v. The Amistad, 40 U.S. 518',
    image: '/src/assets/images/story_amistad_1790205648070.jpg',
    quote: 'Sengbe Pieh led fifty-three Mende captives in a successful high-seas revolt, triggering a historic legal battle.',
    summary: 'A dramatic shipboard insurrection on a Cuban coastal schooner culminated in a landmark US Supreme Court victory for self-emancipation.',
    narrative: [
      'In June 1839, fifty-three Mende captives were purchased in Havana and forced onto the Spanish coastal schooner La Amistad bound for Puerto Príncipe.',
      'Three nights into the voyage, Sengbe Pieh (known as Joseph Cinqué) freed himself using a loose nail, armed the captives with cane knives from the cargo hold, and took control of the ship, demanding to be sailed back to West Africa.',
      'After a winding maritime chase ended in their capture off Long Island, the Africans became the center of a landmark international legal battle. Former President John Quincy Adams defended them before the US Supreme Court, which ruled they were free citizens who had legally resisted unlawful enslavement, culminating in their repatriation to Sierra Leone.'
    ],
    linkedVoyageId: 'sv-005',
    linkedEssayId: 'essay-shipboard-rebellion'
  },
  {
    id: 'story-clotilda',
    title: 'The Last Vessel: The Burning of the Clotilda',
    era: '1860 · Illicit Trade Era',
    archiveSource: 'Mobile Historical Society, Journal of Captain William Foster (1860)',
    image: '/src/assets/images/story_clotilda_1790205658067.jpg',
    quote: 'The last documented slaving vessel to enter the United States, burned in 1860 to conceal evidence of illegal traffic.',
    summary: 'A clandestine voyage to Ouidah and the burning of the ship in Alabama led to the creation of Africatown and a remarkable legacy of survival.',
    narrative: [
      'Fifty-two years after the United States banned slave imports, Alabama businessman Timothy Meaher made a wager that he could smuggle a cargo of captives into Mobile under the nose of federal authorities.',
      'In 1860, the schooner Clotilda sailed to Ouidah and embarked 110 captives. Upon returning to Alabama, the captain discharged his cargo in the dead of night and immediately burned and scuttled the ship in the Mobile River to destroy all physical evidence of the crime.',
      'The survivors, including Cudjo Lewis, lived to see emancipation and founded the independent settlement of Africatown. In 2019, marine archaeologists verified the charred remains of the Clotilda in the muddy Mobile riverbed.'
    ],
    linkedVoyageId: 'sv-006',
    linkedEssayId: 'essay-abolition-illicit'
  }
];

interface StorytellingGalleryProps {
  onSelectVoyage: (voyage: CanonicalVoyage) => void;
  onSelectEssay: (essayId: string) => void;
}

export const StorytellingGallery: React.FC<StorytellingGalleryProps> = ({
  onSelectVoyage,
  onSelectEssay
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const activeStory = STORY_SLIDES[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? STORY_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === STORY_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const handleInspectVoyage = () => {
    const voyage = CANONICAL_VOYAGES.find(v => v.id === activeStory.linkedVoyageId);
    if (voyage) {
      onSelectVoyage(voyage);
    }
  };

  const handleReadMonograph = () => {
    onSelectEssay(activeStory.linkedEssayId);
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm overflow-hidden text-left">
      {/* Editorial Header */}
      <div className="p-6 md:p-8 border-b border-stone-200 dark:border-stone-800 bg-[#F4EFE6]/50 dark:bg-stone-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-stone-500 dark:text-stone-400">
              <Compass className="w-3.5 h-3.5 text-amber-800 dark:text-amber-500" />
              <span>Interactive Storytelling Portal</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-800 dark:text-amber-400 font-mono">Archival Narratives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-1.5">
              The Trans-Atlantic Storytelling Gallery
            </h2>
            <p className="text-xs sm:text-sm font-serif text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
              Traversing historical moments where individual human agency, resistance, and archaeological retrieval connect archival papers directly with quantitative data records.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-stone-500 font-bold">
              0{activeIndex + 1} / 0{STORY_SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Slider Left & Narratives Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-stone-200 dark:border-stone-800">
        {/* Left Interactive Media Card */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between bg-stone-100/50 dark:bg-stone-900/20 relative group border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800 min-h-[300px] md:min-h-[420px]">
          {/* Background image container with smooth overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={activeStory.image} 
              alt={activeStory.title}
              className="w-full h-full object-cover object-center transition-all duration-700 filter saturate-90 brightness-95"
              referrerPolicy="no-referrer"
            />
            {/* Measured Scrim for text overlay - compliant with 4.5:1 contrast ratio */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
          </div>

          {/* Slide metadata (Top overlay) */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-amber-400 bg-black/40 px-3 py-1 rounded-md backdrop-blur-xs">
              {activeStory.era}
            </span>
            <span className="text-[10px] font-sans font-medium text-stone-300 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
              Archive Ref: {activeStory.id.toUpperCase()}
            </span>
          </div>

          {/* Quick slide navigation tags */}
          <div className="relative z-10 flex flex-wrap gap-1.5 overflow-x-auto py-2">
            {STORY_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(idx)}
                className={`px-3 py-1 text-[11px] font-sans transition-all rounded-md cursor-pointer ${
                  idx === activeIndex 
                    ? 'bg-amber-600 text-white font-semibold' 
                    : 'bg-black/60 hover:bg-black/80 text-stone-300 font-medium'
                }`}
              >
                {idx + 1}. {slide.title.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Overlay Text & Quick Quote (Bottom overlay) */}
          <div className="relative z-10 space-y-3 pt-6">
            <p className="text-xs font-mono text-stone-300 uppercase tracking-widest">
              Source: {activeStory.archiveSource}
            </p>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-tight">
              {activeStory.title}
            </h3>
            <div className="flex gap-2 text-stone-200 bg-black/30 p-3 rounded-lg border border-white/10 backdrop-blur-xs">
              <Quote className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-serif italic leading-relaxed text-stone-200">
                "{activeStory.quote}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Editorial Narrative Column */}
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-white dark:bg-stone-900/20">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-stone-500 dark:text-stone-400">
              <FileText className="w-3.5 h-3.5 text-amber-700 dark:text-amber-500" />
              <span>Historical Synthesis & Context</span>
            </div>

            <p className="text-sm font-serif font-semibold text-amber-800 dark:text-amber-400 border-l-2 border-amber-600/60 pl-3 italic">
              {activeStory.summary}
            </p>

            <div className="space-y-3 max-h-[280px] lg:max-h-[340px] overflow-y-auto pr-2 scrollbar-thin text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-serif leading-relaxed">
              {activeStory.narrative.map((para, idx) => (
                <p key={idx} className="first-letter:font-serif">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Inter-linked Platform Connection Controls */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="text-xs font-sans font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Cross-Platform Integration Linked Nodes
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* TAST Database Link */}
              <button
                onClick={handleInspectVoyage}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs font-sans font-bold transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-800 dark:text-amber-400 group-hover:scale-105 transition-transform" />
                  <span>Inspect Database Dossier</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Scholarly Monograph Link */}
              <button
                onClick={handleReadMonograph}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-sans font-bold transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-stone-700 dark:text-stone-300 group-hover:scale-105 transition-transform" />
                  <span>Read Chapter Monograph</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
            
            <p className="text-[10px] text-stone-400 dark:text-stone-500 text-center font-mono mt-2">
              Connected to SlaveVoyages database record {activeStory.linkedVoyageId.toUpperCase()} & Chapter {activeStory.linkedEssayId.replace('essay-', '').toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
