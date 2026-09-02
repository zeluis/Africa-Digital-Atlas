import {
  AtlasEntity,
  IndicatorDefinition,
  Observation,
  HeritageSite,
  SubnationalUnit,
  DataSource,
  MediaLinks,
  QualityFlag,
  AtlasManifest,
  AfricanRegion,
  RegionalBloc
} from './types';
import {
  ATLAS_MANIFEST,
  DATA_SOURCES,
  INDICATOR_CATALOG,
  UNESCO_HERITAGE_SITES,
  SUBNATIONAL_UNITS,
  QUALITY_FLAGS,
  getInitialEntities
} from './atlas-raw-data';
import { generateFullObservations, MEDIA_REGISTRY } from './atlas-observations-seed';
import { EXPANDED_INDICATORS, generateExpandedObservations } from './expandedIndicators';
import { ENTITY_BLOCS, ENTITY_BLOC_MEMBERSHIP, EntityBlocId } from './entityBlocs';
import { generateAllWorldBankObservations } from './worldBankComprehensiveData';
import { 
  EXTERNAL_API_CONNECTORS, 
  EXTERNAL_DATA_SOURCES, 
  EXTERNAL_INDICATORS_CATALOG, 
  generateExternalApisObservations,
  ExternalApiConnector,
  testLiveApiConnection,
  LiveApiTestResult
} from './externalApisIngestion';

class AtlasDataStore {
  private manifest: AtlasManifest;
  private entities: Map<string, AtlasEntity> = new Map();
  private indicators: Map<string, IndicatorDefinition> = new Map();
  private sources: Map<string, DataSource> = new Map();
  private heritageSites: Map<string, HeritageSite[]> = new Map();
  private subnationalUnits: Map<string, SubnationalUnit[]> = new Map();
  private qualityFlags: Map<string, QualityFlag[]> = new Map();
  private mediaLinks: Map<string, MediaLinks> = new Map();

  // Indexes for fast lookup
  private observationsByEntity: Map<string, Observation[]> = new Map();
  private observationsByIndicator: Map<string, Observation[]> = new Map();
  private observationsByEntityAndIndicator: Map<string, Observation[]> = new Map();

  private isInitialized = false;

  constructor() {
    this.manifest = ATLAS_MANIFEST;
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;

    // Load sources
    for (const src of DATA_SOURCES) {
      this.sources.set(src.id, src);
    }
    for (const src of EXTERNAL_DATA_SOURCES) {
      this.sources.set(src.id, src);
    }

    // Load indicators
    for (const ind of INDICATOR_CATALOG) {
      this.indicators.set(ind.id, ind);
    }
    for (const ind of EXPANDED_INDICATORS) {
      this.indicators.set(ind.id, ind);
    }
    for (const ind of EXTERNAL_INDICATORS_CATALOG) {
      this.indicators.set(ind.id, ind);
    }

    // Load entities
    const rawEntities = getInitialEntities();
    for (const ent of rawEntities) {
      this.entities.set(ent.id, ent);
    }

    // Load heritage sites
    for (const site of UNESCO_HERITAGE_SITES) {
      const list = this.heritageSites.get(site.entityId) || [];
      list.push(site);
      this.heritageSites.set(site.entityId, list);
    }

    // Load subnational units
    for (const sub of SUBNATIONAL_UNITS) {
      const list = this.subnationalUnits.get(sub.entityId) || [];
      list.push(sub);
      this.subnationalUnits.set(sub.entityId, list);
    }

    // Load quality flags
    for (const qf of QUALITY_FLAGS) {
      const list = this.qualityFlags.get(qf.entityId) || [];
      list.push(qf);
      this.qualityFlags.set(qf.entityId, list);
    }

    // Load media links
    for (const [id, media] of Object.entries(MEDIA_REGISTRY)) {
      this.mediaLinks.set(id, media);
    }

    // Load and index observations
    const allObservations = generateFullObservations();
    const existingObsKeys = new Set(allObservations.map(o => `${o.entityId}_${o.indicatorId}_${o.period}`));
    
    // Inject comprehensive World Bank datasets across all topics
    const wbObservations = generateAllWorldBankObservations(rawEntities, existingObsKeys);
    allObservations.push(...wbObservations);

    // Inject observations from external APIs (FH_FIW, WGI, UNESCO, GHO, PIP, IDS, UN Comtrade, IMF WEO, CPIA, CCKP, etc.)
    const extApiObservations = generateExternalApisObservations(rawEntities, existingObsKeys);
    allObservations.push(...extApiObservations);

    // Also inject observations for all expanded indicators across all entities
    for (const ent of rawEntities) {
      const expandedVals = generateExpandedObservations(ent.id);
      for (const [indId, val] of Object.entries(expandedVals)) {
        const indDef = this.indicators.get(indId);
        const key = `${ent.id}_${indId}_2024`;
        if (!existingObsKeys.has(key)) {
          allObservations.push({
            entityId: ent.id,
            indicatorId: indId,
            period: 2024,
            value: val,
            unit: indDef?.unit || '',
            sourceId: indDef?.preferredSource || 'Harmonized',
            datasetId: indDef?.sourceDataset || 'HARMONIZED_2024',
            status: 'observed'
          });
          existingObsKeys.add(key);
        }
      }
    }

    for (const obs of allObservations) {
      // By entity
      const byEnt = this.observationsByEntity.get(obs.entityId) || [];
      byEnt.push(obs);
      this.observationsByEntity.set(obs.entityId, byEnt);

      // By indicator
      const byInd = this.observationsByIndicator.get(obs.indicatorId) || [];
      byInd.push(obs);
      this.observationsByIndicator.set(obs.indicatorId, byInd);

      // By entity and indicator
      const pairKey = `${obs.entityId}_${obs.indicatorId}`;
      const byPair = this.observationsByEntityAndIndicator.get(pairKey) || [];
      byPair.push(obs);
      this.observationsByEntityAndIndicator.set(pairKey, byPair);
    }

    this.isInitialized = true;
  }

