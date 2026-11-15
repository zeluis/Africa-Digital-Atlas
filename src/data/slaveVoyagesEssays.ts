/**
 * slaveVoyagesEssays.ts
 * Curated Historiographical Essays & Introductory Scholarship
 * Grounded in the SlaveVoyages Consortium corpus (Eltis, Richardson, Klein, Lovejoy, Ferreira, Marques)
 */

import { createLazyAssetStore } from '../utils/lazyDataLoader';

export interface SlaveVoyagesEssay {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  authorTitle: string;
  citation: string;
  readingTimeMin: number;
  periodCovered: string;
  primaryRegions: string[];
  pullQuote: string;
  leadParagraph: string;
  sections: {
    heading: string;
    paragraphs: string[];
    figure?: {
      caption: string;
      statLabel: string;
      statValue: string;
    };
  }[];
  sourcesAndFootnotes: string[];
}

const slaveVoyagesEssaysUrl = new URL('./slaveVoyagesEssays.json', import.meta.url).href;

export const SLAVEVOYAGES_ESSAYS: SlaveVoyagesEssay[] = [];

const slaveVoyagesEssaysStore = createLazyAssetStore<SlaveVoyagesEssay[]>(
  [slaveVoyagesEssaysUrl],
  ([payload]) => {
    if (Array.isArray(payload)) {
      SLAVEVOYAGES_ESSAYS.splice(0, SLAVEVOYAGES_ESSAYS.length, ...payload);
    }
    return SLAVEVOYAGES_ESSAYS;
  },
  () => SLAVEVOYAGES_ESSAYS
);

export const ensureSlaveVoyagesEssaysLoaded = slaveVoyagesEssaysStore.ensureLoaded;
export const isSlaveVoyagesEssaysLoaded = slaveVoyagesEssaysStore.isLoaded;
export const subscribeSlaveVoyagesEssays = slaveVoyagesEssaysStore.subscribe;
export const useSlaveVoyagesEssaysLoaded = slaveVoyagesEssaysStore.useLoaded;
