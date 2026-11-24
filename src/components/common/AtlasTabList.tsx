import React, { useEffect, useRef } from 'react';
import { handleTabListKeyDown } from '../../utils/a11y';

export interface AtlasTabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  tabId?: string;
  controlsId?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  title?: string;
  ariaLabel?: string;
  disabled?: boolean;
  tabClassName?: string | ((isActive: boolean) => string);
  tabStyle?: React.CSSProperties | ((isActive: boolean) => React.CSSProperties | undefined);
}

export interface AtlasTabListProps<T extends string = string> {
  items: readonly AtlasTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  id?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  getTabClassName?: (item: AtlasTabItem<T>, isActive: boolean, index: number) => string;
  getTabStyle?: (item: AtlasTabItem<T>, isActive: boolean, index: number) => React.CSSProperties | undefined;
  renderActiveIndicator?: (item: AtlasTabItem<T>, index: number) => React.ReactNode;
  renderItem?: (ctx: {
    item: AtlasTabItem<T>;
    isActive: boolean;
    index: number;
    activeIndicator: React.ReactNode;
  }) => React.ReactNode;
  scrollActiveIntoView?: boolean;
}

export function AtlasTabList<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  id,
  orientation = 'horizontal',
  className = '',
  getTabClassName,
  getTabStyle,
  renderActiveIndicator,
  renderItem,
  scrollActiveIntoView = true,
}: AtlasTabListProps<T>) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (!scrollActiveIntoView) return;
    const activeIndex = items.findIndex((item) => item.id === value);
    if (activeIndex < 0) return;
    const activeEl = tabRefs.current[activeIndex];
    if (activeEl && typeof activeEl.scrollIntoView === 'function') {
      activeEl.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }
  }, [value, items, scrollActiveIntoView]);

  const tabIds = items.map((item) => item.id);

  return (
    <div
      id={id}
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      className={className}
    >
      {items.map((item, idx) => {
        const isActive = item.id === value;
        const resolvedClassName =
          typeof item.tabClassName === 'function'
            ? item.tabClassName(isActive)
            : item.tabClassName ?? (getTabClassName ? getTabClassName(item, isActive, idx) : '');
        const resolvedStyle =
          typeof item.tabStyle === 'function'
            ? item.tabStyle(isActive)
            : item.tabStyle ?? (getTabStyle ? getTabStyle(item, isActive, idx) : undefined);
        const activeIndicator = isActive && renderActiveIndicator ? renderActiveIndicator(item, idx) : null;

        return (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            type="button"
            id={item.tabId}
            role="tab"
            aria-selected={isActive}
            aria-controls={item.controlsId}
            aria-label={item.ariaLabel}
            title={item.title}
            disabled={item.disabled}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleTabListKeyDown(e, tabIds, idx, onChange, orientation)}
            style={resolvedStyle}
            className={resolvedClassName}
          >
            {renderItem ? (
              renderItem({ item, isActive, index: idx, activeIndicator })
            ) : (
              <>
                {activeIndicator}
                {item.icon}
                {item.label}
                {item.badge}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default AtlasTabList;
