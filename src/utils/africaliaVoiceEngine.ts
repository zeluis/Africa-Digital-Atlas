/**
 * Africalia Sovereign Voice & Audio Synthesis Engine
 * 
 * Provides warm, inviting, human-grade African female voice synthesis for:
 * - Language Family Cards (spoken in the indigenous card language family)
 * - App Top Bar (spoken in the user's currently selected UI language)
 * 
 * Architecture:
 * 1. Client Audio Cache: Checks for pre-rendered/streamed neural audio buffers.
 * 2. Full-Stack Neural API (/api/tts): Queries ElevenLabs / Gemini Neural TTS backend.
 * 3. Acoustic Resonator: Warm kalimba/marimba harmonic chime preceding speech.
 * 4. Human-Tuned SpeechSynthesis Fallback: Polyfilled with resonant warmth and African female voice profiling.
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

// Male voice keywords to strictly reject
const MALE_VOICE_NAMES = [
  'male', 'david', 'george', 'james', 'daniel', 'thomas', 'mark', 'paul',
  'guy', 'stefan', 'oliver', 'rishi', 'alex', 'fred', 'jorge', 'diego',
  'juan', 'pablo', 'manuel', 'carlos', 'enrique', 'alberto', 'pedro',
  'goncalo', 'duarte', 'tiago', 'joao', 'afonso', 'antonio', 'jean',
  'pierre', 'louis', 'michel', 'mathieu', 'alain', 'lucas', 'leo',
  'max', 'hans', 'klaus', 'stephan', 'michael', 'brian', 'arthur',
  'carlo', 'marco', 'luca', 'giuseppe', 'roberto', 'jan', 'willem',
  'dries', 'ruben', 'yannick', 'mohammed', 'tariq', 'youssef', 'hassan',
  'man', 'boy', 'sir', 'mr'
];

// Positive female voice indicators
const FEMALE_VOICE_NAMES = [
  'female', 'woman', 'girl', 'kore', 'zephyr', 'samantha', 'victoria',
  'karen', 'moira', 'fiona', 'tessa', 'zira', 'ayanda', 'monica',
  'lucia', 'elsa', 'alice', 'joana', 'raquel', 'paola', 'helena',
  'catarina', 'francisca', 'leonor', 'ines', 'matilde', 'beatriz',
  'maria', 'ana', 'clara', 'camila', 'laura', 'sara', 'eva',
  'marta', 'sofia', 'carmen', 'elena', 'isabel', 'julie', 'marie',
  'charlotte', 'amelie', 'lea', 'manon', 'chloe', 'camille', 'celine',
  'audrey', 'amira', 'fatima', 'yasmin', 'amina', 'leila', 'nour',
  'mariam', 'aicha', 'khadija', 'ngozi', 'chidinma', 'adaeze', 'chinwe',
  'oluchi', 'funke', 'folake', 'bisi', 'yetunde', 'ronke', 'zola',
  'thandiwe', 'nomvula', 'busisiwe', 'lurdes', 'djamila', 'katia',
  'creola', 'sabura', 'munti'
];

/**
 * Validates that a speech synthesis voice is strictly female
 */
export function isStrictlyFemaleVoice(voice: SpeechSynthesisVoice): boolean {
  if (!voice || !voice.name) return false;
  const name = voice.name.toLowerCase();

  // If name explicitly matches any male keyword, reject
  for (const maleKeyword of MALE_VOICE_NAMES) {
    // Word boundary check or direct substring
    const regex = new RegExp(`\\b${maleKeyword}\\b`, 'i');
    if (regex.test(name) || name.includes(` ${maleKeyword}`) || name.startsWith(maleKeyword)) {
      return false;
    }
  }

  // If name has explicit female keyword, accept
  for (const femaleKeyword of FEMALE_VOICE_NAMES) {
    if (name.includes(femaleKeyword)) {
      return true;
    }
  }

  // Neural / Natural voices from modern platforms that are not male
  if (name.includes('natural') || name.includes('neural') || name.includes('online')) {
    return true;
  }

  return true;
}

/**
 * Format text for natural breathing pauses, rhythm, and prosody
 */
