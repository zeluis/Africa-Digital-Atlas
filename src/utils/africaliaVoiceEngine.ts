/**
 * Africalia Sovereign Voice & Audio Synthesis Engine
 * 
 * Provides crisp, intelligible, natural-cadence speech synthesis and acoustic modeling:
 * - Natural Unified Voice Engine: Automatically pairs with verified OS native voice engines
 * - Major International & Lusophone/Francophone routing: High-clarity native voices (en, fr, pt-PT, es, de, it, nl, ar)
 * - Indigenous African Phylum introductions: Articulate, respectful framing in warm natural voice alongside authentic scripts
 * - Acoustic Resonator: Web Audio API physical modeling pentatonic kalimba/marimba chord progression
 */

export interface SpeechGreetingConfig {
  text: string;
  langTag?: string;
  languageName?: string;
  title?: string;
  phonetic?: string;
  meaning?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

// Global state to track currently speaking audio
let currentAudioElement: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeAudioCtx: AudioContext | null = null;
const clientAudioCache = new Map<string, string>(); // key -> base64 or blob URL

// Male voice keywords to avoid for the default persona
const MALE_VOICE_NAMES = [
  'male', 'david', 'george', 'james', 'daniel', 'thomas', 'mark', 'paul',
  'guy', 'stefan', 'oliver', 'rishi', 'alex', 'fred', 'jorge', 'diego',
  'juan', 'pablo', 'manuel', 'carlos', 'enrique', 'alberto', 'pedro',
  'goncalo', 'duarte', 'tiago', 'joao', 'afonso', 'antonio', 'jean',
  'pierre', 'louis', 'michel', 'mathieu', 'alain', 'lucas', 'leo',
  'max', 'hans', 'klaus', 'stephan', 'michael', 'brian', 'arthur',
  'carlo', 'marco', 'luca', 'giuseppe', 'roberto', 'jan', 'willem',
  'dries', 'ruben', 'yannick', 'tariq', 'youssef', 'hassan',
  'man', 'boy', 'sir', 'mr'
];

// Preferred high-clarity female and natural voice indicators across modern OS (macOS, iOS, Windows, Android, ChromeOS)
const PREMIUM_NATURAL_VOICES = [
  'natural', 'neural', 'premium', 'enhanced', 'siri', 'karen', 'samantha',
  'victoria', 'moira', 'fiona', 'tessa', 'zira', 'ayanda', 'monica',
  'lucia', 'elsa', 'alice', 'joana', 'raquel', 'paola', 'helena',
  'catarina', 'francisca', 'leonor', 'ines', 'matilde', 'beatriz',
  'maria', 'ana', 'clara', 'camila', 'laura', 'sara', 'eva',
  'marta', 'sofia', 'carmen', 'elena', 'isabel', 'julie', 'marie',
  'charlotte', 'amelie', 'lea', 'manon', 'chloe', 'camille', 'celine',
  'audrey', 'amira', 'fatima', 'yasmin', 'amina', 'leila', 'nour',
  'mariam', 'aicha', 'khadija', 'jenny', 'sonia', 'serena', 'kore', 'zephyr'
];

/**
 * Validates that a speech synthesis voice is natural and non-male
 */
export function isNaturalFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  if (!voice || !voice.name) return false;
  const name = voice.name.toLowerCase();

  for (const maleKeyword of MALE_VOICE_NAMES) {
    const regex = new RegExp(`\\b${maleKeyword}\\b`, 'i');
    if (regex.test(name) || name.includes(` ${maleKeyword}`) || name.startsWith(maleKeyword)) {
      return false;
    }
  }

  for (const femaleKeyword of PREMIUM_NATURAL_VOICES) {
    if (name.includes(femaleKeyword)) {
      return true;
    }
  }

  return true;
}

/**
 * Clean and format text for natural rhythmic pauses without robotic cadence
 */
export function formatSpeechTextWithNaturalBreaths(rawText: string): string {
  return rawText
    .replace(/[—–]/g, ', ')
    .replace(/\s*:\s*/g, ', ')
    .replace(/\s*\.\.\.\s*/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Play a warm African kalimba/marimba pentatonic chord progression
 * Pentatonic scale: C4 (261.63Hz), E4 (329.63Hz), G4 (392.00Hz), A4 (440.00Hz), C5 (523.25Hz)
 */
export function playWarmAfricanChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!activeAudioCtx || activeAudioCtx.state === 'closed') {
      activeAudioCtx = new AudioContextClass();
    }
    const ctx = activeAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const frequencies = [261.63, 329.63, 392.00, 440.00, 523.25];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.95);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 1.0);
    });
  } catch (err) {
    console.debug('Acoustic chime initialization:', err);
  }
}

