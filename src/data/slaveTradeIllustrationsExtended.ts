export interface CompactIllustrationRecord {
  objectId: number;
  title: string;
  cardId: number;
  cardTitle: string;
  thumb: string;
}

export const extendedIllustrationsJsonAssetUrl = new URL(
  './slaveTradeIllustrationsExtended.json',
  import.meta.url
).href;

export const EXTENDED_ILLUSTRATION_RECORDS: CompactIllustrationRecord[] = [];

export function mapCompactToFullIllustration(compact: CompactIllustrationRecord): any {
  // Convert si.regeneratedidentities.org small thumb (-2.jpg) to larger image (-4.jpg) if possible
  const rawUrl = compact.thumb;
  const largeUrl = rawUrl.replace('-2.jpg', '-4.jpg');

  return {
    objectId: compact.objectId,
    sourceFile: `image-objectid=${compact.objectId}.html`,
    sourceSha256: '',
    title: compact.title,
    regId: `SI-OB-${compact.objectId}`,
    date: compact.title.match(/\d{4}s?/) ? compact.title.match(/\d{4}s?/)?.[0] : undefined,
    source:
      'Slavery Images: A Visual Record of the African Slave Trade and Slave Life (si.regeneratedidentities.org), item ' +
      compact.objectId,
    language: 'English',
    itemSets: [compact.cardTitle],
    spatialCoverage: [],
    reproducedIn: 'Slavery Images Archive',
    researchers: ['Jerome Handler', 'Michael Tuite', 'Henry B. Lovejoy'],
    identifier: `SI-OB-${compact.objectId}`,
    imageUrls: [largeUrl],
    externalAssetLinks: [
      {
        url: `https://si.regeneratedidentities.org/project/DataFiles/SI-OB-${compact.objectId}/${compact.objectId}-1.tif`,
        text: `SI-OB-${compact.objectId}_${compact.title}.tif`,
        download: true
      },
      {
        url: largeUrl,
        text: 'Enlarge Original Scan',
        download: false
      }
    ],
    backgroundImagePath: `DataFiles/SI-OB-${compact.objectId}/${compact.objectId}-4.jpg`,
    backgroundImageUrl: largeUrl,
    coordinates: [],
    collectionIds: [compact.cardId],
    collectionNames: [compact.cardTitle]
  };
}
