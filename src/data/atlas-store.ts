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
import { COUNTRY_HEADER_DATA } from './countryHeaderData';
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

  private createVirtualIndicator(
    data: {
      id: string;
      name: string;
      label: string;
      domain: string;
      definition: string;
      unit: string;
      unitType: string;
      preferredSource: string;
      higherIsBetter?: boolean;
    }
  ): IndicatorDefinition {
    return {
      subdomain: data.domain,
      frequency: 'Annual',
      sourceDataset: data.preferredSource,
      sourceCode: data.id,
      isDerived: false,
      aggregationMethod: 'latest',
      higherIsBetter: data.higherIsBetter ?? true,
      ...data
    };
  }

  public getIndicator(id: string): IndicatorDefinition | undefined {
    if (this.indicators.has(id)) {
      return this.indicators.get(id);
    }

    // Dynamic alias resolvers for thematic pillar indicators
    switch (id) {
      case 'INDEPENDENCE_YEAR':
        return this.createVirtualIndicator({
          id: 'INDEPENDENCE_YEAR',
          name: 'Independence Year & Proclamation',
          label: 'Independence Year',
          domain: 'History',
          definition: 'Year of official sovereign declaration of independence and self-determination.',
          unit: 'Year',
          unitType: 'number',
          preferredSource: 'Official State Archives / UN Treaty',
          higherIsBetter: false
        });
      case 'UN_MEMBER_DATE':
      case 'UN_MEMBER_YEAR':
        return this.createVirtualIndicator({
          id: 'UN_MEMBER_DATE',
          name: 'UN Membership Admission Year',
          label: 'UN Admission Year',
          domain: 'History',
          definition: 'Year of formal accession and admission as a full United Nations member state.',
          unit: 'Year',
          unitType: 'number',
          preferredSource: 'United Nations General Assembly',
          higherIsBetter: false
        });
      case 'LAND_AREA':
        return this.createVirtualIndicator({
          id: 'LAND_AREA',
          name: 'Total Surface Land Area',
          label: 'Surface Land Area',
          domain: 'Geography',
          definition: 'Total land area of sovereign territory in square kilometers.',
          unit: 'km²',
          unitType: 'number',
          preferredSource: 'UN Statistics Division / FAO',
          higherIsBetter: true
        });
      case 'FOREST_COVER':
        return this.indicators.get('AG.LND.FRST.ZS') || this.createVirtualIndicator({
          id: 'FOREST_COVER',
          name: 'Forest Canopy Cover (% of land area)',
          label: 'Forest Cover',
          domain: 'Climate & Environment',
          definition: 'Forest area as a percentage of total land surface.',
          unit: '% of land area',
          unitType: 'percentage',
          preferredSource: 'FAO / World Bank',
          higherIsBetter: true
        });
      case 'ARABLE_LAND':
        return this.indicators.get('AG.LND.AGRI.ZS') || this.createVirtualIndicator({
          id: 'ARABLE_LAND',
          name: 'Agricultural Land (% of land area)',
          label: 'Agricultural Land',
          domain: 'Climate & Environment',
          definition: 'Agricultural and arable land as percentage of land surface.',
          unit: '% of land area',
          unitType: 'percentage',
          preferredSource: 'FAO / World Bank',
          higherIsBetter: true
        });
      case 'POPULATION':
        return this.indicators.get('SP.POP.TOTL');
      case 'MEDIAN_AGE':
        return this.indicators.get('SP.POP.MEDN.AGE');
      case 'LIFE_EXPECTANCY':
        return this.indicators.get('SP.DYN.LE00.IN');
      case 'HDI':
        return this.indicators.get('UNDP.HDI.INDEX');
      case 'OFFICIAL_LANGUAGES':
        return this.createVirtualIndicator({
          id: 'OFFICIAL_LANGUAGES',
          name: 'Official State Languages Count',
          label: 'Official Languages',
          domain: 'Languages',
          definition: 'Number of constitutionally recognized official state languages.',
          unit: 'Languages',
          unitType: 'number',
          preferredSource: 'National Constitution',
          higherIsBetter: true
        });
      case 'LITERACY_RATE':
        return this.indicators.get('SE.ADT.LITR.ZS');
      case 'HERITAGE_SITES':
        return this.createVirtualIndicator({
          id: 'HERITAGE_SITES',
          name: 'UNESCO World Heritage Sites',
          label: 'World Heritage Sites',
          domain: 'Culture',
          definition: 'Total number of inscribed cultural and natural UNESCO World Heritage properties.',
          unit: 'Sites',
          unitType: 'number',
          preferredSource: 'UNESCO World Heritage Centre',
          higherIsBetter: true
        });
      case 'CREATIVE_EXPORTS':
        return this.indicators.get('ST.INT.ARVL') || this.indicators.get('COMTRADE.INTRA.AFRICA.SHARE');
      case 'RENEWABLE_ENERGY_SHARE':
        return this.indicators.get('EG.FEC.RNEW.ZS');
      case 'CO2_EMISSIONS':
        return this.indicators.get('EN.ATM.CO2E.PC');
      case 'CLIMATE_VULNERABILITY':
        return this.createVirtualIndicator({
          id: 'CLIMATE_VULNERABILITY',
          name: 'Climatological Baseline Mean Temp',
          label: 'Mean Temperature',
          domain: 'Climate & Environment',
          definition: 'Annual mean surface climatological temperature in Celsius.',
          unit: '°C',
          unitType: 'number',
          preferredSource: 'WMO / CRU TS Climatology',
          higherIsBetter: false
        });
      case 'GDP_NOMINAL':
        return this.indicators.get('NY.GDP.MKTP.CD');
      case 'GDP_GROWTH':
        return this.indicators.get('NY.GDP.MKTP.KD.ZG');
      case 'INFLATION_RATE':
        return this.indicators.get('FP.CPI.TOTL.ZG');
      case 'EXTERNAL_DEBT':
        return this.indicators.get('GC.DOD.TOTL.GD.ZS');
      case 'INTERNET_PENETRATION':
        return this.indicators.get('IT.NET.USER.ZS');
      case 'MOBILE_SUBSCRIPTIONS':
        return this.indicators.get('IT.CEL.SETS.P2');
      case 'INNOVATION_INDEX':
        return this.indicators.get('EG.ELC.ACCS.ZS');
      case 'PEACE_INDEX':
        return this.indicators.get('IEP.GPI.SCORE');
      case 'CONFLICT_EVENTS':
        return this.indicators.get('MO.IIAG.SCORE') || this.indicators.get('IEP.GPI.SCORE');
      default:
        return undefined;
    }
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
    const normId = entityId.toUpperCase();
    const obs = this.getLatestObservation(normId, indicatorId);
    if (obs && obs.value !== null && obs.value !== undefined) {
      return obs.value;
    }

    const entity = this.getEntity(normId);
    const header = COUNTRY_HEADER_DATA[normId];

    // Handle thematic indicator alias IDs and entity property extractions
    switch (indicatorId) {
      case 'INDEPENDENCE_YEAR': {
        if (header?.independenceDate) {
          const match = header.independenceDate.match(/\b(19\d{2}|20\d{2})\b/);
          if (match) return parseInt(match[0], 10);
        }
        return entity?.independenceYear || null;
      }
      case 'UN_MEMBER_DATE':
      case 'UN_MEMBER_YEAR': {
        if (header?.unMemberDate) {
          const match = header.unMemberDate.match(/\b(19\d{2}|20\d{2})\b/);
          if (match) return parseInt(match[0], 10);
        }
        if (entity?.unMemberDate) {
          const match = entity.unMemberDate.match(/\b(19\d{2}|20\d{2})\b/);
          if (match) return parseInt(match[0], 10);
        }
        return null;
      }
      case 'LAND_AREA':
        return entity?.landAreaKm2 || null;
      case 'FOREST_COVER': {
        if (entity?.facts?.forestCover) {
          const parsed = parseFloat(entity.facts.forestCover);
          if (!isNaN(parsed)) return parsed;
        }
        return this.getIndicatorValue(normId, 'AG.LND.FRST.ZS');
      }
      case 'ARABLE_LAND':
        return this.getIndicatorValue(normId, 'AG.LND.AGRI.ZS');
      case 'POPULATION':
        return this.getIndicatorValue(normId, 'SP.POP.TOTL');
      case 'MEDIAN_AGE':
        return this.getIndicatorValue(normId, 'SP.POP.MEDN.AGE');
      case 'LIFE_EXPECTANCY':
        return this.getIndicatorValue(normId, 'SP.DYN.LE00.IN');
      case 'HDI':
        return this.getIndicatorValue(normId, 'UNDP.HDI.INDEX');
      case 'OFFICIAL_LANGUAGES':
        return entity?.languages?.official?.length || 1;
      case 'LITERACY_RATE':
        return this.getIndicatorValue(normId, 'SE.ADT.LITR.ZS');
      case 'HERITAGE_SITES':
        return this.getHeritageSites(normId).length;
      case 'CREATIVE_EXPORTS':
        return this.getIndicatorValue(normId, 'ST.INT.ARVL') || this.getIndicatorValue(normId, 'COMTRADE.INTRA.AFRICA.SHARE');
      case 'RENEWABLE_ENERGY_SHARE':
        return this.getIndicatorValue(normId, 'EG.FEC.RNEW.ZS');
      case 'CO2_EMISSIONS':
        return this.getIndicatorValue(normId, 'EN.ATM.CO2E.PC');
      case 'CLIMATE_VULNERABILITY':
        return header?.climate?.baseTempC ?? 27;
      case 'GDP_NOMINAL':
        return this.getIndicatorValue(normId, 'NY.GDP.MKTP.CD');
      case 'GDP_GROWTH':
        return this.getIndicatorValue(normId, 'NY.GDP.MKTP.KD.ZG');
      case 'INFLATION_RATE':
        return this.getIndicatorValue(normId, 'FP.CPI.TOTL.ZG');
      case 'EXTERNAL_DEBT':
        return this.getIndicatorValue(normId, 'GC.DOD.TOTL.GD.ZS');
      case 'INTERNET_PENETRATION':
        return this.getIndicatorValue(normId, 'IT.NET.USER.ZS');
      case 'MOBILE_SUBSCRIPTIONS':
        return this.getIndicatorValue(normId, 'IT.CEL.SETS.P2');
      case 'INNOVATION_INDEX':
        return this.getIndicatorValue(normId, 'EG.ELC.ACCS.ZS');
      case 'PEACE_INDEX':
        return this.getIndicatorValue(normId, 'IEP.GPI.SCORE');
      case 'CONFLICT_EVENTS':
        return this.getIndicatorValue(normId, 'MO.IIAG.SCORE') || this.getIndicatorValue(normId, 'IEP.GPI.SCORE');
      default:
        return null;
    }
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
