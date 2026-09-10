export interface AfricaliaEntity {
  id: string;
  label: string;
  type: string;
}

export interface RegionOption {
  value: string;
  label: string;
}

export const AFRICALIA_REGIONS: RegionOption[] = [
  { value: 'west-sahael', label: 'West Sahel' },
  { value: 'western-africa', label: 'Western Africa' },
  { value: 'southern-africa', label: 'Southern Africa' },
  { value: 'northern-africa', label: 'Northern Africa' },
  { value: 'east-sahel', label: 'East Sahel' },
  { value: 'east-guinea', label: 'East Guinea' },
  { value: 'central-africa', label: 'Central Africa' }
];

export const AFRICALIA_COUNTRY_LABELS: Record<string, string> = {
  'guinea-conacry': 'Guinea',
  'guinea-eq': 'Equatorial Guinea',
  'ivory-coast': 'Côte d’Ivoire',
  'rc': 'Republic of the Congo',
  'drc': 'Democratic Republic of the Congo',
  'kenia': 'Kenya',
  'lybia': 'Libya',
  'marroco': 'Morocco',
  'south-namibia': 'Namibia',
  'cabo-verde': 'Cabo Verde'
};

export const AFRICALIA_LAYER_GROUPS = {
  first: 'quant--tast--first--totals--5694581--THE-MAIN-REGION-WITH-HIGHER-TOTAL-TAST--1500-1866-WEST-CENTRAL-AFRICA-AND-ST-HELENA',
  second: 'quant--tast--second--totals--4802952--SECOND-REGION-HIGH-TAST--1500-1866--BIGHT-OF-BENINN--BIGHT-OF-BIAFRA--GOLD_COAST',
  third: 'quant--tast--third--totals--2023821--THIRD_REGION_AND_LESS_OF_TAST-1500-1866-SOUTH-EAST_AFRICA-AND-ISLANDS-SOUTHERN_AFRICA-SENEGAMBIA-AND--OFF-SHORE-ATLANTIC-SIERRA-LEONE--WINWARD-COST-SOUTH-EAST-AFRICA-AND-INDIAN-OCEAN-ISLANDS'
};

export const AFRICALIA_CABO_VERDE_DATA = {
  title: 'Cabo Verde',
  sourceFile: 'Genetic and Social Structure of Cape Verde.md',
  context: [
    'The supplied documentation presents Cabo Verde as a central Luso-African Atlantic case study and emphasizes its relationship to the early Atlantic slave system.',
    'It documents sex-biased admixture patterns, including 93–97% African maternal origin and over 53% European paternal origin, as reported in the supplied source.',
    'It describes Cabo Verdean Kriolu as emerging from Portuguese and West African linguistic interaction and discusses island-level demographic differentiation.',
    'It identifies named Cabo Verde-associated groups in the revised SVG, including Baga, Balanta, Biafada, Bijagos, Bambara, Fula, Mandinka, Nalu, Papel, Sereer, Susu and Wolof.'
  ],
  numbers: [
    { label: 'Maternal (mtDNA)', value: '93–97% African origin' },
    { label: 'Paternal (NRY)', value: 'Over 53% European origin' },
    { label: 'Documented migration to São Tomé', value: '~80,000 Cabo Verdean serviçais (1900–1970)' }
  ],
  associatedEthnicIds: [
    'assoc--ethnic--baga--country--cabo-verde',
    'assoc--ethnic--balanta--country--cabo-verde',
    'assoc--ethnic--biafada--country--cabo-verde',
    'assoc--ethnic--bijagos--country--cabo-verde',
    'assoc--ethnic--bambara--country--cabo-verde',
    'assoc--ethnic--basari-tenda--country--cabo-verde',
    'assoc--ethnic--banhun-bainouk--country--cabo-verde',
    'assoc--ethnic--cassanga--country--cabo-verde',
    'assoc--ethnic--cocoli--country--cabo-verde',
    'assoc--ethnic--diola--country--cabo-verde',
    'assoc--ethnic--fula--country--cabo-verde',
    'assoc--ethnic--jallonke--country--cabo-verde',
    'assoc--ethnic--mande--country--cabo-verde',
    'assoc--ethnic--mandinka--country--cabo-verde',
    'assoc--ethnic--nalu--country--cabo-verde',
    'assoc--ethnic--papel--country--cabo-verde',
    'assoc--ethnic--sape--country--cabo-verde',
    'assoc--ethnic--sereer--country--cabo-verde',
    'assoc--ethnic--susu--country--cabo-verde',
    'assoc--ethnic--wolof--country--cabo-verde'
  ]
};

export function formatAfricaliaTitleCase(s: string): string {
  return s
    .replace(/\b\w/g, m => m.toUpperCase())
    .replace(/\bTg\b/g, 'Tg')
    .replace(/-/g, ' ');
}

export function formatAfricaliaIdTitle(id: string): string {
  const parts = id.split('--');
  if (id.startsWith('node--ethnic--')) return formatAfricaliaTitleCase(parts[2]);
  if (id.startsWith('node--country--') || id.startsWith('geo--country--') || id.startsWith('label--country--')) {
    return formatAfricaliaTitleCase(parts.slice(2).join(' '));
  }
  if (id.startsWith('node--geo--country--')) return 'Cabo Verde';
  if (id.startsWith('node--region--') || id.startsWith('branch--region--')) return formatAfricaliaTitleCase(parts.slice(2).join(' '));
  if (id.startsWith('assoc--ethnic--')) return formatAfricaliaTitleCase(parts[2]);
  if (id.startsWith('label--ethnic--')) return formatAfricaliaTitleCase(parts[2]);
  if (id.startsWith('branch--ethnic--')) return formatAfricaliaTitleCase(parts[2]);
  if (id.startsWith('quant--')) return id.replace(/^quant--tast--/, 'TAST ').replace(/--/g, ' · ').replace(/_/g, ' ');
  return formatAfricaliaTitleCase(id);
}
