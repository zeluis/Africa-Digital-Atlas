import React, { useState, useEffect } from 'react';
import { getCountryClimateData, CountryClimateData } from '../data/climateData';
import { fetchLiveWeather, LiveWeatherData, decodeWmoCode } from '../services/weatherService';
import { atlas } from '../data/atlas-store';
import { getRegionCalmColor, getCountryRegionTonalPalette } from '../data/unGeoschemeColors';
import { useTranslation } from '../i18n/LanguageContext';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Trees,
  Flame,
  Waves,
  Zap,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Globe2,
  Info,
  CheckCircle2
} from 'lucide-react';

interface ClimateEcologySectionProps {
  entityId: string;
  countryName: string;
  className?: string;
}

export const ClimateEcologySection: React.FC<ClimateEcologySectionProps> = ({
  entityId,
  countryName,
  className = ''
}) => {
  const { t, isRTL } = useTranslation();
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [isNarrativeExpanded, setIsNarrativeExpanded] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);

  const climateData = getCountryClimateData(entityId, countryName);
  const entity = atlas.getEntity(entityId);
  const regionCalmBg = entity ? getRegionCalmColor(entity.region) : 'var(--region-pan-african-calm, #f4f5f4)';
  const regionPalette = getCountryRegionTonalPalette(entityId);

  // Fetch live weather data with fallback
  const loadWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const data = await fetchLiveWeather(
        entityId,
        climateData.coordinates.lat,
        climateData.coordinates.lng,
        climateData.offlineBaseline
      );
      setWeatherData(data);
    } catch {
      // Handled in service fallback
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [entityId, climateData.coordinates.lat, climateData.coordinates.lng]);

  // Format monthly cycle data for chart according to selected temp unit
  const chartCycleData = climateData.monthlyCycle.map(item => ({
    month: item.month,
    monthNum: item.monthNum,
    temp: tempUnit === 'C' ? item.tempC : Math.round((item.tempC * 9) / 5 + 32),
    precip: item.precipMm,
  }));

  // Format historical trend data
  const chartTrendData = climateData.historicalTrends.map(item => ({
    decade: item.decade,
    year: item.year,
    temp: tempUnit === 'C' ? item.meanTempC : Math.round((item.meanTempC * 9) / 5 + 32),
  }));

  // Format anomaly data
  const chartAnomalyData = climateData.anomalies.map(item => ({
    year: item.year.toString(),
    anomaly: item.anomalyC,
    color: item.anomalyC > 1.0 ? '#ef4444' : item.anomalyC > 0.5 ? '#f59e0b' : '#10b981',
  }));

  // Render weather icon based on WMO condition
  const renderLiveWeatherIcon = () => {
    if (!weatherData) return <Sun className="w-8 h-8 text-amber-500 animate-pulse" />;
    const wmoInfo = decodeWmoCode(weatherData.weatherCode);

    switch (wmoInfo.iconType) {
      case 'sun':
        return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
      case 'sun-cloud':
        return <CloudSun className="w-8 h-8 text-amber-500" />;
      case 'cloud':
        return <Cloud className="w-8 h-8 text-slate-500" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-cyan-600" />;
      case 'thunder':
        return <CloudLightning className="w-8 h-8 text-amber-500 animate-pulse" />;
      case 'fog':
        return <CloudFog className="w-8 h-8 text-zinc-500" />;
      default:
        return <CloudSun className="w-8 h-8 text-amber-500" />;
    }
  };

  const currentDisplayTemp = weatherData
    ? tempUnit === 'C'
      ? `${weatherData.temperatureC}°C`
      : `${weatherData.temperatureF}°F`
    : `${climateData.offlineBaseline.tempC}°C`;

  const currentFeelsLike = weatherData
    ? tempUnit === 'C'
      ? `${weatherData.apparentTempC}°C`
      : `${weatherData.apparentTempF}°F`
    : `${climateData.offlineBaseline.tempC}°C`;

  return (
    <div id={`climate-ecology-section-${entityId}`} className={`space-y-6 ${className}`}>
      {/* Header Banner & Live Weather Card with Pure Regional Tonal Directional Gradient */}
      <div 
        className="relative rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden space-y-6 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${regionPalette.gradientStart} 0%, ${regionPalette.gradientMid} 48%, ${regionPalette.gradientEnd} 100%)`,
          borderColor: regionPalette.atlasBorder,
          borderWidth: '1px'
        }}
      >
        {/* Subtle Ambient Regional Radial Glow in top-left */}
        <div 
          className="pointer-events-none absolute -top-28 -left-28 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: regionPalette.ambientAura }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Section Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <Trees className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 font-display">
                {t('climate.title', 'Climate & Ecological Profile')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              {t('climate.subtitle', '12-month climatology cycles, precipitation, historical warming trends, vulnerability matrix & live capital conditions')}
            </p>
          </div>

          {/* Unit Toggle & Refresh Controls */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            {/* °C / °F Unit Toggle */}
            <div className="inline-flex rounded-xl bg-zinc-100 p-1 border border-zinc-200 shadow-xs">
              <button
                type="button"
                onClick={() => setTempUnit('C')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tempUnit === 'C'
                    ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setTempUnit('F')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tempUnit === 'F'
                    ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                °F
              </button>
            </div>

            {/* Weather Refresh Button */}
            <button
              onClick={loadWeather}
              disabled={isLoadingWeather}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              title={t('weather.refresh', 'Refresh Weather')}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-emerald-600' : 'text-zinc-500'}`} />
              <span className="hidden sm:inline">{t('weather.refresh', 'Refresh')}</span>
            </button>
          </div>
        </div>

        {/* Live Weather Capsule Plaque - Elevated Crisp White Surface */}
        <div className="relative z-10 rounded-2xl border border-zinc-200/90 bg-white/95 p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Weather Identity & Temperature */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                {renderLiveWeatherIcon()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono">
                    {t('weather.live_title', 'Live Capital Weather')} ({climateData.capitalCity})
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border ${
                    weatherData?.isLive
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    {weatherData?.isLive
                      ? t('weather.source_openmeteo', 'Open-Meteo Live')
                      : t('weather.source_cached', 'Cached Climatology')}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono font-extrabold text-3xl sm:text-4xl text-zinc-900 tracking-tight">
                    {currentDisplayTemp}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {t('weather.apparent_temp', 'Feels like')} {currentFeelsLike}
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-700">
                  {weatherData?.condition || climateData.offlineBaseline.condition} • {climateData.climateZone}
                </div>
              </div>
            </div>

            {/* Right: Weather Metrics Grid (Humidity, Wind, Precipitation) */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-zinc-200/80 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
              {/* Humidity */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{t('weather.humidity', 'Humidity')}</span>
                </div>
                <div className="font-mono font-bold text-base sm:text-lg text-zinc-900">
                  {weatherData?.humidity ?? climateData.offlineBaseline.humidity}%
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Relative</span>
              </div>

              {/* Wind Speed & Direction */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <Wind className="w-3.5 h-3.5 text-teal-600" />
                  <span>{t('weather.wind', 'Wind')}</span>
                </div>
                <div className="font-mono font-bold text-base sm:text-lg text-zinc-900">
                  {weatherData?.windSpeedKmh ?? climateData.offlineBaseline.windSpeedKmh} <span className="text-xs text-zinc-500 font-normal">km/h</span>
                </div>
                <span className="text-[10px] text-teal-700 font-mono font-medium">
                  {weatherData?.windCardinal ?? 'N'} ({weatherData?.windDirectionDeg ?? 0}°)
                </span>
              </div>

              {/* WMO Status / Rain */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <CloudRain className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Rainfall</span>
                </div>
                <div className="font-mono font-bold text-base sm:text-lg text-zinc-900">
                  {weatherData?.precipitationMm ?? 0} <span className="text-xs text-zinc-500 font-normal">mm</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Hourly Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 12-Month Climatology Cycle & Historical Warming Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dual Axis 12-Month Temperature Cycle & Monthly Precipitation */}
        <div 
          className="lg:col-span-7 rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs transition-colors"
          style={{ backgroundColor: regionCalmBg }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-500" />
                {t('climate.temp_cycle_title', '12-Month Temperature & Precipitation Cycle')}
              </h3>
              <p className="text-xs text-zinc-600">
                {t('climate.temp_cycle_desc', 'Monthly mean temperatures (°C/°F) and precipitation distribution (mm)')}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Temp ({tempUnit === 'C' ? '°C' : '°F'})
              </span>
              <span className="flex items-center gap-1.5 text-cyan-700">
                <span className="w-2.5 h-2.5 rounded-xs bg-cyan-500"></span> Rain (mm)
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartCycleData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradCycle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis yAxisId="temp" stroke="#d97706" fontSize={11} tickFormatter={v => `${v}°`} />
                <YAxis yAxisId="precip" orientation="right" stroke="#0891b2" fontSize={11} tickFormatter={v => `${v}mm`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '0.75rem', color: '#18181b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(val: any, name: any) => [
                    name === 'temp' ? `${val}°${tempUnit}` : `${val} mm`,
                    name === 'temp' ? 'Mean Temperature' : 'Precipitation'
                  ]}
                />
                <Bar yAxisId="precip" dataKey="precip" fill="#06b6d4" opacity={0.65} radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Area yAxisId="temp" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2.5} fill="url(#tempGradCycle)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Climatology Callout Badges - Elevated Crisp White Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-200/60 text-xs">
            <div className="p-2.5 rounded-xl bg-white/95 border border-zinc-200/90 shadow-xs">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold font-mono">Annual Mean Temp</span>
              <span className="font-mono font-bold text-amber-700 text-sm">
                {tempUnit === 'C'
                  ? `${climateData.annualMeanTempC}°C`
                  : `${Math.round((climateData.annualMeanTempC * 9) / 5 + 32)}°F`}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/95 border border-zinc-200/90 shadow-xs">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold font-mono">Annual Rainfall</span>
              <span className="font-mono font-bold text-cyan-700 text-sm">
                {climateData.annualPrecipitationMm} mm/yr
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/95 border border-zinc-200/90 col-span-2 sm:col-span-1 shadow-xs">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold font-mono">Warming Trajectory</span>
              <span className="font-mono font-bold text-rose-700 text-sm">
                +{climateData.warmingRatePerDecadeC}°C / decade
              </span>
            </div>
          </div>
        </div>

        {/* Historical Warming Trend (1970-2024) */}
        <div 
          className="lg:col-span-5 rounded-2xl border border-zinc-200/80 p-6 space-y-4 shadow-xs transition-colors"
          style={{ backgroundColor: regionCalmBg }}
        >
          <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                {t('climate.historical_trend_title', 'Historical Warming Trends')}
              </h3>
              <p className="text-xs text-zinc-600">1970–2024 Mean Temperature Evolution</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 font-mono font-semibold">
              +{climateData.warmingRatePerDecadeC}°C/dec
            </span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="warmGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} domain={['auto', 'auto']} tickFormatter={v => `${v}°`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '0.75rem', color: '#18181b', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(val: any) => [`${val}°${tempUnit}`, 'Annual Mean Temp']}
                />
                <Area type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={2.5} fill="url(#warmGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Temperature Anomaly Bar Preview - Elevated Crisp White Tiles */}
          <div className="pt-2 border-t border-zinc-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-800">
                {t('climate.anomaly_title', 'Baseline Anomaly Trajectory')}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Relative to 1961–1990 Baseline</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center">
              {climateData.anomalies.map((anom, idx) => (
                <div key={idx} className="p-1.5 rounded-lg bg-white/95 border border-zinc-200/90 shadow-xs">
                  <span className="text-[10px] text-zinc-500 block font-mono">{anom.year}</span>
                  <span className={`text-xs font-mono font-bold ${
                    anom.anomalyC > 1.2 ? 'text-rose-700' : anom.anomalyC > 0.6 ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {anom.anomalyC > 0 ? `+${anom.anomalyC}` : anom.anomalyC}°C
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Climate Vulnerability & Risk Matrix */}
      <div 
        className="rounded-2xl border border-zinc-200/80 p-6 space-y-5 shadow-xs transition-colors"
        style={{ backgroundColor: regionCalmBg }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 pb-3">
          <div>
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              {t('climate.vulnerability_title', 'Climate Vulnerability & Readiness Matrix')}
            </h3>
            <p className="text-xs text-zinc-600">
              {t('climate.vulnerability_desc', 'ND-GAIN Index, ecosystem resilience, extreme weather exposure, and structural adaptation indicators')}
            </p>
          </div>
          <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Notre Dame Global Adaptation Initiative (ND-GAIN)
          </span>
        </div>

        {/* 6 Core Vulnerability Indicators Grid - Elevated Crisp White Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. ND-GAIN Index */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-zinc-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block font-mono tracking-wider">
              {t('vuln.ndgain_index', 'ND-GAIN Index')}
            </span>
            <div className="font-mono font-extrabold text-xl text-amber-700">
              {climateData.vulnerability.ndGainIndex}
            </div>
            <span className="text-[10px] text-zinc-600 block font-mono">
              Rank #{climateData.vulnerability.ndGainRank} / 185
            </span>
          </div>

          {/* 2. ND-GAIN Readiness */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-zinc-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block font-mono tracking-wider">
              {t('vuln.readiness', 'Readiness Score')}
            </span>
            <div className="font-mono font-extrabold text-xl text-emerald-700">
              {climateData.vulnerability.readinessScore}
            </div>
            <span className="text-[10px] text-zinc-600 block font-mono">
              Investment Capacity
            </span>
          </div>

          {/* 3. Drought & Extreme Heat Risk */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-zinc-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block font-mono tracking-wider">
              {t('vuln.drought_risk', 'Drought & Heat')}
            </span>
            <div className={`font-mono font-extrabold text-base ${
              climateData.vulnerability.droughtRisk === 'Critical' ? 'text-rose-700' : 'text-amber-700'
            }`}>
              {climateData.vulnerability.droughtRisk}
            </div>
            <span className="text-[10px] text-zinc-600 block font-mono">
              {climateData.vulnerability.extremeHeatDaysPerYear} Days &gt;35°C/yr
            </span>
          </div>

          {/* 4. Flood & Coastal Surge Risk */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-zinc-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block font-mono tracking-wider">
              {t('vuln.flood_risk', 'Flood & Surge')}
            </span>
            <div className={`font-mono font-extrabold text-base ${
              climateData.vulnerability.floodRisk === 'Severe' ? 'text-rose-700' : 'text-cyan-700'
            }`}>
              {climateData.vulnerability.floodRisk}
            </div>
            <span className="text-[10px] text-zinc-600 block font-mono">
              Basin Inundation
            </span>
          </div>

          {/* 5. Freshwater Stress */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-zinc-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block font-mono tracking-wider">
              {t('vuln.water_stress', 'Water Stress')}
            </span>
            <div className={`font-mono font-extrabold text-base ${
              climateData.vulnerability.waterStress === 'Extremely High' ? 'text-rose-700' : 'text-teal-700'
            }`}>
              {climateData.vulnerability.waterStress}
            </div>
            <span className="text-[10px] text-zinc-600 block font-mono">
              Aquifer Extraction
            </span>
          </div>

          {/* 6. Renewable Share & NDC Target */}
          <div className="p-3.5 rounded-2xl bg-white/95 border border-zinc-200/90 space-y-1 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block font-mono tracking-wider">
              {t('vuln.renewable_share', 'Renewable Grid')}
            </span>
            <div className="font-mono font-extrabold text-xl text-emerald-700">
              {climateData.vulnerability.renewableElectricitySharePct}%
            </div>
            <span className="text-[10px] text-emerald-700 block font-mono font-medium">
              Target: {climateData.vulnerability.renewableTarget2030Pct}% by 2030
            </span>
          </div>
        </div>
      </div>

      {/* National Ecological Profile & Clamped Resilience Narrative */}
      <div 
        className="rounded-2xl border border-zinc-200/80 p-6 space-y-5 shadow-xs transition-colors"
        style={{ backgroundColor: regionCalmBg }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/60 pb-3">
          <div>
            <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t('climate.resilience_title', 'National Resilience Narrative & Adaptation Strategy')}
            </h3>
            <p className="text-xs text-zinc-600">
              {t('climate.resilience_desc', 'Comprehensive policy adaptation programs, NDC commitments, renewable integration, and ecological conservation')}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-zinc-600">
            Biome: {climateData.ecology.biome}
          </span>
        </div>

        {/* Flagship Climate & Ecology Tags - Clean Regional Light Chips */}
        <div className="flex flex-wrap gap-2">
          {climateData.resilience.flagshipInitiatives.map((flagship, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {flagship}
            </span>
          ))}
        </div>

        {/* Text Clamping Container with Read More / Show Less Toggle - Elevated Crisp White Surface */}
        <div className="relative rounded-2xl bg-white/95 border border-zinc-200/90 p-4 sm:p-5 space-y-3 shadow-xs">
          <div className={`space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed ${
            !isNarrativeExpanded ? 'line-clamp-3 relative' : ''
          }`}>
            <p className="font-semibold text-zinc-900">
              {climateData.resilience.summary}
            </p>
            {climateData.resilience.fullNarrative.map((paragraph, pIdx) => (
              <p key={pIdx}>
                {paragraph}
              </p>
            ))}
            <div className="pt-2 border-t border-zinc-200 text-xs text-emerald-800 font-medium">
              <strong>NDC Paris Commitment:</strong> {climateData.resilience.ndcTargetSummary}
            </div>
          </div>

          {/* Clamped Gradient Fade Overlay when collapsed */}
          {!isNarrativeExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none rounded-b-2xl" />
          )}

          {/* Interactive Clamp Toggle Button */}
          <div className="pt-2 flex justify-center relative z-10">
            <button
              type="button"
              onClick={() => setIsNarrativeExpanded(prev => !prev)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-zinc-200 hover:border-emerald-300 bg-white hover:bg-zinc-50 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-all cursor-pointer shadow-xs"
            >
              {isNarrativeExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>{t('action.show_less', 'Show Summary')}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>{t('action.read_more', 'Read Full Ecological & Resilience Narrative')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
