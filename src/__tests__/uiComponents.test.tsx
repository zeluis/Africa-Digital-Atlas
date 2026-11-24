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
    const ivoryMatches = await screen.findAllByText(/Côte d['’]Ivoire/i);
    expect(ivoryMatches.length).toBeGreaterThan(0);

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

  it('sanitizes unsafe inline styles and SMIL style/url animations while preserving local url(#id) fragments', async () => {
    const { sanitizeSvgMarkup } = await import('../utils/sanitizeSvg');

    const maliciousSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs><linearGradient id="sahelGrad"><stop offset="0%" stop-color="#d97706"/></linearGradient></defs>
        <rect
          width="50"
          height="50"
          fill="url(#sahelGrad)"
          style="fill: url(#sahelGrad); background: url(https://tracker.example/leak.png); width: expression(alert(1)); -moz-binding: url(https://evil.example/xbl.xml#x); stroke: #111"
        />
        <circle cx="20" cy="20" r="10">
          <animate attributeName="style" from="fill:red" to="background:url(https://evil.example/a)" />
          <animate attributeName="fill" values="url(https://evil.example/b);#000" />
          <set attributeName="href" to="javascript:alert(1)" />
        </circle>
      </svg>
    `;

    const clean = sanitizeSvgMarkup(maliciousSvg);
    expect(clean).toContain('url(#sahelGrad)');
    expect(clean).toContain('stroke: #111');
    expect(clean).not.toContain('tracker.example');
    expect(clean).not.toContain('evil.example');
    expect(clean).not.toContain('expression(');
    expect(clean).not.toContain('-moz-binding');
    expect(clean).not.toContain('attributeName="style"');
    expect(clean).not.toContain('attributeName="href"');
    expect(clean).not.toContain('javascript:');
  });

  it('supports WAI-ARIA roving keyboard navigation in AtlasTabList', async () => {
    const { AtlasTabList } = await import('../components/common/AtlasTabList');

    const Wrapper = () => {
      const [active, setActive] = React.useState('overview');
      return (
        <AtlasTabList
          ariaLabel="Dossier Sections"
          items={[
            { id: 'overview', label: 'Overview' },
            { id: 'economy', label: 'Economy' },
            { id: 'heritage', label: 'Heritage' },
          ]}
          value={active}
          onChange={setActive}
          getTabClassName={(_item, isSelected) => (isSelected ? 'active-tab' : 'idle-tab')}
        />
      );
    };

    render(<Wrapper />);
    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    const economyTab = screen.getByRole('tab', { name: 'Economy' });
    const heritageTab = screen.getByRole('tab', { name: 'Heritage' });

    expect(overviewTab.getAttribute('aria-selected')).toBe('true');
    expect(overviewTab.getAttribute('tabindex')).toBe('0');
    expect(economyTab.getAttribute('tabindex')).toBe('-1');

    fireEvent.keyDown(overviewTab, { key: 'ArrowRight' });
    expect(economyTab.getAttribute('aria-selected')).toBe('true');
    expect(economyTab.getAttribute('tabindex')).toBe('0');

    fireEvent.keyDown(economyTab, { key: 'End' });
    expect(heritageTab.getAttribute('aria-selected')).toBe('true');

    fireEvent.keyDown(heritageTab, { key: 'Home' });
    expect(overviewTab.getAttribute('aria-selected')).toBe('true');
  });

  it('supports Escape dismissal and keyboard-accessible Peek/Half/Full snap tiers in MobileCountryPeekSheet', async () => {
    const { MobileCountryPeekSheet } = await import('../components/MobileCountryPeekSheet');
    const onClose = vi.fn();
    const onOpenDossier = vi.fn();

    render(
      <MobileCountryPeekSheet
        countryId="NGA"
        isOpen={true}
        onClose={onClose}
        onOpenDossier={onOpenDossier}
      />
    );

    const peekBtn = await screen.findByRole('button', { name: /Snap sheet to Peek height/i });
    const halfBtn = screen.getByRole('button', { name: /Snap sheet to Half height/i });
    const fullBtn = screen.getByRole('button', { name: /Snap sheet to Full height/i });

    expect(halfBtn.getAttribute('aria-pressed')).toBe('true');
    expect(peekBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(fullBtn);
    expect(fullBtn.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(peekBtn);
    expect(peekBtn.getAttribute('aria-pressed')).toBe('true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('indexes Pre-Colonial Kingdoms, Mother Tongues, Working Papers, and Utility Commands in SearchModal', async () => {
    const onClose = vi.fn();
    const onSelectCountry = vi.fn();
    const onSelectIndicator = vi.fn();
    const onSelectTab = vi.fn();
    const onToggleTheme = vi.fn();

    render(
      <SavedEntitiesProvider>
        <SearchModal
          isOpen={true}
          onClose={onClose}
          onSelectCountry={onSelectCountry}
          onSelectIndicator={onSelectIndicator}
          onSelectTab={onSelectTab}
          onToggleTheme={onToggleTheme}
        />
      </SavedEntitiesProvider>
    );

    const input = await screen.findByRole('combobox');

    // 1. Pre-colonial kingdom search -> deep links to kingdoms tab
    fireEvent.click(screen.getByRole('button', { name: 'Kingdoms' }));
    fireEvent.change(input, { target: { value: 'Kingdom of Kongo' } });
    const kongoOption = await screen.findByRole('option', { name: /Kingdom of Kongo/i });
    fireEvent.click(kongoOption);
    expect(onSelectTab).toHaveBeenCalledWith('archival-cartography?tab=kingdoms&kingdom=kongo-kingdom');

    // 2. Mother Tongue audio search -> deep links to languages waveform lab
    fireEvent.click(screen.getByRole('button', { name: 'Languages' }));
    fireEvent.change(input, { target: { value: 'Yoruba' } });
    const yorubaOption = await screen.findByRole('option', { name: /Yorùbá \(Èdè Yorùbá\)/i });
    fireEvent.click(yorubaOption);
    expect(onSelectTab).toHaveBeenCalledWith('languages?lang=yoruba');

    // 3. Utility Command execution -> toggles theme directly
    fireEvent.click(screen.getByRole('button', { name: 'Commands' }));
    fireEvent.change(input, { target: { value: 'Toggle Light / Dark Theme' } });
    const themeOption = await screen.findByRole('option', { name: /Toggle Light \/ Dark Theme/i });
    fireEvent.click(themeOption);
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('pauses canvas animation loop state when document is hidden or reduced motion is preferred', async () => {
    const { useAnimationActive } = await import('../hooks/useAnimationActive');

    const origMatchMedia = window.matchMedia;
    let reducedMotionMatches = true;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion') ? reducedMotionMatches : false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    });

    const Probe = () => {
      const ref = React.useRef<HTMLCanvasElement>(null);
      const state = useAnimationActive(ref, { enabled: true });
      return (
        <div>
          <canvas ref={ref} />
          <span data-testid="anim-active">{String(state.isActive)}</span>
          <span data-testid="anim-reduced">{String(state.prefersReducedMotion)}</span>
        </div>
      );
    };

    try {
      render(<Probe />);
      expect(screen.getByTestId('anim-reduced').textContent).toBe('true');
      expect(screen.getByTestId('anim-active').textContent).toBe('false');
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: origMatchMedia,
      });
    }
  });

  it('recovers when clicking Dismiss & Retry after a dynamic import failure in ViewErrorBoundary', async () => {
    const { lazyWithRetry, ViewErrorBoundary } = await import('../utils/lazyWithRetry');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let shouldFail = true;
    let attempts = 0;
    const RecoverableView = lazyWithRetry(async () => {
      attempts += 1;
      if (shouldFail) {
        throw new TypeError('Failed to fetch dynamically imported module');
      }
      return { default: () => <div>Recovered Ethnic Tree Module</div> };
    }, 'RecoverableView');

    try {
      render(
        <ViewErrorBoundary fallbackTitle="Module Unavailable">
          <React.Suspense fallback={<div>Loading...</div>}>
            <RecoverableView />
          </React.Suspense>
        </ViewErrorBoundary>
      );

      const retryBtn = await screen.findByRole('button', { name: /Dismiss & Retry/i }, { timeout: 10000 });
      shouldFail = false;
      fireEvent.click(retryBtn);

      expect(await screen.findByText('Recovered Ethnic Tree Module', {}, { timeout: 5000 })).toBeTruthy();
      expect(attempts).toBeGreaterThanOrEqual(7);
    } finally {
      warnSpy.mockRestore();
      errSpy.mockRestore();
    }
  }, 15000);
});