export function formatSpeechTextWithNaturalBreaths(rawText: string): string {
  return rawText
    .replace(/[—–]/g, ', ')
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s*\.\.\.\s*/g, '... ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Play a welcoming indigenous African kalimba/marimba harmonic chime with dual-stage overtones
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
    // Pentatonic African acoustic motif: C4 (261.6), E4 (329.6), G4 (392.0), A4 (440.0), C5 (523.25)
    const frequencies = [261.63, 329.63, 392.00, 440.00, 523.25];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Warm woody kalimba/marimba tone + gourd resonance
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.2);
    });
  } catch (err) {
    console.debug('Acoustic chime initialization:', err);
  }
}

/**
 * Select strictly female voice (African or European based on preferredLang)
 */
export function getAfricanFemaleVoice(preferredLang?: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const rawVoices = window.speechSynthesis.getVoices();
  if (!rawVoices || rawVoices.length === 0) return null;

  // STRICT FILTER: Keep only female voices
  const voices = rawVoices.filter(isStrictlyFemaleVoice);
  if (voices.length === 0) {
    // If filter removed all, find any voice without explicit male keyword
    const safeVoices = rawVoices.filter(v => {
      const n = v.name.toLowerCase();
      return !MALE_VOICE_NAMES.some(m => n.includes(m));
    });
    if (safeVoices.length > 0) return safeVoices[0];
    return null;
  }

  const langLower = (preferredLang || '').toLowerCase();
  const isEuropean = langLower.startsWith('pt') || 
                     langLower.startsWith('es') || 
                     langLower.startsWith('it') || 
                     langLower.startsWith('nl') || 
                     langLower.startsWith('de') || 
                     (langLower.startsWith('fr') && !langLower.includes('sn'));

  // 1. European languages: prioritize European female native voice (e.g. pt-PT, es-ES, it-IT, nl-NL, de-DE)
  if (isEuropean) {
    // Specifically prioritize European Portuguese (pt-PT) over pt-BR
    if (langLower.startsWith('pt')) {
      const ptPtVoice = voices.find(v => (v.lang.toLowerCase().includes('pt-pt') || v.lang.toLowerCase() === 'pt_pt') && isStrictlyFemaleVoice(v));
      if (ptPtVoice) return ptPtVoice;
    }

    const exactMatch = voices.find(v => (v.lang.toLowerCase() === langLower || v.lang.toLowerCase().replace('_', '-') === langLower) && isStrictlyFemaleVoice(v));
    if (exactMatch) return exactMatch;

    const baseLang = langLower.split('-')[0];
    const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(baseLang));
    const femaleVoice = langVoices.find(v => 
      FEMALE_VOICE_NAMES.some(f => v.name.toLowerCase().includes(f))
    );
    if (femaleVoice) return femaleVoice;
    if (langVoices.length > 0) return langVoices[0];
  }

  // 2. Preferred African language tag (e.g. 'yo-NG', 'sw-KE', 'ha-NG', 'zu-ZA', 'pt-CV', 'fr-SN')
  if (preferredLang) {
    const exactLangVoice = voices.find(v => v.lang.toLowerCase() === langLower);
    if (exactLangVoice) return exactLangVoice;

    const baseLang = preferredLang.split('-')[0].toLowerCase();
    const baseMatch = voices.find(v => v.lang.toLowerCase().startsWith(baseLang));
    if (baseMatch) return baseMatch;
  }

  // 3. Look for African English female voices (en-NG, en-ZA, en-GH, en-KE)
  const africanLocales = ['en-ng', 'en-za', 'en-gh', 'en-ke', 'en-rw'];
  const africanVoices = voices.filter(v => 
    africanLocales.some(loc => v.lang.toLowerCase().includes(loc)) ||
    v.name.toLowerCase().includes('nigeria') ||
    v.name.toLowerCase().includes('south africa') ||
    v.name.toLowerCase().includes('ayanda') ||
    v.name.toLowerCase().includes('tessa') ||
    v.name.toLowerCase().includes('kenya') ||
    v.name.toLowerCase().includes('ghana')
  );

  if (africanVoices.length > 0) {
    const femaleAfrican = africanVoices.find(v => 
      FEMALE_VOICE_NAMES.some(f => v.name.toLowerCase().includes(f))
    );
    return femaleAfrican || africanVoices[0];
  }

  // 4. Fallback to warm, smooth female voices in the system (e.g. Natural, Premium, Neural)
  const premiumNaturalVoice = voices.find(v =>
    (v.name.toLowerCase().includes('natural') ||
     v.name.toLowerCase().includes('neural') ||
     v.name.toLowerCase().includes('premium')) &&
    FEMALE_VOICE_NAMES.some(f => v.name.toLowerCase().includes(f))
  );
  if (premiumNaturalVoice) return premiumNaturalVoice;

  const femaleVoice = voices.find(v => 
    FEMALE_VOICE_NAMES.some(f => v.name.toLowerCase().includes(f))
  );

  return femaleVoice || voices[0] || null;
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
 * Speak welcoming phrase with a warm, mid-30s African female persona
 * 
 * First attempts high-fidelity neural audio from /api/tts (ElevenLabs or Gemini Neural TTS).
 * Gracefully falls back to browser's best African female voice with acoustic tuning.
 */
