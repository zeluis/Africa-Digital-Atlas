import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  ExternalLink, 
  MapPin, 
  Languages, 
  Users, 
  Flame, 
  X, 
  Compass, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { WikipediaEthnicEntry } from '../../data/wikipediaEthnicAtlas';
import { getEthnicDossier, parseLanguageChain } from '../../services/wikipediaService';

interface WikipediaEthnicDossierProps {
  ethnicName: string;
  countryName?: string;
  regionName?: string;
  tastVolumeShare?: number;
  cohortLabel?: string;
  cohortColor?: string;
  onClose: () => void;
  onFocusCoordinates?: () => void;
  onSelectLinguisticFamily?: (family: string) => void;
}

export const WikipediaEthnicDossier: React.FC<WikipediaEthnicDossierProps> = ({
  ethnicName,
  countryName,
  regionName,
  tastVolumeShare,
  cohortLabel,
  cohortColor,
  onClose,
  onFocusCoordinates,
  onSelectLinguisticFamily
}) => {
  const [dossier, setDossier] = useState<WikipediaEthnicEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setImageFailed(false);

    getEthnicDossier(ethnicName).then((data) => {
      if (isMounted) {
        setDossier(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [ethnicName]);

  const languageChain = dossier ? parseLanguageChain(dossier.languages) : [];

  return (
    <motion.aside 
      initial={{ opacity: 0, x: 28, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.98 }}
      transition={{ type: "spring", damping: 27, stiffness: 330 }}
      className="absolute top-4 right-4 z-30 w-80 sm:w-96 max-h-[calc(100vh-32px)] flex flex-col rounded-3xl bg-[#FAF7F2]/95 dark:bg-[#1E1B18]/95 border border-[#E5DDD0] dark:border-[#38322B] shadow-[0_16px_50px_rgba(75,55,35,0.18)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden no-drag"
      id="wikipedia-ethnic-dossier"
      aria-label={`Encyclopedic dossier for ${ethnicName}`}
    >
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5DDD0] dark:border-[#38322B] bg-[#F4EDE2]/50 dark:bg-[#161412]/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#E67E48]/15 border border-[#E67E48]/30 text-[#B8571A] dark:text-[#FFA573] grid place-items-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-[#2B241E] dark:text-[#F5EFE6] leading-tight">
                Wikipedia Cultural Dossier
              </h2>
              <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-semibold rounded-full bg-[#1A73E8]/15 text-[#1A73E8] dark:text-[#8AB4F8] border border-[#1A73E8]/30">
                <ShieldCheck className="w-2.5 h-2.5 mr-0.5" />
                Verified
              </span>
            </div>
            <p className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492]">
              Archival Ethno-Historical Monograph
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#7D6B5A] hover:text-[#2B241E] dark:hover:text-[#F5EFE6] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close dossier"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Visual Hero Image Banner (if available from Wikipedia) */}
        {dossier?.thumbnail && !imageFailed ? (
          <div className="relative w-full rounded-2xl overflow-hidden border border-[#E5DDD0] dark:border-[#38322B] shadow-inner bg-black/10">
            <img 
              src={dossier.thumbnail} 
              alt={dossier.name}
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              className="w-full h-auto block object-contain"
              style={{ height: 'auto', maxHeight: 'none' }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 via-40% to-transparent pt-16 pb-3 px-3 text-white pointer-events-none">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-serif font-bold tracking-wide drop-shadow-sm">
                  {dossier.canonicalTitle || dossier.article || `${ethnicName} people`}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-white/90">
                  <span className="font-mono bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    Tree Node: {ethnicName}
                  </span>
                  {countryName && <span>• {countryName}</span>}
                </div>
              </div>
              <p className="text-[10px] opacity-90 truncate mt-1">
                {dossier.description || `Historic lineage rooted in ${countryName || 'Africa'}`}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-full p-4 rounded-2xl border border-[#E67E48]/30 bg-gradient-to-br from-[#E67E48]/10 to-[#BF4342]/10 dark:from-[#E67E48]/15 dark:to-[#BF4342]/15">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-[#E67E48] font-bold">
                  SOVEREIGN ETHNIC LINEAGE
                </span>
                <h3 className="text-lg font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6] mt-0.5">
                  {dossier?.canonicalTitle || dossier?.article || `${ethnicName} people`}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-[#7D6B5A] dark:text-[#B5A492]">
                  <span className="font-mono bg-[#E67E48]/15 text-[#B8571A] dark:text-[#FFA573] px-2 py-0.5 rounded-md text-[10px] font-semibold">
                    Tree Node: {ethnicName}
                  </span>
                  {(countryName || regionName) && (
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#E67E48]" />
                      <span>{countryName ? `${countryName}` : ''}{regionName ? ` (${regionName})` : ''}</span>
                    </span>
                  )}
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-[#E67E48]/60 shrink-0" />
            </div>
          </div>
        )}

        {/* Slave Voyages (TAST) Quantitative Context Banner */}
        {(tastVolumeShare !== undefined || cohortLabel) && (
          <div className="p-3 rounded-2xl bg-[#F4EDE2]/80 dark:bg-[#161412]/80 border border-[#E5DDD0] dark:border-[#38322B]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#BF4342]" />
                <span className="font-semibold text-[11px] text-[#2B241E] dark:text-[#F5EFE6]">
                  Trans-Atlantic Slave Trade (TAST) Cohort
                </span>
              </div>
              {tastVolumeShare !== undefined && (
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: cohortColor || '#049B4D' }}
                >
                  {tastVolumeShare.toFixed(1)}% Volume
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-[#7D6B5A] dark:text-[#B5A492] leading-relaxed">
              {cohortLabel 
                ? `Mapped within the sovereign embarkation corridor: ${cohortLabel}.`
                : `Documented demographic departure records cross-referenced in the Du Bois / Emory Trans-Atlantic Slave Trade (TAST) archives.`
              }
            </p>
          </div>
        )}

        {/* Encyclopedic Summary Lead */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#7D6B5A] dark:text-[#B5A492]">
              ENCYCLOPEDIC SUMMARY
            </span>
            {dossier?.url && (
              <a
                href={dossier.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[#E67E48] hover:underline flex items-center gap-1 shrink-0 font-medium"
              >
                <span>en.wikipedia.org</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-black/25 border border-[#E5DDD0]/80 dark:border-[#38322B]/80 shadow-xs space-y-2">
            {/* Prominent Canonical Wikipedia Title */}
            <div className="flex items-baseline justify-between gap-2 border-b border-[#E5DDD0]/50 dark:border-[#38322B]/50 pb-1.5">
              <h4 className="text-sm font-serif font-bold text-[#2B241E] dark:text-[#F5EFE6]">
                {dossier?.canonicalTitle || dossier?.article || `${ethnicName} people`}
              </h4>
              <span className="text-[10px] text-[#7D6B5A] dark:text-[#B5A492] font-mono">
                Wikipedia Article
              </span>
            </div>

            {isLoading ? (
              <div 
                id="wikipedia-summary-skeleton"
                className="space-y-2.5 py-1 min-h-[96px] flex flex-col justify-center"
                aria-label="Loading summary paragraph"
                role="status"
              >
                <div className="h-3 bg-[#E5DDD0]/80 dark:bg-[#38322B]/80 rounded-md w-full animate-pulse" />
                <div className="h-3 bg-[#E5DDD0]/70 dark:bg-[#38322B]/70 rounded-md w-[95%] animate-pulse" />
                <div className="h-3 bg-[#E5DDD0]/60 dark:bg-[#38322B]/60 rounded-md w-[88%] animate-pulse" />
                <div className="h-3 bg-[#E5DDD0]/50 dark:bg-[#38322B]/50 rounded-md w-[60%] animate-pulse" />
              </div>
            ) : (
              <p 
                id="wikipedia-summary-paragraph"
                className="text-[#2B241E] dark:text-[#E8DFD5] leading-relaxed text-[13px] font-sans antialiased min-h-[96px]"
              >
                {dossier?.extract || 
                  `The ${dossier?.canonicalTitle || `${ethnicName} people`} are an indigenous African population with extensive documented cultural, linguistic, and historical presence in ${countryName || 'Africa'}.`
                }
              </p>
            )}
          </div>
        </div>

        {/* Linguistic Family Lineage */}
        {languageChain.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono text-[#7D6B5A] dark:text-[#B5A492]">
              <Languages className="w-3.5 h-3.5 text-[#E67E48]" />
              <span>LINGUISTIC LINEAGE PHYLUM</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-[#E5DDD0]/60 dark:border-[#38322B]/60">
              {languageChain.map((lang, idx) => (
                <React.Fragment key={idx}>
                  <button
                    type="button"
                    onClick={() => onSelectLinguisticFamily?.(lang)}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#E67E48]/10 dark:bg-[#E67E48]/20 text-[#B8571A] dark:text-[#FFA573] hover:bg-[#E67E48]/25 transition-colors cursor-pointer"
                    title={`Filter by linguistic phylum: ${lang}`}
                  >
                    {lang}
                  </button>
                  {idx < languageChain.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-[#A89887] dark:text-[#6E6255]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Primary Homeland & Territorial Distribution */}
        {dossier?.homeland && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono text-[#7D6B5A] dark:text-[#B5A492]">
              <MapPin className="w-3.5 h-3.5 text-[#049B4D]" />
              <span>PRIMARY HOMELAND & TERRITORIES</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-[#E5DDD0]/60 dark:border-[#38322B]/60 text-[11px] text-[#3E342B] dark:text-[#E2D8CC] leading-normal">
              {dossier.homeland}
            </div>
          </div>
        )}

        {/* Subgroups, Tribes & Clans */}
        {dossier?.subgroups && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono text-[#7D6B5A] dark:text-[#B5A492]">
              <Users className="w-3.5 h-3.5 text-[#486834]" />
              <span>SUBGROUPS, TRIBES & CASTES</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-[#E5DDD0]/60 dark:border-[#38322B]/60 text-[11px] text-[#3E342B] dark:text-[#E2D8CC] leading-normal max-h-24 overflow-y-auto">
              {dossier.subgroups}
            </div>
          </div>
        )}

        {/* Religious Traditions & Cosmologies */}
        {dossier?.religion && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider font-mono text-[#7D6B5A] dark:text-[#B5A492]">
              <Sparkles className="w-3.5 h-3.5 text-[#B8571A]" />
              <span>RELIGIOUS & COSMOLOGICAL TRADITIONS</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/40 dark:bg-black/20 border border-[#E5DDD0]/60 dark:border-[#38322B]/60 text-[11px] text-[#3E342B] dark:text-[#E2D8CC] leading-normal">
              {dossier.religion}
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Action Footer */}
      <div className="p-3 border-t border-[#E5DDD0] dark:border-[#38322B] bg-[#F4EDE2]/50 dark:bg-[#161412]/50 flex items-center gap-2">
        {onFocusCoordinates && (
          <button
            type="button"
            onClick={onFocusCoordinates}
            className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-[#2B241E] dark:text-[#F5EFE6] transition-all cursor-pointer"
            title="Center tree camera on this ethnic branch"
          >
            <Compass className="w-3.5 h-3.5 text-[#E67E48]" />
            <span>Focus Node</span>
          </button>
        )}

        {dossier?.url && (
          <a
            href={dossier.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-[#E67E48] hover:bg-[#D66F3A] text-white shadow-sm transition-all cursor-pointer"
          >
            <span>Wikipedia Monograph</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.aside>
  );
};
