import React, { useState, useEffect } from 'react';
import { WidgetCustomization, MonetPalette, SystemDeviceState } from '../../types';
import { PixelWidgetWrapper } from './PixelWidgetWrapper';
import { WeatherIcon } from './WeatherIcons';
import { Calendar, Zap, Bell, Clock, ChevronRight } from 'lucide-react';

interface AtAGlanceWidgetProps {
  config: WidgetCustomization;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  onTap?: () => void;
}

export const AtAGlanceWidget: React.FC<AtAGlanceWidgetProps> = ({
  config,
  palette,
  isDark,
  systemState,
  onTap,
}) => {
  const [activeCycleIndex, setActiveCycleIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Secondary info cards to cycle through
  const infoItems = [];

  if (config.showUpcomingEvent !== false && systemState.nextEvent) {
    infoItems.push({
      id: 'event',
      icon: <Calendar size={15} style={{ color: palette.primary }} />,
      primaryText: systemState.nextEvent.title,
      secondaryText: systemState.nextEvent.time,
      badgeColor: palette.primaryContainer,
      badgeText: 'Next Event',
    });
  }

  if (config.showBattery !== false) {
    infoItems.push({
      id: 'battery',
      icon: <Zap size={15} style={{ color: palette.tertiary }} />,
      primaryText: `${systemState.batteryLevel}% · ${systemState.isCharging ? 'Charging rapidly' : 'Battery Normal'}`,
      secondaryText: 'Pixel 9 Pro',
      badgeColor: palette.tertiaryContainer,
      badgeText: 'Power',
    });
  }

  // Active timer item
  infoItems.push({
    id: 'timer',
    icon: <Clock size={15} style={{ color: palette.secondary }} />,
    primaryText: 'Focus Sprint · 18:24 remaining',
    secondaryText: 'Clock',
    badgeColor: palette.secondaryContainer,
    badgeText: 'Timer',
  });

  const currentItem = infoItems[activeCycleIndex % infoItems.length];

  const handleNextPill = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCycleIndex((prev) => (prev + 1) % infoItems.length);
  };

  const isSmall = config.size === '2x1' || config.size === '2x2';

  return (
    <PixelWidgetWrapper
      config={config}
      palette={palette}
      isDark={isDark}
      onClick={onTap}
      className="p-4 flex flex-col justify-between"
    >
      {/* Top Header: Date and Live Weather */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {config.showDate !== false && (
            <span
              className="text-base sm:text-lg font-semibold tracking-tight"
              style={{ color: palette.onSurface }}
            >
              {dayOfWeek}, {monthDay}
            </span>
          )}
        </div>

        {config.showWeather !== false && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors"
            style={{
              backgroundColor: isDark ? `${palette.surfaceVariant}80` : `${palette.surfaceContainerHigh}90`,
              color: palette.onSurface,
            }}
          >
            <WeatherIcon
              condition={systemState.conditionIcon}
              size={18}
              primaryColor={palette.primary}
            />
            <span>
              {systemState.temperature}
              {config.unit === 'fahrenheit' ? '°F' : '°C'}
            </span>
          </div>
        )}
      </div>

      {/* Secondary Context Row / Cycling Pill */}
      {currentItem && (
        <div
          onClick={handleNextPill}
          className="mt-3 flex items-center justify-between gap-3 p-2.5 rounded-2xl cursor-pointer transition-all hover:opacity-90"
          style={{
            backgroundColor: isDark ? `${palette.surfaceContainerHigh}60` : `${palette.surfaceContainerLowest}80`,
            border: `1px solid ${palette.outlineVariant}20`,
          }}
          title="Click to cycle upcoming alerts"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: isDark ? `${palette.surfaceVariant}` : '#ffffff' }}
            >
              {currentItem.icon}
            </div>
            <div className="min-w-0">
              <div
                className="text-xs sm:text-sm font-medium truncate"
                style={{ color: palette.onSurface }}
              >
                {currentItem.primaryText}
              </div>
              {!isSmall && (
                <div
                  className="text-[11px] truncate"
                  style={{ color: palette.onSurfaceVariant }}
                >
                  {currentItem.secondaryText}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-md font-mono"
              style={{
                backgroundColor: currentItem.badgeColor,
                color: palette.onSurface,
              }}
            >
              {currentItem.badgeText}
            </span>
            <ChevronRight size={14} style={{ color: palette.outline }} />
          </div>
        </div>
      )}
    </PixelWidgetWrapper>
  );
};
