/**
 * africaliaGeographyData.ts
 * UN M49 Regional Hierarchy & First-Level Administrative Subdivisions (Admin-1)
 * Schema: africalia-geography/1
 */

import { AfricaliaGeographyHierarchy, AfricaliaAdmin1, AfricaliaCountryHierarchy } from './types';

export const AFRICALIA_GEOGRAPHY_DATA: AfricaliaGeographyHierarchy = {
  schema: 'africalia-geography/1',
  root: 'AFRICA',
  sources: {
    admin1: 'UN Geoscheme M49 / Natural Earth / National Cartographic Bureaus',
    admin2: ''
  },
  regions: [
    {
      m49: '011',
      name: 'Western Africa',
      layer: 'REGION_011_Western_Africa',
      level: 'region',
      countries: [
        {
          id: 'M49_204_ISO3_BEN_Benin',
          level: 'country',
          m49: '204',
          iso3: 'BEN',
          iso2: 'BJ',
          name: 'Benin',
          kind: 'sovereign',
          regionM49: '011',
          parent: 'REGION_011_Western_Africa',
          admin1Count: 12,
          admin1: [
            { id: 'M49_204_ISO3_BEN_ADM1_001', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-DO', name: 'Donga', sourceName: 'Donga BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_002', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-AK', name: 'Atakora', sourceName: 'Atakora BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_003', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-MO', name: 'Mono', sourceName: 'Mono BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_004', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-PL', name: 'Plateau', sourceName: 'Plateau BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_005', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-ZO', name: 'Zou', sourceName: 'Zou BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_006', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-OU', name: 'Ouémé', sourceName: 'Ouémé BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_007', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-KO', name: 'Kouffo', sourceName: 'Kouffo BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_008', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-LI', name: 'Littoral', sourceName: 'Littoral BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_009', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-AQ', name: 'Atlantique', sourceName: 'Atlantique BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_010', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-CO', name: 'Collines', sourceName: 'Collines BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_011', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-AL', name: 'Alibori', sourceName: 'Alibori BJ' },
            { id: 'M49_204_ISO3_BEN_ADM1_012', level: 'admin1', parent: 'M49_204_ISO3_BEN_Benin', admin1Code: 'BJ-BO', name: 'Borgou', sourceName: 'Borgou BJ' }
          ]
        },
        {
          id: 'M49_132_ISO3_CPV_Cabo_Verde',
          level: 'country',
          m49: '132',
          iso3: 'CPV',
          iso2: 'CV',
          name: 'Cabo Verde',
          kind: 'sovereign',
          regionM49: '011',
          parent: 'REGION_011_Western_Africa',
          admin1Count: 22,
          admin1: [
            { id: 'M49_132_ISO3_CPV_ADM1_001', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-SO', name: 'São Lourenço dos Órgãos', sourceName: 'São Lourenço dos Órgãos CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_002', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-SM', name: 'São Salvador do Mundo', sourceName: 'São Salvador do Mundo CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_003', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-PA', name: 'Paul', sourceName: 'Paul CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_004', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-PN', name: 'Porto Novo', sourceName: 'Porto Novo CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_005', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-RG', name: 'Ribeira Grande', sourceName: 'Ribeira Grande CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_006', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-SV', name: 'São Vicente', sourceName: 'São Vicente CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_007', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-SL', name: 'Sal', sourceName: 'Sal CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_008', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-TS', name: 'Tarrafal de São Nicolau', sourceName: 'Tarrafal de São Nicolau CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_009', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-RB', name: 'Ribeira Brava', sourceName: 'Ribeira Brava CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_010', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-BV', name: 'Boa Vista', sourceName: 'Boa Vista CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_011', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-MA', name: 'Maio', sourceName: 'Maio CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_012', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-MI', name: 'São Miguel', sourceName: 'São Miguel CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_013', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-SC', name: 'Santa Cruz', sourceName: 'Santa Cruz CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_014', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-SD', name: 'São Domingos', sourceName: 'São Domingos CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_015', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-PR', name: 'Praia', sourceName: 'Praia CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_016', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-RS', name: 'Ribeira Grande de Santiago', sourceName: 'Ribeira Grande de Santiago CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_017', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-CA', name: 'Santa Catarina', sourceName: 'Santa Catarina CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_018', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-TA', name: 'Tarrafal', sourceName: 'Tarrafal CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_019', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-SF', name: 'São Filipe', sourceName: 'São Filipe CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_020', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-MO', name: 'Mosteiros', sourceName: 'Mosteiros CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_021', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-CF', name: 'Santa Catarina do Fogo', sourceName: 'Santa Catarina do Fogo CV' },
            { id: 'M49_132_ISO3_CPV_ADM1_022', level: 'admin1', parent: 'M49_132_ISO3_CPV_Cabo_Verde', admin1Code: 'CV-BR', name: 'Brava', sourceName: 'Brava CV' }
          ]
        },
        {
          id: 'M49_288_ISO3_GHA_Ghana',
          level: 'country',
          m49: '288',
          iso3: 'GHA',
          iso2: 'GH',
          name: 'Ghana',
          kind: 'sovereign',
          regionM49: '011',
          parent: 'REGION_011_Western_Africa',
          admin1Count: 16,
          admin1: [
            { id: 'M49_288_ISO3_GHA_ADM1_001', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-OT', name: 'Oti', sourceName: 'Oti GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_002', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-TV', name: 'Volta', sourceName: 'Volta GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_003', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-AA', name: 'Greater Accra', sourceName: 'Greater Accra GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_004', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-WN', name: 'Western North', sourceName: 'Western North GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_005', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-WP', name: 'Western', sourceName: 'Western GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_006', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-EP', name: 'Eastern', sourceName: 'Eastern GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_007', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-CP', name: 'Central', sourceName: 'Central GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_008', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-BO', name: 'Bono', sourceName: 'Bono GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_009', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-BE', name: 'Bono East', sourceName: 'Bono East GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_010', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-AF', name: 'Ahafo', sourceName: 'Ahafo GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_011', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-AH', name: 'Ashanti', sourceName: 'Ashanti GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_012', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-UW', name: 'Upper West', sourceName: 'Upper West GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_013', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-UE', name: 'Upper East', sourceName: 'Upper East GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_014', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-NE', name: 'North East', sourceName: 'North East GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_015', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-NP', name: 'Northern', sourceName: 'Northern GH' },
            { id: 'M49_288_ISO3_GHA_ADM1_016', level: 'admin1', parent: 'M49_288_ISO3_GHA_Ghana', admin1Code: 'GH-SV', name: 'Savannah', sourceName: 'Savannah GH' }
          ]
        },
        {
          id: 'M49_566_ISO3_NGA_Nigeria',
          level: 'country',
          m49: '566',
          iso3: 'NGA',
          iso2: 'NG',
          name: 'Nigeria',
          kind: 'sovereign',
          regionM49: '011',
          parent: 'REGION_011_Western_Africa',
          admin1Count: 37,
          admin1: [
            { id: 'M49_566_ISO3_NGA_ADM1_001', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-FC', name: 'Federal Capital Territory', sourceName: 'Federal Capital Territory NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_002', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-AD', name: 'Adamawa', sourceName: 'Adamawa NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_003', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-KE', name: 'Kebbi', sourceName: 'Kebbi NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_004', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-YO', name: 'Yobe', sourceName: 'Yobe NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_005', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-ZA', name: 'Zamfara', sourceName: 'Zamfara NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_006', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-SO', name: 'Sokoto', sourceName: 'Sokoto NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_007', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-KT', name: 'Katsina', sourceName: 'Katsina NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_008', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-KN', name: 'Kano', sourceName: 'Kano NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_009', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-JI', name: 'Jigawa', sourceName: 'Jigawa NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_010', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-NA', name: 'Nassarawa', sourceName: 'Nassarawa NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_011', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-PL', name: 'Plateau', sourceName: 'Plateau NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_012', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-KO', name: 'Kogi', sourceName: 'Kogi NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_013', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-KD', name: 'Kaduna', sourceName: 'Kaduna NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_014', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-EB', name: 'Ebonyi', sourceName: 'Ebonyi NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_015', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-EN', name: 'Enugu', sourceName: 'Enugu NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_016', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-ED', name: 'Edo', sourceName: 'Edo NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_017', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-DE', name: 'Delta', sourceName: 'Delta NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_018', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-GO', name: 'Gombe', sourceName: 'Gombe NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_019', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-BA', name: 'Bauchi', sourceName: 'Bauchi NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_020', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-AN', name: 'Anambra', sourceName: 'Anambra NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_021', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-OY', name: 'Oyo', sourceName: 'Oyo NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_022', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-OS', name: 'Osun', sourceName: 'Osun NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_023', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-EK', name: 'Ekiti', sourceName: 'Ekiti NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_024', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-ON', name: 'Ondo', sourceName: 'Ondo NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_025', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-OG', name: 'Ogun', sourceName: 'Ogun NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_026', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-NI', name: 'Niger', sourceName: 'Niger NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_027', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-LA', name: 'Lagos', sourceName: 'Lagos NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_028', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-KW', name: 'Kwara', sourceName: 'Kwara NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_029', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-TA', name: 'Taraba', sourceName: 'Taraba NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_030', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-CR', name: 'Cross River', sourceName: 'Cross River NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_031', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-BE', name: 'Benue', sourceName: 'Benue NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_032', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-BY', name: 'Bayelsa', sourceName: 'Bayelsa NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_033', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-IM', name: 'Imo', sourceName: 'Imo NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_034', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-AK', name: 'Akwa Ibom', sourceName: 'Akwa Ibom NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_035', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-AB', name: 'Abia', sourceName: 'Abia NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_036', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-BO', name: 'Borno', sourceName: 'Borno NG' },
            { id: 'M49_566_ISO3_NGA_ADM1_037', level: 'admin1', parent: 'M49_566_ISO3_NGA_Nigeria', admin1Code: 'NG-RI', name: 'Rivers', sourceName: 'Rivers NG' }
          ]
        },
        {
          id: 'M49_686_ISO3_SEN_Senegal',
          level: 'country',
          m49: '686',
          iso3: 'SEN',
          iso2: 'SN',
          name: 'Senegal',
          kind: 'sovereign',
          regionM49: '011',
          parent: 'REGION_011_Western_Africa',
          admin1Count: 14,
          admin1: [
            { id: 'M49_686_ISO3_SEN_ADM1_001', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-TC', name: 'Tambacounda', sourceName: 'Tambacounda SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_002', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-KD', name: 'Kolda', sourceName: 'Kolda SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_003', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-TH', name: 'Thiès', sourceName: 'Thiès SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_004', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-MT', name: 'Matam', sourceName: 'Matam SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_005', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-LG', name: 'Louga', sourceName: 'Louga SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_006', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-KL', name: 'Kaolack', sourceName: 'Kaolack SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_007', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-DB', name: 'Diourbel', sourceName: 'Diourbel SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_008', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-DK', name: 'Dakar', sourceName: 'Dakar SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_009', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-SL', name: 'Saint-Louis', sourceName: 'Saint-Louis SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_010', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-KF', name: 'Kaffrine', sourceName: 'Kaffrine SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_011', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-KG', name: 'Kédougou', sourceName: 'Kédougou SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_012', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-SE', name: 'Sédhiou', sourceName: 'Sédhiou SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_013', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-ZG', name: 'Ziguinchor', sourceName: 'Ziguinchor SN' },
            { id: 'M49_686_ISO3_SEN_ADM1_014', level: 'admin1', parent: 'M49_686_ISO3_SEN_Senegal', admin1Code: 'SN-FK', name: 'Fatick', sourceName: 'Fatick SN' }
          ]
        }
      ]
    },
    {
      m49: '017',
      name: 'Central Africa',
      layer: 'REGION_017_Middle_Africa',
      level: 'region',
      countries: [
        {
          id: 'M49_024_ISO3_AGO_Angola',
          level: 'country',
          m49: '024',
          iso3: 'AGO',
          iso2: 'AO',
          name: 'Angola',
          kind: 'sovereign',
          regionM49: '017',
          parent: 'REGION_017_Middle_Africa',
          admin1Count: 21,
          admin1: [
            { id: 'M49_024_ISO3_AGO_ADM1_001', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-MXL', name: 'Moxico Leste', sourceName: 'Moxico Leste AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_002', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-MOX', name: 'Moxico', sourceName: 'Moxico AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_003', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-HUI', name: 'Huíla', sourceName: 'Huíla AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_004', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-HUA', name: 'Huambo', sourceName: 'Huambo AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_005', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-CNN', name: 'Cunene', sourceName: 'Cunene AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_006', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-CBG', name: 'Cubango', sourceName: 'Cubango AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_007', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-CCU', name: 'Cuando', sourceName: 'Cuando AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_008', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-BGL', name: 'Benguela', sourceName: 'Benguela AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_009', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-BIE', name: 'Bié', sourceName: 'Bié AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_010', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-CAB', name: 'Cabinda', sourceName: 'Cabinda AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_011', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-ZAI', name: 'Zaire', sourceName: 'Zaire AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_012', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-UIG', name: 'Uíge', sourceName: 'Uíge AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_013', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-CUS', name: 'Cuanza Sul', sourceName: 'Cuanza Sul AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_014', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-CNO', name: 'Cuanza Norte', sourceName: 'Cuanza Norte AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_015', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-BGO', name: 'Bengo', sourceName: 'Bengo AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_016', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-ICB', name: 'Icolo e Bengo', sourceName: 'Icolo e Bengo AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_017', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-LUA', name: 'Luanda', sourceName: 'Luanda AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_018', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-LNO', name: 'Lunda Norte', sourceName: 'Lunda Norte AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_019', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-LSU', name: 'Lunda Sul', sourceName: 'Lunda Sul AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_020', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-MAL', name: 'Malanje', sourceName: 'Malanje AO' },
            { id: 'M49_024_ISO3_AGO_ADM1_021', level: 'admin1', parent: 'M49_024_ISO3_AGO_Angola', admin1Code: 'AO-NAM', name: 'Namibe', sourceName: 'Namibe AO' }
          ]
        },
        {
          id: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo',
          level: 'country',
          m49: '180',
          iso3: 'COD',
          iso2: 'CD',
          name: 'Democratic Republic of the Congo',
          kind: 'sovereign',
          regionM49: '017',
          parent: 'REGION_017_Middle_Africa',
          admin1Count: 26,
          admin1: [
            { id: 'M49_180_ISO3_COD_ADM1_001', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-BC', name: 'Kongo Central', sourceName: 'Kongo Central CD' },
            { id: 'M49_180_ISO3_COD_ADM1_002', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-KN', name: 'Kinshasa', sourceName: 'Kinshasa CD' },
            { id: 'M49_180_ISO3_COD_ADM1_003', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-KL', name: 'Kwilu', sourceName: 'Kwilu CD' },
            { id: 'M49_180_ISO3_COD_ADM1_004', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-KG', name: 'Kwango', sourceName: 'Kwango CD' },
            { id: 'M49_180_ISO3_COD_ADM1_005', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-KS', name: 'Kasaï', sourceName: 'Kasaï CD' },
            { id: 'M49_180_ISO3_COD_ADM1_006', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-KC', name: 'Kasaï Central', sourceName: 'Kasaï Central CD' },
            { id: 'M49_180_ISO3_COD_ADM1_007', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-SA', name: 'Sankuru', sourceName: 'Sankuru CD' },
            { id: 'M49_180_ISO3_COD_ADM1_008', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-TU', name: 'Tshuapa', sourceName: 'Tshuapa CD' },
            { id: 'M49_180_ISO3_COD_ADM1_009', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-SU', name: 'Sud Ubangi', sourceName: 'Sud Ubangi CD' },
            { id: 'M49_180_ISO3_COD_ADM1_010', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-MN', name: 'Mongala', sourceName: 'Mongala CD' },
            { id: 'M49_180_ISO3_COD_ADM1_011', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-TP', name: 'Tshopo', sourceName: 'Tshopo CD' },
            { id: 'M49_180_ISO3_COD_ADM1_012', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-BU', name: 'Bas Uele', sourceName: 'Bas Uele CD' },
            { id: 'M49_180_ISO3_COD_ADM1_013', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-HU', name: 'Haut Uele', sourceName: 'Haut Uele CD' },
            { id: 'M49_180_ISO3_COD_ADM1_014', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-IT', name: 'Ituri', sourceName: 'Ituri CD' },
            { id: 'M49_180_ISO3_COD_ADM1_015', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-NK', name: 'Nord Kivu', sourceName: 'Nord Kivu CD' },
            { id: 'M49_180_ISO3_COD_ADM1_016', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-MA', name: 'Maniema', sourceName: 'Maniema CD' },
            { id: 'M49_180_ISO3_COD_ADM1_017', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-SK', name: 'Sud Kivu', sourceName: 'Sud Kivu CD' },
            { id: 'M49_180_ISO3_COD_ADM1_018', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-LO', name: 'Lomami', sourceName: 'Lomami CD' },
            { id: 'M49_180_ISO3_COD_ADM1_019', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-KO', name: 'Kasaï Oriental', sourceName: 'Kasaï Oriental CD' },
            { id: 'M49_180_ISO3_COD_ADM1_020', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-HL', name: 'Haut Lomami', sourceName: 'Haut Lomami CD' },
            { id: 'M49_180_ISO3_COD_ADM1_021', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-LU', name: 'Lualaba', sourceName: 'Lualaba CD' },
            { id: 'M49_180_ISO3_COD_ADM1_022', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-HK', name: 'Haut Katanga', sourceName: 'Haut Katanga CD' },
            { id: 'M49_180_ISO3_COD_ADM1_023', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-MN', name: 'Mai Ndombe', sourceName: 'Mai Ndombe CD' },
            { id: 'M49_180_ISO3_COD_ADM1_024', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-EQ', name: 'Équateur', sourceName: 'Équateur CD' },
            { id: 'M49_180_ISO3_COD_ADM1_025', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-TA', name: 'Tanganyika', sourceName: 'Tanganyika CD' },
            { id: 'M49_180_ISO3_COD_ADM1_026', level: 'admin1', parent: 'M49_180_ISO3_COD_Democratic_Republic_of_the_Congo', admin1Code: 'CD-NU', name: 'Nord Ubangi', sourceName: 'Nord Ubangi CD' }
          ]
        }
      ]
    },
    {
      m49: '014',
      name: 'Eastern Africa',
      layer: 'REGION_014_Eastern_Africa',
      level: 'region',
      countries: [
        {
          id: 'M49_404_ISO3_KEN_Kenya',
          level: 'country',
          m49: '404',
          iso3: 'KEN',
          iso2: 'KE',
          name: 'Kenya',
          kind: 'sovereign',
          regionM49: '014',
          parent: 'REGION_014_Eastern_Africa',
          admin1Count: 47,
          admin1: [
            { id: 'M49_404_ISO3_KEN_ADM1_001', level: 'admin1', parent: 'M49_404_ISO3_KEN_Kenya', admin1Code: 'KE-01', name: 'Mombasa', sourceName: 'Mombasa KE' },
            { id: 'M49_404_ISO3_KEN_ADM1_002', level: 'admin1', parent: 'M49_404_ISO3_KEN_Kenya', admin1Code: 'KE-02', name: 'Kwale', sourceName: 'Kwale KE' },
            { id: 'M49_404_ISO3_KEN_ADM1_003', level: 'admin1', parent: 'M49_404_ISO3_KEN_Kenya', admin1Code: 'KE-03', name: 'Kilifi', sourceName: 'Kilifi KE' },
            { id: 'M49_404_ISO3_KEN_ADM1_004', level: 'admin1', parent: 'M49_404_ISO3_KEN_Kenya', admin1Code: 'KE-04', name: 'Tana River', sourceName: 'Tana River KE' },
            { id: 'M49_404_ISO3_KEN_ADM1_005', level: 'admin1', parent: 'M49_404_ISO3_KEN_Kenya', admin1Code: 'KE-05', name: 'Lamu', sourceName: 'Lamu KE' },
            { id: 'M49_404_ISO3_KEN_ADM1_006', level: 'admin1', parent: 'M49_404_ISO3_KEN_Kenya', admin1Code: 'KE-06', name: 'Taita Taveta', sourceName: 'Taita Taveta KE' },
            { id: 'M49_404_ISO3_KEN_ADM1_007', level: 'admin1', parent: 'M49_404_ISO3_KEN_Kenya', admin1Code: 'KE-30', name: 'Nairobi', sourceName: 'Nairobi KE' }
          ]
        },
        {
          id: 'M49_231_ISO3_ETH_Ethiopia',
          level: 'country',
          m49: '231',
          iso3: 'ETH',
          iso2: 'ET',
          name: 'Ethiopia',
          kind: 'sovereign',
          regionM49: '014',
          parent: 'REGION_014_Eastern_Africa',
          admin1Count: 14,
          admin1: [
            { id: 'M49_231_ISO3_ETH_ADM1_001', level: 'admin1', parent: 'M49_231_ISO3_ETH_Ethiopia', admin1Code: 'ET-AA', name: 'Addis Ababa', sourceName: 'Addis Ababa ET' },
            { id: 'M49_231_ISO3_ETH_ADM1_002', level: 'admin1', parent: 'M49_231_ISO3_ETH_Ethiopia', admin1Code: 'ET-AF', name: 'Afar', sourceName: 'Afar ET' },
            { id: 'M49_231_ISO3_ETH_ADM1_003', level: 'admin1', parent: 'M49_231_ISO3_ETH_Ethiopia', admin1Code: 'ET-AM', name: 'Amhara', sourceName: 'Amhara ET' },
            { id: 'M49_231_ISO3_ETH_ADM1_004', level: 'admin1', parent: 'M49_231_ISO3_ETH_Ethiopia', admin1Code: 'ET-OR', name: 'Oromiya', sourceName: 'Oromiya ET' },
            { id: 'M49_231_ISO3_ETH_ADM1_005', level: 'admin1', parent: 'M49_231_ISO3_ETH_Ethiopia', admin1Code: 'ET-SO', name: 'Somali', sourceName: 'Somali ET' },
            { id: 'M49_231_ISO3_ETH_ADM1_006', level: 'admin1', parent: 'M49_231_ISO3_ETH_Ethiopia', admin1Code: 'ET-TI', name: 'Tigray', sourceName: 'Tigray ET' },
            { id: 'M49_231_ISO3_ETH_ADM1_007', level: 'admin1', parent: 'M49_231_ISO3_ETH_Ethiopia', admin1Code: 'ET-SI', name: 'Sidama', sourceName: 'Sidama ET' }
          ]
        }
      ]
    },
    {
      m49: '015',
      name: 'Northern Africa',
      layer: 'REGION_015_Northern_Africa',
      level: 'region',
      countries: [
        {
          id: 'M49_012_ISO3_DZA_Algeria',
          level: 'country',
          m49: '012',
          iso3: 'DZA',
          iso2: 'DZ',
          name: 'Algeria',
          kind: 'sovereign',
          regionM49: '015',
          parent: 'REGION_015_Northern_Africa',
          admin1Count: 69,
          admin1: [
            { id: 'M49_012_ISO3_DZA_ADM1_001', level: 'admin1', parent: 'M49_012_ISO3_DZA_Algeria', admin1Code: 'DZ-16', name: 'Alger', sourceName: 'Alger DZ' },
            { id: 'M49_012_ISO3_DZA_ADM1_002', level: 'admin1', parent: 'M49_012_ISO3_DZA_Algeria', admin1Code: 'DZ-31', name: 'Oran', sourceName: 'Oran DZ' },
            { id: 'M49_012_ISO3_DZA_ADM1_003', level: 'admin1', parent: 'M49_012_ISO3_DZA_Algeria', admin1Code: 'DZ-25', name: 'Constantine', sourceName: 'Constantine DZ' }
          ]
        },
        {
          id: 'M49_504_ISO3_MAR_Morocco',
          level: 'country',
          m49: '504',
          iso3: 'MAR',
          iso2: 'MA',
          name: 'Morocco',
          kind: 'sovereign',
          regionM49: '015',
          parent: 'REGION_015_Northern_Africa',
          admin1Count: 12,
          admin1: [
            { id: 'M49_504_ISO3_MAR_ADM1_001', level: 'admin1', parent: 'M49_504_ISO3_MAR_Morocco', admin1Code: 'MA-04', name: 'Rabat Salé Kénitra', sourceName: 'Rabat Salé Kénitra MA' },
            { id: 'M49_504_ISO3_MAR_ADM1_002', level: 'admin1', parent: 'M49_504_ISO3_MAR_Morocco', admin1Code: 'MA-06', name: 'Settat Casablanca', sourceName: 'Settat Casablanca MA' },
            { id: 'M49_504_ISO3_MAR_ADM1_003', level: 'admin1', parent: 'M49_504_ISO3_MAR_Morocco', admin1Code: 'MA-07', name: 'Marrakesh Safi', sourceName: 'Marrakesh Safi MA' }
          ]
        },
        {
          id: 'M49_818_ISO3_EGY_Egypt',
          level: 'country',
          m49: '818',
          iso3: 'EGY',
          iso2: 'EG',
          name: 'Egypt',
          kind: 'sovereign',
          regionM49: '015',
          parent: 'REGION_015_Northern_Africa',
          admin1Count: 27,
          admin1: [
            { id: 'M49_818_ISO3_EGY_ADM1_001', level: 'admin1', parent: 'M49_818_ISO3_EGY_Egypt', admin1Code: 'EG-C', name: 'Al Qahirah', sourceName: 'Al Qahirah EG' },
            { id: 'M49_818_ISO3_EGY_ADM1_002', level: 'admin1', parent: 'M49_818_ISO3_EGY_Egypt', admin1Code: 'EG-ALX', name: 'Al Iskandariyah', sourceName: 'Al Iskandariyah EG' },
            { id: 'M49_818_ISO3_EGY_ADM1_003', level: 'admin1', parent: 'M49_818_ISO3_EGY_Egypt', admin1Code: 'EG-GZ', name: 'Al Jizah', sourceName: 'Al Jizah EG' }
          ]
        }
      ]
    },
    {
      m49: '018',
      name: 'Southern Africa',
      layer: 'REGION_018_Southern_Africa',
      level: 'region',
      countries: [
        {
          id: 'M49_710_ISO3_ZAF_South_Africa',
          level: 'country',
          m49: '710',
          iso3: 'ZAF',
          iso2: 'ZA',
          name: 'South Africa',
          kind: 'sovereign',
          regionM49: '018',
          parent: 'REGION_018_Southern_Africa',
          admin1Count: 9,
          admin1: [
            { id: 'M49_710_ISO3_ZAF_ADM1_001', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-NL', name: 'KwaZulu-Natal', sourceName: 'KwaZulu-Natal ZA' },
            { id: 'M49_710_ISO3_ZAF_ADM1_002', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-EC', name: 'Eastern Cape', sourceName: 'Eastern Cape ZA' },
            { id: 'M49_710_ISO3_ZAF_ADM1_003', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-MP', name: 'Mpumalanga', sourceName: 'Mpumalanga ZA' },
            { id: 'M49_710_ISO3_ZAF_ADM1_004', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-LP', name: 'Limpopo', sourceName: 'Limpopo ZA' },
            { id: 'M49_710_ISO3_ZAF_ADM1_005', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-GT', name: 'Gauteng', sourceName: 'Gauteng ZA' },
            { id: 'M49_710_ISO3_ZAF_ADM1_006', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-NW', name: 'North West', sourceName: 'North West ZA' },
            { id: 'M49_710_ISO3_ZAF_ADM1_007', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-WC', name: 'Western Cape', sourceName: 'Western Cape ZA' },
            { id: 'M49_710_ISO3_ZAF_ADM1_008', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-FS', name: 'Free State', sourceName: 'Free State ZA' },
            { id: 'M49_710_ISO3_ZAF_ADM1_009', level: 'admin1', parent: 'M49_710_ISO3_ZAF_South_Africa', admin1Code: 'ZA-NC', name: 'Northern Cape', sourceName: 'Northern Cape ZA' }
          ]
        }
      ]
    }
  ]
};

// Flattened lookup for all Admin1 entities
export const ALL_ADMIN1_SUBDIVISIONS: AfricaliaAdmin1[] = AFRICALIA_GEOGRAPHY_DATA.regions.flatMap(region =>
  region.countries.flatMap(country =>
    country.admin1.map(adm => ({
      ...adm,
      iso3: country.iso3,
      countryName: country.name,
      regionName: region.name
    }))
  )
);

export function getAdmin1ForCountry(iso3: string): AfricaliaAdmin1[] {
  return ALL_ADMIN1_SUBDIVISIONS.filter(a => a.iso3 === iso3);
}

export function searchAdmin1Subdivisions(query: string): AfricaliaAdmin1[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return ALL_ADMIN1_SUBDIVISIONS.filter(a =>
    a.name.toLowerCase().includes(q) ||
    (a.sourceName && a.sourceName.toLowerCase().includes(q)) ||
    (a.countryName && a.countryName.toLowerCase().includes(q)) ||
    (a.admin1Code && a.admin1Code.toLowerCase().includes(q))
  );
}
