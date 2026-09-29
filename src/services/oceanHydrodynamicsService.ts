/**
 * Africa Data Atlas — Ocean Hydrodynamics Service
 * 
 * Provides real-time physics vector field evaluation, seasonal regime parameters,
 * and high-performance particle dynamics for the Atlantic Ocean & Indian Ocean
 * maritime systems (Canary, Benguela, Guinea, South Equatorial, Agulhas, and Trade Winds).
 */

export type HydrodynamicSeasonId = 'q1' | 'q2' | 'q3' | 'q4';

export interface SeasonalHydrodynamicMetrics {
  id: HydrodynamicSeasonId;
  name: string;
  quarterLabel: string;
  months: string;
  speedFactor: number;        // Global baseline velocity multiplier
  trailScale: number;         // Trail stroke width multiplier
  activeRatio: number;        // Active particle ratio (0.5 to 1.0)
  dominantVectorNote: string;
  avgPassageDaysLuandaBahia: number;
  avgPassageDaysSenegambiaCaribbean: number;
  harmattanIntensity: 'Severe' | 'Moderate' | 'Low' | 'Moderate';
}

export const SEASONAL_HYDRO_METRICS: Record<HydrodynamicSeasonId, SeasonalHydrodynamicMetrics> = {
  q1: {
    id: 'q1',
    name: 'Winter NE Monsoon & Harmattan Season',
    quarterLabel: 'Q1 (January – March)',
    months: 'January – March',
    speedFactor: 1.35,
    trailScale: 2.5,
    activeRatio: 0.90,
    dominantVectorNote: 'Powerful southward Canary Current & intense Saharan Harmattan dust vectors accelerate departures from Senegambia & Cape Verde.',
    avgPassageDaysLuandaBahia: 39,
    avgPassageDaysSenegambiaCaribbean: 28,
    harmattanIntensity: 'Severe'
  },
  q2: {
    id: 'q2',
    name: 'Spring Equinox & ITCZ Doldrums Transition',
    quarterLabel: 'Q2 (April – June)',
    months: 'April – June',
    speedFactor: 0.70,
    trailScale: 1.5,
    activeRatio: 0.62,
    dominantVectorNote: 'Equatorial doldrums stall trade winds; Atlantic flows become calm, gentle, and meandering with prominent counter-current in Gulf of Guinea.',
    avgPassageDaysLuandaBahia: 42,
    avgPassageDaysSenegambiaCaribbean: 31,
    harmattanIntensity: 'Moderate'
  },
  q3: {
    id: 'q3',
    name: 'Summer Southwest Monsoon & Roaring SE Trades',
    quarterLabel: 'Q3 (July – September)',
    months: 'July – September',
    speedFactor: 1.85,
    trailScale: 3.4,
    activeRatio: 1.0,
    dominantVectorNote: 'Fierce Southeast Trade Winds drive the roaring Benguela Current and rapid South Equatorial Conveyor toward Brazil (record 32–37 days). Strong monsoon surge in Guinea.',
    avgPassageDaysLuandaBahia: 37,
    avgPassageDaysSenegambiaCaribbean: 26,
    harmattanIntensity: 'Low'
  },
  q4: {
    id: 'q4',
    name: 'Autumn Southerly Retreat & Gyre Stabilization',
    quarterLabel: 'Q4 (October – December)',
    months: 'October – December',
    speedFactor: 1.15,
    trailScale: 2.2,
    activeRatio: 0.82,
    dominantVectorNote: 'Subtropical gyres stabilize into balanced circulation across both North and South Atlantic basins with predictable maritime winds.',
    avgPassageDaysLuandaBahia: 38,
    avgPassageDaysSenegambiaCaribbean: 29,
    harmattanIntensity: 'Moderate'
  }
};

/**
 * Maps standard calendar season names to quarterly hydrodynamic seasons
 */
export function mapCalendarSeasonToHydro(season: 'summer' | 'autumn' | 'winter' | 'spring'): HydrodynamicSeasonId {
  switch (season) {
    case 'summer':
      return 'q3';
    case 'autumn':
      return 'q4';
    case 'winter':
      return 'q1';
    case 'spring':
      return 'q2';
    default:
      return 'q3';
  }
}

/**
 * Maps quarterly hydrodynamic season to standard calendar season name
 */
