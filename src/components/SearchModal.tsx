import React, { useState, useEffect, useRef, useMemo } from 'react';
import MiniSearch from 'minisearch';
import { atlas } from '../data/atlas-store';
import { AtlasEntity, IndicatorDefinition, HeritageSite } from '../data/types';
import {
  SLAVE_TRADE_ILLUSTRATIONS,
  SlaveTradeIllustration,
  ensureSlaveTradeIllustrationsHydrated,
  subscribeSlaveTradeIllustrations
} from '../data/slaveTradeIllustrations';
import { CASTAS_ARCHIVE_ITEMS, CastasArchivalItem } from '../data/castasArchive';
import { ResearchReport } from '../data/reportsData';
import { getAllReports } from '../data/reportsDataLoader';
import { CountryFlag } from './CountryFlag';
import { useSavedEntities } from '../contexts/SavedEntitiesContext';
import { AtlasDialog } from './common/AtlasDialog';
import { normalizeSearchText, tokenizeSearchText } from '../utils/textNormalize';
import {
  PRE_COLONIAL_ENTITIES,
  PreColonialEntity
} from '../data/archivalCartographyData';
import {
  DETAILED_KINGDOMS_DATA,
  KingdomDetailedRecord,
  ensureDetailedKingdomsLoaded,
  subscribeDetailedKingdoms
} from '../data/preColonialKingdomsDetailed';
import {
  INITIAL_UNESCO_HERITAGE_SITES,
  ISO2_TO_ISO3_MAP,
  ensureUnescoHeritageSitesLoaded,
  subscribeUnescoHeritageSites
} from '../data/unescoHeritageRegistry';
import {
  AFRICAN_MOTHER_TONGUES,
  MotherTongueEntry
} from '../data/motherTonguesAudioData';
import {
  WORKING_PAPERS_SERIES,
  WorkingPaperEntry
} from '../data/methodologyDossierData';
import { atlasModalStore } from '../stores/useAtlasModalStore';
import { 
  Search, 
  Globe, 
  Landmark, 
  TrendingUp, 
  X, 
  ArrowRight, 
  CornerDownLeft,
  Clock,
  Star,
  Layers,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Sliders,
  Palette,
  Crown,
  Volume2
} from 'lucide-react';
import { DynamicIcon } from './DynamicIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry: (entityId: string) => void;
  onSelectIndicator: (indicatorId: string) => void;
  onSelectTab?: (tab: string) => void;
  onToggleTheme?: () => void;
}

export interface AppCommandItem {
  id: string;
  title: string;
  subtitle: string;
  tab: string;
  action?: 'toggleTheme' | 'openAfcfta' | 'openAcademicExport' | 'openDoiVerification';
  iconName: string;
  category: string;
  shortcut?: string;
  keywords: string[];
}

