import { atlas } from './atlas-store';
import { AfricanRegion, RegionalBloc, AtlasEntity, IndicatorDefinition, Observation } from './types';

export interface ContinentalSummary {
  totalPopulationMillion: number;
  totalGdpBillionUsd: number;
  weightedGdpPerCapitaUsd: number;
  weightedHdi: number;
  weightedLifeExpectancy: number;
  averageElectricityAccessPct: number;
  totalHeritageSites: number;
  totalSovereignCountries: number;
  fastestGrowingNations: { entity: AtlasEntity; growth: number }[];
  highestIncomeNations: { entity: AtlasEntity; gdpPerCapita: number }[];
}

export interface RegionSummary {
  region: AfricanRegion;
  totalPopulation: number;
  totalGdp: number;
  averageHdi: number;
  averageGrowth: number;
  averageLifeExpectancy: number;
  countryCount: number;
  countries: AtlasEntity[];
  leadingEconomy: AtlasEntity | null;
  leadingPopulation: AtlasEntity | null;
  heritageSitesCount: number;
}

export interface BlocSummary {
  bloc: RegionalBloc;
  name: string;
  totalPopulation: number;
  totalGdp: number;
  averageHdi: number;
  countriesCount: number;
  countries: AtlasEntity[];
}

export interface RankingItem {
  rank: number;
  entity: AtlasEntity;
  value: number;
  formattedValue: string;
  unit: string;
  source: string;
  year: number;
}

export interface CorrelationPoint {
  entityId: string;
  name: string;
  region: AfricanRegion;
  x: number;
  y: number;
  size: number;
  flagEmoji: string;
}

// 1. Continental Aggregate Selector
export function getContinentalSummary(): ContinentalSummary {
  const sovereign = atlas.getSovereignCountries();
  
  let totalPop = 0;
  let totalGdp = 0;
  let weightedHdiSum = 0;
  let weightedLifeSum = 0;
  let totalElectrSum = 0;
  let validElectrCount = 0;
  let validHdiPop = 0;
  let validLifePop = 0;

  const growthList: { entity: AtlasEntity; growth: number }[] = [];
  const gdpCapList: { entity: AtlasEntity; gdpPerCapita: number }[] = [];

  for (const country of sovereign) {
    const pop = atlas.getIndicatorValue(country.id, 'SP.POP.TOTL') || 0;
    const gdp = atlas.getIndicatorValue(country.id, 'NY.GDP.MKTP.CD') || 0;
    const hdi = atlas.getIndicatorValue(country.id, 'UNDP.HDI.INDEX');
    const life = atlas.getIndicatorValue(country.id, 'SP.DYN.LE00.IN');
    const elec = atlas.getIndicatorValue(country.id, 'EG.ELC.ACCS.ZS');
    const growth = atlas.getIndicatorValue(country.id, 'NY.GDP.MKTP.KD.ZG');

    totalPop += pop;
    totalGdp += gdp;

    if (pop > 0 && gdp > 0) {
      const perCapita = Math.round((gdp * 1e9) / (pop * 1e6));
      gdpCapList.push({ entity: country, gdpPerCapita: perCapita });
    }

    if (hdi !== null && pop > 0) {
      weightedHdiSum += hdi * pop;
      validHdiPop += pop;
    }

    if (life !== null && pop > 0) {
      weightedLifeSum += life * pop;
      validLifePop += pop;
    }

    if (elec !== null) {
      totalElectrSum += elec;
      validElectrCount += 1;
    }

    if (growth !== null) {
      growthList.push({ entity: country, growth });
    }
  }

  growthList.sort((a, b) => b.growth - a.growth);
  gdpCapList.sort((a, b) => b.gdpPerCapita - a.gdpPerCapita);

  const weightedGdpPerCapita = totalPop > 0 ? Math.round((totalGdp * 1e9) / (totalPop * 1e6)) : 0;
  const weightedHdi = validHdiPop > 0 ? weightedHdiSum / validHdiPop : 0.58;
  const weightedLife = validLifePop > 0 ? weightedLifeSum / validLifePop : 64.5;
  const avgElec = validElectrCount > 0 ? totalElectrSum / validElectrCount : 56.2;
  const totalHeritage = atlas.getHeritageSites().length;

  return {
    totalPopulationMillion: Math.round(totalPop * 10) / 10,
    totalGdpBillionUsd: Math.round(totalGdp * 10) / 10,
    weightedGdpPerCapitaUsd: weightedGdpPerCapita,
    weightedHdi: Math.round(weightedHdi * 1000) / 1000,
    weightedLifeExpectancy: Math.round(weightedLife * 10) / 10,
    averageElectricityAccessPct: Math.round(avgElec * 10) / 10,
    totalHeritageSites: totalHeritage,
    totalSovereignCountries: sovereign.length,
    fastestGrowingNations: growthList.slice(0, 5),
    highestIncomeNations: gdpCapList.slice(0, 5)
  };
}

