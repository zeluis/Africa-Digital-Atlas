/**
 * Molecular and Material Legacies of Slavery Dataset
 * An Interdisciplinary Synthesis of Genomic, Historical, and Archaeological Records
 * Based on research by Micheletti et al. (2020), Schroeder et al. (2015), 
 * Fortes-Lima et al. (2017), Abel (2016), Lund (2024), and the NY African Burial Ground Project.
 */

export interface GenomicAncestryRecord {
  region: string;
  historicalManifestPct: number;
  presentDayGenomicPct: number;
  ibdOverrepresentationNote: string;
  primaryAfricanRoots: string[];
}

export interface SexBiasedAdmixtureData {
  population: string;
  europeanPaternalY: number; // % European Y-chromosome
  africanPaternalY: number;   // % African Y-chromosome
  indigenousPaternalY: number;
  africanMaternalMt: number;  // % African mtDNA
  europeanMaternalMt: number; // % European mtDNA
  indigenousMaternalMt: number;
  historicalContext: string;
}

export interface TaxonomicFramework {
  scholarOrEvent: string;
  era: string;
  paradigm: string;
  classificationSystem: string;
  keyVarietiesAndRanking: string;
  economicAndLegalFunction: string;
}

export interface BioarchaeologicalSite {
  siteName: string;
  location: string;
  discoveryYear: number;
  principalInvestigators: string[];
  individualsAnalyzed: number;
  skeletalEvidence: {
    traumaAndLabor: string;
    nutritionalStress: string;
    childhoodMortality: string;
  };
  culturalPersistence: {
    ritualDentalModifications: string;
    burialOrientation: string;
    graveGoodsAndBeads: string;
  };
  politicalLegacy: string;
}

export interface ResearchCitation {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doiOrUrl?: string;
  keyFinding: string;
  category: 'Genomics' | 'Bioarchaeology' | 'Historiography' | 'Public Archaeology';
}

// 1. Identity By Descent (IBD) & Haplotype Deconvolution Data
export const IBD_GENOMIC_CONCORDANCE: GenomicAncestryRecord[] = [
  {
    region: 'United States (African Descendants)',
    historicalManifestPct: 24, // Manifests show lower direct Nigerian/Bight of Benin share vs Senegambia/Angola
    presentDayGenomicPct: 41, // Genomic overrepresentation of Nigerian-proximal ancestry
    ibdOverrepresentationNote: 'Overrepresentation driven by high domestic fertility, intra-American coastal deportations from the Caribbean, and early survival regimes in Chesapeake & Lowcountry plantations (Micheletti et al., 2020).',
    primaryAfricanRoots: ['Bight of Benin (Nigeria)', 'Bight of Biafra (Igbo/Ibibio)', 'Senegambia', 'West Central Africa (Angola/Kongo)']
  },
  {
    region: 'Brazil (Bahia & Southeast)',
    historicalManifestPct: 68,
    presentDayGenomicPct: 64,
    ibdOverrepresentationNote: 'Strong direct concordance with West Central Africa (Angola/Kongo) and Bight of Benin (Nagô/Yoruba), reflecting massive continuous 18th–19th century arrivals in Salvador and Rio de Janeiro.',
    primaryAfricanRoots: ['West Central Africa (Angola, Cabinda, Luanda)', 'Bight of Benin (Ouidah, Mina)', 'Mozambique & Southeast Africa']
  },
  {
    region: 'French Guiana & Suriname (Noir Marron)',
    historicalManifestPct: 35,
    presentDayGenomicPct: 98,
    ibdOverrepresentationNote: '98% African ancestral retention with extreme affinity to the Bight of Benin; genetic signature of self-liberation, military Maroon treaties, and reproductive isolation in rainforest interior (Fortes-Lima et al., 2017).',
    primaryAfricanRoots: ['Bight of Benin (Allada, Dahomey, Ouidah)', 'Gold Coast (Akan/Coromantee)', 'West Central Africa']
  },
  {
    region: 'British & French Caribbean (Jamaica, Haiti, Barbados)',
    historicalManifestPct: 48,
    presentDayGenomicPct: 53,
    ibdOverrepresentationNote: 'High concordance with Gold Coast (Akan) and Bight of Biafra; demographic sink required continuous replacement voyages due to brutal sugar plantation attrition.',
    primaryAfricanRoots: ['Gold Coast (Akan)', 'Bight of Biafra (Igbo)', 'West Central Africa', 'Windward Coast']
  },
  {
    region: 'Spanish Americas (Colombia, Cuba, Puerto Rico)',
    historicalManifestPct: 22,
    presentDayGenomicPct: 28,
    ibdOverrepresentationNote: 'Tri-hybrid admixture (African, Indigenous, and European) with early 16th-17th century Senegambian and West Central African signatures, complemented by 19th-century Cuban sugar boom surges.',
    primaryAfricanRoots: ['Senegambia (Mandinka, Wolof)', 'West Central Africa (Kongo)', 'Bight of Benin']
  }
];

