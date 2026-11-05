import React, { useState } from 'react';
import { WidgetCustomization, MonetPalette, SystemDeviceState } from '../../types';
import { PixelWidgetWrapper } from './PixelWidgetWrapper';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

interface NowPlayingWidgetProps {
  config: WidgetCustomization;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  onTap?: () => void;
}

export const NowPlayingWidget: React.FC<NowPlayingWidgetProps> = ({
  config,
  palette,
  isDark,
  systemState,
  onTap,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(42);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProgress(0);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProgress(0);
  };

  return (
    <PixelWidgetWrapper
      config={config}
      palette={palette}
      isDark={isDark}
      onClick={onTap}
      className="p-4 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow"
            style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
          >
            <Music size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: palette.onSurface }}>
              Stargazing
            </div>
            <div className="text-xs truncate" style={{ color: palette.onSurfaceVariant }}>
              Kygo · Golden Hour
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
          style={{ backgroundColor: palette.surfaceContainerHigh, color: palette.primary }}
        >
          <Volume2 size={11} />
          <span>Pixel Buds</span>
        </div>
      </div>

      {/* Android 13/14 Squiggly / Waveform Progress Bar */}
      <div className="my-2">
        <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: palette.surfaceContainerHigh }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: palette.primary }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: palette.onSurfaceVariant }}>
          <span>1:42</span>
          <span>3:56</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-4 pt-1">
        <button
          type="button"
          onClick={handlePrev}
          className="p-2 rounded-full hover:opacity-80 transition-opacity"
          style={{ color: palette.onSurface }}
        >
          <SkipBack size={18} />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow"
          style={{ backgroundColor: palette.primary, color: palette.onPrimary }}
        >
          {isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="p-2 rounded-full hover:opacity-80 transition-opacity"
          style={{ color: palette.onSurface }}
        >
          <SkipForward size={18} />
        </button>
      </div>
    </PixelWidgetWrapper>
  );
};
