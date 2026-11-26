import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getExtendedArchivePinStatus } from '../utils/offlineArchivePin';
import { WifiOff, Database, CheckCircle2, RefreshCw, X } from 'lucide-react';

interface OfflineIndicatorProps {
  onOpenColophon?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onOpenColophon }) => {
  const isOnline = useNetworkStatus();
  const [dismissed, setDismissed] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);
  const [isExtendedArchivePinned, setIsExtendedArchivePinned] = useState(false);

  useEffect(() => {
    let active = true;
    getExtendedArchivePinStatus()
      .then((status) => {
        if (active) setIsExtendedArchivePinned(status.isPinned);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isOnline]);

  useEffect(() => {
    let active = true;
    const handleUpdateAvailable = () => {
      setSwUpdateAvailable(true);
      setUpdateDismissed(false);
    };

    if ((window as Window & { __afriataSwUpdatePending?: boolean }).__afriataSwUpdatePending) {
      handleUpdateAvailable();
    } else if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .getRegistration()
        .then((reg) => {
          if (active && reg?.waiting && navigator.serviceWorker.controller) {
            handleUpdateAvailable();
          }
        })
        .catch(() => {});
    }

    window.addEventListener('afriata-sw-update-available', handleUpdateAvailable);
    return () => {
      active = false;
      window.removeEventListener('afriata-sw-update-available', handleUpdateAvailable);
    };
  }, []);

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

  const showSwUpdate = swUpdateAvailable && !updateDismissed;
  const showOfflineBanner = !showRestored && !isOnline && !dismissed;

  if (!showSwUpdate && !showRestored && !showOfflineBanner) return null;

  return (
    <div
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-4 lg:right-5 z-50 flex flex-col items-end gap-2 pointer-events-none max-w-[calc(100vw-2rem)]"
    >
      {showSwUpdate && (
        <div
          id="sw-update-available-toast"
          role="status"
          aria-live="polite"
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-2xl text-xs font-medium"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>New Atlas version ready</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('afriata-sw-apply-update'))}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => setUpdateDismissed(true)}
            aria-label="Dismiss update notification"
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {showRestored && (
        <div
          id="network-status-restored-toast"
          role="status"
          aria-live="polite"
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs font-medium animate-in slide-in-from-bottom-5 duration-300"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Connection Restored — Live Sync Active</span>
        </div>
      )}

      {showOfflineBanner && (
        <div
          id="network-offline-banner"
          role="status"
          aria-live="polite"
          className="pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/95 dark:bg-zinc-800/95 text-zinc-100 border border-zinc-700/80 shadow-2xl backdrop-blur-md text-xs font-medium animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <WifiOff className="w-4 h-4 text-amber-400" />
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300">
            <span>Offline Research Active</span>
            <span className="text-zinc-500">•</span>
            <button
              type="button"
              onClick={() => onOpenColophon?.()}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
              title="Inspect Offline Expedition Cache Diagnostics"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>{isExtendedArchivePinned ? 'Extended Archive Pinned' : 'Vector Atlas 100% Primed'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss offline notice"
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors ml-1 cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
export default OfflineIndicator;
