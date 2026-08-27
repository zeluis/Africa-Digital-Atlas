/**
 * Atlas Data Pipeline Engine
 * Manages the data ingestion, validation, normalization, and export pipeline.
 */

export interface PipelineStep {
  id: string;
  name: string;
  stage: 'Ingestion' | 'Entity Resolution' | 'Normalization' | 'Quality & Provenance' | 'Canonical Export';
  status: 'idle' | 'running' | 'completed' | 'failed';
  durationMs: number;
  recordsProcessed: number;
  outputDescription: string;
}

export const INITIAL_PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'step_1_worldbank_fetch',
    name: 'Fetch World Bank WDI 2024 Series',
    stage: 'Ingestion',
    status: 'completed',
    durationMs: 420,
    recordsProcessed: 1240,
    outputDescription: 'Retrieved 54 African country tables for GDP, trade, infrastructure, and electricity.'
  },
  {
    id: 'step_2_imf_weo_fetch',
    name: 'Fetch IMF World Economic Outlook (October 2024)',
    stage: 'Ingestion',
    status: 'completed',
    durationMs: 380,
    recordsProcessed: 680,
    outputDescription: 'Extracted inflation, debt-to-GDP, growth forecasts, and exchange rate data.'
  },
  {
    id: 'step_3_undp_unesco_fetch',
    name: 'Fetch UNDP HDI & UNESCO World Heritage Registry',
    stage: 'Ingestion',
    status: 'completed',
    durationMs: 290,
    recordsProcessed: 320,
    outputDescription: 'Ingested 104 UNESCO African World Heritage properties and 2024 composite HDI scores.'
  },
  {
    id: 'step_4_entity_resolution',
    name: 'Cross-Match ISO-3166 & Regional Blocs (AU, ECOWAS, SADC, EAC)',
    stage: 'Entity Resolution',
    status: 'completed',
    durationMs: 150,
    recordsProcessed: 58,
    outputDescription: 'Canonical resolution for 54 sovereign states, 4 territories, and 7 regional economic communities.'
  },
  {
    id: 'step_5_normalization',
    name: 'Unit Harmonization & Derived Indicator Calculation',
    stage: 'Normalization',
    status: 'completed',
    durationMs: 180,
    recordsProcessed: 2600,
    outputDescription: 'Calculated GDP per capita, trade openness, and population-weighted regional aggregations.'
  },
  {
    id: 'step_6_conflict_audit',
    name: 'Provenance Tracking & Quality Flag Generation',
    stage: 'Quality & Provenance',
    status: 'completed',
    durationMs: 120,
    recordsProcessed: 4,
    outputDescription: 'Flagged Sudan civil strife data variance and Zimbabwe currency redenomination notes.'
  },
  {
    id: 'step_7_export_generation',
    name: 'Generate exports/africa_canonical.json & SQLite Index',
    stage: 'Canonical Export',
    status: 'completed',
    durationMs: 95,
    recordsProcessed: 58,
    outputDescription: 'Produced production-ready immutable artifacts for offline caching and fast client consumption.'
  }
];
