/**
 * Core type definitions for Pixel Widgets
 */

export type WidgetType = 'glance' | 'clock' | 'weather' | 'calendar' | 'battery' | 'media';

export type WidgetSize = '2x1' | '2x2' | '4x1' | '4x2' | '4x3' | '3x3';

export type ClockStyle = 
  | 'scallop'        // Iconic Android 12-14 Material You 12-petal flower clock
  | 'stacked-bold'   // Large 2-line stacked digits (10 / 42)
  | 'digital-large'  // Clean horizontal digital time with date
  | 'analog-minimal' // Smooth rotating SVG hands with M3 pastel dial
  | 'pill-duo'       // Rounded capsule: time on left, weather on right
  | 'radial-retro';  // Vintage turntable concentric dial

export type WeatherStyle = 
  | 'compact-pill'   // 2x1 minimalist capsule
  | 'card-detailed'  // 2x2 with current condition & hi/lo
  | 'forecast-5day'  // 4x2 detailed weekly forecast strip
  | 'hourly-curve';  // 4x2 temperature graph and precipitation

export type CalendarStyle = 
  | 'month-grid'      // Full interactive 3x3 or 4x2 calendar matrix
  | 'agenda-timeline' // Upcoming schedule with event color chips
  | 'event-pill';     // Compact single-line next event pill

export type BatteryStyle = 
  | 'multi-device'    // Phone + Earbuds (L/R) + Watch
  | 'gauge-circle'    // 2x2 Circular progress arc
  | 'compact-row'     // 4x1 Horizontal pill strip
  | 'single-phone';   // Clean phone-only battery status

export type BackgroundStyle = 'monet' | 'glass' | 'solid' | 'transparent';

export interface MonetPalette {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerLow: string;
  surfaceContainerLowest: string;
  outline: string;
  outlineVariant: string;
}

export interface WallpaperOption {
  id: string;
  name: string;
  description: string;
  dominantColor: string;
  secondaryColor: string;
  bgGradient: string;
  imageUrl?: string;
  previewUrl: string;
}

export interface WidgetCustomization {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  backgroundStyle: BackgroundStyle;
  opacity: number; // 0 to 100
  cornerRadius: number; // in px (0 - 36)
  customColor?: string; // hex or undefined for monet
  useWallpaperColor: boolean;
  
  // Specific style variants
  clockStyle?: ClockStyle;
  weatherStyle?: WeatherStyle;
  calendarStyle?: CalendarStyle;
  batteryStyle?: BatteryStyle;

  // Granular toggles
  showDate?: boolean;
  showWeather?: boolean;
  showBattery?: boolean;
  showUpcomingEvent?: boolean;
  showLocation?: boolean;
  showHighLow?: boolean;
  showSeconds?: boolean;
  is24Hour?: boolean;
  unit?: 'celsius' | 'fahrenheit';
  
  // Custom font weight / scale
  fontScale?: 'compact' | 'normal' | 'expressive';
}

export interface PlacedWidget {
  instanceId: string;
  widgetId: string;
  config: WidgetCustomization;
  gridRow: number;
  gridCol: number;
  colSpan: number; // 1 to 4
  rowSpan: number; // 1 to 4
}

export interface SystemDeviceState {
  batteryLevel: number; // 0 - 100
  isCharging: boolean;
  earbudsLevel: { left: number; right: number; case: number };
  watchLevel: number;
  location: string;
  temperature: number;
  condition: string;
  conditionIcon: 'sunny' | 'cloudy' | 'rain' | 'partly-cloudy' | 'thunder' | 'snow';
  tempHigh: number;
  tempLow: number;
  nextEvent: {
    title: string;
    time: string;
    location?: string;
    colorCategory: string;
  };
  nowPlaying?: {
    title: string;
    artist: string;
    album: string;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
  };
}