// 2. Sex-Biased Gene Flow Matrix (The Biological Ledger of Sexual Violence)
export const SEX_BIASED_GENE_FLOW: SexBiasedAdmixtureData[] = [
  {
    population: 'African Americans (United States)',
    europeanPaternalY: 38,
    africanPaternalY: 60,
    indigenousPaternalY: 2,
    africanMaternalMt: 92,
    europeanMaternalMt: 5,
    indigenousMaternalMt: 3,
    historicalContext: 'Profound asymmetry (European Y >> European mtDNA) reflecting institutionalized sexual violence by plantation owners, overseers, and legally sanctioned chattel patriarchy (Micheletti et al., 2020).'
  },
  {
    population: 'Afro-Brazilians (Northeast & Southeast)',
    europeanPaternalY: 52,
    africanPaternalY: 44,
    indigenousPaternalY: 4,
    africanMaternalMt: 85,
    europeanMaternalMt: 8,
    indigenousMaternalMt: 7,
    historicalContext: 'High European paternal contribution resulting from colonial "branqueamento" policies, patriarchal sugar mills (engenhos), and coerced concubinage, paired with overwhelmingly African maternal lineage.'
  },
  {
    population: 'Afro-Colombians (Chocó & Pacific Basin)',
    europeanPaternalY: 34,
    africanPaternalY: 62,
    indigenousPaternalY: 4,
    africanMaternalMt: 89,
    europeanMaternalMt: 4,
    indigenousMaternalMt: 7,
    historicalContext: 'Gold placer mining economy in Pacific lowlands fostered high African maternal preservation, while European colonial administrators dominated legal and coercive paternal structures.'
  },
  {
    population: 'Noir Marron Communities (Suriname & French Guiana)',
    europeanPaternalY: 4,
    africanPaternalY: 94,
    indigenousPaternalY: 2,
    africanMaternalMt: 97,
    europeanMaternalMt: 1,
    indigenousMaternalMt: 2,
    historicalContext: 'Near-total absence of European paternal gene flow (~4%), documenting the efficacy of Maroon self-liberation, armed resistance, and geographic isolation away from plantation sexual violence (Fortes-Lima et al., 2017).'
  },
  {
    population: 'Afro-Caribbeans (English/French Antilles)',
    europeanPaternalY: 42,
    africanPaternalY: 56,
    indigenousPaternalY: 2,
    africanMaternalMt: 91,
    europeanMaternalMt: 6,
    indigenousMaternalMt: 3,
    historicalContext: 'Absentee planter class and violent white managerial hierarchies generated extensive paternal European admixture alongside enduring African maternal lineages across the sugar archipelago.'
  }
];

