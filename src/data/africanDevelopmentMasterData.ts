/**
 * Structural and Evolutionary Foundations of African Development Dataset
 * A Comprehensive Synthesis of Macro-Geonomic, Historical-Institutional, and Contemporary Geopolitical Paradigms
 * Based on research by Ashraf & Galor (2013), Nunn (2008), Nunn & Wantchekon (2011),
 * Acemoglu, Johnson & Robinson (2001), Henn & Robinson (2024), Tadei (2020),
 * Michalopoulos & Papaioannou (2016), and the 2026 AU/UN Global Geopolitical Accords.
 */
import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface MasterReportSection {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  iconName: string;
  summary: string;
  keyTheses: string[];
}

export interface GeonomicDiversityDataPoint {
  migratoryDistanceKm: number;
  region: string;
  expectedHeterozygosity: number;
  historicalDevelopmentIndex: number;
  cognitiveSpecializationScore: number;
  socialCoordinationTrustScore: number;
  compositeProductivity: number;
  notes: string;
}

export interface NunnSlaveExportRecord {
  regionOrModernCountry: string;
  totalExportsMillions: number;
  atlanticSharePct: number;
  transSaharanSharePct: number;
  redSeaIndianOceanPct: number;
  currentGdpPerCapitaUsd: number;
  mistrustIndex: number; // 0 to 100
  historicalShockLevel: 'Severe' | 'High' | 'Moderate' | 'Low';
}

export interface TadeiMonopsonyCommodity {
  commodity: string;
  territory: string;
  buyerCartel: string;
  coercionMechanism: string;
  worldPortPriceDollars: number;
  transportLogisticsCosts: number;
  competitiveCounterfactualPrice: number;
  actualProducerPricePaid: number;
  absolutePriceGap: number;
  rawExtractionRatePct: number;
  reductionInGainsFromTradePct: number;
}

export interface GeopoliticalAccordRecord {
  initiative: string;
  leadActors: string;
  milestoneDate: string;
  legalDiplomaticStatus: string;
  coreDemandsOrMechanisms: string[];
  systemicConflictOrObstacle: string;
}

export interface PreColonialGovernanceData {
  totalPolities1880: number;
  decentralizedNonStatePct: number;
  centralizedBureaucraticStatePct: number;
  analyticalFinding: string;
  colonialDisruption: string;
}

export interface CompoundingStructuralEpoch {
  id: string;
  epochLabel: string;
  timeRange: string;
  title: string;
  gainsFromTradePct: number;
  socialTrustScore: number;
  sovereignAgencyPct: number;
  extractivePressurePct: number;
  economicIndex: number;
  primaryMechanism: string;
  keyScholarsOrAccord: string;
  accentColor: string;
}

export const GEONOMIC_DIVERSITY_GRADIENT: GeonomicDiversityDataPoint[] = [];
export const NUNN_SLAVE_TRADE_EXTRACTION: NunnSlaveExportRecord[] = [];
export const TADEI_MONOPSONY_CASE_STUDIES: TadeiMonopsonyCommodity[] = [];
export const CONTEMPORARY_GEOPOLITICAL_PARADIGMS: GeopoliticalAccordRecord[] = [];
export const PRE_COLONIAL_GOVERNANCE_DATA: PreColonialGovernanceData = {
  totalPolities1880: 45000,
  decentralizedNonStatePct: 98.2,
  centralizedBureaucraticStatePct: 1.8,
  analyticalFinding: '',
  colonialDisruption: ''
};
export const MASTER_REPORT_SECTIONS: MasterReportSection[] = [];
export const COMPOUNDING_STRUCTURAL_EPOCHS: CompoundingStructuralEpoch[] = [];

const masterDataUrl = new URL('./africanDevelopmentMasterData.json', import.meta.url).href;

