import React from 'react';
import { 
  Globe, 
  ShieldCheck, 
  ExternalLink, 
  Database, 
  BookOpen, 
  Layers, 
  Sparkles,
  Heart
} from 'lucide-react';
import { CanonicalNavTab } from './NavigationDrawer';
import { atlas } from '../data/atlas-store';
import { OrganizationLogo } from './OrganizationLogo';

interface FooterProps {
  onNavigateTab: (tab: CanonicalNavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const manifest = atlas.getManifest();

  return (
    <footer 
      role="contentinfo"
      aria-label="Africa Data Atlas Credibility Layer and Documentation"
      className="mt-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main 4-Column Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Overview Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-zinc-950 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                  AFRICA DATA ATLAS
                </span>
                <span className="ml-2 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700/60 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  v{manifest.atlasVersion}
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              Authoritative Pan-African Socio-Economic Platform. Unified geospatial intelligence, multi-temporal indicators, and cultural taxonomy across 54 sovereign nations.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Open Data License • CC-BY-4.0</span>
            </div>
          </div>

          {/* Group 1: AFRICA */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              AFRICA
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('overview')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('explore')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  Explore Countries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('regions')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  Regions & Geoschemes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('map')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  Continental Cartography
                </button>
              </li>
            </ul>
          </div>

          {/* Group 2: RESEARCH */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              RESEARCH
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('languages')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  African Languages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('heritage')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  World Heritage (UNESCO)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('analytics')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  Indicator Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('provenance')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                >
                  Methodology & Audit
                </button>
              </li>
            </ul>
          </div>

          {/* Group 3: DATA CITATIONS */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              DATA SOURCES
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <OrganizationLogo org="WB" size={16} />
                <span>World Bank Data API</span>
              </li>
              <li className="flex items-center gap-2">
                <OrganizationLogo org="IMF" size={16} />
                <span>IMF World Economic Outlook</span>
              </li>
              <li className="flex items-center gap-2">
                <OrganizationLogo org="UN" size={16} />
                <span>UN DESA Population Division</span>
              </li>
              <li className="flex items-center gap-2">
                <OrganizationLogo org="UNESCO" size={16} />
                <span>UNESCO World Heritage</span>
              </li>
              <li className="flex items-center gap-2">
                <OrganizationLogo org="UN_COMTRADE" size={16} />
                <span>UN Comtrade & M49 Standard</span>
              </li>
              <li className="flex items-center gap-2">
                <OrganizationLogo org="AU" size={16} />
                <span>African Union & AfCFTA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Credibility & Institutional Neutrality Notice */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800/80 space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            <p>
              <strong className="text-zinc-700 dark:text-zinc-300">Independence & Citation Disclaimer:</strong> The Africa Data Atlas is an independent, open-access statistical cartography initiative. All international agency names, trademarks, and dataset series identifiers (e.g., World Bank, IMF, UN DESA, UNDP, UNESCO, REST Countries) are cited strictly for mathematical provenance, attribution, and scholarly verification. No official institutional endorsement or direct sponsorship is implied.
            </p>
          </div>

          {/* Author Credits & Copyright Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span>Curated by African Geospatial Researchers & Open Data Contributors</span>
              <span>•</span>
              <span>Published {new Date().getFullYear()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('provenance')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Data Pipeline
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('overview')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Privacy & License
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
