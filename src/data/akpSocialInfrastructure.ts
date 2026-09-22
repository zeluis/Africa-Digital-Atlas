/**
 * akpSocialInfrastructure.ts - Hospitals, Referral Centers & Educational Clusters
 * Coordinate Space: 5796 x 5867 Native SVG Space
 * Authoritative Sources: WHO Global Health Observatory, UNESCO UIS, healthsites.io & World Bank
 */

export type SocialFacilityType = 'hospital' | 'school_university';

export interface SocialInfrastructureFacility {
  id: string;
  name: string;
  city: string;
  countryIso3: string;
  countryName: string;
  type: SocialFacilityType;
  x: number;
  y: number;
  capacityValue: number; // Beds for hospitals, Enrollment for educational clusters
  capacityUnit: string;
  categoryLabel: string;
  color: string;
  pulseColor: string;
  radius: number;
  specialization: string;
  stats: { label: string; value: string }[];
  description: string;
  source: string;
  labelOffset?: { x: number; y: number };
}

export const SOCIAL_FACILITY_TYPES = {
  hospital: {
    label: 'Tertiary Hospital & Medical Centers',
    color: '#06b6d4', // Cyan
    pulseColor: 'rgba(6, 182, 212, 0.45)',
    icon: 'Hospital'
  },
  school_university: {
    label: 'Universities & Academic Mega-Clusters',
    color: '#f59e0b', // Amber / Gold
    pulseColor: 'rgba(245, 158, 11, 0.45)',
    icon: 'GraduationCap'
  }
};

