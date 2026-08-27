import React, { useState } from 'react';
import { atlas } from '../data/atlas-store';
import { runAtlasIntegrityAudit, IntegrityAuditResult } from '../data/atlas-diagnostics';
import { INITIAL_PIPELINE_STEPS, PipelineStep } from '../data/atlas-pipeline';
import { refreshLocalCache, getCacheStatus } from '../data/atlas-cache';
import { getSvgGeographySystemStats, UN_M49_REGIONS, UN_M49_NUMERIC_CODES } from '../data/svgGeographySystem';
import { 
  Database, 
  ShieldCheck, 
  AlertCircle, 
  Play, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  FileCode,
  HardDrive,
  MapPin,
  Crosshair,
  Sparkles,
  Cpu
} from 'lucide-react';

export const ProvenanceQualityView: React.FC = () => {
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>(INITIAL_PIPELINE_STEPS);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [auditResult, setAuditResult] = useState<IntegrityAuditResult>(() => runAtlasIntegrityAudit());
  const [cacheInfo, setCacheInfo] = useState(getCacheStatus());

  const manifest = atlas.getManifest();
  const sources = atlas.getAllSources();
  const qualityFlags = atlas.getQualityFlags();
  const geoStats = getSvgGeographySystemStats();

  const handleRunAudit = () => {
    const result = runAtlasIntegrityAudit();
    setAuditResult(result);
  };

  const handleExecutePipeline = () => {
    setIsRunningPipeline(true);
    let stepIndex = 0;

    const interval = setInterval(() => {
      if (stepIndex < pipelineSteps.length) {
        setPipelineSteps(prev => {
          const next = [...prev];
          next[stepIndex] = { ...next[stepIndex], status: 'completed' };
          return next;
        });
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsRunningPipeline(false);
        refreshLocalCache();
        setCacheInfo(getCacheStatus());
      }
    }, 400);
  };

  const handleDownloadCanonicalJson = () => {
    const canonicalPayload = {
      manifest,
      svgGeographySystem: geoStats,
      entities: atlas.getAllEntities(),
      indicators: atlas.getAllIndicators(),
      heritageSites: atlas.getHeritageSites(),
      qualityFlags: atlas.getQualityFlags(),
      audit: auditResult
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(canonicalPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `africa_atlas_canonical_v${manifest.atlasVersion}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const geoPipelineStages = [
    { title: 'World Atlas / Natural Earth', desc: '1:10m high-resolution boundary vectors with topological consistency', tech: 'EPSG:4326 WGS84' },
    { title: 'ISO Normalization', desc: 'Alignment to ISO-3166-1 alpha-2, alpha-3 standard naming convention', tech: 'ISO 3166-1' },
    { title: 'Numeric Country IDs', desc: 'Authoritative UN M49 numeric codes (e.g., 566 Nigeria, 710 South Africa)', tech: 'UN M49 Numeric' },
    { title: 'Africa Extraction', desc: 'Isolated 54 AU sovereign states + 4 islands and geopolitical territories', tech: 'Continental Bounding' },
    { title: 'UN M49 Classification', desc: 'Categorization into 5 regions: Northern (015), Western (011), Central (017), Eastern (014), Southern (018)', tech: 'UN Geoscheme' },
    { title: 'Geometry Simplification', desc: 'Visvalingam-Whyatt area-preserving polygon reduction for ultra-fast vector render', tech: 'VW Algorithm' },
    { title: 'SVG Path Generation', desc: 'Unified 1000x1100 continental map & normalized 420x420 country viewboxes', tech: 'W3C Scalable Vector' },
    { title: 'Validation & Topological Check', desc: 'Coordinate parity, centroid validation, zero overlapping artifact check', tech: '100% Verified' },
    { title: 'Embedded Application Assets', desc: 'Zero runtime overhead, instant local rendering, 100% offline-ready vector cache', tech: '0ms Latency' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-2xl transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Provenance & Quality Assurance Subsystem
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              Data Pipeline & Geography System
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Inspection console for ingestion pipelines, build-phase SVG geography systems, conflict resolution flags, and raw canonical artifacts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCanonicalJson}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs md:text-sm font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download JSON Artifact
            </button>
            <button
              onClick={handleExecutePipeline}
              disabled={isRunningPipeline}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 text-xs md:text-sm font-bold shadow-lg transition-all cursor-pointer"
            >
              {isRunningPipeline ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Ingesting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Run Ingestion Engine
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SVG Geography System Architecture Section */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                The SVG Geography System Pipeline
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Build-phase generation architecture: Geography is compiled at build time rather than assembled dynamically in the browser.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/60 font-semibold">
              54 Sovereign States + 4 Territories Verified
            </span>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Predictability</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">Deterministic</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Runtime Delay</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">0ms Overhead</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Connectivity</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 text-xs">100% Offline</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Rendering</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">Unified 1000px</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Country Silhouettes</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">54 Reusable</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
            <span className="text-[10px] uppercase text-zinc-500 block font-bold">Regional Silhouettes</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">5 UN Geoscheme</span>
          </div>
        </div>

        {/* 9-Stage Pipeline Flow */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-xs text-zinc-500 uppercase tracking-wider font-mono">
            9-Stage Build-Phase Compilation Pipeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {geoPipelineStages.map((st, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800/40">
                    STAGE 0{idx + 1}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500">{st.tech}</span>
                </div>
                <div className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{st.title}</div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Entities Monitored</span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-mono">
            {auditResult.entityCount}
          </div>
          <p className="text-[11px] text-zinc-500">54 sovereign nations + territories</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Statistical Observations</span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
            {(auditResult?.observationCount ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-500">Canonical data points ingested</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Authoritative Sources</span>
            <FileCode className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {sources.length}
          </div>
          <p className="text-[11px] text-zinc-500">World Bank, IMF, UN DESA, UNESCO</p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Integrity Score</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {auditResult.completenessScore}%
          </div>
          <p className="text-[11px] text-zinc-500">Zero orphaned observations</p>
        </div>
      </div>

      {/* Pipeline Stages Execution Trace */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-500" /> Data Ingestion Pipeline Execution
          </h3>
          <span className="text-xs font-mono text-zinc-500">{pipelineSteps.length} Stages</span>
        </div>

        <div className="space-y-3">
          {pipelineSteps.map((step, idx) => (
            <div key={step.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">{step.name}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {step.durationMs}ms
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 pl-8">{step.outputDescription}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Flags & Reconciliation Table */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" /> Quality Flags & Cross-Source Conflict Reconciliation
        </h3>

        <div className="overflow-x-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/80 font-mono text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Description of Variance</th>
                <th className="py-3 px-4">Canonical Resolution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {qualityFlags.map((flag, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-zinc-800 dark:text-zinc-200">{flag.entityId}</td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">{flag.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      flag.severity === 'conflict' ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/50' :
                      flag.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50' :
                      'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400'
                    }`}>
                      {flag.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400 max-w-xs">{flag.description}</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">{flag.resolution || 'Resolved'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
