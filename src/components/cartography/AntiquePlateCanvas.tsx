import React, { useState, useEffect } from 'react';
import { HistoricalMapPlate } from '../../data/archivalCartographyData';
import { Compass, Sparkles, AlertCircle } from 'lucide-react';

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

  // Build candidate URL list with local asset priority
  const urls: string[] = [
    isThumbnail ? plate.thumbnailUrl : plate.imageUrl,
    plate.imageUrl,
    plate.thumbnailUrl,
    ...(plate.fallbackUrls || [])
  ].filter(Boolean);

  useEffect(() => {
    setImageIdx(0);
    setHasFailedAll(false);
  }, [plate.id, isThumbnail]);

  const handleImageError = () => {
    if (imageIdx < urls.length - 1) {
      setImageIdx(prev => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const currentSrc = urls[imageIdx];

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#F2EDE4] dark:bg-[#1a1714] select-none ${className}`}>
      {/* 1. Only show Vector Archival Map if all image sources fail */}
      {hasFailedAll ? (
        <svg
          viewBox="0 0 1000 900"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Aged Parchment Gradient */}
            <radialGradient id={`parchmentBg-${plate.id}-${isThumbnail ? 'thumb' : 'full'}`} cx="50%" cy="48%" r="65%">
              <stop offset="0%" stopColor="#F9F5EB" />
              <stop offset="70%" stopColor="#EFE5D3" />
              <stop offset="100%" stopColor="#DFCDB3" />
            </radialGradient>

            {/* Graticule / Rhumb Line Pattern */}
            <pattern id={`rhumbGrid-${plate.id}`} width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 100 M 0 0 L 100 100" fill="none" stroke="#CBB99E" strokeWidth="0.35" strokeDasharray="3,3" />
            </pattern>
          </defs>

          {/* Parchment Base Sheet */}
          <rect width="1000" height="900" fill={`url(#parchmentBg-${plate.id}-${isThumbnail ? 'thumb' : 'full'})`} />
          <rect width="1000" height="900" fill={`url(#rhumbGrid-${plate.id})`} opacity="0.4" />

          {/* Outer Baroque Frame */}
          <rect x="25" y="25" width="950" height="850" fill="none" stroke="#5A4732" strokeWidth="2.5" />
          <rect x="32" y="32" width="936" height="836" fill="none" stroke="#8C7355" strokeWidth="0.8" />
          <rect x="36" y="36" width="928" height="828" fill="none" stroke="#5A4732" strokeWidth="1.2" strokeDasharray="6,4" />

          {/* Central Rhumb Lines Radiating from Primary Rose */}
          <g stroke="#9E876A" strokeWidth="0.5" opacity="0.45">
            <line x1="280" y1="420" x2="0" y2="420" />
            <line x1="280" y1="420" x2="1000" y2="420" />
            <line x1="280" y1="420" x2="280" y2="0" />
            <line x1="280" y1="420" x2="280" y2="900" />
            <line x1="280" y1="420" x2="0" y2="140" />
            <line x1="280" y1="420" x2="560" y2="700" />
            <line x1="280" y1="420" x2="700" y2="0" />
            <line x1="280" y1="420" x2="0" y2="700" />
          </g>

          {/* Ocean Wave Stippling & Nautical Names */}
          <text x="180" y="520" fill="#7E684D" fontFamily="serif" fontStyle="italic" fontSize="15" letterSpacing="4" opacity="0.75" transform="rotate(-30 180 520)">
            OCEANUS AETHIOPICUS
          </text>
          <text x="120" y="250" fill="#7E684D" fontFamily="serif" fontStyle="italic" fontSize="13" letterSpacing="3" opacity="0.7" transform="rotate(-15 120 250)">
            OCEANUS OCCIDENTALIS
          </text>
          <text x="760" y="650" fill="#7E684D" fontFamily="serif" fontStyle="italic" fontSize="14" letterSpacing="3" opacity="0.7" transform="rotate(25 760 650)">
            OCEANUS ORIENTALIS
          </text>

          {/* Hand-Engraved African Continental Silhouette & Coastal Hachures */}
          <g id="antiqueLandmass">
            {/* Coastal Hachure Shading (Engraving buffer) */}
            <path
              d="M 440 90 Q 470 85 530 95 Q 600 120 680 150 Q 730 200 780 290 Q 820 380 810 440 Q 780 470 750 510 Q 720 570 710 650 Q 690 730 630 790 Q 570 840 520 840 Q 470 830 450 780 Q 430 700 450 600 Q 440 530 420 510 Q 380 500 340 500 Q 270 480 220 440 Q 200 410 230 350 Q 270 300 300 240 Q 350 160 380 120 Z"
              fill="none"
              stroke="#C0AA88"
              strokeWidth="8"
              strokeLinejoin="round"
              opacity="0.6"
            />

            {/* Continental Land Mass Fill */}
            <path
              d="M 440 90 Q 470 85 530 95 Q 600 120 680 150 Q 730 200 780 290 Q 820 380 810 440 Q 780 470 750 510 Q 720 570 710 650 Q 690 730 630 790 Q 570 840 520 840 Q 470 830 450 780 Q 430 700 450 600 Q 440 530 420 510 Q 380 500 340 500 Q 270 480 220 440 Q 200 410 230 350 Q 270 300 300 240 Q 350 160 380 120 Z"
              fill="#EFE4CD"
              stroke="#533D26"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Madagascar Island */}
            <path
              d="M 780 620 Q 810 600 820 630 Q 810 700 770 750 Q 750 740 760 690 Z"
              fill="#EFE4CD"
              stroke="#533D26"
              strokeWidth="1.8"
            />
            <text x="785" y="680" fill="#6A5137" fontFamily="serif" fontSize="9" fontStyle="italic" transform="rotate(55 785 680)">
              Madagascar
            </text>
          </g>

          {/* Antique Historical Regional Toponyms Engraved on Map */}
          <g fill="#43311E" fontFamily="serif" fontWeight="bold" textAnchor="middle">
            <text x="500" y="150" fontSize="15" letterSpacing="5">BARBARIA / MAURITANIA</text>
            <text x="490" y="240" fontSize="17" letterSpacing="7" fill="#5A3F24">N I G R I T I E</text>
            <text x="490" y="270" fontSize="11" fontStyle="italic" fill="#6E5132">Terra Incognita</text>
            <text x="320" y="440" fontSize="13" letterSpacing="3">GUINEA</text>
            <text x="330" y="465" fontSize="8" fontStyle="italic" fill="#7C5D3B">Costa d&apos;Oro &amp; Slaves</text>
            <text x="510" y="490" fontSize="14" letterSpacing="4">CONGO REGNUM</text>
            <text x="660" y="360" fontSize="14" letterSpacing="4">AETHIOPIA SUPERIOR</text>
            <text x="680" y="480" fontSize="11" letterSpacing="2" fontStyle="italic">Zanguebar Coast</text>
            <text x="560" y="660" fontSize="14" letterSpacing="4">MONOMOTAPA</text>
            <text x="540" y="720" fontSize="10" fontStyle="italic" fill="#6E5132">Caput Bonae Spei</text>
          </g>

          {/* 16-Point Nautical Compass Rose */}
          <g transform="translate(180, 720) scale(0.85)">
            <circle cx="0" cy="0" r="55" fill="none" stroke="#725B3E" strokeWidth="1" />
            <circle cx="0" cy="0" r="62" fill="none" stroke="#725B3E" strokeWidth="0.5" strokeDasharray="2,2" />
            <polygon points="0,-60 10,-12 0,0" fill="#422E1B" />
            <polygon points="0,-60 -10,-12 0,0" fill="#B39B7C" />
            <polygon points="0,60 10,12 0,0" fill="#B39B7C" />
            <polygon points="0,60 -10,12 0,0" fill="#422E1B" />
            <polygon points="60,0 12,10 0,0" fill="#422E1B" />
            <polygon points="60,0 12,-10 0,0" fill="#B39B7C" />
            <polygon points="-60,0 -12,10 0,0" fill="#B39B7C" />
            <polygon points="-60,0 -12,-10 0,0" fill="#422E1B" />
            <circle cx="0" cy="0" r="5" fill="#422E1B" />
            <text x="0" y="-68" fill="#422E1B" fontFamily="serif" fontWeight="bold" fontSize="13" textAnchor="middle">N</text>
          </g>

          {/* Cartouche Box */}
          <g transform="translate(680, 60)">
            <rect x="0" y="0" width="240" height="150" fill="#F4ECDC" stroke="#48331E" strokeWidth="2" rx="6" />
            <rect x="5" y="5" width="230" height="140" fill="none" stroke="#8D755A" strokeWidth="0.8" rx="4" />
            <text x="120" y="32" fill="#3D2816" fontFamily="serif" fontWeight="bold" fontSize="13" textAnchor="middle">
              AFRICA ANTIQUA
            </text>
            <line x1="30" y1="42" x2="210" y2="42" stroke="#48331E" strokeWidth="0.8" />
            <text x="120" y="60" fill="#583F29" fontFamily="serif" fontStyle="italic" fontSize="10" textAnchor="middle">
              {plate.cartographer}
            </text>
            <text x="120" y="80" fill="#48331E" fontFamily="serif" fontWeight="bold" fontSize="12" textAnchor="middle">
              Anno Domini {plate.year}
            </text>
          </g>
        </svg>
      ) : (
        /* 2. Direct High-Resolution Archival Plate Scan */
        <img
          src={currentSrc}
          alt={plate.title}
          loading="eager"
          decoding="async"
          onError={handleImageError}
          className={`w-full h-full ${
            isThumbnail ? 'object-cover' : 'object-contain'
          }`}
        />
      )}
    </div>
  );
};