// 2. Regional Summaries Selector
export function getRegionalSummaries(): RegionSummary[] {
  const regions: AfricanRegion[] = [
    'Northern Africa',
    'Western Africa',
    'Central Africa',
    'Eastern Africa',
    'Southern Africa'
  ];

  return regions.map(region => {
    const countries = atlas.getEntitiesByRegion(region);
    let totalPop = 0;
    let totalGdp = 0;
    let hdiSum = 0;
    let hdiPop = 0;
    let growthSum = 0;
    let lifeSum = 0;
    let lifePop = 0;
    let validGrowth = 0;
    let sitesCount = 0;

    let leadEcon: AtlasEntity | null = null;
    let maxGdp = -1;
    let leadPop: AtlasEntity | null = null;
    let maxPop = -1;

    for (const c of countries) {
      const pop = atlas.getIndicatorValue(c.id, 'SP.POP.TOTL') || 0;
      const gdp = atlas.getIndicatorValue(c.id, 'NY.GDP.MKTP.CD') || 0;
      const hdi = atlas.getIndicatorValue(c.id, 'UNDP.HDI.INDEX');
      const growth = atlas.getIndicatorValue(c.id, 'NY.GDP.MKTP.KD.ZG');
      const life = atlas.getIndicatorValue(c.id, 'SP.DYN.LE00.IN');
      const sites = atlas.getHeritageSites(c.id);

      totalPop += pop;
      totalGdp += gdp;
      sitesCount += sites.length;

      if (gdp > maxGdp) {
        maxGdp = gdp;
        leadEcon = c;
      }
      if (pop > maxPop) {
        maxPop = pop;
        leadPop = c;
      }

      if (hdi !== null && pop > 0) {
        hdiSum += hdi * pop;
        hdiPop += pop;
      }
      if (life !== null && pop > 0) {
        lifeSum += life * pop;
        lifePop += pop;
      }
      if (growth !== null) {
        growthSum += growth;
        validGrowth++;
      }
    }

    return {
      region,
      totalPopulation: Math.round(totalPop * 10) / 10,
      totalGdp: Math.round(totalGdp * 10) / 10,
      averageHdi: hdiPop > 0 ? Math.round((hdiSum / hdiPop) * 1000) / 1000 : 0.55,
      averageGrowth: validGrowth > 0 ? Math.round((growthSum / validGrowth) * 10) / 10 : 4.0,
      averageLifeExpectancy: lifePop > 0 ? Math.round((lifeSum / lifePop) * 10) / 10 : 63.5,
      countryCount: countries.length,
      countries,
      leadingEconomy: leadEcon,
      leadingPopulation: leadPop,
      heritageSitesCount: sitesCount
    };
  });
}