export function mapHydroToCalendarSeason(hydro: HydrodynamicSeasonId): 'summer' | 'autumn' | 'winter' | 'spring' {
  switch (hydro) {
    case 'q3':
      return 'summer';
    case 'q4':
      return 'autumn';
    case 'q1':
      return 'winter';
    case 'q2':
      return 'spring';
    default:
      return 'summer';
  }
}

export interface FlowVectorResult {
  vx: number;
  vy: number;
  type: 0 | 1 | 2; // 0=ambient drift, 1=ocean current, 2=trade wind
  force: number;    // local dynamic magnitude
  isWarm: boolean;  // whether current is warm equatorial vs cold upwelling
  name?: string;
}

/**
 * Evaluates the hydrodynamic vector field at virtual coordinates (x, y)
 * in the canonical 1000 x 580 coordinate system.
 */
export function evaluateHydrodynamicVector(
  x: number,
  y: number,
  season: HydrodynamicSeasonId,
  showCurrents: boolean = true,
  showWinds: boolean = true
): FlowVectorResult {
  // Normalize virtual canvas coordinates (0 to 1000, 0 to 580)
  // to geographic coordinates (lng: -105 to 52, lat: -38 to 58)
  const normX = (x - 20) / 960;
  const normY = (y - 20) / 540;
  const lng = -105 + normX * 157;
  const lat = 58 - normY * 96;

  let vx = 0;
  let vy = 0;
  let type: 0 | 1 | 2 = 0;
  let force = 1.0;
  let isWarm = false;
  let name: string | undefined = undefined;

  // 1. Canary Current (Cold North-to-South along Northwest Africa: Morocco, Mauritania, Senegal)
  if (showCurrents && lat > 11 && lat < 37 && lng > -25 && lng < -9) {
    type = 1;
    name = 'Canary Current';
    isWarm = false;
    if (season === 'q1') {
      vx = -0.95;
      vy = 2.85;
      force = 1.65;
    } else if (season === 'q2') {
      vx = -0.32;
      vy = 1.05;
      force = 0.75;
    } else if (season === 'q3') {
      vx = -0.45;
      vy = 1.35;
      force = 0.85;
    } else { // q4
      vx = -0.65;
      vy = 1.95;
      force = 1.15;
    }
  }
  // 2. Benguela Current (Cold South-to-North along Southwest Africa: South Africa, Namibia, Angola)
  else if (showCurrents && lat > -36 && lat < -1 && lng > 6 && lng < 17) {
    type = 1;
    name = 'Benguela Current';
    isWarm = false;
    if (season === 'q3') {
      vx = -1.75;
      vy = -3.20;
      force = 2.10; // Peak annual surge
    } else if (season === 'q2') {
      vx = -0.60;
      vy = -1.15;
      force = 0.70; // Sluggish doldrums
    } else if (season === 'q1') {
      vx = -0.90;
      vy = -1.75;
      force = 1.10;
    } else { // q4
      vx = -1.10;
      vy = -2.10;
      force = 1.30;
    }
  }
  // 3. Guinea Current (Warm West-to-East in the Gulf of Guinea: Liberia to Nigeria/Cameroon)
  else if (showCurrents && lat > 1.2 && lat < 7.2 && lng > -15 && lng < 11) {
    type = 1;
    name = 'Guinea Current';
    isWarm = true;
    if (season === 'q3') {
      vx = 3.65;
      vy = 0.28;
      force = 1.95; // Monsoon-driven eastward rush
    } else if (season === 'q2') {
      vx = 2.45;
      vy = 0.15;
      force = 1.35; // Counter-current prominent
    } else if (season === 'q1') {
      vx = 1.25;
      vy = 0.04;
      force = 0.75; // Weakened by offshore Harmattan
    } else { // q4
      vx = 2.10;
      vy = 0.12;
      force = 1.10;
    }
  }
  // 4. South Equatorial Current (Warm East-to-West Transatlantic Conveyor: Angola/Congo to Brazil & Caribbean)
  else if (showCurrents && lat > -17 && lat < 5 && lng > -46 && lng < 7) {
    type = 1;
    name = 'South Equatorial Current';
    isWarm = true;
    if (season === 'q3') {
      vx = -4.10;
      vy = -0.48;
      force = 2.30; // Roaring trans-Atlantic conveyor
    } else if (season === 'q2') {
      vx = -1.50;
      vy = -0.16;
      force = 0.75; // Calm wandering flow
    } else if (season === 'q1') {
      vx = -2.25;
      vy = -0.22;
      force = 1.15;
    } else { // q4
      vx = -2.75;
      vy = -0.30;
      force = 1.35;
    }
  }
  // 5. North Equatorial Current (Warm East-to-West: Cape Verde across to Caribbean & Guianas)
  else if (showCurrents && lat > 8 && lat < 23 && lng > -66 && lng < -21) {
    type = 1;
    name = 'North Equatorial Current';
    isWarm = true;
    if (season === 'q1') {
      vx = -3.35;
      vy = -0.22;
      force = 1.70; // Trade-wind driven highway
    } else if (season === 'q2') {
      vx = -1.65;
      vy = -0.12;
      force = 0.80;
    } else if (season === 'q3') {
      vx = -2.40;
      vy = -0.18;
      force = 1.20;
    } else { // q4
      vx = -2.55;
      vy = -0.18;
      force = 1.25;
    }
  }
  // 6. Gulf Stream & North Atlantic Drift (Warm Southwest-to-Northeast: Florida/Bahamas to Western Europe)
  else if (showCurrents && lat > 25 && lat < 55 && lng > -82 && lng < -10) {
    type = 1;
    name = 'Gulf Stream & North Atlantic Drift';
    isWarm = false;
    if (season === 'q1') {
      vx = 2.85;
      vy = -1.75;
      force = 1.55;
    } else if (season === 'q2') {
      vx = 2.10;
      vy = -1.25;
      force = 1.05;
    } else if (season === 'q3') {
      vx = 2.45;
      vy = -1.45;
      force = 1.25;
    } else { // q4
      vx = 2.50;
      vy = -1.50;
      force = 1.30;
    }
  }
  // 7. Agulhas Current (Warm Western Boundary Current down Southeast Africa retroflecting into Southern Ocean)
  else if (showCurrents && lat > -39 && lat < -22 && lng > 23 && lng < 44) {
    type = 1;
    name = 'Agulhas Current';
    isWarm = true;
    if (season === 'q3') {
      vx = -1.85;
      vy = 2.10;
      force = 1.85;
    } else if (season === 'q2') {
      vx = -1.20;
      vy = 1.35;
      force = 1.05;
    } else {
      vx = -1.50;
      vy = 1.70;
      force = 1.40;
    }
  }
  // 8. Northeast Trade Winds & Harmattan Dust Vector (North Tropical Atlantic)
  else if (showWinds && lat > 7 && lat < 31 && lng > -62 && lng < -15) {
    type = 2;
    name = 'Northeast Trade Winds & Harmattan';
    if (season === 'q1') {
      vx = -2.95;
      vy = 1.35;
      force = 1.85; // Intense Harmattan winds
    } else if (season === 'q2') {
      vx = -1.15;
      vy = 0.45;
      force = 0.65; // Weak, fragmented
    } else if (season === 'q3') {
      vx = -1.45;
      vy = 0.70;
      force = 0.85;
    } else { // q4
      vx = -2.05;
      vy = 0.95;
      force = 1.20;
    }
  }
  // 9. Southeast Trade Winds (South Tropical Atlantic)
  else if (showWinds && lat > -32 && lat < -1 && lng > -43 && lng < 13) {
    type = 2;
    name = 'Southeast Trade Winds';
    if (season === 'q3') {
      vx = -3.20;
      vy = -1.65;
      force = 2.05; // Peak ferocious SE trades
    } else if (season === 'q2') {
      vx = -1.25;
      vy = -0.55;
      force = 0.70; // Relaxed doldrums
    } else if (season === 'q1') {
      vx = -1.85;
      vy = -0.90;
      force = 1.10;
    } else { // q4
      vx = -2.25;
      vy = -1.10;
      force = 1.35;
    }
  }
  // 10. Southwest Monsoon Surge (Summer Q3 Exclusive: Gulf of Guinea coastal interior)
  else if (showWinds && season === 'q3' && lat > 2 && lat < 13 && lng > -19 && lng < 9) {
    type = 2;
    name = 'Southwest African Monsoon Surge';
    vx = 3.10;
    vy = -1.75;
    force = 2.15;
  }
  // Ambient oceanic background drift
  else {
    vx = -0.38;
    vy = 0.06;
    type = 0;
    force = 0.45;
  }

  return { vx, vy, type, force, isWarm, name };
}

/**
 * Cubic ease in-out for butter-smooth visual parameter transitions
 */
export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