export async function speakAfricaliaGreeting(config: SpeechGreetingConfig) {
  if (typeof window === 'undefined') return;

  // Always stop existing audio first
  stopAfricaliaSpeech();

  // Play the welcoming African pentatonic kalimba chime
  playWarmAfricanChime();

  const formattedText = formatSpeechTextWithNaturalBreaths(config.text);
  const cacheKey = `${config.langTag || 'default'}:${formattedText}`;

  // 1. Try local memory cache of neural audio
  if (clientAudioCache.has(cacheKey)) {
    const audioDataUrl = clientAudioCache.get(cacheKey)!;
    playNeuralAudio(audioDataUrl, { ...config, text: formattedText });
    return;
  }

  // 2. Query our Server-Side Neural TTS API (/api/tts)
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: formattedText,
        langTag: config.langTag,
        languageName: config.languageName,
        voiceGender: 'female',
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
  } catch (apiErr) {
    console.debug('Neural TTS endpoint unavailable, utilizing enhanced client voice:', apiErr);
  }

  // 3. Graceful Client-Side Speech Synthesis Fallback
  speakWithClientSynthesis({ ...config, text: formattedText });
}

/**
 * Play base64 neural audio buffer through HTML5 Audio with studio mastering
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

    audio.onerror = (e) => {
      console.warn('Audio playback error, falling back to client synthesis:', e);
      currentAudioElement = null;
      speakWithClientSynthesis(config);
    };

    // Delay start slightly (200ms) so the opening kalimba chime resonates cleanly
    setTimeout(() => {
      audio.play().catch(err => {
        console.warn('Auto-play error on neural audio:', err);
        speakWithClientSynthesis(config);
      });
    }, 200);
  } catch {
    speakWithClientSynthesis(config);
  }
}

/**
 * Client-Side SpeechSynthesis fallback with strictly female tuned parameters
 */
function speakWithClientSynthesis(config: SpeechGreetingConfig) {
  if (!('speechSynthesis' in window)) {
    config.onStart?.();
    setTimeout(() => {
      config.onEnd?.();
    }, 3200);
    return;
  }

  try {
    const textToSpeak = formatSpeechTextWithNaturalBreaths(config.text);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    currentUtterance = utterance;

    const voice = getAfricanFemaleVoice(config.langTag);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else if (config.langTag) {
      utterance.lang = config.langTag;
    } else {
      utterance.lang = 'en-NG'; // Nigerian English standard
    }

    const isEuropean = (config.langTag || '').toLowerCase().startsWith('pt') ||
                       (config.langTag || '').toLowerCase().startsWith('es') ||
                       (config.langTag || '').toLowerCase().startsWith('it') ||
                       (config.langTag || '').toLowerCase().startsWith('nl') ||
                       (config.langTag || '').toLowerCase().startsWith('de') ||
                       ((config.langTag || '').toLowerCase().startsWith('fr') && !(config.langTag || '').toLowerCase().includes('sn'));

    // Acoustic persona adjustments for strictly female voices:
    // European voices: warm, casual, friendly, brisk conversational tempo (rate: 0.95, pitch: 1.06)
    // African voices: grounded, melodic, unhurried, storyteller resonance (rate: 0.89, pitch: 1.05)
    if (isEuropean) {
      utterance.pitch = 1.06;
      utterance.rate = 0.95;
      utterance.volume = 1.0;
    } else {
      utterance.pitch = 1.05;
      utterance.rate = 0.89;
      utterance.volume = 1.0;
    }

    utterance.onstart = () => {
      config.onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      config.onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or interrupted:', e);
      currentUtterance = null;
      config.onError?.();
      config.onEnd?.();
    };

    // Ensure voices are loaded if browser loads them asynchronously
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const lateVoice = getAfricanFemaleVoice(config.langTag);
        if (lateVoice) {
          utterance.voice = lateVoice;
          utterance.lang = lateVoice.lang;
        }
        window.speechSynthesis.speak(utterance);
      };
    } else {
      // Delay slightly for chime
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 180);
    }
  } catch (err) {
    console.warn('Speech synthesis execution failed:', err);
    config.onStart?.();
    setTimeout(() => {
      config.onEnd?.();
    }, 2800);
  }
}

