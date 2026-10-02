/**
 * Africa Data Atlas — Ocean Hydrodynamics & TAST Correlation Service
 * 
 * Provides real-time physics vector field evaluation, seasonal regime parameters,
 * and Trans-Atlantic Slave Trade (TAST) correlated meteorological and mortality data.
 */

export type HydrodynamicSeasonId = 'q1' | 'q2' | 'q3' | 'q4';

export interface TastCorrelations {
  windName: string;
  windSpeedDisplay: string;
  currentName: string;
  currentSpeedDisplay: string;
  holdTemperature: string;
  mortalityRate: string;
  primaryCorridor: string;
  departureShare: string;
  climateImpactNote: string;
}

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
  tastCorrelations: TastCorrelations;
}

export const SEASONAL_HYDRO_METRICS: Record<HydrodynamicSeasonId, SeasonalHydrodynamicMetrics> = {
  q1: {
    id: 'q1',
    name: 'Winter NE Monsoon & Harmattan Season',
    quarterLabel: 'Q1 (January – March)',
    months: 'January – March',
    speedFactor: 0.85,
    trailScale: 2.5,
    activeRatio: 0.90,
    dominantVectorNote: 'Powerful southward Canary Current & intense Saharan Harmattan dust vectors accelerate departures from Senegambia & Cape Verde.',
    avgPassageDaysLuandaBahia: 39,
    avgPassageDaysSenegambiaCaribbean: 28,
    harmattanIntensity: 'Severe',
    tastCorrelations: {
      windName: 'Northeast Trades & Saharan Harmattan',
      windSpeedDisplay: '18–25 knots (33–46 km/h)',
      currentName: 'Canary & North Equatorial Current',
      currentSpeedDisplay: '1.5–3.2 knots (2.8–5.9 km/h)',
      holdTemperature: '24°C – 26°C (Dry Sahelian air)',
      mortalityRate: '10.8% (Faster Canary transit)',
      primaryCorridor: 'Senegambia & Cape Verde ➔ Caribbean',
      departureShare: '26% of documented voyages',
      climateImpactNote: 'Dry Harmattan conditions reduce coastal fever spikes but increase respiratory distress during maritime confinement.'
    }
  },
  q2: {
    id: 'q2',
    name: 'Spring Equinox & ITCZ Doldrums Transition',
    quarterLabel: 'Q2 (April – June)',
    months: 'April – June',
    speedFactor: 0.45,
    trailScale: 1.5,
    activeRatio: 0.62,
    dominantVectorNote: 'Equatorial doldrums stall trade winds; Atlantic flows become calm, gentle, and meandering with prominent counter-current in Gulf of Guinea.',
    avgPassageDaysLuandaBahia: 42,
    avgPassageDaysSenegambiaCaribbean: 31,
    harmattanIntensity: 'Moderate',
    tastCorrelations: {
      windName: 'Equatorial Doldrums (Horse Latitudes)',
      windSpeedDisplay: '4–9 knots (7–17 km/h - Calm)',
      currentName: 'Guinea & Equatorial Counter-Current',
      currentSpeedDisplay: '0.8–1.8 knots (1.5–3.3 km/h)',
      holdTemperature: '27°C – 30°C (Stagnant & sweltering)',
      mortalityRate: '13.9% (Prolonged calms & scurvy)',
      primaryCorridor: 'Windward Coast & Benin ➔ Bahia & Guianas',
      departureShare: '21% of documented voyages',
      climateImpactNote: 'Frequent windless calms stall ships in horse latitudes for weeks, inducing severe freshwater rationing and scurvy.'
    }
  },
  q3: {
    id: 'q3',
    name: 'Summer Southwest Monsoon & Roaring SE Trades',
    quarterLabel: 'Q3 (July – September)',
    months: 'July – September',
    speedFactor: 1.15,
    trailScale: 3.4,
    activeRatio: 1.0,
    dominantVectorNote: 'Fierce Southeast Trade Winds drive the roaring Benguela Current and rapid South Equatorial Conveyor toward Brazil (record 32–37 days). Strong monsoon surge in Guinea.',
    avgPassageDaysLuandaBahia: 37,
    avgPassageDaysSenegambiaCaribbean: 26,
    harmattanIntensity: 'Low',
    tastCorrelations: {
      windName: 'Southeast Trades & SW Monsoon Surge',
      windSpeedDisplay: '22–28 knots (41–52 km/h - Peak)',
      currentName: 'Benguela Current & South Equatorial Conveyor',
      currentSpeedDisplay: '2.2–3.8 knots (4.1–7.0 km/h)',
      holdTemperature: '29°C – 33°C (Extreme Heat & Humidity)',
      mortalityRate: '15.8% (Peak Annual Mortality)',
      primaryCorridor: 'West Central Africa ➔ Bahia & Rio (Valongo)',
      departureShare: '31% (Peak Annual Trade Season)',
      climateImpactNote: 'Peak West African rainy season; extreme hold humidity accelerates dysentery, malaria, and yellow fever despite fast trans-Atlantic transit.'
    }
  },
  q4: {
    id: 'q4',
    name: 'Autumn Southerly Retreat & Gyre Stabilization',
    quarterLabel: 'Q4 (October – December)',
    months: 'October – December',
    speedFactor: 0.72,
    trailScale: 2.2,
    activeRatio: 0.82,
    dominantVectorNote: 'Subtropical gyres stabilize into balanced circulation across both North and South Atlantic basins with predictable maritime winds.',
    avgPassageDaysLuandaBahia: 38,
    avgPassageDaysSenegambiaCaribbean: 29,
    harmattanIntensity: 'Moderate',
    tastCorrelations: {
      windName: 'Stabilized Subtropical Trades',
      windSpeedDisplay: '14–20 knots (26–37 km/h)',
      currentName: 'Subtropical Gyre Equilibrium',
      currentSpeedDisplay: '1.2–2.4 knots (2.2–4.4 km/h)',
      holdTemperature: '25°C – 27°C (Equable Subtropical)',
      mortalityRate: '11.4% (Predictable sailing windows)',
      primaryCorridor: 'Bight of Biafra & Mozambique ➔ Brazil',
      departureShare: '22% of documented voyages',
      climateImpactNote: 'Stable high-pressure cells establish reliable maritime winds across the South Atlantic from Angola and Mozambique.'
    }
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

/**
 * Checks with high geographic precision if coordinates are over continental interior land
 * (so oceanic currents never cross continental interiors like Central Africa, Brazil, or US/Europe).
 */
export function isLandLocation(lat: number, lng: number): boolean {
  // 1. African Continent Interior
  if (lat >= -35 && lat <= 37.5 && lng >= -18 && lng <= 52) {
    // West coast of Africa profile:
    if (lat > 30) {
      // Morocco / Algeria / Mediterranean
      if (lng < -9.8) return false; // Atlantic off Morocco
      if (lat > 36.5 && lng > -6) return false; // Mediterranean
    } else if (lat > 21) {
      // Western Sahara / Mauritania
      if (lng < -17.2) return false; // Atlantic
    } else if (lat > 11) {
      // Senegambia / Guinea-Bissau
      if (lng < -17.6) return false; // Atlantic
    } else if (lat > 4.2) {
      // Guinea / Sierra Leone / Liberia / Ivory Coast / Ghana / Nigeria
      // Ocean is south of the Guinea coast (lat < 4.8°N depending on longitude)
      if (lng < -14.5 && lat > 9) return false; // Off Guinea
      if (lng < -11.5 && lat < 6.8) return false; // Off Liberia
      if (lng >= -11.5 && lng <= 2.5 && lat < 4.8) return false; // Gulf of Guinea oceanic waters
      if (lng > 2.5 && lng <= 8.5 && lat < 4.2) return false; // Bight of Benin/Bonny waters
    } else if (lat >= -5) {
      // Cameroon / Gabon / Congo (Equatorial West Africa)
      if (lng < 8.8) return false; // Atlantic off Gabon/Congo
    } else if (lat >= -18) {
      // Angola / Benguela / North Namibia
      if (lng < 11.8 + ((-lat - 5) * 0.12)) return false; // Atlantic off Angola/Namibia
    } else if (lat >= -34.8) {
      // Namibia / South Africa West Coast
      if (lng < 14.0 + ((-lat - 18) * 0.28)) return false; // Atlantic off Namibia/Cape
    } else {
      // South of Cape Agulhas (-35°S)
      return false; // Open Southern Ocean
    }

    // East coast of Africa profile (Indian Ocean waters):
    if (lat < -34.5) return false;
    if (lat < -25 && lng > 32.5) return false; // Indian Ocean off Durban/Mozambique
    if (lat >= -25 && lat < -10 && lng > 36.0) return false; // Mozambique Channel
    if (lat >= -10 && lat < 5 && lng > 40.5) return false; // Indian Ocean off Kenya/Somalia
    if (lat >= 5 && lat < 12 && lng > 51.5) return false; // Arabian Sea off Horn of Africa
    if (lat >= 12 && lat <= 28 && lng >= 36.5 && lng <= 43.5 && lat <= 24) return false; // Red Sea waters

    // Inside continental Africa
    return true;
  }

  // 2. South American Continent Interior
  if (lat >= -38 && lat <= 12.5 && lng >= -82 && lng <= -34.5) {
    // Check against South American Atlantic Coastline
    if (lat > 5) {
      // Venezuela / Guianas / Caribbean coast
      if (lng > -51.5 && lat > 4) return false; // Atlantic off Guianas
      if (lat > 11.5 && lng > -75) return false; // Caribbean Sea
    } else if (lat >= -4) {
      // Northern Brazil (Amapá to Ceará)
      if (lng > -50.0 + ((-lat) * 2.8)) return false; // Atlantic off North Brazil
    } else if (lat >= -10) {
      // Northeast Bulge (Rio Grande do Norte to Recife / Pernambuco)
      if (lng > -34.8) return false; // Atlantic Ocean off Recife (easternmost point)
    } else if (lat >= -18) {
      // Salvador da Bahia / Alagoas / Sergipe
      if (lng > -38.5) return false; // Atlantic off Bahia
    } else if (lat >= -25) {
      // Espirito Santo / Rio de Janeiro / Santos
      if (lng > -40.5 + ((-lat - 18) * 0.6)) return false; // Atlantic off Rio (Valongo)
    } else if (lat >= -38) {
      // Southern Brazil / Uruguay / Argentina / Rio de la Plata
      if (lng > -48.0 + ((-lat - 25) * 0.7)) return false; // Atlantic off South Brazil/Uruguay
    }

    // Inside South American landmass
    return true;
  }

  // 3. North American Continent Interior
  if (lat >= 24 && lat <= 58 && lng >= -105 && lng <= -52) {
    // Check against North American Atlantic Coastline
    if (lat < 30) {
      // Florida & Gulf of Mexico
      if (lng > -79.8) return false; // Atlantic off Florida/Bahamas
      if (lng < -82.0 && lat < 30.0 && lng > -98.0 && lat > 24.5) return false; // Gulf of Mexico waters
    } else if (lat < 36) {
      // Georgia / Carolinas
      if (lng > -75.5) return false; // Atlantic off Hatteras
    } else if (lat < 42) {
      // Mid-Atlantic / New York / New England
      if (lng > -70.5) return false; // Atlantic off New York/Boston
    } else if (lat < 48) {
      // Nova Scotia / Gulf of St. Lawrence
      if (lng > -60.0) return false; // Atlantic
    } else {
      // Newfoundland / Labrador / North Atlantic
      if (lng > -53.0) return false; // Atlantic Ocean
    }

    // Inside North American landmass
    return true;
  }

  // 4. European Mainland Interior
  if (lat >= 36 && lat <= 58 && lng >= -9.5 && lng <= 25) {
    // Iberian Peninsula (Portugal/Spain)
    if (lat < 44 && lng < -9.2) return false; // Atlantic off Lisbon/Porto
    if (lat >= 44 && lat <= 48 && lng < -4.8) return false; // Bay of Biscay waters
    if (lat > 48 && lat <= 58 && lng < -5.5 && lat < 51) return false; // English Channel / Celtic Sea
    if (lat >= 50 && lat <= 58 && lng >= -10.5 && lng <= -5.5) {
      // Ireland / Scotland land
      return true;
    }
    // Mediterranean waters off Spain/France/Italy
    if (lat < 42 && lng > 0 && lng < 16 && lat < 44) return false;

    // Inside European landmass
    return true;
  }

  return false;
}

export interface FlowVectorResult {
  vx: number;
  vy: number;
  type: number;
  force: number;
  isWarm: boolean;
  name?: string;
}

/**
 * Evaluates the ocean currents vector at (lat, lng) with realistic gyre circulation
 */
export function evaluateOceanCurrentVector(
  lat: number,
  lng: number,
  season: HydrodynamicSeasonId
): FlowVectorResult {
  if (isLandLocation(lat, lng)) {
    return { vx: 0, vy: 0, type: 0, force: 0, isWarm: false };
  }

  // 1. Canary Current (Cold Upwelling along NW Africa)
  if (lat >= 10 && lat <= 36 && lng >= -25 && lng <= -9.5) {
    const isQ1 = season === 'q1';
    return {
      vx: isQ1 ? -1.20 : -0.85,
      vy: isQ1 ? 3.40 : 2.30,
      type: 1,
      force: isQ1 ? 1.95 : 1.35,
      isWarm: false,
      name: 'Canary Current'
    };
  }

  // 2. Benguela Current (Cold Upwelling along SW Africa into South Atlantic Gyre)
  if (lat >= -35 && lat <= -4 && lng >= 6 && lng <= 16) {
    const isQ3 = season === 'q3';
    return {
      vx: isQ3 ? -2.20 : -1.45,
      vy: isQ3 ? -3.60 : -2.40,
      type: 1,
      force: isQ3 ? 2.40 : 1.60,
      isWarm: false,
      name: 'Benguela Current'
    };
  }

  // 3. Guinea Current (Warm Equatorial conveyor eastward in Gulf of Guinea)
  if (lat >= 0.5 && lat <= 5.5 && lng >= -17 && lng <= 9) {
    const isQ3 = season === 'q3';
    return {
      vx: isQ3 ? 4.20 : 2.60,
      vy: isQ3 ? 0.20 : 0.10,
      type: 1,
      force: isQ3 ? 2.25 : 1.40,
      isWarm: true,
      name: 'Guinea Current'
    };
  }

  // 4. South Equatorial Current (Warm conveyor westward across Atlantic to Brazil)
  if (lat >= -18 && lat <= 3 && lng >= -42 && lng <= 8) {
    const isQ3 = season === 'q3';
    return {
      vx: isQ3 ? -4.60 : -3.20,
      vy: isQ3 ? -0.65 : -0.35,
      type: 1,
      force: isQ3 ? 2.65 : 1.70,
      isWarm: true,
      name: 'South Equatorial Current'
    };
  }

  // 5. Brazil Current (Warm current southward along Brazil coast)
  if (lat >= -36 && lat <= -10 && lng >= -50 && lng <= -34.5) {
    return {
      vx: -0.85,
      vy: 2.80,
      type: 1,
      force: 1.75,
      isWarm: true,
      name: 'Brazil Current'
    };
  }

  // 6. North Equatorial Current (Warm conveyor westward to Caribbean)
  if (lat >= 7 && lat <= 23 && lng >= -72 && lng <= -20) {
    const isQ1 = season === 'q1';
    return {
      vx: isQ1 ? -3.80 : -2.90,
      vy: isQ1 ? -0.30 : -0.20,
      type: 1,
      force: isQ1 ? 2.05 : 1.50,
      isWarm: true,
      name: 'North Equatorial Current'
    };
  }

  // 7. Gulf Stream & North Atlantic Drift (Northeastward highway across North Atlantic)
  if (lat >= 24 && lat <= 56 && lng >= -80 && lng <= -12) {
    return {
      vx: 3.50,
      vy: -2.10,
      type: 1,
      force: 1.85,
      isWarm: false,
      name: 'Gulf Stream & North Atlantic Drift'
    };
  }

  // 8. Agulhas Current (SE Africa / Indian Ocean confluence into South Atlantic)
  if (lat >= -38 && lat <= -18 && lng >= 24 && lng <= 46) {
    return {
      vx: -2.40,
      vy: 2.50,
      type: 1,
      force: 2.10,
      isWarm: true,
      name: 'Agulhas Current'
    };
  }

  // Ambient oceanic background gyre drift
  return {
    vx: lat > 0 ? -0.65 : -0.85,
    vy: lat > 0 ? 0.15 : -0.20,
    type: 0,
    force: 0.65,
    isWarm: false
  };
}

/**
 * Evaluates the atmospheric trade winds vector field at (lat, lng)
 * Formulated with C1 continuity (smooth latitudinal and longitudinal transitions)
 * to ensure wind particles flow freely across Europe and the Atlantic without bunching,
 * stops, or artificial vertical shear lines.
 */
export function evaluateTradeWindVector(
  lat: number,
  lng: number,
  season: HydrodynamicSeasonId
): FlowVectorResult {
  // 1. Summer Southwest African Monsoon Surge (Q3 surge into Gulf of Guinea & Sahel)
  // Formulated with a 2D smooth Gaussian envelope to blend seamlessly into the background flow
  let monsoonVx = 0;
  let monsoonVy = 0;
  let monsoonWeight = 0;

  if (season === 'q3') {
    const latDist = (lat - 7.5) / 5.5;
    const lngDist = (lng - (-3.0)) / 14.0;
    const distSq = latDist * latDist + lngDist * lngDist;
    if (distSq < 2.5) {
      monsoonWeight = Math.exp(-distSq * 0.85);
      monsoonVx = 4.0;
      monsoonVy = -2.1;
    }
  }

  // 2. Mid-Latitude Westerlies (blowing eastward across North Atlantic and Europe)
  // Standard Ferrel cell circulation from 30°N to 65°N+ with natural synoptic wave curvature
  const westerliesVx = 3.80 + 0.35 * Math.sin((lng + 30) * 0.04);
  const westerliesVy = -0.75 + 0.25 * Math.cos((lat - 45) * 0.1);

  // 3. Northeast Trade Winds & Saharan Harmattan (Tropical North Atlantic 5°N to 26°N)
  // Blowing west-southwest across the Atlantic basin toward the Caribbean and Guianas
  const isQ1 = season === 'q1';
  // Harmattan boost over West Africa & eastern tropical Atlantic in Q1
  const harmattanInfluence = (isQ1 && lat >= 6 && lat <= 22 && lng >= -25 && lng <= 15) ? 0.35 : 0;
  const neTradesVx = isQ1 ? -3.85 - harmattanInfluence : -2.85;
  const neTradesVy = isQ1 ? 1.45 + harmattanInfluence * 0.5 : 0.85;

  // 4. Southeast Trade Winds (0° to 35°S)
  // Blowing steadily northwestward from Southern Africa across South Atlantic into Brazil
  const isQ3 = season === 'q3';
  const seTradesVx = isQ3 ? -4.10 : -3.00;
  const seTradesVy = isQ3 ? -1.95 : -1.30;

  // 5. Southern Roaring Forties (lat < -35°S)
  const southernWesterliesVx = 4.30;
  const southernWesterliesVy = -0.30;

  // Seamless latitudinal blending function (smoothstep)
  let vx: number;
  let vy: number;
  let windName: string;
  let force: number;

  if (lat >= 34) {
    // Pure Mid-Latitude Westerlies (across North Atlantic, UK, France, Spain, Central Europe)
    vx = westerliesVx;
    vy = westerliesVy;
    windName = 'Mid-Latitude Westerlies';
    force = 2.1;
  } else if (lat >= 22) {
    // Subtropical High Pressure Ridge / Horse Latitudes (smooth transition between Trades & Westerlies)
    const t = (lat - 22) / 12;
    const smoothT = t * t * (3 - 2 * t); // Hermite smoothstep
    vx = neTradesVx * (1 - smoothT) + westerliesVx * smoothT;
    vy = neTradesVy * (1 - smoothT) + westerliesVy * smoothT;
    windName = smoothT > 0.5 ? 'Mid-Latitude Westerlies' : 'Subtropical Transition (Horse Latitudes)';
    force = 1.4 + 0.7 * smoothT;
  } else if (lat >= 4) {
    // Northeast Trade Winds & Harmattan
    vx = neTradesVx;
    vy = neTradesVy;
    windName = isQ1 ? 'Northeast Trades & Saharan Harmattan' : 'Northeast Trade Winds';
    force = isQ1 ? 2.3 : 1.6;
  } else if (lat >= -4) {
    // Intertropical Convergence Zone (ITCZ / Doldrums transition)
    const t = (lat - (-4)) / 8;
    const smoothT = t * t * (3 - 2 * t);
    vx = seTradesVx * (1 - smoothT) + neTradesVx * smoothT;
    vy = seTradesVy * (1 - smoothT) + neTradesVy * smoothT;
    windName = 'Equatorial Doldrums (ITCZ)';
    force = 0.95;
  } else if (lat >= -34) {
    // Southeast Trade Winds
    vx = seTradesVx;
    vy = seTradesVy;
    windName = 'Southeast Trade Winds';
    force = isQ3 ? 2.5 : 1.7;
  } else {
    // Transition to Southern Westerlies
    const t = Math.max(0, Math.min(1, (-34 - lat) / 6));
    const smoothT = t * t * (3 - 2 * t);
    vx = seTradesVx * (1 - smoothT) + southernWesterliesVx * smoothT;
    vy = seTradesVy * (1 - smoothT) + southernWesterliesVy * smoothT;
    windName = 'Southern Ocean Westerlies';
    force = 2.2;
  }

  // Apply monsoon surge if active in Q3
  if (monsoonWeight > 0.01) {
    vx = vx * (1 - monsoonWeight) + monsoonVx * monsoonWeight;
    vy = vy * (1 - monsoonWeight) + monsoonVy * monsoonWeight;
    if (monsoonWeight > 0.45) {
      windName = 'Southwest African Monsoon Surge';
      force = Math.max(force, 2.4);
    }
  }

  return {
    vx,
    vy,
    type: 2,
    force,
    isWarm: false,
    name: windName
  };
}

/**
 * Unified flow evaluator at virtual canvas coordinates (x, y)
 */
export function evaluateHydrodynamicVector(
  x: number,
  y: number,
  season: HydrodynamicSeasonId,
  showCurrents: boolean = true,
  showWinds: boolean = true,
  particleKind: 'current' | 'wind' = 'current'
): FlowVectorResult {
  // Accurate inverse projection matching projectCoord(lat, lng)
  // projectCoord: x = ((lng - (-105)) / 157) * 1000, y = ((58 - lat) / 96) * 580
  const lng = -105 + (x / 1000) * 157;
  const lat = 58 - (y / 580) * 96;

  if (particleKind === 'wind') {
    if (!showWinds) return { vx: 0, vy: 0, type: 0, force: 0, isWarm: false };
    return evaluateTradeWindVector(lat, lng, season);
  }

  if (particleKind === 'current') {
    if (!showCurrents) return { vx: 0, vy: 0, type: 0, force: 0, isWarm: false };
    return evaluateOceanCurrentVector(lat, lng, season);
  }

  if (showCurrents) {
    return evaluateOceanCurrentVector(lat, lng, season);
  }

  if (showWinds) {
    return evaluateTradeWindVector(lat, lng, season);
  }

  return {
    vx: -0.45,
    vy: 0.05,
    type: 0,
    force: 0.5,
    isWarm: false
  };
}

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
