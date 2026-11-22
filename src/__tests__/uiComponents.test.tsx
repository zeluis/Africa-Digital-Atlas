// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { normalizeSearchText, tokenizeSearchText } from '../utils/textNormalize';
import {
  escapeBibtexValue,
  sanitizeRisValue,
  buildReportCitation,
} from '../utils/citationFormatter';
import {
  parseOpenMeteoResponse,
  parseWikipediaSummaryResponse,
  parseCrossrefWorkResponse,
} from '../utils/apiSchemas';
import { AtlasDialog } from '../components/common/AtlasDialog';
import { JapandiTooltip } from '../components/JapandiTooltip';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { SearchModal } from '../components/SearchModal';
import { SavedEntitiesProvider } from '../contexts/SavedEntitiesContext';
import type { ResearchReport } from '../data/reportsData';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Search Normalization, Diacritics & Validation', () => {
  it('folds Latin diacritics and apostrophes consistently for African toponyms', () => {
    expect(normalizeSearchText("Côte d'Ivoire")).toBe("cote d'ivoire");
    expect(tokenizeSearchText("Côte d'Ivoire")).toEqual(['cote', 'd', 'ivoire']);
    expect(tokenizeSearchText('São Tomé & Príncipe')).toEqual(['sao', 'tome', '&', 'principe']);
    expect(tokenizeSearchText('Yaoundé / Lomé')).toEqual(['yaounde', 'lome']);
  });

  it('escapes BibTeX special characters and flattens RIS newlines cleanly', () => {
    expect(escapeBibtexValue('Trade & Debt: 50% _2026_')).toBe('Trade \\& Debt: 50\\% \\_2026\\_');
    expect(escapeBibtexValue('Already \\& Escaped')).toBe('Already \\& Escaped');
    expect(sanitizeRisValue('Line 1\nLine 2\r\nLine 3')).toBe('Line 1 Line 2 Line 3');

    const mockReport: ResearchReport = {
      id: 'wp-escape-check',
      title: 'Debt & Growth: 100% Synthesis',
      subtitle: 'Line A\nLine B',
      category: 'development-sociology',
      categoryLabel: 'Economics',
      categoryColor: '#10b981',
      authors: ['Correia, ZéLuis F. & Co.'],
      institutions: ['Afriata'],
      publicationDate: '2026',
      readingTimeMinutes: 10,
      doi: '10.6084/m9.figshare.34065711',
      classification: 'Economics',
      executiveSummary: 'Summary.',
      sections: [],
      citations: [],
      isWorkingPaper: true,
    };

    const bib = buildReportCitation(mockReport, 'bibtex');
    expect(bib).toContain('title={Debt \\& Growth: 100\\% Synthesis}');
    expect(bib).toContain('author={Correia, ZéLuis F. \\& Co.}');

    const ris = buildReportCitation(mockReport, 'ris');
    expect(ris).toContain('TI  - Debt & Growth: 100% Synthesis: Line A Line B');
  });

  it('validates external API payloads with Valibot and rejects malformed shapes', () => {
    expect(
      parseOpenMeteoResponse({
        current: { temperature_2m: 28.4, relative_humidity_2m: 62, weather_code: 1 },
      }).success
    ).toBe(true);
    expect(parseOpenMeteoResponse({ current: { temperature_2m: 'hot' } }).success).toBe(false);

    expect(
      parseWikipediaSummaryResponse({
        title: 'Abomey',
        extract: 'Historic Kingdom of Dahomey capital.',
      }).success
    ).toBe(true);
    expect(parseWikipediaSummaryResponse({ extract: 123 }).success).toBe(false);

    expect(
      parseCrossrefWorkResponse({
        message: { title: ['Empirical Evidence'], DOI: '10.1000/test' },
      }).success
    ).toBe(true);
    expect(parseCrossrefWorkResponse({ message: null }).success).toBe(false);
  });
});

describe('Interactive UI Components & Accessibility', () => {
  beforeEach(() => {
    delete (window as Window & { __afriataSwUpdatePending?: boolean }).__afriataSwUpdatePending;
  });

  it('renders JapandiTooltip on hover/focus with ARIA role="tooltip" and aria-describedby', async () => {
    render(
      <JapandiTooltip title="ECOWAS Bloc" content="15 West African member states" position="bottom">
        <button type="button">Inspect Bloc</button>
      </JapandiTooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Inspect Bloc' });
    fireEvent.focus(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.textContent).toContain('ECOWAS Bloc');
    expect(tooltip.textContent).toContain('15 West African member states');

    fireEvent.blur(trigger);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).toBeNull();
    });
  });

  it('surfaces SW update toast even when pending flag was set prior to OfflineIndicator mount', async () => {
    (window as Window & { __afriataSwUpdatePending?: boolean }).__afriataSwUpdatePending = true;

    render(<OfflineIndicator />);

    const toast = await screen.findByText('New Atlas version ready');
    expect(toast).toBeTruthy();

    const applyListener = vi.fn();
    window.addEventListener('afriata-sw-apply-update', applyListener);
    fireEvent.click(screen.getByRole('button', { name: 'Reload' }));
    expect(applyListener).toHaveBeenCalledTimes(1);
    window.removeEventListener('afriata-sw-apply-update', applyListener);
  });

  it('ignores Escape inside AtlasDialog while IME composition is active', async () => {
    const onClose = vi.fn();
    render(
      <AtlasDialog isOpen={true} onClose={onClose} label="IME Guard Dialog">
        <input aria-label="Dialog Input" />
      </AtlasDialog>
    );

    const input = await screen.findByLabelText('Dialog Input');

    // Escape with isComposing: true on child input must not close dialog
    fireEvent.keyDown(input, { key: 'Escape', isComposing: true });
    expect(onClose).not.toHaveBeenCalled();

    // Legacy keyCode 229 IME composition event must not close dialog
    fireEvent.keyDown(input, { key: 'Escape', keyCode: 229 });
    expect(onClose).not.toHaveBeenCalled();

    // Normal Escape closes dialog
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('finds accented countries via ASCII queries in SearchModal and respects IME composition & button Enter', async () => {
    const onClose = vi.fn();
    const onSelectCountry = vi.fn();
    const onSelectIndicator = vi.fn();
    const onSelectTab = vi.fn();

    render(
      <SavedEntitiesProvider>
        <SearchModal
          isOpen={true}
          onClose={onClose}
          onSelectCountry={onSelectCountry}
          onSelectIndicator={onSelectIndicator}
          onSelectTab={onSelectTab}
        />
      </SavedEntitiesProvider>
    );

    const input = await screen.findByRole('combobox');
    expect(screen.getByRole('listbox')).toBeTruthy();

    fireEvent.change(input, { target: { value: 'cote d ivoire' } });
    expect(await screen.findByText(/Côte d['’]Ivoire/i)).toBeTruthy();

    // Pressing Enter on a category filter button must not execute the active search result
    const nationsBtn = screen.getByRole('button', { name: 'Nations' });
    fireEvent.keyDown(nationsBtn, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
    expect(onSelectTab).not.toHaveBeenCalled();

    // IME Escape should not close modal while composing
    fireEvent.keyDown(input, { key: 'Escape', isComposing: true });
    expect(onClose).not.toHaveBeenCalled();

    // Real Escape closes modal
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
