import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { WifiOff, Database, CheckCircle2, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useNetworkStatus();
  const [dismissed, setDismissed] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setDismissed(false);
    } else if (wasOffline) {
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (showRestored) {
    return (
      <div 
        id="network-status-restored-toast"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs font-medium animate-in slide-in-from-bottom-5 duration-300"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
        <span>Connection Restored — Live Sync Active</span>
      </div>
    );
  }

  if (isOnline || dismissed) return null;

  return (
    <div 
      id="network-offline-banner"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/95 dark:bg-zinc-800/95 text-zinc-100 border border-zinc-700/80 shadow-2xl backdrop-blur-md text-xs font-medium animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <WifiOff className="w-4 h-4 text-amber-400" />
      </div>

      <div className="flex items-center gap-1.5 text-zinc-300">
        <span>Offline Research Active</span>
        <span className="text-zinc-500">•</span>
        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
          <Database className="w-3 h-3 text-emerald-400" />
          Cached Monographs & Atlas Available
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors ml-1"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
export default OfflineIndicator;
