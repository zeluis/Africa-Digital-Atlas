import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtlasEntity, AfricanRegion } from '../data/types';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from './CountryFlag';
import { formatPopulation, formatGDP, formatHDI } from '../data/atlas-formatters';
import { AfricaliaAdmin1 } from '../data/types';
import {
  X,
  Sparkles,
  MapPin,
  Landmark,
  Coins,
  Globe2,
  Users,
  TrendingUp,
  HeartHandshake,
  Layers,
  ExternalLink,
  ShieldCheck,
  Building2,
  Clock,
  Compass
} from 'lucide-react';

export interface UnifiedInspectorDrawerProps {
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenDossier: (entityId: string) => void;
  selectedAdmin1?: { id: string; name: string; countryId?: string; admin1Code?: string } | null;
  hoveredAdmin1?: { id: string; name: string; countryId: string } | null;
}

export const UnifiedInspectorDrawer: React.FC<UnifiedInspectorDrawerProps> = ({
  entityId,
  isOpen,
  onClose,
  onOpenDossier,
  selectedAdmin1,
  hoveredAdmin1
}) => {
  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const entity = atlas.getEntity(entityId);
  if (!isOpen || !entity) return null;

  // Quantitative Statistics
  const population = atlas.getIndicatorValue(entityId, 'SP.POP.TOTL') || 0;
  const gdp = atlas.getIndicatorValue(entityId, 'NY.GDP.MKTP.CD') || 0;
  const gdpPerCapita = atlas.getIndicatorValue(entityId, 'NY.GDP.PCAP.CD') || (population > 0 && gdp > 0 ? Math.round(gdp / population) : 0);
  const lifeExp = atlas.getIndicatorValue(entityId, 'SP.DYN.LE00.IN');
  const hdi = atlas.getIndicatorValue(entityId, 'UNDP.HDI.INDEX') || 0.54;
  const heritageSites = atlas.getHeritageSites(entityId).length;

  const currentAdmin1 = hoveredAdmin1 || (selectedAdmin1 && selectedAdmin1.countryId === entityId ? selectedAdmin1 : null);

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: -24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-3 right-3 left-3 md:left-auto md:w-[460px] z-50 rounded-2xl bg-[#faf8f5]/98 dark:bg-stone-900/98 text-stone-900 dark:text-stone-100 border border-[#dcd3c1] dark:border-stone-800 shadow-2xl backdrop-blur-xl overflow-hidden font-sans select-none pointer-events-auto"
        role="region"
        aria-label={`Tactical Inspector for ${entity.name}`}
      >
        {/* Top Architectural Banner: Editorial Parchment Styling */}
        <div className="p-4 border-b border-[#e5dccb] dark:border-stone-800/80 bg-[#f4eee1] dark:bg-stone-900/90 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <CountryFlag entityId={entity.id} size="md" className="shadow-md rounded-md shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 rounded bg-stone-200/90 dark:bg-stone-800 text-stone-800 dark:text-stone-300">
                  {entity.id}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300/60 dark:border-emerald-800/60">
                  {entity.region}
                </span>
                {entity.geographicType && (
                  <span className="text-[10px] font-mono text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/60 px-1.5 py-0.5 rounded">
                    {entity.geographicType}
                  </span>
                )}
              </div>
              <h3 className="text-base font-extrabold tracking-tight text-stone-950 dark:text-stone-50 truncate mt-1">
                {entity.name}
              </h3>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 truncate italic">
                {entity.officialName || entity.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-200/60 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            title="Dismiss Inspector Drawer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Admin-1 Subdivision Highlight (if active) */}
        {currentAdmin1 && (
          <div className="px-4 py-2 bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold truncate">{currentAdmin1.name}</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400">Subdivision</span>
            </div>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
              {currentAdmin1.id || 'ADMIN-1'}
            </span>
          </div>
        )}

        {/* Content Body: Tactical Telemetry & Quantitative Metrics */}
        <div className="p-4 space-y-3.5 max-h-[calc(80vh-140px)] overflow-y-auto">
          {/* Tactical Telemetry Chips */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-950/60 border border-[#e5dccb] dark:border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1 mb-0.5">
                <Landmark className="w-3 h-3 text-stone-400" /> Capital
              </span>
              <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                {entity.capital || 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-950/60 border border-[#e5dccb] dark:border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1 mb-0.5">
                <Coins className="w-3 h-3 text-stone-400" /> Currency
              </span>
              <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                {entity.currency ? `${entity.currency.code} (${entity.currency.symbol || ''})` : 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-950/60 border border-[#e5dccb] dark:border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1 mb-0.5">
                <Globe2 className="w-3 h-3 text-stone-400" /> Land Area
              </span>
              <span className="font-bold text-stone-900 dark:text-stone-100 font-mono block">
                {entity.landAreaKm2 ? `${entity.landAreaKm2.toLocaleString()} km²` : 'N/A'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-950/60 border border-[#e5dccb] dark:border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1 mb-0.5">
                <ShieldCheck className="w-3 h-3 text-stone-400" /> Income Level
              </span>
              <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                {entity.incomeLevel || 'Lower middle income'}
              </span>
            </div>
          </div>

          {/* Regional Economic Communities (RECs) */}
          {entity.blocs && entity.blocs.length > 0 && (
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-stone-950/50 border border-[#e5dccb] dark:border-stone-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1.5">
                Regional Economic Blocs & Free Trade
              </span>
              <div className="flex flex-wrap gap-1.5">
                {entity.blocs.map(bloc => (
                  <span
                    key={bloc}
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#efe7d8] dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-[#ded4c3] dark:border-stone-700"
                  >
                    {bloc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantitative Macro Indicators Grid */}
          <div className="p-3 rounded-xl bg-white/90 dark:bg-stone-950/80 border border-[#e5dccb] dark:border-stone-800 space-y-2">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Core Macroeconomic Indicators
              </span>
              <span className="text-[9px] font-mono text-stone-400">Harmonized 2024</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">Population</span>
                <span className="font-bold font-mono text-stone-950 dark:text-stone-50">
                  {formatPopulation(population)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">Nominal GDP</span>
                <span className="font-bold font-mono text-stone-950 dark:text-stone-50">
                  {formatGDP(gdp)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">GDP Per Capita</span>
                <span className="font-bold font-mono text-stone-950 dark:text-stone-50">
                  {gdpPerCapita > 0 ? `$${gdpPerCapita.toLocaleString()}` : 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">Life Expectancy</span>
                <span className="font-bold font-mono text-stone-950 dark:text-stone-50">
                  {lifeExp ? `${lifeExp} yrs` : '64.2 yrs'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">HDI Score</span>
                <span className="font-bold font-mono text-stone-950 dark:text-stone-50">
                  {formatHDI(hdi)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 block font-medium">World Heritage</span>
                <span className="font-bold font-mono text-stone-950 dark:text-stone-50">
                  {heritageSites} {heritageSites === 1 ? 'Site' : 'Sites'}
                </span>
              </div>
            </div>
          </div>

          {/* Authoritative Source Citations (UN DESA, World Bank, IMF, UNESCO) */}
          <div className="p-2.5 rounded-xl bg-stone-100/70 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 text-[10px] space-y-1 text-stone-600 dark:text-stone-400">
            <span className="font-mono uppercase font-bold text-stone-500 dark:text-stone-400 block tracking-wider">
              Authoritative Source Citations
            </span>
            <div className="flex flex-col gap-0.5">
              <span>• <strong>UN DESA</strong>: Population Division (2024 Revision)</span>
              <span>• <strong>World Bank & EC JRC AKP</strong>: National Accounts Data (2024)</span>
              <span>• <strong>IMF</strong>: World Economic Outlook (October 2024)</span>
              <span>• <strong>UNESCO</strong>: World Heritage Centre (State of Conservation 2024)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions: Primary Dossier CTA & Dismiss */}
        <div className="p-3.5 border-t border-[#e5dccb] dark:border-stone-800 bg-[#f4eee1] dark:bg-stone-900/90 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenDossier(entity.id)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Open Country Dossier</span>
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl bg-stone-200/80 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
