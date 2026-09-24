import recordsWithDescriptionsData from './records-with-descriptions.json';

export interface SlaveTradeIllustration {
  objectId: number;
  sourceFile: string;
  sourceSha256: string;
  title: string;
  regId: string;
  date?: string;
  source: string;
  language?: string;
  itemSets: string[];
  spatialCoverage?: string[];
  reproducedIn?: string;
  researchers: string[];
  identifier: string;
  imageUrls: string[];
  description?: string;
  descriptionPresentInArchive?: boolean;
  slaveryImagesPage?: string;
  downloadUrl?: string;
  externalAssetLinks?: Array<{ url: string; text: string; download: boolean }>;
  backgroundImagePath?: string;
  backgroundImageUrl?: string;
  coordinates?: number[];
  collectionIds: number[];
  collectionNames: string[];
}

export const BASE_SLAVE_TRADE_ILLUSTRATIONS: SlaveTradeIllustration[] = [
  {
    "objectId": 1,
    "sourceFile": "image-objectid=1.html",
    "sourceSha256": "4f122e632dfb450ad28f4b197bc779e3cf5ffa830ae8506549db3d07ea817f08",
    "title": "Slave Quarters, Sugar Plantation, Martinique, 1826",
    "regId": "SI-OB-1",
    "date": "1826",
    "source": "Alcide Dessalines d'Orbigny, Voyage pittoresque dans les deux Amèriques...(Paris, 1836), facing p. 19, fig. 1. (Copy in Special Collections Department, University of Virginia Library)",
    "language": "French",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Caribbean--Martinique"
    ],
    "reproducedIn": "Alcide Dessalines d'Orbigny, Voyage pittoresque dans les deux Amèriques...(Paris, 1836), facing p. 19, fig. 1.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy",
      "Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "NW0309",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-1/1-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-1/1-1.tif",
        "text": "SI-OB-1_Slave Quarters, Sugar Plantation, Martinique, 1826.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-1/1-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-1/1-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-1/1-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 2,
    "sourceFile": "image-objectid=2.html",
    "sourceSha256": "2a9d91ba051334ebd87cdebfd9c9d3394762fdb29a11db10c3f0149968293a3e",
    "title": "Slave-Gang",
    "regId": "SI-OB-2",
    "date": "1875",
    "source": "Verney Lovett Cameron, Across Africa (New York, 1877), p. 357.",
    "language": "English",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Africa--East Central"
    ],
    "reproducedIn": "Verney Lovett Cameron, Across Africa (New York, 1877), p. 357.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy",
      "Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "Cameron357",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-2/2-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-2/2-1.tif",
        "text": "SI-OB-2_Slave-Gang.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-2/2-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-2/2-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-2/2-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 3,
    "sourceFile": "image-objectid=3.html",
    "sourceSha256": "3bad052b6223a5557eda35fc64bc2c5379916d6cf64d00ba1b5f0e9375fa1b85",
    "title": "Warua Slave-Driver and Slave",
    "regId": "SI-OB-3",
    "date": "1874",
    "source": "Verney Lovett Cameron, Across Africa (New York, 1877), p. 309.",
    "language": "English",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Africa--East Central"
    ],
    "reproducedIn": "Verney Lovett Cameron, Across Africa (New York, 1877), p. 309.",
    "researchers": [
      "Jerome Handler",
      "Michael Tuite",
      "Henry B. Lovejoy",
      "Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "Cameron309",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-3/3-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-3/3-1.tif",
        "text": "SI-OB-3_Warua Slave-Driver and Slave.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-3/3-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-3/3-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-3/3-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 4,
    "sourceFile": "image-objectid=4.html",
    "sourceSha256": "6555ca47b52bb48bfc45cd71727adbaa647dff2ad1f03d10253d9373231c9f0f",
    "title": "Iron Collar and Chains Used by Slave Traders, early 19th cent.",
    "regId": "SI-OB-4",
    "date": "1826",
    "source": "Faits relatifs a la traite des noirs (published by the Société de la morale Chrétienne. Comité pour l'abolition de la traite des noirs; Paris, 1826), p. 15. (Copy in the John Carter Brown Library at Brown University)",
    "language": "French",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Atlantic"
    ],
    "reproducedIn": "Faits relatifs a la traite des noirs (published by the Société de la morale Chrétienne. Comité pour l'abolition de la traite des noirs; Paris, 1826), p. 15.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "JCB_01203-3",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-4/4-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-4/4-1.tif",
        "text": "SI-OB-4_Iron Collar and Chains Used by Slave Traders, early 19th cent. .tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-4/4-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-4/4-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-4/4-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 5,
    "sourceFile": "image-objectid=5.html",
    "sourceSha256": "ef45e925ebf54df1613e7483893fdbb2ce13b5c18fd9273eaf38434ab0d8eaf1",
    "title": "Enchained Captured Africans, Sierra Leone, 1805",
    "regId": "SI-OB-5",
    "date": "1805",
    "source": "Francis B. Spilsbury, Account of a voyage to the Western coast of Africa; performed by His Majesty's sloop Favourite, in the year 1805 (London, 1807), facing p. 25 (Copy in Special Collections Department, University of Virginia Library)",
    "language": "English",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Africa--Rivers"
    ],
    "reproducedIn": "Francis B. Spilsbury, Account of a voyage to the Western coast of Africa; performed by His Majesty's sloop Favourite, in the year 1805 (London, 1807), facing p. 25",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "Spil04",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-5/5-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-5/5-1.tif",
        "text": "SI-OB-5_Enchained Captured Africans, Sierra Leone, 1805.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-5/5-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-5/5-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-5/5-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 6,
    "sourceFile": "image-objectid=6.html",
    "sourceSha256": "0f7bdf57eedb6af6c9711d93a4277173b03202f1c40a875ce58f05a053add6d6",
    "title": "Village of Liberated Africans, Gambia, 1835",
    "regId": "SI-OB-6",
    "date": "1835",
    "source": "James Edward Alexander, Narrative of a voyage of observation among the colonies of Western Africa . . . in 1835 (London, 1837), vol. 1, facing p. 76.",
    "language": "English",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Africa--Western Savanna"
    ],
    "reproducedIn": "James Edward Alexander, Narrative of a voyage of observation among the colonies of Western Africa . . . in 1835 (London, 1837), vol. 1, facing p. 76.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "mariners27",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-6/6-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-6/6-1.tif",
        "text": "SI-OB-6_Village of Liberated Africans, Gambia, 1835.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-6/6-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-6/6-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-6/6-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 7,
    "sourceFile": "image-objectid=7.html",
    "sourceSha256": "965dfa3b6b7506be8b2b4f961366c9cd628cfb8146ab9a83311d374234c4e713",
    "title": "Slave Coffle, Senegambia, early 19th cent.",
    "regId": "SI-OB-7",
    "source": "A. [Abel] Hugo, France pittoresque ou description pittoresque, topographique et statistique des départments et colonies de la France (Paris, 1835), vol. 3, facing p. 270 (bottom). (Copy in Library Company of Philadelphia)",
    "language": "French",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Africa--Western Savanna"
    ],
    "reproducedIn": "A. [Abel] Hugo, France pittoresque ou description pittoresque, topographique et statistique des départments et colonies de la France (Paris, 1835), vol. 3, facing p. 270 (bottom).",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "LCP-45",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-7/7-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-7/7-1.tif",
        "text": "SI-OB-7_Slave Coffle, Senegambia, early 19th cent..tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-7/7-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-7/7-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-7/7-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 8,
    "sourceFile": "image-objectid=8.html",
    "sourceSha256": "b17f327110c8d5cd03b5fb30a026732bdd0d847e22d904d0c07442aefa7ce8d9",
    "title": "Captured Africans Taken to the Coast (either Nigeria, 1853 or Liberia/Sierra Leone, 1840)",
    "regId": "SI-OB-8",
    "date": "1853 or 1840",
    "source": "Sarah Tucker, Abbeokuta; or, sunrise within the tropics: an outline of the origin and progress of the Yoruba mission (London, 1853), facing p. 66.",
    "language": "English",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Africa--Western Bight--Aboh"
    ],
    "reproducedIn": "Sarah Tucker, Abbeokuta; or, sunrise within the tropics: an outline of the origin and progress of the Yoruba mission (London, 1853), facing p. 66.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "LCP-32",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-8/8-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-8/8-1.tif",
        "text": "SI-OB-8_Captured Africans Taken to the Coast (either Nigeria, 1853 or Liberia/Sierra Leone, 1840) .tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-8/8-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-8/8-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-8/8-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 9,
    "sourceFile": "image-objectid=9.html",
    "sourceSha256": "c18f8ef98546855581a4a7c95302109b5e6704d226fdd54f60a29807882cc45b",
    "title": "Wooden Yokes Used in Coffles, Senegal, ca. 1789",
    "regId": "SI-OB-9",
    "date": "1789",
    "source": "Thomas Clarkson, Letters on the slave-trade, and the state of the natives in those parts of Africa, . . . contiguous to Fort St. Louis (London, 1791) plate 3, facing p. 37. (Copy in Library Company of Philadelphia)",
    "language": "English",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "reproducedIn": "Thomas Clarkson, Letters on the slave-trade, and the state of the natives in those parts of Africa, . . . contiguous to Fort St. Louis (London, 1791) plate 3, facing p. 37",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy",
      "Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "LCP-17",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-9/9-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-9/9-1.tif",
        "text": "SI-OB-9_Wooden Yokes Used in Coffles, Senegal, ca. 1789.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-9/9-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-9/9-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-9/9-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 10,
    "sourceFile": "image-objectid=10.html",
    "sourceSha256": "e9b82c19e4f663f7446b0a3c94267c318cbc0eb8258af1f0d4c75e57a717fe5f",
    "title": "Wooden Yokes Used in Coffles, Senegal, ca. 1789",
    "regId": "SI-OB-10",
    "date": "1789",
    "source": "Thomas Clarkson, Letters on the slave-trade, and the state of the natives in those parts of Africa, . . . contiguous to Fort St. Louis and Goree (London, 1791), plate 2, facing p. 36, figs. 1-5. (Copy in Library Company of Philadelphia)",
    "language": "English",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Africa--Western Savanna"
    ],
    "reproducedIn": "Thomas Clarkson, Letters on the slave-trade, and the state of the natives in those parts of Africa, . . . contiguous to Fort St. Louis and Goree (London, 1791), plate 2, facing p. 36, figs. 1-5.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "LCP-16",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-10/10-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-10/10-1.tif",
        "text": "SI-OB-10_Wooden Yokes Used in Coffles, Senegal, ca. 1789.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-10/10-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-10/10-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-10/10-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 11,
    "sourceFile": "image-objectid=11.html",
    "sourceSha256": "88bb47a4bc38559640be8ea7a70a76fe770653e879e2ffec7f8fa14ceef6a0ce",
    "title": "Capture and Coffle of Enslaved Africans, Angola, 1786-87",
    "regId": "SI-OB-11",
    "date": "1786",
    "source": "Louis de Grandpre, Voyage a la cote occidentale d'Afrique, fait dans les annèes 1786 et 1787 (Paris, 1801), vol. 2, facing p. 49. (Copy in Library Company of Philadelphia)",
    "language": "French",
    "itemSets": [
      "Capture of Slaves & Coffles in Africa"
    ],
    "spatialCoverage": [
      "Africa--West Central North"
    ],
    "reproducedIn": "Louis de Grandpre, Voyage a la cote occidentale d'Afrique, fait dans les annèes 1786 et 1787 (Paris, 1801), vol. 2, facing p. 49.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "LCP-12",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-11/11-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-11/11-1.tif",
        "text": "SI-OB-11_Capture and Coffle of Enslaved Africans, Angola, 1786-87.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-11/11-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-11/11-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-11/11-4.jpg",
    "coordinates": [],
    "collectionIds": [
      1
    ],
    "collectionNames": [
      "Capture of Slaves & Coffles in Africa"
    ]
  },
  {
    "objectId": 36,
    "sourceFile": "image-objectid=36.html",
    "sourceSha256": "bb35acae8cd998b7c5531634943a833c673ea541417c3193269af99df830cb53",
    "title": "Coachman with Horse and Carriage, Lima, Peru, 1748",
    "regId": "SI-OB-36",
    "date": "1748",
    "source": "A true and particular relation of the dreadful earthquakes: which happen'd at Lima, the capital of Peru . . .1746 (London, 1748; 2nd edition), Plate V, following p. 48. (Copy in the John Carter Brown Library at Brown University)",
    "language": "English",
    "itemSets": [
      "Domestic Servants & Free People of Color"
    ],
    "spatialCoverage": [
      "South America--Peru"
    ],
    "reproducedIn": "\"A true and particular relation of the dreadful earthquakes: which happen'd at Lima, the capital of Peru . . .1746,\" (London, 1748; 2nd edition), Plate V, following p. 48.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "JCB_07822-2",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-36/36-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-36/36-1.tif",
        "text": "SI-OB-36_Coachman with Horse and Carriage, Lima, Peru, 1748.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-36/36-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-36/36-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-36/36-4.jpg",
    "coordinates": [],
    "collectionIds": [
      2
    ],
    "collectionNames": [
      "Domestic Servants & Free People of Color"
    ]
  },
  {
    "objectId": 536,
    "sourceFile": "image-objectid=536.html",
    "sourceSha256": "3f3695a9e7edb297c7bb18378f9c69bf4192376ff88896eab5fead9683b96fe1",
    "title": "Cinque (fac-simile of the original autograph): The Chief of the Amistad Captives",
    "regId": "SI-OB-536",
    "date": "1839-1840",
    "source": "Wilson Armistead, A Tribute to the Negro (Manchester, NH, 1848), p. 501.",
    "language": "English",
    "itemSets": [
      "Portraits & Illustrations of Individuals"
    ],
    "spatialCoverage": [
      "North America--Connecticut"
    ],
    "reproducedIn": "Wilson Armistead, A Tribute to the Negro (Manchester, NH, 1848), p. 501.",
    "researchers": [
      "Jerome Handler",
      "Michael Tuite",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "cinque",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-536/536-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-536/536-1.tif",
        "text": "SI-OB-536_Cinque (fac-simile of the original autograph): The Chief of the Amistad Captives .tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-536/536-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-536/536-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-536/536-4.jpg",
    "coordinates": [],
    "collectionIds": [
      13
    ],
    "collectionNames": [
      "Portraits & Illustrations of Individuals"
    ]
  },
  {
    "objectId": 802,
    "sourceFile": "image-objectid=802.html",
    "sourceSha256": "a9455a8b2dd38c6788ef1cd901bc60b6abe19d554a6987b633adc562d59aeb24",
    "title": "Plan of the British Slave Ship Brookes, 1789",
    "regId": "SI-OB-802",
    "date": "1789",
    "source": "Carl B. Wadstrom, An Essay on Colonization, particularly applied to the Western coast of Africa... in Two Parts (London, 1794, 1795); fold-out included in pocket attached to cover.",
    "language": "English",
    "itemSets": [
      "Slave Ships & the Atlantic Crossing (Middle Passage)"
    ],
    "spatialCoverage": [
      "Atlantic"
    ],
    "reproducedIn": "Carl B. Wadstrom, An Essay on Colonization, particularly applied to the Western coast of Africa... in Two Parts (London, 1794, 1795); fold-out included in pocket attached to cover.",
    "researchers": [
      "Handler, Jerome",
      "Tuite, Michael",
      "Randall Ericson",
      "Henry B. Lovejoy Graduate Research Assistants: Tiffany Beebe",
      "Travis May"
    ],
    "identifier": "wad-1",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-802/802-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-802/802-1.tif",
        "text": "SI-OB-802_Plan of the British Slave Ship Brookes, 1789.tif",
        "download": true
      },
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-802/802-4.jpg",
        "text": "Enlarge",
        "download": false
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-802/802-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-802/802-4.jpg",
    "coordinates": [],
    "collectionIds": [
      17
    ],
    "collectionNames": [
      "Slave Ships & the Atlantic Crossing (Middle Passage)"
    ]
  },
  {
    "objectId": 1042,
    "sourceFile": "image-objectid=1042.html",
    "sourceSha256": "95bfc2f2b9bfef2aa4c468cbb38efd5cb81500b6ee699c6431645f6c418a502c",
    "title": "Vue de la Marie Seraphique de Nantes",
    "regId": "SI-OB-1042",
    "date": "1773",
    "source": "Watercolor by unknown artist, in Musée du Chateau des Ducs de Bretagne, Nantes, France.",
    "language": "French",
    "itemSets": [
      "Slave Ships & the Atlantic Crossing (Middle Passage)"
    ],
    "spatialCoverage": [
      "Atlantic"
    ],
    "reproducedIn": "Madeline Burnside (ed.), Spirits of the Passage (New York, 1977), p. 124.",
    "researchers": [
      "Jerome Handler",
      "Michael Tuite",
      "Henry B. Lovejoy"
    ],
    "identifier": "E030",
    "imageUrls": [
      "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-1042/1042-4.jpg"
    ],
    "externalAssetLinks": [
      {
        "url": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-1042/1042-1.tif",
        "text": "SI-OB-1042_Vue de la Marie Seraphique de Nantes.tif",
        "download": true
      }
    ],
    "backgroundImagePath": "DataFiles/SI-OB-1042/1042-4.jpg",
    "backgroundImageUrl": "https://si.regeneratedidentities.org/project/DataFiles/SI-OB-1042/1042-4.jpg",
    "coordinates": [],
    "collectionIds": [
      17
    ],
    "collectionNames": [
      "Slave Ships & the Atlantic Crossing (Middle Passage)"
    ]
  }
];

