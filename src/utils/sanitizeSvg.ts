/**
 * DOM-backed SVG sanitizer for user-uploaded or pasted SVG markup.
 * Strips executable scripts, foreignObject/iframe/object/embed/style elements,
 * SMIL animations targeting href/on* attributes, inline on* handlers, and
 * javascript:/vbscript:/data:text/html URIs while preserving vector geometry.
 */
const DISALLOWED_TAGS = new Set([
  'script',
  'foreignobject',
  'iframe',
  'object',
  'embed',
  'applet',
  'meta',
  'style'
]);

const SMIL_ANIMATION_TAGS = new Set([
  'animate',
  'animatetransform',
  'animatemotion',
  'set'
]);

const URI_ATTRS = new Set(['href', 'xlink:href', 'src', 'action', 'formaction']);

const SMIL_VALUE_ATTRS = ['values', 'from', 'to', 'by'];

function sanitizeInlineStyleValue(rawStyle: string): string {
  if (!rawStyle || typeof rawStyle !== 'string') return '';
  const withoutComments = rawStyle.replace(/\/\*[\s\S]*?\*\//g, '');
  const declarations = withoutComments.split(';');
  const safeDeclarations: string[] = [];

  for (const decl of declarations) {
    const trimmed = decl.trim();
    if (!trimmed || !trimmed.includes(':')) continue;

    const compact = trimmed.replace(/[\u0000-\u0020]+/g, '').toLowerCase();
    if (
      compact.includes('expression(') ||
      compact.includes('-moz-binding') ||
      compact.includes('javascript:') ||
      compact.includes('vbscript:')
    ) {
      continue;
    }

    let hasExternalUrl = false;
    trimmed.replace(/url\s*\(\s*(['"]?)([\s\S]*?)\1\s*\)/gi, (_m, _quote, inner: string) => {
      const target = inner.replace(/[\u0000-\u0020]+/g, '');
      if (!target.startsWith('#')) {
        hasExternalUrl = true;
      }
      return '';
    });

    if (
      !hasExternalUrl &&
      /url\s*\(/i.test(trimmed) &&
      !/url\s*\(\s*(['"]?)#[^)'"]+\1\s*\)/i.test(trimmed)
    ) {
      hasExternalUrl = true;
    }

    if (hasExternalUrl) {
      continue;
    }

    safeDeclarations.push(trimmed);
  }

  return safeDeclarations.join('; ');
}

function isUnsafeUri(value: string, tagName = ''): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  const compact = trimmed.replace(/[\u0000-\u0020]+/g, '').toLowerCase();
  if (compact.startsWith('#')) return false;
  if ((compact.startsWith('./') || compact.startsWith('/')) && !compact.startsWith('//')) {
    return false;
  }
  if (/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=]+$/i.test(compact)) {
    return false;
  }
  if (tagName === 'a' && (compact.startsWith('https://') || compact.startsWith('http://'))) {
    return false;
  }
  return true;
}

export interface SanitizeSvgOptions {
  preserveStyleElement?: boolean;
}

function sanitizeSvgStyleSheet(rawCss: string): string {
  if (!rawCss || typeof rawCss !== 'string') return '';
  return rawCss
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@import\b[^;]*(?:;|$)/gi, '')
    .replace(/expression\s*\([^)]*\)/gi, '')
    .replace(/-moz-binding\s*:[^;]*(?:;|$)/gi, '')
    .replace(/url\s*\(\s*(['"]?)(?!#)[^)]*\1\s*\)/gi, 'none')
    .trim();
}

export function sanitizeSvgMarkup(rawMarkup: string, options: SanitizeSvgOptions = {}): string {
  if (!rawMarkup || typeof rawMarkup !== 'string') return '';
  const preserveStyleElement = Boolean(options.preserveStyleElement);

  if (typeof DOMParser !== 'undefined' && typeof XMLSerializer !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawMarkup, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      const root = doc.documentElement;

      if (!parserError && root && root.localName.toLowerCase() === 'svg') {
        const toRemove: Element[] = [];
        const walk = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        let node = walk.currentNode as Element | null;

        while (node) {
          const tag = (node.localName || node.tagName || '').toLowerCase();
          if (tag === 'style' && preserveStyleElement) {
            node.textContent = sanitizeSvgStyleSheet(node.textContent || '');
          } else if (DISALLOWED_TAGS.has(tag)) {
            toRemove.push(node);
          } else if (SMIL_ANIMATION_TAGS.has(tag)) {
            const targetAttr = (node.getAttribute('attributeName') || '').trim().toLowerCase();
            if (
              targetAttr === 'href' ||
              targetAttr === 'xlink:href' ||
              targetAttr === 'style' ||
              targetAttr.startsWith('on') ||
              node.hasAttribute('href') ||
              node.hasAttribute('xlink:href')
            ) {
              toRemove.push(node);
            } else {
              for (const valAttr of SMIL_VALUE_ATTRS) {
                const attrVal = node.getAttribute(valAttr);
                if (attrVal && /url\s*\(/i.test(attrVal)) {
                  node.removeAttribute(valAttr);
                }
              }
            }
          }

          if (!toRemove.includes(node)) {
            const attrs = Array.from(node.attributes);
            for (const attr of attrs) {
              const nameLower = attr.name.toLowerCase();
              const localLower = (attr.localName || attr.name).toLowerCase();
              if (localLower.startsWith('on')) {
                node.removeAttribute(attr.name);
              } else if (localLower === 'style') {
                const safeStyle = sanitizeInlineStyleValue(attr.value);
                if (safeStyle) {
                  node.setAttribute(attr.name, safeStyle);
                } else {
                  node.removeAttribute(attr.name);
                }
              } else if (URI_ATTRS.has(nameLower) || URI_ATTRS.has(localLower)) {
                if (isUnsafeUri(attr.value, tag)) {
                  node.setAttribute(attr.name, '#');
                }
              }
            }
          }

          node = walk.nextNode() as Element | null;
        }

        for (const el of toRemove) {
          el.parentNode?.removeChild(el);
        }

        return new XMLSerializer().serializeToString(root).trim();
      }
    } catch {
      // Fall through to strengthened regex fallback
    }
  }

  // Regex fallback when DOMParser is unavailable or input XML is malformed
  let sanitized = rawMarkup
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*\/\s*>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<(iframe|object|embed|applet|meta)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|applet|meta)[^>]*\/\s*>/gi, '');

  if (!preserveStyleElement) {
    sanitized = sanitized
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<style[^>]*\/\s*>/gi, '');
  } else {
    sanitized = sanitized.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi, (_m, attrs: string, css: string) => {
      const cleanCss = sanitizeSvgStyleSheet(css);
      return cleanCss ? `<style${attrs}>${cleanCss}</style>` : '';
    });
  }

  sanitized = sanitized
    .replace(/<(animate|animateTransform|animateMotion|set)\b[^>]*attributeName\s*=\s*["']\s*(?:(?:xlink:)?href|style|on[a-z]+)\s*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(animate|animateTransform|animateMotion|set)\b[^>]*attributeName\s*=\s*["']\s*(?:(?:xlink:)?href|style|on[a-z]+)\s*["'][^>]*\/?>/gi, '')
    .replace(/(<(?:animate|animateTransform|animateMotion|set)\b[^>]*?)\s(?:values|from|to|by)\s*=\s*(?:"[^"]*url\s*\([^"]*"|'[^']*url\s*\([^']*')([^>]*>)/gi, '$1$2');

  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  sanitized = sanitized.replace(
    /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi,
    (_match, dblVal: string | undefined, sglVal: string | undefined) => {
      const rawStyle = dblVal ?? sglVal ?? '';
      const safeStyle = sanitizeInlineStyleValue(rawStyle);
      if (!safeStyle) return '';
      const quote = dblVal !== undefined ? '"' : "'";
      return ` style=${quote}${safeStyle}${quote}`;
    }
  );

  sanitized = sanitized.replace(
    /(\s(?:xlink:)?(?:href|src|action|formaction)\s*=\s*["'])\s*(?:(?:javascript|vbscript):|\/\/|data:(?!image\/(?:png|jpeg|jpg|webp|gif);base64,))[^"']*(["'])/gi,
    '$1#$2'
  );

  return sanitized.trim();
}
