import React, { useState, useEffect } from 'react';
import { resolveAssetPath, getAssetCandidateUrls } from '../../utils/assetPath';
import { BookOpen } from 'lucide-react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  showParchementPlaceholder?: boolean;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  placeholderSrc,
  className = '',
  containerClassName = '',
  aspectRatio,
  showParchementPlaceholder = true,
  priority = false,
  loading,
  fetchPriority,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  // Generate candidate list from raw src
  const candidates = React.useMemo(() => {
    return getAssetCandidateUrls(src);
  }, [src]);

  useEffect(() => {
    setIsLoaded(false);
    setCandidateIdx(0);
    setHasFailedAll(false);
  }, [src]);

  const currentSrc = candidates[candidateIdx] || resolveAssetPath(src);

  const handleError = () => {
    if (candidateIdx + 1 < candidates.length) {
      setCandidateIdx(prev => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const imgRefCallback = (el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
      setIsLoaded(true);
    }
  };

  const computedLoading = loading || (priority ? 'eager' : 'lazy');
  const computedFetchPriority = fetchPriority || (priority ? 'high' : 'auto');

  return (
    <div 
      className={`relative overflow-hidden bg-[#F2EDE4] dark:bg-[#1a1714] select-none ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* 1. Low-Quality Blur-Up Placeholder (LQIP) / Parchment Canvas Shimmer */}
      {!isLoaded && !hasFailedAll && (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          {placeholderSrc ? (
            <img
              src={resolveAssetPath(placeholderSrc)}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover filter blur-lg scale-110 opacity-70"
            />
          ) : (
            <div className="w-full h-full relative bg-gradient-to-br from-[#F5F0E6] via-[#EADBCE] to-[#DDD0BE] dark:from-stone-900 dark:via-stone-950 dark:to-stone-900">
              {/* Subtle antique parchment grid texture */}
              <div 
                className="absolute inset-0 opacity-[0.08] dark:opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#854d0e 1px, transparent 1px)',
                  backgroundSize: '12px 12px'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100/30 dark:via-amber-900/10 to-transparent animate-pulse" />
              {showParchementPlaceholder && (
                <div className="absolute inset-0 flex items-center justify-center text-amber-900/30 dark:text-amber-100/15">
                  <BookOpen className="w-6 h-6 animate-pulse" />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Main High-Res Image with smooth unblur / immediate display */}
      {!hasFailedAll && (
        <img
          ref={imgRefCallback}
          src={currentSrc}
          alt={alt}
          loading={computedLoading}
          fetchPriority={computedFetchPriority}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`relative z-10 w-full h-full transition-all duration-250 ease-out ${
            isLoaded 
              ? 'opacity-100 filter blur-0 scale-100' 
              : 'opacity-0 filter blur-md scale-105'
          } ${className}`}
          {...props}
        />
      )}

      {/* 3. Fallback state if all candidate URLs fail */}
      {hasFailedAll && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center text-xs font-mono text-stone-500 dark:text-stone-400 bg-[#F4EFE6] dark:bg-stone-900/90 border border-stone-300 dark:border-stone-800">
          <BookOpen className="w-5 h-5 text-amber-800/40 dark:text-amber-400/40 mb-1" />
          <span className="text-[10px] uppercase font-bold tracking-wider">Archival Plate Preserved</span>
          <span className="text-[9px] text-stone-400 dark:text-stone-500 truncate max-w-[90%] mt-0.5">{alt}</span>
        </div>
      )}
    </div>
  );
};

