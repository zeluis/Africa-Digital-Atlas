import React, { useState, useRef, useEffect, useId } from 'react';
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  type Placement,
} from '@floating-ui/dom';

interface JapandiTooltipProps {
  content: React.ReactNode;
  title?: string;
  regionalAccent?: string;
  children: React.ReactElement<any>;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const JapandiTooltip: React.FC<JapandiTooltipProps> = ({
  content,
  title,
  regionalAccent = '#10b981',
  children,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const [positioned, setPositioned] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = `tooltip-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (!isVisible) {
      setPositioned(false);
      return;
    }

    const referenceEl = triggerRef.current;
    const floatingEl = tooltipRef.current;
    if (!referenceEl || !floatingEl) return;

    let active = true;
    const update = () => {
      computePosition(referenceEl, floatingEl, {
        strategy: 'fixed',
        placement: position as Placement,
        middleware: [
          offset(10),
          flip({ padding: 8 }),
          shift({ padding: 8 }),
        ],
      })
        .then(({ x, y }) => {
          if (!active) return;
          setCoords({ x: Math.round(x), y: Math.round(y) });
          setPositioned(true);
        })
        .catch(() => {});
    };

    const cleanup = autoUpdate(referenceEl, floatingEl, update);
    return () => {
      active = false;
      cleanup();
    };
  }, [isVisible, position]);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? tooltipId : undefined}
      className={`inline-flex relative ${className}`}
    >
      {React.cloneElement(children, {
        tabIndex: children.props.tabIndex ?? 0
      })}

      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={`fixed top-0 left-0 z-50 pointer-events-none max-w-xs transition-opacity duration-150 ease-[var(--ease-japandi)] ${positioned ? 'opacity-100 animate-enter-japandi' : 'opacity-0'}`}
          style={{
            transform: `translate3d(${coords.x}px, ${coords.y}px, 0)`,
          }}
        >
          <div
            className="rounded-2xl p-3 text-xs bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 text-zinc-800 dark:text-zinc-200"
            style={{
              borderTopColor: regionalAccent,
              borderTopWidth: '2.5px'
            }}
          >
            {title && (
              <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5 font-sans">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: regionalAccent }}
                />
                <span>{title}</span>
              </div>
            )}
            <div className="text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed">
              {content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
