import React from 'react';

interface MicroSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  showPoints?: boolean;
}

export const MicroSparkline: React.FC<MicroSparklineProps> = ({
  data,
  width = 64,
  height = 20,
  color = '#10b981', // Emerald default
  className = '',
  showPoints = true
}) => {
  if (!data || data.length < 2) {
    return (
      <div 
        className={`inline-flex items-center justify-center text-[9px] font-mono text-zinc-400 ${className}`}
        style={{ width, height }}
      >
        —
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const drawWidth = width - padding * 2;
  const drawHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * drawWidth;
    const y = padding + drawHeight - ((val - min) / range) * drawHeight;
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    return `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - padding} L ${points[0].x.toFixed(1)} ${height - padding} Z`;

  const isUpward = data[data.length - 1] >= data[0];
  const strokeColor = color || (isUpward ? '#10b981' : '#f59e0b');

  return (
    <svg 
      width={width} 
      height={height} 
      className={`overflow-visible select-none inline-block ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sparkline-grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      
      {/* Subtle Area Fill */}
      <path 
        d={areaD} 
        fill={`url(#sparkline-grad-${strokeColor.replace('#', '')})`} 
      />

      {/* Main Trend Line */}
      <path 
        d={pathD} 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth={1.5} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Endpoint Pulse Dot */}
      {showPoints && points.length > 0 && (
        <circle 
          cx={points[points.length - 1].x} 
          cy={points[points.length - 1].y} 
          r={2} 
          fill={strokeColor} 
          className="animate-pulse" 
        />
      )}
    </svg>
  );
};

export default MicroSparkline;
