import { SupportedLanguage } from '../i18n/types';

/**
 * Mapping of Africalia supported languages to standard translation target codes.
 */
const TRANSLATION_CODE_MAP: Record<SupportedLanguage, string> = {
  en: 'en',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
  es: 'es',
  it: 'it',
  nl: 'nl',
  ar: 'ar',
  am: 'am', // Amharic
  ha: 'ha', // Hausa
  ig: 'ig', // Igbo
  wo: 'wo', // Wolof
  xh: 'xh', // Xhosa
  yo: 'yo', // Yoruba
  zu: 'zu'  // Zulu
};

// Cookie management helper for Google Translate
function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // Set for current hostname, root path, and same-site
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  // Also set with explicit domain if on a subdomain
  const domainParts = window.location.hostname.split('.');
  if (domainParts.length > 1) {
    const rootDomain = domainParts.slice(-2).join('.');
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; domain=.${rootDomain}; path=/; SameSite=Lax`;
  }
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  const domainParts = window.location.hostname.split('.');
  if (domainParts.length > 1) {
    const rootDomain = domainParts.slice(-2).join('.');
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.${rootDomain}; path=/; SameSite=Lax`;
  }
}

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
    __africaliaTranslationInitialized?: boolean;
  }
}

/**
 * Initializes Google Translate client script cleanly without unwanted UI banners.
 */
export function initNativeTranslationEngine(): void {
  if (typeof window === 'undefined' || window.__africaliaTranslationInitialized) {
    return;
  }

  window.__africaliaTranslationInitialized = true;

  // Define global init callback
  window.googleTranslateElementInit = function () {
    try {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            autoDisplay: false,
            multilanguagePage: true,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      }
    } catch {
      // Ignore initialization errors
    }
  };

  // Create hidden anchor element if not already present
  if (!document.getElementById('google_translate_element')) {
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.style.display = 'none';
    translateDiv.setAttribute('aria-hidden', 'true');
    translateDiv.setAttribute('translate', 'no');
    translateDiv.className = 'notranslate';
    document.body.appendChild(translateDiv);
  }

  // Inject script asynchronously if not already in document
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      // Offline fallback: system continues smoothly without throwing unhandled exceptions
    };
    document.head.appendChild(script);
  }
}

/**
 * Triggers full in-memory translation for the application and all research monographs.
 */
export function syncNativeTranslation(targetLang: SupportedLanguage): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const targetCode = TRANSLATION_CODE_MAP[targetLang] || 'en';
  const root = document.documentElement;

  // 1. Synchronize HTML attributes & direction
  root.lang = targetCode;
  const isRTL = targetLang === 'ar';
  root.dir = isRTL ? 'rtl' : 'ltr';
  if (isRTL) {
    root.classList.add('rtl-mode');
  } else {
    root.classList.remove('rtl-mode');
  }

  // 2. Manage googtrans cookie
  if (targetCode === 'en') {
    deleteCookie('googtrans');
    deleteCookie('googtrans_en');
  } else {
    const cookieValue = `/en/${targetCode}`;
    setCookie('googtrans', cookieValue);
  }

  // 3. Trigger Google Translate combo box if present in DOM
  try {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = targetCode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } catch {
    // Ignore DOM dispatch errors
  }

  // 4. Dispatch custom event for custom components listening to language changes
  try {
    window.dispatchEvent(
      new CustomEvent('africalia-language-changed', {
        detail: { language: targetLang, code: targetCode, isRTL }
      })
    );
  } catch {
    // Ignore event dispatch errors
  }
}
