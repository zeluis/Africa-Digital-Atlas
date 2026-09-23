/**
 * scripts/generateNaturalEarthPaths.cjs
 * Extracts authoritative, high-fidelity vector coastlines and landmass paths for:
 * - South America
 * - North America & Central America
 * - The Caribbean Archipelago (Cuba, Hispaniola, Jamaica, Puerto Rico, Bahamas, Lesser Antilles)
 * - Western Europe Mainland (Spain, Portugal, France, Germany, Low Countries, Italy, Denmark)
 * - British Isles (Great Britain, Ireland)
 * - Mediterranean Islands (Balearic Islands, Corsica, Sardinia, Sicily)
 * - International Country Borders
 * 
 * Source: Natural Earth 1:50,000,000 via world-atlas/countries-50m.json
 * Projection: Equirectangular / Plate Carrée matching AtlanticFlowMap SVG viewport (1000x580, Lng [-105, 52], Lat [-38, 58])
 */

const fs = require('fs');
const path = require('path');
const d3 = require('d3');
const topojson = require('topojson-client');
const world = require('world-atlas/countries-50m.json');

function projectCoord(lat, lng) {
  const minLng = -105;
  const maxLng = 52;
  const minLat = -38;
  const maxLat = 58;
  const x = ((lng - minLng) / (maxLng - minLng)) * 960 + 20;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 540 + 20;
  return [x, y];
}

