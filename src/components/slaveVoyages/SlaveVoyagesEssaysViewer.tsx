/**
 * SlaveVoyagesEssaysViewer.tsx
 * Scholarly Reading Room for Authoritative Historiographical Essays
 * Built with Museum & Editorial aesthetics, drop caps, Chicago citations, and pull quotes.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  User,
  Quote,
  FileText,
  ChevronRight,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import { SLAVEVOYAGES_ESSAYS, SlaveVoyagesEssay } from '../../data/slaveVoyagesEssays';

export const SlaveVoyagesEssaysViewer: React.FC = () => {
  const [selectedEssayId, setSelectedEssayId] = useState<string>(SLAVEVOYAGES_ESSAYS[0].id);

  const activeEssay = SLAVEVOYAGES_ESSAYS.find(e => e.id === selectedEssayId) || SLAVEVOYAGES_ESSAYS[0];

  return (
    <div className="bg-[#faf8f5] dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Archival Header */}
      <div className="p-5 sm:p-7 border-b border-stone-200 dark:border-stone-800 bg-[#f5f0e6]/70 dark:bg-stone-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-stone-500 dark:text-stone-400">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Consortium Monograph Library · Canonical Essays</span>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span className="text-amber-800 dark:text-amber-400 font-mono">Peer-Reviewed Historiography</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-1.5">
              Introduction Essays & Historical Context
            </h2>
            <p className="text-xs sm:text-sm font-serif text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
              Authoritative scholarship from leading Atlantic historians explaining the demographic scale, regional African geography, Middle Passage physiology, and shipboard resistance.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 rounded-lg bg-white/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs font-serif text-stone-700 dark:text-stone-300">
              {SLAVEVOYAGES_ESSAYS.length} Monograph Chapters
            </span>
          </div>
        </div>

        {/* Chapter Navigation Rail (Single-line controls with responsive overflow) */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SLAVEVOYAGES_ESSAYS.map((essay, idx) => {
            const isSelected = essay.id === activeEssay.id;
            return (
              <button
                key={essay.id}
                onClick={() => setSelectedEssayId(essay.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-serif whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-800 text-amber-50 border-amber-900 shadow-2xs font-semibold'
                    : 'bg-white/80 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                }`}
              >
                <span className={`text-[10px] font-mono ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                  0{idx + 1}.
                </span>
                <span className="truncate max-w-[200px] sm:max-w-[260px]">
                  {essay.title.split(':')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Essay Reading Canvas */}
      <div className="p-6 sm:p-10 lg:p-14 max-w-4xl mx-auto">
        {/* Curatorial Attribution Block */}
        <div className="border-b border-stone-200 dark:border-stone-800 pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-stone-500 dark:text-stone-400 mb-3">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-medium text-stone-800 dark:text-stone-200">{activeEssay.author}</span>
            </div>
            <span>·</span>
            <div>{activeEssay.authorTitle}</div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{activeEssay.readingTimeMin} min read</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Era: {activeEssay.periodCovered}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50 leading-tight">
            {activeEssay.title}
          </h1>
          <p className="text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-400 mt-2">
            {activeEssay.subtitle}
          </p>
        </div>

        {/* Primary Pull Quote */}
        <div className="my-8 py-6 px-7 bg-[#f5f0e6]/60 dark:bg-stone-900/60 border-l-4 border-amber-700 rounded-r-xl">
          <p className="text-lg sm:text-xl font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
            "{activeEssay.pullQuote}"
          </p>
          <div className="mt-3 text-xs font-sans uppercase tracking-wider text-stone-500">
            — Key Historiographical Invariant
          </div>
        </div>

        {/* Lead Paragraph with Elegant Initial Drop Cap */}
        <div className="mb-8">
          <p className="text-base sm:text-lg font-serif leading-relaxed text-stone-800 dark:text-stone-200 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:text-amber-800 dark:first-letter:text-amber-500">
            {activeEssay.leadParagraph}
          </p>
        </div>

        {/* Essay Body Sections */}
        <div className="space-y-10">
          {activeEssay.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
                {section.heading}
              </h2>

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-base font-serif leading-relaxed text-stone-700 dark:text-stone-300">
                  {p}
                </p>
              ))}

              {/* Quantitative Figure Callout if Present */}
              {section.figure && (
                <div className="my-6 p-4 sm:p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-sans uppercase tracking-wider text-stone-500">
                      {section.figure.statLabel}
                    </div>
                    <div className="text-xs font-serif text-stone-600 dark:text-stone-400 mt-0.5">
                      {section.figure.caption}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-800 dark:text-amber-400 tabular-nums shrink-0">
                    {section.figure.statValue}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Sources, Notes & Citations Section */}
        <div className="mt-14 pt-8 border-t-2 border-stone-300 dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-stone-500 mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Authoritative Archival Citations & Bibliography</span>
          </div>

          <div className="text-xs font-serif text-stone-600 dark:text-stone-400 mb-4 italic">
            Citation: {activeEssay.citation}
          </div>

          <ul className="space-y-2 text-xs font-serif text-stone-600 dark:text-stone-400 list-disc list-inside">
            {activeEssay.sourcesAndFootnotes.map((src, srcIdx) => (
              <li key={srcIdx} className="leading-relaxed">
                {src}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
