import { useEffect, useRef, RefObject } from 'react';

export interface UseDismissibleLayerOptions {
  isOpen: boolean;
  onDismiss: () => void;
  refs: Array<RefObject<HTMLElement | null>>;
  restoreFocusRef?: RefObject<HTMLElement | null>;
  pointerEvent?: 'mousedown' | 'pointerdown';
  disabled?: boolean;
}

/**
 * Shared dismissal hook for non-modal popovers, dropdown menus, and floating panels.
 * Handles outside pointer dismissal and IME-safe Escape key closing with optional focus restoration.
 */
export function useDismissibleLayer({
  isOpen,
  onDismiss,
  refs,
  restoreFocusRef,
  pointerEvent = 'mousedown',
  disabled = false,
}: UseDismissibleLayerOptions): void {
  const onDismissRef = useRef(onDismiss);
  const refsRef = useRef(refs);
  const restoreFocusRefLatest = useRef(restoreFocusRef);

  onDismissRef.current = onDismiss;
  refsRef.current = refs;
  restoreFocusRefLatest.current = restoreFocusRef;

  useEffect(() => {
    if (!isOpen || disabled) return;

    const handleOutsidePointer = (event: MouseEvent | PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const isInside = refsRef.current.some((ref) => Boolean(ref.current && ref.current.contains(target)));
      if (!isInside) {
        onDismissRef.current();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || event.keyCode === 229) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onDismissRef.current();
        restoreFocusRefLatest.current?.current?.focus();
      }
    };

    document.addEventListener(pointerEvent, handleOutsidePointer);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener(pointerEvent, handleOutsidePointer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, disabled, pointerEvent]);
}
