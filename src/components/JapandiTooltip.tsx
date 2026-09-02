import React, { useState, useRef, useEffect } from 'react';

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
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substring(2, 9)}`).current;

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleFocus = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: position === 'top' ? rect.top : rect.bottom
    });
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
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
          className="fixed z-50 pointer-events-none max-w-xs transition-all duration-200 ease-[var(--ease-japandi)] animate-enter-japandi"
          style={{
            left: `${coords.x}px`,
            top: position === 'top' ? `${coords.y - 10}px` : `${coords.y + 10}px`,
            transform: position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)'
          }}
        >
          <div
            className="rounded-2xl p-3 text-xs bg-white/90 dark:bg-zinc-950/90 backdrop-blur-[14px] border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 text-zinc-800 dark:text-zinc-200"
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