// 3. Ancient DNA Case Studies
export const ANCIENT_DNA_STUDIES = [
  {
    id: 'zoutsteeg-st-martin',
    title: 'The Zoutsteeg Individuals (Saint Martin, c. 1660s)',
    leadAuthor: 'Hannes Schroeder et al. (PNAS 2015)',
    dating: 'Late 17th Century (c. 1660–1690)',
    location: 'Zoutsteeg, Philipsburg, Saint Martin (Caribbean)',
    individuals: '3 enslaved individuals recovered from an unrecorded urban burial context',
    genomicFindings: 'Genome-wide ancient DNA sequencing revealed origins spanning both Bantu-speaking regions (northern Cameroon/Gabon) and non-Bantu-speaking regions (coastal Nigeria and Ghana).',
    historicalSignificance: 'Provided the first direct molecular evidence identifying specific African subcontinental roots at a 17th-century historical juncture when shipping manifests and archival documentation were exceptionally scarce or completely missing.',
    counterArchiveValue: 'Directly bypassed the erasure of 17th-century Dutch West India Company paper losses.'
  },
  {
    id: 'noir-marron-genomics',
    title: 'Noir Marron Genomic Architecture (Suriname & French Guiana)',
    leadAuthor: 'César Fortes-Lima et al. (Am J Hum Genet 2017)',
    dating: '18th–21st Century Continuity',
    location: 'Maroni River Basin, Suriname and French Guiana',
    individuals: 'Aluku, Ndjuka, and Paramaka Maroon communities',
    genomicFindings: '98% African ancestral retention with predominant affinity to the Bight of Benin (Fon, Ewe, Yoruba, Mina). Extremely low European or Native American admixture compared to urban diaspora.',
    historicalSignificance: 'Biological proof of the success of Maroon guerilla warfare and treaty-enforced autonomy, demonstrating how socio-political resistance translated directly into biomolecular isolation.',
    counterArchiveValue: 'Refutes colonial narratives that portrayed Maroons as ephemeral runaways; proves centuries of resilient demographic and cultural self-sovereignty.'
  }
];

// 4. Ideological Architecture & Scientific Racism Evolution
export const SCIENTIFIC_RACISM_CHRONOLOGY: TaxonomicFramework[] = [
  {
    scholarOrEvent: 'Pre-Enlightenment Theological Canon',
    era: '15th–17th Century',
    paradigm: 'Religious Hierarchy ("Curse of Ham" / Genesis 9)',
    classificationSystem: 'Biblical Genealogies (Descendants of Shem, Ham, Japheth)',
    keyVarietiesAndRanking: 'Enslavement framed as divine punishment for the "Hamitic line", establishing moral dispensation for chattel trade without biological essentialism.',
    economicAndLegalFunction: 'Sanctioned early Portuguese and Spanish papal bulls (Dum Diversas 1452, Romanus Pontifex 1455) for Atlantic slave commerce.'
  },
  {
    scholarOrEvent: 'Carl Linnaeus (Systema Naturae)',
    era: '1735 / 1758 (10th Edition)',
    paradigm: 'Enlightenment Natural History & Great Chain of Being (Scala Naturae)',
    classificationSystem: 'Four Geographic Varieties of Homo sapiens',
    keyVarietiesAndRanking: '1. Europaeus (White, sanguine, governed by laws)\n2. Americanus (Reddish, choleric, regulated by customs)\n3. Asiaticus (Yellowish, melancholic, ruled by opinions)\n4. Africanus (Black, phlegmatic, relaxed, governed by caprice/arbitrary will).',
    economicAndLegalFunction: 'Reified subjective social hierarchies into immutable natural categories, embedding temperament and civilizational capacity into biological taxonomy.'
  },
  {
    scholarOrEvent: 'Johann Friedrich Blumenbach',
    era: '1775 / 1795 (De Generis Humani Varietate Nativa)',
    paradigm: 'Comparative Craniometry & "Degeneration" Theory',
    classificationSystem: 'Five Races based on skull morphology',
    keyVarietiesAndRanking: '1. Caucasian (Apex/archetype created by God in the Caucasus mountains)\n2. Mongolian & 3. Ethiopian (African) (Degenerations from apex)\n4. American & 5. Malay (Transitional forms).',
    economicAndLegalFunction: 'Coined the term "Caucasian" as the aesthetic and physiological standard; created a pseudo-scientific framework framing Black physiology as a degenerative deviation.'
  },
  {
    scholarOrEvent: 'Dred Scott v. Sandford (U.S. Supreme Court)',
    era: '1857',
    paradigm: 'Judicial & Constitutional Codification of Biological Racism',
    classificationSystem: 'Chief Justice Roger B. Taney majority opinion',
    keyVarietiesAndRanking: 'Ruled that persons of African descent had "no rights which the white man was bound to respect" and could never become citizens of the United States.',
    economicAndLegalFunction: 'Provided foundational legal immunity for the expansion of chattel slavery into western territories, protecting Northern and Southern industrial capital extraction.'
  }
];

