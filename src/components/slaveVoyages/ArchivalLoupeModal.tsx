import React, { useState, useEffect } from 'react';
import { ArchivalImageViewer } from '../common/ArchivalImageViewer';
import { SlaveTradeIllustration } from '../../data/slaveTradeIllustrations';

interface ArchivalLoupeModalProps {
  illustration: SlaveTradeIllustration | null;
  onClose: () => void;
  illustrationsList?: SlaveTradeIllustration[];
  onSelectIllustration?: (item: SlaveTradeIllustration) => void;
}

export const ArchivalLoupeModal: React.FC<ArchivalLoupeModalProps> = ({
  illustration,
  onClose,
  illustrationsList = [],
  onSelectIllustration
}) => {
  const [currentIllustration, setCurrentIllustration] = useState<SlaveTradeIllustration | null>(illustration);

  useEffect(() => {
    setCurrentIllustration(illustration);
  }, [illustration]);

  const handleSelect = (item: SlaveTradeIllustration) => {
    setCurrentIllustration(item);
    onSelectIllustration?.(item);
  };

  if (!currentIllustration) return null;

  return (
    <ArchivalImageViewer
      illustration={currentIllustration}
      illustrationsList={illustrationsList}
      onSelectIllustration={handleSelect}
      onClose={onClose}
      mode="modal"
      showThumbnails={true}
    />
  );
};
