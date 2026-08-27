import React, { useState, useEffect } from 'react';
import { getCountryClimateData, CountryClimateData } from '../data/climateData';
import { fetchLiveWeather, LiveWeatherData, decodeWmoCode } from '../services/weatherService';
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
    if (!weatherData) return <Sun className="w-8 h-8 text-amber-400 animate-pulse" />;
    const wmoInfo = decodeWmoCode(weatherData.weatherCode);

    switch (wmoInfo.iconType) {
      case 'sun':
        return <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />;
      case 'sun-cloud':
        return <CloudSun className="w-8 h-8 text-amber-300" />;
      case 'cloud':
        return <Cloud className="w-8 h-8 text-slate-300" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-cyan-400" />;
      case 'thunder':
        return <CloudLightning className="w-8 h-8 text-amber-400 animate-pulse" />;
      case 'fog':
        return <CloudFog className="w-8 h-8 text-zinc-300" />;
      default:
        return <CloudSun className="w-8 h-8 text-amber-300" />;
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
      {/* Header Banner & Live Weather Card */}
      <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Section Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Trees className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-display">
                {t('climate.title', 'Climate & Ecological Profile')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              {t('climate.subtitle', '12-month climatology cycles, precipitation, historical warming trends, vulnerability matrix & live capital conditions')}
            </p>
          </div>

          {/* Unit Toggle & Refresh Controls */}
          <div className="flex items-center gap-3 self-start lg:self-center">
            {/* °C / °F Unit Toggle */}
            <div className="inline-flex rounded-xl bg-zinc-900 p-1 border border-zinc-800 shadow-inner">
              <button
                type="button"
                onClick={() => setTempUnit('C')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tempUnit === 'C'
                    ? 'bg-emerald-500 text-zinc-950 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setTempUnit('F')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tempUnit === 'F'
                    ? 'bg-emerald-500 text-zinc-950 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                °F
              </button>
            </div>

            {/* Weather Refresh Button */}
            <button
              onClick={loadWeather}
              disabled={isLoadingWeather}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-all cursor-pointer disabled:opacity-50"
              title={t('weather.refresh', 'Refresh Weather')}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-emerald-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">{t('weather.refresh', 'Refresh')}</span>
            </button>
          </div>
        </div>

        {/* Live Weather Capsule Plaque */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-r from-emerald-950/30 via-zinc-900/90 to-cyan-950/30 p-5 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Weather Identity & Temperature */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-md">
                {renderLiveWeatherIcon()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {t('weather.live_title', 'Live Capital Weather')} ({climateData.capitalCity})
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border ${
                    weatherData?.isLive
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                      : 'bg-amber-950 border-amber-800 text-amber-300'
                  }`}>
                    {weatherData?.isLive
                      ? t('weather.source_openmeteo', 'Open-Meteo Live')
                      : t('weather.source_cached', 'Cached Climatology')}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono font-extrabold text-3xl sm:text-4xl text-zinc-100 tracking-tight">
                    {currentDisplayTemp}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {t('weather.apparent_temp', 'Feels like')} {currentFeelsLike}
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-300">
                  {weatherData?.condition || climateData.offlineBaseline.condition} • {climateData.climateZone}
                </div>
              </div>
            </div>

            {/* Right: Weather Metrics Grid (Humidity, Wind, Precipitation) */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
              {/* Humidity */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t('weather.humidity', 'Humidity')}</span>
                </div>
                <div className="font-mono font-bold text-base sm:text-lg text-zinc-100">
                  {weatherData?.humidity ?? climateData.offlineBaseline.humidity}%
                </div>
                <span className="text-[10px] text-zinc-500">Relative</span>
              </div>

              {/* Wind Speed & Direction */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t('weather.wind', 'Wind')}</span>
                </div>
                <div className="font-mono font-bold text-base sm:text-lg text-zinc-100">
                  {weatherData?.windSpeedKmh ?? climateData.offlineBaseline.windSpeedKmh} <span className="text-xs text-zinc-400 font-normal">km/h</span>
                </div>
                <span className="text-[10px] text-teal-400 font-mono">
                  {weatherData?.windCardinal ?? 'N'} ({weatherData?.windDirectionDeg ?? 0}°)
                </span>
              </div>

              {/* WMO Status / Rain */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                  <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rainfall</span>
                </div>
                <div className="font-mono font-bold text-base sm:text-lg text-zinc-100">
                  {weatherData?.precipitationMm ?? 0} <span className="text-xs text-zinc-400 font-normal">mm</span>
                </div>
                <span className="text-[10px] text-zinc-500">Hourly Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 12-Month Climatology Cycle & Historical Warming Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dual Axis 12-Month Temperature Cycle & Monthly Precipitation */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                {t('climate.temp_cycle_title', '12-Month Temperature & Precipitation Cycle')}
              </h3>
              <p className="text-xs text-zinc-400">
                {t('climate.temp_cycle_desc', 'Monthly mean temperatures (°C/°F) and precipitation distribution (mm)')}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Temp ({tempUnit === 'C' ? '°C' : '°F'})
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" fontSize={11} />
                <YAxis yAxisId="temp" stroke="#f59e0b" fontSize={11} tickFormatter={v => `${v}°`} />
                <YAxis yAxisId="precip" orientation="right" stroke="#06b6d4" fontSize={11} tickFormatter={v => `${v}mm`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
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

          {/* Climatology Callout Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Annual Mean Temp</span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {tempUnit === 'C'
                  ? `${climateData.annualMeanTempC}°C`
                  : `${Math.round((climateData.annualMeanTempC * 9) / 5 + 32)}°F`}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Annual Rainfall</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">
                {climateData.annualPrecipitationMm} mm/yr
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950/40 border border-zinc-800 col-span-2 sm:col-span-1">
              <span className="text-zinc-500 block text-[10px] uppercase font-bold">Warming Trajectory</span>
              <span className="font-mono font-bold text-rose-400 text-sm">
                +{climateData.warmingRatePerDecadeC}°C / decade
              </span>
            </div>
          </div>
        </div>

        {/* Historical Warming Trend (1970-2024) */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                {t('climate.historical_trend_title', 'Historical Warming Trends')}
              </h3>
              <p className="text-xs text-zinc-400">1970–2024 Mean Temperature Evolution</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 font-mono font-semibold">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="year" stroke="#71717a" fontSize={11} />
                <YAxis stroke="#71717a" fontSize={11} domain={['auto', 'auto']} tickFormatter={v => `${v}°`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', color: '#f4f4f5' }}
                  formatter={(val: any) => [`${val}°${tempUnit}`, 'Annual Mean Temp']}
                />
                <Area type="monotone" dataKey="temp" stroke="#f43f5e" strokeWidth={2.5} fill="url(#warmGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Temperature Anomaly Bar Preview */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-300">
                {t('climate.anomaly_title', 'Baseline Anomaly Trajectory')}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Relative to 1961–1990 Baseline</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center">
              {climateData.anomalies.map((anom, idx) => (
                <div key={idx} className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 block font-mono">{anom.year}</span>
                  <span className={`text-xs font-mono font-bold ${
                    anom.anomalyC > 1.2 ? 'text-rose-400' : anom.anomalyC > 0.6 ? 'text-amber-400' : 'text-emerald-400'
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
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              {t('climate.vulnerability_title', 'Climate Vulnerability & Readiness Matrix')}
            </h3>
            <p className="text-xs text-zinc-400">
              {t('climate.vulnerability_desc', 'ND-GAIN Index, ecosystem resilience, extreme weather exposure, and structural adaptation indicators')}
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Notre Dame Global Adaptation Initiative (ND-GAIN)
          </span>
        </div>

        {/* 6 Core Vulnerability Indicators Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. ND-GAIN Index */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              {t('vuln.ndgain_index', 'ND-GAIN Index')}
            </span>
            <div className="font-mono font-extrabold text-xl text-amber-400">
              {climateData.vulnerability.ndGainIndex}
            </div>
            <span className="text-[10px] text-zinc-400 block">
              Rank #{climateData.vulnerability.ndGainRank} / 185
            </span>
          </div>

          {/* 2. ND-GAIN Readiness */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              {t('vuln.readiness', 'Readiness Score')}
            </span>
            <div className="font-mono font-extrabold text-xl text-emerald-400">
              {climateData.vulnerability.readinessScore}
            </div>
            <span className="text-[10px] text-zinc-400 block">
              Investment Capacity
            </span>
          </div>

          {/* 3. Drought & Extreme Heat Risk */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              {t('vuln.drought_risk', 'Drought & Heat')}
            </span>
            <div className={`font-mono font-extrabold text-base ${
              climateData.vulnerability.droughtRisk === 'Critical' ? 'text-rose-400' : 'text-amber-400'
            }`}>
              {climateData.vulnerability.droughtRisk}
            </div>
            <span className="text-[10px] text-zinc-400 block">
              {climateData.vulnerability.extremeHeatDaysPerYear} Days &gt;35°C/yr
            </span>
          </div>

          {/* 4. Flood & Coastal Surge Risk */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              {t('vuln.flood_risk', 'Flood & Surge')}
            </span>
            <div className={`font-mono font-extrabold text-base ${
              climateData.vulnerability.floodRisk === 'Severe' ? 'text-rose-400' : 'text-cyan-400'
            }`}>
              {climateData.vulnerability.floodRisk}
            </div>
            <span className="text-[10px] text-zinc-400 block">
              Basin Inundation
            </span>
          </div>

          {/* 5. Freshwater Stress */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              {t('vuln.water_stress', 'Water Stress')}
            </span>
            <div className={`font-mono font-extrabold text-base ${
              climateData.vulnerability.waterStress === 'Extremely High' ? 'text-rose-400' : 'text-teal-400'
            }`}>
              {climateData.vulnerability.waterStress}
            </div>
            <span className="text-[10px] text-zinc-400 block">
              Aquifer Extraction
            </span>
          </div>

          {/* 6. Renewable Share & NDC Target */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">
              {t('vuln.renewable_share', 'Renewable Grid')}
            </span>
            <div className="font-mono font-extrabold text-xl text-emerald-400">
              {climateData.vulnerability.renewableElectricitySharePct}%
            </div>
            <span className="text-[10px] text-emerald-300 block">
              Target: {climateData.vulnerability.renewableTarget2030Pct}% by 2030
            </span>
          </div>
        </div>
      </div>

      {/* National Ecological Profile & Clamped Resilience Narrative */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {t('climate.resilience_title', 'National Resilience Narrative & Adaptation Strategy')}
            </h3>
            <p className="text-xs text-zinc-400">
              {t('climate.resilience_desc', 'Comprehensive policy adaptation programs, NDC commitments, renewable integration, and ecological conservation')}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-zinc-400">
            Biome: {climateData.ecology.biome}
          </span>
        </div>

        {/* Flagship Climate & Ecology Tags */}
        <div className="flex flex-wrap gap-2">
          {climateData.resilience.flagshipInitiatives.map((flagship, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs font-semibold text-emerald-300"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {flagship}
            </span>
          ))}
        </div>

        {/* Text Clamping Container with Read More / Show Less Toggle */}
        <div className="relative rounded-2xl bg-zinc-950/60 border border-zinc-800/90 p-4 sm:p-5 space-y-3">
          <div className={`space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed ${
            !isNarrativeExpanded ? 'line-clamp-3 relative' : ''
          }`}>
            <p className="font-semibold text-zinc-100">
              {climateData.resilience.summary}
            </p>
            {climateData.resilience.fullNarrative.map((paragraph, pIdx) => (
              <p key={pIdx}>
                {paragraph}
              </p>
            ))}
            <div className="pt-2 border-t border-zinc-800 text-xs text-emerald-300 font-medium">
              <strong>NDC Paris Commitment:</strong> {climateData.resilience.ndcTargetSummary}
            </div>
          </div>

          {/* Clamped Gradient Fade Overlay when collapsed */}
          {!isNarrativeExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none rounded-b-2xl" />
          )}

          {/* Interactive Clamp Toggle Button */}
          <div className="pt-2 flex justify-center relative z-10">
            <button
              type="button"
              onClick={() => setIsNarrativeExpanded(prev => !prev)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-zinc-700 hover:border-emerald-500/60 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer shadow-md"
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
