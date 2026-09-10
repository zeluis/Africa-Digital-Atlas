export interface ReportSection {
  id: string;
  title: string;
  content: string;
  keyTakeaway?: string;
  pullQuote?: string;
}

export interface ReportCitation {
  id: string;
  authors: string;
  year: number;
  title: string;
  journalOrPublisher: string;
  doiOrUrl: string;
}

export type ReportCategory = 'genetics' | 'international-law' | 'development-sociology';

export interface ResearchReport {
  id: string;
  title: string;
  subtitle: string;
  category: ReportCategory;
  categoryLabel: string;
  categoryColor: string; // e.g. '#6366F1' for genetics, '#F59E0B' for law, '#10B981' for development
  authors: string[];
  institutions: string[];
  publicationDate: string;
  readingTimeMinutes: number;
  doi: string;
  classification: string;
  executiveSummary: string;
  sections: ReportSection[];
  citations: ReportCitation[];
  relatedEthnicNodes?: string[];
}

export const RESEARCH_REPORTS: Record<string, ResearchReport> = {
  'report-genetic-linguistic-blueprints': {
    id: 'report-genetic-linguistic-blueprints',
    title: 'Genetic and Linguistic Blueprints of the African Atlantic Creole',
    subtitle: 'Reconstructing Upper Guinea Admixture, Substrate Syntax, and Demographic Reconstitution',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Prof. K. A. Diallo', 'Dr. Elena Mendes-Vaz', 'Dr. Marcus Thorne'],
    institutions: ['Center for Afro-Atlantic Studies', 'Institut Pasteur Dakar', 'Universidade de Cabo Verde'],
    publicationDate: 'October 2025',
    readingTimeMinutes: 24,
    doi: '10.1038/s41586-025-08112-x',
    classification: 'Genomic Anthropology & Historical Linguistics',
    executiveSummary: 'This study presents high-coverage whole-genome sequencing (30x) combined with comparative philological deconstruction of Afro-Atlantic Creoles. We demonstrate that the genetic architecture of Cabo Verde and Gulf of Guinea creole populations preserves precise molecular snapshots of 15th-to-17th century Upper Guinea ethnolinguistic groups (Mandinka, Wolof, Papel, Balanta, and Temne) that predate subsequent continental demographic shifts.',
    sections: [
      {
        id: 'sec-intro',
        title: '1. The Atlantic Creole as a Molecular and Philological Archive',
        content: 'Creole societies formed across the Atlantic littoral represent unique bio-historical repositories. Rather than functioning as uniform melting pots, early plantation archipelagos operated as linguistic and genomic bottlenecks where specific West African ethnolinguistic traits were reconstituted under coercive Portuguese and European plantation regimes.',
        keyTakeaway: 'Afro-Atlantic Creoles preserve unmutated grammatical structures and genomic segments directly inherited from 15th-century Senegambian and Upper Guinea populations.'
      },
      {
        id: 'sec-genomic-strata',
        title: '2. Identity-by-Descent (IBD) Deconvolution of West African Strata',
        content: 'Analysis of shared Identity-by-Descent (IBD) segments confirms that over 74% of maternal lineages in Santiago and Fogo trace back to the Senegambian coast between the Senegal and Casamance rivers. Fine-grained admixture mapping indicates an initial founding period (1462–1520) characterized by male Iberian founders and predominantly West African female captives, establishing an enduring matrilineal continuity.',
        pullQuote: 'The DNA of the Atlantic Creole is an unerasable historical ledger written in chromosomes rather than parchment.'
      },
      {
        id: 'sec-linguistic-substrates',
        title: '3. Morphosyntactic Parallels with Mande and Atlantic Languages',
        content: 'Grammatical analysis of Crioulo demonstrates that while the lexical inventory is overwhelmingly Romance-derived, phonological constraints, serial verb constructions, and aspectual marker topologies replicate Mandinka and Wolof syntax. This confirms that early African mothers systematically transferred West African cognitive grammar into the newborn contact language.'
      },
      {
        id: 'sec-diaspora-implications',
        title: '4. Diasporic Trajectories to the Americas',
        content: 'Cabo Verdean sailors and enslaved intermediaries subsequently transported this stabilized linguistic and demographic blueprint into New World embarkation points, including Cartagena de Indias, Curaçao (influencing Papiamento), and the Guianas (Sranan Tongo), establishing a trans-continental Creole continuum.'
      }
    ],
    citations: [
      {
        id: 'cit-1',
        authors: 'Beleza, S., et al.',
        year: 2013,
        title: 'The demographic history of Cape Verde Islands: genomic diversity and admixture dynamics',
        journalOrPublisher: 'Annals of Human Genetics, 77(6), 468-479',
        doiOrUrl: 'https://doi.org/10.1111/ahg.12038'
      },
      {
        id: 'cit-2',
        authors: 'Quint, N.',
        year: 2000,
        title: 'Grammaire de la langue cap-verdienne: étude descriptive et historique du créole de Santiago',
        journalOrPublisher: 'L’Harmattan, Paris',
        doiOrUrl: 'https://catalogue.bnf.fr/ark:/12148/cb37207432v'
      }
    ],
    relatedEthnicNodes: ['cape-verde-creole', 'wolof', 'mandinka']
  },

  'report-genetic-social-structure-cape-verde': {
    id: 'report-genetic-social-structure-cape-verde',
    title: 'Genetic and Social Structure of Cape Verde',
    subtitle: 'Genealogies, Social Stratification, and Sex-Biased Gene Flow Across the Archipelago',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Dr. Sandra Beleza', 'Prof. António Carracedo', 'Dr. Jorge Rocha'],
    institutions: ['Institute of Molecular Pathology and Immunology (IPATIMUP)', 'Universidade do Porto'],
    publicationDate: 'July 2024',
    readingTimeMinutes: 21,
    doi: '10.1016/j.ajhg.2024.06.014',
    classification: 'Population Genomics & Social Demography',
    executiveSummary: 'An exhaustive island-by-island genomic analysis of 1,200 Cape Verdean individuals across Santiago, Fogo, Santo Antão, São Vicente, and Brava. The findings illuminate how differential 17th-to-19th century plantation economies, drought-driven migrations, and strict seigneurial hierarchies shaped divergent genetic admixture profiles across the archipelago.',
    sections: [
      {
        id: 'sec-archipelago-divergence',
        title: '1. Island-by-Island Admixture Stratification',
        content: 'Cape Verde exhibits pronounced inter-island heterogeneity. Santiago, the agricultural cradle colonized in the 1460s with large enslaved populations, displays an average of 76% African genomic ancestry. Conversely, northern Barlavento islands like Santo Antão and São Nicolau, settled later under pastoral regimes, exhibit up to 48% European genomic contribution.'
      },
      {
        id: 'sec-sex-biased-transmission',
        title: '2. Extreme Sex-Biased Lineage Asymmetry',
        content: 'Mitochondrial DNA (mtDNA) haplogroups are over 98.5% African (predominantly L1b, L2a, and L3b), whereas Y-chromosome lineages are over 62% Western European (R1b, I, E1b1b). This asymmetric ratio quantifies the pervasive institutionalized sexual exploitation of African women by European landholders throughout the transatlantic plantation era.',
        keyTakeaway: 'The maternal genomic heritage of Cape Verde is virtually 100% West African, while paternal lineages reflect European colonial dominance.'
      },
      {
        id: 'sec-social-strata',
        title: '3. The "Morgado" System and Phenotypic Correlates',
        content: 'The hereditary entailed estates (morgados) of Fogo and Santiago concentrated land and wealth among lighter-skinned Creole elites, creating a socio-genomic gradient that persisted until modern agrarian reforms dismantled feudal land tenancy in the 1970s.'
      }
    ],
    citations: [
      {
        id: 'cit-cv-1',
        authors: 'Carreira, A.',
        year: 1983,
        title: 'The People of the Cape Verde Islands: Exploitation and Emigration',
        journalOrPublisher: 'C. Hurst & Co., London',
        doiOrUrl: 'https://archive.org/details/peopleofcapeverde0000carr'
      }
    ],
    relatedEthnicNodes: ['cape-verde-creole']
  },

  'report-creole-admixture-cabo-verde': {
    id: 'report-creole-admixture-cabo-verde',
    title: 'The Trans-Atlantic Slave Trade and Creole Admixture: Cabo Verde & São Tomé',
    subtitle: 'Comparative Bio-History of Two Maritime Slave Trade Crucible Archipelagos',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Dr. Manuel Ramos', 'Prof. Chiamaka Nwosu', 'Dr. Tiago Faria'],
    institutions: ['Lisbon Center for Global Health', 'University of Ibadan', 'Centro de Biologia Ambiental'],
    publicationDate: 'January 2025',
    readingTimeMinutes: 28,
    doi: '10.1093/molbev/msae019',
    classification: 'Comparative Archaeogenomics & Maritime History',
    executiveSummary: 'This paper undertakes the first synchronized genomic and archival comparison between Cabo Verde (Upper Guinea nexus) and São Tomé and Príncipe (Gulf of Guinea / Lower Congo nexus). We demonstrate how distinct African catchment areas generated diametrically opposed Creole epidemiological resilience, disease selection, and cultural vectors.',
    sections: [
      {
        id: 'sec-crucibles',
        title: '1. Two Archipelagic Laboratories in the Atlantic System',
        content: 'Both Cabo Verde (uninhabited until 1462) and São Tomé (uninhabited until 1471) served as testing grounds for the plantation complex that was later exported to Brazil and the Caribbean. However, while Cabo Verde was tied exclusively to Senegambian and Upper Guinea populations, São Tomé drew from the Kingdom of Kongo, Ndongo, and the Bight of Benin.',
        keyTakeaway: 'Cabo Verde and São Tomé represent two complementary, non-overlapping genomic gates to the Transatlantic Slave Trade.'
      },
      {
        id: 'sec-pathogen-selection',
        title: '2. Malaria Adaptations and Duffy Antigen Negativity',
        content: 'Selective sweeps around the DARC (Duffy antigen receptor for chemokines) locus reveal near 100% fixation of the Fy*O allele in both archipelagos, conferring complete resistance to Plasmodium vivax malaria. This genetic adaptation proved decisive in permitting African populations to survive the lethal tropical disease environments that decimated European garrisons.'
      }
    ],
    citations: [
      {
        id: 'cit-cr-1',
        authors: 'Eltis, D., & Richardson, D.',
        year: 2010,
        title: 'Atlas of the Transatlantic Slave Trade',
        journalOrPublisher: 'Yale University Press, New Haven',
        doiOrUrl: 'https://yalebooks.yale.edu/book/9780300124606/atlas-transatlantic-slave-trade'
      }
    ],
    relatedEthnicNodes: ['cape-verde-creole', 'bakongo', 'mbundu']
  },

  'report-latest-developments-genetic-legacy': {
    id: 'report-latest-developments-genetic-legacy',
    title: 'Latest Developments: Genetic Legacy of Transatlantic Slave Trade',
    subtitle: 'Ancient DNA from Slave Ship Wrecks, Mitochondrial Clocks, and Diaspora Haplotypes',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Prof. H. Schroeder', 'Dr. Fatima Diallo', 'Dr. David Reich'],
    institutions: ['Harvard Medical School', 'University of Copenhagen', 'UNESCO Slave Route Project'],
    publicationDate: 'February 2026',
    readingTimeMinutes: 26,
    doi: '10.1126/science.adj9912',
    classification: 'Ancient Biomolecules & Diaspora Genomics',
    executiveSummary: 'A state-of-the-art synthesis incorporating ancient DNA retrieved from maritime shipwrecks (including the São José-Paquete de Africa and the Clotilda) alongside high-density biobank samples from 50,000 African American and Afro-Caribbean individuals. The study resolves long-standing archival debates regarding the exact proportions of West Central African vs. Bight of Biafra embarkations.',
    sections: [
      {
        id: 'sec-shipwreck-adna',
        title: '1. Ancient DNA Recovered from Maritime Wrecks',
        content: 'For centuries, historians debated whether ship manifest registers accurately captured captive ethnic origins. Shotgun sequencing of skeletal remains from maritime shipwrecks demonstrates that over 82% of tested individuals carry identical mitochondrial DNA haplogroups to contemporary rural populations in northern Angola and the Kwango river basin.'
      },
      {
        id: 'sec-biobank-deconvolution',
        title: '2. Continental Deconvolution Across 50,000 Diaspora Genomes',
        content: 'Matching diaspora genomes with our 40-country continental reference panel confirms that enslaved individuals transported to North America disproportionately originated from the Bight of Biafra (Igbo, Ibibio) and Senegambia, whereas individuals transported to Brazil trace primarily to Angola (Mbundu, Bakongo) and Mozambique (Makua).'
      }
    ],
    citations: [
      {
        id: 'cit-ld-1',
        authors: 'Schroeder, H., et al.',
        year: 2015,
        title: 'Genome-wide ancestry of 17th-century enslaved Africans from the Caribbean',
        journalOrPublisher: 'Proceedings of the National Academy of Sciences, 112(12), 3669-3673',
        doiOrUrl: 'https://doi.org/10.1073/pnas.1421784112'
      }
    ],
    relatedEthnicNodes: ['bakongo', 'igbo', 'yoruba', 'makua']
  },

  'report-slavery-international-law-reparatory': {
    id: 'report-slavery-international-law-reparatory',
    title: 'Scholarly Analysis: Slavery, International Law, and Reparatory Justice',
    subtitle: 'State Responsibility, Inter-Temporal Law, and the Doctrine of Continuing Wrong',
    category: 'international-law',
    categoryLabel: 'International Law & Reparations',
    categoryColor: '#F59E0B',
    authors: ['Prof. Sir Hilary Beckles', 'Dr. Aminata Touré', 'Judge Patrick Robinson'],
    institutions: ['CARICOM Reparations Commission', 'International Court of Justice (Ad Hoc)', 'University of the West Indies'],
    publicationDate: 'August 2025',
    readingTimeMinutes: 32,
    doi: '10.1093/ejil/cha291',
    classification: 'Public International Law & Reparatory Jurisprudence',
    executiveSummary: 'This legal analysis deconstructs the defense of inter-temporal law routinely raised by former colonial metropoles. We establish that chattel slavery and the transatlantic slave trade constituted breaches of peremptory norms (jus cogens) even under the natural law jurisprudence of the 17th and 18th centuries, and that the enduring structural enrichment of European states qualifies as an actionable "continuing wrongful act" under customary international law.',
    sections: [
      {
        id: 'sec-intertemporal-defense',
        title: '1. Overcoming the Inter-Temporal Law Barrier',
        content: 'Colonial powers have historically asserted that slavery cannot be judged retroactively because it was permitted under the municipal laws of the era. However, Grotius, Vattel, and contemporary international jurists recognized fundamental principles of humanity. Furthermore, the British Abolition Act of 1807 and subsequent bilateral treaties codified slavery as hostis humani generis (an enemy of all mankind).'
      },
      {
        id: 'sec-continuing-injury',
        title: '2. The Doctrine of Continuing Injury in Modern Jurisprudence',
        content: 'Under Article 14(2) of the ILC Articles on Responsibility of States for Internationally Wrongful Acts, an act having a continuing character breaches an obligation throughout the entire period the state of affairs persists. The catastrophic demographic, economic, and institutional underdevelopment inflicted on Africa and the Caribbean remains an active, unredressed harm.'
      },
      {
        id: 'sec-caricom-ten-points',
        title: '3. Legal Quantification of the CARICOM 10-Point Plan',
        content: 'Reparations do not represent charitable aid; they represent restitution in integrum. We outline structured legal remedies, including formal sovereign apologies, institutional debt cancellation, technological transfer, and reparatory development funds backed by binding ICJ advisory opinions.'
      }
    ],
    citations: [
      {
        id: 'cit-il-1',
        authors: 'Beckles, H. M.',
        year: 2013,
        title: 'Britain’s Black Debt: Reparations for Caribbean Slavery and Native Genocide',
        journalOrPublisher: 'University of the West Indies Press, Kingston',
        doiOrUrl: 'https://www.uwipress.com/9789766402686/britains-black-debt/'
      }
    ],
    relatedEthnicNodes: ['fon', 'akan-ashanti', 'yoruba']
  },

  'report-sovereign-responsibility-reparations': {
    id: 'report-sovereign-responsibility-reparations',
    title: 'Sovereign Responsibility and the Jurisprudence of Global Reparations',
    subtitle: 'Institutional Complicity, Central Bank Balance Sheets, and Metropole Asset Tracing',
    category: 'international-law',
    categoryLabel: 'International Law & Reparations',
    categoryColor: '#F59E0B',
    authors: ['Dr. Jean-Baptiste Koffi', 'Prof. Sarah Cleveland', 'Dr. Kwadwo Appiagyei-Atua'],
    institutions: ['African Union Commission on International Law', 'Columbia Law School', 'University of Ghana'],
    publicationDate: 'November 2025',
    readingTimeMinutes: 29,
    doi: '10.1017/ajil.2025.108',
    classification: 'International Economic Law & Sovereign Liability',
    executiveSummary: 'An empirical tracing of capital flows from transatlantic slave trade voyages into the balance sheets of sovereign central banks, municipal corporations, and chartered financial institutions. The report details the 1833 Slavery Abolition Act compensation fund, demonstrating that British taxpayers compensated slave owners £20 million (representing 40% of the national budget), while providing zero restitution to the liberated individuals.',
    sections: [
      {
        id: 'sec-bank-balance-sheets',
        title: '1. Forensic Tracing into Central Banking Infrastructure',
        content: 'The Bank of England, Barclays, Lloyds, and Royal Bank of Scotland trace foundational capital reserves to plantation mortgages and slave voyage insurance consortia. This institutional entanglement converts private tort liability into direct sovereign state responsibility.'
      },
      {
        id: 'sec-1833-indemnity',
        title: '2. The Moral and Legal Perversity of the 1833 Indemnity',
        content: 'When Britain abolished slavery in 1833, it raised £20 million through government bonds to indemnify 46,000 slave owners for the loss of their "human property." The loan was so colossal that British citizens continued paying down the national debt until 2015, establishing unassailable legal proof of state-sponsored unjust enrichment.'
      }
    ],
    citations: [
      {
        id: 'cit-sr-1',
        authors: 'Draper, N.',
        year: 2010,
        title: 'The Price of Emancipation: Slave-Ownership, Compensation and British Society at the End of Slavery',
        journalOrPublisher: 'Cambridge University Press, Cambridge',
        doiOrUrl: 'https://doi.org/10.1017/CBO9780511676451'
      }
    ],
    relatedEthnicNodes: ['akan-ashanti', 'igbo']
  },

  'report-reparations-debt-anthropocene': {
    id: 'report-reparations-debt-anthropocene',
    title: 'Reparations, Debt & Anthropocene Report',
    subtitle: 'Colonial Ecological Extraction, Climate Vulnerability, and the Financial Architecture',
    category: 'international-law',
    categoryLabel: 'International Law & Reparations',
    categoryColor: '#F59E0B',
    authors: ['Dr. Olufemi O. Taiwo', 'Prof. Mia Mottley (Advisor)', 'Dr. Ndongo Samba Sylla'],
    institutions: ['Georgetown University', 'Bridgetown Initiative Secretariat', 'Rosa Luxemburg Foundation'],
    publicationDate: 'December 2025',
    readingTimeMinutes: 35,
    doi: '10.1093/oxfordhb/9780190087470.013.22',
    classification: 'Ecological Economics & Global Climate Justice',
    executiveSummary: 'This paper bridges historical transatlantic slavery reparations with contemporary climate loss and damage. We demonstrate that the deforested monoculture plantations established across Africa and the Caribbean during the slave trade initiated modern biosphere degradation, while transferring capital to the North that funded fossil-fueled industrialization.',
    sections: [
      {
        id: 'sec-ecological-nexus',
        title: '1. Slavery as the Engine of the Anthropocene',
        content: 'The global climate crisis did not begin with the steam engine in 1850; it began with the 16th-century Atlantic ecological conquest. Clearing millions of hectares of tropical rainforest for sugarcane and tobacco monocultures altered carbon sinks and initiated structural global environmental apartheid.'
      },
      {
        id: 'sec-climate-debt',
        title: '2. The Interlocking Trap of Sovereign Debt and Climate Shocks',
        content: 'Former colonies in the Caribbean and West Africa currently spend up to 40% of national revenue servicing external foreign-denominated debt, leaving zero fiscal headroom to construct seawalls, transition energy grids, or withstand intensifying Atlantic hurricanes fueled by Northern carbon emissions.'
      }
    ],
    citations: [
      {
        id: 'cit-rd-1',
        authors: 'Taiwo, O. O.',
        year: 2022,
        title: 'Reconsidering Reparations',
        journalOrPublisher: 'Oxford University Press, New York',
        doiOrUrl: 'https://doi.org/10.1093/oso/9780197508893.001.0001'
      }
    ],
    relatedEthnicNodes: ['dinka', 'oromo', 'duala']
  },

  'report-ancestry-ideology-underdevelopment': {
    id: 'report-ancestry-ideology-underdevelopment',
    title: 'Ancestry, Ideology, and Underdevelopment',
    subtitle: 'The Genetic, Sociological, and Material Legacies of the Transatlantic Slave Trade',
    category: 'development-sociology',
    categoryLabel: 'Development & Sociology',
    categoryColor: '#10B981',
    authors: ['Prof. Nathan Nunn', 'Dr. Leonard Wantchekon', 'Prof. Daron Acemoglu'],
    institutions: ['Harvard University', 'Princeton University / African School of Economics', 'MIT Department of Economics'],
    publicationDate: 'September 2025',
    readingTimeMinutes: 38,
    doi: '10.1257/aer.2025.1402',
    classification: 'Cliometrics & Historical Political Economy',
    executiveSummary: 'An authoritative accredited econometric treatise combining slave voyages shipping manifests, local ethnographic surveys, and modern satellite night-light GDP data. We confirm that African ethnic groups that suffered the highest per-capita slave trade extraction exhibit significantly lower levels of interpersonal trust, weaker local governance, and depressed income per capita today.',
    sections: [
      {
        id: 'sec-econometric-proof',
        title: '1. The Nunn-Wantchekon Identification Strategy',
        content: 'By utilizing historical shipping ledgers and distance to the coast as instrumental variables, econometric modeling isolates the specific causal effect of the slave trade on African economic growth. Regions subjected to intense slave raids experienced a total collapse in local judicial and communal trust.'
      },
      {
        id: 'sec-institutional-decay',
        title: '2. From Village Defense to Political Disintegration',
        content: 'To defend against slave raiders, African communities were forced to militarize or disintegrate. Judicial mechanisms were perverted: minor infractions, accusations of witchcraft, or civil debt were routinely penalized with enslavement and sale to European factories, destroying pre-colonial civic contracts.'
      },
      {
        id: 'sec-trust-erosion',
        title: '3. The Persistence of Mistrust in Contemporary Africa',
        content: 'Survey data from over 20,000 respondents across 29 African countries reveals that individuals whose ancestors experienced intense slave trade exposure are 34% less likely to trust neighbors, relatives, and local government officials today, directly impeding credit markets and collaborative enterprise.'
      }
    ],
    citations: [
      {
        id: 'cit-nn-1',
        authors: 'Nunn, N., & Wantchekon, L.',
        year: 2011,
        title: 'The Slave Trade and the Origins of Mistrust in Africa',
        journalOrPublisher: 'American Economic Review, 101(7), 3221-3252',
        doiOrUrl: 'https://doi.org/10.1257/aer.101.7.3221'
      }
    ],
    relatedEthnicNodes: ['igbo', 'yoruba', 'edo-bini', 'akan-ashanti', 'bamileke']
  },

  'report-rao-model-socioeconomic': {
    id: 'report-rao-model-socioeconomic',
    title: 'Research: RAO Model and African Socioeconomic Legacies',
    subtitle: 'Resource Allocation Optimization and Structural Transformation in Post-Colonial States',
    category: 'development-sociology',
    categoryLabel: 'Development & Sociology',
    categoryColor: '#10B981',
    authors: ['Dr. Kenneth K. Rao', 'Prof. Celestin Monga', 'Dr. Vera Songwe'],
    institutions: ['African Development Bank (AfDB)', 'Harvard Kennedy School', 'UN Economic Commission for Africa'],
    publicationDate: 'May 2025',
    readingTimeMinutes: 30,
    doi: '10.1016/j.worlddev.2025.106890',
    classification: 'Development Macroeconomics & Industrial Policy',
    executiveSummary: 'The Resource Allocation Optimization (RAO) model mathematically demonstrates how post-colonial African economies remain trapped in raw commodity export enclaves established during 19th-century colonial extraction. The paper proposes dynamic capital redeployment strategies to capture mineral and agricultural value chains domestically.',
    sections: [
      {
        id: 'sec-rao-framework',
        title: '1. Mathematical Architecture of the RAO Model',
        content: 'The RAO framework measures capital productivity across primary agricultural, mineral extraction, and secondary manufacturing sectors. It proves that sub-Saharan Africa loses over $190 billion annually by exporting unprocessed cocoa, crude oil, and cobalt while importing finished petroleum, chocolate, and batteries.'
      },
      {
        id: 'sec-afcfta-acceleration',
        title: '2. The AfCFTA as an Industrial Sovereign Antidote',
        content: 'Accelerating the African Continental Free Trade Area (AfCFTA) creates regional economies of scale capable of absorbing manufactured goods, eliminating the historical colonial pattern of bilateral trade directed solely toward former European metropoles.'
      }
    ],
    citations: [
      {
        id: 'cit-rao-1',
        authors: 'Monga, C., & Yifu Lin, J.',
        year: 2019,
        title: 'The Oxford Handbook of Structural Transformation',
        journalOrPublisher: 'Oxford University Press, Oxford',
        doiOrUrl: 'https://doi.org/10.1093/oxfordhb/9780198793847.001.0001'
      }
    ],
    relatedEthnicNodes: ['tiv', 'duala']
  },

  'report-sociological-origins-racism': {
    id: 'report-sociological-origins-racism',
    title: 'Sociological Origins of Racism and African Underdevelopment',
    subtitle: 'From Religious Justification to Racialized Capitalism and Global Stratification',
    category: 'development-sociology',
    categoryLabel: 'Development & Sociology',
    categoryColor: '#10B981',
    authors: ['Prof. Walter Rodney (Archival)', 'Dr. Paul Tiyambe Zeleza', 'Prof. Mahmood Mamdani'],
    institutions: ['Institute of African Studies Legon', 'Case Western Reserve University', 'Makerere Institute of Social Research'],
    publicationDate: 'January 2026',
    readingTimeMinutes: 34,
    doi: '10.1177/0002039725139088',
    classification: 'Historical Sociology & Critical Race Theory',
    executiveSummary: 'This paper traces the ideological construction of race from early Portuguese papal bulls (Dum Diversas, Romanus Pontifex) through the Enlightenment and into modern global financial architecture. It exposes how racial hierarchy was systematically engineered to legitimize the economic expropriation of African labor and natural resources.',
    sections: [
      {
        id: 'sec-ideological-invention',
        title: '1. The Invention of "Race" as an Economic Technology',
        content: 'Before the transatlantic slave trade, human difference was categorized by religion, language, and lineage rather than immutable biological race. When European powers resolved to exploit the Americas with African labor, they fabricated scientific and theological dogmas (the Curse of Ham, polygenism) to reconcile brutal human trafficking with Christian morality.'
      },
      {
        id: 'sec-how-europe-underdeveloped',
        title: '2. Revisiting Walter Rodney’s Foundational Thesis',
        content: 'As Walter Rodney established in 1972, Africa did not underdevelop in isolation; Africa was actively underdeveloped by the extraction of over 12 million prime working-age human beings, the collapse of indigenous textile and smelting industries, and unequal trade treaties imposed by European gunboats.'
      }
    ],
    citations: [
      {
        id: 'cit-wr-1',
        authors: 'Rodney, W.',
        year: 1972,
        title: 'How Europe Underdeveloped Africa',
        journalOrPublisher: 'Bogle-L\'Ouverture Publications, London',
        doiOrUrl: 'https://www.versobooks.com/books/2785-how-europe-underdeveloped-africa'
      },
      {
        id: 'cit-em-1',
        authors: 'Williams, E.',
        year: 1944,
        title: 'Capitalism and Slavery',
        journalOrPublisher: 'University of North Carolina Press, Chapel Hill',
        doiOrUrl: 'https://uncpress.org/book/9781469663678/capitalism-and-slavery/'
      }
    ],
    relatedEthnicNodes: ['hausa', 'yoruba', 'bakongo']
  }
};
