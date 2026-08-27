import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/types';
import { Globe, Check, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, currentLanguageOption, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`} id="app-language-selector">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-xs font-medium text-zinc-200 hover:text-white transition-all cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold">{currentLanguageOption.nativeName}</span>
        <span className="text-[10px] text-zinc-400 font-mono uppercase bg-zinc-800 px-1.5 py-0.5 rounded-sm">
          {currentLanguageOption.code}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100 max-h-80 overflow-y-auto">
          <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-zinc-400 border-b border-zinc-800/80 mb-1">
            Display Language / ቋንቋ / لغة
          </div>
          {availableLanguages.map(opt => {
            const isSelected = opt.code === language;
            return (
              <button
                key={opt.code}
                onClick={() => handleSelectLanguage(opt.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{opt.nativeName}</span>
                  <span className="text-[11px] text-zinc-400">({opt.name})</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
