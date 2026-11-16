/**
 * Lightweight SVG sanitizer for user-uploaded or pasted SVG markup.
 * Strips executable scripts, foreignObject/iframe/object/embed tags,
 * inline on* event handlers, and javascript: URIs while preserving
 * all vector paths, gradients, groups, metadata, styles, and typography.
 */
export function sanitizeSvgMarkup(rawMarkup: string): string {
  if (!rawMarkup) return '';

  // Remove active script/embed/foreignObject elements (case-insensitive)
  let sanitized = rawMarkup
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<script[^>]*\/\s*>/gi, '')
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<(iframe|object|embed|applet|meta)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|applet|meta)[^>]*\/\s*>/gi, '');

  // Strip inline DOM event handlers (onload=, onclick=, onmouseover=, etc.)
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // Neutralize javascript: or vbscript: URIs in href/xlink:href/src attributes
  sanitized = sanitized.replace(
    /(\s(?:xlink:)?(?:href|src)\s*=\s*["'])\s*(?:javascript|vbscript|data:text\/html):[^"']*(["'])/gi,
    '$1#$2'
  );

  return sanitized.trim();
}
