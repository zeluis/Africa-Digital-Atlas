import React from 'react';
import { ArchivalImageViewer } from '../common/ArchivalImageViewer';
import { SlaveTradeIllustration } from '../../data/slaveTradeIllustrations';

interface ArchivalLoupeModalProps {
  illustration: SlaveTradeIllustration | null;
  onClose: () => void;
  illustrationsList?: SlaveTradeIllustration[];
}

export const ArchivalLoupeModal: React.FC<ArchivalLoupeModalProps> = ({
  illustration,
  onClose,
  illustrationsList = []
}) => {
  return (
    <ArchivalImageViewer
      illustration={illustration}
      illustrationsList={illustrationsList}
      onClose={onClose}
      mode="modal"
    />
  );
};
