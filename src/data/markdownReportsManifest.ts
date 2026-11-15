import type { AfriataReport } from '../types/afriataReport';

export interface MarkdownManifestEntry {
  sourceKey: string;
  keyFindings: string[];
  report: AfriataReport;
}

export const MARKDOWN_REPORTS_MANIFEST: MarkdownManifestEntry[] = [
  {
    "sourceKey": "../content/reports/bantu-expansion-genomics.md",
    "keyFindings": [
      "1. Demographic Radiations Along the Congo River Basin: Ancient DNA studies document distinct westward and southward migratory pulses occurring across roughly 2500 BCE and 1000 BCE.",
      "2. Admixture Dynamics with Indigenous Forager Populations: Admixture with indigenous forager groups contributed adaptive immune-system alleles (HLA variations) beneficial across diverse ecological micro-niches.",
      "3. Methodological Convergence: Molecular Clocks and Glottochronology — Combining Bayesian phylolinguistic trees of Niger-Congo languages with coalescence-time estimates from whole-genome sequences yields close temporal alignment. The timing of linguistic divergence between Western and Eastern Bantu sub-branches (circa 1500 BCE) a..."
    ],
    "report": {
      "schema": {
        "name": "AfriataReport",
        "version": "1.0.0"
      },
      "id": "rep-bantu-expansion-genomics",
      "title": "Molecular Genetics of the Bantu Expansion & Sub-Saharan Admixture",
      "subtitle": "High-density autosomal SNP analysis reconstructing demographic expansion from the Benue-Cross River Basin",
      "date": "2026-03-15",
      "version": "1",
      "status": "published",
      "institution": {
        "name": "Afriata Research Synthesis (ZéLuis F. Correia)",
        "type": "Literature Synthesis",
        "role": "Observatory Synthesis",
        "platform": "Afriata Research Platform"
      },
      "publication": {
        "series": "Afriata Literature Synthesis Series",
        "type": "research_article",
        "edition": "Curated Literature Synthesis",
        "language": "en",
        "citation_style": "chicago-author-date"
      },
      "authors": [
        "Afriata Research Synthesis (ZéLuis F. Correia)"
      ],
      "author_details": [
        {
          "name": "Afriata Research Synthesis (ZéLuis F. Correia)",
          "role": "author",
          "institution": "Afriata Research Platform"
        }
      ],
      "classification": {
        "section": "reports",
        "pillar": "genetics",
        "disciplines": [
          "Population Genetics",
          "Paleogenomics",
          "Bioarchaeology",
          "Human Evolutionary Biology"
        ],
        "confidence": {
          "pillar": 0.98,
          "section": 0.98
        }
      },
      "keywords": [
        "Genetics & Admixture",
        "Western Africa",
        "Central Africa",
        "Population Genetics",
        "Paleogenomics",
        "Bioarchaeology"
      ],
      "subjects": [
        "Molecular Genetics of the Bantu Expansion & Sub-Saharan Admixture",
        "Genetics & Admixture Analysis"
      ],
      "tags": [
        "Bantu Expansion",
        "Archaeogenomics",
        "Ancient DNA",
        "Population Genetics",
        "Niger-Congo"
      ],
      "geography": {
        "regions": [
          "Western Africa",
          "Central Africa",
          "Southern Africa",
          "Americas"
        ],
        "countries": [
          "NGA",
          "CMR",
          "COD",
          "COG"
        ],
        "historical_regions": []
      },
      "identifiers": {
        "doi": "10.6084/m9.figshare.34065711",
        "isbn": null,
        "external_url": null,
        "source_url": null
      },
      "research": {
        "methodology": [
          "Synthesis of published autosomal SNP genotyping, ancient DNA coalescence modeling, and Bayesian glottochronology"
        ],
        "disciplines": [
          "Population Genetics",
          "Paleogenomics",
          "Bioarchaeology",
          "Human Evolutionary Biology"
        ],
        "temporal_scope": "Historical to Contemporary",
        "geographic_scope": "Western Africa, Central Africa, Southern Africa, Americas"
      },
      "reading": {
        "read_time_minutes": 18,
        "word_count": 352,
        "section_count": 3
      },
      "display": {
        "featured": true,
        "cover_image": null,
        "accent": "#6366F1",
        "layout": "article"
      },
      "ai_assistance": {
        "enabled": true,
        "system": "Afriata Ingestion Engine",
        "role": [
          "source_organization",
          "metadata_extraction",
          "classification",
          "semantic_citation_tagging"
        ],
        "disclosure": "Scholarly synthesis and computational cross-referencing against primary archives.",
        "accountability": "Afriata"
      },
      "provenance": {
        "source_file": "reports/bantu-expansion-genomics.md",
        "source_hash": "sha256:031d2633addc79031d2633addc79",
        "ingestion": "automatic",
        "metadata": "hybrid",
        "classification": "manual",
        "processed_at": "2026-11-15T12:13:41.622Z",
        "pipeline_version": "afriata-ingest-1.0.0"
      },
      "confidence": {
        "title": 1,
        "classification": 0.98,
        "disciplines": 0.92,
        "keywords": 0.95,
        "geography": 0.95,
        "publication_type": 0.95
      },
      "validation": {
        "valid": true,
        "warnings": [],
        "errors": [],
        "reviewed": false
      },
      "executiveSummary": "The expansion of Bantu-speaking agriculturalists across Sub-Saharan Africa constitutes one of the most significant demographic events in human evolutionary history. Synthesizing published ancient DNA findings alongside modern genomic datasets across contemporary populations, this brief summarizes genetic continuity spanning 4,000 years, tracing ancestral agriculturalist groups to the Grassfields region of Cameroon and the Benue-Cross River Basin of modern Nigeria [REF:cit-patin-2017|Patin et al., 2017].",
      "sections": [],
      "citations": [],
      "category": "genetics",
      "categoryLabel": "Genetics & Admixture",
      "categoryColor": "#6366F1",
      "publicationDate": "2026-03-15",
      "readingTimeMinutes": 18,
      "doi": "10.6084/m9.figshare.34065711",
      "institutions": [
        "Afriata Cartographic & Econometric Observatory"
      ],
      "relatedEthnicNodes": [],
      "icon": "lucide:dna",
      "isWorkingPaper": false,
      "seriesNumber": "Synthesis No. 04",
      "jelCodes": [
        "J15",
        "N37",
        "I15",
        "Z13"
      ]
    }
  },
  {
    "sourceKey": "../content/reports/trans-saharan-jurisprudence.md",
    "keyFindings": [
      "1. The Legal Architecture of Caravan Covenants (*Aman*): Pre-colonial Sahelian jurisprudence established documented frameworks for extraterritoriality, contract enforcement, and commercial arbitration across sovereign jurisdictions.",
      "2. Invalidation of Unlawful Captivity in Timbuktu Responsa: Sahelian legal scholars articulated evidentiary standards to challenge unlawful captures, establishing written legal mechanisms for petitioning emancipation.",
      "3. Commercial Arbitration and Cross-Saharan Credit Instruments — Credit instruments (suftaja) and debt-clearing mechanisms enabled long-distance trans-Saharan transactions without continuous physical transport of bullion. These instruments were supported by judicial tribunals located in major trading hubs, forming an interc..."
    ],
    "report": {
      "schema": {
        "name": "AfriataReport",
        "version": "1.0.0"
      },
      "id": "rep-trans-saharan-jurisprudence",
      "title": "Trans-Saharan Jurisprudence & Treaties of Timbuktu",
      "subtitle": "Historical analysis of pre-colonial commercial covenants, asylum charters, and Islamic contract law",
      "date": "2026-02-18",
      "version": "1",
      "status": "published",
      "institution": {
        "name": "Afriata Research Synthesis (ZéLuis F. Correia)",
        "type": "Literature Synthesis",
        "role": "Observatory Synthesis",
        "platform": "Afriata Research Platform"
      },
      "publication": {
        "series": "Afriata Literature Synthesis Series",
        "type": "research_article",
        "edition": "Curated Literature Synthesis",
        "language": "en",
        "citation_style": "chicago-author-date"
      },
      "authors": [
        "Afriata Research Synthesis (ZéLuis F. Correia)"
      ],
      "author_details": [
        {
          "name": "Afriata Research Synthesis (ZéLuis F. Correia)",
          "role": "author",
          "institution": "Afriata Research Platform"
        }
      ],
      "classification": {
        "section": "reports",
        "pillar": "law",
        "disciplines": [
          "International Law",
          "Postcolonial Jurisprudence",
          "Legal History",
          "Sahelian Studies"
        ],
        "confidence": {
          "pillar": 0.98,
          "section": 0.98
        }
      },
      "keywords": [
        "International Law & Sovereignty",
        "Western Africa",
        "Northern Africa",
        "International Law",
        "Postcolonial Jurisprudence",
        "Legal History"
      ],
      "subjects": [
        "Trans-Saharan Jurisprudence & Treaties of Timbuktu",
        "International Law & Sovereignty Analysis"
      ],
      "tags": [
        "Timbuktu",
        "Aman Charters",
        "Commercial Arbitration",
        "Ahmad Baba",
        "Islamic Jurisprudence"
      ],
      "geography": {
        "regions": [
          "Western Africa",
          "Northern Africa"
        ],
        "countries": [
          "MLI",
          "NER",
          "MRT",
          "SDN"
        ],
        "historical_regions": []
      },
      "identifiers": {
        "doi": "10.6084/m9.figshare.34065711",
        "isbn": null,
        "external_url": null,
        "source_url": null
      },
      "research": {
        "methodology": [
          "Synthesis of published manuscript philology, juridical concordance, and institutional contract scholarship"
        ],
        "disciplines": [
          "International Law",
          "Postcolonial Jurisprudence",
          "Legal History",
          "Sahelian Studies"
        ],
        "temporal_scope": "Historical to Contemporary",
        "geographic_scope": "Western Africa, Northern Africa"
      },
      "reading": {
        "read_time_minutes": 22,
        "word_count": 352,
        "section_count": 3
      },
      "display": {
        "featured": true,
        "cover_image": null,
        "accent": "#F59E0B",
        "layout": "article"
      },
      "ai_assistance": {
        "enabled": true,
        "system": "Afriata Ingestion Engine",
        "role": [
          "source_organization",
          "metadata_extraction",
          "classification",
          "semantic_citation_tagging"
        ],
        "disclosure": "Scholarly synthesis and computational cross-referencing against primary archives.",
        "accountability": "Afriata"
      },
      "provenance": {
        "source_file": "reports/trans-saharan-jurisprudence.md",
        "source_hash": "sha256:107b259f0d58b4107b259f0d58b4",
        "ingestion": "automatic",
        "metadata": "hybrid",
        "classification": "manual",
        "processed_at": "2026-11-15T12:13:41.624Z",
        "pipeline_version": "afriata-ingest-1.0.0"
      },
      "confidence": {
        "title": 1,
        "classification": 0.98,
        "disciplines": 0.92,
        "keywords": 0.95,
        "geography": 0.95,
        "publication_type": 0.95
      },
      "validation": {
        "valid": true,
        "warnings": [],
        "errors": [],
        "reviewed": false
      },
      "executiveSummary": "Centuries prior to the Westphalian formulation of sovereign borders and treaty mechanisms, trans-Saharan commercial corridors operated under structured juridical architectures. Synthesizing historical scholarship on manuscripts preserved in the Ahmed Baba Institute in Timbuktu and family libraries across Chinguetti and Gao (Hunwick & Boye, 2008; Hall, 2011), this overview examines the legal conventions governing trade caravans, safe-passage guarantees (*aman*), commercial arbitration, and the legal status of captives.",
      "sections": [],
      "citations": [],
      "category": "international-law",
      "categoryLabel": "International Law & Sovereignty",
      "categoryColor": "#F59E0B",
      "publicationDate": "2026-02-18",
      "readingTimeMinutes": 22,
      "doi": "10.6084/m9.figshare.34065711",
      "institutions": [
        "Afriata Cartographic & Econometric Observatory"
      ],
      "relatedEthnicNodes": [],
      "icon": "ph:scales-bold",
      "isWorkingPaper": false,
      "seriesNumber": "Synthesis No. 05",
      "jelCodes": [
        "K33",
        "N47",
        "F53",
        "P48"
      ]
    }
  },
  {
    "sourceKey": "../content/working-papers/economics-europe-atlantic.md",
    "keyFindings": [
      "1. Revision summary — Changes introduced in v2 (methodological review):",
      "0. Normative and Legal Scope: A finding that net economic gains to Europe were small would not weaken the wrongfulness of slavery or any reparative claim grounded in it. A finding that they were large would not by itself establish legal liability. The report states this wherever results are summarized.",
      "1. Research Questions — The first draft posed one question. It is split here into six, because they require different data, estimands and identification strategies.",
      "2. Conceptual Framework: Pathway A can be measured as *gross* activity (value added in the slave system) or as *net surplus* (value added minus what the same factors would have earned elsewhere). Only net surplus is a causal contribution. Gross value added measures scale.",
      "3. Estimands and Definitions — 3.1 Gross value added (descriptive)",
      "4. Counterfactual Design — 4.1 Specifying the replacement world"
    ],
    "report": {
      "schema": {
        "name": "AfriataReport",
        "version": "1.0.0"
      },
      "id": "wkp-economics-europe-atlantic-2026",
      "title": "Atlantic Slavery, European Development, and Colonial Extraction",
      "subtitle": "A Quantitative Historical-Economics Research Proposal (Consolidated Version 3)",
      "date": "2026-10-04",
      "version": "1",
      "status": "published",
      "institution": {
        "name": "Afriata",
        "type": "Interdisciplinary Research & Knowledge Initiative",
        "role": "Institutional / Project Author",
        "platform": "Afriata Research Platform"
      },
      "publication": {
        "series": "Afriata Working Paper & Policy Brief Series",
        "type": "working_paper",
        "edition": "Research Edition",
        "language": "en",
        "citation_style": "chicago-author-date"
      },
      "authors": [
        "Afriata"
      ],
      "author_details": [
        {
          "name": "Afriata",
          "role": "Institutional / Project Author",
          "institution": "Afriata Research Platform"
        }
      ],
      "classification": {
        "section": "working-papers",
        "pillar": "development",
        "disciplines": [
          "African History",
          "Atlantic History",
          "Atlantic Economy",
          "International Law",
          "Postcolonial Studies"
        ],
        "confidence": {
          "pillar": 0.98,
          "section": 0.98
        }
      },
      "keywords": [
        "Development & Historical Economics",
        "Africa",
        "Americas",
        "African History",
        "Atlantic History",
        "Atlantic Economy"
      ],
      "subjects": [
        "Atlantic Slavery, European Development, and Colonial Extraction",
        "Development & Historical Economics Analysis"
      ],
      "tags": [
        "Economic Development",
        "Transatlantic Slave Trade",
        "Shapley Decomposition",
        "Counterfactuals"
      ],
      "geography": {
        "regions": [
          "Africa",
          "Americas",
          "Caribbean",
          "Europe",
          "Global"
        ],
        "countries": [
          "GHA",
          "HTI",
          "GBR",
          "FRA",
          "BRA",
          "USA"
        ],
        "historical_regions": []
      },
      "identifiers": {
        "doi": "10.6084/m9.figshare.34063314",
        "isbn": null,
        "external_url": null,
        "source_url": null
      },
      "research": {
        "methodology": [
          "Interdisciplinary historical, economic, and spatial analysis"
        ],
        "disciplines": [
          "African History",
          "Atlantic History",
          "Atlantic Economy",
          "International Law",
          "Postcolonial Studies"
        ],
        "temporal_scope": "Historical to Contemporary",
        "geographic_scope": "Africa, Americas, Caribbean, Europe, Global"
      },
      "reading": {
        "read_time_minutes": 22,
        "word_count": 5977,
        "section_count": 25
      },
      "display": {
        "featured": true,
        "cover_image": null,
        "accent": "#10B981",
        "layout": "article"
      },
      "ai_assistance": {
        "enabled": true,
        "system": "Anthropic",
        "role": [
          "Research discovery",
          "Source synthesis",
          "Information organization",
          "Editorial assistance"
        ],
        "disclosure": "AI-assisted",
        "accountability": "Afriata"
      },
      "provenance": {
        "source_file": "working-papers/economics-europe-atlantic.md",
        "source_hash": "sha256:0f163b6c6181f70f163b6c6181f7",
        "ingestion": "automatic",
        "metadata": "hybrid",
        "classification": "manual",
        "processed_at": "2026-11-15T12:13:41.639Z",
        "pipeline_version": "afriata-ingest-1.0.0"
      },
      "confidence": {
        "title": 1,
        "classification": 0.98,
        "disciplines": 0.92,
        "keywords": 0.95,
        "geography": 0.95,
        "publication_type": 0.95
      },
      "validation": {
        "valid": true,
        "warnings": [],
        "errors": [],
        "reviewed": false
      },
      "executiveSummary": "The proposal develops a quantitative program to test a strong historical proposition: that the Atlantic slave system was a major causal contributor to the economic divergence between participating European economies and other regions, and that colonial extraction later reinforced it. It separates five mechanisms that are often conflated: the transatlantic slave trade, plantation production based on enslaved labour, the European value chains built on plantation commodities, broader Atlantic trade and institutional change, and later colonial extraction.\n\nThe central empirical object is a set of explicitly specified counterfactual economies. For each, the proposal defines what is removed, what replaces it, and how freed resources are reallocated. Estimates combine historical voyage and trade records, European city and national data, wealth-holder and documented-transfer records, and non-European comparator series, including Caribbean and African economies, with tiered causal identification and a multi-region structural model. The contribution of each mechanism is reported with uncertainty, and the term \"main driver\" is defined in advance by pre-registered criteria.\n\nThe proposal does not assume that slavery was the largest cause of European development, and it does not address whether reparations are owed; it produces evidence that may inform that debate under stated limits. All numerical examples are hypothetical.",
      "sections": [],
      "citations": [],
      "category": "development-sociology",
      "categoryLabel": "Development & Historical Economics",
      "categoryColor": "#10B981",
      "publicationDate": "2026-10-04",
      "readingTimeMinutes": 22,
      "doi": "10.6084/m9.figshare.34063314",
      "institutions": [
        "Afriata Research Platform"
      ],
      "relatedEthnicNodes": [],
      "icon": "ph:scales-bold",
      "isWorkingPaper": true,
      "seriesNumber": "Afriata Working Paper No. 08",
      "jelCodes": [
        "N17",
        "O10",
        "N37",
        "F54"
      ]
    }
  }
];
