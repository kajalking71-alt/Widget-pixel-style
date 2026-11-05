import React from 'react';
import { WidgetCustomization, MonetPalette, SystemDeviceState } from '../../types';
import { AtAGlanceWidget } from './AtAGlanceWidget';
import { PixelClockWidget } from './PixelClockWidget';
import { WeatherWidget } from './WeatherWidget';
import { CalendarWidget } from './CalendarWidget';
import { BatteryWidget } from './BatteryWidget';
import { NowPlayingWidget } from './NowPlayingWidget';

interface WidgetRendererProps {
  config: WidgetCustomization;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  onTap?: () => void;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  config,
  palette,
  isDark,
  systemState,
  onTap,
}) => {
  switch (config.type) {
    case 'glance':
      return (
        <AtAGlanceWidget
          config={config}
          palette={palette}
          isDark={isDark}
          systemState={systemState}
          onTap={onTap}
        />
      );

    case 'clock':
      return (
        <PixelClockWidget
          config={config}
          palette={palette}
          isDark={isDark}
          systemState={systemState}
          onTap={onTap}
        />
      );

    case 'weather':
      return (
        <WeatherWidget
          config={config}
          palette={palette}
          isDark={isDark}
          systemState={systemState}
          onTap={onTap}
        />
      );

    case 'calendar':
      return (
        <CalendarWidget
          config={config}
          palette={palette}
          isDark={isDark}
          systemState={systemState}
          onTap={onTap}
        />
      );

    case 'battery':
      return (
        <BatteryWidget
          config={config}
          palette={palette}
          isDark={isDark}
          systemState={systemState}
          onTap={onTap}
        />
      );

    case 'media':
      return (
        <NowPlayingWidget
          config={config}
          palette={palette}
          isDark={isDark}
          systemState={systemState}
          onTap={onTap}
        />
      );

    default:
      return null;
  }
};