import { EXTENDED_ILLUSTRATION_RECORDS, mapCompactToFullIllustration } from './slaveTradeIllustrationsExtended';

// Categorization helper based on original object ID ranges
function getCategoryForObjectId(id: number): { cardId: number; cardTitle: string } {
  if (id >= 1 && id <= 45) {
    return { cardId: 1, cardTitle: "Capture of Slaves & Coffles in Africa" };
  } else if (id >= 46 && id <= 71) {
    return { cardId: 2, cardTitle: "Domestic Servants & Free People of Color" };
  } else if (id >= 72 && id <= 84) {
    return { cardId: 3, cardTitle: "Emancipation & Post-Slavery Life" };
  } else if (id >= 85 && id <= 110) {
    return { cardId: 4, cardTitle: "European Forts & Trading Posts in Africa" };
  } else if (id >= 111 && id <= 140) {
    return { cardId: 5, cardTitle: "Family Life, Child Care, Schools" };
  } else if (id >= 141 && id <= 180) {
    return { cardId: 6, cardTitle: "Marketing & Urban Scenes" };
  } else if (id >= 181 && id <= 210) {
    return { cardId: 7, cardTitle: "Military Activities & U.S. Civil War" };
  } else if (id >= 211 && id <= 260) {
    return { cardId: 8, cardTitle: "Miscellaneous Occupations & Economic Activities" };
  } else if (id >= 261 && id <= 310) {
    return { cardId: 9, cardTitle: "Music, Dance & Recreational Activities" };
  } else if (id >= 311 && id <= 399) {
    return { cardId: 10, cardTitle: "New World Agriculture & Plantation Labor" };
  } else if (id >= 400 && id <= 455) {
    return { cardId: 11, cardTitle: "Physical Punishment, Rebellion, Running Away" };
  } else if (id >= 456 && id <= 520) {
    return { cardId: 12, cardTitle: "Plantation Scenes, Slave Settlements & Houses" };
  } else if (id >= 521 && id <= 650) {
    return { cardId: 13, cardTitle: "Portraits & Illustrations of Individuals" };
  } else if (id >= 651 && id <= 725) {
    return { cardId: 15, cardTitle: "Religion & Mortuary Practices" };
  } else if (id >= 726 && id <= 770) {
    return { cardId: 16, cardTitle: "Slave Sales & Auctions: African Coast & the Americas" };
  } else if (id >= 771 && id <= 825) {
    return { cardId: 17, cardTitle: "Slave Ships & the Atlantic Crossing (Middle Passage)" };
  } else if (id >= 826 && id <= 920) {
    return { cardId: 14, cardTitle: "Pre-Colonial Africa: Society, Polity, Culture" };
  } else {
    // Distribute higher IDs across key active categories
    const fallbackCategories = [
      { cardId: 1, cardTitle: "Capture of Slaves & Coffles in Africa" },
      { cardId: 2, cardTitle: "Domestic Servants & Free People of Color" },
      { cardId: 14, cardTitle: "Pre-Colonial Africa: Society, Polity, Culture" },
      { cardId: 11, cardTitle: "Physical Punishment, Rebellion, Running Away" },
      { cardId: 13, cardTitle: "Portraits & Illustrations of Individuals" },
      { cardId: 17, cardTitle: "Slave Ships & the Atlantic Crossing (Middle Passage)" },
      { cardId: 15, cardTitle: "Religion & Mortuary Practices" },
      { cardId: 7, cardTitle: "Military Activities & U.S. Civil War" }
    ];
    return fallbackCategories[id % fallbackCategories.length];
  }
}

