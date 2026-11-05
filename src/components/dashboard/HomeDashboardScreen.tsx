import React from 'react';
import {
  WidgetCustomization,
  PlacedWidget,
  MonetPalette,
  SystemDeviceState,
  WallpaperOption,
} from '../../types';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import {
  Smartphone,
  Grid,
  Sliders,
  Plus,
  Play,
  Zap,
  CloudSun,
  Layers,
  ArrowRight,
  Palette,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface HomeDashboardScreenProps {
  placedWidgets: PlacedWidget[];
  onRemoveWidget: (instanceId: string) => void;
  onEditWidget: (config: WidgetCustomization) => void;
  onNavigateTab: (tab: 'dashboard' | 'gallery' | 'customization' | 'preview' | 'settings') => void;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  activeWallpaper: WallpaperOption;
}

export const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({
  placedWidgets,
  onRemoveWidget,
  onEditWidget,
  onNavigateTab,
  palette,
  isDark,
  systemState,
  activeWallpaper,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden rounded-[36px] p-6 sm:p-8 border shadow-xl transition-all"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #181b22 0%, #12141a 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f1f3f9 100%)',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ backgroundColor: palette.primary }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
              >
                Material You · Android 15
              </span>
              <span className="text-xs text-neutral-400 font-mono">Pixel 9 Pro Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Pixel Widgets
            </h1>
            <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
              Design, customize, and preview authentic Google Pixel home-screen widgets.
              Features dynamic Monet color extraction from wallpaper, squircle geometry, and Jetpack Glance export.
            </p>

            {/* Quick CTAs */}
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <button
                onClick={() => onNavigateTab('preview')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
              >
                <Smartphone size={16} />
                <span>Open Phone Simulator</span>
              </button>

              <button
                onClick={() => onNavigateTab('gallery')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
              >
                <Grid size={16} />
                <span>Browse Widget Catalog</span>
              </button>
            </div>
          </div>

          {/* Quick Stats / Metric Card */}
          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-xs text-neutral-400">Active on Screen</div>
              <div className="text-2xl font-black text-white mt-1 font-mono">
                {placedWidgets.length} <span className="text-xs font-normal text-neutral-500">/ 6</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-xs text-neutral-400">Active Theme</div>
              <div className="text-sm font-semibold text-white mt-1 truncate">
                {activeWallpaper.name}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-xs text-neutral-400">Device Battery</div>
              <div className="text-lg font-bold text-emerald-400 mt-1 font-mono flex items-center gap-1">
                <Zap size={14} />
                {systemState.batteryLevel}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
              <div className="text-xs text-neutral-400">Weather Temp</div>
              <div className="text-lg font-bold text-sky-400 mt-1 font-mono flex items-center gap-1">
                <CloudSun size={14} />
                {systemState.temperature}°C
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Home Screen Widgets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Active Home Screen Widgets
            </h2>
            <p className="text-xs text-neutral-400">
              Widgets currently placed on your Google Pixel launcher
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('preview')}
            className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <span>View Launcher</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {placedWidgets.length === 0 ? (
          <div className="p-8 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center">
            <p className="text-xs text-neutral-400">No widgets currently placed.</p>
            <button
              onClick={() => onNavigateTab('gallery')}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
            >
              Add Widgets from Gallery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placedWidgets.map((placed) => (
              <div
                key={placed.instanceId}
                className="flex flex-col justify-between p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {placed.config.title}
                    </h3>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {placed.config.size} · {placed.config.backgroundStyle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditWidget(placed.config)}
                      className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                      title="Customize"
                    >
                      <Sliders size={13} />
                    </button>
                    <button
                      onClick={() => onRemoveWidget(placed.instanceId)}
                      className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="my-auto py-2">
                  <WidgetRenderer
                    config={placed.config}
                    palette={palette}
                    isDark={isDark}
                    systemState={systemState}
                    onTap={() => onEditWidget(placed.config)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Material You Dynamic Monet Palette Showcase */}
      <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette size={18} style={{ color: palette.primary }} />
            <div>
              <h2 className="text-sm font-semibold text-white">
                Material You Monet Dynamic Color System
              </h2>
              <p className="text-xs text-neutral-400">
                Tonal palettes generated from active wallpaper "{activeWallpaper.name}"
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {[
            { label: 'Primary', hex: palette.primary, textColor: palette.onPrimary },
            { label: 'Primary Cont.', hex: palette.primaryContainer, textColor: palette.onPrimaryContainer },
            { label: 'Secondary', hex: palette.secondary, textColor: palette.onSecondary },
            { label: 'Secondary Cont.', hex: palette.secondaryContainer, textColor: palette.onSecondaryContainer },
            { label: 'Tertiary', hex: palette.tertiary, textColor: palette.onTertiary },
            { label: 'Surface Cont.', hex: palette.surfaceContainer, textColor: palette.onSurface },
          ].map((token, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl flex flex-col justify-between h-20 transition-transform hover:scale-105"
              style={{ backgroundColor: token.hex, color: token.textColor }}
            >
              <span className="text-[11px] font-semibold">{token.label}</span>
              <span className="text-[10px] font-mono opacity-80 uppercase">{token.hex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