  public getManifest(): AtlasManifest {
    return this.manifest;
  }

  public getEntity(id: string): AtlasEntity | undefined {
    return this.entities.get(id.toUpperCase());
  }

  public getAllEntities(): AtlasEntity[] {
    return Array.from(this.entities.values());
  }

  public getSovereignCountries(): AtlasEntity[] {
    return Array.from(this.entities.values()).filter(e => e.sovereign);
  }

  public getTerritories(): AtlasEntity[] {
    return Array.from(this.entities.values()).filter(e => !e.sovereign);
  }

  public getEntitiesByRegion(region: AfricanRegion): AtlasEntity[] {
    return Array.from(this.entities.values()).filter(e => e.region === region);
  }

  public getEntitiesByBloc(bloc: RegionalBloc): AtlasEntity[] {
    return Array.from(this.entities.values()).filter(e => e.blocs.includes(bloc));
  }

  public getEntitiesByEntityBloc(blocId: EntityBlocId): AtlasEntity[] {
    const memberIso3s = ENTITY_BLOCS[blocId]?.memberIso3s || [];
    return memberIso3s
      .map(iso => this.entities.get(iso))
      .filter((e): e is AtlasEntity => Boolean(e));
  }

  public getIndicator(id: string): IndicatorDefinition | undefined {
    return this.indicators.get(id);
  }

  public getAllIndicators(): IndicatorDefinition[] {
    return Array.from(this.indicators.values());
  }

  public getIndicatorsByDomain(domain: string): IndicatorDefinition[] {
    return Array.from(this.indicators.values()).filter(i => i.domain === domain);
  }

  public getObservations(entityId: string, indicatorId: string): Observation[] {
    const pairKey = `${entityId.toUpperCase()}_${indicatorId}`;
    const obs = this.observationsByEntityAndIndicator.get(pairKey) || [];
    return [...obs].sort((a, b) => a.period - b.period);
  }

  public getLatestObservation(entityId: string, indicatorId: string): Observation | null {
    const list = this.getObservations(entityId, indicatorId);
    if (list.length === 0) return null;
    return list[list.length - 1];
  }

  public getIndicatorValue(entityId: string, indicatorId: string): number | null {
    const obs = this.getLatestObservation(entityId, indicatorId);
    return obs ? obs.value : null;
  }

  public getFacts(entityId: string): Record<string, any> {
    const entity = this.getEntity(entityId);
    return entity ? entity.facts : {};
  }

  public getHeritageSites(entityId?: string): HeritageSite[] {
    if (entityId) {
      return this.heritageSites.get(entityId.toUpperCase()) || [];
    }
    const all: HeritageSite[] = [];
    for (const list of this.heritageSites.values()) {
      all.push(...list);
    }
    return all;
  }

  public getSubnationalUnits(entityId: string): SubnationalUnit[] {
    return this.subnationalUnits.get(entityId.toUpperCase()) || [];
  }

  public getQualityFlags(entityId?: string): QualityFlag[] {
    if (entityId) {
      return this.qualityFlags.get(entityId.toUpperCase()) || [];
    }
    const all: QualityFlag[] = [];
    for (const list of this.qualityFlags.values()) {
      all.push(...list);
    }
    return all;
  }

  public getMedia(entityId: string): MediaLinks {
    const id = entityId.toUpperCase();
    const existing = this.mediaLinks.get(id);
    if (existing) return existing;

    const entity = this.getEntity(id);
    const iso2 = (entity?.iso2 || id.substring(0, 2)).toLowerCase();
    const name = entity?.name || id;

    return {
      entityId: id,
      flagSvg: `https://flagcdn.com/${iso2}.svg`,
      flagPng: `https://flagcdn.com/w320/${iso2}.png`,
      flagEmoji: '🌍',
      wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
      wikidataId: 'Q000',
      wikidataUrl: `https://www.wikidata.org/wiki/Special:Search?search=${encodeURIComponent(name)}`,
      worldBankProfileUrl: `https://data.worldbank.org/country/${encodeURIComponent(name.toLowerCase())}`,
      imfProfileUrl: `https://www.imf.org/en/Countries/${id}`,
      unProfileUrl: `https://data.un.org/en/iso/${iso2}.html`,
      africanUnionUrl: `https://au.int/en/member_states/${encodeURIComponent(name.toLowerCase())}`
    };
  }

  public getSource(sourceId: string): DataSource | undefined {
    return this.sources.get(sourceId);
  }

  public getAllSources(): DataSource[] {
    return Array.from(this.sources.values());
  }

  public getApiConnectors(): ExternalApiConnector[] {
    return EXTERNAL_API_CONNECTORS;
  }

  public async testLiveApi(connectorId: string, countryIso3 = 'GHA'): Promise<LiveApiTestResult> {
    return testLiveApiConnection(connectorId, countryIso3);
  }
}

// Singleton global instance
export const atlas = new AtlasDataStore();
