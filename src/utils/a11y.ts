import React, { useEffect, useState } from 'react';

/**
 * Shared WAI-ARIA TabList horizontal/vertical keyboard handler.
 * Supports ArrowRight, ArrowDown, ArrowLeft, ArrowUp, Home, End.
 */
export function handleTabListKeyDown<T extends string>(
  e: React.KeyboardEvent<HTMLButtonElement>,
  tabs: readonly T[],
  currentIndex: number,
  onSelect: (tabId: [T][T extends unknown ? 0 : never]) => void,
  orientation: 'horizontal' | 'vertical' | 'both' = 'both'
): void {
  if (tabs.length === 0) return;

  const isNext =
    (orientation !== 'vertical' && e.key === 'ArrowRight') ||
    (orientation !== 'horizontal' && e.key === 'ArrowDown');
  const isPrev =
    (orientation !== 'vertical' && e.key === 'ArrowLeft') ||
    (orientation !== 'horizontal' && e.key === 'ArrowUp');

  let nextIdx = currentIndex;
  if (isNext) {
    nextIdx = (currentIndex + 1) % tabs.length;
  } else if (isPrev) {
    nextIdx = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (e.key === 'Home') {
    nextIdx = 0;
  } else if (e.key === 'End') {
    nextIdx = tabs.length - 1;
  } else {
    return;
  }

  e.preventDefault();
  const nextTab = tabs[nextIdx];
  onSelect(nextTab);

  const tabList = e.currentTarget.closest('[role="tablist"]');
  if (tabList) {
    const tabButtons = tabList.querySelectorAll<HTMLElement>('[role="tab"]');
    tabButtons[nextIdx]?.focus();
  }
}

/**
 * Lightweight hook observing `document.documentElement.classList.contains('dark')`
 * so inline tonal card styles respond seamlessly to light/dark theme switches.
 */
export function useIsDarkTheme(): boolean {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains('dark'));
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