// 5. Structural Underdevelopment & Capital Flow Analysis
export const STRUCTURAL_UNDERDEVELOPMENT_DATA = {
  africanDemographicDrain: {
    totalExtracted: '12.5+ Million directly embarked; tens of millions perished in interior warfare, raids, and coastal barracoons',
    ageDemographics: 'Over 70% were young adults aged 15–30 (the peak reproductive and productive labor force)',
    economicImpact: 'Destruction of indigenous textile weaving (e.g. Kano cloth), iron smelting, and agricultural innovation; replaced productive economies with predatory gun-slave capture cycles.'
  },
  plantationDemographicSink: {
    commodityCrops: ['Sugar Cane (Brazil, Caribbean)', 'Cotton (US South)', 'Tobacco (Chesapeake)', 'Coffee (Brazil)', 'Rice & Indigo (Lowcountry)'],
    mortalityAttrition: 'In Caribbean sugar plantations, mortality exceeded birth rates continuously, requiring an endless influx of "replacement" captives—a true demographic sink.',
    regimeComparison: 'US South established an unprecedented domestic breeding regime post-1808 federal abolition of international importation, driving massive domestic slave trade (1+ million marched south).'
  },
  globalCapitalAccumulation: {
    financialInstitutions: 'Barclays, Lloyds, Bank of England, and Wall Street merchant banks originated as insurers and creditors for slave ships and plantation mortgages.',
    industrialRevolution: 'Cheap, coercively extracted cotton from enslaved labor powered the textile mills of Manchester and Lancashire, creating modern industrial capitalism.'
  }
};

// 6. Bioarchaeological Case Study: New York African Burial Ground (1991)
export const NY_AFRICAN_BURIAL_GROUND: BioarchaeologicalSite = {
  siteName: 'The New York African Burial Ground (Negroes Burying Ground)',
  location: 'Lower Manhattan (Duane & Reade Streets), New York City',
  discoveryYear: 1991,
  principalInvestigators: ['Dr. Michael L. Blakey (Howard University)', 'Descendant Community Advisory Committee', 'GSA Project Team'],
  individualsAnalyzed: 419,
  skeletalEvidence: {
    traumaAndLabor: 'Severe enthesopathies (muscle insertion tears), vertebral compression fractures, and cranial trauma documenting brutal manual portage, dock labor, and physical violence in colonial New York.',
    nutritionalStress: 'High rates of linear enamel hypoplasia (LEH) and porotic hyperostosis, reflecting chronic childhood nutritional deprivation, parasitic infections, and famine.',
    childhoodMortality: 'Over 40% of the recovered individuals were infants and young children under age two, exposing extreme infant mortality under urban enslavement regimes.'
  },
  culturalPersistence: {
    ritualDentalModifications: 'Incisors deliberately filed and modified in accordance with West and West-Central African cultural aesthetics, maintained despite violent colonial suppression of ethnic identities.',
    burialOrientation: 'Overwhelmingly oriented with heads to the west and feet to the east, facing the rising sun and the African continent.',
    graveGoodsAndBeads: 'Discovered cowrie shells, trade beads, tobacco pipes, and a copper alloy coffin adornment identified as the West African Akan "Sankofa" heart-shaped cosmogram.'
  },
  politicalLegacy: 'Pioneered the "Public Archaeology" model where descendant community members held veto power and intellectual leadership, transforming a state construction site into a National Monument and paradigm-shifting research archive.'
};

// 7. Decolonizing Heritage & Consumer Genomics Analysis
export const PUBLIC_ARCHAEOLOGY_AND_MYTHS = {
  consumerGenomicsLandscape: {
    platforms: ['23andMe', 'AncestryDNA', 'African Ancestry (mtDNA/Y-DNA matching)'],
    empowermentAndCatharsis: 'Allows diaspora individuals to bypass deliberately silenced metropole paper archives and recover specific biogeographical affinities in West and Central Africa (Sarah Abel, 2016).',
    limitationsAndRisks: 'Ancestry percentages risk creating new "conceptual loops" by re-essentializing race through proprietary commercial reference databases rather than historical social processes.'
  },
  theNativeAmericanMythAnalysis: {
    phenomenon: 'Genomic testing frequently debunks widespread family oral traditions claiming distant Native American grandmothers in African American lineages.',
    historicalPsychologicalFunction: '1. Psychological buffer: Provided an alternative explanation for phenotypic diversity (lighter skin, straighter hair) that bypassed the traumatic reality of European master-enslaved sexual violence.\n2. Legal evasion: In Jim Crow regimes, claiming indigenous ancestry offered a strategic narrative distancing from anti-Black legal statutes.\n3. Counter-narrative: Genetic genealogy reveals that unexpected European paternal DNA (Y-chromosome) is the true source of phenotypic variance, exposing the pervasive reach of plantation sexual exploitation.'
  }
};