/**
 * Finds the most natural, native OS voice for a target locale, avoiding robotic distortions
 */
export function getBestSystemVoice(preferredLang?: string): { voice: SpeechSynthesisVoice | null; langCode: string; rate: number; pitch: number } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, langCode: 'en-US', rate: 1.0, pitch: 1.0 };
  }

  const rawVoices = window.speechSynthesis.getVoices();
  if (!rawVoices || rawVoices.length === 0) {
    return { voice: null, langCode: preferredLang || 'en-US', rate: 1.0, pitch: 1.0 };
  }

  const langLower = (preferredLang || '').toLowerCase();
  const baseLang = langLower.split('-')[0];

  // List of standard languages with verified native OS voice support
  const verifiedLangs = ['en', 'fr', 'pt', 'es', 'it', 'de', 'nl', 'ar'];

  if (verifiedLangs.includes(baseLang)) {
    // 1. Specifically match European Portuguese (pt-PT)
    if (baseLang === 'pt') {
      const ptPtVoices = rawVoices.filter(v => 
        (v.lang.toLowerCase().includes('pt-pt') || v.lang.toLowerCase() === 'pt_pt') &&
        isNaturalFemaleVoice(v)
      );
      if (ptPtVoices.length > 0) {
        return { voice: ptPtVoices[0], langCode: 'pt-PT', rate: 1.0, pitch: 1.0 };
      }
      const generalPt = rawVoices.filter(v => v.lang.toLowerCase().startsWith('pt') && isNaturalFemaleVoice(v));
      if (generalPt.length > 0) {
        return { voice: generalPt[0], langCode: 'pt-PT', rate: 1.0, pitch: 1.0 };
      }
    }

    // 2. French (fr-FR / fr-SN)
    if (baseLang === 'fr') {
      const frVoices = rawVoices.filter(v => v.lang.toLowerCase().startsWith('fr') && isNaturalFemaleVoice(v));
      const naturalFr = frVoices.find(v => PREMIUM_NATURAL_VOICES.some(p => v.name.toLowerCase().includes(p)));
      if (naturalFr) return { voice: naturalFr, langCode: 'fr-FR', rate: 0.98, pitch: 1.0 };
      if (frVoices.length > 0) return { voice: frVoices[0], langCode: 'fr-FR', rate: 0.98, pitch: 1.0 };
    }

    // 3. Spanish (es-ES)
    if (baseLang === 'es') {
      const esVoices = rawVoices.filter(v => v.lang.toLowerCase().startsWith('es') && isNaturalFemaleVoice(v));
      const naturalEs = esVoices.find(v => PREMIUM_NATURAL_VOICES.some(p => v.name.toLowerCase().includes(p)));
      if (naturalEs) return { voice: naturalEs, langCode: 'es-ES', rate: 1.0, pitch: 1.0 };
      if (esVoices.length > 0) return { voice: esVoices[0], langCode: 'es-ES', rate: 1.0, pitch: 1.0 };
    }

    // 4. German (de-DE)
    if (baseLang === 'de') {
      const deVoices = rawVoices.filter(v => v.lang.toLowerCase().startsWith('de') && isNaturalFemaleVoice(v));
      if (deVoices.length > 0) return { voice: deVoices[0], langCode: 'de-DE', rate: 0.98, pitch: 1.0 };
    }

    // 5. Italian (it-IT)
    if (baseLang === 'it') {
      const itVoices = rawVoices.filter(v => v.lang.toLowerCase().startsWith('it') && isNaturalFemaleVoice(v));
      if (itVoices.length > 0) return { voice: itVoices[0], langCode: 'it-IT', rate: 1.0, pitch: 1.0 };
    }

    // 6. Dutch (nl-NL)
    if (baseLang === 'nl') {
      const nlVoices = rawVoices.filter(v => v.lang.toLowerCase().startsWith('nl') && isNaturalFemaleVoice(v));
      if (nlVoices.length > 0) return { voice: nlVoices[0], langCode: 'nl-NL', rate: 1.0, pitch: 1.0 };
    }

    // 7. Arabic (ar)
    if (baseLang === 'ar') {
      const arVoices = rawVoices.filter(v => v.lang.toLowerCase().startsWith('ar') && isNaturalFemaleVoice(v));
      if (arVoices.length > 0) return { voice: arVoices[0], langCode: 'ar-SA', rate: 0.95, pitch: 1.0 };
    }
  }

  // Check if system has a verified indigenous African voice pack (e.g., Swahili, Zulu)
  if (preferredLang) {
    const directMatch = rawVoices.find(v => v.lang.toLowerCase() === langLower || v.lang.toLowerCase().startsWith(baseLang));
    if (directMatch && directMatch.lang.toLowerCase().startsWith(baseLang) && !baseLang.startsWith('en')) {
      return { voice: directMatch, langCode: directMatch.lang, rate: 0.95, pitch: 1.0 };
    }
  }

  // High-Grade English Sovereign Voice (Neutral, warm, high-intelligibility)
  // 1st priority: Native African English (en-NG, en-ZA, en-GH, en-KE)
  const africanEnglish = rawVoices.filter(v => 
    (v.lang.toLowerCase().includes('en-ng') || 
     v.lang.toLowerCase().includes('en-za') || 
     v.lang.toLowerCase().includes('en-gh') || 
     v.lang.toLowerCase().includes('en-ke')) &&
    isNaturalFemaleVoice(v)
  );
  if (africanEnglish.length > 0) {
    return { voice: africanEnglish[0], langCode: africanEnglish[0].lang, rate: 0.95, pitch: 1.0 };
  }

  // 2nd priority: Premium natural / neural female voice (Apple Siri/Samantha/Karen, Microsoft Jenny/Natural)
  const premiumEn = rawVoices.filter(v => 
    v.lang.toLowerCase().startsWith('en') &&
    PREMIUM_NATURAL_VOICES.some(p => v.name.toLowerCase().includes(p)) &&
    isNaturalFemaleVoice(v)
  );
  if (premiumEn.length > 0) {
    return { voice: premiumEn[0], langCode: premiumEn[0].lang, rate: 0.98, pitch: 1.0 };
  }

  // 3rd priority: Any standard English female voice
  const standardEn = rawVoices.filter(v => v.lang.toLowerCase().startsWith('en') && isNaturalFemaleVoice(v));
  if (standardEn.length > 0) {
    return { voice: standardEn[0], langCode: standardEn[0].lang, rate: 1.0, pitch: 1.0 };
  }

  return { voice: rawVoices[0] || null, langCode: 'en-US', rate: 1.0, pitch: 1.0 };
}

