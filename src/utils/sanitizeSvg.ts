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

function isUnsafeUri(value: string): boolean {
  const normalized = value.replace(/[\u0000-\u0020]+/g, '').toLowerCase();
  return (
    normalized.startsWith('javascript:') ||
    normalized.startsWith('vbscript:') ||
    normalized.startsWith('data:text/html')
  );
}

export function sanitizeSvgMarkup(rawMarkup: string): string {
  if (!rawMarkup || typeof rawMarkup !== 'string') return '';

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
          if (DISALLOWED_TAGS.has(tag)) {
            toRemove.push(node);
          } else if (SMIL_ANIMATION_TAGS.has(tag)) {
            const targetAttr = (node.getAttribute('attributeName') || '').trim().toLowerCase();
            if (
              targetAttr === 'href' ||
              targetAttr === 'xlink:href' ||
              targetAttr.startsWith('on') ||
              node.hasAttribute('href') ||
              node.hasAttribute('xlink:href')
            ) {
              toRemove.push(node);
            }
          }

          if (!toRemove.includes(node)) {
            const attrs = Array.from(node.attributes);
            for (const attr of attrs) {
              const nameLower = attr.name.toLowerCase();
              const localLower = (attr.localName || attr.name).toLowerCase();
              if (localLower.startsWith('on')) {
                node.removeAttribute(attr.name);
              } else if (URI_ATTRS.has(nameLower) || URI_ATTRS.has(localLower)) {
                if (isUnsafeUri(attr.value)) {
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
    .replace(/<(iframe|object|embed|applet|meta|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|applet|meta|style)[^>]*\/\s*>/gi, '')
    .replace(/<(animate|animateTransform|animateMotion|set)\b[^>]*attributeName\s*=\s*["']\s*(?:xlink:)?href\s*["'][^>]*\/?>/gi, '');

  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  sanitized = sanitized.replace(
    /(\s(?:xlink:)?(?:href|src|action|formaction)\s*=\s*["'])\s*(?:javascript|vbscript|data:text\/html):[^"']*(["'])/gi,
    '$1#$2'
  );

  return sanitized.trim();
}