// 3. Regional Blocs Selector
export function getBlocSummaries(): BlocSummary[] {
  const blocsMap: { bloc: RegionalBloc; name: string }[] = [
    { bloc: 'ECOWAS', name: 'Economic Community of West African States' },
    { bloc: 'EAC', name: 'East African Community' },
    { bloc: 'SADC', name: 'Southern African Development Community' },
    { bloc: 'ECCAS', name: 'Economic Community of Central African States' },
    { bloc: 'AMU', name: 'Arab Maghreb Union' },
    { bloc: 'COMESA', name: 'Common Market for Eastern and Southern Africa' },
    { bloc: 'AfCFTA', name: 'African Continental Free Trade Area (All AU)' }
  ];

  return blocsMap.map(({ bloc, name }) => {
    const countries = atlas.getEntitiesByBloc(bloc);
    let totalPop = 0;
    let totalGdp = 0;
    let hdiSum = 0;
    let hdiPop = 0;

    for (const c of countries) {
      const pop = atlas.getIndicatorValue(c.id, 'SP.POP.TOTL') || 0;
      const gdp = atlas.getIndicatorValue(c.id, 'NY.GDP.MKTP.CD') || 0;
      const hdi = atlas.getIndicatorValue(c.id, 'UNDP.HDI.INDEX');

      totalPop += pop;
      totalGdp += gdp;
      if (hdi !== null && pop > 0) {
        hdiSum += hdi * pop;
        hdiPop += pop;
      }
    }

    return {
      bloc,
      name,
      totalPopulation: Math.round(totalPop * 10) / 10,
      totalGdp: Math.round(totalGdp * 10) / 10,
      averageHdi: hdiPop > 0 ? Math.round((hdiSum / hdiPop) * 1000) / 1000 : 0.58,
      countriesCount: countries.length,
      countries
    };
  });
}

// 4. Indicator Rankings Selector
export function getIndicatorRankings(indicatorId: string, limit: number = 54, ascending: boolean = false): RankingItem[] {
  const indicator = atlas.getIndicator(indicatorId);
  if (!indicator) return [];

  const entities = atlas.getAllEntities();
  const items: { entity: AtlasEntity; obs: Observation }[] = [];

  for (const ent of entities) {
    const obs = atlas.getLatestObservation(ent.id, indicatorId);
    if (obs && obs.value !== null && !isNaN(obs.value)) {
      items.push({ entity: ent, obs });
    }
  }

  items.sort((a, b) => {
    return ascending ? (a.obs.value! - b.obs.value!) : (b.obs.value! - a.obs.value!);
  });

  return items.slice(0, limit).map((item, idx) => ({
    rank: idx + 1,
    entity: item.entity,
    value: item.obs.value!,
    formattedValue: `${item.obs.value} ${item.obs.unit}`,
    unit: item.obs.unit,
    source: item.obs.sourceId,
    year: item.obs.period
  }));
}

// 5. Correlation Explorer Selector
export function getCorrelationDataset(indicatorXId: string, indicatorYId: string, sizeIndicatorId: string = 'SP.POP.TOTL'): CorrelationPoint[] {
  const entities = atlas.getAllEntities();
  const points: CorrelationPoint[] = [];

  for (const ent of entities) {
    const xVal = atlas.getIndicatorValue(ent.id, indicatorXId);
    const yVal = atlas.getIndicatorValue(ent.id, indicatorYId);
    const sizeVal = atlas.getIndicatorValue(ent.id, sizeIndicatorId) || 10;
    const media = atlas.getMedia(ent.id);

    if (xVal !== null && yVal !== null && !isNaN(xVal) && !isNaN(yVal)) {
      points.push({
        entityId: ent.id,
        name: ent.name,
        region: ent.region,
        x: Math.round(xVal * 100) / 100,
        y: Math.round(yVal * 100) / 100,
        size: Math.max(8, Math.min(60, Math.sqrt(sizeVal) * 3)),
        flagEmoji: media.flagEmoji
      });
    }
  }

  return points;
}

// 6. Time Series Multi-Country Chart Selector
export function getMultiCountryTimeSeries(entityIds: string[], indicatorId: string): any[] {
  const periods = [2015, 2018, 2020, 2022, 2023, 2024];
  const chartData = periods.map(year => {
    const row: Record<string, any> = { year: year.toString() };
    for (const id of entityIds) {
      const obsList = atlas.getObservations(id, indicatorId);
      const matched = obsList.find(o => o.period === year);
      if (matched && matched.value !== null) {
        row[id] = matched.value;
      }
    }
    return row;
  });

  return chartData;
}
