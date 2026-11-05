import React from 'react';
import { WidgetCustomization, MonetPalette, SystemDeviceState } from '../../types';
import { PixelWidgetWrapper } from './PixelWidgetWrapper';
import { Zap, Smartphone, Headphones, Watch, BatteryCharging, Battery } from 'lucide-react';

interface BatteryWidgetProps {
  config: WidgetCustomization;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  onTap?: () => void;
}

export const BatteryWidget: React.FC<BatteryWidgetProps> = ({
  config,
  palette,
  isDark,
  systemState,
  onTap,
}) => {
  const { batteryLevel, isCharging, earbudsLevel, watchLevel } = systemState;

  const devices = [
    {
      id: 'phone',
      name: 'Pixel 9 Pro',
      level: batteryLevel,
      isCharging,
      icon: <Smartphone size={16} />,
      color: palette.primary,
    },
    {
      id: 'buds-left',
      name: 'Pixel Buds (L)',
      level: earbudsLevel.left,
      isCharging: false,
      icon: <Headphones size={16} />,
      color: palette.secondary,
    },
    {
      id: 'buds-right',
      name: 'Pixel Buds (R)',
      level: earbudsLevel.right,
      isCharging: false,
      icon: <Headphones size={16} />,
      color: palette.secondary,
    },
    {
      id: 'watch',
      name: 'Pixel Watch 3',
      level: watchLevel,
      isCharging: false,
      icon: <Watch size={16} />,
      color: palette.tertiary,
    },
  ];

  const style = config.batteryStyle || (config.size === '2x2' ? 'gauge-circle' : 'multi-device');

  // Format 1: Gauge Circle Arc (2x2)
  if (style === 'gauge-circle' || config.size === '2x2') {
    const strokeDashoffset = 251.2 - (251.2 * batteryLevel) / 100;

    return (
      <PixelWidgetWrapper
        config={config}
        palette={palette}
        isDark={isDark}
        onClick={onTap}
        className="p-4 flex flex-col items-center justify-between"
      >
        <div className="w-full flex items-center justify-between text-xs font-medium" style={{ color: palette.onSurfaceVariant }}>
          <div className="flex items-center gap-1.5">
            <Smartphone size={13} style={{ color: palette.primary }} />
            <span>Pixel 9 Pro</span>
          </div>
          {isCharging && (
            <span className="flex items-center gap-0.5 text-emerald-400 font-mono text-[10px]">
              <Zap size={10} /> Fast
            </span>
          )}
        </div>

        {/* Circular SVG Gauge */}
        <div className="relative w-28 h-28 my-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="9"
              fill="none"
              stroke={palette.surfaceContainerHigh}
            />
            {/* Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="9"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              stroke={palette.primary}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-black font-sans tracking-tight tabular-nums" style={{ color: palette.onSurface }}>
                {batteryLevel}
              </span>
              <span className="text-sm font-semibold opacity-70" style={{ color: palette.primary }}>%</span>
            </div>
            {isCharging && (
              <Zap size={13} className="text-emerald-400 animate-pulse mt-0.5" />
            )}
          </div>
        </div>

        <div className="text-center text-[11px]" style={{ color: palette.onSurfaceVariant }}>
          {isCharging ? 'Charging rapidly' : 'Est. 14 hrs remaining'}
        </div>
      </PixelWidgetWrapper>
    );
  }

  // Format 2: Multi-Device Grid (4x2, 4x1)
  return (
    <PixelWidgetWrapper
      config={config}
      palette={palette}
      isDark={isDark}
      onClick={onTap}
      className="p-4 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: `${palette.outlineVariant}25` }}>
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
          >
            {isCharging ? <BatteryCharging size={16} /> : <Battery size={16} />}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: palette.primary }}>
              Battery Hub
            </div>
            <div className="text-[11px]" style={{ color: palette.onSurfaceVariant }}>
              {isCharging ? 'Charging connected devices' : 'All systems normal'}
            </div>
          </div>
        </div>

        <span
          className="text-xs font-mono px-2 py-0.5 rounded-full"
          style={{ backgroundColor: palette.surfaceContainerHigh, color: palette.onSurface }}
        >
          {devices.length} Devices
        </span>
      </div>

      {/* Grid of 4 connected devices */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className="p-2.5 rounded-2xl flex flex-col justify-between transition-all"
            style={{
              backgroundColor: isDark ? `${palette.surfaceContainerHigh}80` : `${palette.surfaceContainerLowest}95`,
              border: `1px solid ${palette.outlineVariant}20`,
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: device.color }}>{device.icon}</span>
              {device.isCharging && (
                <Zap size={11} className="text-emerald-400 fill-emerald-400" />
              )}
            </div>

            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold tabular-nums" style={{ color: palette.onSurface }}>
                  {device.level}
                </span>
                <span className="text-xs font-semibold opacity-70" style={{ color: palette.onSurfaceVariant }}>
                  %
                </span>
              </div>
              <div className="text-[10px] font-medium truncate mt-0.5" style={{ color: palette.onSurfaceVariant }}>
                {device.name}
              </div>
            </div>

            {/* Micro Progress Bar */}
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: palette.surfaceContainer }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${device.level}%`,
                  backgroundColor: device.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </PixelWidgetWrapper>
  );
};