// 8. Interdisciplinary Research Bibliography
export const MOLECULAR_RESEARCH_CITATIONS: ResearchCitation[] = [
  {
    id: 'micheletti-2020',
    authors: 'Micheletti, Steven J., et al.',
    year: 2020,
    title: 'Genetic Consequences of the Transatlantic Slave Trade in the Americas',
    journal: 'The American Journal of Human Genetics, 107(2), 265–277',
    doiOrUrl: 'https://doi.org/10.1016/j.ajhg.2020.06.012',
    keyFinding: 'Analyzed >50,000 genotyped individuals; revealed profound sex-biased admixture across the Americas and identified significant IBD overrepresentation of Nigerian-proximal ancestry in the USA due to intra-American slave deportations.',
    category: 'Genomics'
  },
  {
    id: 'schroeder-2015',
    authors: 'Schroeder, Hannes, et al.',
    year: 2015,
    title: 'Genome-wide ancestry of 17th-century enslaved Africans from the Caribbean',
    journal: 'Proceedings of the National Academy of Sciences (PNAS), 112(12), 3669–3673',
    doiOrUrl: 'https://doi.org/10.1073/pnas.1421784112',
    keyFinding: 'Pioneered ancient DNA capture from the Zoutsteeg site in Saint Martin; proved roots in both Bantu (Cameroon) and non-Bantu (Ghana/Nigeria) language groups during early 1600s Dutch colonial trade.',
    category: 'Genomics'
  },
  {
    id: 'fortes-lima-2017',
    authors: 'Fortes-Lima, César, et al.',
    year: 2017,
    title: 'Genome-wide Ancestry and Demographic History of African-Descendant Maroon Communities from French Guiana and Suriname',
    journal: 'The American Journal of Human Genetics, 101(5), 725–736',
    doiOrUrl: 'https://doi.org/10.1016/j.ajhg.2017.09.021',
    keyFinding: 'Discovered 98% African ancestral preservation in Noir Marron communities with dominant Bight of Benin affinity; molecular evidence of guerilla warfare success and isolated reproductive autonomy.',
    category: 'Genomics'
  },
  {
    id: 'blakey-2001',
    authors: 'Blakey, Michael L. & Rankin-Hill, Lesley M.',
    year: 2001,
    title: 'The New York African Burial Ground: Skeletal Biology Final Report',
    journal: 'Howard University / U.S. General Services Administration',
    doiOrUrl: 'https://www.nps.gov/afbg/learn/historyculture/index.htm',
    keyFinding: 'Forensic bioarchaeological accounting of 419 individuals; revealed physical trauma, ritual dental filing, and cultural resistance in colonial New York, establishing the Public Archaeology descendant-empowerment paradigm.',
    category: 'Bioarchaeology'
  },
  {
    id: 'abel-2016',
    authors: 'Abel, Sarah',
    year: 2016,
    title: 'In Search of Transatlantic Identities: Genetic Genealogy and the Remapping of the African Diaspora',
    journal: 'Nuevo Mundo Mundos Nuevos [Online]',
    doiOrUrl: 'https://doi.org/10.4000/nuevomundo.69176',
    keyFinding: 'Critiqued the sociological dimensions of commercial DNA testing in the African diaspora, analyzing the negotiation between personal identity, family oral myths, and genomic science.',
    category: 'Public Archaeology'
  },
  {
    id: 'lund-2024',
    authors: 'Lund, Matthew',
    year: 2024,
    title: 'A Prehistory of Scientific Racism: The Great Chain of Being and Enlightenment Taxonomy',
    journal: 'MIT Press Reader',
    doiOrUrl: 'https://thereader.mitpress.mit.edu',
    keyFinding: 'Traces how Enlightenment naturalists (Linnaeus, Blumenbach) repurposed metaphysical Scala Naturae into pseudo-biological racial hierarchies to justify colonial extraction.',
    category: 'Historiography'
  }
];
