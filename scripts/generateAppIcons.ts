import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { AFRICA_SVG_MAP, AFRICA_UN_REGIONS_STRUCTURED } from '../src/data/svgMaps.js';
import { UN_REGIONS, REGION_META } from '../src/data/africaData.js';

/**
 * Generates the pure UN GeoScheme Africa continent SVG (identical to AfricaUnLogo component).
 * By default viewBox is '60 60 890 990', representing the sovereign African continent
 * subdivided into the 5 UN GeoScheme regions with their official colors and white country strokes.
 */
export function buildAfricaContinentalSvg(options: {
  viewBox?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  showIslands?: boolean;
  background?: string;
  rx?: number;
  padding?: number;
} = {}): string {
  const {
    viewBox = '60 60 890 990',
    width,
    height,
    strokeColor = '#FFFFFF',
    strokeWidth = 1.0,
    showIslands = true,
    background,
    rx = 0,
    padding = 0
  } = options;

  let regionsSvg = '';

  for (const regionName of UN_REGIONS) {
    const region = AFRICA_UN_REGIONS_STRUCTURED[regionName];
    const meta = REGION_META[regionName];
    const color = meta.color;

    regionsSvg += `    <!-- ${regionName} (${meta.shortName}) -->\n`;
    regionsSvg += `    <g id="region-${regionName.toLowerCase().replace(/\s+/g, '-')}" fill="${color}">\n`;

    for (const iso3 of region.countryIds) {
      const country = AFRICA_SVG_MAP[iso3];
      if (country) {
        regionsSvg += `      <path id="${iso3}" d="${country.path}" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" />\n`;
      }
    }

    if (showIslands && region.islandCircles) {
      for (let idx = 0; idx < region.islandCircles.length; idx++) {
        const isl = region.islandCircles[idx];
        const r = Math.max(isl.r * 1.3, 7.5);
        regionsSvg += `      <circle id="island-${regionName.toLowerCase().replace(/\s+/g, '-')}-${idx}" cx="${isl.cx}" cy="${isl.cy}" r="${r}" fill="${color}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />\n`;
      }
    }

    regionsSvg += `    </g>\n`;
  }

  // If no background or padding is requested, return the direct continental vector matching AfricaUnLogo's viewBox
  if (!background && !padding && !width && !height) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="African Continent UN Geoscheme Silhouette">
  <g id="african-continent">
${regionsSvg}  </g>
</svg>
`;
  }

  // When sizing or padding is specified (e.g. for square icons with optional background)
  const targetW = width || 512;
  const targetH = height || 512;
  const pad = padding || 0;

  // Coordinate frame: [60, 60, 890, 990]
  const [vbX, vbY, vbW, vbH] = viewBox.split(' ').map(Number);
  const availW = targetW - pad * 2;
  const availH = targetH - pad * 2;
  const scale = Math.min(availW / vbW, availH / vbH);
  const scaledW = vbW * scale;
  const scaledH = vbH * scale;
  const offsetX = (targetW - scaledW) / 2 - vbX * scale;
  const offsetY = (targetH - scaledH) / 2 - vbY * scale;

  let bgMarkup = '';
  if (background && background !== 'transparent') {
    bgMarkup = `  <rect width="${targetW}" height="${targetH}" ${rx ? `rx="${rx}" ` : ''}fill="${background}" />\n`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${targetW} ${targetH}" width="${targetW}" height="${targetH}" role="img" aria-label="African Continent UN Geoscheme Silhouette">
${bgMarkup}  <g transform="translate(${offsetX.toFixed(2)}, ${offsetY.toFixed(2)}) scale(${scale.toFixed(5)})">
${regionsSvg}  </g>
</svg>
`;
}

async function generateAllIcons() {
  const publicDir = path.resolve(process.cwd(), 'public');

  // 1. Direct continental SVG (UN GeoScheme Africa continent by itself, like the app's logo)
  const standaloneSvg = buildAfricaContinentalSvg({
    viewBox: '60 60 890 990',
    strokeColor: '#FFFFFF',
    strokeWidth: 1.2
  });

  // Write favicon.svg and icon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), standaloneSvg, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standaloneSvg, 'utf8');
  console.log('✓ Written favicon.svg and icon.svg (standalone UN GeoScheme Africa SVG)');

  // 2. High-res raster SVG for rendering PNGs (padded slightly so stroke/islands never clip at edges)
  // Transparent background high-res raster source
  const rasterSvgTransparent = buildAfricaContinentalSvg({
    viewBox: '60 60 890 990',
    width: 1024,
    height: 1024,
    padding: 32,
    strokeColor: '#FFFFFF',
    strokeWidth: 2.5
  });

  // Maskable icon raster source (with standard safe zone padding ~15-20% for Android maskable icons)
  // Maskable icons require a solid background since OS applies circular/squircle masks
  const rasterSvgMaskable = buildAfricaContinentalSvg({
    viewBox: '60 60 890 990',
    width: 1024,
    height: 1024,
    padding: 120, // ample safe margin within 80% circle
    background: '#09090b', // app theme dark background
    strokeColor: '#FFFFFF',
    strokeWidth: 2.5
  });

  // Apple Touch Icon raster source (iOS adds rounded corners to square icons, iOS guidelines recommend non-transparent background)
  // We'll generate with elegant dark background matching the app's dark canvas #09090b
  const rasterSvgAppleTouch = buildAfricaContinentalSvg({
    viewBox: '60 60 890 990',
    width: 1024,
    height: 1024,
    padding: 56,
    background: '#09090b',
    strokeColor: '#FFFFFF',
    strokeWidth: 2.5
  });

  // 3. Generate PNG icons
  // favicon-32x32.png
  await sharp(Buffer.from(rasterSvgTransparent))
    .resize(32, 32)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('✓ Generated favicon-32x32.png (32x32)');

  // apple-touch-icon.png (180x180)
  await sharp(Buffer.from(rasterSvgAppleTouch))
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png (180x180)');

  // icon-192.png
  await sharp(Buffer.from(rasterSvgTransparent))
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Generated icon-192.png (192x192)');

  // icon-512.png
  await sharp(Buffer.from(rasterSvgTransparent))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Generated icon-512.png (512x512)');

  // icon-maskable-192.png
  await sharp(Buffer.from(rasterSvgMaskable))
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-maskable-192.png'));
  console.log('✓ Generated icon-maskable-192.png (192x192)');

  // icon-maskable-512.png
  await sharp(Buffer.from(rasterSvgMaskable))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));
  console.log('✓ Generated icon-maskable-512.png (512x512)');

  console.log('All icons generated successfully!');
}

generateAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
