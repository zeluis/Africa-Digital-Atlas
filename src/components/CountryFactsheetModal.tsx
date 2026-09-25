import React, { useState } from 'react';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from './CountryFlag';
import { CountrySilhouette } from './CountrySilhouette';
import { UN_M49_NUMERIC_CODES, getEntityGeographyMetadata } from '../data/svgGeographySystem';
import { COUNTRY_HEADER_DATA } from '../data/countryHeaderData';
import { getCountryHistoricalDevelopmentDossier } from '../data/countryHistoricalDevelopmentData';
import { 
  formatPopulation, 
  formatGDP, 
  formatCurrency, 
  formatPercentage, 
  formatHDI, 
  formatArea 
} from '../data/atlas-formatters';
import { downloadFile } from '../utils/exportUtils';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  X, 
  Landmark, 
  ShieldCheck, 
  Globe2, 
  Sparkles, 
  Layers, 
  Calendar,
  Zap,
  Building2,
  Trees,
  FileText
} from 'lucide-react';

interface CountryFactsheetModalProps {
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
}

const PPP_PRICE_LEVEL_FACTORS: Record<string, number> = {
  EGY: 4.55, NGA: 5.40, ZAF: 2.38, DZA: 2.63, ETH: 2.48, MAR: 2.58,
  KEN: 2.95, AGO: 2.72, GHA: 3.08, TZA: 2.70, CIV: 2.45, COD: 2.20,
  UGA: 3.10, CMR: 2.35, TUN: 2.85, SEN: 2.60, ZWE: 2.15, ZMB: 2.80,
  MOZ: 2.65, MDG: 3.25, SDN: 3.80, MLI: 2.90, BFA: 3.05, BEN: 2.80,
  GIN: 2.95, TCD: 2.75, NER: 3.10, RWA: 3.00, MWI: 3.40, SOM: 2.90,
  BWA: 2.30, GAB: 1.85, MUS: 1.95, NAM: 2.10, GNQ: 1.75, MRT: 2.85,
  SWZ: 2.40, LSO: 2.60, TGO: 2.90, SLE: 3.35, LBR: 2.80, CPV: 2.10,
  BDI: 3.15, DJI: 1.90, ERI: 2.90, GMB: 3.20, GNB: 2.95, COM: 2.60,
  STP: 2.30, SYC: 1.65, SSD: 2.40, CAF: 2.70, COG: 2.10, LBY: 2.30
};

