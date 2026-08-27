import React from 'react';
import { CanonicalVoyage } from '../../data/slaveVoyagesTypes';
import { 
  Anchor, 
  Compass, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldAlert, 
  BookOpen, 
  ExternalLink, 
  X, 
  FileText,
  Clock,
  Skull
} from 'lucide-react';

interface VoyageDossierModalProps {
  voyage: CanonicalVoyage | null;
  onClose: () => void;
}

export const VoyageDossierModal: React.FC<VoyageDossierModalProps> = ({
  voyage,
  onClose
}) => {
  if (!voyage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-8 text-left">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{voyage.carrier.flag}</span>
              <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {voyage.vessel.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {voyage.dates.departureYear}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-zinc-500 bg-zinc-200 dark:bg-zinc-800">
                SV #{voyage.provenance.slaveVoyagesId}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {voyage.vessel.rig || 'Sailing Vessel'} • Carrier: <strong className="text-zinc-800 dark:text-zinc-200">{voyage.carrier.nationality}</strong> • Database: <span className="uppercase font-mono">{voyage.database.replace('_', ' ')}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-700 dark:text-zinc-300">
          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase font-mono">Embarked</p>
              <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                {voyage.enslaved.embarkedImputed.toLocaleString()}
              </p>
              <span className="text-[10px] text-zinc-500">
                {voyage.enslaved.embarkedObserved ? `Observed: ${voyage.enslaved.embarkedObserved}` : 'Statistical Imputation'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase font-mono">Disembarked</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {voyage.enslaved.disembarkedImputed.toLocaleString()}
              </p>
              <span className="text-[10px] text-zinc-500">
                {voyage.enslaved.disembarkedObserved ? `Observed: ${voyage.enslaved.disembarkedObserved}` : 'Statistical Imputation'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase font-mono">Shipboard Mortality</p>
              <p className={`text-lg font-black ${voyage.enslaved.mortalityRateImputed > 15 ? 'text-rose-500' : 'text-amber-500'}`}>
                {voyage.enslaved.mortalityRateImputed}%
              </p>
              <span className="text-[10px] text-zinc-500">
                {voyage.enslaved.embarkedImputed - voyage.enslaved.disembarkedImputed} souls lost at sea
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] text-zinc-400 uppercase font-mono">Middle Passage</p>
              <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                {voyage.dates.middlePassageDays ? `${voyage.dates.middlePassageDays} Days` : 'Undocumented'}
              </p>
              <span className="text-[10px] text-zinc-500">
                Atlantic crossing duration
              </span>
            </div>
          </div>

          {/* Itinerary Map / Sequence */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Voyage Itinerary & Geographic Nodes</span>
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500/30">
              {voyage.itinerary.portOfDeparture && (
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-zinc-400 border-2 border-white dark:border-zinc-950" />
                  <p className="text-[10px] font-mono uppercase text-zinc-400 font-bold">1. Port of Departure</p>
                  <p className="font-bold text-zinc-800 dark:text-zinc-200">
                    {voyage.itinerary.portOfDeparture.name}, {voyage.itinerary.portOfDeparture.country}
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
                <p className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                  2. Principal Place of Slave Purchase (Embarkation)
                </p>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                  {voyage.itinerary.principalPlaceOfSlavePurchase.name} ({voyage.itinerary.principalPlaceOfSlavePurchase.region})
                </p>
                <p className="text-[11px] text-zinc-500">
                  {voyage.dates.embarkationDate ? `Date: ${voyage.dates.embarkationDate}` : `Year: ${voyage.dates.departureYear}`}
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white dark:border-zinc-950" />
                <p className="text-[10px] font-mono uppercase text-indigo-600 dark:text-indigo-400 font-bold">
                  3. Principal Place of Slave Landing (Disembarkation)
                </p>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">
                  {voyage.itinerary.principalPlaceOfSlaveLanding.name} ({voyage.itinerary.principalPlaceOfSlaveLanding.region})
                </p>
                <p className="text-[11px] text-zinc-500">
                  {voyage.dates.disembarkationDate ? `Date: ${voyage.dates.disembarkationDate}` : 'Disembarked in colony'}
                </p>
              </div>
            </div>
          </div>

          {/* Vessel & Commercial Network */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <h4 className="font-bold text-xs uppercase text-zinc-400 font-mono flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-emerald-500" />
                <span>Vessel Technical Specs</span>
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li><strong>Rig:</strong> {voyage.vessel.rig || 'Unrecorded'}</li>
                <li><strong>Registered Tonnage:</strong> {voyage.vessel.tonnage ? `${voyage.vessel.tonnage} (${voyage.vessel.tonnageType || 'Customhouse'})` : 'Imputed from rig'}</li>
                <li><strong>Construction:</strong> {voyage.vessel.constructionPlace || 'Unknown shipyard'}</li>
                <li><strong>Captain / Master:</strong> {voyage.vessel.captain || 'Unrecorded in manifest'}</li>
                <li><strong>Managing Owner / Syndicate:</strong> {voyage.vessel.owner || 'Companhia / Private Investor'}</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
              <h4 className="font-bold text-xs uppercase text-zinc-400 font-mono flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Demographic Breakdown</span>
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li><strong>Male / Female Ratio:</strong> {voyage.enslaved.maleRatio ? `${voyage.enslaved.maleRatio}% Male / ${voyage.enslaved.femaleRatio}% Female` : 'Standard regional average'}</li>
                <li><strong>Child / Adult Ratio:</strong> {voyage.enslaved.childRatio ? `${voyage.enslaved.childRatio}% Children / ${voyage.enslaved.adultRatio}% Adults` : 'Standard regional average'}</li>
                <li><strong>Abolition Era Status:</strong> <span className="font-semibold">{voyage.outcomes.slaveTradeAbolitionPeriod}</span></li>
                <li><strong>Fate of Captives:</strong> {voyage.outcomes.fateOfCaptives}</li>
              </ul>
            </div>
          </div>

          {/* Resistance & Rebellions */}
          {voyage.resistance.hasRebellion && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-extrabold text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Documented African Resistance / Shipboard Revolt</span>
              </div>
              <p className="text-xs text-rose-900/90 dark:text-rose-200/90 leading-relaxed">
                {voyage.resistance.description || 'Shipboard insurrection recorded in captain logs or admiralty inquiry proceedings.'}
              </p>
              <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                Stage: {voyage.resistance.rebellionStage || 'Middle Passage'}
              </span>
            </div>
          )}

          {/* Primary Source Provenance & Citations */}
          <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
            <h4 className="font-bold text-xs uppercase font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Primary Source Citations & Epistemic Status</span>
            </h4>
            <div className="space-y-1 font-serif italic text-xs text-zinc-800 dark:text-zinc-200">
              {voyage.provenance.sourceCitations.map((cite, idx) => (
                <p key={idx}>• {cite}</p>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700 text-[11px] font-mono text-zinc-500">
              <span>Archive Ref: {voyage.provenance.archiveReference || 'SlaveVoyages Consortia'}</span>
              <span>Epistemic Category: <strong>{voyage.provenance.epistemicStatus}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between">
          <a
            href={voyage.provenance.sourceDocumentUrl || `https://api.slavevoyages.org/voyages/${voyage.provenance.slaveVoyagesId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
          >
            <span>View Record on SlaveVoyages.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
