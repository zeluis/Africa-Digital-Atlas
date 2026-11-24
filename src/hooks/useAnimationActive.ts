import { useEffect, useRef, useState, RefObject } from 'react';

export interface AnimationActiveState {
  isActive: boolean;
  isIntersecting: boolean;
  isDocumentHidden: boolean;
  prefersReducedMotion: boolean;
}

export interface UseAnimationActiveOptions {
  threshold?: number;
  enabled?: boolean;
  onActiveChange?: (state: AnimationActiveState) => void;
}

export interface UseAnimationActiveResult extends AnimationActiveState {
  stateRef: RefObject<AnimationActiveState>;
}

/**
 * Gates continuous requestAnimationFrame canvas loops on:
 * 1) Element viewport visibility via IntersectionObserver
 * 2) Tab visibility via document.visibilitychange
 * 3) OS accessibility preference via prefers-reduced-motion
 */
export function useAnimationActive(
  targetRef: RefObject<Element | null>,
  options: UseAnimationActiveOptions = {}
): UseAnimationActiveResult {
  const { threshold = 0.05, enabled = true, onActiveChange } = options;

  const [isIntersecting, setIsIntersecting] = useState<boolean>(true);
  const [isDocumentHidden, setIsDocumentHidden] = useState<boolean>(() =>
    typeof document !== 'undefined' ? Boolean(document.hidden) : false
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const isActive = enabled && isIntersecting && !isDocumentHidden && !prefersReducedMotion;

  const stateRef = useRef<AnimationActiveState>({
    isActive,
    isIntersecting,
    isDocumentHidden,
    prefersReducedMotion,
  });
  stateRef.current = {
    isActive,
    isIntersecting,
    isDocumentHidden,
    prefersReducedMotion,
  };

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const updateAndNotify = (nextPartial: Partial<Omit<AnimationActiveState, 'isActive'>>) => {
    const prev = stateRef.current;
    const nextIntersecting = nextPartial.isIntersecting ?? prev.isIntersecting;
    const nextHidden = nextPartial.isDocumentHidden ?? prev.isDocumentHidden;
    const nextReduced = nextPartial.prefersReducedMotion ?? prev.prefersReducedMotion;
    const nextState: AnimationActiveState = {
      isIntersecting: nextIntersecting,
      isDocumentHidden: nextHidden,
      prefersReducedMotion: nextReduced,
      isActive: enabled && nextIntersecting && !nextHidden && !nextReduced,
    };
    stateRef.current = nextState;
    onActiveChangeRef.current?.(nextState);
  };

  useEffect(() => {
    onActiveChangeRef.current?.(stateRef.current);
  }, [enabled]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handleVisibilityChange = () => {
      const hidden = Boolean(document.hidden);
      setIsDocumentHidden(hidden);
      updateAndNotify({ isDocumentHidden: hidden });
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      updateAndNotify({ prefersReducedMotion: e.matches });
    };
    mql.addEventListener('change', handleMotionChange);
    return () => mql.removeEventListener('change', handleMotionChange);
  }, [enabled]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry ? entry.isIntersecting : true;
        setIsIntersecting(visible);
        updateAndNotify({ isIntersecting: visible });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetRef, threshold, enabled]);

  return {
    isActive,
    isIntersecting,
    isDocumentHidden,
    prefersReducedMotion,
    stateRef,
  };
}

export default useAnimationActive;
