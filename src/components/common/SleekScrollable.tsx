import React, { ReactNode } from 'react';

export interface SleekScrollableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  height?: string;
  maxHeight?: string;
  showBottomFade?: boolean;
  fadeHeight?: string;
  fadeGradientClass?: string;
  variant?: 'default' | 'amber';
  contentClassName?: string;
}

/**
 * Reusable Sleek Scrollable Container
 * Incorporates:
 * - Hover-Expanded Floating Scrollbar (thin 4px idle ribbon, expands to 8px grab-bar on hover)
 * - Anti-layout shift via `scrollbar-gutter: stable`
 * - Click-Through Bottom Fade Overlay via `pointer-events-none`
 */
export const SleekScrollable: React.FC<SleekScrollableProps> = ({
  children,
  height = 'h-full',
  maxHeight,
  showBottomFade = true,
  fadeHeight = 'h-10 sm:h-12',
  fadeGradientClass = 'from-[#FAF7F2] dark:from-[#1E1B18]',
  variant = 'default',
  contentClassName = '',
  className = '',
  ...rest
}) => {
  const scrollbarClass = variant === 'amber' ? 'sleek-scrollbar-amber' : 'sleek-scrollbar';

  return (
    <div className={`relative w-full overflow-hidden ${className}`} {...rest}>
      {/* Scrollable Container Content Panel */}
      <div 
        className={`
          w-full 
          overflow-y-auto 
          stable-gutter 
          ${scrollbarClass} 
          ${height} 
          ${maxHeight || ''} 
          ${contentClassName}
        `}
      >
        {children}
      </div>

      {/* Click-Through Bottom Fade Overlay */}
      {showBottomFade && (
        <div 
          className={`absolute bottom-0 left-0 right-0 ${fadeHeight} bg-gradient-to-t ${fadeGradientClass} to-transparent pointer-events-none z-10 transition-opacity duration-300`} 
          aria-hidden="true"
        />
      )}
    </div>
  );
};
