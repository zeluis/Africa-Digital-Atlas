import { SupportedLanguage } from '../i18n/types';

export interface OnboardingScreenTranslation {
  stageBadge: string;
  header: string;
  body: string;
  regionFocus: string;
}

export const ONBOARDING_TRANSLATIONS: Record<SupportedLanguage, Record<number, OnboardingScreenTranslation>> = {
  // 1. English
  en: {
    1: {
      stageBadge: 'Screen 1: The Foundation (History & Heritage)',
      header: 'Discover the Diaspora',
      body: 'Welcome to Africalia, a curated gateway honoring the Atlantic Ethnic Explorer. Immerse yourself in the profound histories, resilience, and interconnected heritages that bridge Europe, Africa, and the Americas.',
      regionFocus: 'Eastern & Northern Africa Tonal Axis'
    },
    2: {
      stageBadge: 'Screen 2: The Evolution (Socioeconomic Reality)',
      header: 'Shaping Development',
      body: 'Engage deeply with the complex socioeconomic forces, structural realities, and local innovations defining the continent today. Move beyond single narratives to understand Africa’s true economic landscape.',
      regionFocus: 'Western & Southern Africa Tonal Axis'
    },
    3: {
      stageBadge: 'Screen 3: The Horizon (The Future)',
      header: 'A Dynamic Tomorrow',
      body: 'Discover a forward-looking, rising Africa driven by vibrant youth demographics, tech-driven markets, and a sustainable future. Join us as we explore the continent\'s next chapter.',
      regionFocus: 'Central Africa & Pan-African Innovation Axis'
    },
    4: {
      stageBadge: 'Screen 4: Academic Integrity & Dual Space Entry',
      header: 'Historical Context & Content Continuity',
      body: 'Africalia operates under rigorous scholarly and socio-educational protocols. Review the ethical research framework and data provenance below, then choose your curated entry destination.',
      regionFocus: 'Scholarly Integrity & Transatlantic Synthesis'
    }
  },

  // 2. French (Français)
  fr: {
    1: {
      stageBadge: 'Étape 1 : Les Fondations (Histoire & Patrimoine)',
      header: 'Découvrez la Diaspora',
      body: 'Bienvenue sur Africalia, un portail d\'exception dédié à l\'Explorateur Ethnique Atlantique. Plongez au cœur des histoires profondes, de la résilience et des héritages interconnectés unissant l\'Europe, l\'Afrique et les Amériques.',
      regionFocus: 'Axe Tonal Afrique de l\'Est & du Nord'
    },
    2: {
      stageBadge: 'Étape 2 : L\'Évolution (Réalités Socio-Économiques)',
      header: 'Façonner le Développement',
      body: 'Analysez en profondeur les dynamiques socio-économiques complexes, les réalités structurelles et les innovations locales qui transforment le continent aujourd\'hui.',
      regionFocus: 'Axe Tonal Afrique de l\'Ouest & Australe'
    },
    3: {
      stageBadge: 'Étape 3 : L\'Horizon (L\'Avenir)',
      header: 'Un Demain Dynamique',
      body: 'Découvrez une Afrique tournée vers l\'avenir, portée par une jeunesse vibrante, l\'essor des technologies et un développement durable prometteur.',
      regionFocus: 'Axe Afrique Centrale & Innovation Panafricaine'
    },
    4: {
      stageBadge: 'Étape 4 : Rigueur Académique & Double Accès',
      header: 'Contexte Historique & Continuité des Données',
      body: 'Africalia s\'appuie sur des protocoles scientifiques rigoureux. Découvrez notre cadre méthodologique avant de choisir votre destination d\'exploration.',
      regionFocus: 'Intégrité Scientifique & Synthèse Transatlantique'
    }
  },

  // 3. Portuguese (Português de Portugal)
  pt: {
    1: {
      stageBadge: 'Ecrã 1: As Fundações (História e Património)',
      header: 'Descubra a Diáspora',
      body: 'Bem-vindo ao Africalia, um portal de referência em honra do Explorador Étnico do Atlântico. Explore as memórias profundas, a resiliência e os patrimónios que unem a Europa, a África e as Américas.',
      regionFocus: 'Eixo Tonal da África Oriental e do Norte'
    },
    2: {
      stageBadge: 'Ecrã 2: A Evolução (Realidade Socioeconómica)',
      header: 'Moldando o Desenvolvimento',
      body: 'Aprofunde o conhecimento sobre as forças socioeconómicas, estruturas históricas e inovações locais que definem o continente africano contemporâneo.',
      regionFocus: 'Eixo Tonal da África Ocidental e Austral'
    },
    3: {
      stageBadge: 'Ecrã 3: O Horizonte (O Futuro)',
      header: 'Um Amanhã Dinâmico',
      body: 'Descubra uma África virada para o futuro, impulsionada por uma juventude vibrante, mercados tecnológicos em expansão e sustentabilidade.',
      regionFocus: 'Eixo da África Central e Inovação Panafricana'
    },
    4: {
      stageBadge: 'Ecrã 4: Integridade Académica e Entrada Dual',
      header: 'Contexto Histórico e Continuidade Científica',
      body: 'O Africalia cumpre normas rigorosas de investigação e ética historiográfica. Consulte a metodologia e selecione o seu ponto de partida.',
      regionFocus: 'Integridade Académica e Síntese Transatlântica'
    }
  },

  // 4. Spanish (Español)
  es: {
    1: {
      stageBadge: 'Pantalla 1: Los Fundamentos (Historia y Patrimonio)',
      header: 'Descubra la Diáspora',
      body: 'Bienvenido a Africalia, una puerta de entrada dedicada al Explorador Étnico del Atlántico. Sumérjase en las profundas historias, la resiliencia y el patrimonio compartido que une a Europa, África y las Américas.',
      regionFocus: 'Eje Tonal África Oriental y del Norte'
    },
    2: {
      stageBadge: 'Pantalla 2: La Evolución (Realidad Socioeconómica)',
      header: 'Forjando el Desarrollo',
      body: 'Conozca a fondo las complejas fuerzas socioeconómicas, realidades estructurales e innovaciones locales que definen el continente en la actualidad.',
      regionFocus: 'Eje Tonal África Occidental y Austral'
    },
    3: {
      stageBadge: 'Pantalla 3: El Horizonte (El Futuro)',
      header: 'Un Mañana Dinámico',
      body: 'Descubra una África con visión de futuro, impulsada por una juventud vibrante, mercados tecnológicos en expansión y sostenibilidad.',
      regionFocus: 'Eje África Central e Innovación Panafricana'
    },
    4: {
      stageBadge: 'Pantalla 4: Rigor Académico y Acceso Dual',
      header: 'Contexto Histórico y Continuidad de Contenidos',
      body: 'Africalia opera bajo estrictos protocolos científicos y pedagógicos. Revise el marco de investigación antes de elegir su destino de entrada.',
      regionFocus: 'Integridad Académica y Síntesis Transatlántica'
    }
  },

  // 5. German (Deutsch)
  de: {
    1: {
      stageBadge: 'Bildschirm 1: Das Fundament (Geschichte & Erbe)',
      header: 'Entdecken Sie die Diaspora',
      body: 'Willkommen bei Africalia, einem Portal zu Ehren des Atlantic Ethnic Explorer. Erkunden Sie die tiefgründigen Geschichten, die Widerstandskraft und das Erbe, das Europa, Afrika und Amerika verbindet.',
      regionFocus: 'Ost- & Nordafrika Tonachse'
    },
    2: {
      stageBadge: 'Bildschirm 2: Die Entwicklung (Sozioökonomie)',
      header: 'Entwicklung Gestalten',
      body: 'Erfahren Sie mehr über die komplexen sozioökonomischen Kräfte, strukturellen Realitäten und lokalen Innovationen, die den Kontinent heute prägen.',
      regionFocus: 'West- & Südafrika Tonachse'
    },
    3: {
      stageBadge: 'Bildschirm 3: Der Horizont (Die Zukunft)',
      header: 'Ein Dynamisches Morgen',
      body: 'Entdecken Sie ein zukunftsorientiertes, aufstrebendes Afrika, angetrieben von dynamischer Jugend, Technologiemärkten und nachhaltiger Entwicklung.',
      regionFocus: 'Zentralafrika & Panafrikanische Innovation'
    },
    4: {
      stageBadge: 'Bildschirm 4: Akademische Integrität & Dualer Zugang',
      header: 'Historischer Kontext & Datenkontinuität',
      body: 'Africalia arbeitet nach strengen wissenschaftlichen Standards. Wählen Sie Ihren individuellen Einstiegspunkt in den Atlas.',
      regionFocus: 'Wissenschaftliche Integrität & Transatlantische Synthese'
    }
  },

  // 6. Italian (Italiano)
  it: {
    1: {
      stageBadge: 'Schermata 1: Le Fondamenta (Storia e Patrimonio)',
      header: 'Scopri la Diaspora',
      body: 'Benvenuti su Africalia, un portale d\'eccellenza in onore dell\'Esploratore Etnico dell\'Atlantico. Immergiti nelle storie profonde, nella resilienza e nelle eredità condivise che uniscono Europa, Africa e Americhe.',
      regionFocus: 'Asse Tonale Africa Orientale e Settentrionale'
    },
    2: {
      stageBadge: 'Schermata 2: L\'Evoluzione (Realtà Socioeconomica)',
      header: 'Plasmare lo Sviluppo',
      body: 'Approfondisci le complesse dinamiche socioeconomiche, le realtà strutturali e le innovazioni locali che definiscono il continente oggi.',
      regionFocus: 'Asse Tonale Africa Occidentale e Australe'
    },
    3: {
      stageBadge: 'Schermata 3: L\'Orizzonte (Il Futuro)',
      header: 'Un Domani Dinamico',
      body: 'Scopri un\'Africa proiettata nel futuro, trainata da una gioventù vivace, mercati tecnologici in espansione e uno sviluppo sostenibile.',
      regionFocus: 'Asse Africa Centrale e Innovazione Panafricana'
    },
    4: {
      stageBadge: 'Schermata 4: Integrità Accademica e Doppio Accesso',
      header: 'Contesto Storico e Continuità dei Contenuti',
      body: 'Africalia opera secondo rigorosi protocolli accademici ed etici. Esplora il quadro metodologico e scegli la tua destinazione di partenza.',
      regionFocus: 'Integrità Scientifica e Sintesi Transatlantica'
    }
  },

  // 7. Dutch (Nederlands)
  nl: {
    1: {
      stageBadge: 'Scherm 1: Het Fundament (Geschiedenis & Erfgoed)',
      header: 'Ontdek de Diaspora',
      body: 'Welkom bij Africalia, een portaal ter ere van de Atlantic Ethnic Explorer. Verdiep u in de diepgaande geschiedenis, veerkracht en het erfgoed dat Europa, Afrika en de Amerika\'s verbindt.',
      regionFocus: 'Oost- & Noord-Afrika Toon-as'
    },
    2: {
      stageBadge: 'Scherm 2: De Evolutie (Sociaaleconomie)',
      header: 'Ontwikkeling Vormgeven',
      body: 'Maak kennis met de complexe sociaaleconomische krachten, structurele realiteiten en lokale innovaties die het continent vandaag vormgeven.',
      regionFocus: 'West- & Zuidelijk Afrika Toon-as'
    },
    3: {
      stageBadge: 'Scherm 3: De Horizon (De Toekomst)',
      header: 'Een Dynamische Toekomst',
      body: 'Ontdek een toekomstgericht Afrika, aangedreven door levendige jongeren, groeiende technologiemarkten en een duurzame toekomst.',
      regionFocus: 'Centraal-Afrika & Panafrikaanse Innovatie'
    },
    4: {
      stageBadge: 'Scherm 4: Academische Integriteit & Toegang',
      header: 'Historische Context & Gegevenscontinuïteit',
      body: 'Africalia hanteert strenge wetenschappelijke protocollen. Bekijk het methodologische kader en kies uw startpunt.',
      regionFocus: 'Wetenschappelijke Integriteit & Trans-Atlantische Synthese'
    }
  },

  // 8. Arabic (العربية)
  ar: {
    1: {
      stageBadge: 'الشاشة 1: الأساس (التاريخ والتراث)',
      header: 'اكتشف الشتات الإفريقي',
      body: 'مرحباً بكم في أفريكاليا، البوابة المتميزة لتكريم المستكشف الإثني الأطلسي. انغمس في التاريخ العميق والصمود والتراث المترابط الذي يجمع بين أوروبا وإفريقيا والأمريكتين.',
      regionFocus: 'محور شرق وشمال إفريقيا'
    },
    2: {
      stageBadge: 'الشاشة 2: التطور (الواقع الاجتماعي والاقتصادي)',
      header: 'صياغة مسارات التنمية',
      body: 'تعرف بعمق على القوى الاجتماعية والاقتصادية والابتكارات المحلية التي تعيد تشكيل القارة الإفريقية المعاصرة وتتجاوز السرديات الأحادية.',
      regionFocus: 'محور غرب وجنوب إفريقيا'
    },
    3: {
      stageBadge: 'الشاشة 3: الأفق (المستقبل)',
      header: 'غد مشرق وديناميكي',
      body: 'اكتشف إفريقيا المتطلعة للمستقبل، والمدفوعة بطاقة شبابية متوثبة، وأسواق تكنولوجية سريعة النمو، واستدامة واعدة.',
      regionFocus: 'محور وسط إفريقيا والابتكار الإفريقي الشامل'
    },
    4: {
      stageBadge: 'الشاشة 4: النزاهة الأكاديمية والوصول المزدوج',
      header: 'السياق التاريخي واستمرارية المحتوى',
      body: 'تعمل منصة أفريكاليا وفق أعلى المعايير العلمية والمنهجية. اطلع على بروتوكولات البحث ثم اختر وجهة انطلاقك.',
      regionFocus: 'النزاهة الأكاديمية والتركيب التاريخي الأطلسي'
    }
  },

  // 9. Amharic (አማርኛ)
  am: {
    1: {
      stageBadge: 'ደረጃ 1፡ መሠረተ-ታሪክና ቅርስ',
      header: 'ዲያስፖራውን ያግኙ',
      body: 'ወደ አፍሪካሊያ በደህና መጡ፤ የአትላንቲክ ብሔር አሳሽ መግቢያ። አውሮፓን፣ አፍሪካንና አሜሪካን የሚያስተሳስረውን ታሪክና ቅርስ ያስሱ።',
      regionFocus: 'የምሥራቅና ሰሜን አፍሪካ አውድ'
    },
    2: {
      stageBadge: 'ደረጃ 2፡ ማኅበራዊና ኢኮኖሚያዊ ዕድገት',
      header: 'ልማትን መቅረጽ',
      body: 'ዛሬ አህጉሪቱን የሚቀርጹትን ማኅበራዊና ኢኮኖሚያዊ ኃይሎች፣ መዋቅራዊ እውነታዎችና የሀገር በቀል ፈጠራዎች በጥልቀት ይረዱ።',
      regionFocus: 'የምዕራብና ደቡብ አፍሪካ አውድ'
    },
    3: {
      stageBadge: 'ደረጃ 3፡ የወደፊቱ አድማስ',
      header: 'ተስፋ ሰጪ ነገ',
      body: 'በወጣቶች ጉልበት፣ በቴክኖሎጂ ገበያዎችና በዘላቂ ልማት የሚመራውን የወደፊቱን ብሩህ አፍሪካ ያግኙ።',
      regionFocus: 'የመካከለኛው አፍሪካና የፓን-አፍሪካ ፈጠራ'
    },
    4: {
      stageBadge: 'ደረጃ 4፡ ምሁራዊ ጥራትና መግቢያ',
      header: 'ታሪካዊ አውድና የይዘት ቀጣይነት',
      body: 'አፍሪካሊያ በከፍተኛ የምርምር መርሆዎች ይመራል። የስነ-ዘዴ ማዕቀፉን ይገምግሙና የመረጡትን መዳረሻ ይምረጡ።',
      regionFocus: 'ምሁራዊ ጥራትና አትላንቲክ ውህደት'
    }
  },

  // 10. Hausa (Harshen Hausa)
  ha: {
    1: {
      stageBadge: 'Kashi na 1: Tushen Tarihi da Gado',
      header: 'Gano Ƴan Ƙasar Waje',
      body: 'Barka da zuwa Africalia, babbar kofa mai karrama Mai Binciken Kabilanci na Tekun Atlantika. Shiga cikin zurfin tarihi da hadin gwiwar Turai, Afirka, da Amurka.',
      regionFocus: 'Yankin Gabas da Arewacin Afirka'
    },
    2: {
      stageBadge: 'Kashi na 2: Sauye-sauyen Tattalin Arziki',
      header: 'Tsara Ci Gaba',
      body: 'Fahimci dabarun tattalin arziki, ci gaban zamantakewa, da kirkire-kirkire na cikin gida dake tafiyar da nahiyar Afirka a yau.',
      regionFocus: 'Yankin Yamma da Kudancin Afirka'
    },
    3: {
      stageBadge: 'Kashi na 3: Hangenta na Gaba',
      header: 'Gobe Mai Haske',
      body: 'Gano sabuwar Afirka mai ci gaba karkashin matasa masu hazaka, fasahar zamani, da bunkasar tattalin arziki mai dorewa.',
      regionFocus: 'Tsakiyar Afirka da Hadin Kan Nahiyar'
    },
    4: {
      stageBadge: 'Kashi na 4: Nagartar Ilmi da Hanyoyin Shiga',
      header: 'Bayanin Tarihi da Ci Gaban Bayanai',
      body: 'Africalia na aiki karkashin kyakkyawan tsarin ilmi da bincike. Zabi inda kake son fara bincikenka a cikin taswirar.',
      regionFocus: 'Nagartar Ilmi da Hadin Kan Atlantika'
    }
  },

  // 11. Igbo (Asụsụ Igbo)
  ig: {
    1: {
      stageBadge: 'Nke 1: Ntọala (Akụkọ Ihe Mere Eme & Ihe Nketa)',
      header: 'Chọpụta Ndị Nọ na Mba Ọzọ',
      body: 'Nnọọ na Africalia, ụzọ nkwanye ugwu maka Atlantic Ethnic Explorer. Banye n\'ime akụkọ miri emi, ntachi obi na ihe nketa jikọtara Europe, Africa na America.',
      regionFocus: 'Ebe Ọwụwa Anyanwụ & Ugwu Africa'
    },
    2: {
      stageBadge: 'Nke 2: Mgbanwe (Ọnọdụ Akụ na Ụba)',
      header: 'Ịkpụzi Mmepe',
      body: 'Mụta nke ọma banyere ike akụ na ụba, eziokwu nhazi na ihe ọhụrụ obodo na-akọwa kọntinent ahụ taa.',
      regionFocus: 'Ebe Ọdịda Anyanwụ & Ndịda Africa'
    },
    3: {
      stageBadge: 'Nke 3: Ọdịnihu Dị Mma',
      header: 'Echi Na-egbuke Egbuke',
      body: 'Chọpụta Africa na-aga n\'ihu nke ndị ntorobịa nwere ume, ahịa teknụzụ na mmepe na-adigide na-akwado.',
      regionFocus: 'Etiti Africa & Pan-African Innovation'
    },
    4: {
      stageBadge: 'Nke 4: Iguzosi Ike n\'Ihe Ọmụmụ',
      header: 'Ọnọdụ Akụkọ Ihe Mere Eme',
      body: 'Africalia na-arụ ọrụ n\'okpuru usoro agụmakwụkwọ siri ike. Họrọ ebe ị ga-achọ ịmalite njem gị.',
      regionFocus: 'Nnyocha Agụmakwụkwọ & Njikọ Atlantika'
    }
  },

  // 12. Yoruba (Èdè Yorùbá)
  yo: {
    1: {
      stageBadge: 'Ipele 1: Ipilẹṣẹ (Itan & Ajogunba)',
      header: 'Ṣawari Awọn Ara Ilu Oṣere',
      body: 'Kaabọ si Africalia, ẹnu-ọna ti a ṣe iyasọtọ lati bu ọla fun Oluṣawari Ẹya Atlantic. Rin irin-ajo nipasẹ itan ti o jinlẹ ati ajogunba ti o so Yuroopu, Afirika, ati Amẹrika pọ.',
      regionFocus: 'Ila-oorun & Ariwa Afirika'
    },
    2: {
      stageBadge: 'Ipele 2: Idagbasoke (Oro-aje & Awujọ)',
      header: 'Ṣiṣe Idagbasoke',
      body: 'Mọ awọn agbara eto-ọrọ aje ati awọn imotuntun agbegbe ti n ṣe itumọ ilẹ Afirika loni.',
      regionFocus: 'Iwọ-oorun & Gusu Afirika'
    },
    3: {
      stageBadge: 'Ipele 3: Ọjọ Iwaju Ti O Daju',
      header: 'Ọla Ti O Larinrin',
      body: 'Ṣawari Afirika ti o n dide ti o n wa niwaju, ti a dari nipasẹ ọdọ ti o larinrin, awọn ọja imọ-ẹrọ, ati idagbasoke alagbero.',
      regionFocus: 'Aarin Afirika & Isopọ Gbogbo Afirika'
    },
    4: {
      stageBadge: 'Ipele 4: Otitọ Eko & Wiwọle',
      header: 'Itan & Ilọsiwaju Data',
      body: 'Africalia n ṣiṣẹ labẹ awọn ilana iwadii to muna. Yan ibi ti o fẹ lati bẹrẹ irin-ajo rẹ.',
      regionFocus: 'Iwadii Eko & Isopọ Atlantic'
    }
  },

  // 13. Wolof (Wòlof)
  wo: {
    1: {
      stageBadge: 'Pàcc 1: Cëslaay gi (Taariix ak Cosaan)',
      header: 'Gis Lëkkalekaay bi',
      body: 'Dalal ak jàmm ci Africalia, bunt bu mag ngir teral Boroom Gëstu ci Géeju Atlantik. Xam-xamu taariix ak cosaan gu réy gi lëkkale Tugal, Afrig ak Aamerik.',
      regionFocus: 'Penku ak Bëj-gànnaaru Afrig'
    },
    2: {
      stageBadge: 'Pàcc 2: Yookkute gi (Koom-koom ak Mboolo)',
      header: 'Defar Yookkute gi',
      body: 'Xam bu baax dooley koom-koom ak xalaat yu yees yi yëngal réewi Afrig tey jii.',
      regionFocus: 'Sowwu ak Bëj-saalumu Afrig'
    },
    3: {
      stageBadge: 'Pàcc 3: Ëllëg gu Leer',
      header: 'Ëllëg gu Yees',
      body: 'Gis Afrig guy jëm kanam ak xale yu am fit, xarala yu yees yi ak yookkute gu sax.',
      regionFocus: 'Diggu Afrig ak Bennoo'
    },
    4: {
      stageBadge: 'Pàcc 4: Xam-xam ak Dugguwaay',
      header: 'Taariix ak Dëggu Xibaar',
      body: 'Africalia dafa sukkandiku ci gëstu gu wóor. Tànnal fa nga bëggee door sa njàng.',
      regionFocus: 'Xam-xamu Dëgg ak Géeju Atlantik'
    }
  },

  // 14. Zulu (isiZulu)
  zu: {
    1: {
      stageBadge: 'Isiteji 1: Isisekelo (Umlando Namasiko)',
      header: 'Thola Abasezweni',
      body: 'Siyakwamukela ku-Africalia, isango lokuhlonipha uMhloli Wezizwe zase-Atlantic. Gxila emlandweni ojulile, ukubekezela kanye namagugu ahlanganisa iYurophu, i-Afrika kanye ne-Melika.',
      regionFocus: 'Empumalanga Nenyakatho ne-Afrika'
    },
    2: {
      stageBadge: 'Isiteji 2: Ukuthuthuka (Umnotho Nomphakathi)',
      header: 'Ukwakha Intuthuko',
      body: 'Bamba iqhaza ngokujulile emandleni omnotho, amaqiniso ezenhlalo kanye nezinto ezintsha ezichaza izwekazi namuhla.',
      regionFocus: 'Entshonalanga NaseNingizimu Afrika'
    },
    3: {
      stageBadge: 'Isiteji 3: Ikusasa Elikhanyayo',
      header: 'Ikusasa Elinohlonze',
      body: 'Thola i-Afrika ebheke phambili eqhutshwa yintsha enomfutho, ubuchwepheshe obuthuthukile kanye nentuthuko esimeme.',
      regionFocus: 'I-Afrika Ephakathi Nokusungula Kwe-Pan-African'
    },
    4: {
      stageBadge: 'Isiteji 4: Ubuqotho Bencwadi Nokungena',
      header: 'Isizinda Somlando Nokuqukethwe',
      body: 'I-Africalia isebenza ngaphansi kwemithetho eqinile yocwaningo. Khetha indawo ofisa ukuqala ngayo.',
      regionFocus: 'Ubuqotho Bezifundo Nokuhlanganiswa Kwe-Atlantic'
    }
  },

  // 15. Xhosa (isiXhosa)
  xh: {
    1: {
      stageBadge: 'Inyathelo 1: Isiseko (Imbali Nelifa)',
      header: 'Fumanisa i-Diaspora',
      body: 'Wamkelekile kwi-Africalia, isango lokuhlonipha uMhloli Wezizwe zase-Atlantic. Ngena kwimbali enzulu, ukunyamezela kunye nelifa elidibanisa iYurophu, i-Afrika kunye ne-Melika.',
      regionFocus: 'Mpuma neNtshona Afrika'
    },
    2: {
      stageBadge: 'Inyathelo 2: Imvelaphi yoQoqosho',
      header: 'Ukwakha uPhuhliso',
      body: 'Yazi nzulu ngamandla ezoqoqosho, ubunyani bezentlalo kunye nezinto ezintsha ezichaza ilizwekazi namhlanje.',
      regionFocus: 'Ntshona noMzantsi Afrika'
    },
    3: {
      stageBadge: 'Inyathelo 3: Ikamva Eliqaqambileyo',
      header: 'Ingomso Elinamandla',
      body: 'Fumanisa i-Afrika ekhangele phambili eqhutywa lulutsha olunomdla, ubugcisa bale mihla kunye nophuhliso oluzinzileyo.',
      regionFocus: 'Afrika Ebindi noTshintsho lwe-Pan-African'
    },
    4: {
      stageBadge: 'Inyathelo 4: Imfundo Enzulu noKungena',
      header: 'Imbali noBulungisa boLwazi',
      body: 'I-Africalia isebenza phantsi kwemigangatho engqongqo yophando. Khetha apho ufuna ukuqala khona uhambo lwakho.',
      regionFocus: 'Uphando lweMfundo noMdibaniso we-Atlantic'
    }
  }
};
