import React, { useState, useEffect } from 'react';
import { HistoricalMapPlate } from '../../data/archivalCartographyData';
import { resolveAssetPath } from '../../utils/assetPath';

interface AntiquePlateCanvasProps {
  plate: HistoricalMapPlate;
  isThumbnail?: boolean;
  className?: string;
}

export const AntiquePlateCanvas: React.FC<AntiquePlateCanvasProps> = ({
  plate,
  isThumbnail = false,
  className = ''
}) => {
  const [imageIdx, setImageIdx] = useState<number>(0);
  const [hasFailedAll, setHasFailedAll] = useState<boolean>(false);

  const primaryTarget = isThumbnail ? (plate.thumbnailUrl || plate.imageUrl) : plate.imageUrl;
  const secondaryTarget = plate.imageUrl;

  // Build comprehensive candidate URL list: resolved path, relative, raw, and fallbacks
  const candidateUrls: string[] = Array.from(new Set([
    resolveAssetPath(primaryTarget),
    primaryTarget,
    primaryTarget.startsWith('/') ? `.${primaryTarget}` : `./${primaryTarget}`,
    resolveAssetPath(secondaryTarget),
    secondaryTarget,
    ...(plate.fallbackUrls || []).map(url => resolveAssetPath(url)),
    ...(plate.fallbackUrls || [])
  ])).filter(Boolean);

  useEffect(() => {
    setImageIdx(0);
    setHasFailedAll(false);
  }, [plate.id, isThumbnail, plate.imageUrl, plate.thumbnailUrl]);

  const handleImageError = () => {
    if (imageIdx < candidateUrls.length - 1) {
      setImageIdx(prev => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const currentSrc = candidateUrls[imageIdx];

  // 1. If all image sources fail, show the vector archival parchment canvas
  if (hasFailedAll || !currentSrc) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-[#F2EDE4] dark:bg-[#1a1714] select-none ${className}`}>
        <svg
          viewBox="0 0 1000 900"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id={`parchmentBg-${plate.id}-${isThumbnail ? 'thumb' : 'full'}`} cx="50%" cy="48%" r="65%">
              <stop offset="0%" stopColor="#F9F5EB" />
              <stop offset="70%" stopColor="#EFE5D3" />
              <stop offset="100%" stopColor="#DFCDB3" />
            </radialGradient>
          </defs>

          <rect width="1000" height="900" fill={`url(#parchmentBg-${plate.id}-${isThumbnail ? 'thumb' : 'full'})`} />
          <rect x="25" y="25" width="950" height="850" fill="none" stroke="#5A4732" strokeWidth="2.5" />

          {/* African Continental Silhouette */}
          <path
            d="M 440 90 Q 470 85 530 95 Q 600 120 680 150 Q 730 200 780 290 Q 820 380 810 440 Q 780 470 750 510 Q 720 570 710 650 Q 690 730 630 790 Q 570 840 520 840 Q 470 830 450 780 Q 430 700 450 600 Q 440 530 420 510 Q 380 500 340 500 Q 270 480 220 440 Q 200 410 230 350 Q 270 300 300 240 Q 350 160 380 120 Z"
            fill="#EFE4CD"
            stroke="#533D26"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          <g fill="#43311E" fontFamily="serif" fontWeight="bold" textAnchor="middle">
            <text x="500" y="150" fontSize="18" letterSpacing="4">AFRICA</text>
            <text x="500" y="250" fontSize="14" letterSpacing="3">{plate.cartographer}</text>
            <text x="500" y="300" fontSize="12" fontStyle="italic">({plate.year})</text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. Direct High-Speed Image Element (Thumbnail or Full Resolution)
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#F2EDE4] dark:bg-[#1a1714] select-none ${className}`}>
      <img
        src={currentSrc}
        alt={plate.shortTitle || plate.title}
        loading="eager"
        decoding="async"
        onError={handleImageError}
        draggable={false}
        className={`w-full h-full pointer-events-none select-none ${
          isThumbnail ? 'object-cover' : 'object-contain'
        }`}
      />
    </div>
  );
};
