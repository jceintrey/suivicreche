import { useRef, useCallback } from 'react';
import { WeeklySchedule, SelectedDays, DayOverrides } from '../types';

interface Props {
  year: number;
  month: number; // 0-indexed
  selectedDays: SelectedDays;
  schedule: WeeklySchedule;
  dayOverrides: DayOverrides;
  onDayClick: (dateKey: string) => void;
  onDayLongPress: (dateKey: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const HEADER_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const LONG_PRESS_MS = 400;

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function MonthCalendar({
  year, month, selectedDays, schedule, dayOverrides, onDayClick, onDayLongPress, onPrevMonth, onNextMonth,
}: Props) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressedRef = useRef(false);

  const handlePointerDown = useCallback((key: string) => {
    longPressedRef.current = false;
    timerRef.current = setTimeout(() => {
      longPressedRef.current = true;
      onDayLongPress(key);
    }, LONG_PRESS_MS);
  }, [onDayLongPress]);

  const handlePointerUp = useCallback((key: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!longPressedRef.current) {
      onDayClick(key);
    }
  }, [onDayClick]);

  const handlePointerLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Jour de la semaine du 1er (0=dim → convertir en 0=lun)
  const firstDayRaw = new Date(year, month, 1).getDay();
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // 0=lundi

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="month-calendar">
      <div className="calendar-nav">
        <button onClick={onPrevMonth}>◀</button>
        <h2>{MONTH_NAMES[month]} {year}</h2>
        <button onClick={onNextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {HEADER_DAYS.map((d) => (
          <div key={d} className="calendar-header">{d}</div>
        ))}

        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="calendar-cell empty" />;

          const key = dateKey(year, month, day);
          const jsDay = new Date(year, month, day).getDay();
          const hasSchedule = schedule[jsDay]?.enabled;
          const isSelected = !!selectedDays[key];
          const hasOverride = !!dayOverrides[key];

          return (
            <div
              key={key}
              className={[
                'calendar-cell',
                isSelected ? 'selected' : '',
                !hasSchedule ? 'no-schedule' : '',
                hasOverride ? 'has-override' : '',
              ].join(' ')}
              onPointerDown={() => handlePointerDown(key)}
              onPointerUp={() => handlePointerUp(key)}
              onPointerLeave={handlePointerLeave}
              onContextMenu={(e) => e.preventDefault()}
            >
              {day}
              {hasOverride && <span className="override-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
