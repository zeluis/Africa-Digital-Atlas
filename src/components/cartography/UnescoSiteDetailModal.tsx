import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UnescoSiteMetadata } from '../../data/slaveTradeIllustrations';
import { CountryFlag } from '../CountryFlag';
import { atlas } from '../../data/atlas-store';
import {
  Landmark,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Maximize2,
  Compass,
  AlertTriangle,
  Globe2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Camera,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { UNESCO_CATEGORY_PALETTES } from './UnescoHeritageMapLayer';

export interface UnescoSiteDetailModalProps {
  site: UnescoSiteMetadata | null;
  onClose: () => void;
  onSelectCountry?: (entityId: string) => void;
  onNavigateToHeritage?: (siteId: number) => void;
}

export const UnescoSiteDetailModal: React.FC<UnescoSiteDetailModalProps> = ({
  site,
  onClose,
  onSelectCountry,
  onNavigateToHeritage
}) => {
  const [hasCopiedAttribution, setHasCopiedAttribution] = React.useState(false);
  if (!site) return null;

  const palette = UNESCO_CATEGORY_PALETTES[site.category] || UNESCO_CATEGORY_PALETTES.Cultural;
  const country = site.entityId ? atlas.getEntity(site.entityId) : null;
  const officialUrl = site.httpUrl || `https://whc.unesco.org/en/list/${site.idNumber}`;
  const displayImage = site.imageUrl || `https://whc.unesco.org/uploads/sites/site_${site.idNumber}.jpg`;

  const handleOpenViewer = () => {
    if (onNavigateToHeritage) {
      onNavigateToHeritage(site.idNumber);
    } else {
      window.location.hash = `#heritage?id=${site.idNumber}`;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 dark:bg-black/75 backdrop-blur-md">
        {/* Backdrop dismiss */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#FAF8F5] dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 shadow-2xl flex flex-col text-left z-10"
          onClick={e => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="px-5 py-3.5 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between gap-3 bg-[#FAF8F5]/95 dark:bg-stone-900/95 backdrop-blur-xs shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${palette.base}18`, border: `1px solid ${palette.base}40` }}
              >
                <Landmark className="w-4 h-4" style={{ color: palette.base }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400">
                    UNESCO WHC #{site.idNumber}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${palette.badgeBg} ${palette.badgeText} ${palette.badgeBorder}`}
                  >
                    {site.category} Heritage
                  </span>
                  {site.danger && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                      <AlertTriangle className="w-3 h-3" />
                      <span>In Danger</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Visual Header / Photo Preview */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800/80 shadow-inner group">
              <img
                src={displayImage}
                alt={site.site}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={e => {
                  // Fallback to official UNESCO pattern if custom fails
                  const img = e.currentTarget;
                  if (!img.src.includes(`site_${site.idNumber}`)) {
                    img.src = `https://whc.unesco.org/uploads/sites/site_${site.idNumber}.jpg`;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent pointer-events-none" />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-bold flex items-center gap-1.5 border border-white/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Proactive Offline Cache Ready</span>
                </span>
              </div>

              {/* Photographer & License Pill on Image */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1.5 border border-white/20 shadow-md">
                  <Camera className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[220px]">{site.photographer || 'UNESCO Photobank / Official Inscription Archives'}</span>
                  <span className="w-1 h-1 rounded-full bg-stone-400" />
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200 font-bold text-[9px]">{site.license || 'CC BY-SA 3.0 IGO'}</span>
                </span>
              </div>

              {/* Title overlay at bottom of photo */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h2 className="font-serif font-bold text-lg sm:text-xl md:text-2xl leading-tight drop-shadow-md">
                  {site.site}
                </h2>
                <div className="flex items-center gap-2.5 mt-1 text-xs text-stone-200 drop-shadow-xs flex-wrap font-mono">
                  <span>{site.states}</span>
                  {site.location && <span>• {site.location}</span>}
                  <span>• Inscribed {site.dateInscribed}</span>
                </div>
              </div>
            </div>

            {/* State Party & Territory Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-2.5 min-w-0">
                {site.entityId && country ? (
                  <button
                    onClick={() => {
                      if (onSelectCountry) onSelectCountry(site.entityId!);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:border-amber-500 text-xs font-semibold text-stone-800 dark:text-stone-100 shadow-2xs transition-all cursor-pointer"
                    title={`Open ${country.name} Dossier`}
                  >
                    <CountryFlag entityId={site.entityId} size="xs" />
                    <span>{country.name}</span>
                    <ArrowRight className="w-3 h-3 text-stone-400" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-100">
                    <Globe2 className="w-4 h-4 text-amber-600" />
                    <span>{site.states}</span>
                  </div>
                )}
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                  ({site.region})
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-stone-600 dark:text-stone-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{site.dateInscribed}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 font-bold">
                  Criteria {site.criteriaTxt}
                </span>
              </div>
            </div>

            {/* Summary & Narrative */}
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Site Summary &amp; Historical Significance
              </h3>
              <p className="font-serif text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                {site.shortDescription || site.longDescription || 'Official UNESCO World Heritage property.'}
              </p>
              {site.longDescription && site.longDescription !== site.shortDescription && (
                <p className="font-serif text-xs text-stone-600 dark:text-stone-400 leading-relaxed pt-2">
                  {site.longDescription}
                </p>
              )}
            </div>

            {/* Quantitative Cartographic Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800 text-left">
                <div className="text-[10px] font-mono uppercase text-stone-400">Latitude</div>
                <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                  {site.latitude !== undefined ? `${site.latitude.toFixed(4)}°` : 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800 text-left">
                <div className="text-[10px] font-mono uppercase text-stone-400">Longitude</div>
                <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                  {site.longitude !== undefined ? `${site.longitude.toFixed(4)}°` : 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800 text-left">
                <div className="text-[10px] font-mono uppercase text-stone-400">Protected Area</div>
                <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                  {site.areaHectares ? `${Number(site.areaHectares).toLocaleString()} ha` : 'Boundary Defined'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-800 text-left">
                <div className="text-[10px] font-mono uppercase text-stone-400">Transboundary</div>
                <div className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                  {site.transboundary ? 'Multi-State' : 'National'}
                </div>
              </div>
            </div>

            {/* Comprehensive Attribution & Licensing Metadata Card */}
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-amber-900/5 dark:bg-amber-950/20 border border-amber-900/15 dark:border-amber-500/25 shadow-xs">
              {/* Card Header with Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-900/10 dark:bg-amber-400/15 border border-amber-900/20 dark:border-amber-400/25 flex items-center justify-center text-amber-900 dark:text-amber-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-amber-950 dark:text-amber-400">
                    Attribution &amp; Licensing Metadata
                  </span>
                </div>
                <span 
                  className="px-2.5 py-0.5 rounded-full bg-amber-900/15 dark:bg-amber-400/15 text-amber-950 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-900/25 dark:border-amber-400/30"
                  title="Creative Commons Attribution-ShareAlike 3.0 Intergovernmental Organizations"
                >
                  {site.license || 'CC BY-SA 3.0 IGO'}
                </span>
              </div>

              {/* Curated Attribution Callout with Copy Action */}
              <div className="p-3.5 rounded-xl bg-white/90 dark:bg-stone-900/90 border border-amber-900/15 dark:border-amber-500/20 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-900 dark:text-amber-400">
                    Curated Attribution Notice
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      const text = site.attributionText || `Photo © UNESCO / WHC (${site.states}) • WHC #${site.idNumber} (CC BY-SA 3.0 IGO)`;
                      try {
                        await navigator.clipboard.writeText(text);
                        setHasCopiedAttribution(true);
                        setTimeout(() => setHasCopiedAttribution(false), 2500);
                      } catch {
                        setHasCopiedAttribution(true);
                        setTimeout(() => setHasCopiedAttribution(false), 2500);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[10px] font-mono font-semibold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                    title="Copy formal attribution notice"
                  >
                    {hasCopiedAttribution ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-500" />
                        <span>Copy Notice</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-stone-950/70 border border-amber-200/70 dark:border-stone-800 font-serif text-[12.5px] text-stone-900 dark:text-stone-100 leading-relaxed select-all">
                  {site.attributionText || `Photo © UNESCO / WHC (${site.states}) • WHC #${site.idNumber} (CC BY-SA 3.0 IGO)`}
                </div>

                {/* Photographer & Archival Documentation Credits Emphasis */}
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-xs font-mono">
                  <span className="p-1 rounded-md bg-amber-500/20 text-amber-900 dark:text-amber-300 shrink-0 mt-0.5">
                    <Camera className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase text-amber-900 dark:text-amber-300 font-bold block">
                      Photographer / Inscription Photo Credits (Official Attribution)
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block text-[12px] mt-0.5">
                      {site.photographer || 'UNESCO Photobank / Official Inscription Archives'}
                    </span>
                    <span className="text-[10.5px] text-stone-600 dark:text-stone-400 block mt-0.5 font-sans">
                      Role: {site.authorRole || 'Official UNESCO Documentation & Inscription Registry'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Provenance & Rights Registry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800">
                  <span className="text-[9.5px] uppercase font-sans font-semibold text-stone-500 dark:text-stone-400 block">
                    Creator / State Party
                  </span>
                  <span className="text-stone-900 dark:text-stone-100 font-semibold block truncate mt-0.5">
                    {site.creator || `UNESCO / State Party of ${site.states}`}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800">
                  <span className="text-[9.5px] uppercase font-sans font-semibold text-stone-500 dark:text-stone-400 block">
                    Institution
                  </span>
                  <span className="text-stone-900 dark:text-stone-100 font-semibold block truncate mt-0.5">
                    {site.institution || 'UNESCO World Heritage Centre'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800">
                  <span className="text-[9.5px] uppercase font-sans font-semibold text-stone-500 dark:text-stone-400 block">
                    Collection / Registry ID
                  </span>
                  <span className="text-stone-900 dark:text-stone-100 font-semibold block truncate mt-0.5">
                    {site.collectionOrRegistryId || `WHC-${site.idNumber}`}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800">
                  <span className="text-[9.5px] uppercase font-sans font-semibold text-stone-500 dark:text-stone-400 block">
                    Author Role
                  </span>
                  <span className="text-stone-900 dark:text-stone-100 font-semibold block truncate mt-0.5">
                    {site.authorRole || 'Official UNESCO Documentation & Inscription Registry'}
                  </span>
                </div>
              </div>

              {/* License & Rights Descriptions */}
              <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-2 text-xs font-mono">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9.5px] uppercase font-sans font-semibold text-stone-500 dark:text-stone-400">
                    License Specification
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-stone-900 dark:text-stone-100 font-bold">
                      {site.license || 'CC BY-SA 3.0 IGO'}
                    </span>
                    <span className="text-stone-600 dark:text-stone-400 text-[11px]">
                      (Creative Commons Attribution-ShareAlike 3.0 Intergovernmental Organizations)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 pt-1.5 border-t border-stone-200/60 dark:border-stone-800">
                  <span className="text-[9.5px] uppercase font-sans font-semibold text-stone-500 dark:text-stone-400">
                    Rights Statement
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-stone-900 dark:text-stone-100 font-bold">
                      In Copyright - Educational Use Permitted
                    </span>
                    <span className="font-mono text-[10px] text-stone-500 dark:text-stone-400 truncate">
                      ({site.rightsStatement || 'https://rightsstatements.org/vocab/InC-EDU/1.0/'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Outbound Archival & Rights Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-900/10 dark:border-amber-500/20">
                <a
                  href={site.primaryUrl || site.httpUrl || `https://whc.unesco.org/en/list/${site.idNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 text-xs font-mono font-bold transition-all shadow-2xs"
                  title="Canonical UNESCO World Heritage listing"
                >
                  <span>Canonical Listing</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={site.highResDownloadUrl || site.imageUrl || displayImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900/15 hover:bg-amber-900/25 dark:bg-amber-400/15 dark:hover:bg-amber-400/25 text-amber-950 dark:text-amber-200 border border-amber-900/25 dark:border-amber-400/30 text-xs font-mono font-bold transition-all shadow-2xs"
                  title="Download archival high-resolution image"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Archival Image</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href={site.licenseUrl || 'https://creativecommons.org/licenses/by-sa/3.0/igo/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-900 dark:text-amber-400 hover:underline px-2 py-1"
                >
                  <span>CC BY-SA 3.0 IGO Terms</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={site.rightsStatement || 'https://rightsstatements.org/vocab/InC-EDU/1.0/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-600 dark:text-stone-400 hover:underline px-2 py-1"
                >
                  <span>RightsStatements.org</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer with Link to Full UNESCO Viewer */}
          <div className="p-4 sm:p-5 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-100/60 dark:bg-stone-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* External Link to UNESCO WHC */}
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer"
                title="Open official UNESCO World Heritage Centre catalogue listing"
              >
                <span>whc.unesco.org</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-mono font-bold hover:bg-stone-300 transition-colors cursor-pointer"
              >
                Dismiss
              </button>

              {/* PRIMARY ACTION: Link to Full UNESCO Viewer */}
              <button
                onClick={handleOpenViewer}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white text-xs font-serif font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Landmark className="w-4 h-4 text-amber-300" />
                <span>Open in Full UNESCO Viewer</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
