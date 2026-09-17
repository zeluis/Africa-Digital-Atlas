import React from 'react';
import { Icon } from '@iconify/react';
import { 
  Globe, 
  ShieldCheck, 
  ExternalLink, 
  Database, 
  BookOpen, 
  Layers, 
  Sparkles,
  Heart,
  Compass,
  Globe2,
  Map as MapIcon,
  Languages,
  Landmark,
  BarChart3
} from 'lucide-react';
import { CanonicalNavTab } from './NavigationDrawer';
import { atlas } from '../data/atlas-store';
import { OrganizationLogo } from './OrganizationLogo';
import { AfricaUnLogo } from './AfricaUnLogo';

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
              <div 
                className="relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 shrink-0"
                onClick={() => onNavigateTab('overview')}
                title="Africalia Continental Atlas - Return to Primary Overview"
              >
                <AfricaUnLogo 
                  size={46} 
                  interactive={false} 
                  variant="warm-tonal" 
                  fillOpacity={0.6}
                  className="shrink-0 drop-shadow-[0_2px_8px_rgba(217,119,6,0.2)]"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span 
                  style={{ fontFamily: '"Noto Serif Display", Georgia, Cambria, "Times New Roman", serif' }}
                  className="font-extrabold text-xl tracking-tight text-amber-900 dark:text-amber-400 leading-tight"
                >
                  Africalia
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-extrabold text-[11px] uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-mono">
                    AFRICA DIGITAL ATLAS
                  </span>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700/60 px-1.5 py-[1px] text-[9px] font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    v{manifest.atlasVersion}
                  </span>
                </div>
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
            <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              <Icon icon="game-icons:africa" className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>AFRICA</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('overview')}
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <Compass className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('explore')}
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <Globe2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Explore Countries</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('regions')}
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Regions & Geoschemes</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('map')}
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <MapIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Continental Cartography</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Group 2: RESEARCH */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>RESEARCH</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigateTab('languages')}
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <Languages className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>African Languages</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('heritage')}
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <Landmark className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>World Heritage (UNESCO)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('analytics')}
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Indicator Engine</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('provenance')}
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Methodology & Audit</span>
                </button>
              </li>
              <li>
                <a
                  href="./docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded text-zinc-600 dark:text-zinc-400"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>Docs & Guides</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Group 3: DATA CITATIONS */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>DATA SOURCES</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
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
              <a
                href="./docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('provenance')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Data Pipeline
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigateTab('privacy')}
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