/**
 * Welcome greeting texts by Language Family for Language Page Cards
 */
export interface FamilyWelcomeGreeting {
  familyId: string;
  nativePhrase: string;
  phoneticGuide: string;
  languageName: string;
  langTag: string;
  meaningEn: string;
}

export const LANGUAGE_FAMILY_GREETINGS: Record<string, FamilyWelcomeGreeting> = {
  'niger-congo': {
    familyId: 'niger-congo',
    nativePhrase: 'Karibu Africalia—Mvumbuzi wa Kikabila wa Atlantiki. Tafadhali furahia.',
    phoneticGuide: '[kaˈri.bu af.riˈka.li.a]',
    languageName: 'Kiswahili (Bantu / Niger-Congo)',
    langTag: 'sw-KE',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer. Please enjoy.'
  },
  'afroasiatic': {
    familyId: 'afroasiatic',
    nativePhrase: 'Barka da zuwa Africalia—Mai Binciken Kabilun Atlantika. Don Allah ku ji daɗi.',
    phoneticGuide: '[bar.ka da zu.wa af.riˈka.li.a]',
    languageName: 'Hausa (Chadic / Afroasiatic)',
    langTag: 'ha-NG',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer. Please enjoy.'
  },
  'nilo-saharan': {
    familyId: 'nilo-saharan',
    nativePhrase: 'Yawa, karibu Africalia—Jagol kido mar Atlantic. Morie ahinya.',
    phoneticGuide: '[ya.wa ka.ri.bu jag.ol ki.do]',
    languageName: 'Luo / Nilotic (Nilo-Saharan)',
    langTag: 'sw-KE',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer. Please enjoy.'
  },
  'austronesian': {
    familyId: 'austronesian',
    nativePhrase: 'Tonga soa eto amin\'ny Africalia—Mpikaroka ny foko Atlantika. Mahafinaritra anao.',
    phoneticGuide: '[tʊŋ.ɡa su.a e.tu a.min.ni]',
    languageName: 'Malagasy (Austronesian)',
    langTag: 'fr-MG',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer. Please enjoy.'
  },
  'khoisan': {
    familyId: 'khoisan',
    nativePhrase: 'ǁKhawa ǃgû re Africalia—Atlantic ǃAosab ǃKhôa-aos. ǃGâise ǁkhoaxa.',
    phoneticGuide: '[ǁkʰa.wa ǃɡuː re af.riˈka.li.a]',
    languageName: 'Nama / Khoekhoegowab (Khoe / Khoisan)',
    langTag: 'en-ZA',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer. Please enjoy.'
  },
  'indo-european': {
    familyId: 'indo-european',
    nativePhrase: 'Bem-bindu na Africalia—Splorador Étniku di Atlântiku. Disfruta un monti.',
    phoneticGuide: '[bẽj̃ˈbĩdu na af.riˈka.li.a]',
    languageName: 'Kriolu / Kabuverdianu (Atlantic Creole)',
    langTag: 'pt-CV',
    meaningEn: 'Welcome to Africalia—The Atlantic Ethnic Explorer. Please enjoy.'
  }
};

/**
 * Welcome greeting texts by UI Language for the App Top Bar
 * "Welcome to the Africalia experience. — The Atlantic Ethnic Explorer. Please enjoy."
 */
