import React, { useState } from 'react';
import { atlas } from '../data/atlas-store';

interface CountryFlagProps {
  entityId: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showCode?: boolean;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  entityId,
  size = 'md',
  className = '',
  showCode = false
}) => {
  const [hasError, setHasError] = useState(false);
  const media = atlas.getMedia(entityId);
  const entity = atlas.getEntity(entityId);

  const sizeClasses = {
    xs: 'w-4 h-3 text-xs',
    sm: 'w-6 h-4 text-sm',
    md: 'w-8 h-6 text-base',
    lg: 'w-12 h-8 text-xl',
    xl: 'w-16 h-11 text-2xl'
  };

  const iso2 = (entity?.iso2 || entityId.substring(0, 2)).toLowerCase();
  const flagUrl = `https://flagcdn.com/${iso2}.svg`;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div 
        className={`relative overflow-hidden rounded-[3px] border border-zinc-700/60 bg-zinc-800 shadow-sm flex items-center justify-center flex-shrink-0 ${sizeClasses[size]}`}
      >
        {!hasError ? (
          <img
            src={flagUrl}
            alt={`Flag of ${entity?.name || entityId}`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        ) : (
          <span className="select-none font-emoji leading-none" role="img" aria-label={`Flag of ${entity?.name || entityId}`}>
            {media.flagEmoji || '🌍'}
          </span>
        )}
      </div>
      {showCode && (
        <span className="text-xs font-mono font-semibold tracking-wider text-zinc-400">
          {entityId}
        </span>
      )}
    </div>
  );
};
