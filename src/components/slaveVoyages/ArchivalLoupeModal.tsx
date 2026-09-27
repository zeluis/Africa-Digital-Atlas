import React, { useState, useEffect, useMemo } from 'react';
import { ArchivalImageViewer } from '../common/ArchivalImageViewer';
import { SlaveTradeIllustration } from '../../data/slaveTradeIllustrations';
import { resolveAssetPath } from '../../utils/assetPath';

interface ArchivalLoupeModalProps {
  illustration: SlaveTradeIllustration | null;
  onClose: () => void;
  illustrationsList?: SlaveTradeIllustration[];
  onSelectIllustration?: (item: SlaveTradeIllustration) => void;
}

/**
 * Defensive sanitizer ensuring all archival plate image URLs pass through
 * resolveAssetPath for robust GitHub Pages and subpath resolution.
 */
const sanitizeIllustration = (item: SlaveTradeIllustration | null): SlaveTradeIllustration | null => {
  if (!item) return null;
  const urls = item.imageUrls && item.imageUrls.length > 0 
    ? item.imageUrls.map(url => resolveAssetPath(url))
    : ['https://si.regeneratedidentities.org/project/DataFiles/SI-OB-17/17-4.jpg'];
  return {
    ...item,
    imageUrls: urls
  };
};

export const ArchivalLoupeModal: React.FC<ArchivalLoupeModalProps> = ({
  illustration,
  onClose,
  illustrationsList = [],
  onSelectIllustration
}) => {
  const [currentIllustration, setCurrentIllustration] = useState<SlaveTradeIllustration | null>(() =>
    sanitizeIllustration(illustration)
  );

  useEffect(() => {
    setCurrentIllustration(sanitizeIllustration(illustration));
  }, [illustration]);

  // Sanitize all items in illustrationsList so filmstrip thumbnails and navigation use guarded relative paths
  const sanitizedList = useMemo(() => {
    return illustrationsList.map(item => sanitizeIllustration(item)!);
  }, [illustrationsList]);

  const handleSelect = (item: SlaveTradeIllustration) => {
    const sanitized = sanitizeIllustration(item);
    setCurrentIllustration(sanitized);
    if (sanitized) {
      onSelectIllustration?.(sanitized);
    }
  };

  if (!currentIllustration) return null;

  return (
    <ArchivalImageViewer
      illustration={currentIllustration}
      illustrationsList={sanitizedList}
      onSelectIllustration={handleSelect}
      onClose={onClose}
      mode="modal"
      showThumbnails={true}
    />
  );
};