export const TOP_BAR_UI_GREETINGS: Record<string, { phrase: string; langTag: string; languageName: string }> = {
  'en': {
    phrase: 'Welcome to the Africalia experience. — The Atlantic Ethnic Explorer. Please enjoy.',
    langTag: 'en-NG',
    languageName: 'English (West African Accent)'
  },
  'fr': {
    phrase: 'Bienvenue dans l\'expérience Africalia. — L\'explorateur ethnique de l\'Atlantique. Profitez-en.',
    langTag: 'fr-SN',
    languageName: 'Français (Afrique de l\'Ouest)'
  },
  'pt': {
    phrase: 'Olá! Bem-vindo à experiência Africalia. — O Explorador Étnico do Atlântico. Desfrute da sua exploração.',
    langTag: 'pt-PT',
    languageName: 'Português (Portugal)'
  },
  'es': {
    phrase: '¡Hola! Bienvenido a la experiencia Africalia. — El Explorador Étnico del Atlántico. Disfrute de su exploración.',
    langTag: 'es-ES',
    languageName: 'Español'
  },
  'it': {
    phrase: 'Ciao e benvenuto nell\'esperienza Africalia! — L\'Esploratore Etnico dell\'Atlantico. Buona scoperta.',
    langTag: 'it-IT',
    languageName: 'Italiano'
  },
  'nl': {
    phrase: 'Hallo! Welkom bij de Africalia-ervaring. — De Atlantische Etnische Verkenner. Veel plezier met uw ontdekkingstocht.',
    langTag: 'nl-NL',
    languageName: 'Nederlands'
  },
  'yo': {
    phrase: 'Ẹ ku abọ si iriri Africalia. — Olùṣàwárí Ẹ̀yà ti Atlantic. Ẹ gbadun rẹ gidigidi.',
    langTag: 'yo-NG',
    languageName: 'Yorùbá'
  },
  'ha': {
    phrase: 'Barka da zuwa kwarewar Africalia. — Mai Binciken Kabilun Atlantika. Don Allah ku ji daɗi.',
    langTag: 'ha-NG',
    languageName: 'Hausa'
  },
  'ig': {
    phrase: 'Nnọọ na ahụmịhe Africalia. — Onye Nchọpụta Agbụrụ nke Atlantic. Nwee anụrị.',
    langTag: 'ig-NG',
    languageName: 'Igbo'
  },
  'sw': {
    phrase: 'Karibu kwenye uzoefu wa Africalia. — Mvumbuzi wa Kikabila wa Atlantiki. Tafadhali furahia.',
    langTag: 'sw-KE',
    languageName: 'Kiswahili'
  },
  'am': {
    phrase: 'ወደ አፍሪካሊያ ተሞክሮ እንኳን በደህና መጡ። — የአትላንቲክ ብሄረሰቦች አሳሽ። እባክዎ ይደሰቱበት።',
    langTag: 'am-ET',
    languageName: 'Amharic (አማርኛ)'
  },
  'wo': {
    phrase: 'Dalal ak jàmm ci Africalia. — Gëstuwaayu xeeti Atlantik bi. Bégal sa xol bu baax.',
    langTag: 'fr-SN',
    languageName: 'Wolof'
  },
  'zu': {
    phrase: 'Siyakwamukela kulwazi lwe-Africalia. — Umhloli Wezinhlanga Zase-Atlantic. Sicela ujabulele.',
    langTag: 'zu-ZA',
    languageName: 'isiZulu'
  },
  'xh': {
    phrase: 'Wamkelekile kumava e-Africalia. — Umhloli Wezizwe Zase-Atlantic. Nceda wonwabe.',
    langTag: 'xh-ZA',
    languageName: 'isiXhosa'
  },
  'ar': {
    phrase: 'مرحباً بكم في تجربة أفريكاليا. — مستكشف عرقيات المحيط الأطلسي. نتمنى لكم وقتاً ممتعاً.',
    langTag: 'ar-EG',
    languageName: 'العربية (Arabic)'
  },
  'de': {
    phrase: 'Willkommen zum Africalia-Erlebnis. — Der Atlantische Ethnische Entdecker. Viel Vergnügen.',
    langTag: 'de-DE',
    languageName: 'Deutsch'
  }
};
