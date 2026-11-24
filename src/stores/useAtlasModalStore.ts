/**
 * useAtlasModalStore.ts
 * Centralized Lightweight Modal Orchestration Store for Africa Data Atlas.
 * Provides unified, decoupled modal lifecycle management across all views,
 * preventing duplicate state declarations and enabling lazy chunk loading.
 */

import { useSyncExternalStore } from 'react';
import type { ResearchReport } from '../data/reportsData';
import type { AfriataReport } from '../types/afriataReport';
import { readStorageString } from '../utils/storageCache';

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
  | 'monograph'
  | 'citePublication'
  | 'doiVerification';

export interface AcademicExportPayload {
  title?: string;
  sourceContext?: string;
  citationMetadata?: {
    authors?: string[];
    year?: number;
    datasetName?: string;
    url?: string;
    doi?: string;
    version?: string;
  };
  svgContainerId?: string;
}

export interface CitePublicationPayload {
  report: ResearchReport | AfriataReport;
}

export interface DoiVerificationPayload {
  initialReportId?: string;
}

export type AtlasModalPayload =
  | AcademicExportPayload
  | CitePublicationPayload
  | DoiVerificationPayload
  | null;

export interface AtlasModalState {
  activeModal: AtlasModalType | null;
  payload: AtlasModalPayload;
}

type Listener = () => void;

class AtlasModalStore {
  private state: AtlasModalState = {
    activeModal: null,
    payload: null
  };

  private listeners = new Set<Listener>();

  private hasManualInteraction = false;

  constructor() {
    // Schedule first-visit onboarding modal after initial paint/idle so OnboardingModal chunk
    // does not block initial mount or First Contentful Paint.
    if (typeof window !== 'undefined') {
      const hasVisited =
        readStorageString('afriata_onboarding_v1', undefined, {
          legacyKey: 'africalia_onboarding_v1',
        }) === 'true';
      if (!hasVisited) {
        const triggerOnboarding = () => {
          if (!this.hasManualInteraction && this.state.activeModal === null) {
            this.state = {
              activeModal: 'onboarding',
              payload: null
            };
            this.notify();
          }
        };
        const ric = (window as Window & {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        }).requestIdleCallback;
        if (typeof ric === 'function') {
          ric(triggerOnboarding, { timeout: 600 });
        } else {
          globalThis.setTimeout(triggerOnboarding, 150);
        }
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

  public openModal = (modal: AtlasModalType, payload: AtlasModalPayload = null) => {
    this.hasManualInteraction = true;
    this.state = {
      activeModal: modal,
      payload
    };
    this.notify();
  };

  public closeModal = (modal?: AtlasModalType) => {
    this.hasManualInteraction = true;
    if (!modal || this.state.activeModal === modal) {
      this.state = {
        activeModal: null,
        payload: null
      };
      this.notify();
    }
  };

  public closeAllModals = () => {
    this.hasManualInteraction = true;
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
  public openCitePublication = (report: ResearchReport | AfriataReport) =>
    this.openModal('citePublication', { report });
  public openDoiVerification = (initialReportId?: string) =>
    this.openModal('doiVerification', initialReportId ? { initialReportId } : null);
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
    openMonograph: atlasModalStore.openMonograph,
    openCitePublication: atlasModalStore.openCitePublication,
    openDoiVerification: atlasModalStore.openDoiVerification
  };
}

export default useAtlasModalStore;
