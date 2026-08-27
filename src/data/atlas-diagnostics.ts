import { atlas } from './atlas-store';

export interface IntegrityAuditResult {
  status: 'passed' | 'warnings' | 'failed';
  totalEntitiesChecked: number;
  totalIndicatorsChecked: number;
  totalObservationsChecked: number;
  unresolvedConflicts: number;
  coveragePercentage: number;
  diagnostics: {
    type: 'info' | 'warning' | 'error';
    module: string;
    message: string;
  }[];
}

export function runAtlasIntegrityAudit(): IntegrityAuditResult {
  const entities = atlas.getAllEntities();
  const indicators = atlas.getAllIndicators();
  const diagnostics: { type: 'info' | 'warning' | 'error'; module: string; message: string }[] = [];

  let totalObservationsCount = 0;
  let missingKeyValues = 0;

  // 1. Validate entities
  for (const ent of entities) {
    if (!ent.id || !ent.name || !ent.region) {
      diagnostics.push({
        type: 'error',
        module: 'Entities',
        message: `Entity ${ent.id} is missing core identity attributes.`
      });
    }

    // Check core observations
    const pop = atlas.getIndicatorValue(ent.id, 'SP.POP.TOTL');
    const gdp = atlas.getIndicatorValue(ent.id, 'NY.GDP.MKTP.CD');
    const hdi = atlas.getIndicatorValue(ent.id, 'UNDP.HDI.INDEX');

    if (pop === null || gdp === null || hdi === null) {
      missingKeyValues++;
      diagnostics.push({
        type: 'warning',
        module: 'Observations',
        message: `Entity ${ent.id} (${ent.name}) has partial key indicator coverage.`
      });
    }

    const obsList = atlas.getObservations(ent.id, 'NY.GDP.MKTP.CD');
    totalObservationsCount += obsList.length;
  }

  // 2. Validate indicators
  for (const ind of indicators) {
    if (!ind.id || !ind.name || !ind.domain) {
      diagnostics.push({
        type: 'error',
        module: 'Indicators',
        message: `Indicator ${ind.id} definition incomplete.`
      });
    }
  }

  // 3. Check Quality Flags & Conflicts
  const qualityFlags = atlas.getQualityFlags();
  const conflictCount = qualityFlags.filter(q => q.severity === 'conflict').length;

  diagnostics.push({
    type: 'info',
    module: 'Manifest',
    message: `Atlas v1.2 loaded successfully with ${entities.length} entities and ${indicators.length} normalized indicators.`
  });

  const totalPossible = entities.length * 3;
  const coveragePct = Math.round(((totalPossible - missingKeyValues) / totalPossible) * 100);

  return {
    status: missingKeyValues === 0 ? 'passed' : 'warnings',
    totalEntitiesChecked: entities.length,
    totalIndicatorsChecked: indicators.length,
    totalObservationsChecked: totalObservationsCount,
    unresolvedConflicts: conflictCount,
    coveragePercentage: coveragePct,
    diagnostics
  };
}
