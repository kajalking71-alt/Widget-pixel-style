import React, { useState, useEffect } from 'react';
import {
  WidgetCustomization,
  PlacedWidget,
  SystemDeviceState,
  WallpaperOption,
} from './types';
import { generateMonetPalette, WALLPAPER_PRESETS } from './utils/monetTheme';
import { HomeDashboardScreen } from './components/dashboard/HomeDashboardScreen';
import { WidgetGalleryScreen, PRESET_WIDGETS } from './components/gallery/WidgetGalleryScreen';
import { WidgetCustomizationScreen } from './components/customization/WidgetCustomizationScreen';
import { PixelLauncherSimulator } from './components/preview/PixelLauncherSimulator';
import { SettingsScreen } from './components/settings/SettingsScreen';
import {
  Smartphone,
  Grid,
  Sliders,
  Settings,
  Plus,
  Sun,
  Moon,
  Layers,
  Sparkles,
  Download,
  LayoutDashboard,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'gallery' | 'customization' | 'preview' | 'settings'
  >('dashboard');

  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeWallpaper, setActiveWallpaper] = useState<WallpaperOption>(WALLPAPER_PRESETS[0]);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Generate dynamic Monet palette based on active wallpaper and dark/light mode
  const palette = generateMonetPalette(activeWallpaper.dominantColor, isDark);

  // System & Device State (with Battery Web API integration)
  const [systemState, setSystemState] = useState<SystemDeviceState>({
    batteryLevel: 84,
    isCharging: true,
    earbudsLevel: { left: 95, right: 90, case: 100 },
    watchLevel: 78,
    location: 'Mountain View, CA',
    temperature: 19,
    condition: 'Partly Cloudy',
    conditionIcon: 'partly-cloudy',
    tempHigh: 22,
    tempLow: 13,
    nextEvent: {
      title: 'Design System Review',
      time: '10:30 AM',
      location: 'Room 4A',
      colorCategory: '#4385F5',
    },
  });

  // Attempt to read real browser Battery API if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setSystemState((prev) => ({
          ...prev,
          batteryLevel: Math.round(battery.level * 100),
          isCharging: battery.charging,
        }));

        battery.addEventListener('levelchange', () => {
          setSystemState((prev) => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100),
          }));
        });

        battery.addEventListener('chargingchange', () => {
          setSystemState((prev) => ({
            ...prev,
            isCharging: battery.charging,
          }));
        });
      }).catch(() => {
        // Battery API not permitted or available, continue with default simulation
      });
    }
  }, []);

  // Initial Placed Widgets on the virtual phone home screen
  const [placedWidgets, setPlacedWidgets] = useState<PlacedWidget[]>([
    {
      instanceId: 'inst-glance-1',
      widgetId: 'glance-default',
      config: PRESET_WIDGETS[0],
      gridRow: 1,
      gridCol: 1,
      colSpan: 4,
      rowSpan: 2,
    },
    {
      instanceId: 'inst-clock-1',
      widgetId: 'clock-scallop',
      config: PRESET_WIDGETS[1],
      gridRow: 2,
      gridCol: 1,
      colSpan: 2,
      rowSpan: 2,
    },
    {
      instanceId: 'inst-weather-1',
      widgetId: 'weather-detailed',
      config: PRESET_WIDGETS[6],
      gridRow: 2,
      gridCol: 3,
      colSpan: 2,
      rowSpan: 2,
    },
    {
      instanceId: 'inst-battery-1',
      widgetId: 'battery-devices',
      config: PRESET_WIDGETS[10],
      gridRow: 4,
      gridCol: 1,
      colSpan: 4,
      rowSpan: 2,
    },
  ]);

  // Widget currently being customized in the Studio
  const [editingWidget, setEditingWidget] = useState<WidgetCustomization>(PRESET_WIDGETS[1]);

  const handleAddToHomeScreen = (widgetConfig: WidgetCustomization) => {
    const newInstance: PlacedWidget = {
      instanceId: `inst-${Date.now()}`,
      widgetId: widgetConfig.id,
      config: { ...widgetConfig },
      gridRow: placedWidgets.length + 1,
      gridCol: 1,
      colSpan: 4,
      rowSpan: 2,
    };
    setPlacedWidgets((prev) => [...prev, newInstance]);
  };

  const handleRemoveWidget = (instanceId: string) => {
    setPlacedWidgets((prev) => prev.filter((w) => w.instanceId !== instanceId));
  };

  const handleOpenCustomize = (widgetConfig: WidgetCustomization) => {
    setEditingWidget(widgetConfig);
    setCurrentTab('customization');
  };

  const handleSaveCustomization = (updatedConfig: WidgetCustomization) => {
    setPlacedWidgets((prev) =>
      prev.map((pw) => (pw.config.id === updatedConfig.id ? { ...pw, config: updatedConfig } : pw))
    );
  };

  const updateSystemState = (partial: Partial<SystemDeviceState>) => {
    setSystemState((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0f1115] text-[#e2e2e6]' : 'bg-[#f8f9fc] text-[#1a1c1e]'} pb-24 md:pb-8 flex flex-col font-sans transition-colors duration-200`}>
      {/* Top Bar (adheres to Top Bar Contract) */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8 ${
        isDark ? 'bg-[#0f1115]/90 border-neutral-800' : 'bg-white/90 border-neutral-200'
      }`}>
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="text-lg font-bold tracking-tight text-white dark:text-white text-neutral-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs"
            style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
          >
            P
          </div>
          <span className="font-sans font-extrabold tracking-tight">Pixel Widgets</span>
        </button>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'dashboard'
                ? 'text-white font-semibold border-b-2'
                : 'text-neutral-400 hover:text-white'
            }`}
            style={{ borderColor: currentTab === 'dashboard' ? palette.primary : 'transparent' }}
          >
            Home Dashboard
          </button>

          <button
            onClick={() => setCurrentTab('gallery')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'gallery'
                ? 'text-white font-semibold border-b-2'
                : 'text-neutral-400 hover:text-white'
            }`}
            style={{ borderColor: currentTab === 'gallery' ? palette.primary : 'transparent' }}
          >
            Widget Gallery
          </button>

          <button
            onClick={() => setCurrentTab('customization')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'customization'
                ? 'text-white font-semibold border-b-2'
                : 'text-neutral-400 hover:text-white'
            }`}
            style={{ borderColor: currentTab === 'customization' ? palette.primary : 'transparent' }}
          >
            Customization Studio
          </button>

          <button
            onClick={() => setCurrentTab('preview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'preview'
                ? 'text-white font-semibold border-b-2'
                : 'text-neutral-400 hover:text-white'
            }`}
            style={{ borderColor: currentTab === 'preview' ? palette.primary : 'transparent' }}
          >
            Phone Simulator
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'settings'
                ? 'text-white font-semibold border-b-2'
                : 'text-neutral-400 hover:text-white'
            }`}
            style={{ borderColor: currentTab === 'settings' ? palette.primary : 'transparent' }}
          >
            Settings & Kotlin
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
          </button>

          <button
            onClick={() => setCurrentTab('preview')}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0 flex items-center gap-1.5"
            style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Phone Simulator</span>
            <span className="sm:hidden">Preview</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full">
        {currentTab === 'dashboard' && (
          <HomeDashboardScreen
            placedWidgets={placedWidgets}
            onRemoveWidget={handleRemoveWidget}
            onEditWidget={handleOpenCustomize}
            onNavigateTab={setCurrentTab}
            palette={palette}
            isDark={isDark}
            systemState={systemState}
            activeWallpaper={activeWallpaper}
          />
        )}

        {currentTab === 'gallery' && (
          <WidgetGalleryScreen
            onAddToHomeScreen={handleAddToHomeScreen}
            onCustomize={handleOpenCustomize}
            palette={palette}
            isDark={isDark}
            systemState={systemState}
          />
        )}

        {currentTab === 'customization' && (
          <WidgetCustomizationScreen
            initialConfig={editingWidget}
            onSave={handleSaveCustomization}
            onAddToHomeScreen={handleAddToHomeScreen}
            onBack={() => setCurrentTab('gallery')}
            palette={palette}
            isDark={isDark}
            systemState={systemState}
          />
        )}

        {currentTab === 'preview' && (
          <div className="py-6 px-4">
            <PixelLauncherSimulator
              placedWidgets={placedWidgets}
              onRemoveWidget={handleRemoveWidget}
              onEditWidget={handleOpenCustomize}
              onAddWidgetRequest={() => setCurrentTab('gallery')}
              palette={palette}
              isDark={isDark}
              onToggleTheme={() => setIsDark(!isDark)}
              activeWallpaper={activeWallpaper}
              onSelectWallpaper={setActiveWallpaper}
              allWallpapers={WALLPAPER_PRESETS}
              systemState={systemState}
            />
          </div>
        )}

        {currentTab === 'settings' && (
          <SettingsScreen
            palette={palette}
            isDark={isDark}
            systemState={systemState}
            onUpdateSystemState={updateSystemState}
            activeWallpaper={activeWallpaper}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1 of Mobile Touch Guidelines) */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg px-2 py-1.5 flex items-center justify-around ${
        isDark ? 'bg-[#0f1115]/95 border-neutral-800' : 'bg-white/95 border-neutral-200'
      }`}>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'dashboard' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          style={{ color: currentTab === 'dashboard' ? palette.primary : undefined }}
        >
          <LayoutDashboard size={18} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('gallery')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'gallery' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          style={{ color: currentTab === 'gallery' ? palette.primary : undefined }}
        >
          <Grid size={18} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Gallery</span>
        </button>

        <button
          onClick={() => setCurrentTab('preview')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'preview' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          style={{ color: currentTab === 'preview' ? palette.primary : undefined }}
        >
          <Smartphone size={18} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Launcher</span>
        </button>

        <button
          onClick={() => setCurrentTab('customization')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'customization' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          style={{ color: currentTab === 'customization' ? palette.primary : undefined }}
        >
          <Sliders size={18} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Studio</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] min-h-[44px] transition-colors ${
            currentTab === 'settings' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
          style={{ color: currentTab === 'settings' ? palette.primary : undefined }}
        >
          <Settings size={18} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Settings</span>
        </button>
      </nav>
    </div>
  );
}
