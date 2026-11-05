import React, { useState } from 'react';
import { WidgetCustomization, MonetPalette, SystemDeviceState, WidgetType } from '../../types';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import { Plus, Sliders, Check, Sparkles } from 'lucide-react';

interface WidgetGalleryScreenProps {
  onAddToHomeScreen: (config: WidgetCustomization) => void;
  onCustomize: (config: WidgetCustomization) => void;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
}

export const PRESET_WIDGETS: WidgetCustomization[] = [
  // 1. At a Glance
  {
    id: 'glance-default',
    type: 'glance',
    title: 'At a Glance',
    size: '4x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
    showDate: true,
    showWeather: true,
    showBattery: true,
    showUpcomingEvent: true,
  },
  // 2. Pixel Clock - Flower Scallop
  {
    id: 'clock-scallop',
    type: 'clock',
    title: 'Material You Scallop Clock',
    size: '2x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 32,
    useWallpaperColor: true,
    clockStyle: 'scallop',
    showDate: true,
    showSeconds: false,
  },
  // 3. Pixel Clock - Stacked Bold
  {
    id: 'clock-stacked',
    type: 'clock',
    title: 'Bold Stacked Digital Clock',
    size: '2x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
    clockStyle: 'stacked-bold',
    showDate: true,
    is24Hour: false,
  },
  // 4. Pixel Clock - Digital Large
  {
    id: 'clock-digital-large',
    type: 'clock',
    title: 'Digital Clock & Weather',
    size: '4x2',
    backgroundStyle: 'glass',
    opacity: 85,
    cornerRadius: 28,
    useWallpaperColor: true,
    clockStyle: 'digital-large',
    showDate: true,
    showWeather: true,
    showSeconds: true,
    is24Hour: false,
  },
  // 5. Pixel Clock - Minimal Analog
  {
    id: 'clock-analog',
    type: 'clock',
    title: 'Minimal Analog Clock',
    size: '2x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
    clockStyle: 'analog-minimal',
    showDate: true,
  },
  // 6. Weather - 5 Day Forecast
  {
    id: 'weather-5day',
    type: 'weather',
    title: 'Pixel Weather 5-Day Forecast',
    size: '4x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
    weatherStyle: 'forecast-5day',
    showLocation: true,
    showHighLow: true,
    unit: 'celsius',
  },
  // 7. Weather - Detailed 2x2
  {
    id: 'weather-detailed',
    type: 'weather',
    title: 'Weather Conditions Card',
    size: '2x2',
    backgroundStyle: 'glass',
    opacity: 90,
    cornerRadius: 28,
    useWallpaperColor: true,
    weatherStyle: 'card-detailed',
    showLocation: true,
    unit: 'celsius',
  },
  // 8. Weather - Compact Pill 2x1
  {
    id: 'weather-pill',
    type: 'weather',
    title: 'Compact Weather Pill',
    size: '2x1',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 24,
    useWallpaperColor: true,
    weatherStyle: 'compact-pill',
    showHighLow: true,
    unit: 'celsius',
  },
  // 9. Calendar - Monthly Grid
  {
    id: 'calendar-grid',
    type: 'calendar',
    title: 'Monthly Calendar Grid',
    size: '2x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
    calendarStyle: 'month-grid',
  },
  // 10. Calendar - Agenda Timeline
  {
    id: 'calendar-agenda',
    type: 'calendar',
    title: 'Weekly Agenda Schedule',
    size: '4x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
    calendarStyle: 'agenda-timeline',
  },
  // 11. Battery - 4 Devices Hub
  {
    id: 'battery-devices',
    type: 'battery',
    title: 'Pixel Connected Devices Hub',
    size: '4x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
    batteryStyle: 'multi-device',
  },
  // 12. Battery - Circular Gauge
  {
    id: 'battery-circle',
    type: 'battery',
    title: 'Circular Battery Arc',
    size: '2x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
    batteryStyle: 'gauge-circle',
  },
  // 13. Media - Now Playing
  {
    id: 'media-player',
    type: 'media',
    title: 'Now Playing Audio Pill',
    size: '4x2',
    backgroundStyle: 'monet',
    opacity: 100,
    cornerRadius: 28,
    useWallpaperColor: true,
  },
];

export const WidgetGalleryScreen: React.FC<WidgetGalleryScreenProps> = ({
  onAddToHomeScreen,
  onCustomize,
  palette,
  isDark,
  systemState,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: 'All Widgets' },
    { id: 'glance', label: 'At a Glance' },
    { id: 'clock', label: 'Pixel Clocks' },
    { id: 'weather', label: 'Weather' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'battery', label: 'Battery' },
    { id: 'media', label: 'Media Player' },
  ];

  const filteredWidgets = PRESET_WIDGETS.filter((w) => {
    if (selectedCategory === 'all') return true;
    return w.type === selectedCategory;
  });

  const handleAdd = (widget: WidgetCustomization) => {
    onAddToHomeScreen(widget);
    setAddedIds((prev) => ({ ...prev, [widget.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [widget.id]: false }));
    }, 1800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
            >
              Pixel Widget Catalog
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Widget Gallery
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Official Pixel styles inspired by Google Pixel Launcher and Material You.
          </p>
        </div>

        <div className="text-xs text-neutral-400 font-medium">
          Showing {filteredWidgets.length} designed widgets
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-neutral-900/80 rounded-2xl border border-neutral-800 backdrop-blur-sm overflow-x-auto mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'shadow text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
            }`}
            style={{
              backgroundColor: selectedCategory === cat.id ? palette.primary : 'transparent',
              color: selectedCategory === cat.id ? palette.onPrimary : undefined,
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Widget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWidgets.map((widget) => {
          const isAdded = !!addedIds[widget.id];

          return (
            <div
              key={widget.id}
              className="flex flex-col justify-between p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {widget.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                    <span className="font-mono">{widget.size}</span>
                    <span>·</span>
                    <span className="capitalize">{widget.backgroundStyle} theme</span>
                  </div>
                </div>

                <span
                  className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: palette.surfaceContainerHigh, color: palette.onSurfaceVariant }}
                >
                  {widget.type}
                </span>
              </div>

              {/* Live Rendered Widget Preview Container */}
              <div className="my-auto py-2 flex items-center justify-center">
                <div className="w-full max-w-[340px]">
                  <WidgetRenderer
                    config={widget}
                    palette={palette}
                    isDark={isDark}
                    systemState={systemState}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCustomize(widget)}
                  className="flex-1 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sliders size={14} />
                  <span>Customize</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAdd(widget)}
                  disabled={isAdded}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-all hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: isAdded ? '#10b981' : palette.primary,
                    color: isAdded ? '#ffffff' : palette.onPrimary,
                  }}
                >
                  {isAdded ? (
                    <>
                      <Check size={14} />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Add to Screen</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