export const CountryFactsheetModal: React.FC<CountryFactsheetModalProps> = ({
  entityId,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const country = atlas.getEntity(entityId);
  if (!country) return null;

  const header = COUNTRY_HEADER_DATA[entityId];
  const geo = getEntityGeographyMetadata(entityId);
  const hist = getCountryHistoricalDevelopmentDossier(country.name || entityId);
  const heritageSites = atlas.getHeritageSites(entityId);

  // Indicators
  const pop = atlas.getIndicatorValue(entityId, 'SP.POP.TOTL') || 0;
  const gdpNominal = atlas.getIndicatorValue(entityId, 'NY.GDP.MKTP.CD') || 0;
  const pppFactor = PPP_PRICE_LEVEL_FACTORS[entityId] || 2.6;
  const gdpPpp = gdpNominal * pppFactor;
  const gdpPerCapitaNominal = pop > 0 ? Math.round((gdpNominal * 1e9) / (pop * 1e6)) : 0;
  const gdpPerCapitaPpp = pop > 0 ? Math.round((gdpPpp * 1e9) / (pop * 1e6)) : 0;
  const growth = atlas.getIndicatorValue(entityId, 'NY.GDP.MKTP.KD.ZG');
  const inflation = atlas.getIndicatorValue(entityId, 'FP.CPI.TOTL.ZG');
  const hdi = atlas.getIndicatorValue(entityId, 'UNDP.HDI.INDEX');
  const lifeExp = atlas.getIndicatorValue(entityId, 'SP.DYN.LE00.IN');
  const elec = atlas.getIndicatorValue(entityId, 'EG.ELC.ACCS.ZS');
  const renew = atlas.getIndicatorValue(entityId, 'EG.FEC.RNEW.ZS');
  const literacy = atlas.getIndicatorValue(entityId, 'SE.ADT.LITR.ZS');
  const forest = atlas.getIndicatorValue(entityId, 'AG.LND.FRST.ZS');
  const internet = atlas.getIndicatorValue(entityId, 'IT.NET.USER.ZS');
  const m49 = UN_M49_NUMERIC_CODES[entityId] || '—';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# ${country.name} (${country.id}) — Executive Country Brief
**Official Name:** ${country.officialName || country.name}  
**UN Region:** ${country.region} | **M49:** ${m49} | **Capital:** ${country.capital || 'N/A'}  
**Independence Year:** ${country.independenceYear || header?.independenceDate || 'N/A'}  

## Macroeconomic Profile (Harmonized 2024)
- **Population:** ${formatPopulation(pop)}
- **Nominal GDP:** ${formatGDP(gdpNominal)}
- **PPP-Adjusted GDP:** ${formatGDP(gdpPpp)} (Factor: ${pppFactor}x)
- **GDP Per Capita (Nominal):** ${formatCurrency(gdpPerCapitaNominal)}
- **GDP Per Capita (PPP):** ${formatCurrency(gdpPerCapitaPpp)}
- **Real GDP Growth:** ${formatPercentage(growth)}
- **Inflation (CPI):** ${formatPercentage(inflation)}
- **Human Development Index (HDI):** ${formatHDI(hdi)}
- **Life Expectancy:** ${lifeExp ? `${lifeExp.toFixed(1)} years` : 'N/A'}

## Development & Infrastructure
- **Electricity Access:** ${formatPercentage(elec)}
- **Renewable Energy Share:** ${formatPercentage(renew)}
- **Adult Literacy Rate:** ${formatPercentage(literacy)}
- **Internet Penetration:** ${formatPercentage(internet)}
- **Forest Cover:** ${formatPercentage(forest)}
- **UNESCO World Heritage Sites:** ${heritageSites.length} documented sites

---
*Source: Africalia Africa Data Atlas (World Bank WDI, IMF WEO, UN DESA, UNESCO, AfDB).*`;

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleExportSvg = () => {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600" style="background:#ffffff;font-family:'Plus Jakarta Sans',sans-serif;">
  <style>
    .title { font-size: 48px; font-weight: 900; fill: #111827; }
    .subtitle { font-size: 20px; fill: #4b5563; font-weight: 600; }
    .header-box { fill: #f3f4f6; rx: 24; }
    .card { fill: #f9fafb; stroke: #e5e7eb; stroke-width: 2; rx: 16; }
    .label { font-size: 14px; fill: #6b7280; font-weight: 600; text-transform: uppercase; }
    .val { font-size: 26px; fill: #111827; font-weight: 800; font-family: monospace; }
    .section-title { font-size: 22px; font-weight: 800; fill: #047857; text-transform: uppercase; letter-spacing: 1px; }
  </style>

  <!-- Header Banner -->
  <rect x="40" y="40" width="1120" height="180" class="header-box" />
  <text x="80" y="110" class="title">${country.name.toUpperCase()} (${country.id})</text>
  <text x="80" y="155" class="subtitle">${country.officialName || country.name} • Capital: ${country.capital || 'N/A'} • UN Region: ${country.region} • M49: ${m49}</text>
  <text x="80" y="190" style="font-size: 14px; fill: #059669; font-weight: bold;">AFRICALIA PAN-AFRICAN DATA PLATFORM • EXECUTIVE 1-PAGE DOSSIER BRIEF</text>

  <!-- Macro Grid -->
  <text x="40" y="270" class="section-title">I. Core Macroeconomics &amp; Demographics (2024)</text>
  
  <rect x="40" y="290" width="350" height="110" class="card" />
  <text x="65" y="325" class="label">Total Population</text>
  <text x="65" y="370" class="val">${formatPopulation(pop)}</text>

  <rect x="425" y="290" width="350" height="110" class="card" />
  <text x="450" y="325" class="label">Nominal GDP</text>
  <text x="450" y="370" class="val">${formatGDP(gdpNominal)}</text>

  <rect x="810" y="290" width="350" height="110" class="card" />
  <text x="835" y="325" class="label">PPP-Adjusted GDP</text>
  <text x="835" y="370" class="val">${formatGDP(gdpPpp)}</text>

  <rect x="40" y="420" width="350" height="110" class="card" />
  <text x="65" y="455" class="label">GDP Per Capita (Nominal)</text>
  <text x="65" y="500" class="val">${formatCurrency(gdpPerCapitaNominal)}</text>

  <rect x="425" y="420" width="350" height="110" class="card" />
  <text x="450" y="455" class="label">GDP Per Capita (PPP)</text>
  <text x="450" y="500" class="val">${formatCurrency(gdpPerCapitaPpp)}</text>

  <rect x="810" y="420" width="350" height="110" class="card" />
  <text x="835" y="455" class="label">Human Development Index</text>
  <text x="835" y="500" class="val">${formatHDI(hdi)}</text>

  <!-- Development Pillars -->
  <text x="40" y="590" class="section-title">II. Infrastructure &amp; Quality of Life</text>

  <rect x="40" y="610" width="350" height="100" class="card" />
  <text x="65" y="645" class="label">Electricity Grid Access</text>
  <text x="65" y="685" class="val">${formatPercentage(elec)}</text>

  <rect x="425" y="610" width="350" height="100" class="card" />
  <text x="450" y="645" class="label">Renewable Energy Share</text>
  <text x="450" y="685" class="val">${formatPercentage(renew)}</text>

  <rect x="810" y="610" width="350" height="100" class="card" />
  <text x="835" y="645" class="label">Adult Literacy Rate</text>
  <text x="835" y="685" class="val">${formatPercentage(literacy)}</text>

  <rect x="40" y="730" width="350" height="100" class="card" />
  <text x="65" y="765" class="label">Life Expectancy</text>
  <text x="65" y="805" class="val">${lifeExp ? lifeExp.toFixed(1) + ' yrs' : 'N/A'}</text>

  <rect x="425" y="730" width="350" height="100" class="card" />
  <text x="450" y="765" class="label">Internet Penetration</text>
  <text x="450" y="805" class="val">${formatPercentage(internet)}</text>

  <rect x="810" y="730" width="350" height="100" class="card" />
  <text x="835" y="765" class="label">Forest Cover</text>
  <text x="835" y="805" class="val">${formatPercentage(forest)}</text>

  <!-- Heritage & Governance -->
  <text x="40" y="890" class="section-title">III. Sovereignty &amp; Cultural Heritage</text>
  <rect x="40" y="910" width="1120" height="160" class="card" />
  <text x="65" y="950" class="label">UNESCO World Heritage Sites (${heritageSites.length} Documented)</text>
  <text x="65" y="985" style="font-size: 16px; fill: #374151;">${heritageSites.slice(0, 5).map(s => s.name).join(' • ') || 'None formally registered'}</text>
  <text x="65" y="1030" class="label">Regional Economic Blocs</text>
  <text x="65" y="1055" style="font-size: 16px; fill: #059669; font-weight: bold;">${(geo?.memberBlocs || ['AU']).join(' • ')}</text>

  <!-- Footer Provenance Stamp -->
  <rect x="40" y="1480" width="1120" height="80" fill="#f3f4f6" rx="12" />
  <text x="65" y="1525" style="font-size: 13px; fill: #6b7280;">Authoritative Data Sources: World Bank WDI (2024), IMF World Economic Outlook, UN DESA WPP, UNESCO World Heritage Centre.</text>
  <text x="65" y="1545" style="font-size: 12px; fill: #9ca3af; font-family: monospace;">Africalia Platform Document ID: AFRICALIA-FACTSHEET-${country.id}-2024 • ISO 3166-1 alpha-3: ${country.id}</text>
</svg>`;

    downloadFile(`africalia-factsheet-${country.id.toLowerCase()}.svg`, svgContent, 'image/svg+xml');
  };

  const handleExportHtml = () => {
    const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${country.name} (${country.id}) — Executive 1-Page Country Brief</title>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111827; background: #fff; margin: 0; padding: 20px; line-height: 1.5; }
    .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 28px; font-weight: 900; margin: 0; color: #064e3b; }
    .subtitle { font-size: 13px; color: #4b5563; margin-top: 4px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 18px; }
    .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 14px; }
    .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #6b7280; letter-spacing: 0.5px; }
    .val { font-size: 20px; font-weight: 800; font-family: monospace; color: #111827; margin-top: 2px; }
    .sec-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #047857; margin: 14px 0 8px 0; border-left: 3px solid #059669; padding-left: 8px; }
    .footer { font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 20px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">${country.name} (${country.id})</h1>
      <div class="subtitle">${country.officialName || country.name} • Capital: ${country.capital || 'N/A'} • UN Region: ${country.region} • M49: ${m49}</div>
    </div>
    <div style="text-align: right; font-size: 11px; font-weight: bold; color: #059669;">
      AFRICALIA PAN-AFRICAN DATA PLATFORM<br>
      <span style="font-size: 10px; color: #6b7280;">Harmonized Baseline Edition 2024</span>
    </div>
  </div>

  <div class="sec-title">I. Core Macroeconomics &amp; Demographics</div>
  <div class="grid">
    <div class="card"><div class="label">Total Population</div><div class="val">${formatPopulation(pop)}</div></div>
    <div class="card"><div class="label">Nominal GDP</div><div class="val">${formatGDP(gdpNominal)}</div></div>
    <div class="card"><div class="label">PPP-Adjusted GDP (${pppFactor}×)</div><div class="val">${formatGDP(gdpPpp)}</div></div>
    <div class="card"><div class="label">GDP Per Capita (Nominal)</div><div class="val">${formatCurrency(gdpPerCapitaNominal)}</div></div>
    <div class="card"><div class="label">GDP Per Capita (PPP)</div><div class="val">${formatCurrency(gdpPerCapitaPpp)}</div></div>
    <div class="card"><div class="label">Human Development Index</div><div class="val">${formatHDI(hdi)}</div></div>
  </div>

  <div class="sec-title">II. Infrastructure, Quality of Life &amp; Energy</div>
  <div class="grid">
    <div class="card"><div class="label">Electricity Grid Access</div><div class="val">${formatPercentage(elec)}</div></div>
    <div class="card"><div class="label">Renewable Energy Share</div><div class="val">${formatPercentage(renew)}</div></div>
    <div class="card"><div class="label">Adult Literacy Rate</div><div class="val">${formatPercentage(literacy)}</div></div>
    <div class="card"><div class="label">Life Expectancy at Birth</div><div class="val">${lifeExp ? lifeExp.toFixed(1) + ' yrs' : 'N/A'}</div></div>
    <div class="card"><div class="label">Internet Penetration</div><div class="val">${formatPercentage(internet)}</div></div>
    <div class="card"><div class="label">Real GDP Growth</div><div class="val">${formatPercentage(growth)}</div></div>
  </div>

  <div class="sec-title">III. Sovereignty, Regional Integration &amp; Heritage</div>
  <div class="card" style="margin-bottom: 12px;">
    <div class="label">UNESCO World Heritage Sites (${heritageSites.length})</div>
    <div style="font-size: 12px; margin-top: 4px;">${heritageSites.slice(0, 6).map(s => s.name).join(' • ') || 'None formally registered'}</div>
    <div class="label" style="margin-top: 8px;">Regional Blocs</div>
    <div style="font-size: 12px; font-weight: bold; color: #059669;">${(geo?.memberBlocs || ['AU']).join(' • ')}</div>
  </div>

  <div class="footer">
    Africalia Platform Document ID: AFRICALIA-FACTSHEET-${country.id}-2024 • Sources: World Bank WDI, IMF WEO, UN DESA, UNESCO.
  </div>
</body>
</html>`;

    downloadFile(`africalia-factsheet-${country.id.toLowerCase()}.html`, htmlDoc, 'text/html');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Action Header Controls (Hidden during browser print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              1-Page Executive Factsheet Brief
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="Print or Save as PDF (A4/Letter)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportSvg}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-all cursor-pointer"
              title="Download vector SVG card"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SVG Card</span>
            </button>

            <button
              type="button"
              onClick={handleExportHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-all cursor-pointer"
              title="Download standalone offline HTML factsheet"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>HTML Brief</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-all cursor-pointer"
              title="Copy markdown summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable 1-Page Document Body */}
        <div id="printable-country-factsheet" className="p-6 md:p-8 space-y-6 text-zinc-900 dark:text-zinc-100 print:text-black print:p-0">
          {/* Header Banner */}
          <div className="flex items-start justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800 print:border-black/20">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CountryFlag entityId={entityId} size="lg" className="shadow-sm" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight text-zinc-950 dark:text-white print:text-black">
                    {country.name}
                  </h1>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
                    {country.officialName || country.name}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 print:border print:border-emerald-600">
                  ISO-3: {country.id}
                </span>
                <span className="text-zinc-400">•</span>
                <span>Region: {country.region}</span>
                <span className="text-zinc-400">•</span>
                <span>Capital: {country.capital || 'N/A'}</span>
                <span className="text-zinc-400">•</span>
                <span>M49: {m49}</span>
              </div>
            </div>

            {/* Silhouette Map & Area */}
            <div className="flex flex-col items-end shrink-0">
              <div className="w-20 h-20 opacity-80 dark:opacity-90">
                <CountrySilhouette entityId={entityId} size="lg" />
              </div>
              <span className="text-[11px] font-mono text-zinc-500 font-semibold mt-1">
                {formatArea(country.landAreaKm2)}
              </span>
            </div>
          </div>

          {/* Section 1: Executive Macroeconomic Dashboard */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-2">
              <span>I. Macroeconomic &amp; Monetary Profile (Harmonized 2024)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 print:border-zinc-300">
                <span className="text-[10px] text-zinc-500 font-medium block">Total Population</span>
                <span className="text-base font-black font-mono font-tabular tabular-nums text-zinc-900 dark:text-white print:text-black">
                  {formatPopulation(pop)}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">UN DESA Revision</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 print:border-zinc-300">
                <span className="text-[10px] text-zinc-500 font-medium block">Nominal GDP</span>
                <span className="text-base font-black font-mono font-tabular tabular-nums text-zinc-900 dark:text-white print:text-black">
                  {formatGDP(gdpNominal)}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">USD Current (WDI)</span>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 print:border-purple-300">
                <span className="text-[10px] text-purple-700 dark:text-purple-300 font-medium block">GDP (PPP Int'l $)</span>
                <span className="text-base font-black font-mono font-tabular tabular-nums text-purple-950 dark:text-purple-100 print:text-black">
                  {formatGDP(gdpPpp)}
                </span>
                <span className="text-[9px] text-purple-600 dark:text-purple-400 block mt-0.5">PPP Ratio: {pppFactor}x</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 print:border-zinc-300">
                <span className="text-[10px] text-zinc-500 font-medium block">GDP Per Capita</span>
                <span className="text-base font-black font-mono font-tabular tabular-nums text-zinc-900 dark:text-white print:text-black">
                  {formatCurrency(gdpPerCapitaNominal)}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">PPP: {formatCurrency(gdpPerCapitaPpp)}</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 print:border-zinc-300">
                <span className="text-[10px] text-zinc-500 font-medium block">Real GDP Growth</span>
                <span className="text-base font-black font-mono font-tabular tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatPercentage(growth)}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Annual real change</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 print:border-zinc-300">
                <span className="text-[10px] text-zinc-500 font-medium block">Inflation (CPI)</span>
                <span className="text-base font-black font-mono font-tabular tabular-nums text-zinc-900 dark:text-white print:text-black">
                  {formatPercentage(inflation)}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Consumer Price Index</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 print:border-zinc-300">
                <span className="text-[10px] text-zinc-500 font-medium block">Human Development (HDI)</span>
                <span className="text-base font-black font-mono font-tabular tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatHDI(hdi)}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">UNDP Composite</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 print:border-zinc-300">
                <span className="text-[10px] text-zinc-500 font-medium block">Life Expectancy</span>
                <span className="text-base font-black font-mono font-tabular tabular-nums text-zinc-900 dark:text-white print:text-black">
                  {lifeExp ? `${lifeExp.toFixed(1)} yrs` : 'N/A'}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">At birth</span>
              </div>
            </div>
          </div>

          {/* Section 2: Sectoral Indicators & Quality of Life */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-2">
              <span>II. Infrastructure, Human Capital &amp; Environment</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Electricity Access</span>
                  <span className="font-bold font-mono font-tabular text-zinc-900 dark:text-zinc-100">
                    {formatPercentage(elec)}
                  </span>
                </div>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>

              <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Renewable Share</span>
                  <span className="font-bold font-mono font-tabular text-zinc-900 dark:text-zinc-100">
                    {formatPercentage(renew)}
                  </span>
                </div>
                <Trees className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Adult Literacy</span>
                  <span className="font-bold font-mono font-tabular text-zinc-900 dark:text-zinc-100">
                    {formatPercentage(literacy)}
                  </span>
                </div>
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>

              <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Internet Penetration</span>
                  <span className="font-bold font-mono font-tabular text-zinc-900 dark:text-zinc-100">
                    {formatPercentage(internet)}
                  </span>
                </div>
                <Globe2 className="w-4 h-4 text-purple-500" />
              </div>

              <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Forest Cover %</span>
                  <span className="font-bold font-mono font-tabular text-zinc-900 dark:text-zinc-100">
                    {formatPercentage(forest)}
                  </span>
                </div>
                <Trees className="w-4 h-4 text-green-600" />
              </div>

              <div className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-medium block">Heritage Sanctuaries</span>
                  <span className="font-bold font-mono font-tabular text-zinc-900 dark:text-zinc-100">
                    {heritageSites.length} Sites
                  </span>
                </div>
                <Landmark className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Section 3: Sovereignty, Blocs & Cultural Reserves */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-2">
              <span>III. Sovereign Architecture &amp; Heritage Dossier</span>
            </h2>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <div>
                  <span className="text-[10px] text-zinc-500 block font-medium">Regional Economic Blocs (RECs)</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(geo?.memberBlocs || ['AU']).map(bloc => (
                      <span key={bloc} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-emerald-700 dark:text-emerald-300">
                        {bloc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block font-medium">Independence Date</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {header?.independenceDate || country.independenceYear || 'Historical Statehood'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 block font-medium mb-1">
                  Registered UNESCO World Heritage Sites ({heritageSites.length})
                </span>
                {heritageSites.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {heritageSites.map(s => (
                      <span key={s.id} className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {s.name} ({s.category})
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-zinc-500 italic">No formal UNESCO inscriptions recorded in repository.</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Provenance Stamp & Official Citation */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
            <div>
              <span>Official Citation: Africalia Africa Data Atlas (2024). {country.name} National Dossier.</span>
            </div>
            <div>
              <span>Verification: ISO 3166-1 • World Bank WDI • IMF WEO • UN DESA WPP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
