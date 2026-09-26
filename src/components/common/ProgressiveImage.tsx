import React, { useState } from 'react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden bg-stone-200/60 dark:bg-stone-800/60 ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Shimmer Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-200/40 via-stone-300/60 to-stone-200/40 dark:from-stone-800/40 dark:via-stone-700/60 dark:to-stone-800/40 animate-pulse" />
      )}

      {/* Main High-Res Image with smooth fade-in */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />

      {/* Fallback state if image fails */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs font-mono text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-900">
          <span>Image preview unavailable</span>
        </div>
      )}
    </div>
  );
};
