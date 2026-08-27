import React, { useState, useEffect } from 'react';
import { CountryHeaderMetadata, getCountryHeaderData } from '../data/countryHeaderData';
import {
  Landmark,
  Scale,
  Calendar,
  Globe2,
  Languages,
  Church,
  Clock,
  Thermometer,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  Wind,
  Compass,
  Sparkles,
  Flame,
  Info
} from 'lucide-react';

interface CountryHeaderInfoProps {
  entityId: string;
  className?: string;
  theme?: 'dark' | 'light';
}

export const CountryHeaderInfo: React.FC<CountryHeaderInfoProps> = ({
  entityId,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const metadata = getCountryHeaderData(entityId);

  // Update live clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format local time for the country's timezone
  const formatTime = (timeZone: string) => {
    try {
      const timeFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const hourFormatter = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: 'numeric',
        hour12: false
      });

      const timeStr = timeFormatter.format(currentTime);
      const dateStr = dateFormatter.format(currentTime);
      const localHour = parseInt(hourFormatter.format(currentTime), 10) || 12;

      return { timeStr, dateStr, localHour };
    } catch {
      // Fallback if IANA timezone is invalid
      return {
        timeStr: currentTime.toLocaleTimeString(),
        dateStr: currentTime.toLocaleDateString(),
        localHour: currentTime.getHours()
      };
    }
  };

  const { timeStr, dateStr, localHour } = formatTime(metadata.timeZone);

  // Calculate dynamic realistic temperature based on time of day (diurnal solar cycle) and base climatology
  const calculateLocalTemp = (baseTemp: number, range: [number, number], hour: number) => {
    // Diurnal variation curve: coolest around 05:00 (dawn), warmest around 14:00-15:00
    const hourRad = ((hour - 5) / 24) * 2 * Math.PI;
    const diurnalFactor = Math.sin(hourRad - Math.PI / 2); // -1 at dawn, +1 in mid afternoon
    const spread = (range[1] - range[0]) * 0.4;
    const currentTempC = Math.round(baseTemp + (diurnalFactor * spread));
    const currentTempF = Math.round((currentTempC * 9) / 5 + 32);
    const isNight = hour < 6 || hour >= 19;

    return { currentTempC, currentTempF, isNight };
  };

  const { currentTempC, currentTempF, isNight } = calculateLocalTemp(
    metadata.climate.baseTempC,
    metadata.climate.tempRangeC,
    localHour
  );

  const renderWeatherIcon = () => {
    if (isNight) {
      return <CloudSun className="w-5 h-5 text-indigo-400" />;
    }
    switch (metadata.climate.icon) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />;
      case 'sun-cloud':
        return <CloudSun className="w-5 h-5 text-amber-300" />;
      case 'rain':
      case 'tropical':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'cloud':
      default:
        return <Cloud className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div id={`country-header-info-${entityId}`} className={`space-y-4 pt-1 ${className}`}>
      {/* Primary Key Metadata Grid (Capital, Government, Independence, UN Admission) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Capital City */}
        <div className="group relative rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 border border-zinc-800 dark:border-zinc-800/90 p-3.5 hover:border-amber-500/50 transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                Capital City
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-100 block truncate" title={metadata.capital}>
                {metadata.capital}
              </span>
              {metadata.capitalType && (
                <span className="text-[10px] text-amber-400/90 block truncate">
                  {metadata.capitalType}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Type of Government */}
        <div className="group relative rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 border border-zinc-800 dark:border-zinc-800/90 p-3.5 hover:border-emerald-500/50 transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                Type of Government
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-100 block truncate" title={metadata.governmentType}>
                {metadata.governmentType}
              </span>
              <span className="text-[10px] text-emerald-400/90 block truncate">
                Constitutional System
              </span>
            </div>
          </div>
        </div>

        {/* 3. Independence Date */}
        <div className="group relative rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 border border-zinc-800 dark:border-zinc-800/90 p-3.5 hover:border-blue-500/50 transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                Independence Date
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-100 block truncate" title={metadata.independenceDate}>
                {metadata.independenceDate}
              </span>
              {metadata.independenceFrom && (
                <span className="text-[10px] text-zinc-400 block truncate" title={`From ${metadata.independenceFrom}`}>
                  From {metadata.independenceFrom}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. UN Member Date */}
        <div className="group relative rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/90 border border-zinc-800 dark:border-zinc-800/90 p-3.5 hover:border-cyan-500/50 transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Globe2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                UN Member Date
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-100 block truncate" title={metadata.unMemberDate}>
                {metadata.unMemberDate}
              </span>
              <span className="text-[10px] text-cyan-400/90 block truncate">
                {metadata.unStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Bar: Languages & Religion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Languages (Official & Most Spoken) */}
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/80 p-3.5 space-y-2">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Languages
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Official Languages */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-purple-300/90 min-w-[76px]">
                Official:
              </span>
              {metadata.languages.official.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-purple-950/60 border border-purple-800/60 text-purple-200 font-medium text-[11px]"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* Most Spoken Vernaculars / National */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-zinc-400 min-w-[76px]">
                Most Spoken:
              </span>
              {metadata.languages.mostSpoken.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-[11px]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Religion Demographics */}
        <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800/80 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Religion
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-800/40 text-amber-300 font-medium">
              {metadata.religion.primary}
            </span>
          </div>

          <div className="pt-0.5">
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              {metadata.religion.breakdown}
            </p>
          </div>
        </div>
      </div>

      {/* Live Local Time & Temperature Capsule */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/90 to-cyan-950/40 border border-emerald-800/40 p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Left: Live Ticking Local Time */}
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Live Capital Time
                </span>
                <span className="font-mono text-[10px] px-2 py-0.2 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300">
                  {metadata.timeZoneAbbr} ({metadata.utcOffset})
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-extrabold text-xl md:text-2xl text-zinc-100 tracking-tight">
                  {timeStr}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  • {dateStr}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Live Local Temperature & Climate */}
          <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                {renderWeatherIcon()}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Capital Temperature
                  </span>
                  {/* C / F Unit Toggle */}
                  <div className="inline-flex rounded-md bg-zinc-800 p-0.5 border border-zinc-700">
                    <button
                      type="button"
                      onClick={() => setTempUnit('C')}
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        tempUnit === 'C'
                          ? 'bg-amber-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      °C
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempUnit('F')}
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        tempUnit === 'F'
                          ? 'bg-amber-500 text-zinc-950'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      °F
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-extrabold text-xl md:text-2xl text-amber-300">
                    {tempUnit === 'C' ? `${currentTempC}°C` : `${currentTempF}°F`}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    ({tempUnit === 'C' ? `${currentTempF}°F` : `${currentTempC}°C`})
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block text-right pl-3 border-l border-zinc-800/80">
              <span className="text-[11px] font-semibold text-zinc-300 block">
                {metadata.climate.condition}
              </span>
              <span className="text-[10px] text-zinc-500 block truncate max-w-[200px]" title={metadata.climate.description}>
                {metadata.climate.description}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