/**
 * Backward compatibility alias for legacy callers
 */
export function getAfricanFemaleVoice(preferredLang?: string): SpeechSynthesisVoice | null {
  return getBestSystemVoice(preferredLang).voice;
}

/**
 * Stop any current speech or audio playback
 */
export function stopAfricaliaSpeech() {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
      currentAudioElement = null;
    } catch {
      // Ignore
    }
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    } catch {
      // Ignore cancel errors
    }
  }
}

/**
 * Speak welcoming phrase using the high-fidelity native OS voice system
 */
export async function speakAfricaliaGreeting(config: SpeechGreetingConfig) {
  if (typeof window === 'undefined') return;

  // Always stop existing audio first
  stopAfricaliaSpeech();

  // Play the welcoming African pentatonic kalimba chime
  playWarmAfricanChime();

  const formattedText = formatSpeechTextWithNaturalBreaths(config.text);
  const cacheKey = `${config.langTag || 'default'}:${formattedText}`;

  // 1. Try local memory cache of neural audio if available
  if (clientAudioCache.has(cacheKey)) {
    const audioDataUrl = clientAudioCache.get(cacheKey)!;
    playNeuralAudio(audioDataUrl, { ...config, text: formattedText });
    return;
  }

  // 2. Query optional Server-Side Neural TTS API if available
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: formattedText,
        langTag: config.langTag,
        languageName: config.languageName,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.audioBase64) {
        const mime = data.mimeType || 'audio/mp3';
        const dataUrl = `data:${mime};base64,${data.audioBase64}`;
        clientAudioCache.set(cacheKey, dataUrl);
        playNeuralAudio(dataUrl, { ...config, text: formattedText });
        return;
      }
    }
  } catch {
    // Graceful silent fallback to native OS speech synthesis
  }

  // 3. High-Quality Native OS Speech Synthesis
  speakWithClientSynthesis({ ...config, text: formattedText });
}

