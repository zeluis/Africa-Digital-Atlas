import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

export interface AtlasSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface AtlasSelectProps {
  id?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
  options?: AtlasSelectOption[];
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  accent?: 'amber' | 'emerald' | 'indigo' | 'stone';
  size?: 'xs' | 'sm' | 'md';
  variant?: 'default' | 'ghost';
  placeholder?: string;
  title?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'data-testid'?: string;
}

function extractNodeText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractNodeText).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractNodeText(node.props.children);
  }
  return '';
}

function parseOptionsFromChildren(
  children: React.ReactNode,
  groupLabel?: string
): AtlasSelectOption[] {
  const parsed: AtlasSelectOption[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === React.Fragment) {
      const fragProps = child.props as { children?: React.ReactNode };
      parsed.push(...parseOptionsFromChildren(fragProps.children, groupLabel));
      return;
    }

    if (child.type === 'optgroup') {
      const groupProps = child.props as { label?: string; children?: React.ReactNode };
      parsed.push(...parseOptionsFromChildren(groupProps.children, groupProps.label));
      return;
    }

    if (child.type === 'option') {
      const optProps = child.props as {
        value?: string | number;
        disabled?: boolean;
        children?: React.ReactNode;
      };
      const label = extractNodeText(optProps.children).trim();
      const val =
        optProps.value !== undefined && optProps.value !== null
          ? String(optProps.value)
          : label;
      parsed.push({
        value: val,
        label: label || val,
        disabled: Boolean(optProps.disabled),
        group: groupLabel,
      });
    }
  });
  return parsed;
}

const SIZE_CLASSES: Record<NonNullable<AtlasSelectProps['size']>, string> = {
  xs: 'text-[11px] py-1 ps-2.5 pe-2 rounded-lg',
  sm: 'text-xs py-2 ps-3 pe-2.5 rounded-xl',
  md: 'text-xs py-2.5 ps-3.5 pe-3 rounded-xl',
};

const VARIANT_CLASSES: Record<NonNullable<AtlasSelectProps['variant']>, string> = {
  default:
    'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/90 text-zinc-900 dark:text-zinc-100 shadow-2xs',
  ghost:
    'bg-transparent border border-transparent text-inherit hover:bg-black/5 dark:hover:bg-white/5',
};

