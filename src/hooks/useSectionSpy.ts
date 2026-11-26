import { useEffect, useRef } from 'react';

export interface UseSectionSpyOptions {
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
}

/**
 * Zero-reflow IntersectionObserver scroll-spy hook for multi-section research monographs.
 */
export function useSectionSpy(
  elementIds: readonly string[],
  onActiveChange: (elementId: string) => void,
  options: UseSectionSpyOptions = {}
): void {
  const {
    rootMargin = '-18% 0px -65% 0px',
    threshold = 0,
    enabled = true,
  } = options;

  const onActiveChangeRef = useRef(onActiveChange);
  onActiveChangeRef.current = onActiveChange;

  const idsKey = elementIds.join('|');

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined' || !idsKey) return;
    const ids = idsKey.split('|');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onActiveChangeRef.current(entry.target.id);
          }
        }
      },
      { rootMargin, threshold }
    );

    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [idsKey, rootMargin, threshold, enabled]);
}

export default useSectionSpy;
