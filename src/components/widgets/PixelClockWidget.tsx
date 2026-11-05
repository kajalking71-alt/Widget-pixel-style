import React, { useState, useEffect } from 'react';
import { WidgetCustomization, MonetPalette, SystemDeviceState } from '../../types';
import { PixelWidgetWrapper } from './PixelWidgetWrapper';
import { WeatherIcon } from './WeatherIcons';

interface PixelClockWidgetProps {
  config: WidgetCustomization;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  onTap?: () => void;
}

export const PixelClockWidget: React.FC<PixelClockWidgetProps> = ({
  config,
  palette,
  isDark,
  systemState,
  onTap,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const is24h = config.is24Hour ?? false;
  let hours = time.getHours();
  const rawHours = hours;
  if (!is24h) {
    hours = hours % 12 || 12;
  }
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = time.getMinutes().toString().padStart(2, '0');
  const secondsStr = time.getSeconds().toString().padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Analog clock angles
  const secondDeg = time.getSeconds() * 6;
  const minuteDeg = time.getMinutes() * 6 + (time.getSeconds() * 6) / 60;
  const hourDeg = (time.getHours() % 12) * 30 + (time.getMinutes() * 30) / 60;

  const style = config.clockStyle || 'scallop';

  // Renders the iconic 12-petal Material You Scallop Clock
  const renderScallopClock = () => {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-3">
        {/* 12-petal flower background shape */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 w-full h-full transition-all duration-500"
          >
            {/* 12 rotated rounded pill petals generating the iconic Android flower */}
            {Array.from({ length: 6 }).map((_, i) => (
              <rect
                key={i}
                x="65"
                y="10"
                width="70"
                height="180"
                rx="35"
                fill={palette.primaryContainer}
                transform={`rotate(${i * 30} 100 100)`}
                opacity={0.85}
              />
            ))}
          </svg>

          {/* Clock Hands overlay */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {/* Center cap */}
            <div
              className="absolute w-4 h-4 rounded-full z-30"
              style={{ backgroundColor: palette.primary }}
            />
            {/* Hour hand */}
            <div
              className="absolute w-2.5 rounded-full z-20 origin-bottom"
              style={{
                height: '42px',
                bottom: '50%',
                backgroundColor: palette.onPrimaryContainer,
                transform: `rotate(${hourDeg}deg)`,
                transformOrigin: '50% 100%',
              }}
            />
            {/* Minute hand */}
            <div
              className="absolute w-1.5 rounded-full z-20 origin-bottom"
              style={{
                height: '58px',
                bottom: '50%',
                backgroundColor: palette.primary,
                transform: `rotate(${minuteDeg}deg)`,
                transformOrigin: '50% 100%',
              }}
            />
            {/* Optional second hand */}
            {config.showSeconds && (
              <div
                className="absolute w-0.5 rounded-full z-20 origin-bottom"
                style={{
                  height: '66px',
                  bottom: '50%',
                  backgroundColor: palette.tertiary,
                  transform: `rotate(${secondDeg}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />
            )}
          </div>
        </div>

        {config.showDate !== false && (
          <div
            className="mt-2 text-xs font-medium tracking-wide"
            style={{ color: palette.onSurfaceVariant }}
          >
            {dateStr}
          </div>
        )}
      </div>
    );
  };

  // Stacked Bold 2x2 Clock (Android 12/13/14 lockscreen style: 10 over 42)
  const renderStackedBold = () => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center leading-none tracking-tighter">
          <span
            className="text-5xl sm:text-6xl font-black font-sans tabular-nums select-none"
            style={{ color: palette.primary }}
          >
            {hoursStr}
          </span>
          <span
            className="text-5xl sm:text-6xl font-black font-sans tabular-nums select-none mt-[-4px]"
            style={{ color: palette.onSurface }}
          >
            {minutesStr}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs font-medium">
          {config.showDate !== false && (
            <span style={{ color: palette.onSurfaceVariant }}>{dateStr}</span>
          )}
          {!is24h && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase"
              style={{
                backgroundColor: palette.surfaceVariant,
                color: palette.onSurfaceVariant,
              }}
            >
              {ampm}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Large Horizontal Digital Clock
  const renderDigitalLarge = () => {
    return (
      <div className="w-full h-full flex flex-col justify-between p-4">
        <div className="flex items-center justify-between">
          <span
            className="text-xs uppercase tracking-wider font-medium"
            style={{ color: palette.onSurfaceVariant }}
          >
            {dateStr}
          </span>
          {!is24h && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono font-medium"
              style={{
                backgroundColor: palette.secondaryContainer,
                color: palette.onSecondaryContainer,
              }}
            >
              {ampm}
            </span>
          )}
        </div>

        <div className="my-auto flex items-baseline gap-1">
          <span
            className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums"
            style={{ color: palette.primary }}
          >
            {hoursStr}:{minutesStr}
          </span>
          {config.showSeconds && (
            <span
              className="text-lg font-mono tabular-nums opacity-70"
              style={{ color: palette.onSurfaceVariant }}
            >
              :{secondsStr}
            </span>
          )}
        </div>

        {/* Small weather indicator inside digital clock */}
        {config.showWeather !== false && (
          <div
            className="flex items-center gap-2 text-xs pt-1 border-t"
            style={{ borderColor: `${palette.outlineVariant}25`, color: palette.onSurfaceVariant }}
          >
            <WeatherIcon
              condition={systemState.conditionIcon}
              size={16}
              primaryColor={palette.primary}
            />
            <span>
              {systemState.condition} · {systemState.temperature}
              {config.unit === 'fahrenheit' ? '°F' : '°C'}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Minimal Analog Clock
  const renderAnalogMinimal = () => {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-3">
        <div
          className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border flex items-center justify-center shadow-inner"
          style={{
            borderColor: `${palette.outlineVariant}40`,
            backgroundColor: isDark ? `${palette.surfaceContainerHigh}80` : `${palette.surfaceContainerLow}90`,
          }}
        >
          {/* Hour tick marks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 rounded-full"
              style={{
                height: i % 3 === 0 ? '8px' : '4px',
                top: '6px',
                backgroundColor: i % 3 === 0 ? palette.primary : palette.outline,
                transform: `rotate(${i * 30}deg)`,
                transformOrigin: '50% 74px',
              }}
            />
          ))}

          {/* Hour hand */}
          <div
            className="absolute w-2 rounded-full z-20"
            style={{
              height: '36px',
              bottom: '50%',
              backgroundColor: palette.onSurface,
              transform: `rotate(${hourDeg}deg)`,
              transformOrigin: '50% 100%',
            }}
          />
          {/* Minute hand */}
          <div
            className="absolute w-1.5 rounded-full z-20"
            style={{
              height: '52px',
              bottom: '50%',
              backgroundColor: palette.primary,
              transform: `rotate(${minuteDeg}deg)`,
              transformOrigin: '50% 100%',
            }}
          />
          {/* Second hand */}
          <div
            className="absolute w-0.5 rounded-full z-20"
            style={{
              height: '58px',
              bottom: '50%',
              backgroundColor: palette.tertiary,
              transform: `rotate(${secondDeg}deg)`,
              transformOrigin: '50% 100%',
            }}
          />
          {/* Center cap */}
          <div
            className="w-3.5 h-3.5 rounded-full z-30 ring-2"
            style={{ backgroundColor: palette.primary, borderColor: palette.surface }}
          />
        </div>

        {config.showDate !== false && (
          <div
            className="mt-2 text-xs font-medium"
            style={{ color: palette.onSurfaceVariant }}
          >
            {dateStr}
          </div>
        )}
      </div>
    );
  };

  // Pill Duo Clock (Horizontal capsule: Left Time, Right Weather)
  const renderPillDuo = () => {
    return (
      <div className="w-full h-full flex items-center justify-between p-3.5 gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
          >
            {hoursStr}
          </div>
          <div className="flex flex-col">
            <span
              className="text-xl sm:text-2xl font-bold tabular-nums"
              style={{ color: palette.onSurface }}
            >
              :{minutesStr}
            </span>
            <span
              className="text-[10px] uppercase font-mono"
              style={{ color: palette.onSurfaceVariant }}
            >
              {dateStr.split(',')[0]}
            </span>
          </div>
        </div>

        <div
          className="h-8 w-px"
          style={{ backgroundColor: `${palette.outlineVariant}30` }}
        />

        <div className="flex items-center gap-2 pr-1">
          <WeatherIcon
            condition={systemState.conditionIcon}
            size={24}
            primaryColor={palette.primary}
          />
          <div className="flex flex-col text-right">
            <span
              className="text-sm font-semibold"
              style={{ color: palette.onSurface }}
            >
              {systemState.temperature}°
            </span>
            <span
              className="text-[11px] truncate max-w-[70px]"
              style={{ color: palette.onSurfaceVariant }}
            >
              {systemState.condition}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PixelWidgetWrapper
      config={config}
      palette={palette}
      isDark={isDark}
      onClick={onTap}
      className="flex items-center justify-center"
    >
      {style === 'scallop' && renderScallopClock()}
      {style === 'stacked-bold' && renderStackedBold()}
      {style === 'digital-large' && renderDigitalLarge()}
      {style === 'analog-minimal' && renderAnalogMinimal()}
      {style === 'pill-duo' && renderPillDuo()}
      {style === 'radial-retro' && renderAnalogMinimal()}
    </PixelWidgetWrapper>
  );
};
