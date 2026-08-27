/**
 * Open-Meteo Live Weather & Climate Service
 * Provides real-time meteorological observations for African capital cities
 * with offline resilience, WMO code decoding, wind vectors, and localStorage caching.
 */

export interface LiveWeatherData {
  temperatureC: number;
  temperatureF: number;
  apparentTempC: number;
  apparentTempF: number;
  humidity: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  windCardinal: string;
  precipitationMm: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
  isLive: boolean;
  isCached: boolean;
  lastUpdated: string;
  source: 'Open-Meteo API' | 'Offline Climatology Cache';
}

export interface WmoCodeInfo {
  description: string;
  iconType: 'sun' | 'sun-cloud' | 'cloud' | 'rain' | 'thunder' | 'fog' | 'snow';
}

export const WMO_CODE_MAP: Record<number, WmoCodeInfo> = {
  0: { description: 'Clear sky', iconType: 'sun' },
  1: { description: 'Mainly clear', iconType: 'sun-cloud' },
  2: { description: 'Partly cloudy', iconType: 'sun-cloud' },
  3: { description: 'Overcast', iconType: 'cloud' },
  45: { description: 'Fog', iconType: 'fog' },
  48: { description: 'Depositing rime fog', iconType: 'fog' },
  51: { description: 'Light drizzle', iconType: 'rain' },
  53: { description: 'Moderate drizzle', iconType: 'rain' },
  55: { description: 'Dense intensity drizzle', iconType: 'rain' },
  56: { description: 'Light freezing drizzle', iconType: 'rain' },
  57: { description: 'Dense freezing drizzle', iconType: 'rain' },
  61: { description: 'Slight rain', iconType: 'rain' },
  63: { description: 'Moderate rain', iconType: 'rain' },
  65: { description: 'Heavy rain', iconType: 'rain' },
  66: { description: 'Light freezing rain', iconType: 'rain' },
  67: { description: 'Heavy freezing rain', iconType: 'rain' },
  71: { description: 'Slight snow fall', iconType: 'snow' },
  73: { description: 'Moderate snow fall', iconType: 'snow' },
  75: { description: 'Heavy snow fall', iconType: 'snow' },
  77: { description: 'Snow grains', iconType: 'snow' },
  80: { description: 'Slight rain showers', iconType: 'rain' },
  81: { description: 'Moderate rain showers', iconType: 'rain' },
  82: { description: 'Violent rain showers', iconType: 'rain' },
  85: { description: 'Slight snow showers', iconType: 'snow' },
  86: { description: 'Heavy snow showers', iconType: 'snow' },
  95: { description: 'Thunderstorm', iconType: 'thunder' },
  96: { description: 'Thunderstorm with slight hail', iconType: 'thunder' },
  99: { description: 'Thunderstorm with heavy hail', iconType: 'thunder' },
};

export function decodeWmoCode(code: number): WmoCodeInfo {
  return WMO_CODE_MAP[code] || { description: 'Variable weather', iconType: 'sun-cloud' };
}

export function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

const CACHE_PREFIX = 'atlas_weather_cache_';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes fresh cache

export async function fetchLiveWeather(
  entityId: string,
  lat: number,
  lng: number,
  fallbackBaseline: {
    tempC: number;
    humidity: number;
    windSpeedKmh: number;
    windDirectionDeg: number;
    weatherCode: number;
    condition: string;
  }
): Promise<LiveWeatherData> {
  const cacheKey = `${CACHE_PREFIX}${entityId.toUpperCase()}`;
  const now = Date.now();

  // Check cached copy first
  try {
    const rawCache = localStorage.getItem(cacheKey);
    if (rawCache) {
      const parsed = JSON.parse(rawCache);
      if (now - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
        return {
          ...parsed.data,
          isCached: true,
        };
      }
    }
  } catch {
    // Ignore cache parse error
  }

  // Attempt live fetch from Open-Meteo
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`;
    
    // Set 5-second fetch timeout to prevent hanging on slow networks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const current = data.current;

      if (current) {
        const tempC = Math.round(current.temperature_2m * 10) / 10;
        const tempF = Math.round((tempC * 9) / 5 + 32);
        const apparentC = current.apparent_temperature ? Math.round(current.apparent_temperature * 10) / 10 : tempC;
        const apparentF = Math.round((apparentC * 9) / 5 + 32);
        const humidity = Math.round(current.relative_humidity_2m || fallbackBaseline.humidity);
        const windSpeed = Math.round(current.wind_speed_10m || fallbackBaseline.windSpeedKmh);
        const windDir = Math.round(current.wind_direction_10m || fallbackBaseline.windDirectionDeg);
        const weatherCode = current.weather_code ?? fallbackBaseline.weatherCode;
        const condition = decodeWmoCode(weatherCode).description;
        const isDay = current.is_day === 1;

        const liveData: LiveWeatherData = {
          temperatureC: tempC,
          temperatureF: tempF,
          apparentTempC: apparentC,
          apparentTempF: apparentF,
          humidity,
          windSpeedKmh: windSpeed,
          windDirectionDeg: windDir,
          windCardinal: degreesToCardinal(windDir),
          precipitationMm: current.precipitation || 0,
          weatherCode,
          condition,
          isDay,
          isLive: true,
          isCached: false,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'Open-Meteo API',
        };

        // Cache successful response
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: liveData }));
        } catch {
          // Ignore storage overflow
        }

        return liveData;
      }
    }
  } catch {
    // Network failure or timeout: graceful fallback to offline cached data
  }

  // Graceful offline fallback: Use previously stored cache or realistic climatology baseline
  try {
    const rawCache = localStorage.getItem(cacheKey);
    if (rawCache) {
      const parsed = JSON.parse(rawCache);
      if (parsed.data) {
        return {
          ...parsed.data,
          isLive: false,
          isCached: true,
          source: 'Offline Climatology Cache',
        };
      }
    }
  } catch {
    // Ignore error
  }

  // Fallback to baseline climatology
  const fallbackTempC = fallbackBaseline.tempC;
  const fallbackTempF = Math.round((fallbackTempC * 9) / 5 + 32);

  return {
    temperatureC: fallbackTempC,
    temperatureF: fallbackTempF,
    apparentTempC: fallbackTempC,
    apparentTempF: fallbackTempF,
    humidity: fallbackBaseline.humidity,
    windSpeedKmh: fallbackBaseline.windSpeedKmh,
    windDirectionDeg: fallbackBaseline.windDirectionDeg,
    windCardinal: degreesToCardinal(fallbackBaseline.windDirectionDeg),
    precipitationMm: 0,
    weatherCode: fallbackBaseline.weatherCode,
    condition: fallbackBaseline.condition,
    isDay: true,
    isLive: false,
    isCached: true,
    lastUpdated: 'Baseline climatology',
    source: 'Offline Climatology Cache',
  };
}
