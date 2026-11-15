import type { AfriataClassification } from '../types/afriataReport';

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
  subtitle: string | null;
  category: ReportCategory;
  categoryLabel: string;
  categoryColor: string; // e.g. '#6366F1' for genetics, '#F59E0B' for law, '#10B981' for development
  authors: string[];
  institutions: string[];
  publicationDate: string;
  readingTimeMinutes: number;
  doi: string;
  classification: string | AfriataClassification;
  executiveSummary: string;
  sections: ReportSection[];
  citations: ReportCitation[];
  relatedEthnicNodes?: string[];
  icon?: string;
  isWorkingPaper?: boolean;
  seriesNumber?: string;
  jelCodes?: string[];
}

export const RESEARCH_REPORTS: Record<string, ResearchReport> = {
  'report-genetic-linguistic-blueprints': {
    id: 'report-genetic-linguistic-blueprints',
    title: 'Genetic and Linguistic Blueprints of the African Atlantic Creole',
    subtitle: 'Reconstructing Upper Guinea Admixture, Substrate Syntax, and Demographic Reconstitution',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'October 2025',
    readingTimeMinutes: 24,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Genomic Anthropology & Historical Linguistics',
    executiveSummary: 'This literature synthesis integrates published whole-genome sequencing findings with comparative philological studies of Afro-Atlantic Creoles (Verdu et al., 2012; Beleza et al., 2013; Quint, 2000). Published evidence indicates that the genetic architecture of Cabo Verde and Gulf of Guinea creole populations preserves molecular signatures of 15th-to-17th century Upper Guinea ethnolinguistic groups (Mandinka, Wolof, Papel, Balanta, and Temne) alongside Romance-lexifier contact grammars.',
    sections: [
      {
        id: 'sec-intro',
        title: '1. The Atlantic Creole as a Molecular and Philological Archive',
        content: 'Creole societies formed across the Atlantic littoral represent distinct bio-historical repositories. Rather than functioning as uniform melting pots, early plantation archipelagos operated as linguistic and genomic bottlenecks where specific West African ethnolinguistic traits were reconstituted under coercive European colonial regimes.',
        keyTakeaway: 'Afro-Atlantic Creoles preserve grammatical structures and genomic segments traceable to 15th-century Senegambian and Upper Guinea populations.'
      },
      {
        id: 'sec-genomic-strata',
        title: '2. Identity-by-Descent (IBD) Deconvolution of West African Strata',
        content: 'Published studies of shared Identity-by-Descent (IBD) segments and uniparental markers report that maternal lineages in Santiago and Fogo trace predominantly to the Senegambian coast between the Senegal and Casamance rivers (Verdu et al., 2012; Beleza et al., 2013). Admixture dating points to an initial founding period (1462–1520) marked by Iberian male founders and West African female captives, establishing enduring matrilineal continuity.',
        pullQuote: 'Chromosomal admixture patterns preserve a demographic ledger complementing surviving written maritime records.'
      },
      {
        id: 'sec-linguistic-substrates',
        title: '3. Morphosyntactic Parallels with Mande and Atlantic Languages',
        content: 'Grammatical scholarship on Crioulo (Quint, 2000) shows that while the lexical inventory is predominantly Romance-derived, phonological constraints, serial verb constructions, and aspectual marker topologies parallel Mandinka and Wolof syntax, reflecting substrate transfer into the contact language.'
      },
      {
        id: 'sec-diaspora-implications',
        title: '4. Diasporic Trajectories to the Americas',
        content: 'Cabo Verdean sailors and enslaved intermediaries subsequently transported elements of this stabilized linguistic and demographic repertoire toward New World embarkation hubs, including Cartagena de Indias, Curaçao (contributing to Papiamento), and the Guianas.'
      }
    ],
    citations: [
      {
        id: 'cit-0',
        authors: 'Verdu, P., Beleza, S., Evora, R., Godinho, N., & Duarte, C.',
        year: 2012,
        title: 'The Admixture Structure and Genetic Variation of the Archipelago of Cape Verde and Its Implications for Admixture Mapping Studies',
        journalOrPublisher: 'PLOS ONE, 7(11), e51103',
        doiOrUrl: 'https://doi.org/10.1371/journal.pone.0051103'
      },
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
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'July 2024',
    readingTimeMinutes: 21,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Population Genomics & Social Demography',
    executiveSummary: 'A curated synthesis of published island-by-island genomic studies across Santiago, Fogo, Santo Antão, São Vicente, and Brava (Beleza et al., 2013; Carreira, 1983). Reviewed findings illustrate how differential 17th-to-19th century plantation economies, drought-driven migrations, and seigneurial land hierarchies shaped divergent genetic admixture profiles across the archipelago.',
    sections: [
      {
        id: 'sec-archipelago-divergence',
        title: '1. Island-by-Island Admixture Stratification',
        content: 'Published studies report pronounced inter-island heterogeneity across Cabo Verde. Santiago, colonized in the 1460s with large enslaved populations, exhibits high West African autosomal ancestry, whereas northern Barlavento islands such as Santo Antão and São Nicolau exhibit higher European autosomal proportions alongside later pastoral settlement patterns.'
      },
      {
        id: 'sec-sex-biased-transmission',
        title: '2. Extreme Sex-Biased Lineage Asymmetry',
        content: 'Beleza et al. (2013) report that mitochondrial DNA (mtDNA) haplogroups in Cabo Verde are overwhelmingly African (predominantly L1b, L2a, and L3b), whereas Y-chromosome lineages are predominantly European. This asymmetric ratio reflects coercive colonial social relations across the transatlantic plantation era.',
        keyTakeaway: 'Published uniparental marker studies document predominantly African maternal mtDNA alongside predominantly European paternal Y-DNA lineages across Cabo Verde.'
      },
      {
        id: 'sec-social-strata',
        title: '3. The "Morgado" System and Historical Stratification',
        content: 'Historical demography (Carreira, 1983) documents how hereditary entailed estates (morgados) on Fogo and Santiago concentrated land and wealth among Creole elites, shaping a socio-economic gradient that persisted until agrarian reforms in the 1970s.'
      }
    ],
    citations: [
      {
        id: 'cit-cv-0',
        authors: 'Beleza, S., Campos, J., Andrade, J., & Alves, R.',
        year: 2013,
        title: 'The demographic history of Cape Verde Islands: genomic diversity and admixture dynamics',
        journalOrPublisher: 'Annals of Human Genetics, 77(6), 468-479',
        doiOrUrl: 'https://doi.org/10.1111/ahg.12038'
      },
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
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'January 2025',
    readingTimeMinutes: 28,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Comparative Archaeogenomics & Maritime History',
    executiveSummary: 'This comparative synthesis examines published genomic and archival literature on Cabo Verde (Upper Guinea nexus) and São Tomé and Príncipe (Gulf of Guinea / Lower Congo nexus), drawing on Micheletti et al. (2020) and Eltis & Richardson (2010). It contrasts how distinct African embarkation catchment areas shaped different epidemiological selection pressures and Creole cultural formations.',
    sections: [
      {
        id: 'sec-crucibles',
        title: '1. Two Archipelagic Laboratories in the Atlantic System',
        content: 'Both Cabo Verde (settled from 1462) and São Tomé (settled from 1471) served as early testing grounds for the Atlantic plantation and entrepôt complex later exported to Brazil and the Caribbean. Whereas Cabo Verde was closely tied to Senegambian and Upper Guinea trade networks, São Tomé drew captives predominantly from the Kingdom of Kongo, Ndongo, and the Bight of Benin (Eltis & Richardson, 2010).',
        keyTakeaway: 'Cabo Verde and São Tomé functioned as distinct maritime corridors connected to Senegambian and West-Central African catchment zones.'
      },
      {
        id: 'sec-pathogen-selection',
        title: '2. Malaria Adaptations and Duffy Antigen Negativity',
        content: 'Population-genetic literature documents high prevalence of the Fy*O allele at the DARC (Duffy antigen receptor for chemokines) locus across West and West-Central African-descended Atlantic populations, conferring resistance to Plasmodium vivax malaria and strongly influencing colonial epidemiological survival.'
      }
    ],
    citations: [
      {
        id: 'cit-cr-0',
        authors: 'Micheletti, S. J., Bryc, K., Esselmann, S. G., & Freyman, W. A.',
        year: 2020,
        title: 'Genetic Consequences of the Transatlantic Slave Trade in the Americas',
        journalOrPublisher: 'American Journal of Human Genetics, 107(2), 265-277',
        doiOrUrl: 'https://doi.org/10.1016/j.ajhg.2020.06.012'
      },
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
    subtitle: 'Ancient DNA from Burial Contexts, Mitochondrial Clocks, and Diaspora Haplotypes',
    category: 'genetics',
    categoryLabel: 'Genetics & Admixture',
    categoryColor: '#6366F1',
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'February 2026',
    readingTimeMinutes: 26,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Ancient Biomolecules & Diaspora Genomics',
    executiveSummary: 'A synthesis of published ancient DNA studies (including Schroeder et al., 2015 on 17th-century enslaved individuals in Saint Martin) alongside biobank-scale diaspora analyses (Micheletti et al., 2020) and maritime wreck archaeology (such as the São José-Paquete de Africa and Clotilda). The literature compares genomic origin profiles against embarkation ledgers across West-Central Africa, Biafra, and Senegambia.',
    sections: [
      {
        id: 'sec-shipwreck-adna',
        title: '1. Ancient DNA & Bioarchaeological Contexts',
        content: 'Whole-genome sequencing of 17th-century enslaved burials in the Caribbean (Schroeder et al., 2015) demonstrated close affinity to contemporary populations in Cameroon and Nigeria, illustrating how ancient biomolecules complement incomplete shipping registers alongside maritime wreck investigations.'
      },
      {
        id: 'sec-biobank-deconvolution',
        title: '2. Continental Deconvolution Across Diaspora Studies',
        content: 'Large-scale genotype comparisons (Micheletti et al., 2020) align broadly with documented embarkation corridors: higher Bight of Biafra and Senegambian ancestry in North America compared with prominent West-Central African (Angola/Congo) ancestry in Brazil and parts of the Caribbean.'
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
      },
      {
        id: 'cit-ld-2',
        authors: 'Micheletti, S. J., et al.',
        year: 2020,
        title: 'Genetic Consequences of the Transatlantic Slave Trade in the Americas',
        journalOrPublisher: 'American Journal of Human Genetics, 107(2), 265-277',
        doiOrUrl: 'https://doi.org/10.1016/j.ajhg.2020.06.012'
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
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'August 2025',
    readingTimeMinutes: 32,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Public International Law & Reparatory Jurisprudence',
    executiveSummary: 'This legal literature synthesis examines arguments addressing the inter-temporal law defense in reparatory justice scholarship (Beckles, 2013; Robinson, 2023 Brattle Report). It outlines scholarly claims regarding natural law norms, the ILC Articles on State Responsibility (Article 14(2) on continuing wrongful acts), and the CARICOM 10-Point Plan for Reparatory Justice.',
    sections: [
      {
        id: 'sec-intertemporal-defense',
        title: '1. Debates Around the Inter-Temporal Law Barrier',
        content: 'European metropoles have traditionally invoked inter-temporal law, arguing that actions must be judged by the municipal law of their time. Legal historians and jurists (Beckles, 2013) counter by examining natural law traditions, pre-colonial West African legal prohibitions, and 19th-century bilateral abolition treaties framing the slave trade as hostis humani generis.'
      },
      {
        id: 'sec-continuing-injury',
        title: '2. The Doctrine of Continuing Injury in Modern Jurisprudence',
        content: 'Under Article 14(2) of the ILC Articles on Responsibility of States for Internationally Wrongful Acts, an act of a continuing character extends across the period the condition persists. Contemporary legal scholarship debates how structural economic legacies and unredressed harms interact with modern state responsibility frameworks.'
      },
      {
        id: 'sec-caricom-ten-points',
        title: '3. Structure of the CARICOM 10-Point Plan',
        content: 'Proponents distinguish reparatory frameworks from discretionary aid, framing them around restitution, formal state apologies, debt relief, public health and educational investment, cultural heritage restitution, and targeted technology transfer.'
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
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'November 2025',
    readingTimeMinutes: 29,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · International Economic Law & Sovereign Liability',
    executiveSummary: 'A synthesis of historical economic research (Draper, 2010; Legacies of British Slavery archive) tracing capital flows from Atlantic slavery into European financial institutions and sovereign debt instruments. It examines the £20 million compensation fund authorized under the British Slavery Abolition Act of 1833 and its long-dated government bond repayment.',
    sections: [
      {
        id: 'sec-bank-balance-sheets',
        title: '1. Archival Tracing into Banking Infrastructure',
        content: 'Archival audits—such as UCL’s Legacies of British Slavery database and published financial histories—document links between merchant banks, maritime insurance syndicates, and plantation mortgages, informing contemporary institutional disclosures and restitution debates.'
      },
      {
        id: 'sec-1833-indemnity',
        title: '2. Structure of the 1833 Compensation Loan',
        content: 'When Britain enacted emancipation in 1833, it borrowed £20 million (about 40% of annual public expenditure at the time) to compensate roughly 46,000 slave-owning claimants, while emancipated individuals received no monetary compensation and served multi-year "apprenticeship" terms (Draper, 2010). The associated gilt obligations were only retired in 2015.'
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
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'December 2025',
    readingTimeMinutes: 35,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Ecological Economics & Global Climate Justice',
    executiveSummary: 'A literature synthesis linking historical reparations theory with climate vulnerability and sovereign debt reform debates (Táíwò, 2022). It summarizes scholarship connecting plantation-era land-use change and unequal capital accumulation to contemporary climate adaptation financing gaps across Africa and the Caribbean.',
    sections: [
      {
        id: 'sec-ecological-nexus',
        title: '1. Plantation Ecology and the Anthropocene Debate',
        content: 'Environmental historians and philosophers (Táíwò, 2022) trace how early modern Atlantic sugar and tobacco monocultures restructured tropical ecosystems while channeling resource surpluses into industrializing Northern economies.'
      },
      {
        id: 'sec-climate-debt',
        title: '2. Sovereign Debt Service and Climate Adaptation Constraints',
        content: 'Policy proposals associated with the Bridgetown Initiative highlight how high external debt service costs across climate-vulnerable African and Caribbean states constrain domestic fiscal space for resilient energy grids, coastal defense, and post-disaster recovery.'
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
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'September 2025',
    readingTimeMinutes: 38,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Cliometrics & Historical Political Economy',
    executiveSummary: 'A curated synthesis of empirical cliometric literature—centrally Nunn (2008) and Nunn & Wantchekon (2011)—combining slave voyage records, ethnographic baselines, and Afrobarometer survey data. Reviewed econometric studies find that regions experiencing higher per-capita slave exports exhibit persistently lower measured interpersonal trust and weaker economic performance today.',
    sections: [
      {
        id: 'sec-econometric-proof',
        title: '1. The Nunn-Wantchekon Identification Strategy',
        content: 'Using historical shipping records and distance from interior homelands to coastal ports as instruments, Nunn (2008) and Nunn & Wantchekon (2011) isolate long-run correlations between historical captive extraction intensity and contemporary institutional and economic outcomes.'
      },
      {
        id: 'sec-institutional-decay',
        title: '2. Communal Insecurity and Judicial Distortion',
        content: 'Historical evidence indicates that slave-raiding incentives distorted local judicial and dispute-resolution norms, as raids, kidnapping, and judicial penalties fed captive supply chains, fragmenting pre-colonial civic accountability.'
      },
      {
        id: 'sec-trust-erosion',
        title: '3. Persistence of Mistrust in Survey Data',
        content: 'Nunn & Wantchekon (2011) analyze Afrobarometer survey responses across Sub-Saharan Africa, finding statistically robust negative associations between ancestral slave-trade exposure and contemporary trust in neighbors, relatives, and local institutions.'
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
      },
      {
        id: 'cit-nn-2',
        authors: 'Nunn, N.',
        year: 2008,
        title: 'The Long-Term Effects of Africa’s Slave Trades',
        journalOrPublisher: 'Quarterly Journal of Economics, 123(1), 139-176',
        doiOrUrl: 'https://doi.org/10.1162/qjec.2008.123.1.139'
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
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'May 2025',
    readingTimeMinutes: 30,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Development Macroeconomics & Industrial Policy',
    executiveSummary: 'A synthesis of structural transformation literature (Monga & Yifu Lin, 2019; UNECA/AfDB industrial reports) paired with conceptual resource allocation optimization (RAO) framing. It reviews why post-colonial African economies remain concentrated in primary commodity exports and outlines regional value-addition strategies under AfCFTA.',
    sections: [
      {
        id: 'sec-rao-framework',
        title: '1. Conceptual Architecture of Resource Allocation Optimization',
        content: 'Drawing on structural transformation economics (Monga & Yifu Lin, 2019), this framework compares factor returns across primary agriculture, extractive mining, and domestic manufacturing, highlighting the value-addition gap created when unprocessed cocoa, crude petroleum, and battery minerals are exported prior to refining.'
      },
      {
        id: 'sec-afcfta-acceleration',
        title: '2. AfCFTA Scale and Continental Value Chains',
        content: 'Integrating regional markets under the African Continental Free Trade Area (AfCFTA) expands contiguous demand scale for intermediate and manufactured goods, countering colonial-era bilateral infrastructure oriented exclusively toward coastal export ports.'
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
    authors: ['Afriata Research Synthesis (ZéLuis F. Correia)'],
    institutions: ['Afriata Cartographic & Econometric Observatory'],
    publicationDate: 'January 2026',
    readingTimeMinutes: 34,
    doi: '10.6084/m9.figshare.34065711',
    classification: 'Literature Synthesis · Historical Sociology & Political Economy',
    executiveSummary: 'A historical-sociological synthesis engaging foundational works by Eric Williams (1944) and Walter Rodney (1972). It traces how early modern legal, theological, and pseudo-scientific racial hierarchies evolved alongside Atlantic plantation labor systems to justify unequal global division of labor.',
    sections: [
      {
        id: 'sec-ideological-invention',
        title: '1. Racial Stratification as an Economic Ideology',
        content: 'Following Eric Williams (1944) and subsequent historical sociology, modern biological racial categories consolidated alongside plantation slavery—shifting earlier religious and civic distinctions into rigid hereditary hierarchies engineered to normalize coerced African labor.'
      },
      {
        id: 'sec-how-europe-underdeveloped',
        title: '2. Revisiting Walter Rodney’s Foundational Thesis',
        content: 'Walter Rodney (1972) argued that African underdevelopment must be analyzed relationally: external extraction of working-age demographics, disruption of domestic craft and metallurgy sectors, and asymmetric colonial trade terms reinforced global divergence.'
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
