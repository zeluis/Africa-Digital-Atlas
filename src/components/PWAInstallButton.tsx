import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Smartphone, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 3000);
    }
  };

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold shadow-sm transition-all transform active:scale-95 cursor-pointer ${className}`}
        title="Install Africalia for offline research & instant access"
      >
        {installSuccess ? (
          <>
            <Check className="w-3.5 h-3.5 text-white" />
            <span>Installed</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5 text-emerald-200 animate-bounce" />
            <span>Install App</span>
          </>
        )}
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-zinc-200 dark:border-zinc-700 transition cursor-pointer ${className}`}
          title="Install Africalia on iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-500" />
          <span>Add to Home</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-base text-zinc-900 dark:text-zinc-100">
                  <Smartphone className="w-5 h-5 text-emerald-500" />
                  <span>Install on iPhone / iPad</span>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">1.</span>
                  <span>Tap the <strong className="text-zinc-900 dark:text-white inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-blue-500 inline" /> Share</strong> button in your Safari toolbar.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">2.</span>
                  <span>Scroll down and select <strong className="text-zinc-900 dark:text-white">Add to Home Screen</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">3.</span>
                  <span>Launch from your home screen for standalone offline research.</span>
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
export default PWAInstallButton;