export const APP_COMMAND_REGISTRY: AppCommandItem[] = [
  { id: 'cmd-overview', title: 'Executive Overview', subtitle: 'Continental dashboard, macro indicators & UN M49 geoscheme', tab: 'overview', iconName: 'Globe', category: 'Views', shortcut: 'G O', keywords: ['overview', 'dashboard', 'home', 'africa', 'un', 'geoscheme'] },
  { id: 'cmd-explore', title: '54 Sovereign Nations Directory', subtitle: 'Card directory, sorting by GDP, population, land area & HDI', tab: 'explore', iconName: 'Layers', category: 'Views', shortcut: 'G E', keywords: ['explore', 'countries', 'nations', 'sovereign', 'states', 'directory'] },
  { id: 'cmd-map', title: 'Vector Cartography Map', subtitle: '5,796 × 5,867 authentic canvas, 1,017 Admin-1 boundaries & graticules', tab: 'map', iconName: 'Compass', category: 'Views', shortcut: 'G M', keywords: ['map', 'cartography', 'admin1', 'provinces', 'gis', 'boundaries', 'graticule'] },
  { id: 'cmd-compare', title: 'Bilateral Nation Benchmark', subtitle: 'Side-by-side KPI comparison & convergence trajectories', tab: 'compare', iconName: 'Sliders', category: 'Analytics', shortcut: 'G C', keywords: ['compare', 'benchmark', 'bilateral', 'side-by-side', 'convergence'] },
  { id: 'cmd-analytics', title: 'Research Analytics & Regression', subtitle: 'Bivariate scatter matrix, Pearson r, R² variance & time-series', tab: 'analytics', iconName: 'TrendingUp', category: 'Analytics', shortcut: 'G A', keywords: ['analytics', 'regression', 'scatter', 'correlation', 'pearson', 'chart', 'trend'] },
  { id: 'cmd-pillars', title: '8 Thematic Pillars Radar', subtitle: 'Strategic development pillars, radar index & macro drivers', tab: 'pillars', iconName: 'Sparkles', category: 'Analytics', shortcut: 'G P', keywords: ['pillars', 'radar', 'economy', 'infrastructure', 'governance', 'climate'] },
  { id: 'cmd-languages', title: 'Living Languages & Mother Tongues', subtitle: '2,000+ living languages across 6 phyla & audio player', tab: 'languages', iconName: 'BookOpen', category: 'Culture', shortcut: 'G L', keywords: ['languages', 'tongues', 'swahili', 'hausa', 'bantu', 'audio', 'phonemes'] },
  { id: 'cmd-heritage', title: 'UNESCO World Heritage Sites', subtitle: '104 Africa & Arab States cultural, natural, mixed and in-danger monuments', tab: 'heritage', iconName: 'Landmark', category: 'Culture', shortcut: 'G H', keywords: ['heritage', 'unesco', 'monuments', 'cultural', 'natural', 'danger'] },
  { id: 'cmd-ethnic-tree', title: 'Ancestral Tree of Life', subtitle: 'Phylogenetic cladogram, haplogroups L0–L3 and 310+ ethnic lineages', tab: 'ethnic-tree', iconName: 'Sparkles', category: 'Genomics', shortcut: 'G T', keywords: ['tree', 'ethnic', 'cladogram', 'haplogroups', 'ancestry', 'phylogeny'] },
  { id: 'cmd-slave-trade', title: 'Middle Passage & 47 Embarkation Ports', subtitle: 'Geodesic flows, 36,108 voyage records & coastal enclaves', tab: 'slave-trade', iconName: 'Clock', category: 'History', shortcut: 'G S', keywords: ['slave-trade', 'voyages', 'middle passage', 'ports', 'routes', 'enslaved'] },
  { id: 'cmd-iconography', title: 'Digital Iconography & Castas Archive', subtitle: '1,252 archival plates, Brookes 1788 plan & colonial paintings', tab: 'iconography', iconName: 'Palette', category: 'History', shortcut: 'G I', keywords: ['iconography', 'castas', 'plates', 'archives', 'brookes', 'prints'] },
  { id: 'cmd-archival-cartography', title: 'Archival Cartography & Currents', subtitle: 'Antique plate curtain viewer (1688–1851) & 60fps ocean drift', tab: 'archival-cartography', iconName: 'Compass', category: 'History', shortcut: 'G K', keywords: ['archival', 'antique', 'maps', 'curtain', 'ocean', 'currents', 'winds'] },
  { id: 'cmd-dev-foundations', title: 'African Development Foundations Monograph', subtitle: 'Synthesis of macro-geonomics, Nathan Nunn mistrust & UN resolutions', tab: 'african-development-foundations', iconName: 'FileText', category: 'Research', keywords: ['master report', 'foundations', 'development', 'nunn', 'institutions'] },
  { id: 'cmd-molecular-legacies', title: 'Paleogenomic Molecular Legacies', subtitle: '50,000+ genomes, IBD deconvolution & African diaspora genetics', tab: 'molecular-legacies', iconName: 'FileText', category: 'Research', keywords: ['molecular', 'genetics', 'paleogenomics', 'ibd', 'dna', 'legacies'] },
  { id: 'cmd-research-directory', title: 'Working Papers & Policy Briefs', subtitle: 'Peer-reviewed research series, DOIs & executive abstracts', tab: 'research-directory', iconName: 'FileText', category: 'Research', keywords: ['working papers', 'directory', 'doi', 'citations', 'policy'] },
  { id: 'cmd-provenance', title: 'Epistemic Provenance & SHA-256 Verifier', subtitle: 'Cryptographic dataset hashes & 17 multilateral API connectors', tab: 'provenance', iconName: 'ShieldCheck', category: 'System', keywords: ['provenance', 'sha256', 'hash', 'integrity', 'audit', 'connectors'] },
  { id: 'cmd-privacy', title: 'Zero-Telemetry & GDPR Article 17 Wipe', subtitle: 'Transparent privacy notice & local cache reset', tab: 'privacy', iconName: 'ShieldCheck', category: 'System', keywords: ['privacy', 'telemetry', 'gdpr', 'wipe', 'storage'] },
  { id: 'cmd-style-guide', title: 'Universal Living Style Guide', subtitle: 'Japandi-Sahel design tokens, typography & accessibility tokens', tab: 'style-guide', iconName: 'Palette', category: 'System', keywords: ['style guide', 'design', 'tokens', 'japandi', 'theme'] },
  { id: 'cmd-toggle-theme', title: 'Toggle Light / Dark Theme', subtitle: 'Switch Atlas color appearance between daylight and dark mode', tab: 'utility:theme', action: 'toggleTheme', iconName: 'Palette', category: 'Utility', shortcut: 'T', keywords: ['theme', 'dark', 'light', 'mode', 'contrast', 'appearance', 'toggle'] },
  { id: 'cmd-afcfta-sim', title: 'Open AfCFTA Trade Corridor Simulator', subtitle: 'Model intra-African tariff schedules & industrial corridor scenarios', tab: 'utility:afcfta', action: 'openAfcfta', iconName: 'Sliders', category: 'Utility', keywords: ['afcfta', 'simulator', 'tariff', 'corridor', 'trade', 'customs'] },
  { id: 'cmd-academic-export', title: 'Open Academic Export & Cite Publication', subtitle: 'Generate BibTeX, RIS, APA citations & publication bundle exports', tab: 'utility:cite', action: 'openAcademicExport', iconName: 'BookOpen', category: 'Utility', keywords: ['export', 'cite', 'citation', 'bibtex', 'ris', 'apa', 'publication'] },
  { id: 'cmd-doi-verification', title: 'Open DOI Verification Matrix', subtitle: 'Inspect registered Figshare DOIs & bibliographic metadata records', tab: 'utility:doi', action: 'openDoiVerification', iconName: 'ShieldCheck', category: 'Utility', keywords: ['doi', 'verify', 'verification', 'crossref', 'figshare', 'bibliography'] },
];

