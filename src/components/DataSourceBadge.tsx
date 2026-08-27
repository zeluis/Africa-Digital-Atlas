import React from 'react';
import { atlas } from '../data/atlas-store';
import { CountryFlag } from './CountryFlag';
import { ExternalLink, ShieldCheck, AlertCircle, Info, Database, Calendar, Layers, X } from 'lucide-react';

interface DataProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  indicatorId: string;
}

export const DataProvenanceModal: React.FC<DataProvenanceModalProps> = ({
  isOpen,
  onClose,
  entityId,
  indicatorId
}) => {
  if (!isOpen) return null;

  const entity = atlas.getEntity(entityId);
  const indicator = atlas.getIndicator(indicatorId);
  const observations = atlas.getObservations(entityId, indicatorId);
  const latestObs = observations[observations.length - 1];
  const source = latestObs ? atlas.getSource(latestObs.sourceId) : undefined;
  const qualityFlags = atlas.getQualityFlags(entityId).filter(q => !q.indicatorId || q.indicatorId === indicatorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl text-zinc-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <CountryFlag entityId={entityId} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-zinc-100">{entity?.name || entityId}</h3>
                <span className="rounded bg-emerald-950/60 border border-emerald-700/60 px-2 py-0.5 text-xs font-mono text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Atlas v1.2 Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400">{indicator?.name || indicatorId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Current Canonical Observation */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Canonical Application Observation
            </span>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-3xl font-bold font-mono text-zinc-50">
                {latestObs?.value !== null && latestObs?.value !== undefined ? latestObs.value.toLocaleString() : '—'}
                <span className="ml-2 text-sm font-normal text-zinc-400">{latestObs?.unit}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-md border border-zinc-700/50">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reference Period: <strong>{latestObs?.period || 'Latest'}</strong></span>
                <span className="mx-1">•</span>
                <span className="capitalize font-medium text-zinc-300">Status: {latestObs?.status}</span>
              </div>
            </div>
            {latestObs?.notes && (
              <p className="mt-2 text-xs text-zinc-400 bg-amber-950/20 border border-amber-800/40 rounded p-2 text-amber-200/90">
                <strong>Methodology Note:</strong> {latestObs.notes}
              </p>
            )}
          </div>

          {/* Source Attribution & Provenance */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Authoritative Data Source
            </h4>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-800/30 p-4 space-y-2.5 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-zinc-100">{source?.name || 'World Development Indicators'}</div>
                  <div className="text-xs text-zinc-400">{source?.organization}</div>
                </div>
                <span className="text-xs bg-emerald-950/40 border border-emerald-700/50 text-emerald-400 px-2 py-0.5 rounded">
                  {source?.reliabilityTier}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {source?.coverageSummary}
              </p>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">Dataset ID: {latestObs?.datasetId || 'WDI_2024'}</span>
                {source?.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium underline-offset-2 hover:underline"
                  >
                    Source Portal <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Multi-Year Time Series Trace */}
          {observations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Ingested Observation History
              </h4>
              <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/30">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-900/80 font-mono text-zinc-400">
                    <tr>
                      <th className="py-2.5 px-3">Year</th>
                      <th className="py-2.5 px-3">Value</th>
                      <th className="py-2.5 px-3">Unit</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Source Dataset</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono">
                    {observations.map((obs, idx) => (
                      <tr key={idx} className="hover:bg-zinc-800/20">
                        <td className="py-2 px-3 font-semibold text-zinc-200">{obs.period}</td>
                        <td className="py-2 px-3 text-emerald-300 font-semibold">{obs.value?.toLocaleString()}</td>
                        <td className="py-2 px-3 text-zinc-400">{obs.unit}</td>
                        <td className="py-2 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans ${
                            obs.status === 'observed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                            obs.status === 'estimated' ? 'bg-amber-950 text-amber-400 border border-amber-800/40' :
                            'bg-cyan-950 text-cyan-400 border border-cyan-800/40'
                          }`}>
                            {obs.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-zinc-500">{obs.datasetId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quality Flags if any */}
          {qualityFlags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Data Quality & Reconciliation Notice
              </h4>
              {qualityFlags.map((qf, i) => (
                <div key={i} className="rounded-lg border border-amber-800/40 bg-amber-950/20 p-3 text-xs text-zinc-300 space-y-1">
                  <div className="font-semibold text-amber-300">{qf.category}</div>
                  <p>{qf.description}</p>
                  {qf.resolution && (
                    <div className="pt-1 text-emerald-400 font-medium">
                      <strong>Resolution:</strong> {qf.resolution}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 bg-zinc-950/60 px-6 py-3 flex items-center justify-between text-xs text-zinc-500">
          <span>Africa Data Atlas Platform • Schema 2025.1</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-1.5 font-medium transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

interface DataSourceBadgeProps {
  entityId: string;
  indicatorId: string;
  className?: string;
  showDetails?: boolean;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  entityId,
  indicatorId,
  className = '',
  showDetails = false
}) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const obs = atlas.getLatestObservation(entityId, indicatorId);
  const source = obs ? atlas.getSource(obs.sourceId) : undefined;
  const flags = atlas.getQualityFlags(entityId).filter(q => !q.indicatorId || q.indicatorId === indicatorId);
  const hasConflict = flags.some(f => f.severity === 'conflict');

  if (!obs) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`inline-flex items-center gap-1.5 text-[11px] font-sans font-medium px-2 py-0.5 rounded-full border transition-all hover:scale-105 cursor-pointer select-none ${
          hasConflict 
            ? 'bg-amber-950/50 border-amber-700/60 text-amber-300 hover:bg-amber-900/60' 
            : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700/80 hover:text-zinc-100'
        } ${className}`}
        title="Click to view full data provenance, methodology and confidence rating"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold">{source?.organization || 'World Bank/IMF'}</span>
        <span className="text-zinc-400">({obs.period})</span>
        {hasConflict && <AlertCircle className="w-3 h-3 text-amber-400" />}
        {showDetails && <Info className="w-3 h-3 text-zinc-400" />}
      </button>

      <DataProvenanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        entityId={entityId}
        indicatorId={indicatorId}
      />
    </>
  );
};
