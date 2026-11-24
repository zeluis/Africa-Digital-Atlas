import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseCopyToClipboardOptions {
  /** Duration in milliseconds before copied state resets (default 2000ms) */
  resetMs?: number;
  /** Optional message announced via aria-live when copied */
  announcementText?: string;
}

export interface UseCopyToClipboardReturn {
  copied: boolean;
  copiedKey: string | null;
  liveAnnouncement: string;
  copyToClipboard: (text: string, key?: string, customAnnouncement?: string) => Promise<boolean>;
  resetCopied: () => void;
}

/**
 * Fallback copy helper using a temporary off-screen textarea when
 * navigator.clipboard is unavailable (e.g., restricted iframe contexts).
 */
export async function writeTextWithFallback(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand fallback
    }
  }

  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export const writeTextToClipboard = writeTextWithFallback;

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): UseCopyToClipboardReturn {
  const { resetMs = 2000, announcementText = 'Copied to clipboard' } = options;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const timerRef = useRef<number | null>(null);

  const resetCopied = useCallback(() => {
    if (timerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCopiedKey(null);
    setLiveAnnouncement('');
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copyToClipboard = useCallback(
    async (text: string, key: string = 'default', customAnnouncement?: string): Promise<boolean> => {
      if (!text) return false;
      const ok = await writeTextWithFallback(text);
      if (ok) {
        if (timerRef.current !== null && typeof window !== 'undefined') {
          window.clearTimeout(timerRef.current);
        }
        setCopiedKey(key);
        setLiveAnnouncement(customAnnouncement || announcementText);
        if (typeof window !== 'undefined' && resetMs > 0) {
          timerRef.current = window.setTimeout(() => {
            setCopiedKey(null);
            setLiveAnnouncement('');
            timerRef.current = null;
          }, resetMs);
        }
      }
      return ok;
    },
    [announcementText, resetMs]
  );

  return {
    copied: copiedKey !== null,
    copiedKey,
    liveAnnouncement,
    copyToClipboard,
    resetCopied
  };
}

export default useCopyToClipboard;
