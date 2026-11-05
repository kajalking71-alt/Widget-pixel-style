import React, { useState } from 'react';
import { MonetPalette, SystemDeviceState, WallpaperOption } from '../../types';
import {
  Settings,
  ShieldCheck,
  Download,
  Copy,
  Check,
  FileCode,
  FileText,
  Terminal,
  Zap,
  CloudSun,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SettingsScreenProps {
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  onUpdateSystemState: (partial: Partial<SystemDeviceState>) => void;
  activeWallpaper: WallpaperOption;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  palette,
  isDark,
  systemState,
  onUpdateSystemState,
  activeWallpaper,
}) => {
  const [activeCodeFile, setActiveCodeFile] = useState<string>('GlanceWidgets.kt');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Permission simulation states
  const [permissions, setPermissions] = useState({
    calendar: true,
    location: true,
    batteryOptimization: true,
    postNotifications: true,
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const codeFiles: Record<string, { filename: string; language: string; content: string }> = {
    'GlanceWidgets.kt': {
      filename: 'PixelGlanceWidgets.kt',
      language: 'kotlin',
      content: `package com.google.pixelwidgets.glance

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.action.actionStartActivity
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.google.pixelwidgets.MainActivity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Native Android 10+ Google Pixel At a Glance widget built with Jetpack Glance.
 * Provides dynamic wallpaper-based Material You color token support.
 */
class PixelAtAGlanceWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            GlanceTheme {
                AtAGlanceContent()
            }
        }
    }

    @Composable
    private fun AtAGlanceContent() {
        val dateFormat = SimpleDateFormat("EEE, MMM d", Locale.getDefault())
        val dateString = dateFormat.format(Date())

        Box(
            modifier = GlanceModifier
                .fillMaxSize()
                .cornerRadius(28.dp)
                .background(GlanceTheme.colors.surfaceContainer)
                .clickable(actionStartActivity<MainActivity>())
                .padding(16.dp),
            contentAlignment = Alignment.CenterStart
        ) {
            Column(modifier = GlanceModifier.fillMaxWidth()) {
                // Top Date and Weather Header
                Row(
                    modifier = GlanceModifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = dateString,
                        style = TextStyle(
                            color = GlanceTheme.colors.onSurface,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = GlanceModifier.defaultWeight())
                    // Weather Pill
                    Row(
                        modifier = GlanceModifier
                            .cornerRadius(16.dp)
                            .background(GlanceTheme.colors.surfaceVariant)
                            .padding(horizontal = 8.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${systemState.temperature}°C",
                            style = TextStyle(
                                color = GlanceTheme.colors.onSurfaceVariant,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium
                            )
                        )
                    }
                }

                Spacer(modifier = GlanceModifier.height(8.dp))

                // Context Alert / Calendar Event
                Row(
                    modifier = GlanceModifier
                        .fillMaxWidth()
                        .cornerRadius(16.dp)
                        .background(GlanceTheme.colors.surfaceContainerHigh)
                        .padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "${systemState.nextEvent?.title || 'No upcoming events'}",
                        style = TextStyle(
                            color = GlanceTheme.colors.onSurface,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium
                        )
                    )
                }
            }
        }
    }
}

class PixelAtAGlanceReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = PixelAtAGlanceWidget()
}`,
    },
    'AndroidManifest.xml': {
      filename: 'AndroidManifest.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions for Pixel Widgets Live Data -->
    <uses-permission android:name="android.permission.READ_CALENDAR" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.PixelWidgets">

        <!-- At a Glance Widget Receiver -->
        <receiver
            android:name=".glance.PixelAtAGlanceReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/pixel_glance_info" />
        </receiver>

        <!-- Weather Widget Receiver -->
        <receiver
            android:name=".glance.PixelWeatherReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/pixel_weather_info" />
        </receiver>

    </application>
</manifest>`,
    },
    'build.gradle.kts': {
      filename: 'build.gradle.kts',
      language: 'kotlin',
      content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.google.pixelwidgets"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.google.pixelwidgets"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // Jetpack Glance for Native Android Home-screen Widgets
    implementation("androidx.glance:glance:1.1.0")
    implementation("androidx.glance:glance-appwidget:1.1.0")
    implementation("androidx.glance:glance-material3:1.1.0")

    // Material 3 Compose for Companion App UI
    implementation("androidx.compose.material3:material3:1.3.1")
    implementation("androidx.compose.ui:ui:1.7.5")
    implementation("androidx.compose.ui:ui-tooling-preview:1.7.5")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
}`,
    },
    'pixel_glance_info.xml': {
      filename: 'pixel_glance_info.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/glance_widget_description"
    android:initialKeyguardLayout="@layout/glance_default_loading"
    android:initialLayout="@layout/glance_default_loading"
    android:minWidth="250dp"
    android:minHeight="110dp"
    android:targetCellWidth="4"
    android:targetCellHeight="2"
    android:previewImage="@drawable/pixel_widget_preview"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen|keyguard"
    android:widgetFeatures="reconfigurable">
</appwidget-provider>`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeFiles[activeCodeFile].content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadAll = () => {
    // Pack all files into a consolidated downloadable Kotlin bundle
    const bundleText = Object.entries(codeFiles)
      .map(
        ([key, file]) =>
          `// ========================================================\n// FILE: ${file.filename}\n// ========================================================\n\n${file.content}\n\n`
      )
      .join('\n');

    const blob = new Blob([bundleText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pixel-widgets-android-glance-source.kt';
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full"
            style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
          >
            System & Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Settings & Android Native Export
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configure real-time simulation parameters and export native Jetpack Glance Kotlin code.
        </p>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Companion Controls & Permissions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Data Simulation Sliders */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm space-y-5">
            <div className="flex items-center gap-2">
              <Zap size={18} style={{ color: palette.primary }} />
              <h2 className="text-sm font-semibold text-white">Live Data Simulator</h2>
            </div>

            {/* Battery Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-neutral-300">Device Battery Level</span>
                <span className="font-mono text-neutral-400">{systemState.batteryLevel}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={systemState.batteryLevel}
                onChange={(e) => onUpdateSystemState({ batteryLevel: Number(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Charging State Toggle */}
            <label className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800 cursor-pointer">
              <span className="text-xs text-neutral-200">Rapid Fast Charging</span>
              <input
                type="checkbox"
                checked={systemState.isCharging}
                onChange={(e) => onUpdateSystemState({ isCharging: e.target.checked })}
                className="w-4 h-4 rounded text-blue-500 cursor-pointer"
              />
            </label>

            {/* Simulated Weather Condition */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                Simulated Weather Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sunny', label: 'Sunny' },
                  { id: 'partly-cloudy', label: 'Partly' },
                  { id: 'cloudy', label: 'Cloudy' },
                  { id: 'rain', label: 'Rain' },
                  { id: 'thunder', label: 'Thunder' },
                  { id: 'snow', label: 'Snow' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      onUpdateSystemState({
                        conditionIcon: item.id as any,
                        condition: item.label,
                      })
                    }
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      systemState.conditionIcon === item.id
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-neutral-800 bg-neutral-800/50 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-neutral-300">Current Temperature</span>
                <span className="font-mono text-neutral-400">{systemState.temperature}°C</span>
              </div>
              <input
                type="range"
                min="-5"
                max="40"
                value={systemState.temperature}
                onChange={(e) => onUpdateSystemState({ temperature: Number(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Android Permissions Simulation */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Android Permissions Status</h2>
            </div>
            <p className="text-xs text-neutral-400">
              Native Android widgets require permissions to query calendar events and refresh in background.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  id: 'calendar',
                  label: 'Calendar Access (READ_CALENDAR)',
                  desc: 'Sync next upcoming calendar events into At a Glance',
                },
                {
                  id: 'location',
                  label: 'Coarse Location (ACCESS_COARSE_LOCATION)',
                  desc: 'Used only when refreshing local weather temperature',
                },
                {
                  id: 'batteryOptimization',
                  label: 'Battery Optimization Exemption',
                  desc: 'Permits Glance widgets to update without Doze delays',
                },
              ].map((perm) => (
                <div
                  key={perm.id}
                  onClick={() => togglePermission(perm.id as any)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/60 border border-neutral-800 cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold text-white">{perm.label}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">{perm.desc}</div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      permissions[perm.id as keyof typeof permissions]
                        ? 'bg-emerald-500 text-white'
                        : 'bg-neutral-700 text-neutral-400'
                    }`}
                  >
                    <Check size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Native Android Studio Kotlin Project Exporter (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Terminal size={18} style={{ color: palette.primary }} />
                  <h2 className="text-sm font-semibold text-white">
                    Android Jetpack Glance Codebase
                  </h2>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Production-ready Android 10+ Kotlin widget implementation
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
                >
                  {copiedFile ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedFile ? 'Copied!' : 'Copy File'}</span>
                </button>

                <button
                  onClick={handleDownloadAll}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shadow transition-all hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: downloadSuccess ? '#10b981' : palette.primary,
                    color: downloadSuccess ? '#ffffff' : palette.onPrimary,
                  }}
                >
                  <Download size={14} />
                  <span>{downloadSuccess ? 'Downloaded!' : 'Export All'}</span>
                </button>
              </div>
            </div>

            {/* File Switcher Tabs */}
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto scrollbar-none">
              {Object.keys(codeFiles).map((fileKey) => (
                <button
                  key={fileKey}
                  onClick={() => setActiveCodeFile(fileKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all ${
                    activeCodeFile === fileKey
                      ? 'bg-neutral-800 text-white shadow border border-neutral-700'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileCode size={13} style={{ color: activeCodeFile === fileKey ? palette.primary : undefined }} />
                  <span>{codeFiles[fileKey].filename}</span>
                </button>
              ))}
            </div>

            {/* Code Content Viewer */}
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-black/90 text-neutral-300 font-mono text-xs overflow-x-auto border border-neutral-800/80 max-h-[460px] leading-relaxed select-text">
                <code>{codeFiles[activeCodeFile].content}</code>
              </pre>
            </div>

            <div className="p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 flex items-start gap-3">
              <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-300 leading-relaxed">
                <span className="font-semibold text-white">How to run in Android Studio:</span> Copy the
                Glance widget files into your <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded">app/src/main/java</code> folder,
                declare receivers in <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded">AndroidManifest.xml</code>,
                and compile with <code className="text-neutral-200 bg-neutral-800 px-1 py-0.5 rounded">androidx.glance:glance:1.1.0</code>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