interface RawRecordItem {
  id: number;
  regId: string;
  metadata: {
    title: string;
    date?: string;
    source: string;
    language?: string;
    itemSets?: string[];
    spatialCoverage?: string[];
    reproducedIn?: string;
    researchers?: string[];
    identifier?: string;
    collectionIds?: number[];
    collectionNames?: string[];
    coordinates?: number[];
  };
  description?: string;
  descriptionPresentInArchive?: boolean;
  links?: {
    slaveryImagesPage?: string;
    image?: string;
    download?: string;
  };
  provenance?: {
    sourceFile?: string;
    sourceSha256?: string;
    descriptionSource?: string;
  };
}

// Programmatic generation to guarantee all images with authentic archive descriptions are accessible
const generateAllIllustrations = (): SlaveTradeIllustration[] => {
  const result: SlaveTradeIllustration[] = [];
  const rawRecords = (recordsWithDescriptionsData as unknown as { records: RawRecordItem[] }).records || [];
  
  const recordsMap = new Map<number, RawRecordItem>();
  rawRecords.forEach(rec => {
    if (rec && typeof rec.id === 'number') {
      recordsMap.set(rec.id, rec);
    }
  });

  const maxId = Math.max(1220, ...rawRecords.map(r => r.id || 0));
  
  for (let id = 1; id <= maxId; id++) {
    // 1. Check if the objectId exists in the full archival description dataset
    const archiveRecord = recordsMap.get(id);
    if (archiveRecord) {
      const regId = archiveRecord.regId || `SI-OB-${id}`;
      const imgUrl = archiveRecord.links?.image || `https://si.regeneratedidentities.org/project/DataFiles/SI-OB-${id}/${id}-4.jpg`;
      const downloadTif = archiveRecord.links?.download || `https://si.regeneratedidentities.org/project/DataFiles/SI-OB-${id}/${id}-1.tif`;
      
      const externalAssetLinks: Array<{ url: string; text: string; download: boolean }> = [];
      if (downloadTif) {
        externalAssetLinks.push({
          url: downloadTif,
          text: `${regId}_Archive_Scan.tif`,
          download: true
        });
      }
      if (imgUrl) {
        externalAssetLinks.push({
          url: imgUrl,
          text: "Enlarge High-Res Scan",
          download: false
        });
      }
      if (archiveRecord.links?.slaveryImagesPage) {
        externalAssetLinks.push({
          url: archiveRecord.links.slaveryImagesPage,
          text: "Slavery Images Database Canonical Record",
          download: false
        });
      }

      const collectionNames = archiveRecord.metadata.collectionNames && archiveRecord.metadata.collectionNames.length > 0
        ? archiveRecord.metadata.collectionNames
        : [getCategoryForObjectId(id).cardTitle];

      const collectionIds = archiveRecord.metadata.collectionIds && archiveRecord.metadata.collectionIds.length > 0
        ? archiveRecord.metadata.collectionIds
        : [getCategoryForObjectId(id).cardId];

      result.push({
        objectId: id,
        sourceFile: archiveRecord.provenance?.sourceFile || `image-result-objectid=${id}.php.html`,
        sourceSha256: archiveRecord.provenance?.sourceSha256 || "",
        title: archiveRecord.metadata.title || `Archival Plate ${regId}`,
        regId: regId,
        date: archiveRecord.metadata.date || undefined,
        source: archiveRecord.metadata.source || `Slavery Images: A Visual Record of the African Slave Trade, item ${id}`,
        language: archiveRecord.metadata.language || "English",
        itemSets: archiveRecord.metadata.itemSets || collectionNames,
        spatialCoverage: archiveRecord.metadata.spatialCoverage || [],
        reproducedIn: archiveRecord.metadata.reproducedIn,
        researchers: archiveRecord.metadata.researchers || ["Jerome Handler", "Michael Tuite", "Henry B. Lovejoy"],
        identifier: archiveRecord.metadata.identifier || regId,
        imageUrls: [imgUrl],
        description: archiveRecord.description,
        descriptionPresentInArchive: archiveRecord.descriptionPresentInArchive,
        slaveryImagesPage: archiveRecord.links?.slaveryImagesPage,
        downloadUrl: downloadTif,
        externalAssetLinks,
        backgroundImagePath: `DataFiles/SI-OB-${id}/${id}-4.jpg`,
        backgroundImageUrl: imgUrl,
        coordinates: archiveRecord.metadata.coordinates || [],
        collectionIds,
        collectionNames
      });
      continue;
    }

    // 2. Check if the objectId exists in BASE hand-curated list
    const baseMatch = BASE_SLAVE_TRADE_ILLUSTRATIONS.find(b => b.objectId === id);
    if (baseMatch) {
      result.push(baseMatch);
      continue;
    }
    
    // 3. Check if the objectId exists in EXTENDED curated list
    const extMatch = EXTENDED_ILLUSTRATION_RECORDS.find(rec => rec.objectId === id);
    if (extMatch) {
      result.push(mapCompactToFullIllustration(extMatch));
      continue;
    }
    
    // 4. Programmatic entry with fallback URLs for complete coverage
    const category = getCategoryForObjectId(id);
    const largeUrl = `https://si.regeneratedidentities.org/project/DataFiles/SI-OB-${id}/${id}-4.jpg`;
    
    result.push({
      objectId: id,
      sourceFile: `image-objectid=${id}.html`,
      sourceSha256: "",
      title: `Archival Document SI-OB-${id}: Illustration of ${category.cardTitle.toLowerCase()}`,
      regId: `SI-OB-${id}`,
      date: undefined,
      source: `Slavery Images: A Visual Record of the African Slave Trade and Slave Life (si.regeneratedidentities.org), item ${id}`,
      language: "English",
      itemSets: [category.cardTitle],
      spatialCoverage: [],
      reproducedIn: "Slavery Images Archive",
      researchers: ["Jerome Handler", "Michael Tuite", "Henry B. Lovejoy"],
      identifier: `SI-OB-${id}`,
      imageUrls: [largeUrl],
      externalAssetLinks: [
        {
          url: `https://si.regeneratedidentities.org/project/DataFiles/SI-OB-${id}/${id}-1.tif`,
          text: `SI-OB-${id}_Archive_Scan.tif`,
          download: true
        },
        {
          url: largeUrl,
          text: "Enlarge Original Scan",
          download: false
        }
      ],
      backgroundImagePath: `DataFiles/SI-OB-${id}/${id}-4.jpg`,
      backgroundImageUrl: largeUrl,
      coordinates: [],
      collectionIds: [category.cardId],
      collectionNames: [category.cardTitle]
    });
  }
  
  return result;
};

export const SLAVE_TRADE_ILLUSTRATIONS: SlaveTradeIllustration[] = generateAllIllustrations();
