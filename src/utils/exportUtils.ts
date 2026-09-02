import { atlas } from '../data/atlas-store';
import { AtlasEntity, IndicatorDefinition } from '../data/types';
import { REGIONAL_ROUTE_FLOWS } from '../data/slaveVoyagesData';

/**
 * Triggers a client-side file download with the specified filename and MIME type
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain;charset=utf-8'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports all 54 African countries with selected or all indicators to CSV
 */
export function exportCountriesToCsv(selectedIndicatorIds?: string[]): void {
  const entities = atlas.getAllEntities();
  const allIndicators = atlas.getAllIndicators();
  const indicatorsToExport = selectedIndicatorIds && selectedIndicatorIds.length > 0
    ? allIndicators.filter(i => selectedIndicatorIds.includes(i.id))
    : allIndicators;

  const headers = [
    'ISO3_Code',
    'ISO2_Code',
    'Country_Name',
    'Official_Name',
    'Capital_City',
    'UN_Geoscheme_Region',
    'Subregion',
    'Population',
    'Land_Area_Km2',
    'Languages',
    'Currency_Code',
    ...indicatorsToExport.map(i => `"${i.name.replace(/"/g, '""')} [${i.id}] (${i.unit})"`)
  ];

  const rows = entities.map(entity => {
    const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL');
    const indicatorValues = indicatorsToExport.map(ind => {
      const obs = atlas.getLatestObservation(entity.id, ind.id);
      return obs && obs.value !== null ? obs.value : '';
    });

    const langStr = entity.languages?.official?.join('; ') || '';

    return [
      entity.id,
      entity.iso2,
      `"${entity.name.replace(/"/g, '""')}"`,
      `"${(entity.officialName || entity.name).replace(/"/g, '""')}"`,
      `"${(entity.capital || '').replace(/"/g, '""')}"`,
      `"${entity.region}"`,
      `"${entity.subregion || ''}"`,
      pop || '',
      entity.landAreaKm2 || '',
      `"${langStr.replace(/"/g, '""')}"`,
      entity.currency?.code || '',
      ...indicatorValues
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  downloadFile(`africa_atlas_master_dataset_${new Date().toISOString().slice(0, 10)}.csv`, csvContent, 'text/csv;charset=utf-8');
}

/**
 * Exports complete country and indicator catalog as structured JSON
 */
export function exportCountriesToJson(selectedIndicatorIds?: string[]): void {
  const manifest = atlas.getManifest();
  const entities = atlas.getAllEntities();
  const allIndicators = atlas.getAllIndicators();
  const indicatorsToExport = selectedIndicatorIds && selectedIndicatorIds.length > 0
    ? allIndicators.filter(i => selectedIndicatorIds.includes(i.id))
    : allIndicators;

  const dataset = entities.map(entity => {
    const metrics: Record<string, { value: number | null; unit: string; period?: number; sourceId?: string }> = {};
    indicatorsToExport.forEach(ind => {
      const obs = atlas.getLatestObservation(entity.id, ind.id);
      metrics[ind.id] = {
        value: obs && obs.value !== null ? obs.value : null,
        unit: ind.unit,
        period: obs?.period,
        sourceId: obs?.sourceId || ind.preferredSource
      };
    });

    const pop = atlas.getIndicatorValue(entity.id, 'SP.POP.TOTL');

    return {
      id: entity.id,
      iso2: entity.iso2,
      name: entity.name,
      officialName: entity.officialName,
      capital: entity.capital,
      region: entity.region,
      subregion: entity.subregion,
      population: pop,
      landAreaKm2: entity.landAreaKm2,
      languages: entity.languages,
      currency: entity.currency,
      coordinates: entity.coordinates,
      metrics
    };
  });

  const payload = {
    metadata: {
      title: 'Africa Data Atlas & Socio-Economic Database',
      version: manifest.atlasVersion,
      exportedAt: new Date().toISOString(),
      license: 'CC-BY-4.0 Open Access',
      countryCount: entities.length,
      indicatorCount: indicatorsToExport.length,
      sources: ['World Bank WDI 2024', 'IMF WEO 2024', 'UNDP HDI 2024', 'UNESCO World Heritage', 'SlaveVoyages 2024']
    },
    indicators: indicatorsToExport.map(i => ({
      id: i.id,
      name: i.name,
      domain: i.domain,
      unit: i.unit,
      source: i.preferredSource,
      definition: i.definition
    })),
    data: dataset
  };

  downloadFile(`africa_atlas_export_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
}

/**
 * Exports bivariate correlation dataset to CSV
 */
export function exportBivariateCorrelationToCsv(
  indicatorX: IndicatorDefinition,
  indicatorY: IndicatorDefinition,
  data: Array<{ entityId: string; entityName: string; region: string; x: number; y: number; size?: number }>,
  stats: { r: number; r2: number; slope: number; intercept: number }
): void {
  const metaLines = [
    `# Africa Data Atlas - Bivariate Correlation Export`,
    `# Generated At: ${new Date().toISOString()}`,
    `# Indicator X: ${indicatorX.name} [${indicatorX.id}] (${indicatorX.unit})`,
    `# Indicator Y: ${indicatorY.name} [${indicatorY.id}] (${indicatorY.unit})`,
    `# Sample Size (N): ${data.length}`,
    `# Pearson Correlation (r): ${stats.r.toFixed(4)}`,
    `# Coefficient of Determination (R^2): ${stats.r2.toFixed(4)}`,
    `# Linear Regression Fit: Y = ${stats.slope.toFixed(4)} * X + ${stats.intercept.toFixed(4)}`,
    `#`
  ];

  const headers = ['Country_ID', 'Country_Name', 'UN_Region', `X_${indicatorX.id}`, `Y_${indicatorY.id}`, 'Fitted_Y', 'Residual'];
  const rows = data.map(d => {
    const fittedY = stats.slope * d.x + stats.intercept;
    const residual = d.y - fittedY;
    return [
      d.entityId,
      `"${d.entityName.replace(/"/g, '""')}"`,
      `"${d.region}"`,
      d.x,
      d.y,
      fittedY.toFixed(4),
      residual.toFixed(4)
    ].join(',');
  });

  const content = [...metaLines, headers.join(','), ...rows].join('\r\n');
  downloadFile(`correlation_${indicatorX.id}_vs_${indicatorY.id}.csv`, content, 'text/csv;charset=utf-8');
}

/**
 * Exports Trans-Atlantic Slave Trade Route Flows to CSV
 */
export function exportSlaveVoyagesToCsv(): void {
  const headers = [
    'Route_ID',
    'Source_African_Region',
    'Target_American_Region',
    'Documented_Voyages_Count',
    'Embarked_Captives_Count',
    'Disembarked_Captives_Count',
    'Captive_Mortality_Count',
    'Mortality_Rate_Pct',
    'Peak_Century',
    'Primary_National_Carriers'
  ];

  const rows = REGIONAL_ROUTE_FLOWS.map(route => [
    route.id,
    `"${route.sourceRegion}"`,
    `"${route.targetRegion}"`,
    route.voyagesCount,
    route.embarkedCount,
    route.disembarkedCount,
    route.embarkedCount - route.disembarkedCount,
    route.avgMortalityRate,
    `"${route.peakCentury}"`,
    `"${route.primaryCarriers.map(c => `${c.carrier} (${c.percentage}%)`).join('; ')}"`
  ].join(','));

  const content = [headers.join(','), ...rows].join('\r\n');
  downloadFile(`transatlantic_slave_voyages_regional_flows.csv`, content, 'text/csv;charset=utf-8');
}

/**
 * Generates Academic BibTeX references for master reports and atlas data
 */
export function exportAcademicBibtex(reportKey?: 'atlas' | 'molecular' | 'nunn'): void {
  const bibtexEntries: Record<string, string> = {
    atlas: `@misc{africa_data_atlas_2026,
  title = {Pan-African Socioeconomic & Geographic Data Atlas},
  author = {{Africa Data Atlas Collaborative}},
  year = {2026},
  howpublished = {\\url{https://africa-atlas.org}},
  note = {Synthesizing World Bank WDI 2024, IMF WEO, and UNDP Data}
}`,
    molecular: `@article{micheletti2020genetic,
  title = {Genetic Consequences of the Transatlantic Slave Trade in the Americas},
  author = {Micheletti, Steven J. and Bryc, Katarzyna and Ancona, Joanna L. and others},
  journal = {The American Journal of Human Genetics},
  volume = {107},
  number = {2},
  pages = {265--277},
  year = {2020},
  publisher = {Elsevier},
  doi = {10.1016/j.ajhg.2020.06.012}
}

@article{forteslima2017genomic,
  title = {Genomic insights into the origin and demographic history of Runaways (Maroons) in French Guiana and Suriname},
  author = {Fortes-Lima, Cesar and Laurent, Romain and Thouzeau, Valentin and others},
  journal = {Nature Communications},
  volume = {8},
  pages = {1496},
  year = {2017},
  doi = {10.1038/s41467-017-01496-6}
}`,
    nunn: `@article{nunn2008long,
  title = {The Long-Term Effects of Africa's Slave Trades},
  author = {Nunn, Nathan},
  journal = {The Quarterly Journal of Economics},
  volume = {123},
  number = {1},
  pages = {139--176},
  year = {2008},
  publisher = {MIT Press},
  doi = {10.1162/qjec.2008.123.1.139}
}

@article{nunnwantchekon2011slave,
  title = {The Slave Trade and the Origins of Mistrust in Africa},
  author = {Nunn, Nathan and Wantchekon, Leonard},
  journal = {American Economic Review},
  volume = {101},
  number = {7},
  pages = {3221--3252},
  year = {2011},
  doi = {10.1257/aer.101.7.3221}
}

@article{whatley2014gun,
  title = {The Gun-Slave Hypothesis and the 18th Century British Slave Trade},
  author = {Whatley, Warren C.},
  journal = {The Journal of Economic History},
  volume = {74},
  number = {2},
  pages = {516--546},
  year = {2014},
  publisher = {Cambridge University Press}
}`
  };

  const selectedBib = reportKey ? bibtexEntries[reportKey] : Object.values(bibtexEntries).join('\n\n');
  downloadFile(`citations_${reportKey || 'all'}.bib`, selectedBib, 'text/plain;charset=utf-8');
}
