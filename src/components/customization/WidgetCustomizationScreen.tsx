import React, { useState } from 'react';
import {
  WidgetCustomization,
  MonetPalette,
  SystemDeviceState,
  WidgetSize,
  BackgroundStyle,
  ClockStyle,
  WeatherStyle,
  CalendarStyle,
  BatteryStyle,
} from '../../types';
import { WidgetRenderer } from '../widgets/WidgetRenderer';
import {
  Sliders,
  Sparkles,
  Check,
  Palette,
  Maximize2,
  Eye,
  Code,
  Copy,
  Plus,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';

interface WidgetCustomizationScreenProps {
  initialConfig: WidgetCustomization;
  onSave: (config: WidgetCustomization) => void;
  onAddToHomeScreen: (config: WidgetCustomization) => void;
  onBack: () => void;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
}

export const WidgetCustomizationScreen: React.FC<WidgetCustomizationScreenProps> = ({
  initialConfig,
  onSave,
  onAddToHomeScreen,
  onBack,
  palette,
  isDark,
  systemState,
}) => {
  const [config, setConfig] = useState<WidgetCustomization>({ ...initialConfig });
  const [activeTab, setActiveTab] = useState<'visual' | 'content' | 'code'>('visual');
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const update = (partial: Partial<WidgetCustomization>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const sizes: WidgetSize[] = ['2x1', '2x2', '4x1', '4x2', '4x3'];
  const bgStyles: { id: BackgroundStyle; label: string; desc: string }[] = [
    { id: 'monet', label: 'Monet Dynamic', desc: 'Adapts to wallpaper colors' },
    { id: 'glass', label: 'Frosted Glass', desc: 'Backdrop blur & translucency' },
    { id: 'solid', label: 'Solid Accent', desc: 'Deep tonal accent fill' },
    { id: 'transparent', label: 'Transparent', desc: 'Clean unboxed Pixel style' },
  ];

  // Generate native Jetpack Glance Kotlin code snippet for this specific widget
  const generateGlanceKotlinCode = () => {
    const isMonet = config.useWallpaperColor;
    const radiusDp = config.cornerRadius;

    switch (config.type) {
      case 'clock':
        return `package com.google.pixelwidgets.glance

import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.cornerRadius
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.*
import androidx.glance.color.ColorProviders
import com.google.pixelwidgets.ui.theme.MonetTheme

class PixelClockGlanceWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            MonetTheme {
                ClockContent()
            }
        }
    }

    @Composable
    private fun ClockContent() {
        Box(
            modifier = GlanceModifier
                .fillMaxSize()
                .cornerRadius(${radiusDp}.dp)
                .background(${isMonet ? 'MonetTheme.colors.surfaceContainer' : 'ColorProviders(R.color.widget_custom)'})
                .padding(16.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "${config.is24Hour ? '14:28' : '02:28'}",
                    style = TextStyle(
                        color = MonetTheme.colors.onSurface,
                        fontSize = 42.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                ${config.showDate !== false ? `Text(
                    text = "Thursday, Nov 5",
                    style = TextStyle(
                        color = MonetTheme.colors.onSurfaceVariant,
                        fontSize = 12.sp
                    )
                )` : ''}
            }
        }
    }
}`;

      case 'weather':
        return `package com.google.pixelwidgets.glance

import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.glance.GlanceModifier
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.cornerRadius
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.*
import com.google.pixelwidgets.ui.theme.MonetTheme

class PixelWeatherGlanceWidget : GlanceAppWidget() {
    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            MonetTheme {
                Row(
                    modifier = GlanceModifier
                        .fillMaxSize()
                        .cornerRadius(${radiusDp}.dp)
                        .background(MonetTheme.colors.surfaceContainer)
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Weather icon and temperature
                    Text(
                        text = "${systemState.temperature}${config.unit === 'fahrenheit' ? '°F' : '°C'}",
                        style = TextStyle(
                            color = MonetTheme.colors.primary,
                            fontSize = 32.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(GlanceModifier.width(8.dp))
                    Text(
                        text = "${systemState.condition} · ${systemState.location}",
                        style = TextStyle(color = MonetTheme.colors.onSurfaceVariant)
                    )
                }
            }
        }
    }
}`;

      default:
        return `package com.google.pixelwidgets.glance

import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.layout.*
import androidx.compose.ui.unit.dp
import androidx.glance.appwidget.cornerRadius

class PixelGlanceWidget : GlanceAppWidget() {
    // Config: Size ${config.size}, Radius ${radiusDp}dp, Monet: ${isMonet}
    // Generated automatically from Pixel Widgets Studio
}`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateGlanceKotlinCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSave = () => {
    onSave(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Navigation Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Widgets</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddToHomeScreen(config)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
          >
            <Plus size={14} />
            <span>Add to Phone</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shadow transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: savedSuccess ? '#10b981' : palette.primary,
              color: savedSuccess ? '#ffffff' : palette.onPrimary,
            }}
          >
            {savedSuccess ? <Check size={14} /> : <Sparkles size={14} />}
            <span>{savedSuccess ? 'Saved!' : 'Save Preset'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full"
                style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
              >
                Customization Studio
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Customize {config.title}
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Adjust size, Material You Monet dynamic colors, transparency, and content.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 p-1 bg-neutral-900 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'visual'
                  ? 'bg-neutral-800 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders size={14} />
              <span>Appearance & Shape</span>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'content'
                  ? 'bg-neutral-800 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye size={14} />
              <span>Data & Content</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'code'
                  ? 'bg-neutral-800 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code size={14} />
              <span>Jetpack Glance Code</span>
            </button>
          </div>

          {/* Tab 1: Appearance & Shape */}
          {activeTab === 'visual' && (
            <div className="space-y-6 p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm">
              {/* Widget Size Selector */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Widget Dimensions (Grid Units)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => update({ size: s })}
                      className={`py-2.5 px-2 rounded-xl text-xs font-mono font-medium transition-all ${
                        config.size === s
                          ? 'border shadow text-white'
                          : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-800 border border-transparent'
                      }`}
                      style={{
                        backgroundColor: config.size === s ? palette.primaryContainer : undefined,
                        borderColor: config.size === s ? palette.primary : 'transparent',
                        color: config.size === s ? palette.onPrimaryContainer : undefined,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Theme Style */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Material You Background Style
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {bgStyles.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => update({ backgroundStyle: item.id })}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        config.backgroundStyle === item.id
                          ? 'border shadow'
                          : 'bg-neutral-800/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                      style={{
                        backgroundColor:
                          config.backgroundStyle === item.id ? `${palette.primaryContainer}50` : undefined,
                        borderColor: config.backgroundStyle === item.id ? palette.primary : undefined,
                      }}
                    >
                      <div className="text-xs font-semibold text-white">{item.label}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Radius Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Corner Radius (Squircle Geometry)
                  </label>
                  <span className="text-xs font-mono text-neutral-400">
                    {config.cornerRadius}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="36"
                  step="2"
                  value={config.cornerRadius}
                  onChange={(e) => update({ cornerRadius: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                  <span>Sharp (0px)</span>
                  <span>Standard (24px)</span>
                  <span>Super Squircle (36px)</span>
                </div>
              </div>

              {/* Opacity / Transparency Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Background Opacity & Blur
                  </label>
                  <span className="text-xs font-mono text-neutral-400">
                    {config.opacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={config.opacity}
                  onChange={(e) => update({ opacity: Number(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Color Source Toggle: Monet Dynamic vs Custom Color */}
              <div className="pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold text-white">Dynamic Wallpaper Colors</div>
                    <div className="text-[11px] text-neutral-400">
                      Extract tonal palette from active Android wallpaper
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.useWallpaperColor}
                    onChange={(e) => update({ useWallpaperColor: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-500 cursor-pointer"
                  />
                </div>

                {!config.useWallpaperColor && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-800/80 border border-neutral-700">
                    <Palette size={16} className="text-neutral-400" />
                    <span className="text-xs text-neutral-300">Custom Accent Color:</span>
                    <input
                      type="color"
                      value={config.customColor || palette.primary}
                      onChange={(e) => update({ customColor: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs font-mono text-neutral-400">
                      {config.customColor || palette.primary}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Content & Data Toggles */}
          {activeTab === 'content' && (
            <div className="space-y-6 p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm">
              {/* Type-Specific Style Pickers */}
              {config.type === 'clock' && (
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-2">
                    Clock Face Design
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'scallop', label: 'Material You Scallop' },
                      { id: 'stacked-bold', label: 'Stacked Bold Digits' },
                      { id: 'digital-large', label: 'Large Digital' },
                      { id: 'analog-minimal', label: 'Minimal Analog' },
                      { id: 'pill-duo', label: 'Capsule Duo' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => update({ clockStyle: style.id as ClockStyle })}
                        className={`p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                          config.clockStyle === style.id
                            ? 'border-blue-500 bg-blue-500/10 text-white'
                            : 'border-neutral-800 bg-neutral-800/60 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {config.type === 'weather' && (
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-2">
                    Weather Layout Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'card-detailed', label: '2x2 Card' },
                      { id: 'forecast-5day', label: '5-Day Strip' },
                      { id: 'compact-pill', label: 'Compact Pill' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => update({ weatherStyle: style.id as WeatherStyle })}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                          config.weatherStyle === style.id
                            ? 'border-blue-500 bg-blue-500/10 text-white'
                            : 'border-neutral-800 bg-neutral-800/60 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-neutral-300">Information Fields</h3>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800 cursor-pointer">
                  <span className="text-xs text-neutral-200">Show Date & Day of Week</span>
                  <input
                    type="checkbox"
                    checked={config.showDate !== false}
                    onChange={(e) => update({ showDate: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800 cursor-pointer">
                  <span className="text-xs text-neutral-200">Show Weather Information</span>
                  <input
                    type="checkbox"
                    checked={config.showWeather !== false}
                    onChange={(e) => update({ showWeather: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-500 cursor-pointer"
                  />
                </label>

                {config.type === 'clock' && (
                  <>
                    <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800 cursor-pointer">
                      <span className="text-xs text-neutral-200">24-Hour Time Format</span>
                      <input
                        type="checkbox"
                        checked={config.is24Hour === true}
                        onChange={(e) => update({ is24Hour: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800 cursor-pointer">
                      <span className="text-xs text-neutral-200">Show Seconds Hand / Digits</span>
                      <input
                        type="checkbox"
                        checked={config.showSeconds === true}
                        onChange={(e) => update({ showSeconds: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500 cursor-pointer"
                      />
                    </label>
                  </>
                )}

                {config.type === 'weather' && (
                  <>
                    <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800 cursor-pointer">
                      <span className="text-xs text-neutral-200">Show High / Low Temperature</span>
                      <input
                        type="checkbox"
                        checked={config.showHighLow !== false}
                        onChange={(e) => update({ showHighLow: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500 cursor-pointer"
                      />
                    </label>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800">
                      <span className="text-xs text-neutral-200">Temperature Unit</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => update({ unit: 'celsius' })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                            config.unit !== 'fahrenheit' ? 'bg-blue-600 text-white' : 'text-neutral-400'
                          }`}
                        >
                          °C
                        </button>
                        <button
                          onClick={() => update({ unit: 'fahrenheit' })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                            config.unit === 'fahrenheit' ? 'bg-blue-600 text-white' : 'text-neutral-400'
                          }`}
                        >
                          °F
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Jetpack Glance Kotlin Code */}
          {activeTab === 'code' && (
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white">Android Jetpack Glance Source</h3>
                  <p className="text-[11px] text-neutral-400">
                    Compiled Kotlin code for Android 10+ home-screen widget
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
                >
                  {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Kotlin'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-black/80 text-neutral-300 font-mono text-xs overflow-x-auto border border-neutral-800 max-h-[360px] leading-relaxed">
                <code>{generateGlanceKotlinCode()}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Preview Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-neutral-300">
                Live Real-Time Preview
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {config.size} · {config.cornerRadius}px
              </span>
            </div>

            {/* Preview Viewport with subtle wallpaper backdrop */}
            <div
              className="relative rounded-3xl p-6 min-h-[280px] flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl transition-all"
              style={{
                background: isDark
                  ? 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)'
                  : 'radial-gradient(circle at 50% 50%, #e2e8f0 0%, #cbd5e1 100%)',
              }}
            >
              <div className="w-full max-w-[340px]">
                <WidgetRenderer
                  config={config}
                  palette={palette}
                  isDark={isDark}
                  systemState={systemState}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
              <span>Dynamic Monet Tokens:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: palette.primary }} title="Primary" />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: palette.secondary }} title="Secondary" />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: palette.tertiary }} title="Tertiary" />
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: palette.primaryContainer }} title="PrimaryContainer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
