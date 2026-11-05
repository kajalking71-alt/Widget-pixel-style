import React, { useState } from 'react';
import { WidgetCustomization, MonetPalette, SystemDeviceState } from '../../types';
import { PixelWidgetWrapper } from './PixelWidgetWrapper';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface CalendarWidgetProps {
  config: WidgetCustomization;
  palette: MonetPalette;
  isDark: boolean;
  systemState: SystemDeviceState;
  onTap?: () => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  config,
  palette,
  isDark,
  systemState,
  onTap,
}) => {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDayNum, setSelectedDayNum] = useState(new Date().getDate());

  const today = new Date();
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Sample events
  const mockEvents = [
    { day: today.getDate(), title: systemState.nextEvent?.title || 'Design System Review', time: '10:30 AM', color: palette.primary },
    { day: today.getDate(), title: 'Android Team Standup', time: '2:00 PM', color: palette.tertiary },
    { day: today.getDate() + 2, title: 'Pixel 9 Pro Firmware Drop', time: '4:00 PM', color: palette.secondary },
    { day: today.getDate() + 4, title: 'Widget Architecture Sprint', time: '11:00 AM', color: palette.primary },
  ];

  const selectedEvents = mockEvents.filter((ev) => ev.day === selectedDayNum);

  const style = config.calendarStyle || (config.size === '4x2' ? 'agenda-timeline' : 'month-grid');

  // Agenda Timeline Format (4x2)
  if (style === 'agenda-timeline' || config.size === '4x2' || config.size === '4x3') {
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
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
              style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
            >
              {today.getDate()}
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight" style={{ color: palette.onSurface }}>
                {today.toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
              <div className="text-[11px]" style={{ color: palette.onSurfaceVariant }}>
                {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: palette.surfaceContainerHigh, color: palette.onSurface }}
          >
            {mockEvents.length} Events This Week
          </div>
        </div>

        {/* Event List items */}
        <div className="mt-2.5 space-y-2 overflow-y-auto max-h-[140px] pr-1">
          {mockEvents.slice(0, 3).map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl text-xs transition-colors"
              style={{
                backgroundColor: isDark ? `${palette.surfaceContainerHigh}70` : `${palette.surfaceContainerLowest}90`,
                border: `1px solid ${palette.outlineVariant}15`,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <span className="font-medium truncate" style={{ color: palette.onSurface }}>
                  {event.title}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 text-[11px]" style={{ color: palette.onSurfaceVariant }}>
                <Clock size={11} />
                <span>{event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </PixelWidgetWrapper>
    );
  }

  // Month Grid View (2x2, 3x3)
  return (
    <PixelWidgetWrapper
      config={config}
      palette={palette}
      isDark={isDark}
      onClick={onTap}
      className="p-3.5 flex flex-col justify-between"
    >
      {/* Month Header with Navigator */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold tracking-tight uppercase" style={{ color: palette.primary }}>
          {monthName} {year}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-full hover:opacity-80 transition-opacity"
            style={{ color: palette.onSurfaceVariant }}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-full hover:opacity-80 transition-opacity"
            style={{ color: palette.onSurfaceVariant }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-1 text-center my-1">
        {dayNames.map((d, i) => (
          <span key={i} className="text-[10px] font-semibold opacity-60" style={{ color: palette.onSurfaceVariant }}>
            {d}
          </span>
        ))}
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Leading blank slots */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-6" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isCurrentToday =
            dayNum === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const isSelected = dayNum === selectedDayNum;
          const hasEvent = mockEvents.some((ev) => ev.day === dayNum);

          return (
            <button
              key={dayNum}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDayNum(dayNum);
              }}
              className="relative h-6 flex items-center justify-center rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: isCurrentToday
                  ? palette.primary
                  : isSelected
                  ? palette.primaryContainer
                  : 'transparent',
                color: isCurrentToday
                  ? palette.onPrimary
                  : isSelected
                  ? palette.onPrimaryContainer
                  : palette.onSurface,
              }}
            >
              <span>{dayNum}</span>
              {hasEvent && !isCurrentToday && (
                <div
                  className="absolute bottom-0.5 w-1 h-1 rounded-full"
                  style={{ backgroundColor: palette.secondary }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day event preview */}
      {selectedEvents.length > 0 && (
        <div
          className="mt-2 pt-1.5 border-t text-[11px] truncate flex items-center gap-1.5"
          style={{ borderColor: `${palette.outlineVariant}25`, color: palette.onSurfaceVariant }}
        >
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: selectedEvents[0].color }} />
          <span className="truncate font-medium">{selectedEvents[0].title}</span>
          <span className="shrink-0 opacity-70">· {selectedEvents[0].time}</span>
        </div>
      )}
    </PixelWidgetWrapper>
  );
};
