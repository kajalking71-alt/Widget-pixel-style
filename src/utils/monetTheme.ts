import { MonetPalette, WallpaperOption } from '../types';

// Convert Hex to HSL
function hexToHsl(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  l = Math.max(0, Math.min(100, l)) / 100;
  s = Math.max(0, Math.min(100, s)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generate Material You / Monet tonal palette from seed hex color
 */
export function generateMonetPalette(seedHex: string, isDark: boolean = true): MonetPalette {
  const [h, s] = hexToHsl(seedHex);
  const cleanHue = (h + 360) % 360;
  const modS = Math.min(Math.max(s, 24), 65); // Clamp saturation for pleasing M3 pastels

  if (isDark) {
    return {
      primary: hslToHex(cleanHue, modS, 80),
      onPrimary: hslToHex(cleanHue, modS, 20),
      primaryContainer: hslToHex(cleanHue, modS - 8, 30),
      onPrimaryContainer: hslToHex(cleanHue, modS, 90),

      secondary: hslToHex((cleanHue + 15) % 360, Math.max(modS - 18, 15), 75),
      onSecondary: hslToHex((cleanHue + 15) % 360, Math.max(modS - 18, 15), 20),
      secondaryContainer: hslToHex((cleanHue + 15) % 360, Math.max(modS - 22, 12), 26),
      onSecondaryContainer: hslToHex((cleanHue + 15) % 360, Math.max(modS - 18, 15), 88),

      tertiary: hslToHex((cleanHue + 60) % 360, Math.max(modS - 10, 20), 78),
      onTertiary: hslToHex((cleanHue + 60) % 360, Math.max(modS - 10, 20), 22),
      tertiaryContainer: hslToHex((cleanHue + 60) % 360, Math.max(modS - 14, 15), 28),
      onTertiaryContainer: hslToHex((cleanHue + 60) % 360, Math.max(modS - 10, 20), 90),

      surface: hslToHex(cleanHue, 8, 9),
      onSurface: hslToHex(cleanHue, 10, 92),
      surfaceVariant: hslToHex(cleanHue, 12, 19),
      onSurfaceVariant: hslToHex(cleanHue, 12, 78),
      surfaceContainer: hslToHex(cleanHue, 10, 16),
      surfaceContainerHigh: hslToHex(cleanHue, 11, 21),
      surfaceContainerLow: hslToHex(cleanHue, 8, 12),
      surfaceContainerLowest: hslToHex(cleanHue, 6, 6),
      outline: hslToHex(cleanHue, 10, 48),
      outlineVariant: hslToHex(cleanHue, 8, 28),
    };
  } else {
    // Light Mode
    return {
      primary: hslToHex(cleanHue, modS, 38),
      onPrimary: '#ffffff',
      primaryContainer: hslToHex(cleanHue, modS, 88),
      onPrimaryContainer: hslToHex(cleanHue, modS + 15, 12),

      secondary: hslToHex((cleanHue + 15) % 360, Math.max(modS - 15, 15), 44),
      onSecondary: '#ffffff',
      secondaryContainer: hslToHex((cleanHue + 15) % 360, Math.max(modS - 20, 10), 90),
      onSecondaryContainer: hslToHex((cleanHue + 15) % 360, Math.max(modS - 10, 15), 14),

      tertiary: hslToHex((cleanHue + 60) % 360, Math.max(modS - 8, 20), 40),
      onTertiary: '#ffffff',
      tertiaryContainer: hslToHex((cleanHue + 60) % 360, Math.max(modS - 12, 16), 89),
      onTertiaryContainer: hslToHex((cleanHue + 60) % 360, Math.max(modS - 5, 20), 12),

      surface: hslToHex(cleanHue, 12, 98),
      onSurface: hslToHex(cleanHue, 10, 12),
      surfaceVariant: hslToHex(cleanHue, 14, 91),
      onSurfaceVariant: hslToHex(cleanHue, 12, 30),
      surfaceContainer: hslToHex(cleanHue, 12, 93),
      surfaceContainerHigh: hslToHex(cleanHue, 12, 88),
      surfaceContainerLow: hslToHex(cleanHue, 10, 96),
      surfaceContainerLowest: '#ffffff',
      outline: hslToHex(cleanHue, 10, 52),
      outlineVariant: hslToHex(cleanHue, 12, 78),
    };
  }
}

export const WALLPAPER_PRESETS: WallpaperOption[] = [
  {
    id: 'bay-blue',
    name: 'Bay Blue',
    description: 'Pixel 8 Signature oceanic sky & calm azure',
    dominantColor: '#4385F5',
    secondaryColor: '#A8C7FA',
    bgGradient: 'radial-gradient(circle at 80% 20%, #4385F5 0%, #1e3a8a 45%, #0f172a 100%)',
    previewUrl: '',
  },
  {
    id: 'obsidian-carbon',
    name: 'Obsidian Flow',
    description: 'Pixel 9 stealth volcanic graphite & mineral shadows',
    dominantColor: '#78909C',
    secondaryColor: '#B0BEC5',
    bgGradient: 'radial-gradient(circle at 20% 80%, #334155 0%, #1e293b 40%, #090d16 100%)',
    previewUrl: '',
  },
  {
    id: 'mint-breeze',
    name: 'Mint Flora',
    description: 'Fresh botanical pistachio, sage, and eucalyptus',
    dominantColor: '#4E9F76',
    secondaryColor: '#A3D9C9',
    bgGradient: 'radial-gradient(circle at 70% 30%, #4E9F76 0%, #134e4a 50%, #022c22 100%)',
    previewUrl: '',
  },
  {
    id: 'rose-quartz',
    name: 'Rose Peony',
    description: 'Warm pastel petal blush with coral reflections',
    dominantColor: '#E06D7D',
    secondaryColor: '#FAD2E1',
    bgGradient: 'radial-gradient(circle at 30% 20%, #E06D7D 0%, #831843 50%, #4c0519 100%)',
    previewUrl: '',
  },
  {
    id: 'porcelain-amber',
    name: 'Porcelain Dawn',
    description: 'Warm ceramic sand with golden morning glow',
    dominantColor: '#F49D37',
    secondaryColor: '#FFE0B2',
    bgGradient: 'radial-gradient(circle at 60% 70%, #F49D37 0%, #7c2d12 45%, #270902 100%)',
    previewUrl: '',
  },
  {
    id: 'iris-lavender',
    name: 'Iris Twilight',
    description: 'Electric lilac, violet dusk, and deep amethyst',
    dominantColor: '#9C6ADE',
    secondaryColor: '#D7B9FB',
    bgGradient: 'radial-gradient(circle at 75% 25%, #9C6ADE 0%, #581c87 50%, #1e0933 100%)',
    previewUrl: '',
  },
];
