/**
 * AtlasModalContainer.tsx
 * Centralized Modal Orchestrator Container for Africa Data Atlas.
 * Subscribes to useAtlasModalStore and lazily imports only requested modal chunks,
 * ensuring zero impact on initial First Contentful Paint.
 */

import React, { Suspense } from 'react';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import { useAtlasModalStore, AtlasModalType } from '../stores/useAtlasModalStore';

// Lazy-load modal chunks strictly on demand
const SearchModal = lazyWithRetry(
  () => import('./SearchModal').then((m) => ({ default: m.SearchModal })),
  'SearchModal'
);
const MultiSourceApiHubModal = lazyWithRetry(
  () => import('./MultiSourceApiHubModal').then((m) => ({ default: m.MultiSourceApiHubModal })),
  'MultiSourceApiHubModal'
);
const OnboardingModal = lazyWithRetry(
  () => import('./OnboardingModal').then((m) => ({ default: m.OnboardingModal })),
  'OnboardingModal'
);
const KeyboardShortcutsModal = lazyWithRetry(
  () => import('./KeyboardShortcutsModal').then((m) => ({ default: m.KeyboardShortcutsModal })),
  'KeyboardShortcutsModal'
);
const UniversalMonographModal = lazyWithRetry(
  () => import('./UniversalMonographModal').then((m) => ({ default: m.UniversalMonographModal })),
  'UniversalMonographModal'
);
const CartographicColophonModal = lazyWithRetry(
  () => import('./CartographicColophonModal').then((m) => ({ default: m.CartographicColophonModal })),
  'CartographicColophonModal'
);
const WorkingPapersModal = lazyWithRetry(
  () => import('./WorkingPapersModal').then((m) => ({ default: m.WorkingPapersModal })),
  'WorkingPapersModal'
);
const AcademicExportModal = lazyWithRetry(
  () => import('./AcademicExportModal').then((m) => ({ default: m.AcademicExportModal })),
  'AcademicExportModal'
);
const MethodologyAuditModal = lazyWithRetry(
  () => import('./MethodologyAuditModal').then((m) => ({ default: m.MethodologyAuditModal })),
  'MethodologyAuditModal'
);
const AfcftaSimulatorModal = lazyWithRetry(
  () => import('./afcfta/AfcftaSimulatorModal').then((m) => ({ default: m.AfcftaSimulatorModal })),
  'AfcftaSimulatorModal'
);

export interface AtlasModalContainerProps {
  onSelectCountry: (entityId: string) => void;
  onSelectIndicator: (indicatorId: string) => void;
  onSelectTab: (tab: any) => void;
  onToggleTheme?: () => void;
}

export const AtlasModalContainer: React.FC<AtlasModalContainerProps> = ({
  onSelectCountry,
  onSelectIndicator,
  onSelectTab,
  onToggleTheme
}) => {
  const {
    activeModal,
    payload,
    closeModal,
    openAcademicExport,
    openMethodologyAudit
  } = useAtlasModalStore();

  if (!activeModal) return null;

  return (
    <Suspense fallback={null}>
      {activeModal === 'search' && (
        <SearchModal
          isOpen={true}
          onClose={() => closeModal('search')}
          onSelectCountry={onSelectCountry}
          onSelectIndicator={onSelectIndicator}
          onSelectTab={onSelectTab}
        />
      )}

      {activeModal === 'apiHub' && (
        <MultiSourceApiHubModal
          isOpen={true}
          onClose={() => closeModal('apiHub')}
          onSelectIndicator={onSelectIndicator}
        />
      )}

      {activeModal === 'onboarding' && (
        <OnboardingModal
          isOpen={true}
          onClose={() => closeModal('onboarding')}
          onNavigate={(targetTab) => {
            closeModal('onboarding');
            onSelectTab(targetTab);
          }}
        />
      )}

      {activeModal === 'shortcuts' && (
        <KeyboardShortcutsModal
          isOpen={true}
          onClose={() => closeModal('shortcuts')}
          onNavigateTab={(tab) => {
            closeModal('shortcuts');
            onSelectTab(tab);
          }}
          onToggleTheme={onToggleTheme || (() => {})}
        />
      )}

      {activeModal === 'monograph' && (
        <UniversalMonographModal
          isOpen={true}
          onClose={() => closeModal('monograph')}
          onNavigateTab={(tab) => {
            closeModal('monograph');
            onSelectTab(tab);
          }}
        />
      )}

      {activeModal === 'colophon' && (
        <CartographicColophonModal
          isOpen={true}
          onClose={() => closeModal('colophon')}
          onOpenCitationModal={() => openAcademicExport()}
          onOpenMethodologyAudit={() => openMethodologyAudit()}
        />
      )}

      {activeModal === 'workingPapers' && (
        <WorkingPapersModal
          isOpen={true}
          onClose={() => closeModal('workingPapers')}
          onOpenCitationModal={() => openAcademicExport()}
          onSelectReport={(reportId) => {
            closeModal('workingPapers');
            onSelectTab(reportId);
          }}
        />
      )}

      {activeModal === 'methodologyAudit' && (
        <MethodologyAuditModal
          isOpen={true}
          onClose={() => closeModal('methodologyAudit')}
          onOpenCitationModal={() => openAcademicExport()}
        />
      )}

      {activeModal === 'afcftaSimulator' && (
        <AfcftaSimulatorModal
          isOpen={true}
          onClose={() => closeModal('afcftaSimulator')}
          onSelectCountry={onSelectCountry}
        />
      )}

      {activeModal === 'academicExport' && (
        <AcademicExportModal
          isOpen={true}
          onClose={() => closeModal('academicExport')}
          title={payload?.title || 'Africa Data Atlas & Cartographic Observatory'}
          sourceContext={
            payload?.sourceContext ||
            'An interactive atlas of geography, indicators and historical trade flows'
          }
        />
      )}
    </Suspense>
  );
};

export default AtlasModalContainer;