function createClippedProjection(minLng, minLat, maxLng, maxLat) {
  const clipper = d3.geoClipRectangle(minLng, minLat, maxLng, maxLat);
  return {
    stream: function(outputStream) {
      const transform = {
        point: function(lng, lat) {
          const [x, y] = projectCoord(lat, lng);
          outputStream.point(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
        },
        lineStart: () => outputStream.lineStart(),
        lineEnd: () => outputStream.lineEnd(),
        polygonStart: () => outputStream.polygonStart(),
        polygonEnd: () => outputStream.polygonEnd(),
        sphere: () => outputStream.sphere && outputStream.sphere()
      };
      return clipper(transform);
    }
  };
}

const proj = createClippedProjection(-105, -38, 52, 58);
const pathGen = d3.geoPath().projection(proj);

console.log('Extracting Natural Earth 50m geometries...');

// 1. South America
const saCodes = ['076', '170', '862', '328', '740', '218', '604', '068', '600', '858', '032', '152'];
const saGeoms = world.objects.countries.geometries.filter(g => saCodes.includes(String(g.id).padStart(3, '0')));
const saPath = pathGen(topojson.merge(world, saGeoms));

// 2. North America & Central America
const naCodes = ['840', '124', '484', '320', '084', '340', '222', '558', '188', '591'];
const naGeoms = world.objects.countries.geometries.filter(g => naCodes.includes(String(g.id).padStart(3, '0')));
const naPath = pathGen(topojson.merge(world, naGeoms));

// 3. Western Europe Mainland (Mainland only, excluding Mediterranean islands which get distinct paths)
const euCodes = ['724', '620', '250', '528', '056', '442', '276', '756', '380', '208', '040'];
const euGeoms = world.objects.countries.geometries.filter(g => euCodes.includes(String(g.id).padStart(3, '0')));

// Filter out Mediterranean islands from the mainland polygon collection
const euFeatures = topojson.feature(world, { type: 'GeometryCollection', geometries: euGeoms });
const mainlandPolys = [];
euFeatures.features.forEach(f => {
  if (f.geometry.type === 'Polygon') {
    const ring = f.geometry.coordinates[0];
    const isIsland = ring.every(([lng, lat]) => (lng > 1.0 && lat < 43.5 && lat > 36.0));
    if (!isIsland) mainlandPolys.push(f.geometry.coordinates);
  } else if (f.geometry.type === 'MultiPolygon') {
    f.geometry.coordinates.forEach(poly => {
      const ring = poly[0];
      const isIsland = ring.every(([lng, lat]) => (lng > 1.0 && lat < 43.5 && lat > 36.0));
      if (!isIsland) mainlandPolys.push(poly);
    });
  }
});
const euMainlandPath = pathGen({ type: 'MultiPolygon', coordinates: mainlandPolys });

// 4. British Isles
const ukGeom = world.objects.countries.geometries.filter(g => String(g.id).padStart(3, '0') === '826');
const ukPath = pathGen(topojson.merge(world, ukGeom));

const ireGeom = world.objects.countries.geometries.filter(g => String(g.id).padStart(3, '0') === '372');
const irePath = pathGen(topojson.merge(world, ireGeom));

// 5. Mediterranean Islands
const spain = topojson.feature(world, world.objects.countries.geometries.find(g => String(g.id).padStart(3, '0') === '724'));
const italy = topojson.feature(world, world.objects.countries.geometries.find(g => String(g.id).padStart(3, '0') === '380'));
const france = topojson.feature(world, world.objects.countries.geometries.find(g => String(g.id).padStart(3, '0') === '250'));

const balearicPolys = spain.geometry.coordinates.filter(poly => {
  const ring = poly[0];
  return ring.every(([lng, lat]) => lng > 1.0 && lat < 40.5);
});
const balearicPath = pathGen({ type: 'MultiPolygon', coordinates: balearicPolys });

const corsicaPolys = france.geometry.coordinates.filter(poly => {
  const ring = poly[0];
  return ring.every(([lng, lat]) => lng > 8.0 && lng < 10.0 && lat > 41.0 && lat < 43.5);
});

const sardiniaPolys = italy.geometry.coordinates.filter(poly => {
  const ring = poly[0];
  return ring.every(([lng, lat]) => lng > 8.0 && lng < 10.0 && lat > 38.5 && lat < 41.5);
});
const sardiniaCorsicaPath = pathGen({ type: 'MultiPolygon', coordinates: [...corsicaPolys, ...sardiniaPolys] });

const sicilyPolys = italy.geometry.coordinates.filter(poly => {
  const ring = poly[0];
  return ring.every(([lng, lat]) => lat < 38.5 && lng > 12.0 && lat > 36.4);
});
const sicilyPath = pathGen({ type: 'MultiPolygon', coordinates: sicilyPolys });

// 6. Caribbean Archipelago
const cubaGeom = world.objects.countries.geometries.filter(g => String(g.id).padStart(3, '0') === '192');
const cubaPath = pathGen(topojson.merge(world, cubaGeom));

const hispGeom = world.objects.countries.geometries.filter(g => ['332', '214'].includes(String(g.id).padStart(3, '0')));
const hispPath = pathGen(topojson.merge(world, hispGeom));

const jamGeom = world.objects.countries.geometries.filter(g => String(g.id).padStart(3, '0') === '388');
const jamPath = pathGen(topojson.merge(world, jamGeom));

const prGeom = world.objects.countries.geometries.filter(g => String(g.id).padStart(3, '0') === '630');
const prPath = pathGen(topojson.merge(world, prGeom));

const bahGeom = world.objects.countries.geometries.filter(g => String(g.id).padStart(3, '0') === '044');
const bahPath = pathGen(topojson.merge(world, bahGeom));

const lesserAntillesCodes = ['052', '212', '308', '659', '662', '670', '028', '780', '500', '533', '534'];
const antillesGeom = world.objects.countries.geometries.filter(g => lesserAntillesCodes.includes(String(g.id).padStart(3, '0')));
const antillesPath = pathGen(topojson.merge(world, antillesGeom));

// 7. International Country Borders Mesh (Europe & Americas only, excluding Africa to preserve authoritative African Admin-1)
const africanCodes = ['012', '024', '204', '072', '108', '120', '132', '140', '148', '174', '178', '180', '226', '232', '231', '262', '266', '270', '288', '324', '624', '384', '404', '426', '430', '434', '450', '454', '466', '478', '480', '504', '508', '516', '562', '566', '646', '678', '686', '690', '694', '706', '710', '728', '729', '748', '768', '788', '800', '834', '894', '716'];
const allAtlanticCodes = [...saCodes, ...naCodes, ...euCodes, '826', '372', '192', '332', '214', '388', '630', '044', ...lesserAntillesCodes];

const bordersMesh = topojson.mesh(world, world.objects.countries, (a, b) => {
  if (a === b) return false;
  const aId = String(a.id).padStart(3, '0');
  const bId = String(b.id).padStart(3, '0');
  if (africanCodes.includes(aId) || africanCodes.includes(bId)) return false;
  return allAtlanticCodes.includes(aId) && allAtlanticCodes.includes(bId);
});
const bordersPath = pathGen(bordersMesh);

console.log('Extraction complete! Writing TypeScript module...');

const tsContent = `/**
 * atlanticNaturalEarthPaths.ts
 * Authoritative, high-fidelity SVG paths extracted directly from Natural Earth 1:50m (countries-50m.json).
 * Geographically calibrated to the 1000x580 Equirectangular canvas covering:
 * Latitudes -38° to +58°, Longitudes -105° to +52°.
 * 
 * Provides:
 * - High-precision coastlines for South America, North America, Europe, Caribbean
 * - Zero overlap between Spain and Morocco across the Strait of Gibraltar
 * - Authentic geographic archipelagos for Cuba, Hispaniola, Jamaica, Puerto Rico, Bahamas, and Lesser Antilles
 * - Real international boundary lines
 */

export const NATURAL_EARTH_SOUTH_AMERICA_PATH = ${JSON.stringify(saPath)};

export const NATURAL_EARTH_NORTH_AMERICA_PATH = ${JSON.stringify(naPath)};

export const NATURAL_EARTH_EUROPE_MAINLAND_PATH = ${JSON.stringify(euMainlandPath)};

export const NATURAL_EARTH_GREAT_BRITAIN_PATH = ${JSON.stringify(ukPath)};

export const NATURAL_EARTH_IRELAND_PATH = ${JSON.stringify(irePath)};

export const NATURAL_EARTH_BALEARIC_PATH = ${JSON.stringify(balearicPath)};

export const NATURAL_EARTH_SARDINIA_CORSICA_PATH = ${JSON.stringify(sardiniaCorsicaPath)};

export const NATURAL_EARTH_SICILY_PATH = ${JSON.stringify(sicilyPath)};

export const NATURAL_EARTH_CUBA_PATH = ${JSON.stringify(cubaPath)};

export const NATURAL_EARTH_HISPANIOLA_PATH = ${JSON.stringify(hispPath)};

export const NATURAL_EARTH_JAMAICA_PATH = ${JSON.stringify(jamPath)};

export const NATURAL_EARTH_PUERTO_RICO_PATH = ${JSON.stringify(prPath)};

export const NATURAL_EARTH_BAHAMAS_PATH = ${JSON.stringify(bahPath)};

export const NATURAL_EARTH_LESSER_ANTILLES_PATH = ${JSON.stringify(antillesPath)};

export const NATURAL_EARTH_INTERNATIONAL_BORDERS_PATH = ${JSON.stringify(bordersPath)};
`;

const outputPath = path.join(__dirname, '../src/components/slaveVoyages/atlanticNaturalEarthPaths.ts');
fs.writeFileSync(outputPath, tsContent, 'utf8');
console.log('Saved atlanticNaturalEarthPaths.ts successfully! Size:', (Buffer.byteLength(tsContent) / 1024).toFixed(1), 'KB');
