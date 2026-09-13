import React, { useState } from 'react';
import { 
  Anchor, 
  Landmark, 
  Dna, 
  BookOpen, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Scale, 
  Globe2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import { 
  getCountryHistoricalDevelopmentDossier, 
  CountryHistoricalDevelopmentDossier 
} from '../../data/countryHistoricalDevelopmentData';

interface RichEditorialCountryDevelopmentPanelProps {
  countryName: string;
  countryCode?: string;
  regionName?: string;
  tastVolumeShare?: number;
  onNavigateToMolecular?: () => void;
  onNavigateToFoundations?: () => void;
  onSelectReport?: (reportId: string) => void;
  compact?: boolean;
}

export const RichEditorialCountryDevelopmentPanel: React.FC<RichEditorialCountryDevelopmentPanelProps> = ({
  countryName,
  countryCode,
  regionName,
  tastVolumeShare,
  onNavigateToMolecular,
  onNavigateToFoundations,
  onSelectReport,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);
  const [showAllWiki, setShowAllWiki] = useState<boolean>(false);

  const dossier: CountryHistoricalDevelopmentDossier = getCountryHistoricalDevelopmentDossier(
    countryName || 'Nigeria',
    regionName
  );

  const handleOpenMolecular = () => {
    if (onNavigateToMolecular) {
      onNavigateToMolecular();
    } else if (onSelectReport) {
      onSelectReport('molecular-legacies');
    }
  };

  const handleOpenFoundations = () => {
    if (onNavigateToFoundations) {
      onNavigateToFoundations();
    } else if (onSelectReport) {
      onSelectReport('african-development-foundations');
    }
  };

  return (
    <section 
      aria-label={`Historical Development & TAST Legacies: ${dossier.countryName}`}
      className="rounded-2xl bg-[#F7F2E8]/90 dark:bg-[#1E1915]/90 border border-[#E5DDD0] dark:border-[#3D342C] p-3.5 sm:p-4 space-y-3.5 shadow-xs transition-colors"
    >
      {/* 1. Header Section */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#E67E48]/15 text-[#B8571A] dark:text-[#FFA573] border border-[#E67E48]/30">
              HISTORICAL FOUNDATIONS & TAST
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              {dossier.countryCode}
            </span>
          </div>
          <h4 className="text-sm sm:text-base font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6] leading-tight">
            Transatlantic Extraction & Sovereign Foundations
          </h4>
        </div>

        {compact && (
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1 rounded-lg text-[#7D6B5A] hover:text-[#2B241E] dark:hover:text-[#F5EFE6] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            title={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* 2. Key Indicative Pills Grid (Tonal, Colorful, No heavy borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* TAST Extraction Zone */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
          <Anchor className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              TAST Region & Ports
            </span>
            <p className="text-[11px] font-semibold text-[#2B241E] dark:text-[#F5EFE6] truncate" title={dossier.historicalTastRegion}>
              {dossier.historicalTastRegion}
            </p>
            <p className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492] truncate mt-0.5" title={dossier.portsOfEmbarkation.join(', ')}>
              Ports: {dossier.portsOfEmbarkation.slice(0, 3).join(', ')}
              {dossier.portsOfEmbarkation.length > 3 ? ` +${dossier.portsOfEmbarkation.length - 3}` : ''}
            </p>
          </div>
        </div>

        {/* Colonial Power & Monopoly Regime */}
        <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/10 border border-purple-500/20 flex items-start gap-2">
          <Landmark className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
              Colonial Power & Partition
            </span>
            <p className="text-[11px] font-semibold text-[#2B241E] dark:text-[#F5EFE6] truncate" title={dossier.colonialPower}>
              {dossier.colonialPower.split('(')[0].trim()}
            </p>
            <p className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492] truncate mt-0.5">
              {dossier.tastVolumeEstimate.split('(')[0].trim()}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Authoritative Editorial Lead Paragraph */}
      {isExpanded && (
        <div className="space-y-3 pt-1">
          <div className="p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-[#E5DDD0]/70 dark:border-[#38322B]/70 shadow-2xs">
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#2B241E] dark:text-[#F0EAE1] font-normal">
              {dossier.editorialLead}
            </p>
          </div>

          {/* Epochal Progression: Pre-Colonial -> Extraction -> Modern Legacy */}
          <div className="space-y-1.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#E5DDD0]/50 dark:border-[#38322B]/50 text-[11px]">
            <div className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
              <p className="text-[#52463B] dark:text-[#C4B7A6]">
                <strong className="text-[#2B241E] dark:text-[#F5EFE6]">Pre-Colonial Foundation:</strong>{' '}
                {dossier.foundationsSummary.preColonialEpoch}
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E67E48] shrink-0 mt-1.5" />
              <p className="text-[#52463B] dark:text-[#C4B7A6]">
                <strong className="text-[#2B241E] dark:text-[#F5EFE6]">Extractive Mechanism:</strong>{' '}
                {dossier.foundationsSummary.colonialExtractionMethod}
              </p>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
              <p className="text-[#52463B] dark:text-[#C4B7A6]">
                <strong className="text-[#2B241E] dark:text-[#F5EFE6]">Modern Trajectory:</strong>{' '}
                {dossier.foundationsSummary.modernInstitutionalLegacy}
              </p>
            </div>
          </div>

          {/* 4. Action Direct Report Links (Molecular & Foundations) */}
          <div className="space-y-2 pt-1 border-t border-[#E5DDD0]/60 dark:border-[#38322B]/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7D6B5A] dark:text-[#B5A492]">
              Investigative Research & Data Monographs
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Molecular Report Link */}
              <button
                type="button"
                onClick={handleOpenMolecular}
                className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/30 text-left transition-all cursor-pointer group flex items-center justify-between active:scale-98"
                title="Open Molecular & Genetic Ancestry Report"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-700 dark:text-indigo-300 grid place-items-center shrink-0">
                    <Dna className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold text-indigo-900 dark:text-indigo-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate">
                      Molecular Report
                    </span>
                    <span className="block text-[9px] text-[#7D6B5A] dark:text-[#A79888] truncate">
                      Genetic Lineages & Diaspora
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Foundations Report Link */}
              <button
                type="button"
                onClick={handleOpenFoundations}
                className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-left transition-all cursor-pointer group flex items-center justify-between active:scale-98"
                title="Open African Development Master Foundations Report"
              >
                <div className="flex items-center gap-2 min-w-0 pr-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 grid place-items-center shrink-0">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold text-emerald-900 dark:text-emerald-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors truncate">
                      Foundations Report
                    </span>
                    <span className="block text-[9px] text-[#7D6B5A] dark:text-[#A79888] truncate">
                      Colonial Roots & Institution
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* 5. Wikipedia Historical Cross-References */}
          {dossier.wikiArticles.length > 0 && (
            <div className="space-y-1.5 pt-1 border-t border-[#E5DDD0]/50 dark:border-[#38322B]/50">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D6B5A] dark:text-[#B5A492] flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#E67E48]" />
                  Archival Encyclopedic References
                </span>
                {dossier.wikiArticles.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setShowAllWiki(prev => !prev)}
                    className="text-[9px] font-semibold text-[#E67E48] hover:underline cursor-pointer"
                  >
                    {showAllWiki ? 'Show Less' : `+${dossier.wikiArticles.length - 2} More`}
                  </button>
                )}
              </div>
              <div className="space-y-1">
                {(showAllWiki ? dossier.wikiArticles : dossier.wikiArticles.slice(0, 2)).map((art) => (
                  <a
                    key={art.title}
                    href={art.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-[#E67E48]/10 hover:border-[#E67E48]/30 border border-transparent transition-all group text-[11px]"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold text-[#2B241E] dark:text-[#F5EFE6] group-hover:text-[#B8571A] dark:group-hover:text-[#FFA573] truncate block">
                        {art.title}
                      </span>
                      {art.description && (
                        <span className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492] truncate block">
                          {art.description}
                        </span>
                      )}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#7D6B5A] group-hover:text-[#E67E48] shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