type SearchCategory =
  | 'all'
  | 'commands'
  | 'countries'
  | 'kingdoms'
  | 'indicators'
  | 'iconography'
  | 'reports'
  | 'heritage'
  | 'languages';

interface IndexedHeritageRecord extends HeritageSite {
  whcId?: number;
  states?: string;
}

type SearchItemType = 
  | { type: 'command'; data: AppCommandItem }
  | { type: 'entity'; data: AtlasEntity }
  | { type: 'kingdom'; data: PreColonialEntity & { detail?: KingdomDetailedRecord } }
  | { type: 'language'; data: MotherTongueEntry }
  | { type: 'indicator'; data: IndicatorDefinition }
  | { type: 'heritage'; data: IndexedHeritageRecord }
  | { type: 'iconography'; data: SlaveTradeIllustration }
  | { type: 'castas'; data: CastasArchivalItem }
  | { type: 'report'; data: ResearchReport }
  | { type: 'workingPaper'; data: WorkingPaperEntry };

interface UnifiedSearchDoc {
  id: string;
  kind: SearchItemType['type'];
  primary: string;
  code: string;
  secondary: string;
  meta: string;
  payload: SearchItemType;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCountry,
  onSelectIndicator,
  onSelectTab,
  onToggleTheme
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lazyDataVersion, setLazyDataVersion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const { recentSearches, addRecentSearch, clearRecentSearches, isCountrySaved, toggleSaveCountry } = useSavedEntities();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedCategory('all');
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    setSelectedIndex(0);
    const bump = () => setLazyDataVersion(v => v + 1);
    const unsubIllustrations = subscribeSlaveTradeIllustrations(bump);
    const unsubKingdoms = subscribeDetailedKingdoms(bump);
    const unsubUnesco = subscribeUnescoHeritageSites(bump);
    return () => {
      window.clearTimeout(timer);
      unsubIllustrations();
      unsubKingdoms();
      unsubUnesco();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const hasQuery = query.trim().length >= 2;
    if (selectedCategory === 'iconography' || hasQuery) {
      ensureSlaveTradeIllustrationsHydrated();
    }
    if (selectedCategory === 'kingdoms' || hasQuery) {
      ensureDetailedKingdomsLoaded();
    }
    if (selectedCategory === 'heritage' || hasQuery) {
      ensureUnescoHeritageSitesLoaded();
    }
  }, [isOpen, selectedCategory, query]);

  const rawTrimmed = query.trim();
  const isCommandPrefix = rawTrimmed.startsWith('>');
  const normalizedQuery = normalizeSearchText(isCommandPrefix ? rawTrimmed.slice(1) : rawTrimmed);
  const q = normalizedQuery;

  const indexedKingdoms = useMemo(() => {
    const map = new Map<string, PreColonialEntity & { detail?: KingdomDetailedRecord }>();
    for (const entity of PRE_COLONIAL_ENTITIES) {
      map.set(entity.id, { ...entity, detail: DETAILED_KINGDOMS_DATA[entity.id] });
    }
    for (const detail of Object.values(DETAILED_KINGDOMS_DATA)) {
      if (!map.has(detail.id)) {
        map.set(detail.id, {
          id: detail.id,
          name: detail.name,
          period: detail.period,
          region: detail.region,
          regionBadge: detail.regionBadge,
          capital: detail.capital,
          coordinates: detail.coordinates,
          svgCoordinates: detail.svgCoordinates,
          modernCountries: detail.modernCountries,
          significance: detail.summaryNarrative,
          tradeSpecialty: detail.majorCommodities.join(', '),
          color: detail.color,
          detail,
        });
      }
    }
    return Array.from(map.values());
  }, [lazyDataVersion]);

  const indexedHeritage = useMemo<IndexedHeritageRecord[]>(() => {
    const merged: IndexedHeritageRecord[] = [];
    const seenKeys = new Set<string>();

    for (const site of INITIAL_UNESCO_HERITAGE_SITES) {
      const firstIso2 = (site.isoCode || '').split(',')[0]?.trim().toLowerCase() || '';
      const mappedEntityId = site.entityId || ISO2_TO_ISO3_MAP[firstIso2] || 'AFR';
      const normKey = normalizeSearchText(site.site);
      seenKeys.add(normKey);
      merged.push({
        id: `whc-${site.idNumber}`,
        unescoId: site.idNumber,
        whcId: site.idNumber,
        entityId: mappedEntityId,
        name: site.site,
        category: site.category,
        inscribedYear: site.dateInscribed,
        description: site.shortDescription || `${site.category} UNESCO World Heritage site in ${site.states}`,
        location: site.location || site.states,
        states: site.states,
        criteria: site.criteriaTxt,
        endangered: Boolean(site.danger),
      });
    }

    for (const site of atlas.getHeritageSites()) {
      const normKey = normalizeSearchText(site.name);
      if (seenKeys.has(normKey)) continue;
      seenKeys.add(normKey);
      merged.push(site);
    }

    return merged;
  }, [lazyDataVersion]);

  const indexedLanguages = useMemo<MotherTongueEntry[]>(
    () => Object.values(AFRICAN_MOTHER_TONGUES),
    []
  );

  const searchBundle = useMemo(() => {
    const docs: UnifiedSearchDoc[] = [];

    for (const cmd of APP_COMMAND_REGISTRY) {
      docs.push({
        id: `cmd:${cmd.id}`,
        kind: 'command',
        primary: cmd.title,
        code: cmd.tab,
        secondary: cmd.subtitle,
        meta: `${cmd.category} ${cmd.keywords.join(' ')}`,
        payload: { type: 'command', data: cmd },
      });
    }
    for (const e of atlas.getAllEntities()) {
      docs.push({
        id: `ent:${e.id}`,
        kind: 'entity',
        primary: e.name,
        code: `${e.id} ${e.iso2 || ''}`,
        secondary: `${e.officialName} ${e.capital}`,
        meta: `${e.region} ${e.subregion || ''}`,
        payload: { type: 'entity', data: e },
      });
    }
    for (const kingdom of indexedKingdoms) {
      docs.push({
        id: `kng:${kingdom.id}`,
        kind: 'kingdom',
        primary: kingdom.name,
        code: `${kingdom.capital} ${(kingdom.detail?.modernIso3Codes || []).join(' ')}`,
        secondary: `${kingdom.period} ${kingdom.region} ${kingdom.tradeSpecialty}`,
        meta: `${kingdom.modernCountries.join(' ')} ${kingdom.significance} ${kingdom.detail?.nativeName || ''} ${kingdom.detail?.dynasty || ''}`,
        payload: { type: 'kingdom', data: kingdom },
      });
    }
    for (const lang of indexedLanguages) {
      docs.push({
        id: `lng:${lang.id}`,
        kind: 'language',
        primary: `${lang.language} ${lang.autonym}`,
        code: `${lang.isoCode} ${lang.bcp47Tag}`,
        secondary: `${lang.family} ${lang.country}`,
        meta: `${lang.greetingText} ${lang.greetingMeaning} ${lang.proverbTranslation} ${lang.provenanceBadge}`,
        payload: { type: 'language', data: lang },
      });
    }
    for (const ind of atlas.getAllIndicators()) {
      docs.push({
        id: `ind:${ind.id}`,
        kind: 'indicator',
        primary: ind.name,
        code: ind.id,
        secondary: ind.domain,
        meta: ind.definition || '',
        payload: { type: 'indicator', data: ind },
      });
    }
    const seenReportTitles = new Set<string>();
    for (const rep of Object.values(getAllReports())) {
      seenReportTitles.add(normalizeSearchText(rep.title));
      docs.push({
        id: `rep:${rep.id}`,
        kind: 'report',
        primary: rep.title,
        code: `${rep.seriesNumber || rep.id} ${rep.doi || ''}`,
        secondary: rep.subtitle || rep.categoryLabel,
        meta: `${rep.authors.join(' ')} ${rep.categoryLabel} ${rep.isWorkingPaper ? 'working paper policy brief' : 'monograph'}`,
        payload: { type: 'report', data: rep },
      });
    }
    for (const wp of WORKING_PAPERS_SERIES) {
      if (seenReportTitles.has(normalizeSearchText(wp.title))) continue;
      docs.push({
        id: `wkp:${wp.id}`,
        kind: 'workingPaper',
        primary: wp.title,
        code: `${wp.seriesNumber} ${wp.jelCodes.join(' ')}`,
        secondary: `${wp.type} ${wp.subtitle}`,
        meta: `${wp.author} ${wp.abstract} ${wp.keyFindings.join(' ')}`,
        payload: { type: 'workingPaper', data: wp },
      });
    }
    for (const ill of SLAVE_TRADE_ILLUSTRATIONS) {
      docs.push({
        id: `ill:${ill.objectId || ill.regId}`,
        kind: 'iconography',
        primary: ill.title,
        code: ill.regId,
        secondary: ill.source,
        meta: `${ill.researchers.join(' ')} ${ill.collectionNames.join(' ')}`,
        payload: { type: 'iconography', data: ill },
      });
    }
    for (const c of CASTAS_ARCHIVE_ITEMS) {
      docs.push({
        id: `cas:${c.id}`,
        kind: 'castas',
        primary: c.title,
        code: c.id,
        secondary: `${c.creator} ${c.category}`,
        meta: c.description,
        payload: { type: 'castas', data: c },
      });
    }
    for (const site of indexedHeritage) {
      docs.push({
        id: `her:${site.id}`,
        kind: 'heritage',
        primary: site.name,
        code: `${site.entityId} ${site.whcId ? `WHC ${site.whcId}` : ''}`,
        secondary: `${site.location} ${site.states || ''} ${site.category}`,
        meta: site.description || '',
        payload: { type: 'heritage', data: site },
      });
    }

    const docsById = new Map<string, UnifiedSearchDoc>(docs.map((d) => [d.id, d]));
    const mini = new MiniSearch<UnifiedSearchDoc>({
      fields: ['primary', 'code', 'secondary', 'meta'],
      storeFields: ['id', 'kind'],
      tokenize: (text) => tokenizeSearchText(text),
      processTerm: (term) => (term.length >= 1 ? term : null),
    });
    mini.addAll(docs);
    return { mini, docsById };
  }, [lazyDataVersion, indexedKingdoms, indexedHeritage, indexedLanguages]);

  const groupedResults = useMemo(() => {
    if (!q) {
      return {
        commands: (selectedCategory === 'all' || selectedCategory === 'commands') ? APP_COMMAND_REGISTRY.slice(0, selectedCategory === 'commands' ? 8 : 4) : [],
        entities: (selectedCategory === 'all' || selectedCategory === 'countries') ? atlas.getAllEntities().slice(0, 6) : [],
        kingdoms: (selectedCategory === 'all' || selectedCategory === 'kingdoms') ? indexedKingdoms.slice(0, selectedCategory === 'kingdoms' ? 8 : 2) : [],
        languages: (selectedCategory === 'all' || selectedCategory === 'languages') ? indexedLanguages.slice(0, selectedCategory === 'languages' ? 8 : 2) : [],
        indicators: (selectedCategory === 'all' || selectedCategory === 'indicators') ? atlas.getAllIndicators().slice(0, 4) : [],
        reports: (selectedCategory === 'all' || selectedCategory === 'reports') ? Object.values(getAllReports()).slice(0, 3) : [],
        workingPapers: (selectedCategory === 'all' || selectedCategory === 'reports') ? WORKING_PAPERS_SERIES.slice(0, 2) : [],
        iconography: (selectedCategory === 'all' || selectedCategory === 'iconography') ? SLAVE_TRADE_ILLUSTRATIONS.slice(0, 3) : [],
        castas: (selectedCategory === 'all' || selectedCategory === 'iconography') ? CASTAS_ARCHIVE_ITEMS.slice(0, 2) : [],
        heritage: (selectedCategory === 'all' || selectedCategory === 'heritage') ? indexedHeritage.slice(0, selectedCategory === 'heritage' ? 8 : 2) : [],
      };
    }

    const allowedKinds = new Set<SearchItemType['type']>(
      selectedCategory === 'all'
        ? ['command', 'entity', 'kingdom', 'language', 'indicator', 'report', 'workingPaper', 'iconography', 'castas', 'heritage']
        : selectedCategory === 'commands'
        ? ['command']
        : selectedCategory === 'countries'
        ? ['entity']
        : selectedCategory === 'kingdoms'
        ? ['kingdom']
        : selectedCategory === 'languages'
        ? ['language']
        : selectedCategory === 'indicators'
        ? ['indicator']
        : selectedCategory === 'reports'
        ? ['report', 'workingPaper']
        : selectedCategory === 'iconography'
        ? ['iconography', 'castas']
        : ['heritage']
    );

    const hits = searchBundle.mini.search(q, {
      prefix: true,
      fuzzy: q.length >= 3 ? 0.2 : false,
      boost: { primary: 3, code: 3.5, secondary: 1.5, meta: 1 },
      combineWith: 'OR',
      filter: (res) => allowedKinds.has(res.kind as SearchItemType['type']),
    });

    const commands: AppCommandItem[] = [];
    const entities: AtlasEntity[] = [];
    const kingdoms: Array<PreColonialEntity & { detail?: KingdomDetailedRecord }> = [];
    const languages: MotherTongueEntry[] = [];
    const indicators: IndicatorDefinition[] = [];
    const reports: ResearchReport[] = [];
    const workingPapers: WorkingPaperEntry[] = [];
    const iconography: SlaveTradeIllustration[] = [];
    const castas: CastasArchivalItem[] = [];
    const heritage: IndexedHeritageRecord[] = [];

    for (const hit of hits) {
      const doc = searchBundle.docsById.get(String(hit.id));
      if (!doc) continue;
      const { payload } = doc;
      if (payload.type === 'command' && commands.length < 5) commands.push(payload.data);
      else if (payload.type === 'entity' && entities.length < 6) entities.push(payload.data);
      else if (payload.type === 'kingdom' && kingdoms.length < 4) kingdoms.push(payload.data);
      else if (payload.type === 'language' && languages.length < 4) languages.push(payload.data);
      else if (payload.type === 'indicator' && indicators.length < 5) indicators.push(payload.data);
      else if (payload.type === 'report' && reports.length < 4) reports.push(payload.data);
      else if (payload.type === 'workingPaper' && workingPapers.length < 3) workingPapers.push(payload.data);
      else if (payload.type === 'iconography' && iconography.length < 4) iconography.push(payload.data);
      else if (payload.type === 'castas' && castas.length < 3) castas.push(payload.data);
      else if (payload.type === 'heritage' && heritage.length < 5) heritage.push(payload.data);
    }

    return { commands, entities, kingdoms, languages, indicators, reports, workingPapers, iconography, castas, heritage };
  }, [q, selectedCategory, searchBundle, indexedKingdoms, indexedHeritage, indexedLanguages]);

  const {
    commands: matchedCommands,
    entities: matchedEntities,
    kingdoms: matchedKingdoms,
    languages: matchedLanguages,
    indicators: matchedIndicators,
    reports: matchedReports,
    workingPapers: matchedWorkingPapers,
    iconography: matchedIconography,
    castas: matchedCastas,
    heritage: matchedHeritage,
  } = groupedResults;

  // Flatten items for keyboard navigation (Commands first if searching or if > typed)
  const flattenedItems = useMemo<SearchItemType[]>(() => {
    const list: SearchItemType[] = [];
    matchedCommands.forEach(data => list.push({ type: 'command', data }));
    matchedEntities.forEach(data => list.push({ type: 'entity', data }));
    matchedKingdoms.forEach(data => list.push({ type: 'kingdom', data }));
    matchedReports.forEach(data => list.push({ type: 'report', data }));
    matchedWorkingPapers.forEach(data => list.push({ type: 'workingPaper', data }));
    matchedHeritage.forEach(data => list.push({ type: 'heritage', data }));
    matchedLanguages.forEach(data => list.push({ type: 'language', data }));
    matchedIconography.forEach(data => list.push({ type: 'iconography', data }));
    matchedCastas.forEach(data => list.push({ type: 'castas', data }));
    matchedIndicators.forEach(data => list.push({ type: 'indicator', data }));
    return list;
  }, [
    matchedCommands,
    matchedEntities,
    matchedKingdoms,
    matchedReports,
    matchedWorkingPapers,
    matchedHeritage,
    matchedLanguages,
    matchedIconography,
    matchedCastas,
    matchedIndicators,
  ]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [q, selectedCategory]);

  // Scroll active result into view during keyboard navigation
  useEffect(() => {
    if (!isOpen || !listboxRef.current) return;
    const activeEl = listboxRef.current.querySelector<HTMLElement>(`#search-result-option-${selectedIndex}`);
    if (activeEl && typeof activeEl.scrollIntoView === 'function') {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, selectedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || e.isComposing || e.keyCode === 229) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (flattenedItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (flattenedItems.length || 1)) % (flattenedItems.length || 1));
      } else if (e.key === 'Enter') {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'BUTTON' || target.tagName === 'A')) {
          return;
        }
        e.preventDefault();
        const selected = flattenedItems[selectedIndex];
        if (selected) {
          handleExecuteSelection(selected);
        } else if (q) {
          addRecentSearch(query);
          if (onSelectTab) {
            if (selectedCategory === 'iconography') {
              onSelectTab(`iconography?q=${encodeURIComponent(query)}`);
            } else {
              onSelectTab(`explore`);
            }
          }
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flattenedItems, q, query, selectedCategory, onClose, onSelectTab, addRecentSearch]);

  const handleExecuteSelection = (item: SearchItemType) => {
    if (item.type === 'command') {
      addRecentSearch(item.data.title);
      if (item.data.action === 'toggleTheme') {
        onToggleTheme?.();
      } else if (item.data.action === 'openAfcfta') {
        atlasModalStore.openAfcftaSimulator();
      } else if (item.data.action === 'openAcademicExport') {
        atlasModalStore.openAcademicExport();
      } else if (item.data.action === 'openDoiVerification') {
        atlasModalStore.openDoiVerification();
      } else if (onSelectTab) {
        onSelectTab(item.data.tab);
      } else {
        window.location.hash = item.data.tab;
      }
      onClose();
    } else if (item.type === 'entity') {
      addRecentSearch(item.data.name);
      onSelectCountry(item.data.id);
      onClose();
    } else if (item.type === 'kingdom') {
      addRecentSearch(item.data.name);
      const target = `archival-cartography?tab=kingdoms&kingdom=${item.data.id}`;
      if (onSelectTab) {
        onSelectTab(target);
      } else {
        window.location.hash = target;
      }
      onClose();
    } else if (item.type === 'language') {
      addRecentSearch(item.data.language);
      const target = `languages?lang=${item.data.id}`;
      if (onSelectTab) {
        onSelectTab(target);
      } else {
        window.location.hash = target;
      }
      onClose();
    } else if (item.type === 'indicator') {
      addRecentSearch(item.data.name);
      onSelectIndicator(item.data.id);
      onClose();
    } else if (item.type === 'heritage') {
      addRecentSearch(item.data.name);
      if (item.data.whcId && onSelectTab) {
        onSelectTab(`heritage?id=${item.data.whcId}`);
      } else {
        onSelectCountry(item.data.entityId);
      }
      onClose();
    } else if (item.type === 'iconography') {
      addRecentSearch(item.data.title);
      if (onSelectTab) {
        onSelectTab(`iconography?plate=${item.data.objectId}`);
      }
      onClose();
    } else if (item.type === 'castas') {
      addRecentSearch(item.data.title);
      if (onSelectTab) {
        onSelectTab(`iconography?castas=${item.data.id}`);
      }
      onClose();
    } else if (item.type === 'report') {
      addRecentSearch(item.data.title);
      if (onSelectTab) {
        onSelectTab(item.data.id);
      }
      onClose();
    } else if (item.type === 'workingPaper') {
      addRecentSearch(item.data.title);
      atlasModalStore.openWorkingPapers();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AtlasDialog
      isOpen={isOpen}
      onClose={onClose}
      label="Universal Platform Search & Command Palette"
      initialFocusRef={inputRef}
      overlayClassName="fixed inset-0 z-50 flex items-start justify-center p-2.5 pt-3 sm:p-4 sm:pt-16 md:pt-24 bg-black/75 backdrop-blur-md atlas-modal-backdrop"
      className="w-full max-w-2xl max-h-[92dvh] flex flex-col overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl text-zinc-900 dark:text-zinc-100 transition-colors atlas-modal-panel"
    >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {`${flattenedItems.length} result${flattenedItems.length === 1 ? '' : 's'} in ${selectedCategory} index`}
        </div>
        {/* Search Input Bar */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-5 py-3 sm:py-4 bg-zinc-50/70 dark:bg-zinc-900/50 shrink-0">
          <Search className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-controls="search-results-listbox"
            aria-activedescendant={flattenedItems.length > 0 ? `search-result-option-${selectedIndex}` : undefined}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search nations, kingdoms, UNESCO sites, mother tongues, papers..."
            className="w-full bg-transparent text-sm md:text-base text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="min-touch-target text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-lg">
            ESC
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search modal"
            className="sm:hidden min-touch-target p-2 rounded-xl text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills Bar */}
        <div role="group" aria-label="Search category filters" className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-200 dark:border-zinc-800/80 overflow-x-auto no-scrollbar scroll-shadow-x shrink-0">
          <button
            type="button"
            aria-pressed={selectedCategory === 'all'}
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            All
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === 'commands'}
            onClick={() => setSelectedCategory('commands')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              selectedCategory === 'commands'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Commands</span>
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === 'countries'}
            onClick={() => setSelectedCategory('countries')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              selectedCategory === 'countries'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Nations</span>
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === 'kingdoms'}
            onClick={() => setSelectedCategory('kingdoms')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              selectedCategory === 'kingdoms'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <Crown className="w-3 h-3" />
            <span>Kingdoms</span>
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === 'heritage'}
            onClick={() => setSelectedCategory('heritage')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              selectedCategory === 'heritage'
                ? 'bg-purple-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <Landmark className="w-3 h-3" />
            <span>Heritage</span>
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === 'languages'}
            onClick={() => setSelectedCategory('languages')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              selectedCategory === 'languages'
                ? 'bg-teal-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <Volume2 className="w-3 h-3" />
            <span>Languages</span>
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === 'reports'}
            onClick={() => setSelectedCategory('reports')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              selectedCategory === 'reports'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Monographs</span>
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === 'iconography'}
            onClick={() => setSelectedCategory('iconography')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              selectedCategory === 'iconography'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Iconography</span>
          </button>
          <button
            type="button"
            aria-pressed={selectedCategory === 'indicators'}
            onClick={() => setSelectedCategory('indicators')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              selectedCategory === 'indicators'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Indicators</span>
          </button>
        </div>

        {/* Results Container with Sleek Scrollbar & Click-Through Bottom Fade */}
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <div
            ref={listboxRef}
            id="search-results-listbox"
            role="listbox"
            aria-label="Search results"
            className="max-h-[58dvh] overflow-y-auto overscroll-contain stable-gutter sleek-scrollbar p-3 sm:p-4 space-y-2 pb-8"
          >
          {flattenedItems.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 text-zinc-400 mx-auto opacity-50" />
              <p className="text-sm font-sans text-zinc-600 dark:text-zinc-400">
                No matching records found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs font-mono text-zinc-500">
                Try searching for &ldquo;Nigeria&rdquo;, &ldquo;Ashanti&rdquo;, &ldquo;Yorùbá&rdquo;, &ldquo;Lalibela&rdquo;, or &ldquo;GDP&rdquo;
              </p>
            </div>
          ) : (
            flattenedItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const itemKey =
                item.type === 'command'
                  ? `command:${item.data.id}`
                  : item.type === 'entity'
                    ? `entity:${item.data.id}`
                    : item.type === 'kingdom'
                      ? `kingdom:${item.data.id}`
                      : item.type === 'language'
                        ? `language:${item.data.id}`
                        : item.type === 'report'
                          ? `report:${item.data.id}`
                          : item.type === 'workingPaper'
                            ? `workingPaper:${item.data.id}`
                            : item.type === 'iconography'
                              ? `iconography:${item.data.objectId || item.data.regId}`
                              : item.type === 'castas'
                                ? `castas:${item.data.id}`
                                : item.type === 'indicator'
                                  ? `indicator:${item.data.id}`
                                  : `heritage:${item.data.id}`;
              return (
                <button
                  key={itemKey}
                  id={`search-result-option-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleExecuteSelection(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-sm'
                      : 'border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    {/* Icon Column */}
                    {item.type === 'command' && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'entity' && (
                      <CountryFlag entityId={item.data.id} size="sm" />
                    )}
                    {item.type === 'kingdom' && (
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <Crown className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'language' && (
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </div>
                    )}
                    {(item.type === 'report' || item.type === 'workingPaper') && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'iconography' && (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'castas' && (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'indicator' && (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    )}
                    {item.type === 'heritage' && (
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center shrink-0">
                        <Landmark className="w-4 h-4" />
                      </div>
                    )}

                    {/* Text Column */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-sans font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.type === 'command' && item.data.title}
                          {item.type === 'entity' && item.data.name}
                          {item.type === 'kingdom' && item.data.name}
                          {item.type === 'language' && `${item.data.language} (${item.data.autonym})`}
                          {item.type === 'report' && item.data.title}
                          {item.type === 'workingPaper' && item.data.title}
                          {item.type === 'iconography' && item.data.title}
                          {item.type === 'castas' && item.data.title}
                          {item.type === 'indicator' && item.data.name}
                          {item.type === 'heritage' && item.data.name}
                        </span>
                        {item.type === 'command' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                            {item.data.category}
                          </span>
                        )}
                        {item.type === 'entity' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {item.data.id}
                          </span>
                        )}
                        {item.type === 'kingdom' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300">
                            {item.data.period}
                          </span>
                        )}
                        {item.type === 'language' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300">
                            Mother Tongue
                          </span>
                        )}
                        {item.type === 'workingPaper' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                            {item.data.seriesNumber}
                          </span>
                        )}
                        {item.type === 'iconography' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Plate {item.data.regId}
                          </span>
                        )}
                        {item.type === 'castas' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            Castas Archive
                          </span>
                        )}
                        {item.type === 'heritage' && item.data.whcId && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300">
                            WHC #{item.data.whcId}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-serif text-zinc-500 dark:text-zinc-400 truncate">
                        {item.type === 'command' && (item.data.action ? item.data.subtitle : `${item.data.subtitle} (Route: #${item.data.tab})`)}
                        {item.type === 'entity' && `${item.data.region} • Capital: ${item.data.capital}`}
                        {item.type === 'kingdom' && `${item.data.region} • Capital: ${item.data.capital} • ${item.data.modernCountries.join(', ')}`}
                        {item.type === 'language' && `${item.data.family} • ${item.data.country} • “${item.data.greetingText}”`}
                        {item.type === 'report' && `${item.data.categoryLabel} • ${item.data.authors[0]}`}
                        {item.type === 'workingPaper' && `${item.data.type} • ${item.data.author}`}
                        {item.type === 'iconography' && `${item.data.date || 'Historical'} • ${item.data.source}`}
                        {item.type === 'castas' && `${item.data.date} • ${item.data.creator}`}
                        {item.type === 'indicator' && `${item.data.domain} • ${item.data.unit}`}
                        {item.type === 'heritage' && `${item.data.states || item.data.location} • ${item.data.category}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
                    {item.type === 'command' && item.data.shortcut && (
                      <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold">
                        {item.data.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        Jump ↵
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })
          )}
          </div>

          {/* Click-Through Bottom Fade Overlay */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none z-10" 
            aria-hidden="true" 
          />
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <span>Africa Data Atlas Universal Index</span>
        </div>
    </AtlasDialog>
  );
};

export default SearchModal;
