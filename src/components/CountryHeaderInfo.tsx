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
        <div className="group relative rounded-2xl bg-white/95 border border-zinc-200/90 p-3.5 hover:border-zinc-300 transition-all duration-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <Landmark className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">
                Capital City
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 block truncate" title={metadata.capital}>
                {metadata.capital}
              </span>
              {metadata.capitalType && (
                <span className="text-[10px] text-amber-700 block truncate font-medium">
                  {metadata.capitalType}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Type of Government */}
        <div className="group relative rounded-2xl bg-white/95 border border-zinc-200/90 p-3.5 hover:border-zinc-300 transition-all duration-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">
                Type of Government
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 block truncate" title={metadata.governmentType}>
                {metadata.governmentType}
              </span>
              <span className="text-[10px] text-emerald-700 block truncate font-medium">
                Constitutional System
              </span>
            </div>
          </div>
        </div>

        {/* 3. Independence Date */}
        <div className="group relative rounded-2xl bg-white/95 border border-zinc-200/90 p-3.5 hover:border-zinc-300 transition-all duration-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">
                Independence Date
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 block truncate" title={metadata.independenceDate}>
                {metadata.independenceDate}
              </span>
              {metadata.independenceFrom && (
                <span className="text-[10px] text-zinc-600 block truncate font-mono" title={`From ${metadata.independenceFrom}`}>
                  From {metadata.independenceFrom}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. UN Member Date */}
        <div className="group relative rounded-2xl bg-white/95 border border-zinc-200/90 p-3.5 hover:border-zinc-300 transition-all duration-200 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600">
              <Globe2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">
                UN Member Date
              </span>
              <span className="text-xs sm:text-sm font-bold text-zinc-900 block truncate" title={metadata.unMemberDate}>
                {metadata.unMemberDate}
              </span>
              <span className="text-[10px] text-cyan-700 block truncate font-mono font-medium">
                {metadata.unStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Bar: Languages & Religion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Languages (Official & Most Spoken) */}
        <div className="rounded-2xl bg-white/95 border border-zinc-200/90 p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-mono">
              Languages
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Official Languages */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-purple-700 min-w-[76px] font-mono">
                Official:
              </span>
              {metadata.languages.official.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 font-medium text-[11px]"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* Most Spoken Vernaculars / National */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-semibold text-zinc-600 min-w-[76px] font-mono">
                Most Spoken:
              </span>
              {metadata.languages.mostSpoken.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Religion Demographics */}
        <div className="rounded-2xl bg-white/95 border border-zinc-200/90 p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Church className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 font-mono">
                Religion
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-semibold font-mono">
              {metadata.religion.primary}
            </span>
          </div>

          <div className="pt-0.5">
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              {metadata.religion.breakdown}
            </p>
          </div>
        </div>
      </div>

      {/* Live Local Time & Temperature Capsule - Harmonized Soft Aesthetic */}
      <div className="rounded-2xl bg-white/95 border border-zinc-200/90 p-3.5 sm:p-4 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Left: Live Ticking Local Time */}
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                  Live Capital Time
                </span>
                <span translate="no" className="notranslate font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                  {metadata.timeZoneAbbr} ({metadata.utcOffset})
                </span>
              </div>
              <div translate="no" className="notranslate flex items-baseline gap-2">
                <span className="font-mono font-extrabold text-xl md:text-2xl text-zinc-900 tracking-tight">
                  {timeStr}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  • {dateStr}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Live Local Temperature & Climate */}
          <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 border-zinc-200/80 pt-3 sm:pt-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                {renderWeatherIcon()}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 font-mono">
                    Capital Temperature
                  </span>
                  {/* C / F Unit Toggle */}
                  <div translate="no" className="notranslate inline-flex rounded-lg bg-zinc-100 p-0.5 border border-zinc-200">
                    <button
                      type="button"
                      onClick={() => setTempUnit('C')}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
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
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                        tempUnit === 'F'
                          ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      °F
                    </button>
                  </div>
                </div>

                <div translate="no" className="notranslate flex items-baseline gap-2">
                  <span className="font-mono font-extrabold text-xl md:text-2xl text-amber-700">
                    {tempUnit === 'C' ? `${currentTempC}°C` : `${currentTempF}°F`}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium font-mono">
                    ({tempUnit === 'C' ? `${currentTempF}°F` : `${currentTempC}°C`})
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block text-right pl-3 border-l border-zinc-200/80">
              <span className="text-[11px] font-semibold text-zinc-800 block">
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
