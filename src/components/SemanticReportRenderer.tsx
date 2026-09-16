import React from 'react';
import { resolveDoi, SAFE_EXTERNAL_LINK_PROPS } from '../data/externalLinksRegistry';
import { ReportCitation } from '../data/reportsData';
import { BookOpen, ExternalLink } from 'lucide-react';

interface SemanticReportRendererProps {
  content: string;
  citations: ReportCitation[];
  className?: string;
  onCitationClick?: (citationId: string) => void;
}

/**
 * Renders report markdown or text, detecting semantic [REF:id|Label] tags
 * and transforming them into interactive citation chips with hover tooltips
 * and direct DOI resolution.
 */
export const SemanticReportRenderer: React.FC<SemanticReportRendererProps> = ({
  content,
  citations,
  className = '',
  onCitationClick
}) => {
  const citationMap = React.useMemo(() => {
    const map = new Map<string, ReportCitation>();
    citations.forEach(c => map.set(c.id, c));
    return map;
  }, [citations]);

  // Matches [REF:id|label] or [REF:id]
  const parts = React.useMemo(() => {
    const regex = /\[REF:([^|\]]+)(?:\|([^\]]+))?\]/g;
    const tokens: Array<{ type: 'text' | 'ref'; text: string; citId?: string; label?: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          text: content.slice(lastIndex, match.index)
        });
      }

      tokens.push({
        type: 'ref',
        text: match[0],
        citId: match[1],
        label: match[2] || match[1]
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      tokens.push({
        type: 'text',
        text: content.slice(lastIndex)
      });
    }

    return tokens;
  }, [content]);

  // Split paragraphs if pure text
  return (
    <div className={`space-y-4 ${className}`}>
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          // Render text with line breaks
          const paragraphs = part.text.split(/\n\n+/);
          if (paragraphs.length > 1) {
            return (
              <React.Fragment key={idx}>
                {paragraphs.map((para, pIdx) => (
                  <span key={pIdx} className="block mt-3 first:mt-0">
                    {para}
                  </span>
                ))}
              </React.Fragment>
            );
          }
          return <span key={idx}>{part.text}</span>;
        }

        const cit = part.citId ? citationMap.get(part.citId) : undefined;

        return (
          <span key={idx} className="relative inline-flex items-center group mx-1 select-none">
            <button
              type="button"
              onClick={() => {
                if (part.citId && onCitationClick) {
                  onCitationClick(part.citId);
                } else {
                  // Jump to bibliography section
                  const el = document.getElementById(part.citId || 'sec-bibliography');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('ring-2', 'ring-amber-500', 'transition-all');
                    setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 2500);
                  }
                }
              }}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 hover:bg-amber-200 dark:hover:bg-amber-900 transition-all cursor-pointer shadow-2xs"
              title={cit ? `${cit.authors} (${cit.year}): ${cit.title}` : `Citation: ${part.label}`}
            >
              <BookOpen className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
              <span>{part.label || 'REF'}</span>
            </button>

            {/* Hover preview tooltip */}
            {cit && (
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col w-64 p-2.5 rounded-xl bg-zinc-900 text-zinc-100 text-[11px] shadow-xl border border-zinc-700 z-50 animate-in fade-in zoom-in-95">
                <span className="font-bold text-amber-300">{cit.authors} ({cit.year})</span>
                <span className="text-zinc-300 italic text-[10px] mt-0.5">{cit.title}</span>
                <span className="text-zinc-400 text-[10px]">{cit.journalOrPublisher}</span>
                {cit.doiOrUrl && (
                  <span className="mt-1 pt-1 border-t border-zinc-800 text-[9.5px] font-mono text-emerald-400 flex items-center gap-1">
                    <span>DOI: {resolveDoi(cit.doiOrUrl).replace('https://doi.org/', '')}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                )}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};
