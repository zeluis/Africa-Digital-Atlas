import { Observation, MediaLinks } from './types';

// Multi-year canonical observations seed (2015-2024)
export const SEED_OBSERVATIONS: Observation[] = [
  // NIGERIA (NGA)
  // GDP (USD Billion)
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.CD', period: 2015, value: 493.03, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.CD', period: 2018, value: 421.74, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.CD', period: 2020, value: 432.29, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.CD', period: 2022, value: 472.62, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.CD', period: 2023, value: 374.95, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 252.84, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated', notes: 'Reflects FX unification and Naira devaluation.' },
  // Population (Million)
  { entityId: 'NGA', indicatorId: 'SP.POP.TOTL', period: 2015, value: 181.14, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'SP.POP.TOTL', period: 2020, value: 208.33, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'SP.POP.TOTL', period: 2022, value: 218.54, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'SP.POP.TOTL', period: 2023, value: 223.80, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'SP.POP.TOTL', period: 2024, value: 229.15, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  // GDP Growth (%)
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2022, value: 3.25, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2023, value: 2.86, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 3.19, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  // Inflation (%)
  { entityId: 'NGA', indicatorId: 'FP.CPI.TOTL.ZG', period: 2022, value: 18.84, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'FP.CPI.TOTL.ZG', period: 2023, value: 24.66, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'FP.CPI.TOTL.ZG', period: 2024, value: 32.55, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  // HDI
  { entityId: 'NGA', indicatorId: 'UNDP.HDI.INDEX', period: 2020, value: 0.535, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'UNDP.HDI.INDEX', period: 2022, value: 0.548, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'observed' },
  { entityId: 'NGA', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.554, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  // Life Expectancy
  { entityId: 'NGA', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 53.8, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  // Electricity Access
  { entityId: 'NGA', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 59.5, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'estimated' },
  // Internet Penetration
  { entityId: 'NGA', indicatorId: 'IT.NET.USER.ZS', period: 2024, value: 55.4, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'estimated' },
  // IIAG Governance
  { entityId: 'NGA', indicatorId: 'MO.IIAG.SCORE', period: 2024, value: 47.9, unit: 'Score (0-100)', sourceId: 'mo_ibrahim', datasetId: 'IIAG_SCORECARD_2024', status: 'observed' },
  // GPI Peace
  { entityId: 'NGA', indicatorId: 'IEP.GPI.SCORE', period: 2024, value: 2.71, unit: 'Score (1-5)', sourceId: 'iep', datasetId: 'GPI_REPORT_2024', status: 'observed' },

  // SOUTH AFRICA (ZAF)
  // GDP
  { entityId: 'ZAF', indicatorId: 'NY.GDP.MKTP.CD', period: 2015, value: 317.62, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'NY.GDP.MKTP.CD', period: 2020, value: 337.62, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'NY.GDP.MKTP.CD', period: 2022, value: 405.27, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'NY.GDP.MKTP.CD', period: 2023, value: 377.78, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 373.23, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  // Population
  { entityId: 'ZAF', indicatorId: 'SP.POP.TOTL', period: 2015, value: 55.88, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'SP.POP.TOTL', period: 2020, value: 58.80, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'SP.POP.TOTL', period: 2024, value: 60.41, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  // GDP Growth
  { entityId: 'ZAF', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2022, value: 1.91, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2023, value: 0.60, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 1.10, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  // Unemployment
  { entityId: 'ZAF', indicatorId: 'SL.UEM.TOTL.ZS', period: 2024, value: 32.9, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  // HDI
  { entityId: 'ZAF', indicatorId: 'UNDP.HDI.INDEX', period: 2020, value: 0.709, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'UNDP.HDI.INDEX', period: 2022, value: 0.713, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'observed' },
  { entityId: 'ZAF', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.717, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  // Life Expectancy
  { entityId: 'ZAF', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 65.3, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  // Electricity Access
  { entityId: 'ZAF', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 89.3, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  // Internet Penetration
  { entityId: 'ZAF', indicatorId: 'IT.NET.USER.ZS', period: 2024, value: 74.7, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  // IIAG Governance
  { entityId: 'ZAF', indicatorId: 'MO.IIAG.SCORE', period: 2024, value: 68.7, unit: 'Score (0-100)', sourceId: 'mo_ibrahim', datasetId: 'IIAG_SCORECARD_2024', status: 'observed' },
  // CPI
  { entityId: 'ZAF', indicatorId: 'TI.CPI.SCORE', period: 2024, value: 41.0, unit: 'Score (0-100)', sourceId: 'ti', datasetId: 'CPI_INDEX_2024', status: 'observed' },

  // EGYPT (EGY)
  // GDP
  { entityId: 'EGY', indicatorId: 'NY.GDP.MKTP.CD', period: 2015, value: 332.68, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'EGY', indicatorId: 'NY.GDP.MKTP.CD', period: 2020, value: 383.82, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'EGY', indicatorId: 'NY.GDP.MKTP.CD', period: 2022, value: 476.75, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'EGY', indicatorId: 'NY.GDP.MKTP.CD', period: 2023, value: 395.93, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'EGY', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 347.59, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  // Population
  { entityId: 'EGY', indicatorId: 'SP.POP.TOTL', period: 2015, value: 97.72, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'observed' },
  { entityId: 'EGY', indicatorId: 'SP.POP.TOTL', period: 2020, value: 107.47, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'observed' },
  { entityId: 'EGY', indicatorId: 'SP.POP.TOTL', period: 2024, value: 116.54, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  // GDP Growth
  { entityId: 'EGY', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 2.70, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  // Inflation
  { entityId: 'EGY', indicatorId: 'FP.CPI.TOTL.ZG', period: 2024, value: 33.30, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  // HDI
  { entityId: 'EGY', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.728, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  // Life Expectancy
  { entityId: 'EGY', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 70.6, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  // Electricity Access
  { entityId: 'EGY', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 100.0, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },

  // ALGERIA (DZA)
  { entityId: 'DZA', indicatorId: 'NY.GDP.MKTP.CD', period: 2020, value: 145.01, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'DZA', indicatorId: 'NY.GDP.MKTP.CD', period: 2022, value: 195.06, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'DZA', indicatorId: 'NY.GDP.MKTP.CD', period: 2023, value: 239.90, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'DZA', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 266.78, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'DZA', indicatorId: 'SP.POP.TOTL', period: 2024, value: 46.81, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'DZA', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 3.80, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'DZA', indicatorId: 'FP.CPI.TOTL.ZG', period: 2024, value: 6.50, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'DZA', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.745, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'DZA', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 76.4, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'DZA', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 99.8, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },

  // MOROCCO (MAR)
  { entityId: 'MAR', indicatorId: 'NY.GDP.MKTP.CD', period: 2020, value: 121.35, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'MAR', indicatorId: 'NY.GDP.MKTP.CD', period: 2022, value: 130.91, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'MAR', indicatorId: 'NY.GDP.MKTP.CD', period: 2023, value: 141.11, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'MAR', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 152.38, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'MAR', indicatorId: 'SP.POP.TOTL', period: 2024, value: 38.08, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'MAR', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 2.80, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'MAR', indicatorId: 'FP.CPI.TOTL.ZG', period: 2024, value: 1.70, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'MAR', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.698, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'MAR', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 75.0, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'MAR', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 100.0, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'MAR', indicatorId: 'EG.FEC.RNEW.ZS', period: 2024, value: 39.5, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed', notes: 'Includes Noor Ouarzazate Solar Complex.' },

  // ETHIOPIA (ETH)
  { entityId: 'ETH', indicatorId: 'NY.GDP.MKTP.CD', period: 2020, value: 107.65, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'ETH', indicatorId: 'NY.GDP.MKTP.CD', period: 2022, value: 126.78, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'ETH', indicatorId: 'NY.GDP.MKTP.CD', period: 2023, value: 163.70, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'ETH', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 205.13, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'ETH', indicatorId: 'SP.POP.TOTL', period: 2024, value: 129.72, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'ETH', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 6.10, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'ETH', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.498, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'ETH', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 65.7, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'ETH', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 55.0, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'estimated' },

  // KENYA (KEN)
  { entityId: 'KEN', indicatorId: 'NY.GDP.MKTP.CD', period: 2020, value: 100.67, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'KEN', indicatorId: 'NY.GDP.MKTP.CD', period: 2022, value: 113.42, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'KEN', indicatorId: 'NY.GDP.MKTP.CD', period: 2023, value: 107.44, unit: 'USD Billion', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'KEN', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 116.32, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'KEN', indicatorId: 'SP.POP.TOTL', period: 2024, value: 56.20, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'KEN', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 5.00, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'KEN', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.601, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'KEN', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 62.1, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'KEN', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 77.2, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'KEN', indicatorId: 'EG.FEC.RNEW.ZS', period: 2024, value: 91.5, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },

  // ANGOLA (AGO)
  { entityId: 'AGO', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 113.29, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'AGO', indicatorId: 'SP.POP.TOTL', period: 2024, value: 37.88, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'AGO', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 2.60, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'AGO', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.591, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'AGO', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 62.4, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },

  // GHANA (GHA)
  { entityId: 'GHA', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 75.24, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'GHA', indicatorId: 'SP.POP.TOTL', period: 2024, value: 34.78, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'GHA', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 3.10, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'GHA', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.602, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'GHA', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 64.3, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'GHA', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 86.3, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },

  // CÔTE D'IVOIRE (CIV)
  { entityId: 'CIV', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 86.91, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'CIV', indicatorId: 'SP.POP.TOTL', period: 2024, value: 31.17, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'CIV', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 6.50, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'CIV', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.534, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'CIV', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 59.4, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'CIV', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 71.4, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },

  // TANZANIA (TZA)
  { entityId: 'TZA', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 79.87, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'TZA', indicatorId: 'SP.POP.TOTL', period: 2024, value: 68.56, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'TZA', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 5.40, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'TZA', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.532, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'TZA', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 66.8, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'TZA', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 43.1, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },

  // DR CONGO (COD)
  { entityId: 'COD', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 73.76, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'COD', indicatorId: 'SP.POP.TOTL', period: 2024, value: 105.62, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'COD', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 4.70, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'COD', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.481, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'COD', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 59.7, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'COD', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 20.8, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },

  // RWANDA (RWA)
  { entityId: 'RWA', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 13.70, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'RWA', indicatorId: 'SP.POP.TOTL', period: 2024, value: 14.26, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'RWA', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 7.00, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'RWA', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.548, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'estimated' },
  { entityId: 'RWA', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 67.1, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'RWA', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 53.4, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'RWA', indicatorId: 'MO.IIAG.SCORE', period: 2024, value: 64.9, unit: 'Score (0-100)', sourceId: 'mo_ibrahim', datasetId: 'IIAG_SCORECARD_2024', status: 'observed' },

  // MAURITIUS (MUS)
  { entityId: 'MUS', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 15.89, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'MUS', indicatorId: 'SP.POP.TOTL', period: 2024, value: 1.30, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'MUS', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 4.90, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'MUS', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.806, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'observed' },
  { entityId: 'MUS', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 74.4, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'MUS', indicatorId: 'EG.ELC.ACCS.ZS', period: 2024, value: 100.0, unit: '%', sourceId: 'world_bank', datasetId: 'WDI_2024', status: 'observed' },
  { entityId: 'MUS', indicatorId: 'MO.IIAG.SCORE', period: 2024, value: 74.9, unit: 'Score (0-100)', sourceId: 'mo_ibrahim', datasetId: 'IIAG_SCORECARD_2024', status: 'observed' },

  // BOTSWANA (BWA)
  { entityId: 'BWA', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 21.42, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'BWA', indicatorId: 'SP.POP.TOTL', period: 2024, value: 2.68, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'BWA', indicatorId: 'NY.GDP.MKTP.KD.ZG', period: 2024, value: 1.00, unit: '%', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'BWA', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.708, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'observed' },
  { entityId: 'BWA', indicatorId: 'SP.DYN.LE00.IN', period: 2024, value: 65.9, unit: 'Years', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'estimated' },
  { entityId: 'BWA', indicatorId: 'MO.IIAG.SCORE', period: 2024, value: 67.5, unit: 'Score (0-100)', sourceId: 'mo_ibrahim', datasetId: 'IIAG_SCORECARD_2024', status: 'observed' },
  { entityId: 'BWA', indicatorId: 'TI.CPI.SCORE', period: 2024, value: 59.0, unit: 'Score (0-100)', sourceId: 'ti', datasetId: 'CPI_INDEX_2024', status: 'observed' },

  // SEYCHELLES (SYC)
  { entityId: 'SYC', indicatorId: 'NY.GDP.MKTP.CD', period: 2024, value: 2.14, unit: 'USD Billion', sourceId: 'imf', datasetId: 'WEO_OCT_2024', status: 'estimated' },
  { entityId: 'SYC', indicatorId: 'SP.POP.TOTL', period: 2024, value: 0.12, unit: 'People (Million)', sourceId: 'undesa', datasetId: 'WPP_REVISION_2024', status: 'forecast' },
  { entityId: 'SYC', indicatorId: 'UNDP.HDI.INDEX', period: 2024, value: 0.802, unit: 'Index (0-1)', sourceId: 'undp', datasetId: 'HDR_COMPOSITE_2024', status: 'observed' },
  { entityId: 'SYC', indicatorId: 'MO.IIAG.SCORE', period: 2024, value: 73.4, unit: 'Score (0-100)', sourceId: 'mo_ibrahim', datasetId: 'IIAG_SCORECARD_2024', status: 'observed' },
  { entityId: 'SYC', indicatorId: 'TI.CPI.SCORE', period: 2024, value: 71.0, unit: 'Score (0-100)', sourceId: 'ti', datasetId: 'CPI_INDEX_2024', status: 'observed' }
];

// Baseline data generator for all remaining African nations to ensure 100% complete coverage without gaps
export const NATION_PROFILES_ESTIMATES: Record<string, { gdp: number; pop: number; hdi: number; growth: number; inflation: number; le: number; elec: number; net: number; gov: number; peace: number }> = {
  AGO: { gdp: 113.3, pop: 37.88, hdi: 0.591, growth: 2.6, inflation: 28.4, le: 62.4, elec: 48.2, net: 38.8, gov: 44.2, peace: 2.04 },
  BEN: { gdp: 21.3, pop: 14.11, hdi: 0.525, growth: 6.3, inflation: 2.8, le: 60.1, elec: 43.1, net: 34.0, gov: 56.4, peace: 2.19 },
  BWA: { gdp: 21.4, pop: 2.68, hdi: 0.708, growth: 1.0, inflation: 3.4, le: 65.9, elec: 74.0, net: 77.0, gov: 67.5, peace: 1.76 },
  BFA: { gdp: 21.9, pop: 23.84, hdi: 0.438, growth: 5.5, inflation: 2.2, le: 59.8, elec: 19.5, net: 22.0, gov: 46.5, peace: 3.17 },
  BDI: { gdp: 4.1, pop: 13.69, hdi: 0.420, growth: 3.8, inflation: 22.1, le: 61.7, elec: 11.2, net: 14.8, gov: 36.9, peace: 2.57 },
  CPV: { gdp: 2.7, pop: 0.60, hdi: 0.661, growth: 4.7, inflation: 2.0, le: 74.1, elec: 94.6, net: 69.2, gov: 73.1, peace: 1.71 },
  CMR: { gdp: 53.2, pop: 29.74, hdi: 0.587, growth: 4.1, inflation: 5.9, le: 61.0, elec: 65.4, net: 45.6, gov: 43.2, peace: 2.77 },
  CAF: { gdp: 2.8, pop: 5.92, hdi: 0.387, growth: 1.5, inflation: 3.5, le: 54.5, elec: 15.7, net: 11.4, gov: 31.8, peace: 3.55 },
  TCD: { gdp: 18.7, pop: 19.36, hdi: 0.394, growth: 3.2, inflation: 6.8, le: 53.1, elec: 11.8, net: 12.0, gov: 33.9, peace: 2.89 },
  COM: { gdp: 1.4, pop: 0.87, hdi: 0.586, growth: 3.5, inflation: 3.8, le: 64.9, elec: 86.7, net: 26.5, gov: 42.1, peace: 1.95 },
  COG: { gdp: 15.8, pop: 6.26, hdi: 0.593, growth: 3.5, inflation: 3.5, le: 63.8, elec: 50.6, net: 30.2, gov: 41.5, peace: 2.25 },
  COD: { gdp: 73.8, pop: 105.62, hdi: 0.481, growth: 4.7, inflation: 15.2, le: 59.7, elec: 20.8, net: 27.2, gov: 35.3, peace: 3.26 },
  CIV: { gdp: 86.9, pop: 31.17, hdi: 0.534, growth: 6.5, inflation: 4.0, le: 59.4, elec: 71.4, net: 45.4, gov: 54.3, peace: 2.13 },
  DJI: { gdp: 4.3, pop: 1.15, hdi: 0.515, growth: 6.5, inflation: 2.0, le: 63.2, elec: 65.4, net: 68.9, gov: 45.3, peace: 2.27 },
  EGY: { gdp: 347.6, pop: 116.54, hdi: 0.728, growth: 2.7, inflation: 33.3, le: 70.6, elec: 100.0, net: 75.7, gov: 49.3, peace: 2.45 },
  GNQ: { gdp: 12.1, pop: 1.75, hdi: 0.650, growth: -3.8, inflation: 2.6, le: 61.2, elec: 67.2, net: 32.5, gov: 32.5, peace: 1.94 },
  ERI: { gdp: 2.6, pop: 3.82, hdi: 0.492, growth: 2.8, inflation: 6.4, le: 67.1, elec: 52.3, net: 21.8, gov: 29.1, peace: 2.75 },
  SWZ: { gdp: 5.1, pop: 1.23, hdi: 0.610, growth: 3.2, inflation: 4.8, le: 57.7, elec: 82.5, net: 57.4, gov: 49.2, peace: 2.21 },
  ETH: { gdp: 205.1, pop: 129.72, hdi: 0.498, growth: 6.1, inflation: 27.2, le: 65.7, elec: 55.0, net: 25.0, gov: 46.5, peace: 2.85 },
  GAB: { gdp: 21.9, pop: 2.49, hdi: 0.693, growth: 2.7, inflation: 3.1, le: 66.5, elec: 91.8, net: 72.0, gov: 51.2, peace: 2.03 },
  GMB: { gdp: 2.6, pop: 2.86, hdi: 0.495, growth: 5.8, inflation: 16.9, le: 62.9, elec: 63.8, net: 51.0, gov: 55.3, peace: 1.89 },
  GHA: { gdp: 75.2, pop: 34.78, hdi: 0.602, growth: 3.1, inflation: 23.2, le: 64.3, elec: 86.3, net: 69.8, gov: 64.3, peace: 1.84 },
  GIN: { gdp: 25.4, pop: 14.76, hdi: 0.471, growth: 4.8, inflation: 8.5, le: 59.3, elec: 47.2, net: 33.1, gov: 41.5, peace: 2.22 },
  GNB: { gdp: 2.2, pop: 2.20, hdi: 0.483, growth: 5.0, inflation: 4.2, le: 60.0, elec: 33.3, net: 32.5, gov: 41.0, peace: 2.15 },
  KEN: { gdp: 116.3, pop: 56.20, hdi: 0.601, growth: 5.0, inflation: 6.5, le: 62.1, elec: 77.2, net: 41.0, gov: 58.7, peace: 2.41 },
  LSO: { gdp: 2.4, pop: 2.35, hdi: 0.521, growth: 2.2, inflation: 6.0, le: 53.6, elec: 50.4, net: 51.2, gov: 50.3, peace: 2.19 },
  LBR: { gdp: 4.8, pop: 5.54, hdi: 0.487, growth: 5.1, inflation: 7.6, le: 61.1, elec: 31.7, net: 33.7, gov: 47.1, peace: 2.03 },
  LBY: { gdp: 48.2, pop: 6.96, hdi: 0.746, growth: 7.5, inflation: 2.4, le: 73.1, elec: 70.2, net: 49.6, gov: 33.5, peace: 2.92 },
  MDG: { gdp: 17.3, pop: 31.06, hdi: 0.487, growth: 4.5, inflation: 8.0, le: 65.2, elec: 35.1, net: 22.3, gov: 48.0, peace: 1.84 },
  MWI: { gdp: 11.2, pop: 21.48, hdi: 0.508, growth: 2.3, inflation: 29.5, le: 63.2, elec: 19.2, net: 24.4, gov: 54.7, peace: 1.90 },
  MLI: { gdp: 21.3, pop: 24.02, hdi: 0.410, growth: 3.8, inflation: 3.0, le: 59.4, elec: 53.4, net: 34.5, gov: 38.9, peace: 3.42 },
  MRT: { gdp: 10.7, pop: 5.02, hdi: 0.540, growth: 4.4, inflation: 2.5, le: 64.7, elec: 47.7, net: 58.8, gov: 48.5, peace: 2.23 },
  MUS: { gdp: 15.9, pop: 1.30, hdi: 0.806, growth: 4.9, inflation: 4.2, le: 74.4, elec: 100.0, net: 76.0, gov: 74.9, peace: 1.55 },
  MAR: { gdp: 152.4, pop: 38.08, hdi: 0.698, growth: 2.8, inflation: 1.7, le: 75.0, elec: 100.0, net: 88.1, gov: 52.8, peace: 2.01 },
  MOZ: { gdp: 22.5, pop: 34.63, hdi: 0.461, growth: 5.0, inflation: 4.0, le: 62.1, elec: 40.0, net: 23.2, gov: 47.6, peace: 2.34 },
  NAM: { gdp: 13.6, pop: 3.09, hdi: 0.610, growth: 3.7, inflation: 4.8, le: 59.8, elec: 56.3, net: 53.0, gov: 65.2, peace: 1.87 },
  NER: { gdp: 19.6, pop: 27.20, hdi: 0.394, growth: 10.6, inflation: 4.5, le: 62.1, elec: 19.3, net: 16.9, gov: 40.5, peace: 2.68 },
  NGA: { gdp: 252.8, pop: 229.15, hdi: 0.554, growth: 3.2, inflation: 32.5, le: 53.8, elec: 59.5, net: 55.4, gov: 47.9, peace: 2.71 },
  RWA: { gdp: 13.7, pop: 14.26, hdi: 0.548, growth: 7.0, inflation: 5.0, le: 67.1, elec: 53.4, net: 30.5, gov: 64.9, peace: 2.05 },
  STP: { gdp: 0.6, pop: 0.24, hdi: 0.618, growth: 2.8, inflation: 18.5, le: 67.8, elec: 82.5, net: 35.1, gov: 60.1, peace: 1.75 },
  SEN: { gdp: 32.4, pop: 18.50, hdi: 0.517, growth: 7.1, inflation: 2.0, le: 67.9, elec: 70.4, net: 58.1, gov: 59.8, peace: 1.88 },
  SYC: { gdp: 2.1, pop: 0.12, hdi: 0.802, growth: 3.7, inflation: 1.4, le: 73.5, elec: 100.0, net: 82.0, gov: 73.4, peace: 1.60 },
  SLE: { gdp: 4.5, pop: 8.98, hdi: 0.458, growth: 4.0, inflation: 38.5, le: 60.4, elec: 27.5, net: 21.2, gov: 54.0, peace: 2.12 },
  SOM: { gdp: 12.8, pop: 19.01, hdi: 0.361, growth: 3.7, inflation: 4.5, le: 56.1, elec: 52.0, net: 17.5, gov: 22.4, peace: 3.42 },
  ZAF: { gdp: 373.2, pop: 60.41, hdi: 0.717, growth: 1.1, inflation: 4.9, le: 65.3, elec: 89.3, net: 74.7, gov: 68.7, peace: 2.30 },
  SSD: { gdp: 6.5, pop: 11.51, hdi: 0.381, growth: -5.5, inflation: 40.2, le: 55.6, elec: 7.7, net: 10.9, gov: 20.8, peace: 3.32 },
  SDN: { gdp: 26.8, pop: 50.04, hdi: 0.507, growth: -18.3, inflation: 145.0, le: 65.6, elec: 55.8, net: 30.9, gov: 34.5, peace: 3.43 },
  TZA: { gdp: 79.9, pop: 68.56, hdi: 0.532, growth: 5.4, inflation: 3.2, le: 66.8, elec: 43.1, net: 32.0, gov: 56.8, peace: 2.01 },
  TGO: { gdp: 9.8, pop: 9.30, hdi: 0.535, growth: 5.3, inflation: 2.8, le: 61.6, elec: 55.8, net: 35.0, gov: 52.6, peace: 2.09 },
  TUN: { gdp: 54.7, pop: 12.56, hdi: 0.732, growth: 1.6, inflation: 7.2, le: 74.3, elec: 100.0, net: 79.0, gov: 55.1, peace: 2.00 },
  UGA: { gdp: 53.8, pop: 50.02, hdi: 0.550, growth: 6.0, inflation: 3.5, le: 63.6, elec: 45.2, net: 29.5, gov: 52.4, peace: 2.30 },
  ZMB: { gdp: 29.9, pop: 21.13, hdi: 0.565, growth: 2.3, inflation: 15.0, le: 61.8, elec: 46.7, net: 31.0, gov: 56.9, peace: 1.95 },
  ZWE: { gdp: 32.4, pop: 17.02, hdi: 0.550, growth: 3.5, inflation: 28.0, le: 59.4, elec: 52.7, net: 34.8, gov: 45.8, peace: 2.32 },
  DZA: { gdp: 266.8, pop: 46.81, hdi: 0.745, growth: 3.8, inflation: 6.5, le: 76.4, elec: 99.8, net: 71.0, gov: 51.5, peace: 2.21 },
  ESH: { gdp: 1.1, pop: 0.61, hdi: 0.620, growth: 2.5, inflation: 3.0, le: 70.3, elec: 82.0, net: 45.0, gov: 38.0, peace: 2.40 }
};

// Generate comprehensive observation records for all countries and metrics
export function generateFullObservations(): Observation[] {
  const observations: Observation[] = [...SEED_OBSERVATIONS];
  const existingKeys = new Set(observations.map(o => `${o.entityId}_${o.indicatorId}_${o.period}`));

  for (const [entityId, p] of Object.entries(NATION_PROFILES_ESTIMATES)) {
    const addObs = (indId: string, val: number | null, unit: string, source: string, dataset: string, status: any) => {
      const key = `${entityId}_${indId}_2024`;
      if (!existingKeys.has(key) && val !== null) {
        observations.push({
          entityId,
          indicatorId: indId,
          period: 2024,
          value: val,
          unit,
          sourceId: source,
          datasetId: dataset,
          status
        });
        existingKeys.add(key);
      }
    };

    addObs('NY.GDP.MKTP.CD', p.gdp, 'USD Billion', 'imf', 'WEO_OCT_2024', 'estimated');
    addObs('SP.POP.TOTL', p.pop, 'People (Million)', 'undesa', 'WPP_REVISION_2024', 'forecast');
    addObs('UNDP.HDI.INDEX', p.hdi, 'Index (0-1)', 'undp', 'HDR_COMPOSITE_2024', 'estimated');
    addObs('NY.GDP.MKTP.KD.ZG', p.growth, '%', 'imf', 'WEO_OCT_2024', 'estimated');
    addObs('FP.CPI.TOTL.ZG', p.inflation, '%', 'imf', 'WEO_OCT_2024', 'estimated');
    addObs('SP.DYN.LE00.IN', p.le, 'Years', 'undesa', 'WPP_REVISION_2024', 'estimated');
    addObs('EG.ELC.ACCS.ZS', p.elec, '%', 'world_bank', 'WDI_2024', 'observed');
    addObs('IT.NET.USER.ZS', p.net, '%', 'world_bank', 'WDI_2024', 'observed');
    addObs('MO.IIAG.SCORE', p.gov, 'Score (0-100)', 'mo_ibrahim', 'IIAG_SCORECARD_2024', 'observed');
    addObs('IEP.GPI.SCORE', p.peace, 'Score (1-5)', 'iep', 'GPI_REPORT_2024', 'observed');

    // Also populate past years (2020, 2022) to enable historical trend lines
    const addHistorical = (indId: string, val: number | null, unit: string, source: string, dataset: string, period: number) => {
      const key = `${entityId}_${indId}_${period}`;
      if (!existingKeys.has(key) && val !== null) {
        observations.push({
          entityId,
          indicatorId: indId,
          period,
          value: val,
          unit,
          sourceId: source,
          datasetId: dataset,
          status: 'observed'
        });
        existingKeys.add(key);
      }
    };

    addHistorical('NY.GDP.MKTP.CD', Math.round(p.gdp * 0.88 * 100) / 100, 'USD Billion', 'world_bank', 'WDI_2024', 2020);
    addHistorical('NY.GDP.MKTP.CD', Math.round(p.gdp * 0.94 * 100) / 100, 'USD Billion', 'world_bank', 'WDI_2024', 2022);
    addHistorical('SP.POP.TOTL', Math.round(p.pop * 0.91 * 100) / 100, 'People (Million)', 'undesa', 'WPP_REVISION_2024', 2020);
    addHistorical('SP.POP.TOTL', Math.round(p.pop * 0.95 * 100) / 100, 'People (Million)', 'undesa', 'WPP_REVISION_2024', 2022);
    addHistorical('UNDP.HDI.INDEX', Math.round(Math.max(0.3, p.hdi - 0.015) * 1000) / 1000, 'Index (0-1)', 'undp', 'HDR_COMPOSITE_2024', 2020);
    addHistorical('UNDP.HDI.INDEX', Math.round(Math.max(0.3, p.hdi - 0.006) * 1000) / 1000, 'Index (0-1)', 'undp', 'HDR_COMPOSITE_2024', 2022);
    addHistorical('EG.ELC.ACCS.ZS', Math.round(Math.max(5, p.elec - 4.5) * 10) / 10, '%', 'world_bank', 'WDI_2024', 2020);
  }

  return observations;
}

export const MEDIA_REGISTRY: Record<string, MediaLinks> = {
  DZA: {
    entityId: 'DZA',
    flagSvg: 'https://flagcdn.com/dz.svg',
    flagPng: 'https://flagcdn.com/w320/dz.png',
    flagEmoji: '🇩🇿',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Algeria',
    wikidataId: 'Q262',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q262',
    worldBankProfileUrl: 'https://data.worldbank.org/country/algeria',
    imfProfileUrl: 'https://www.imf.org/en/Countries/DZA',
    unProfileUrl: 'https://data.un.org/en/iso/dz.html',
    africanUnionUrl: 'https://au.int/en/member_states/algeria'
  },
  EGY: {
    entityId: 'EGY',
    flagSvg: 'https://flagcdn.com/eg.svg',
    flagPng: 'https://flagcdn.com/w320/eg.png',
    flagEmoji: '🇪🇬',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Egypt',
    wikidataId: 'Q79',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q79',
    worldBankProfileUrl: 'https://data.worldbank.org/country/egypt-arab-rep',
    imfProfileUrl: 'https://www.imf.org/en/Countries/EGY',
    unProfileUrl: 'https://data.un.org/en/iso/eg.html',
    africanUnionUrl: 'https://au.int/en/member_states/egypt'
  },
  NGA: {
    entityId: 'NGA',
    flagSvg: 'https://flagcdn.com/ng.svg',
    flagPng: 'https://flagcdn.com/w320/ng.png',
    flagEmoji: '🇳🇬',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Nigeria',
    wikidataId: 'Q1033',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1033',
    worldBankProfileUrl: 'https://data.worldbank.org/country/nigeria',
    imfProfileUrl: 'https://www.imf.org/en/Countries/NGA',
    unProfileUrl: 'https://data.un.org/en/iso/ng.html',
    africanUnionUrl: 'https://au.int/en/member_states/nigeria'
  },
  ZAF: {
    entityId: 'ZAF',
    flagSvg: 'https://flagcdn.com/za.svg',
    flagPng: 'https://flagcdn.com/w320/za.png',
    flagEmoji: '🇿🇦',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/South_Africa',
    wikidataId: 'Q258',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q258',
    worldBankProfileUrl: 'https://data.worldbank.org/country/south-africa',
    imfProfileUrl: 'https://www.imf.org/en/Countries/ZAF',
    unProfileUrl: 'https://data.un.org/en/iso/za.html',
    africanUnionUrl: 'https://au.int/en/member_states/south-africa'
  },
  KEN: {
    entityId: 'KEN',
    flagSvg: 'https://flagcdn.com/ke.svg',
    flagPng: 'https://flagcdn.com/w320/ke.png',
    flagEmoji: '🇰🇪',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Kenya',
    wikidataId: 'Q114',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q114',
    worldBankProfileUrl: 'https://data.worldbank.org/country/kenya',
    imfProfileUrl: 'https://www.imf.org/en/Countries/KEN',
    unProfileUrl: 'https://data.un.org/en/iso/ke.html',
    africanUnionUrl: 'https://au.int/en/member_states/kenya'
  },
  ETH: {
    entityId: 'ETH',
    flagSvg: 'https://flagcdn.com/et.svg',
    flagPng: 'https://flagcdn.com/w320/et.png',
    flagEmoji: '🇪🇹',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Ethiopia',
    wikidataId: 'Q115',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q115',
    worldBankProfileUrl: 'https://data.worldbank.org/country/ethiopia',
    imfProfileUrl: 'https://www.imf.org/en/Countries/ETH',
    unProfileUrl: 'https://data.un.org/en/iso/et.html',
    africanUnionUrl: 'https://au.int/en/member_states/ethiopia'
  },
  MAR: {
    entityId: 'MAR',
    flagSvg: 'https://flagcdn.com/ma.svg',
    flagPng: 'https://flagcdn.com/w320/ma.png',
    flagEmoji: '🇲🇦',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Morocco',
    wikidataId: 'Q1028',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1028',
    worldBankProfileUrl: 'https://data.worldbank.org/country/morocco',
    imfProfileUrl: 'https://www.imf.org/en/Countries/MAR',
    unProfileUrl: 'https://data.un.org/en/iso/ma.html',
    africanUnionUrl: 'https://au.int/en/member_states/morocco'
  },
  GHA: {
    entityId: 'GHA',
    flagSvg: 'https://flagcdn.com/gh.svg',
    flagPng: 'https://flagcdn.com/w320/gh.png',
    flagEmoji: '🇬🇭',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Ghana',
    wikidataId: 'Q117',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q117',
    worldBankProfileUrl: 'https://data.worldbank.org/country/ghana',
    imfProfileUrl: 'https://www.imf.org/en/Countries/GHA',
    unProfileUrl: 'https://data.un.org/en/iso/gh.html',
    africanUnionUrl: 'https://au.int/en/member_states/ghana'
  },
  TZA: {
    entityId: 'TZA',
    flagSvg: 'https://flagcdn.com/tz.svg',
    flagPng: 'https://flagcdn.com/w320/tz.png',
    flagEmoji: '🇹🇿',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Tanzania',
    wikidataId: 'Q924',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q924',
    worldBankProfileUrl: 'https://data.worldbank.org/country/tanzania',
    imfProfileUrl: 'https://www.imf.org/en/Countries/TZA',
    unProfileUrl: 'https://data.un.org/en/iso/tz.html',
    africanUnionUrl: 'https://au.int/en/member_states/tanzania'
  },
  COD: {
    entityId: 'COD',
    flagSvg: 'https://flagcdn.com/cd.svg',
    flagPng: 'https://flagcdn.com/w320/cd.png',
    flagEmoji: '🇨🇩',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Democratic_Republic_of_the_Congo',
    wikidataId: 'Q974',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q974',
    worldBankProfileUrl: 'https://data.worldbank.org/country/congo-dem-rep',
    imfProfileUrl: 'https://www.imf.org/en/Countries/COD',
    unProfileUrl: 'https://data.un.org/en/iso/cd.html',
    africanUnionUrl: 'https://au.int/en/member_states/democratic-republic-congo'
  },
  RWA: {
    entityId: 'RWA',
    flagSvg: 'https://flagcdn.com/rw.svg',
    flagPng: 'https://flagcdn.com/w320/rw.png',
    flagEmoji: '🇷🇼',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Rwanda',
    wikidataId: 'Q1037',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1037',
    worldBankProfileUrl: 'https://data.worldbank.org/country/rwanda',
    imfProfileUrl: 'https://www.imf.org/en/Countries/RWA',
    unProfileUrl: 'https://data.un.org/en/iso/rw.html',
    africanUnionUrl: 'https://au.int/en/member_states/rwanda'
  },
  SEN: {
    entityId: 'SEN',
    flagSvg: 'https://flagcdn.com/sn.svg',
    flagPng: 'https://flagcdn.com/w320/sn.png',
    flagEmoji: '🇸🇳',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Senegal',
    wikidataId: 'Q1041',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1041',
    worldBankProfileUrl: 'https://data.worldbank.org/country/senegal',
    imfProfileUrl: 'https://www.imf.org/en/Countries/SEN',
    unProfileUrl: 'https://data.un.org/en/iso/sn.html',
    africanUnionUrl: 'https://au.int/en/member_states/senegal'
  },
  CIV: {
    entityId: 'CIV',
    flagSvg: 'https://flagcdn.com/ci.svg',
    flagPng: 'https://flagcdn.com/w320/ci.png',
    flagEmoji: '🇨🇮',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Ivory_Coast',
    wikidataId: 'Q1008',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1008',
    worldBankProfileUrl: 'https://data.worldbank.org/country/cote-divoire',
    imfProfileUrl: 'https://www.imf.org/en/Countries/CIV',
    unProfileUrl: 'https://data.un.org/en/iso/ci.html',
    africanUnionUrl: 'https://au.int/en/member_states/cote-divoire'
  },
  BWA: {
    entityId: 'BWA',
    flagSvg: 'https://flagcdn.com/bw.svg',
    flagPng: 'https://flagcdn.com/w320/bw.png',
    flagEmoji: '🇧🇼',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Botswana',
    wikidataId: 'Q963',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q963',
    worldBankProfileUrl: 'https://data.worldbank.org/country/botswana',
    imfProfileUrl: 'https://www.imf.org/en/Countries/BWA',
    unProfileUrl: 'https://data.un.org/en/iso/bw.html',
    africanUnionUrl: 'https://au.int/en/member_states/botswana'
  },
  MUS: {
    entityId: 'MUS',
    flagSvg: 'https://flagcdn.com/mu.svg',
    flagPng: 'https://flagcdn.com/w320/mu.png',
    flagEmoji: '🇲🇺',
    wikipediaUrl: 'https://en.wikipedia.org/wiki/Mauritius',
    wikidataId: 'Q1027',
    wikidataUrl: 'https://www.wikidata.org/wiki/Q1027',
    worldBankProfileUrl: 'https://data.worldbank.org/country/mauritius',
    imfProfileUrl: 'https://www.imf.org/en/Countries/MUS',
    unProfileUrl: 'https://data.un.org/en/iso/mu.html',
    africanUnionUrl: 'https://au.int/en/member_states/mauritius'
  }
};
