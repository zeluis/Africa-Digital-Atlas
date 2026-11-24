import { useState, useEffect, useCallback, RefObject } from 'react';

export interface UseFullscreenContainerOptions {
  targetRef?: RefObject<HTMLElement | null>;
  fallbackSelector?: string;
  initialFullscreen?: boolean;
  /** When false, toggles CSS fullscreen fallback state without invoking browser requestFullscreen API */
  useNative?: boolean;
}

export interface UseFullscreenContainerResult {
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;
}

/**
 * Shared fullscreen container hook with native Fullscreen API sync and automatic
 * CSS-only fallback when native fullscreen is blocked (e.g., sandboxed iframes).
 */
export function useFullscreenContainer({
  targetRef,
  fallbackSelector,
  initialFullscreen = false,
  useNative = true,
}: UseFullscreenContainerOptions = {}): UseFullscreenContainerResult {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(initialFullscreen);

  useEffect(() => {
    if (!useNative || typeof document === 'undefined') return;
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [useNative]);

  const resolveTargetElement = useCallback((): HTMLElement | null => {
    if (typeof document === 'undefined') return null;
    if (targetRef?.current) return targetRef.current;
    if (fallbackSelector) {
      const matched = document.querySelector<HTMLElement>(fallbackSelector);
      if (matched) return matched;
    }
    return document.documentElement;
  }, [targetRef, fallbackSelector]);

  const enterFullscreen = useCallback(() => {
    if (!useNative) {
      setIsFullscreen(true);
      return;
    }
    const el = resolveTargetElement();
    if (el && typeof el.requestFullscreen === 'function' && !document.fullscreenElement) {
      el.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(true));
    } else {
      setIsFullscreen(true);
    }
  }, [useNative, resolveTargetElement]);

  const exitFullscreen = useCallback(() => {
    if (!useNative) {
      setIsFullscreen(false);
      return;
    }
    if (typeof document !== 'undefined' && document.fullscreenElement && typeof document.exitFullscreen === 'function') {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => setIsFullscreen(false));
    } else {
      setIsFullscreen(false);
    }
  }, [useNative]);

  const toggleFullscreen = useCallback(() => {
    if (!useNative) {
      setIsFullscreen((prev) => !prev);
      return;
    }
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      exitFullscreen();
      return;
    }
    if (isFullscreen) {
      setIsFullscreen(false);
      return;
    }
    const el = resolveTargetElement();
    if (el && typeof el.requestFullscreen === 'function') {
      el.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen((prev) => !prev));
    } else {
      setIsFullscreen((prev) => !prev);
    }
  }, [useNative, isFullscreen, exitFullscreen, resolveTargetElement]);

  return {
    isFullscreen,
    setIsFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}

export default useFullscreenContainer;