export const SOCIAL_INFRASTRUCTURE_DATA: SocialInfrastructureFacility[] = [
  // ==========================================
  // 1. TERTIARY HOSPITALS & MEDICAL HUBS (CYAN)
  // ==========================================
  {
    id: 'hosp-chris-hani-baragwanath',
    name: 'Chris Hani Baragwanath Academic Hospital',
    city: 'Johannesburg (Soweto)',
    countryIso3: 'ZAF',
    countryName: 'South Africa',
    type: 'hospital',
    x: 3380,
    y: 4720,
    capacityValue: 3200,
    capacityUnit: 'Inpatient Beds',
    categoryLabel: 'Mega Academic Hospital',
    color: '#06b6d4',
    pulseColor: 'rgba(6, 182, 212, 0.55)',
    radius: 46,
    specialization: 'Level-1 Trauma, Infectious Diseases & Organ Transplants',
    stats: [
      { label: 'Bed Capacity', value: '3,200 Beds (World 3rd Largest)' },
      { label: 'Annual Admissions', value: '150,000+ Inpatients' },
      { label: 'Staff Compliment', value: '6,700 Healthcare Workers' },
      { label: 'Affiliated University', value: 'Wits University Health Sciences' }
    ],
    description: 'The largest hospital in the Southern Hemisphere, occupying 173 acres and providing comprehensive tertiary referrals for Southern Africa.',
    source: 'Gauteng Department of Health / WHO Health Observatory',
    labelOffset: { x: -300, y: 80 }
  },
  {
    id: 'hosp-kasr-al-ainy',
    name: 'Kasr Al Ainy University Teaching Hospital',
    city: 'Cairo',
    countryIso3: 'EGY',
    countryName: 'Egypt',
    type: 'hospital',
    x: 3880,
    y: 1040,
    capacityValue: 5100,
    capacityUnit: 'Inpatient Beds',
    categoryLabel: 'University Medical Complex',
    color: '#06b6d4',
    pulseColor: 'rgba(6, 182, 212, 0.55)',
    radius: 50,
    specialization: 'Cardiology, Oncology, Renal & Pediatric Surgery',
    stats: [
      { label: 'Total Beds', value: '5,100 Beds Across 18 Hospitals' },
      { label: 'Annual Outpatients', value: '2.5 Million Consultations' },
      { label: 'Established', value: '1827 (Oldest Modern Medical School in MENA)' },
      { label: 'Surgical Theatres', value: '72 Modern Operating Rooms' }
    ],
    description: 'The foremost medical super-center in North Africa, functioning as Cairo University’s primary clinical research and training complex.',
    source: 'Egyptian Ministry of Health & Population / Cairo University',
    labelOffset: { x: 300, y: -70 }
  },
  {
    id: 'hosp-kenyatta-national',
    name: 'Kenyatta National Hospital (KNH)',
    city: 'Nairobi',
    countryIso3: 'KEN',
    countryName: 'Kenya',
    type: 'hospital',
    x: 4120,
    y: 3020,
    capacityValue: 2000,
    capacityUnit: 'Inpatient Beds',
    categoryLabel: 'National Referral Hospital',
    color: '#06b6d4',
    pulseColor: 'rgba(6, 182, 212, 0.50)',
    radius: 40,
    specialization: 'Neurosurgery, Burns & Critical Care, Oncology',
    stats: [
      { label: 'Bed Capacity', value: '2,000+ Licensed Beds' },
      { label: 'Catchment Area', value: 'East & Central Africa' },
      { label: 'Daily Outpatients', value: '2,500+ Patients' },
      { label: 'Research Wing', value: 'University of Nairobi Medical School' }
    ],
    description: 'The oldest and largest referral hospital in East Africa, handling apex medical emergencies and complex surgeries for the region.',
    source: 'Kenya Ministry of Health / KNH Annual Review',
    labelOffset: { x: 300, y: -70 }
  },
  {
    id: 'hosp-korle-bu',
    name: 'Korle Bu Teaching Hospital (KBTH)',
    city: 'Accra',
    countryIso3: 'GHA',
    countryName: 'Ghana',
    type: 'hospital',
    x: 1680,
    y: 2680,
    capacityValue: 2000,
    capacityUnit: 'Inpatient Beds',
    categoryLabel: 'Apex Teaching Hospital',
    color: '#06b6d4',
    pulseColor: 'rgba(6, 182, 212, 0.50)',
    radius: 40,
    specialization: 'Reconstructive Plastic Surgery, Cardiothoracic Surgery',
    stats: [
      { label: 'Bed Capacity', value: '2,000 Beds' },
      { label: 'Daily Consultations', value: '3,000 Outpatients' },
      { label: 'Sub-Specialty', value: 'National Cardiothoracic Centre' },
      { label: 'Founded', value: '1923' }
    ],
    description: 'The premier tertiary healthcare institution in West Africa, renowned for its National Cardiothoracic Centre and Reconstructive Surgery Unit.',
    source: 'Ghana Health Service / University of Ghana Medical School',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'hosp-luth-lagos',
    name: 'Lagos University Teaching Hospital (LUTH)',
    city: 'Lagos (Idi-Araba)',
    countryIso3: 'NGA',
    countryName: 'Nigeria',
    type: 'hospital',
    x: 2020,
    y: 2640,
    capacityValue: 1200,
    capacityUnit: 'Inpatient Beds',
    categoryLabel: 'Apex Teaching Hospital',
    color: '#06b6d4',
    pulseColor: 'rgba(6, 182, 212, 0.50)',
    radius: 36,
    specialization: 'Advanced Cancer Care (NSIA-LUTH), Assisted Reproduction',
    stats: [
      { label: 'Bed Capacity', value: '1,200 Beds' },
      { label: 'Advanced Oncology', value: 'NSIA-LUTH Comprehensive Cancer Center' },
      { label: 'Academic Base', value: 'University of Lagos College of Medicine' },
      { label: 'Catchment', value: 'South-West Nigeria (35M+ Population)' }
    ],
    description: 'One of the largest quaternary hospitals in Sub-Saharan Africa, serving metropolitan Lagos and the broader West African coastal corridor.',
    source: 'Federal Ministry of Health Nigeria',
    labelOffset: { x: 300, y: 70 }
  },
  {
    id: 'hosp-hopital-principal-dakar',
    name: 'Hôpital Principal de Dakar',
    city: 'Dakar',
    countryIso3: 'SEN',
    countryName: 'Senegal',
    type: 'hospital',
    x: 680,
    y: 2180,
    capacityValue: 850,
    capacityUnit: 'Inpatient Beds',
    categoryLabel: 'Regional Quaternary Center',
    color: '#06b6d4',
    pulseColor: 'rgba(6, 182, 212, 0.45)',
    radius: 32,
    specialization: 'Tropical Medicine, Hyperbaric Medicine & Emergency Care',
    stats: [
      { label: 'Bed Capacity', value: '850 Beds' },
      { label: 'Regional Role', value: 'Principal Medical Center for Francophone West Africa' },
      { label: 'Modern Equipment', value: 'High-Field MRI, Digital Angiography' },
      { label: 'Founded', value: '1884' }
    ],
    description: 'Renowned military-civilian teaching hospital providing apex medical care and clinical infectious disease response in Senegal.',
    source: 'Ministère de la Santé du Sénégal / WHO',
    labelOffset: { x: 290, y: 70 }
  },
  {
    id: 'hosp-ibn-sina-rabat',
    name: 'Centre Hospitalier Universitaire Ibn Sina',
    city: 'Rabat',
    countryIso3: 'MAR',
    countryName: 'Morocco',
    type: 'hospital',
    x: 1720,
    y: 840,
    capacityValue: 2400,
    capacityUnit: 'Inpatient Beds',
    categoryLabel: 'University Hospital Center',
    color: '#06b6d4',
    pulseColor: 'rgba(6, 182, 212, 0.50)',
    radius: 42,
    specialization: 'Oncology (National Institute of Oncology), Cardiology',
    stats: [
      { label: 'Bed Capacity', value: '2,400 Beds Across 10 Hospitals' },
      { label: 'Modern Expansion', value: 'New 33-Story Tower (1,044 Beds Underway)' },
      { label: 'Surgeries', value: '45,000+ Major Operations / Year' },
      { label: 'Faculty', value: 'Faculty of Medicine and Pharmacy of Rabat' }
    ],
    description: 'Morocco’s largest healthcare provider, currently undergoing historic modernization with a sustainable smart hospital skyscraper.',
    source: 'Ministère de la Santé et de la Protection Sociale (Maroc)',
    labelOffset: { x: -300, y: 60 }
  },

  // ==========================================
  // 2. UNIVERSITIES & ACADEMIC MEGA-CLUSTERS (AMBER / GOLD)
  // ==========================================
  {
    id: 'univ-cairo',
    name: 'Cairo University Academic Campus',
    city: 'Giza / Cairo',
    countryIso3: 'EGY',
    countryName: 'Egypt',
    type: 'school_university',
    x: 3850,
    y: 1020,
    capacityValue: 260000,
    capacityUnit: 'Enrolled Students',
    categoryLabel: 'Mega University Campus',
    color: '#f59e0b',
    pulseColor: 'rgba(245, 158, 11, 0.60)',
    radius: 52,
    specialization: 'Engineering, Medicine, Law, Science & Humanities',
    stats: [
      { label: 'Total Enrollment', value: '260,000+ Students' },
      { label: 'Faculties', value: '26 Distinct Colleges & Research Centers' },
      { label: 'Nobel Laureates', value: '3 Nobel Laureates (Naguib Mahfouz, Yasser Arafat, Mohamed ElBaradei)' },
      { label: 'Continental Rank', value: 'Top 3 in Africa by Research Output' }
    ],
    description: 'The historic flagship institution of Egyptian higher education, producing generations of continental statesmen, scientists, and writers.',
    source: 'UNESCO Institute for Statistics / Times Higher Education Africa Ranking',
    labelOffset: { x: -300, y: 150 }
  },
  {
    id: 'univ-uct-cape-town',
    name: 'University of Cape Town (UCT)',
    city: 'Cape Town (Rondebosch)',
    countryIso3: 'ZAF',
    countryName: 'South Africa',
    type: 'school_university',
    x: 2820,
    y: 5280,
    capacityValue: 29000,
    capacityUnit: 'Enrolled Students',
    categoryLabel: 'Premier Research University',
    color: '#f59e0b',
    pulseColor: 'rgba(245, 158, 11, 0.55)',
    radius: 44,
    specialization: 'Astrophysics (SKA Partner), Climate Change, Biomedical Sciences',
    stats: [
      { label: 'Student Body', value: '29,000 Students (100+ Nationalities)' },
      { label: 'Global Ranking', value: '#1 in Africa (QS & THE World Rankings)' },
      { label: 'Research Output', value: 'Over 40 NRF A-rated Scientists' },
      { label: 'Campus', value: 'Groote Schuur Estate at Devils Peak' }
    ],
    description: 'The highest-ranked university in Africa, internationally celebrated for its biomedical research, environmental governance, and astronomy partnerships.',
    source: 'UCT Institutional Information & Analysis / QS World University Rankings',
    labelOffset: { x: 300, y: 70 }
  },
  {
    id: 'univ-makerere',
    name: 'Makerere University',
    city: 'Kampala',
    countryIso3: 'UGA',
    countryName: 'Uganda',
    type: 'school_university',
    x: 3840,
    y: 2980,
    capacityValue: 38000,
    capacityUnit: 'Enrolled Students',
    categoryLabel: 'Historic Pan-African University',
    color: '#f59e0b',
    pulseColor: 'rgba(245, 158, 11, 0.50)',
    radius: 40,
    specialization: 'Public Health, Agricultural Biotechnology, Pan-African Literature',
    stats: [
      { label: 'Enrollment', value: '38,000 Undergraduate & Graduate' },
      { label: 'Historic Role', value: 'Alma mater of Julius Nyerere, Milton Obote, Mwai Kibaki' },
      { label: 'Research Strength', value: 'Leading East African Infectious Disease Studies' },
      { label: 'Founded', value: '1922' }
    ],
    description: 'One of the most prestigious and historic academic institutions in Sub-Saharan Africa, often called the "Harvard of Africa".',
    source: 'Makerere Directorate of Research and Graduate Training / UNESCO',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'univ-cheikh-anta-diop',
    name: 'Université Cheikh Anta Diop (UCAD)',
    city: 'Dakar',
    countryIso3: 'SEN',
    countryName: 'Senegal',
    type: 'school_university',
    x: 660,
    y: 2140,
    capacityValue: 85000,
    capacityUnit: 'Enrolled Students',
    categoryLabel: 'Major Francophone Hub',
    color: '#f59e0b',
    pulseColor: 'rgba(245, 158, 11, 0.50)',
    radius: 42,
    specialization: 'African Civilizations, Fundamental Physics (IFAN), Mathematics',
    stats: [
      { label: 'Student Population', value: '85,000+ Students' },
      { label: 'Catchment', value: 'Trains leaders across 20+ African countries' },
      { label: 'Research Institute', value: 'Institut Fondamental d’Afrique Noire (IFAN)' },
      { label: 'Continental Rank', value: 'Top 10 in Sub-Saharan Africa' }
    ],
    description: 'The intellectual heart of Francophone West Africa, named after polymath Cheikh Anta Diop and renowned for scientific and historical scholarship.',
    source: 'Ministère de l’Enseignement Supérieur du Sénégal / AUDA-NEPAD',
    labelOffset: { x: 290, y: -70 }
  },
  {
    id: 'univ-ibadan',
    name: 'University of Ibadan (UI)',
    city: 'Ibadan',
    countryIso3: 'NGA',
    countryName: 'Nigeria',
    type: 'school_university',
    x: 1980,
    y: 2600,
    capacityValue: 35000,
    capacityUnit: 'Enrolled Students',
    categoryLabel: 'Premier Nigerian University',
    color: '#f59e0b',
    pulseColor: 'rgba(245, 158, 11, 0.48)',
    radius: 38,
    specialization: 'Medicine (UCH), Tropical Agriculture, English Literature & History',
    stats: [
      { label: 'Enrollment', value: '35,000 Students' },
      { label: 'Historic Landmark', value: 'First Degree Awarding Institution in Nigeria (1948)' },
      { label: 'Literary Legacy', value: 'Educated Chinua Achebe, Wole Soyinka, J.P. Clark' },
      { label: 'Postgraduate Focus', value: 'Produces 35% of Nigerian PhDs' }
    ],
    description: 'Nigeria’s premier university, celebrated as the cradle of modern African literature and tropical agronomy research.',
    source: 'National Universities Commission (NUC) Nigeria / UNESCO UIS',
    labelOffset: { x: -300, y: -70 }
  },
  {
    id: 'univ-addis-ababa',
    name: 'Addis Ababa University (AAU)',
    city: 'Addis Ababa',
    countryIso3: 'ETH',
    countryName: 'Ethiopia',
    type: 'school_university',
    x: 4050,
    y: 2320,
    capacityValue: 48000,
    capacityUnit: 'Enrolled Students',
    categoryLabel: 'Autonomous National University',
    color: '#f59e0b',
    pulseColor: 'rgba(245, 158, 11, 0.48)',
    radius: 38,
    specialization: 'Paleoanthropology (Institute of Ethiopian Studies), Hydro-Engineering',
    stats: [
      { label: 'Enrollment', value: '48,000 Students' },
      { label: 'Campuses', value: '14 Distinct Campuses in Addis Ababa' },
      { label: 'Global Heritage', value: 'Custodian of Lucy (Dinkinesh) fossil discoveries' },
      { label: 'Status', value: 'First Autonomous Public University in Ethiopia' }
    ],
    description: 'The intellectual hub of the Horn of Africa, home to the Institute of Ethiopian Studies and leading geological and heritage scholarship.',
    source: 'Ministry of Education Ethiopia / AAU Strategic Plan',
    labelOffset: { x: 300, y: 70 }
  }
];
