import { resolveAssetPath } from './assetPath';

export const OFFLINE_ARCHIVE_CACHE_NAME = 'afriata-pinned-archive';

export interface ExtendedArchivePinStatus {
  supported: boolean;
  isPinned: boolean;
  pinnedCount: number;
  totalCount: number;
}

function getExtendedArchiveAssetUrls(): string[] {
  return [
    resolveAssetPath('afriata-ethnic-tree.svg'),
    resolveAssetPath('africa-final.svg'),
    resolveAssetPath('audio/tongues/manifest.json')
  ];
}

export function isExtendedArchivePinSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window && typeof window.caches?.open === 'function';
}

export async function getExtendedArchivePinStatus(): Promise<ExtendedArchivePinStatus> {
  const urls = getExtendedArchiveAssetUrls();
  if (!isExtendedArchivePinSupported()) {
    return {
      supported: false,
      isPinned: false,
      pinnedCount: 0,
      totalCount: urls.length
    };
  }

  try {
    const cache = await window.caches.open(OFFLINE_ARCHIVE_CACHE_NAME);
    const matches = await Promise.all(
      urls.map(async (url) => {
        const hit = await cache.match(url);
        return Boolean(hit);
      })
    );
    const pinnedCount = matches.filter(Boolean).length;
    return {
      supported: true,
      isPinned: pinnedCount === urls.length && urls.length > 0,
      pinnedCount,
      totalCount: urls.length
    };
  } catch {
    return {
      supported: false,
      isPinned: false,
      pinnedCount: 0,
      totalCount: urls.length
    };
  }
}

export async function pinExtendedOfflineArchive(): Promise<{ pinnedCount: number; totalCount: number }> {
  const urls = getExtendedArchiveAssetUrls();
  if (!isExtendedArchivePinSupported()) {
    return { pinnedCount: 0, totalCount: urls.length };
  }

  const cache = await window.caches.open(OFFLINE_ARCHIVE_CACHE_NAME);
  let pinnedCount = 0;

  await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const existing = await cache.match(url);
        if (existing) {
          pinnedCount += 1;
          return;
        }
        const response = await fetch(url, { credentials: 'same-origin' });
        if (response.ok) {
          await cache.put(url, response.clone());
          pinnedCount += 1;
        }
      } catch {
        // Ignore individual asset failure when network is degraded
      }
    })
  );

  // Hydrate deferred archival JSON chunks so Workbox runtime cache stores them for offline inspection
  await Promise.allSettled([
    import('../data/slaveTradeIllustrations').then((m) => m.ensureSlaveTradeIllustrationsHydrated()),
    import('../data/preColonialKingdomsDetailed').then((m) => m.ensureDetailedKingdomsLoaded()),
    import('../data/unescoHeritageRegistry').then((m) => m.ensureUnescoHeritageSitesLoaded())
  ]);

  return {
    pinnedCount,
    totalCount: urls.length
  };
}
