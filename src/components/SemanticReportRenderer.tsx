import React from 'react';
import { resolveDoi } from '../data/externalLinksRegistry';
import { ReportCitation } from '../data/reportsData';
import { BookOpen, ExternalLink } from 'lucide-react';

interface SemanticReportRendererProps {
  content: string;
  citations: ReportCitation[];
  className?: string;
  onCitationClick?: (citationId: string) => void;
}

/**
 * Renders report & working paper markdown, supporting:
 * - Semantic [REF:id|Label] interactive citation chips with hover tooltips and DOI resolution
 * - Markdown tables (| Col 1 | Col 2 |)
 * - Fenced code blocks (``` ... ```) for equations, structural models, and counterfactuals
 * - Subheadings (##, ###, ####)
 * - Unordered and ordered lists (*, -, 1.)
 * - Blockquotes (> ...)
 * - Inline **bold**, *italic*, and `code` formatting
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

  /**
   * Renders inline text containing [REF:id|label], **bold**, *italic*, and `inline code`
   */
  const renderInline = (text: string, keyPrefix: string): React.ReactNode => {
    // First split by [REF:...] tags
    const refRegex = /\[REF:([^|\]]+)(?:\|([^\]]+))?\]/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    const formatBasicInline = (segment: string, segKey: string): React.ReactNode => {
      // Split by `code`, **bold**, *italic*
      const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
      const parts = segment.split(tokenRegex);
      if (parts.length === 1) return segment;

      return parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code
              key={`${segKey}-c-${i}`}
              className="px-1.5 py-0.5 mx-0.5 text-[0.88em] font-mono bg-stone-100 dark:bg-zinc-800 text-stone-800 dark:text-stone-200 rounded border border-stone-200/80 dark:border-zinc-700"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return (
            <strong key={`${segKey}-b-${i}`} className="font-bold text-stone-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return (
            <em key={`${segKey}-i-${i}`} className="italic text-stone-800 dark:text-stone-200">
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      });
    };

    while ((match = refRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const plain = text.slice(lastIndex, match.index);
        nodes.push(formatBasicInline(plain, `${keyPrefix}-t-${lastIndex}`));
      }

      const citId = match[1];
      const label = match[2] || match[1];
      const cit = citId ? citationMap.get(citId) : undefined;

      nodes.push(
        <span
          key={`${keyPrefix}-ref-${match.index}`}
          translate="no"
          className="notranslate relative inline-flex items-center group mx-1 select-none align-baseline"
        >
          <button
            type="button"
            onClick={() => {
              if (citId && onCitationClick) {
                onCitationClick(citId);
              } else {
                const el = document.getElementById(citId || 'sec-bibliography');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.classList.add('ring-2', 'ring-amber-500', 'transition-all');
                  setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 2500);
                }
              }
            }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold font-tabular bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 hover:bg-amber-200 dark:hover:bg-amber-900 transition-all cursor-pointer shadow-2xs"
            title={cit ? `${cit.authors} (${cit.year}): ${cit.title}` : `Citation: ${label}`}
          >
            <BookOpen className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
            <span className="tracking-tight">{label || 'REF'}</span>
          </button>

          {cit && (
            <span
              translate="no"
              className="notranslate pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col w-64 p-2.5 rounded-xl bg-zinc-900 text-zinc-100 text-[11px] shadow-xl border border-zinc-700 z-50 animate-in fade-in zoom-in-95"
            >
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

      lastIndex = refRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      nodes.push(formatBasicInline(text.slice(lastIndex), `${keyPrefix}-end`));
    }

    return nodes;
  };

  /**
   * Parses markdown block structures (code blocks, tables, headings, lists, paragraphs)
   */
  const blocks = React.useMemo(() => {
    const lines = content.split('\n');
    const parsedBlocks: Array<
      | { type: 'code'; code: string }
      | { type: 'table'; headers: string[]; rows: string[][] }
      | { type: 'heading'; level: number; text: string }
      | { type: 'ul'; items: string[] }
      | { type: 'ol'; items: string[] }
      | { type: 'blockquote'; text: string }
      | { type: 'paragraph'; text: string }
    > = [];

    let i = 0;
    while (i < lines.length) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed) {
        i++;
        continue;
      }

      // 1. Fenced code block (```)
      if (trimmed.startsWith('```')) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        parsedBlocks.push({ type: 'code', code: codeLines.join('\n') });
        continue;
      }

      // 2. Markdown Table (| ... |)
      if (trimmed.startsWith('|') && trimmed.endsWith('|') && i + 1 < lines.length && /^\s*\|[\s\-:|]+\|\s*$/.test(lines[i + 1])) {
        const parseRow = (rowStr: string) =>
          rowStr
            .trim()
            .replace(/^\||\|$/g, '')
            .split('|')
            .map(c => c.trim());

        const headers = parseRow(trimmed);
        i += 2; // skip header and separator line
        const rows: string[][] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          rows.push(parseRow(lines[i]));
          i++;
        }
        parsedBlocks.push({ type: 'table', headers, rows });
        continue;
      }

      // 3. Subheadings (##, ###, ####)
      const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
      if (headingMatch) {
        parsedBlocks.push({
          type: 'heading',
          level: headingMatch[1].length,
          text: headingMatch[2].trim()
        });
        i++;
        continue;
      }

      // 4. Blockquote (> ...)
      if (trimmed.startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        parsedBlocks.push({ type: 'blockquote', text: quoteLines.join(' ') });
        continue;
      }

      // 5. Unordered List (* or -)
      if (/^[-*]\s+/.test(trimmed)) {
        const items: string[] = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
          i++;
        }
        parsedBlocks.push({ type: 'ul', items });
        continue;
      }

      // 6. Ordered List (1. or 1\.)
      if (/^\d+\\?\.\s+/.test(trimmed)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\\?\.\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\\?\.\s+/, ''));
          i++;
        }
        parsedBlocks.push({ type: 'ol', items });
        continue;
      }

      // 7. Standard Paragraph (collect consecutive non-special lines)
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].trim().startsWith('```') &&
        !lines[i].trim().startsWith('|') &&
        !/^#{2,4}\s+/.test(lines[i].trim()) &&
        !lines[i].trim().startsWith('>') &&
        !/^[-*]\s+/.test(lines[i].trim()) &&
        !/^\d+\\?\.\s+/.test(lines[i].trim())
      ) {
        paraLines.push(lines[i].trim());
        i++;
      }
      if (paraLines.length > 0) {
        parsedBlocks.push({ type: 'paragraph', text: paraLines.join(' ') });
      } else {
        i++;
      }
    }

    return parsedBlocks;
  }, [content]);

  return (
    <div className={`space-y-4 editorial-reading-lane font-serif-book type-body-editorial text-stone-800 dark:text-stone-200 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'code') {
          return (
            <pre
              key={bIdx}
              className="my-5 p-4 rounded-xl bg-stone-900 dark:bg-zinc-950 text-amber-100 font-mono text-xs sm:text-sm overflow-x-auto border border-stone-800 shadow-inner leading-relaxed"
            >
              <code>{block.code}</code>
            </pre>
          );
        }

        if (block.type === 'table') {
          return (
            <div key={bIdx} className="my-6 overflow-x-auto rounded-xl border border-stone-200 dark:border-zinc-800 shadow-2xs">
              <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-100/90 dark:bg-zinc-900 border-b border-stone-200 dark:border-zinc-800">
                    {block.headers.map((h, hIdx) => (
                      <th
                        key={hIdx}
                        className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-stone-600 dark:text-zinc-400"
                      >
                        {renderInline(h, `th-${bIdx}-${hIdx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/60 dark:divide-zinc-800/70 bg-white dark:bg-zinc-900/40">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-stone-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-3 px-4 text-stone-700 dark:text-stone-300 align-top leading-relaxed">
                          {renderInline(cell, `td-${bIdx}-${rIdx}-${cIdx}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'heading') {
          if (block.level === 2) {
            return (
              <h3 key={bIdx} className="text-lg sm:text-xl font-bold font-sans text-stone-900 dark:text-white pt-4 pb-1 tracking-tight">
                {renderInline(block.text, `h2-${bIdx}`)}
              </h3>
            );
          }
          return (
            <h4 key={bIdx} className="text-base font-bold font-sans text-stone-800 dark:text-stone-200 pt-3 pb-0.5">
              {renderInline(block.text, `h3-${bIdx}`)}
            </h4>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote
              key={bIdx}
              className="pl-4 py-1 my-4 border-l-3 border-amber-500 italic text-stone-700 dark:text-stone-300 bg-amber-50/40 dark:bg-amber-950/20 rounded-r-lg"
            >
              {renderInline(block.text, `bq-${bIdx}`)}
            </blockquote>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={bIdx} className="list-disc pl-6 space-y-2 my-3 marker:text-amber-600 dark:marker:text-amber-400">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="leading-[1.75] text-pretty pl-1">
                  {renderInline(item, `ul-${bIdx}-${iIdx}`)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={bIdx} className="list-decimal pl-6 space-y-2 my-3 marker:font-mono marker:font-bold marker:text-stone-500 dark:marker:text-zinc-400">
              {block.items.map((item, iIdx) => (
                <li key={iIdx} className="leading-[1.75] text-pretty pl-1">
                  {renderInline(item, `ol-${bIdx}-${iIdx}`)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={bIdx} className="mt-4 first:mt-0 leading-[1.80] text-pretty">
            {renderInline(block.text, `p-${bIdx}`)}
          </p>
        );
      })}
    </div>
  );
};