export const AtlasSelect: React.FC<AtlasSelectProps> = ({
  id,
  name,
  value,
  defaultValue,
  onChange,
  children,
  options: optionsProp,
  disabled = false,
  className = '',
  menuClassName = '',
  accent = 'amber',
  size = 'sm',
  variant = 'default',
  placeholder,
  title,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'data-testid': dataTestId,
}) => {
  const reactId = useId();
  const listboxId = `atlas-select-listbox-${reactId}`;
  const prefersReducedMotion = useReducedMotion();

  const parsedOptions = useMemo(
    () => (optionsProp ? optionsProp : parseOptionsFromChildren(children)),
    [optionsProp, children]
  );

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
    if (defaultValue !== undefined) return String(defaultValue);
    return parsedOptions.find((o) => !o.disabled)?.value ?? '';
  });

  const currentValue = isControlled ? String(value) : uncontrolledValue;

  const selectedIndex = useMemo(
    () => parsedOptions.findIndex((o) => o.value === currentValue),
    [parsedOptions, currentValue]
  );

  const selectedOption =
    selectedIndex >= 0
      ? parsedOptions[selectedIndex]
      : parsedOptions[0];

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(() =>
    selectedIndex >= 0 ? selectedIndex : 0
  );
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [trackStyle, setTrackStyle] = useState<{ y: number; h: number; visible: boolean }>({
    y: 0,
    h: 0,
    visible: false,
  });

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Map<number, HTMLButtonElement | null>>(new Map());
  const suppressNextClickRef = useRef(false);
  const typeAheadBufferRef = useRef('');
  const typeAheadTimerRef = useRef<number | null>(null);
  const prevValueRef = useRef(currentValue);
  const [valueSlideTick, setValueSlideTick] = useState(0);

  useEffect(() => {
    if (prevValueRef.current !== currentValue) {
      prevValueRef.current = currentValue;
      setValueSlideTick((t) => t + 1);
    }
  }, [currentValue]);

  const computeMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger || typeof window === 'undefined') return;

    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 6;
    const viewportMargin = 8;

    const spaceBelow = vh - rect.bottom - viewportMargin;
    const spaceAbove = rect.top - viewportMargin;
    const estimatedHeight = Math.min(320, parsedOptions.length * 34 + 14);

    const openTop = spaceBelow < Math.min(200, estimatedHeight) && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      140,
      Math.min(320, (openTop ? spaceAbove : spaceBelow) - gap)
    );

    const desiredMinWidth = Math.max(rect.width, 168);
    const maxAllowedWidth = Math.max(168, vw - viewportMargin * 2);
    const minWidth = Math.min(desiredMinWidth, maxAllowedWidth);
    const maxWidth = Math.min(Math.max(rect.width + 64, 340), maxAllowedWidth);

    const isRtl =
      typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

    let left = isRtl ? rect.right - minWidth : rect.left;
    if (left + minWidth > vw - viewportMargin) {
      left = vw - viewportMargin - minWidth;
    }
    if (left < viewportMargin) {
      left = viewportMargin;
    }

    setPlacement(openTop ? 'top' : 'bottom');
    setMenuStyle({
      left: `${Math.round(left)}px`,
      ...(openTop
        ? {
            bottom: `${Math.round(vh - rect.top + gap)}px`,
            top: 'auto',
          }
        : {
            top: `${Math.round(rect.bottom + gap)}px`,
            bottom: 'auto',
          }),
      minWidth: `${Math.round(minWidth)}px`,
      maxWidth: `${Math.round(maxWidth)}px`,
      maxHeight: `${Math.round(maxHeight)}px`,
    });
  }, [parsedOptions.length]);

  const hasPopoverCapability =
    typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

  const supportsNativePopover = useCallback(() => hasPopoverCapability, [hasPopoverCapability]);

  const openMenu = useCallback(() => {
    if (disabled || parsedOptions.length === 0) return;
    computeMenuPosition();
    const initialIdx =
      selectedIndex >= 0 && !parsedOptions[selectedIndex]?.disabled
        ? selectedIndex
        : Math.max(
            0,
            parsedOptions.findIndex((o) => !o.disabled)
          );
    setHighlightedIndex(initialIdx);

    const el = popoverRef.current as
      | (HTMLDivElement & { showPopover?: () => void; matches: (s: string) => boolean })
      | null;
    if (el && typeof el.showPopover === 'function') {
      try {
        if (!el.matches(':popover-open')) {
          el.showPopover();
        }
      } catch {
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  }, [computeMenuPosition, disabled, parsedOptions, selectedIndex]);

  const closeMenu = useCallback((returnFocus = false) => {
    const el = popoverRef.current as
      | (HTMLDivElement & { hidePopover?: () => void; matches: (s: string) => boolean })
      | null;
    if (el && typeof el.hidePopover === 'function') {
      try {
        if (el.matches(':popover-open')) {
          el.hidePopover();
        }
      } catch {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
    if (returnFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  const commitSelection = useCallback(
    (opt: AtlasSelectOption) => {
      if (opt.disabled) return;
      if (!isControlled) {
        setUncontrolledValue(opt.value);
      }
      if (onChange && opt.value !== currentValue) {
        const syntheticEvent = {
          target: { value: opt.value, name: name ?? '' },
          currentTarget: { value: opt.value, name: name ?? '' },
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
      closeMenu(true);
    },
    [closeMenu, currentValue, isControlled, name, onChange]
  );

  // Sync native Top-Layer toggle events back into React state
  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;

    const handleToggle = (e: Event) => {
      const toggleEvent = e as Event & { newState?: 'open' | 'closed' };
      const openNow = toggleEvent.newState === 'open';
      setIsOpen(openNow);
      if (openNow) {
        computeMenuPosition();
      }
    };

    el.addEventListener('toggle', handleToggle);
    return () => el.removeEventListener('toggle', handleToggle);
  }, [computeMenuPosition]);

  // Fallback outside click & Escape when native popover API is unavailable
  useEffect(() => {
    if (!isOpen || supportsNativePopover()) return;

    const handleDocPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };
    const handleDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
      }
    };

    document.addEventListener('pointerdown', handleDocPointerDown);
    document.addEventListener('keydown', handleDocKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleDocPointerDown);
      document.removeEventListener('keydown', handleDocKeyDown);
    };
  }, [closeMenu, isOpen, supportsNativePopover]);

  // Keep menu anchored cleanly on scroll / viewport resize
  useEffect(() => {
    if (!isOpen) return;
    const handleReposition = () => computeMenuPosition();
    window.addEventListener('resize', handleReposition, { passive: true });
    window.addEventListener('scroll', handleReposition, { capture: true, passive: true });
    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, { capture: true });
    };
  }, [computeMenuPosition, isOpen]);

  // Measure active option position for the sliding highlight track
  useLayoutEffect(() => {
    if (!isOpen) {
      setTrackStyle((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const measure = () => {
      const activeBtn = optionRefs.current.get(highlightedIndex);
      if (!activeBtn) {
        setTrackStyle((prev) => ({ ...prev, visible: false }));
        return;
      }
      setTrackStyle({
        y: activeBtn.offsetTop,
        h: activeBtn.offsetHeight,
        visible: true,
      });
    };

    measure();
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [isOpen, highlightedIndex, parsedOptions]);

  // Scroll highlighted option into view on open or keyboard stepping
  useEffect(() => {
    if (!isOpen) return;
    const btn = optionRefs.current.get(highlightedIndex);
    if (btn) {
      btn.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, highlightedIndex]);

  const moveHighlight = useCallback(
    (step: 1 | -1) => {
      if (parsedOptions.length === 0) return;
      let next = highlightedIndex;
      for (let i = 0; i < parsedOptions.length; i++) {
        next = (next + step + parsedOptions.length) % parsedOptions.length;
        if (!parsedOptions[next]?.disabled) {
          setHighlightedIndex(next);
          return;
        }
      }
    },
    [highlightedIndex, parsedOptions]
  );

  const jumpHighlightEdge = useCallback(
    (edge: 'first' | 'last') => {
      if (parsedOptions.length === 0) return;
      const indices =
        edge === 'first'
          ? parsedOptions.map((_, i) => i)
          : parsedOptions.map((_, i) => parsedOptions.length - 1 - i);
      const found = indices.find((idx) => !parsedOptions[idx]?.disabled);
      if (found !== undefined) setHighlightedIndex(found);
    },
    [parsedOptions]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            moveHighlight(1);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            moveHighlight(-1);
          }
          break;
        }
        case 'Home': {
          if (isOpen) {
            e.preventDefault();
            jumpHighlightEdge('first');
          }
          break;
        }
        case 'End': {
          if (isOpen) {
            e.preventDefault();
            jumpHighlightEdge('last');
          }
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          if (!isOpen) {
            openMenu();
          } else {
            const opt = parsedOptions[highlightedIndex];
            if (opt && !opt.disabled) {
              commitSelection(opt);
            }
          }
          break;
        }
        case 'Escape': {
          if (isOpen) {
            e.preventDefault();
            closeMenu(true);
          }
          break;
        }
        case 'Tab': {
          if (isOpen) {
            closeMenu(false);
          }
          break;
        }
        default: {
          // Type-ahead option jump
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (typeAheadTimerRef.current !== null) {
              window.clearTimeout(typeAheadTimerRef.current);
            }
            typeAheadBufferRef.current += e.key.toLowerCase();
            const query = typeAheadBufferRef.current;
            typeAheadTimerRef.current = window.setTimeout(() => {
              typeAheadBufferRef.current = '';
            }, 550);

            const matchIdx = parsedOptions.findIndex(
              (o) => !o.disabled && o.label.toLowerCase().startsWith(query)
            );
            if (matchIdx >= 0) {
              if (!isOpen) {
                commitSelection(parsedOptions[matchIdx]);
              } else {
                setHighlightedIndex(matchIdx);
              }
            }
          }
          break;
        }
      }
    },
    [
      closeMenu,
      commitSelection,
      disabled,
      highlightedIndex,
      isOpen,
      jumpHighlightEdge,
      moveHighlight,
      openMenu,
      parsedOptions,
    ]
  );

  const handleTriggerPointerDown = () => {
    if (isOpen) {
      // Native popover="auto" light-dismisses on pointerdown before click fires.
      suppressNextClickRef.current = true;
    }
  };

  const handleTriggerClick = () => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      if (isOpen) closeMenu(false);
      return;
    }
    if (isOpen) {
      closeMenu(false);
    } else {
      openMenu();
    }
  };

  const activeOptionDomId =
    isOpen && parsedOptions[highlightedIndex]
      ? `${listboxId}-opt-${highlightedIndex}`
      : undefined;

  const displayLabel = selectedOption?.label ?? placeholder ?? '';

  // Render grouped or flat options cleanly while maintaining flat index refs
  const renderedRows = useMemo(() => {
    const items: React.ReactNode[] = [];
    let lastGroup: string | undefined;

    parsedOptions.forEach((opt, idx) => {
      if (opt.group && opt.group !== lastGroup) {
        lastGroup = opt.group;
        items.push(
          <div
            key={`group-${opt.group}-${idx}`}
            role="presentation"
            className="px-2.5 pt-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 select-none"
          >
            {opt.group}
          </div>
        );
      }

      const isSelected = opt.value === currentValue;
      items.push(
        <button
          key={`${opt.value}-${idx}`}
          ref={(node) => {
            optionRefs.current.set(idx, node);
          }}
          id={`${listboxId}-opt-${idx}`}
          type="button"
          role="option"
          aria-selected={isSelected}
          disabled={opt.disabled}
          onMouseEnter={() => {
            if (!opt.disabled) setHighlightedIndex(idx);
          }}
          onFocus={() => {
            if (!opt.disabled) setHighlightedIndex(idx);
          }}
          onClick={() => commitSelection(opt)}
          className="atlas-select-option focus-visible:outline-none"
        >
          <span className="truncate">{opt.label}</span>
          <Check
            className={`atlas-select-check w-3.5 h-3.5 ${
              isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
            aria-hidden="true"
          />
        </button>
      );
    });

    return items;
  }, [commitSelection, currentValue, listboxId, parsedOptions]);

  const popoverNode = (
    <div
      ref={popoverRef}
      id={listboxId}
      role="listbox"
      aria-label={ariaLabel || 'Options'}
      aria-activedescendant={activeOptionDomId}
      popover="auto"
      data-placement={placement}
      data-accent={accent}
      data-fallback-open={!hasPopoverCapability && isOpen ? 'true' : undefined}
      style={menuStyle}
      onKeyDown={handleKeyDown}
      className={`atlas-select-popover sleek-scrollbar z-50 ${menuClassName}`}
    >
      <div ref={listRef} className="atlas-select-list">
        <div
          aria-hidden="true"
          className="atlas-select-highlight-track"
          style={{
            opacity: trackStyle.visible ? 1 : 0,
            height: `${trackStyle.h}px`,
            transform: `translate3d(0, ${trackStyle.y}px, 0)`,
          }}
        />
        {renderedRows}
      </div>
    </div>
  );

  return (
    <>
      {name ? <input type="hidden" name={name} value={currentValue} /> : null}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionDomId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-testid={dataTestId}
        data-accent={accent}
        data-variant={variant}
        disabled={disabled}
        title={title ?? displayLabel}
        onPointerDown={handleTriggerPointerDown}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        className={`atlas-select-trigger cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 disabled:opacity-50 disabled:cursor-not-allowed ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`}
      >
        <span
          key={!prefersReducedMotion && valueSlideTick > 0 ? `${currentValue}-${valueSlideTick}` : 'static'}
          className={`min-w-0 truncate ${
            !prefersReducedMotion && valueSlideTick > 0 ? 'atlas-select-value-animated' : ''
          }`}
        >
          {displayLabel}
        </span>
        <ChevronDown className="atlas-select-chevron w-3.5 h-3.5 opacity-65" aria-hidden="true" />
      </button>
      {typeof document !== 'undefined' ? createPortal(popoverNode, document.body) : popoverNode}
    </>
  );
};

export default AtlasSelect;
