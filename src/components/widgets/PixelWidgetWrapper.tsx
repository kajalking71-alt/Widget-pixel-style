import React from 'react';
import { WidgetCustomization, MonetPalette } from '../../types';

interface PixelWidgetWrapperProps {
  config: WidgetCustomization;
  palette: MonetPalette;
  isDark: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const PixelWidgetWrapper: React.FC<PixelWidgetWrapperProps> = ({
  config,
  palette,
  isDark,
  children,
  className = '',
  onClick,
  interactive = true,
}) => {
  const { backgroundStyle, opacity, cornerRadius, customColor, useWallpaperColor } = config;

  // Determine container styling based on backgroundStyle
  let containerBg = '';
  let containerBorder = '';
  let backdropFilter = '';

  const alpha = Math.max(0, Math.min(100, opacity)) / 100;
  const baseBgColor = useWallpaperColor || !customColor ? palette.surfaceContainer : customColor;

  switch (backgroundStyle) {
    case 'monet':
      containerBg = baseBgColor;
      containerBorder = isDark ? `1px solid ${palette.outlineVariant}33` : `1px solid ${palette.outlineVariant}22`;
      break;

    case 'glass':
      containerBg = isDark
        ? `rgba(30, 34, 42, ${alpha * 0.75})`
        : `rgba(255, 255, 255, ${alpha * 0.75})`;
      backdropFilter = 'blur(16px) saturate(180%)';
      containerBorder = isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.4)';
      break;

    case 'solid':
      containerBg = useWallpaperColor || !customColor ? palette.primaryContainer : customColor;
      containerBorder = 'none';
      break;

    case 'transparent':
      containerBg = 'transparent';
      containerBorder = 'none';
      break;
  }

  // Calculate dynamic inline styles
  const style: React.CSSProperties = {
    borderRadius: `${cornerRadius ?? 24}px`,
    backgroundColor: backgroundStyle === 'transparent' ? 'transparent' : containerBg,
    border: containerBorder,
    backdropFilter: backdropFilter || undefined,
    WebkitBackdropFilter: backdropFilter || undefined,
    color: palette.onSurface,
    boxShadow:
      backgroundStyle === 'transparent'
        ? 'none'
        : isDark
        ? '0 6px 20px -4px rgba(0, 0, 0, 0.35)'
        : '0 4px 16px -2px rgba(0, 0, 0, 0.06)',
  };

  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative overflow-hidden transition-all duration-200 select-none ${
        interactive ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''
      } ${className}`}
    >
      {/* Subtle M3 Surface Tint overlay if opacity < 100 on monet mode */}
      {backgroundStyle === 'monet' && opacity < 100 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: isDark ? '#000000' : '#ffffff',
            opacity: 1 - alpha,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