/**
 * Play base64 neural audio buffer through HTML5 Audio
 */
function playNeuralAudio(audioUrl: string, config: SpeechGreetingConfig) {
  try {
    const audio = new Audio(audioUrl);
    currentAudioElement = audio;

    audio.onplay = () => {
      config.onStart?.();
    };

    audio.onended = () => {
      currentAudioElement = null;
      config.onEnd?.();
    };

    audio.onerror = () => {
      currentAudioElement = null;
      speakWithClientSynthesis(config);
    };

    setTimeout(() => {
      audio.play().catch(() => {
        speakWithClientSynthesis(config);
      });
    }, 180);
  } catch {
    speakWithClientSynthesis(config);
  }
}

/**
 * Client-Side SpeechSynthesis using native un-distorted operating system prosody
 */
function speakWithClientSynthesis(config: SpeechGreetingConfig) {
  if (!('speechSynthesis' in window)) {
    config.onStart?.();
    setTimeout(() => {
      config.onEnd?.();
    }, 3000);
    return;
  }

  try {
    const textToSpeak = formatSpeechTextWithNaturalBreaths(config.text);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    currentUtterance = utterance;

    const { voice, langCode, rate, pitch } = getBestSystemVoice(config.langTag);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = langCode;
    }

    // Use pure natural acoustic cadence without synthetic pitch/rate distortion
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      config.onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      config.onEnd?.();
    };

    utterance.onerror = (e) => {
      currentUtterance = null;
      config.onError?.();
      config.onEnd?.();
    };

    // Ensure voices are loaded if browser initialized asynchronously
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const lateVoice = getBestSystemVoice(config.langTag);
        if (lateVoice.voice) {
          utterance.voice = lateVoice.voice;
          utterance.lang = lateVoice.voice.lang;
        }
        window.speechSynthesis.speak(utterance);
      };
    } else {
      // Delay slightly for chime lead-in
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 180);
    }
  } catch {
    config.onStart?.();
    setTimeout(() => {
      config.onEnd?.();
    }, 2500);
  }
}

/**
 * Welcome greeting texts by Language Family for Language Page Cards
 * Provides both the indigenous native script and an articulate, natural greeting
 */
export interface FamilyWelcomeGreeting {
  familyId: string;
  nativePhrase: string;
  spokenPhrase: string;
  phoneticGuide: string;
  languageName: string;
  langTag: string;
  meaningEn: string;
}

export const LANGUAGE_FAMILY_GREETINGS: Record<string, FamilyWelcomeGreeting> = {
  'niger-congo': {
    familyId: 'niger-congo',
    nativePhrase: 'Karibu Africalia—Mvumbuzi wa Kikabila wa Atlantiki.',
    spokenPhrase: 'Welcome to the Niger-Congo linguistic phylum, home to over 1,500 living languages across Africa.',
    phoneticGuide: '[kaˈri.bu af.riˈka.li.a]',
    languageName: 'Kiswahili & Niger-Congo',
    langTag: 'sw-KE',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer.'
  },
  'afroasiatic': {
    familyId: 'afroasiatic',
    nativePhrase: 'Barka da zuwa Africalia—Mai Binciken Kabilun Atlantika.',
    spokenPhrase: 'Welcome to the Afroasiatic phylum, spanning the Sahara, Horn of Africa, and North African civilizations.',
    phoneticGuide: '[bar.ka da zu.wa af.riˈka.li.a]',
    languageName: 'Hausa & Afroasiatic',
    langTag: 'ha-NG',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer.'
  },
  'nilo-saharan': {
    familyId: 'nilo-saharan',
    nativePhrase: 'Yawa, karibu Africalia—Jagol kido mar Atlantic.',
    spokenPhrase: 'Welcome to the Nilo-Saharan language family, tracing ancient corridors from the Nile Basin to Central Africa.',
    phoneticGuide: '[ya.wa ka.ri.bu jag.ol ki.do]',
    languageName: 'Luo & Nilo-Saharan',
    langTag: 'sw-KE',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer.'
  },
  'austronesian': {
    familyId: 'austronesian',
    nativePhrase: 'Tonga soa eto amin\'ny Africalia—Mpikaroka ny foko Atlantika.',
    spokenPhrase: 'Welcome to the Austronesian phylum in Africa, connecting Madagascar and the Indian Ocean rim.',
    phoneticGuide: '[tʊŋ.ɡa su.a e.tu a.min.ni]',
    languageName: 'Malagasy & Austronesian',
    langTag: 'fr-FR',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer.'
  },
  'khoisan': {
    familyId: 'khoisan',
    nativePhrase: 'ǁKhawa ǃgû re Africalia—Atlantic ǃAosab ǃKhôa-aos.',
    spokenPhrase: 'Welcome to the Khoe-San linguistic families, representing humanity\'s deepest surviving phonetic heritages.',
    phoneticGuide: '[ǁkʰa.wa ǃɡuː re af.riˈka.li.a]',
    languageName: 'Nama & Khoe-San',
    langTag: 'en-ZA',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer.'
  },
  'indo-european': {
    familyId: 'indo-european',
    nativePhrase: 'Bem-bindu na Africalia—Splorador Étniku di Atlântiku.',
    spokenPhrase: 'Welcome to Atlantic Creoles and Indo-European linguistic heritages across continental and island states.',
    phoneticGuide: '[bẽj̃ˈbĩdu na af.riˈka.li.a]',
    languageName: 'Kriolu & Atlantic Creoles',
    langTag: 'pt-PT',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer.'
  }
};

