/**
 * useAtlasModalStore.ts
 * Centralized Lightweight Modal Orchestration Store for Africa Data Atlas.
 * Provides unified, decoupled modal lifecycle management across all views,
 * preventing duplicate state declarations and enabling lazy chunk loading.
 */

import { useSyncExternalStore } from 'react';

export type AtlasModalType =
  | 'search'
  | 'apiHub'
  | 'shortcuts'
  | 'onboarding'
  | 'colophon'
  | 'workingPapers'
  | 'academicExport'
  | 'methodologyAudit'
  | 'afcftaSimulator'
  | 'monograph';

export interface AcademicExportPayload {
  title?: string;
  sourceContext?: string;
}

export interface AtlasModalState {
  activeModal: AtlasModalType | null;
  payload: AcademicExportPayload | null;
}

type Listener = () => void;

class AtlasModalStore {
  private state: AtlasModalState = {
    activeModal: null,
    payload: null
  };

  private listeners = new Set<Listener>();

  constructor() {
    // Auto-open onboarding modal for first-time visitors
    if (typeof window !== 'undefined') {
      try {
        const hasVisited =
          localStorage.getItem('afriata_onboarding_v1') === 'true' ||
          localStorage.getItem('africalia_onboarding_v1') === 'true';
        if (!hasVisited) {
          this.state.activeModal = 'onboarding';
        }
      } catch {
        // LocalStorage access restricted in certain iframe sandboxes
      }
    }
  }

  public getState = (): AtlasModalState => {
    return this.state;
  };

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify = () => {
    this.listeners.forEach((listener) => listener());
  };

  public openModal = (modal: AtlasModalType, payload: AcademicExportPayload | null = null) => {
    this.state = {
      activeModal: modal,
      payload
    };
    this.notify();
  };

  public closeModal = (modal?: AtlasModalType) => {
    if (!modal || this.state.activeModal === modal) {
      this.state = {
        activeModal: null,
        payload: null
      };
      this.notify();
    }
  };

  public closeAllModals = () => {
    this.state = {
      activeModal: null,
      payload: null
    };
    this.notify();
  };

  // Convenient typed helpers
  public openSearch = () => this.openModal('search');
  public openApiHub = () => this.openModal('apiHub');
  public openShortcuts = () => this.openModal('shortcuts');
  public openOnboarding = () => this.openModal('onboarding');
  public openColophon = () => this.openModal('colophon');
  public openWorkingPapers = () => this.openModal('workingPapers');
  public openAcademicExport = (payload?: AcademicExportPayload) =>
    this.openModal('academicExport', payload || null);
  public openMethodologyAudit = () => this.openModal('methodologyAudit');
  public openAfcftaSimulator = () => this.openModal('afcftaSimulator');
  public openMonograph = () => this.openModal('monograph');
}

export const atlasModalStore = new AtlasModalStore();

/**
 * Hook to access current modal state and orchestrator actions in React components
 */
export function useAtlasModalStore() {
  const state = useSyncExternalStore(
    atlasModalStore.subscribe,
    atlasModalStore.getState,
    () => ({ activeModal: null, payload: null })
  );

  return {
    activeModal: state.activeModal,
    payload: state.payload,
    isOpen: (modal: AtlasModalType) => state.activeModal === modal,
    openModal: atlasModalStore.openModal,
    closeModal: atlasModalStore.closeModal,
    closeAllModals: atlasModalStore.closeAllModals,
    openSearch: atlasModalStore.openSearch,
    openApiHub: atlasModalStore.openApiHub,
    openShortcuts: atlasModalStore.openShortcuts,
    openOnboarding: atlasModalStore.openOnboarding,
    openColophon: atlasModalStore.openColophon,
    openWorkingPapers: atlasModalStore.openWorkingPapers,
    openAcademicExport: atlasModalStore.openAcademicExport,
    openMethodologyAudit: atlasModalStore.openMethodologyAudit,
    openAfcftaSimulator: atlasModalStore.openAfcftaSimulator,
    openMonograph: atlasModalStore.openMonograph
  };
}

export default useAtlasModalStore;
