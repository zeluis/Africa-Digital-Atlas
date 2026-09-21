export interface AfricaCountryLabel {
  id: string;
  name: string;
  x: number;
  y: number;
  size: 'huge' | 'large' | 'medium' | 'small';
}

export const AFRICA_FINAL_VIEWBOX = "0 0 5796.6572 5867.728";

export const AFRICA_FINAL_COUNTRY_LABELS: AfricaCountryLabel[] = [
  { id: 'DZA', name: 'Algeria', x: 2577, y: 1273, size: 'huge' },
  { id: 'AGO', name: 'Angola', x: 3088, y: 3959, size: 'large' },
  { id: 'BEN', name: 'Benin', x: 2364, y: 2598, size: 'small' },
  { id: 'BWA', name: 'Botswana', x: 3373, y: 4627, size: 'medium' },
  { id: 'BFA', name: 'Burkina Faso', x: 2073, y: 2471, size: 'medium' },
  { id: 'BDI', name: 'Burundi', x: 3672, y: 3518, size: 'small' },
  { id: 'CMR', name: 'Cameroon', x: 2795, y: 2898, size: 'large' },
  { id: 'CPV', name: 'Cabo Verde', x: 730, y: 2280, size: 'small' },
  { id: 'CAF', name: 'Cent. Afr. Rep.', x: 3266, y: 2872, size: 'large' },
  { id: 'TCD', name: 'Chad', x: 3109, y: 2280, size: 'huge' },
  { id: 'COM', name: 'Comoros', x: 4830, y: 3980, size: 'small' },
  { id: 'COG', name: 'Congo', x: 2950, y: 3390, size: 'medium' },
  { id: 'COD', name: 'Dem. Rep. Congo', x: 3345, y: 3535, size: 'huge' },
  { id: 'CIV', name: "Côte d'Ivoire", x: 1792, y: 2686, size: 'medium' },
  { id: 'DJI', name: 'Djibouti', x: 4710, y: 2390, size: 'small' },
  { id: 'EGY', name: 'Egypt', x: 3770, y: 1318, size: 'huge' },
  { id: 'GNQ', name: 'Eq. Guinea', x: 2610, y: 3180, size: 'small' },
  { id: 'ERI', name: 'Eritrea', x: 4410, y: 2060, size: 'medium' },
  { id: 'SWZ', name: 'Eswatini', x: 3880, y: 4940, size: 'small' },
  { id: 'ETH', name: 'Ethiopia', x: 4400, y: 2670, size: 'huge' },
  { id: 'GAB', name: 'Gabon', x: 2680, y: 3350, size: 'medium' },
  { id: 'GMB', name: 'Gambia', x: 1250, y: 2360, size: 'small' },
  { id: 'GHA', name: 'Ghana', x: 2020, y: 2700, size: 'medium' },
  { id: 'GIN', name: 'Guinea', x: 1470, y: 2470, size: 'medium' },
  { id: 'GNB', name: 'Guinea-Bissau', x: 1230, y: 2430, size: 'small' },
  { id: 'KEN', name: 'Kenya', x: 4210, y: 3260, size: 'large' },
  { id: 'LSO', name: 'Lesotho', x: 3640, y: 5120, size: 'small' },
  { id: 'LBR', name: 'Liberia', x: 1540, y: 2770, size: 'small' },
  { id: 'LBY', name: 'Libya', x: 3170, y: 1280, size: 'huge' },
  { id: 'MDG', name: 'Madagascar', x: 4920, y: 4460, size: 'huge' },
  { id: 'MWI', name: 'Malawi', x: 4030, y: 4060, size: 'medium' },
  { id: 'MLI', name: 'Mali', x: 2040, y: 1980, size: 'huge' },
  { id: 'MRT', name: 'Mauritania', x: 1500, y: 1780, size: 'huge' },
  { id: 'MUS', name: 'Mauritius', x: 5320, y: 4480, size: 'small' },
  { id: 'MAR', name: 'Morocco', x: 1940, y: 920, size: 'large' },
  { id: 'MOZ', name: 'Mozambique', x: 4180, y: 4420, size: 'huge' },
  { id: 'NAM', name: 'Namibia', x: 2970, y: 4620, size: 'huge' },
  { id: 'NER', name: 'Niger', x: 2620, y: 2020, size: 'huge' },
  { id: 'NGA', name: 'Nigeria', x: 2470, y: 2490, size: 'huge' },
  { id: 'RWA', name: 'Rwanda', x: 3650, y: 3450, size: 'small' },
  { id: 'STP', name: 'São Tomé & Príncipe', x: 2360, y: 3340, size: 'small' },
  { id: 'SEN', name: 'Senegal', x: 1300, y: 2260, size: 'medium' },
  { id: 'SYC', name: 'Seychelles', x: 5360, y: 3380, size: 'small' },
  { id: 'SLE', name: 'Sierra Leone', x: 1390, y: 2620, size: 'small' },
  { id: 'SOM', name: 'Somalia', x: 4850, y: 2820, size: 'huge' },
  { id: 'ZAF', name: 'South Africa', x: 3340, y: 5200, size: 'huge' },
  { id: 'SSD', name: 'South Sudan', x: 3770, y: 2680, size: 'large' },
  { id: 'SDN', name: 'Sudan', x: 3820, y: 2060, size: 'huge' },
  { id: 'TZA', name: 'Tanzania', x: 4050, y: 3660, size: 'huge' },
  { id: 'TGO', name: 'Togo', x: 2230, y: 2660, size: 'small' },
  { id: 'TUN', name: 'Tunisia', x: 2720, y: 720, size: 'medium' },
  { id: 'UGA', name: 'Uganda', x: 3880, y: 3180, size: 'medium' },
  { id: 'ESH', name: 'Western Sahara', x: 1320, y: 1380, size: 'large' },
  { id: 'XSL', name: 'Somaliland', x: 5020, y: 2280, size: 'small' },
  { id: 'ZMB', name: 'Zambia', x: 3550, y: 4180, size: 'huge' },
  { id: 'ZWE', name: 'Zimbabwe', x: 3710, y: 4490, size: 'large' }
];