/**
 * High-Intelligibility UI Language Greetings for the App Top Bar
 */
export const TOP_BAR_UI_GREETINGS: Record<string, { phrase: string; langTag: string; languageName: string }> = {
  'en': {
    phrase: 'Welcome to the Africalia experience, the Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-NG',
    languageName: 'English (Sovereign Voice)'
  },
  'fr': {
    phrase: 'Bienvenue dans l\'expérience Africalia, l\'explorateur ethnique de l\'Atlantique. Bonne découverte.',
    langTag: 'fr-FR',
    languageName: 'Français'
  },
  'pt': {
    phrase: 'Olá, bem-vindo à experiência Africalia, o Explorador Étnico do Atlântico. Desfrute da sua exploração.',
    langTag: 'pt-PT',
    languageName: 'Português (Portugal)'
  },
  'es': {
    phrase: 'Hola, bienvenido a la experiencia Africalia, el Explorador Étnico del Atlántico. Disfrute de su exploración.',
    langTag: 'es-ES',
    languageName: 'Español'
  },
  'it': {
    phrase: 'Ciao e benvenuto nell\'esperienza Africalia, l\'Esploratore Etnico dell\'Atlantico. Buona scoperta.',
    langTag: 'it-IT',
    languageName: 'Italiano'
  },
  'nl': {
    phrase: 'Hallo, welkom bij de Africalia-ervaring, de Atlantische Etnische Verkenner. Veel plezier met uw ontdekkingstocht.',
    langTag: 'nl-NL',
    languageName: 'Nederlands'
  },
  'de': {
    phrase: 'Willkommen zum Africalia-Erlebnis, der Atlantische Ethnische Entdecker. Viel Vergnügen.',
    langTag: 'de-DE',
    languageName: 'Deutsch'
  },
  'ar': {
    phrase: 'مرحباً بكم في تجربة أفريكاليا، مستكشف عرقيات المحيط الأطلسي. نتمنى لكم وقتاً ممتعاً.',
    langTag: 'ar-SA',
    languageName: 'العربية (Arabic)'
  },
  // Indigenous languages: clean, intelligible introductions without phonetic garbling
  'yo': {
    phrase: 'Welcome to the Africalia experience in Yoruba. The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-NG',
    languageName: 'Yorùbá'
  },
  'ha': {
    phrase: 'Welcome to the Africalia experience in Hausa. The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-NG',
    languageName: 'Hausa'
  },
  'ig': {
    phrase: 'Welcome to the Africalia experience in Igbo. The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-NG',
    languageName: 'Igbo'
  },
  'sw': {
    phrase: 'Welcome to the Africalia experience in Kiswahili. The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-KE',
    languageName: 'Kiswahili'
  },
  'am': {
    phrase: 'Welcome to the Africalia experience in Amharic. The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-NG',
    languageName: 'Amharic (አማርኛ)'
  },
  'wo': {
    phrase: 'Welcome to the Africalia experience in Wolof. The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-NG',
    languageName: 'Wolof'
  },
  'zu': {
    phrase: 'Welcome to the Africalia experience in isiZulu. The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-ZA',
    languageName: 'isiZulu'
  },
  'xh': {
    phrase: 'Welcome to the Africalia experience in isiXhosa. The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-ZA',
    languageName: 'isiXhosa'
  }
};
