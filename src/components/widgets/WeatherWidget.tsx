import React, { useState } from 'react';
import { WidgetCustomization, MonetPalette, SystemDeviceState } from '../../types';
import { PixelWidgetWrapper } from './PixelWidgetWrapper';
import { WeatherIcon } from './WeatherIcons';
import { MapPin, ArrowUp, ArrowDown, Wind, Droplets } from 'lucide-react';

interface WeatherWidgetProps {
  config: WidgetCustomization;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  onTap?: () => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  config,
  palette,
  isDark,
  systemState,
  onTap,
}) => {
  const [selectedDay, setSelectedDay] = useState(0);

  const forecast = [
    { day: 'Today', condition: systemState.conditionIcon, high: 22, low: 14, pop: 10 },
    { day: 'Fri', condition: 'sunny', high: 24, low: 15, pop: 0 },
    { day: 'Sat', condition: 'partly-cloudy', high: 21, low: 13, pop: 25 },
    { day: 'Sun', condition: 'rain', high: 18, low: 12, pop: 85 },
    { day: 'Mon', condition: 'cloudy', high: 19, low: 11, pop: 40 },
  ];

  const hourly = [
    { time: 'Now', temp: systemState.temperature, condition: systemState.conditionIcon },
    { time: '11 AM', temp: systemState.temperature + 1, condition: 'sunny' },
    { time: '1 PM', temp: systemState.temperature + 3, condition: 'sunny' },
    { time: '3 PM', temp: systemState.temperature + 2, condition: 'partly-cloudy' },
    { time: '5 PM', temp: systemState.temperature, condition: 'partly-cloudy' },
    { time: '7 PM', temp: systemState.temperature - 2, condition: 'cloudy' },
  ];

  const unit = config.unit === 'fahrenheit' ? '°F' : '°C';
  const style = config.weatherStyle || (config.size === '4x2' ? 'forecast-5day' : 'card-detailed');

  // Format 1: Compact Pill (2x1)
  if (config.size === '2x1' || style === 'compact-pill') {
    return (
      <PixelWidgetWrapper
        config={config}
        palette={palette}
        isDark={isDark}
        onClick={onTap}
        className="p-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <WeatherIcon
            condition={systemState.conditionIcon}
            size={30}
            primaryColor={palette.primary}
          />
          <div>
            <div className="text-xl font-bold tracking-tight leading-none" style={{ color: palette.onSurface }}>
              {systemState.temperature}{unit}
            </div>
            <div className="text-[11px] truncate mt-0.5" style={{ color: palette.onSurfaceVariant }}>
              {systemState.condition}
            </div>
          </div>
        </div>

        {config.showHighLow !== false && (
          <div className="text-right text-[11px] font-mono leading-tight" style={{ color: palette.onSurfaceVariant }}>
            <div className="flex items-center justify-end gap-0.5 text-emerald-400">
              <ArrowUp size={10} />
              <span>{systemState.tempHigh}°</span>
            </div>
            <div className="flex items-center justify-end gap-0.5 text-blue-400">
              <ArrowDown size={10} />
              <span>{systemState.tempLow}°</span>
            </div>
          </div>
        )}
      </PixelWidgetWrapper>
    );
  }

  // Format 2: 5-Day Weekly Forecast Strip (4x2 or larger)
  if (style === 'forecast-5day' || config.size === '4x2' || config.size === '4x3') {
    return (
      <PixelWidgetWrapper
        config={config}
        palette={palette}
        isDark={isDark}
        onClick={onTap}
        className="p-4 flex flex-col justify-between"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WeatherIcon
              condition={systemState.conditionIcon}
              size={36}
              primaryColor={palette.primary}
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: palette.onSurface }}>
                  {systemState.temperature}{unit}
                </span>
                <span className="text-xs font-medium" style={{ color: palette.onSurfaceVariant }}>
                  {systemState.condition}
                </span>
              </div>
              {config.showLocation !== false && (
                <div className="flex items-center gap-1 text-[11px]" style={{ color: palette.onSurfaceVariant }}>
                  <MapPin size={11} style={{ color: palette.primary }} />
                  <span>{systemState.location}</span>
                </div>
              )}
            </div>
          </div>

          {config.showHighLow !== false && (
            <div
              className="px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-2"
              style={{ backgroundColor: palette.surfaceContainerHigh }}
            >
              <span className="text-emerald-400 flex items-center">
                <ArrowUp size={12} /> {systemState.tempHigh}°
              </span>
              <span className="text-sky-400 flex items-center">
                <ArrowDown size={12} /> {systemState.tempLow}°
              </span>
            </div>
          )}
        </div>

        {/* 5-Day Forecast Row */}
        <div
          className="mt-3 pt-3 border-t grid grid-cols-5 gap-1.5"
          style={{ borderColor: `${palette.outlineVariant}25` }}
        >
          {forecast.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDay(idx);
              }}
              className="flex flex-col items-center p-1.5 rounded-xl transition-all"
              style={{
                backgroundColor:
                  selectedDay === idx ? palette.primaryContainer : 'transparent',
                color:
                  selectedDay === idx ? palette.onPrimaryContainer : palette.onSurface,
              }}
            >
              <span className="text-[11px] font-medium">{item.day}</span>
              <div className="my-1">
                <WeatherIcon
                  condition={item.condition as any}
                  size={20}
                  primaryColor={selectedDay === idx ? palette.primary : palette.secondary}
                />
              </div>
              <span className="text-[11px] font-semibold">{item.high}°</span>
              <span className="text-[10px] opacity-70">{item.low}°</span>
            </button>
          ))}
        </div>
      </PixelWidgetWrapper>
    );
  }

  // Format 3: Detailed 2x2 Card
  return (
    <PixelWidgetWrapper
      config={config}
      palette={palette}
      isDark={isDark}
      onClick={onTap}
      className="p-4 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        {config.showLocation !== false && (
          <div className="flex items-center gap-1 text-xs font-medium truncate max-w-[120px]" style={{ color: palette.onSurfaceVariant }}>
            <MapPin size={12} style={{ color: palette.primary }} />
            <span className="truncate">{systemState.location}</span>
          </div>
        )}
        <div
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: palette.secondaryContainer, color: palette.onSecondaryContainer }}
        >
          Pixel Weather
        </div>
      </div>

      <div className="my-auto flex items-center gap-3 py-1">
        <WeatherIcon
          condition={systemState.conditionIcon}
          size={44}
          primaryColor={palette.primary}
        />
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums" style={{ color: palette.primary }}>
            {systemState.temperature}{unit}
          </div>
          <div className="text-xs font-medium" style={{ color: palette.onSurface }}>
            {systemState.condition}
          </div>
        </div>
      </div>

      <div
        className="pt-2 border-t flex items-center justify-between text-xs"
        style={{ borderColor: `${palette.outlineVariant}25`, color: palette.onSurfaceVariant }}
      >
        <div className="flex items-center gap-1">
          <Droplets size={12} style={{ color: palette.tertiary }} />
          <span>Humidity 48%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind size={12} style={{ color: palette.secondary }} />
          <span>9 mph</span>
        </div>
      </div>
    </PixelWidgetWrapper>
  );
};
