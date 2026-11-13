import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m, type HTMLMotionProps } from 'motion/react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

const BACKGROUND_INERT_SELECTOR =
  'header, #main-content-workspace, #app-footer-container, #desktop-navigation-drawer, aside[aria-label], nav[aria-label]';

// Track active dialog tokens so stacked dialogs keep top-most Esc/focus precedence
const activeDialogStack: symbol[] = [];
const previousInertState = new WeakMap<Element, boolean>();

function syncBackgroundInert(shouldIsolate: boolean) {
  if (typeof document === 'undefined') return;
  const targets = document.querySelectorAll(BACKGROUND_INERT_SELECTOR);
  targets.forEach((el) => {
    if (el.closest('[role="dialog"]')) return;
    const htmlEl = el as HTMLElement & { inert: boolean };
    if (shouldIsolate) {
      if (!previousInertState.has(el)) {
        previousInertState.set(el, Boolean(htmlEl.inert));
      }
      htmlEl.inert = true;
    } else if (previousInertState.has(el)) {
      const prior = previousInertState.get(el) ?? false;
      htmlEl.inert = prior;
      previousInertState.delete(el);
    }
  });
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const candidates = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return candidates.filter((el) => {
    if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return false;
    // Skip elements inside display:none or inert subtrees
    return el.getClientRects().length > 0;
  });
}

export interface AtlasDialogProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  overlayClassName?: string;
  className?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnBackdropClick?: boolean;
  motionProps?: Pick<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'transition'>;
  children: React.ReactNode;
}

export const AtlasDialog: React.FC<AtlasDialogProps> = ({
  isOpen,
  onClose,
  id,
  label,
  labelledBy,
  describedBy,
  overlayClassName = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-stone-950/75 backdrop-blur-md',
  className = '',
  initialFocusRef,
  closeOnBackdropClick = true,
  motionProps,
  children,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const dialogTokenRef = useRef<symbol | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const token = Symbol('AtlasDialog');
    dialogTokenRef.current = token;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    activeDialogStack.push(token);
    if (activeDialogStack.length === 1) {
      syncBackgroundInert(true);
    }

    return () => {
      const idx = activeDialogStack.lastIndexOf(token);
      if (idx !== -1) {
        activeDialogStack.splice(idx, 1);
      }
      if (activeDialogStack.length === 0) {
        syncBackgroundInert(false);
      }

      const prev = previousFocusRef.current;
      if (prev && prev.isConnected && activeDialogStack.length === 0) {
        // Restore focus cleanly on next frame after inert is removed
        requestAnimationFrame(() => {
          if (prev.isConnected) {
            prev.focus({ preventScroll: true });
          }
        });
      } else if (prev && prev.isConnected && activeDialogStack.length > 0) {
        requestAnimationFrame(() => {
          if (prev.isConnected) {
            prev.focus({ preventScroll: true });
          }
        });
      }
    };
  }, [isOpen]);

  // Move focus into the dialog when opened & wire Escape + Tab focus trap
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    const focusRaf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      if (initialFocusRef?.current && panel.contains(initialFocusRef.current)) {
        initialFocusRef.current.focus({ preventScroll: true });
        return;
      }
      const focusable = getFocusableElements(panel);
      if (focusable.length > 0) {
        focusable[0].focus({ preventScroll: true });
      } else {
        panel.focus({ preventScroll: true });
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle key events for the topmost dialog in stack
      if (activeDialogStack[activeDialogStack.length - 1] !== dialogTokenRef.current) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = getFocusableElements(panel);
        if (focusable.length === 0) {
          e.preventDefault();
          panel.focus({ preventScroll: true });
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!active || active === first || !panel.contains(active)) {
            e.preventDefault();
            last.focus({ preventScroll: true });
          }
        } else {
          if (!active || active === last || !panel.contains(active)) {
            e.preventDefault();
            first.focus({ preventScroll: true });
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      cancelAnimationFrame(focusRaf);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, initialFocusRef]);

  if (!isOpen || typeof document === 'undefined') return null;

  const dialogAttributes = {
    ref: panelRef,
    id,
    role: 'dialog' as const,
    'aria-modal': true as const,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    tabIndex: -1,
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    className,
  };

  return createPortal(
    <div
      className={overlayClassName}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
          onCloseRef.current();
        }
      }}
    >
      {motionProps ? (
        <m.div {...dialogAttributes} {...motionProps}>
          {children}
        </m.div>
      ) : (
        <div {...dialogAttributes}>{children}</div>
      )}
    </div>,
    document.body
  );
};

export default AtlasDialog;
