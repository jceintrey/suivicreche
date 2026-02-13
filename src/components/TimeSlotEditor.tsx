import { DaySchedule, DAY_NAMES, WEEKDAY_ORDER } from '../types';
import type { WeeklySchedule } from '../types';

interface Props {
  schedule: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
}

export function TimeSlotEditor({ schedule, onChange }: Props) {
  const updateDay = (day: number, patch: Partial<DaySchedule>) => {
    onChange({
      ...schedule,
      [day]: { ...schedule[day], ...patch },
    });
  };

  return (
    <div className="timeslot-editor">
      {WEEKDAY_ORDER.map((day) => {
        const slot = schedule[day];
        return (
          <div key={day} className={`timeslot-row ${slot.enabled ? '' : 'disabled'}`}>
            <label className="timeslot-toggle">
              <input
                type="checkbox"
                checked={slot.enabled}
                onChange={(e) => updateDay(day, { enabled: e.target.checked })}
              />
              <span className="day-name">{DAY_NAMES[day]}</span>
            </label>
            <div className="timeslot-times">
              <input
                type="time"
                value={slot.start}
                disabled={!slot.enabled}
                onChange={(e) => updateDay(day, { start: e.target.value })}
              />
              <span className="timeslot-sep">—</span>
              <input
                type="time"
                value={slot.end}
                disabled={!slot.enabled}
                onChange={(e) => updateDay(day, { end: e.target.value })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
