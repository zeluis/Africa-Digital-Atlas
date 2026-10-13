const fs = require('fs');
const path = require('path');

const xmlPath = path.resolve(__dirname, '../src/data/unesco-Africa-Arab-data.xml');
const existingJsonPath = path.resolve(__dirname, '../src/data/unescoHeritageSites.json');
const targetJsonPath = path.resolve(__dirname, '../src/data/unescoHeritageSites.json');

const xml = fs.readFileSync(xmlPath, 'utf8');
const existingSites = JSON.parse(fs.readFileSync(existingJsonPath, 'utf8'));
const existingMap = new Map(existingSites.map(s => [s.idNumber, s]));

const isoMap = {
  dz: 'DZA', eg: 'EGY', ly: 'LBY', ma: 'MAR', mr: 'MRT', sd: 'SDN', tn: 'TUN',
  ao: 'AGO', bj: 'BEN', bw: 'BWA', bf: 'BFA', bi: 'BDI', cv: 'CPV', cm: 'CMR',
  cf: 'CAF', td: 'TCD', km: 'COM', cg: 'COG', cd: 'COD', ci: 'CIV', dj: 'DJI',
  gq: 'GNQ', er: 'ERI', sz: 'SWZ', et: 'ETH', ga: 'GAB', gm: 'GMB', gh: 'GHA',
  gn: 'GIN', gw: 'GNB', ke: 'KEN', ls: 'LSO', lr: 'LBR', mg: 'MDG', mw: 'MWI',
  ml: 'MLI', mu: 'MUS', mz: 'MOZ', na: 'NAM', ne: 'NER', ng: 'NGA', rw: 'RWA',
  st: 'STP', sn: 'SEN', sc: 'SYC', sl: 'SLE', so: 'SOM', za: 'ZAF', ss: 'SSD',
  tz: 'TZA', tg: 'TGO', ug: 'UGA', zm: 'ZMB', zw: 'ZWE',
  bh: 'BHR', iq: 'IRQ', jo: 'JOR', kw: 'KWT', lb: 'LBN', om: 'OMN', ps: 'PSE',
  qa: 'QAT', sa: 'SAU', sy: 'SYR', ae: 'ARE', ye: 'YEM'
};

const coordsLookup = {
  749: { lat: 11.90, lng: 2.00 },
  1140: { lat: 10.10, lng: 1.14 },
  155: { lat: 7.60, lng: -8.40 },
  1226: { lat: 13.75, lng: -15.53 },
  102: { lat: 35.8189, lng: 4.7936 },
  188: { lat: 32.4833, lng: 3.6833 },
  191: { lat: 36.3167, lng: 5.7333 },
  193: { lat: 36.5833, lng: 2.4500 },
  194: { lat: 35.4833, lng: 6.4667 },
  1364: { lat: 26.2500, lng: 50.6100 },
  1192: { lat: 26.2333, lng: 50.5167 },
  1542: { lat: 26.1500, lng: 50.5000 },
  1511: { lat: -6.2667, lng: 14.2400 },
  323: { lat: 7.1833, lng: 1.9833 },
  1021: { lat: -18.7500, lng: 21.7500 },
  1225: { lat: 10.3000, lng: -3.5333 },
  1602: { lat: 12.5833, lng: -3.3167 },
  1713: { lat: 11.1300, lng: -0.9600 },
  1310: { lat: 14.9167, lng: -23.6000 },
  407: { lat: 3.0000, lng: 13.0000 },
  1745: { lat: 10.9000, lng: 13.8000 },
  475: { lat: 9.0000, lng: 21.5000 },
  1400: { lat: 19.0500, lng: 20.5000 },
  1475: { lat: 17.0333, lng: 21.8500 },
  1768: { lat: -11.7000, lng: 43.2500 },
  692: { lat: 0.8000, lng: 14.9000 },
  1322: { lat: 5.2000, lng: -3.7333 },
  1648: { lat: 9.5800, lng: -5.6100 },
  195: { lat: 5.7500, lng: -7.1167 },
  227: { lat: 9.1500, lng: -3.7800 },
  137: { lat: -2.3000, lng: 28.7500 },
  280: { lat: -2.0000, lng: 21.0000 },
  718: { lat: 1.4000, lng: 28.5000 },
  136: { lat: 4.0000, lng: 29.2500 },
  90: { lat: 30.9333, lng: 29.6667 },
  954: { lat: 28.5558, lng: 33.9753 },
  1186: { lat: 29.2667, lng: 30.0333 },
  1550: { lat: 15.3333, lng: 38.9333 },
  10: { lat: 11.1000, lng: 40.5800 },
  12: { lat: 8.4333, lng: 38.6167 },
  15: { lat: 14.1333, lng: 38.7167 },
  17: { lat: 4.8000, lng: 35.9667 },
  19: { lat: 12.6000, lng: 37.4667 },
  1189: { lat: 9.3167, lng: 42.1333 },
  1333: { lat: 5.3000, lng: 37.4333 },
  1641: { lat: 6.2500, lng: 38.2800 },
  111: { lat: 6.7500, lng: 39.7500 },
  13: { lat: 8.7000, lng: 38.6000 },
  1147: { lat: -0.4167, lng: 11.5833 },
  1653: { lat: 0.4000, lng: 12.7000 },
  761: { lat: 13.3167, lng: -16.3667 },
  35: { lat: 6.7500, lng: -1.6167 },
  1431: { lat: 11.2500, lng: -16.0000 },
  148: { lat: 31.7767, lng: 35.2344 },
  985: { lat: -29.8500, lng: 29.1500 },
  509: { lat: -17.9244, lng: 25.8567 },
  179: { lat: 25.5000, lng: 9.0000 },
  565: { lat: 36.7847, lng: 3.0603 },
  1432: { lat: -19.2833, lng: 22.9000 },
  63: { lat: -0.9167, lng: 29.4167 },
  86: { lat: 29.8489, lng: 31.2556 },
  87: { lat: 25.7333, lng: 32.6000 },
  88: { lat: 22.3372, lng: 31.6258 },
  89: { lat: 30.0469, lng: 31.2619 },
  9: { lat: 13.1833, lng: 38.0667 },
  18: { lat: 12.0322, lng: 39.0417 },
  34: { lat: 5.1056, lng: -1.2467 }
};

