import React, { useState } from 'react';
import { WidgetCustomization, PlacedWidget, MonetPalette, SystemDeviceState, WallpaperOption } from '../../types';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import {
  Wifi,
  Signal,
  Battery,
  Plus,
  Trash2,
  Sliders,
  Sun,
  Moon,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Phone,
  MessageSquare,
  Chrome,
  Camera,
  Layers,
} from 'lucide-react';

interface PixelLauncherSimulatorProps {
  placedWidgets: PlacedWidget[];
  onRemoveWidget: (instanceId: string) => void;
  onEditWidget: (config: WidgetCustomization) => void;
  onAddWidgetRequest: () => void;
  palette: MonetPalette;
  isDark: boolean;
  onToggleTheme: () => void;
  activeWallpaper: WallpaperOption;
  onSelectWallpaper: (wp: WallpaperOption) => void;
  allWallpapers: WallpaperOption[];
  systemState: SystemDeviceState;
}

export const PixelLauncherSimulator: React.FC<PixelLauncherSimulatorProps> = ({
  placedWidgets,
  onRemoveWidget,
  onEditWidget,
  onAddWidgetRequest,
  palette,
  isDark,
  onToggleTheme,
  activeWallpaper,
  onSelectWallpaper,
  allWallpapers,
  systemState,
}) => {
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Simulator Control Bar */}
      <div className="w-full max-w-4xl mb-6 p-4 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
          >
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Google Pixel 9 Pro Launcher
            </h2>
            <p className="text-xs text-neutral-400">
              Interactive Home Screen Simulator · {placedWidgets.length} Active Widgets
            </p>
          </div>
        </div>

        {/* Wallpaper Picker & Theme Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-neutral-800/80 rounded-2xl border border-neutral-700/60">
            {allWallpapers.map((wp) => (
              <button
                key={wp.id}
                onClick={() => onSelectWallpaper(wp)}
                title={wp.name}
                className={`w-7 h-7 rounded-xl transition-all border ${
                  activeWallpaper.id === wp.id
                    ? 'ring-2 ring-white scale-110 border-transparent shadow'
                    : 'border-white/10 opacity-70 hover:opacity-100'
                }`}
                style={{ background: wp.bgGradient }}
              />
            ))}
          </div>

          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-indigo-400" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={onAddWidgetRequest}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
          >
            <Plus size={16} />
            <span>Add Widget</span>
          </button>
        </div>
      </div>

      {/* Virtual Pixel 9 Pro Hardware Chassis */}
      <div
        className="relative w-full max-w-[395px] sm:max-w-[420px] rounded-[52px] p-[11px] shadow-2xl transition-all duration-300"
        style={{
          background: isDark
            ? 'linear-gradient(145deg, #2a2c33 0%, #17181c 60%, #0d0e11 100%)'
            : 'linear-gradient(145deg, #d3d5de 0%, #9fa2ad 60%, #7d808c 100%)',
          boxShadow: '0 30px 80px -15px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        {/* Antenna bands and chassis accents */}
        <div className="relative w-full h-[810px] rounded-[44px] overflow-hidden flex flex-col justify-between select-none">
          {/* Wallpaper Layer */}
          <div
            className="absolute inset-0 w-full h-full transition-all duration-700"
            style={{ background: activeWallpaper.bgGradient }}
          />

          {/* Subtle Ambient Vignette & Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

          {/* Top Edge: Camera Punch-Hole & Status Bar */}
          <div className="relative z-30 pt-3 px-6 flex items-center justify-between text-white text-xs font-medium tracking-tight">
            {/* Left: Time */}
            <span className="font-mono text-xs font-semibold drop-shadow-sm">{timeStr}</span>

            {/* Center: Camera Punch-Hole */}
            <div className="w-4 h-4 rounded-full bg-black border border-neutral-800 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950/80" />
            </div>

            {/* Right: Icons (Signal, Wifi, Battery) */}
            <div className="flex items-center gap-1.5 drop-shadow-sm">
              <Signal size={13} />
              <Wifi size={13} />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono">{systemState.batteryLevel}%</span>
                <Battery size={14} className="fill-white" />
              </div>
            </div>
          </div>

          {/* Launcher Canvas / Scrollable Widget Area */}
          <div className="relative z-20 flex-1 px-4 py-3 overflow-y-auto space-y-3.5 scrollbar-none">
            {placedWidgets.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/80">
                <div
                  className="w-14 h-14 rounded-3xl flex items-center justify-center mb-3 backdrop-blur-md"
                  style={{ backgroundColor: `${palette.primaryContainer}80`, color: palette.onPrimaryContainer }}
                >
                  <Sparkles size={28} />
                </div>
                <h3 className="text-base font-semibold text-white">Your Home Screen is Empty</h3>
                <p className="text-xs text-white/70 mt-1 max-w-[220px]">
                  Add Pixel Clocks, At a Glance, Weather, Calendar, or Battery widgets.
                </p>
                <button
                  onClick={onAddWidgetRequest}
                  className="mt-4 px-4 py-2 rounded-2xl text-xs font-semibold shadow-md transition-transform hover:scale-105"
                  style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
                >
                  Browse Widget Gallery
                </button>
              </div>
            ) : (
              placedWidgets.map((placed) => {
                const isSelected = selectedWidgetId === placed.instanceId;

                return (
                  <div
                    key={placed.instanceId}
                    className="relative group transition-all duration-200"
                    onClick={() => setSelectedWidgetId(isSelected ? null : placed.instanceId)}
                  >
                    {/* Widget Component */}
                    <div className="relative">
                      <WidgetRenderer
                        config={placed.config}
                        palette={palette}
                        isDark={isDark}
                        systemState={systemState}
                        onTap={() => setSelectedWidgetId(isSelected ? null : placed.instanceId)}
                      />
                    </div>

                    {/* Floating Quick Action Overlay on Select / Hover */}
                    {isSelected && (
                      <div className="absolute -top-3 -right-2 z-40 flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-900/90 border border-white/20 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditWidget(placed.config);
                          }}
                          title="Customize widget"
                          className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                        >
                          <Sliders size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveWidget(placed.instanceId);
                            setSelectedWidgetId(null);
                          }}
                          title="Remove from home screen"
                          className="p-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Quick Add Slot Button if there is space */}
            {placedWidgets.length > 0 && placedWidgets.length < 6 && (
              <button
                onClick={onAddWidgetRequest}
                className="w-full py-3 rounded-3xl border border-dashed border-white/30 hover:border-white/60 bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2 text-xs font-medium text-white/80 transition-all"
              >
                <Plus size={15} />
                <span>Add Another Widget</span>
              </button>
            )}
          </div>

          {/* Bottom Launcher Area: Pixel Search Bar & App Dock */}
          <div className="relative z-30 px-4 pb-4 space-y-3">
            {/* Google Pixel Unified Search Bar */}
            <div
              className="w-full h-12 px-4 rounded-full flex items-center justify-between shadow-lg backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:bg-white/30"
              style={{
                backgroundColor: isDark ? 'rgba(30, 32, 38, 0.75)' : 'rgba(255, 255, 255, 0.82)',
              }}
            >
              {/* Google 4-Color 'G' Logo */}
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                  />
                </svg>
                <span className="text-xs text-neutral-400 font-normal">Search your phone & web</span>
              </div>

              {/* Right: Mic & Lens Icons */}
              <div className="flex items-center gap-2 text-neutral-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>

            {/* Iconic Pixel 5-Icon Dock */}
            <div className="flex items-center justify-around pt-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500 shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                <Phone size={22} />
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500 shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                <MessageSquare size={22} />
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500 shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                <Chrome size={22} />
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500 shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                <Camera size={22} />
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-500 shadow-md flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                <ImageIcon size={22} />
              </div>
            </div>

            {/* Android Navigation Gesture Line Bar */}
            <div className="w-32 h-1 bg-white/70 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};