const masterDataStore = createLazyAssetStore<{
  geonomicDiversityGradient: GeonomicDiversityDataPoint[];
  nunnSlaveTradeExtraction: NunnSlaveExportRecord[];
  tadeiMonopsonyCaseStudies: TadeiMonopsonyCommodity[];
  contemporaryGeopoliticalParadigms: GeopoliticalAccordRecord[];
  preColonialGovernanceData: PreColonialGovernanceData;
  masterReportSections: MasterReportSection[];
  compoundingStructuralEpochs: CompoundingStructuralEpoch[];
}>(
  [masterDataUrl],
  ([payload]) => {
    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.geonomicDiversityGradient) && GEONOMIC_DIVERSITY_GRADIENT.length === 0) {
        GEONOMIC_DIVERSITY_GRADIENT.push(...payload.geonomicDiversityGradient);
      }
      if (Array.isArray(payload.nunnSlaveTradeExtraction) && NUNN_SLAVE_TRADE_EXTRACTION.length === 0) {
        NUNN_SLAVE_TRADE_EXTRACTION.push(...payload.nunnSlaveTradeExtraction);
      }
      if (Array.isArray(payload.tadeiMonopsonyCaseStudies) && TADEI_MONOPSONY_CASE_STUDIES.length === 0) {
        TADEI_MONOPSONY_CASE_STUDIES.push(...payload.tadeiMonopsonyCaseStudies);
      }
      if (Array.isArray(payload.contemporaryGeopoliticalParadigms) && CONTEMPORARY_GEOPOLITICAL_PARADIGMS.length === 0) {
        CONTEMPORARY_GEOPOLITICAL_PARADIGMS.push(...payload.contemporaryGeopoliticalParadigms);
      }
      if (payload.preColonialGovernanceData && typeof payload.preColonialGovernanceData === 'object') {
        Object.assign(PRE_COLONIAL_GOVERNANCE_DATA, payload.preColonialGovernanceData);
      }
      if (Array.isArray(payload.masterReportSections) && MASTER_REPORT_SECTIONS.length === 0) {
        MASTER_REPORT_SECTIONS.push(...payload.masterReportSections);
      }
      if (Array.isArray(payload.compoundingStructuralEpochs) && COMPOUNDING_STRUCTURAL_EPOCHS.length === 0) {
        COMPOUNDING_STRUCTURAL_EPOCHS.push(...payload.compoundingStructuralEpochs);
      }
    }
    return {
      geonomicDiversityGradient: GEONOMIC_DIVERSITY_GRADIENT,
      nunnSlaveTradeExtraction: NUNN_SLAVE_TRADE_EXTRACTION,
      tadeiMonopsonyCaseStudies: TADEI_MONOPSONY_CASE_STUDIES,
      contemporaryGeopoliticalParadigms: CONTEMPORARY_GEOPOLITICAL_PARADIGMS,
      preColonialGovernanceData: PRE_COLONIAL_GOVERNANCE_DATA,
      masterReportSections: MASTER_REPORT_SECTIONS,
      compoundingStructuralEpochs: COMPOUNDING_STRUCTURAL_EPOCHS,
    };
  },
  () => ({
    geonomicDiversityGradient: GEONOMIC_DIVERSITY_GRADIENT,
    nunnSlaveTradeExtraction: NUNN_SLAVE_TRADE_EXTRACTION,
    tadeiMonopsonyCaseStudies: TADEI_MONOPSONY_CASE_STUDIES,
    contemporaryGeopoliticalParadigms: CONTEMPORARY_GEOPOLITICAL_PARADIGMS,
    preColonialGovernanceData: PRE_COLONIAL_GOVERNANCE_DATA,
    masterReportSections: MASTER_REPORT_SECTIONS,
    compoundingStructuralEpochs: COMPOUNDING_STRUCTURAL_EPOCHS,
  })
);

export const ensureAfricanDevelopmentMasterLoaded = masterDataStore.ensureLoaded;
export const isAfricanDevelopmentMasterLoaded = masterDataStore.isLoaded;
export const subscribeAfricanDevelopmentMaster = masterDataStore.subscribe;
export const useAfricanDevelopmentMasterLoaded = masterDataStore.useLoaded;