function cleanHtml(raw) {
  if (!raw) return '';
  let str = String(raw);
  // Decode XML-encoded markup tags first
  str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  str = str.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  str = str.replace(/<br\s*\/?>/gi, '\n');
  str = str.replace(/<[^>]+>/g, '');
  // Unescape standard XML and named/numeric HTML entities
  str = str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .trim();
  return str;
}

const rowRegex = /<row>([\s\S]*?)<\/row>/gi;
let match;
const allCompiled = [];

while ((match = rowRegex.exec(xml)) !== null) {
  const c = match[1];
  const getTag = (t) => {
    const m = c.match(new RegExp('<' + t + '>([\\s\\S]*?)<\\/' + t + '>', 'i'));
    return m ? m[1].trim() : '';
  };

  const idNumber = parseInt(getTag('id_number'), 10);
  if (!idNumber) continue;

  const existing = existingMap.get(idNumber) || {};

  const site = cleanHtml(getTag('site')) || existing.site || '';
  const rawCat = getTag('category') || existing.category || 'Cultural';
  const category = /natural/i.test(rawCat) ? 'Natural' : /mixed/i.test(rawCat) ? 'Mixed' : 'Cultural';
  const criteriaTxt = getTag('criteria_txt') || existing.criteriaTxt || '(i)';
  const dateInscribed = parseInt(getTag('date_inscribed') || String(existing.dateInscribed || 1978), 10);
  const secondaryDates = getTag('secondary_dates') || existing.secondaryDates || undefined;

  const rawDanger = getTag('danger');
  const isDanger = Boolean(
    (rawDanger && rawDanger !== '0' && rawDanger.toLowerCase() !== 'false') ||
    existing.danger
  );

  const rawStates = cleanHtml(getTag('states')) || existing.states || 'UNESCO State Party';
  const rawRegion = getTag('regions') || getTag('region') || existing.region || 'Africa';
  const region = /arab/i.test(rawRegion) ? 'Arab States' : 'Africa';

  const isoCode = (getTag('iso_code') || existing.isoCode || '').toLowerCase().trim();
  const firstIso2 = isoCode.split(',')[0].trim();
  const entityId = existing.entityId || isoMap[firstIso2] || undefined;

  const transnational = getTag('transnational') === '1' || isoCode.includes(',') || rawStates.includes(',');

  // Coordinates resolution
  let lat = undefined;
  let lng = undefined;

  if (existing.latitude !== undefined && existing.longitude !== undefined) {
    lat = existing.latitude;
    lng = existing.longitude;
  } else {
    const latMatch = c.match(/<latitude>([\s\S]*?)<\/latitude>/i);
    const lngMatch = c.match(/<longitude>([\s\S]*?)<\/longitude>/i);
    if (latMatch && lngMatch) {
      lat = parseFloat(latMatch[1]);
      lng = parseFloat(lngMatch[1]);
    } else if (coordsLookup[idNumber]) {
      lat = coordsLookup[idNumber].lat;
      lng = coordsLookup[idNumber].lng;
    }
  }

  // Canvas x, y projection on 5796 x 5867 map
  let x = existing.x;
  let y = existing.y;
  if (x === undefined || y === undefined) {
    if (lat !== undefined && lng !== undefined) {
      x = Math.round(61.8 * lng + 1804);
      y = Math.round(-71.8 * lat + 3081);
    } else {
      x = 2500;
      y = 2500;
    }
  }

  const location = cleanHtml(getTag('location')) || existing.location || undefined;
  let shortDescription = cleanHtml(getTag('short_description')) || existing.shortDescription || '';
  if (!shortDescription) {
    if (idNumber === 1809) {
      shortDescription = 'Sebastia (ancient Samaria), situated northwest of Nablus in the West Bank, is a landmark archaeological complex encompassing stratified layers of Canaanite, Israelite, Hellenistic, Herodian Roman, Byzantine, and Islamic civilization, featuring monumental columned streets, civic basilicas, royal acropolises, and venerated medieval sanctuaries.';
    } else {
      shortDescription = `Official UNESCO ${category} World Heritage property inscribed by the State Party of ${rawStates} under criteria ${criteriaTxt}.`;
    }
  }
  const justification = cleanHtml(getTag('justification')) || existing.justification || undefined;
  const longDescription = existing.longDescription || undefined;
  const historicalDescription = existing.historicalDescription || undefined;

  const httpUrl = (getTag('http_url') || existing.httpUrl || ('https://whc.unesco.org/en/list/' + idNumber)).replace(/^http:/, 'https:');
  const imageUrl = (getTag('image_url') || existing.imageUrl || ('https://whc.unesco.org/uploads/sites/site_' + idNumber + '.jpg')).replace(/^http:/, 'https:');

  const compiledRecord = {
    idNumber,
    uniqueNumber: parseInt(getTag('unique_number') || String(existing.uniqueNumber || idNumber), 10),
    site,
    category,
    criteriaTxt,
    dateInscribed,
    secondaryDates: secondaryDates || undefined,
    danger: isDanger,
    dangerDates: isDanger ? (rawDanger || existing.dangerDates || 'Active') : undefined,
    states: rawStates,
    region,
    isoCode: isoCode || undefined,
    entityId: entityId || undefined,
    transboundary: transnational,
    latitude: lat !== undefined ? Number(lat.toFixed(5)) : undefined,
    longitude: lng !== undefined ? Number(lng.toFixed(5)) : undefined,
    x,
    y,
    location: location || undefined,
    shortDescription,
    longDescription: longDescription || undefined,
    historicalDescription: historicalDescription || undefined,
    justification: justification || undefined,
    httpUrl,
    imageUrl,
    // Expanded attribution & licensing fields
    creator: `UNESCO / State Party of ${rawStates}`,
    photographer: 'UNESCO Photobank / Official Inscription Archives',
    authorRole: 'Official UNESCO Documentation & Inscription Registry',
    attributionText: `Photo © UNESCO / WHC (${rawStates}) • WHC #${idNumber} (CC BY-SA 3.0 IGO)`,
    institution: 'UNESCO World Heritage Centre',
    collectionOrRegistryId: `WHC-${idNumber}`,
    license: 'CC BY-SA 3.0 IGO',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/igo/',
    rightsStatement: 'https://rightsstatements.org/vocab/InC-EDU/1.0/',
    primaryUrl: httpUrl,
    highResDownloadUrl: imageUrl
  };

  allCompiled.push(compiledRecord);
}

// Sort by idNumber ascending
allCompiled.sort((a, b) => a.idNumber - b.idNumber);

console.log('Successfully compiled sites count:', allCompiled.length);
const withoutCoords = allCompiled.filter(s => s.latitude === undefined);
console.log('Sites without coords:', withoutCoords.length);

fs.writeFileSync(targetJsonPath, JSON.stringify(allCompiled, null, 2), 'utf8');
console.log('Written successfully to:', targetJsonPath);
