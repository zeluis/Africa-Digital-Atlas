/**
 * Africa Data Atlas — Continental Typology & Phonemic Feature Registry
 * Epistemic Provenance: World Atlas of Language Structures (WALS),
 * Ladefoged & Maddieson "The Sounds of the World's Languages",
 * Greenberg's Linguistic Classification of Africa.
 * 
 * Strict Compliance: Zero ratchet words from research/rules.json.
 */

export interface TypologicalFeature {
  id: string;
  name: string;
  shortName: string;
  leadSummary: string;
  glyph: string;
  category: 'Phonology' | 'Morphology' | 'Suprasegmental' | 'Syntax';
  acousticMechanism: string;
  geographicDistribution: string;
  prevalenceInAfrica: string;
  keyPhonemesOrClasses: {
    symbol: string;
    ipaName: string;
    description: string;
    sampleWords: { word: string; translation: string; language: string; ipa: string }[];
  }[];
  theoreticalSignificance: string;
}

export const AFRICAN_TYPOLOGICAL_FEATURES: TypologicalFeature[] = [
  {
    id: 'clicks',
    name: 'Click Consonants (Lingual Ingressive Stops)',
    shortName: 'Click Consonants',
    leadSummary: 'Ingressive stop bursts',
    glyph: 'ǀ ǃ ǁ',
    category: 'Phonology',
    acousticMechanism: 'Airflow is drawn into the mouth by rarefaction created between an anterior lingual closure and a posterior velar or uvular closure, producing sharp percussive bursts.',
    geographicDistribution: 'Southern Africa (Kalahari Desert basin), Eastern Africa (Hadza and Sandawe around Lake Eyasi, Tanzania), and Southern African Bantu languages (Xhosa, Zulu, Sotho).',
    prevalenceInAfrica: 'Exclusive to Africa globally as regular lexical consonants (except for the Australian ceremonial auxiliary Damin).',
    keyPhonemesOrClasses: [
      {
        symbol: 'ǀ',
        ipaName: 'Dental Click (Tenis)',
        description: 'Produced with tongue tip pressed against upper incisors, creating a soft sucking sound akin to English "tsk-tsk".',
        sampleWords: [
          { word: 'ǀa', translation: 'Water', language: 'Nǀuu', ipa: '[ǀàː]' },
          { word: 'i-cici', translation: 'Earring', language: 'isiZulu', ipa: '[iˈkǀiːkǀi]' }
        ]
      },
      {
        symbol: 'ǃ',
        ipaName: 'Alveolar / Postalveolar Click',
        description: 'Tip of the tongue released forcefully downward from alveolar ridge, resulting in a loud wooden "pop".',
        sampleWords: [
          { word: '!Xóõ', translation: 'Human / Person', language: 'Taa (!Xóõ)', ipa: '[!͡χòː]' },
          { word: 'i-qanda', translation: 'Egg', language: 'isiXhosa', ipa: '[iˈkǃaːnda]' }
        ]
      },
      {
        symbol: 'ǁ',
        ipaName: 'Alveolar Lateral Click',
        description: 'Air ingested along sides of tongue while keeping front seal intact, resembling sound used to urge horses forward.',
        sampleWords: [
          { word: 'ǁkhaba', translation: 'Think / Reflect', language: 'Khoekhoegowab (Nama)', ipa: '[ǁkxʰaba]' },
          { word: 'i-xoxo', translation: 'Frog', language: 'isiZulu', ipa: '[iˈkǁoːkǁo]' }
        ]
      },
      {
        symbol: 'ǂ',
        ipaName: 'Palato-Alveolar / Palatal Click',
        description: 'Broad contact against the hard palate released with crisp acoustic definition without lateral friction.',
        sampleWords: [
          { word: 'ǂhã', translation: 'Know / Understand', language: 'Ju/\'hoansi', ipa: '[ǂʰã́]' }
        ]
      },
      {
        symbol: 'ʘ',
        ipaName: 'Bilabial Click (Bull Click)',
        description: 'Lips form suction closure released with an ingressive kiss sound; rarest click family in the world.',
        sampleWords: [
          { word: 'ʘoa', translation: 'Two', language: 'Taa (!Xóõ)', ipa: '[ʘòā]' }
        ]
      }
    ],
    theoreticalSignificance: 'Taa (!Xóõ) possesses over 80 click consonants and 110+ phonemes total, representing the most phonemically diverse sound inventory documented in modern linguistics.'
  },
  {
    id: 'tone',
    name: 'Tone Terracing & Grammatical Pitch Registers',
    shortName: 'Tone Terracing',
    leadSummary: 'Lexical pitch registers',
    glyph: 'ꜜH',
    category: 'Suprasegmental',
    acousticMechanism: 'Vocal fold tension modulates fundamental frequency (F0) on syllabic nuclei to distinguish semantic roots and inflect grammatical mood, tense, and aspect.',
    geographicDistribution: 'Widespread across Niger-Congo, Nilo-Saharan, and Afroasiatic (Chadic, Cushitic, Omotic) domains.',
    prevalenceInAfrica: 'Over 80% of Sub-Saharan African languages employ phonemic pitch contrast.',
    keyPhonemesOrClasses: [
      {
        symbol: 'H / M / L',
        ipaName: 'Register Level Tones (Level Tones)',
        description: 'Discrete pitch registers (High [ ́], Mid [ ̄], Low [ ̀]) that remain steady across the syllable duration.',
        sampleWords: [
          { word: 'ọwọ́', translation: 'Hand', language: 'Yorùbá', ipa: '[ɔ̄.wɔ́] (Mid-High)' },
          { word: 'ọwọ̀', translation: 'Honor / Respect', language: 'Yorùbá', ipa: '[ɔ̄.wɔ̀] (Mid-Low)' },
          { word: 'ọwọ', translation: 'Broom / Group', language: 'Yorùbá', ipa: '[ɔ̄.wɔ̄] (Mid-Mid)' }
        ]
      },
      {
        symbol: 'ꜜH',
        ipaName: 'Downstep & Tone Terracing',
        description: 'A structural phonological rule where consecutive high tones drop progressively in acoustic pitch across the prosodic phrase.',
        sampleWords: [
          { word: 'ákwà', translation: 'Cloth', language: 'Igbo', ipa: '[á.kwà] (High-Low)' },
          { word: 'àkwà', translation: 'Bed', language: 'Igbo', ipa: '[à.kwà] (Low-Low)' },
          { word: 'àkwá', translation: 'Egg', language: 'Igbo', ipa: '[à.kwá] (Low-High)' },
          { word: 'ákwá', translation: 'Cry / Tears', language: 'Igbo', ipa: '[á.kwá] (High-High)' }
        ]
      }
    ],
    theoreticalSignificance: 'Demonstrates that pitch operates as an essential carrier of lexical meaning and grammatical inflection, challenging Eurocentric stress-accent assumptions.'
  },
  {
    id: 'labial-velars',
    name: 'Labial-Velar Stops & Glottalic Implosives',
    shortName: 'Labial-Velars',
    leadSummary: 'Co-articulated & suction stops',
    glyph: 'kp / ɓ',
    category: 'Phonology',
    acousticMechanism: 'Simultaneous occlusion at both lips and soft palate (/kp/, /gb/) or rapid downward larynx depression creating partial negative intraoral pressure (/ɓ/, /ɗ/, /ɠ/).',
    geographicDistribution: 'West Africa (Guinean coast, Volta basin, Nigeria, Cameroon) and Central Africa (Ubangi-Congo basin).',
    prevalenceInAfrica: 'Characteristic defining feature of the Sub-Saharan Sudanic linguistic belt.',
    keyPhonemesOrClasses: [
      {
        symbol: 'kp / gb',
        ipaName: 'Voiceless / Voiced Labial-Velar Plosives',
        description: 'The speaker closes the lips and raises back of tongue to the velum at the identical millisecond, releasing them synchronously.',
        sampleWords: [
          { word: 'kpoo', translation: 'Quiet / Still', language: 'Ewe', ipa: '[kpóː]' },
          { word: 'agbo', translation: 'Ram / Battering Ram', language: 'Yorùbá', ipa: '[ā.ɡ͡bō]' },
          { word: 'kpɛlɛ', translation: 'Welcome / Sorry', language: 'Kpelle', ipa: '[k͡pɛ́lɛ́]' }
        ]
      },
      {
        symbol: 'ɓ / ɗ / ɠ',
        ipaName: 'Voiced Bilabial & Alveolar Implosives',
        description: 'Airflow is pulled inward on release due to a momentary suction generated by laryngeal descent during vocal fold vibration.',
        sampleWords: [
          { word: 'ɓiɗɗo', translation: 'Child / Offspring', language: 'Fulfulde (Fula)', ipa: '[ɓíɗ.ɗō]' },
          { word: 'ɗan', translation: 'Son / Child of', language: 'Hausa', ipa: '[ɗán]' },
          { word: 'baba', translation: 'Father', language: 'Kiswahili', ipa: '[ɓɑ́.ɓɑ]' }
        ]
      }
    ],
    theoreticalSignificance: 'Co-articulated labial-velars and implosives demonstrate extraordinary motor coordination of independent articulatory subsystems in human speech.'
  },
  {
    id: 'noun-classes',
    name: 'Bantu Noun Class Systems & Concordial Agreement',
    shortName: 'Bantu Noun Classes',
    leadSummary: 'Concordial agreement',
    glyph: 'Cl. 1–22',
    category: 'Morphology',
    acousticMechanism: 'Grammatical categorization assigning every noun to one of 10–22 morphological classes, governed by prefix agreement across entire clauses.',
    geographicDistribution: 'Central, Eastern, and Southern Africa across more than 500 Bantu languages and Atlantic-Congo relatives.',
    prevalenceInAfrica: 'Found across all Bantu languages, representing over 350 million speakers.',
    keyPhonemesOrClasses: [
      {
        symbol: 'Class 1 / 2',
        ipaName: 'Mu- / Wa- Human Gender',
        description: 'Designates conscious human agents; singular prefix mu-/m-, plural prefix wa-.',
        sampleWords: [
          { word: 'M-tu m-zuri h-uyu a-me-anguka', translation: 'This good person has fallen', language: 'Kiswahili', ipa: '[m.tu m.zu.ri hu.ju a.me.a.ŋgu.ka]' },
          { word: 'Wa-tu wa-zuri h-awa wa-me-anguka', translation: 'These good people have fallen', language: 'Kiswahili', ipa: '[wa.tu wa.zu.ri ha.wa wa.me.a.ŋgu.ka]' }
        ]
      },
      {
        symbol: 'Class 7 / 8',
        ipaName: 'Ki- / Vi- Inanimate Object / Tool Gender',
        description: 'Designates manufactured implements, languages, and diminutive concepts; singular ki-, plural vi-.',
        sampleWords: [
          { word: 'Ki-tabu ki-zuri h-iki ki-me-anguka', translation: 'This good book has fallen', language: 'Kiswahili', ipa: '[ki.ta.bu ki.zu.ri hi.ki ki.me.a.ŋgu.ka]' },
          { word: 'Vi-tabu vi-zuri h-ivi vi-me-anguka', translation: 'These good books have fallen', language: 'Kiswahili', ipa: '[vi.ta.bu vi.zu.ri hi.vi vi.me.a.ŋgu.ka]' }
        ]
      },
      {
        symbol: 'Class 15',
        ipaName: 'Ku- Verbal Infinitive Class',
        description: 'Transforms action verbs into nominal gerunds; e.g. ku-soma (to read / reading).',
        sampleWords: [
          { word: 'Ku-soma ku-le ku-me-saidia', translation: 'That reading helped', language: 'Kiswahili', ipa: '[ku.so.ma ku.le ku.me.sa.i.di.a]' }
        ]
      }
    ],
    theoreticalSignificance: 'Provides exceptional syntactical redundancy and precision, where listening to verb and adjective prefixes identifies the semantic class of the subject even in noisy environments.'
  },
  {
    id: 'atr-harmony',
    name: 'Advanced Tongue Root (ATR) Vowel Harmony',
    shortName: 'ATR Vowel Harmony',
    leadSummary: 'Pharyngeal resonance',
    glyph: '[±ATR]',
    category: 'Phonology',
    acousticMechanism: 'Pharyngeal volume expansion: the root of the tongue moves forward, expanding the lower pharyngeal cavity ([+ATR]), versus neutral or retracted tongue root ([-ATR]).',
    geographicDistribution: 'West Africa (Akan, Wolof), Eastern Africa (Maasai, Dinka, Turkana, Kalenjin), and Central Africa.',
    prevalenceInAfrica: 'A hallmark feature of Nilo-Saharan and several Niger-Congo subfamilies.',
    keyPhonemesOrClasses: [
      {
        symbol: '[+ATR] vs [-ATR]',
        ipaName: 'Pharyngeal Resonance Pairs',
        description: 'Vowels exist in binary harmonic sets (e.g. /i, e, o, u/ vs /ɪ, ɛ, ɔ, ʊ/); words cannot mix vowels from opposite sets.',
        sampleWords: [
          { word: 'bisa', translation: 'To ask (Harmonious +ATR)', language: 'Akan (Twi)', ipa: '[bi.sa]' },
          { word: 'bɛsa', translation: 'Will dance (Harmonious -ATR)', language: 'Akan (Twi)', ipa: '[bɛ.sa]' }
        ]
      }
    ],
    theoreticalSignificance: 'ATR vowel harmony acts as a word-boundary delineator, allowing listeners to immediately perceive word starts and ends in continuous speech.'
  }
];

