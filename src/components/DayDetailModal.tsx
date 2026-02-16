import { useState } from 'react';
import type { DayOverride, WeeklySchedule } from '../types';

interface Props {
  dateKey: string;
  dayOfWeek: number;
  isSelected: boolean;
  schedule: WeeklySchedule;
  override: DayOverride | null;
  onToggle: () => void;
  onSaveOverride: (override: DayOverride) => void;
  onClearOverride: () => void;
  onClose: () => void;
}

export function DayDetailModal({
  dateKey,
  dayOfWeek,
  isSelected,
  schedule,
  override,
  onToggle,
  onSaveOverride,
  onClearOverride,
  onClose,
}: Props) {
  const defaultSlot = schedule[dayOfWeek];
  const [hasOverride, setHasOverride] = useState(!!override);
  const [start, setStart] = useState(override?.start ?? defaultSlot?.start ?? '08:30');
  const [end, setEnd] = useState(override?.end ?? defaultSlot?.end ?? '17:30');

  const [y, m, d] = dateKey.split('-').map(Number);
  const formattedDate = new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleToggleOverride = (checked: boolean) => {
    setHasOverride(checked);
    if (checked && !override) {
      setStart(defaultSlot?.start ?? '08:30');
      setEnd(defaultSlot?.end ?? '17:30');
    }
  };

  const handleConfirm = () => {
    if (hasOverride) {
      onSaveOverride({ start, end });
    } else if (override) {
      onClearOverride();
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="day-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{formattedDate}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <label className="modal-toggle">
            <input type="checkbox" checked={isSelected} onChange={onToggle} />
            <span>Jour travaille</span>
          </label>

          {isSelected && (
            <>
              {defaultSlot?.enabled && (
                <div className="modal-default-schedule">
                  Par defaut : {defaultSlot.start} — {defaultSlot.end}
                </div>
              )}

              <label className="modal-toggle">
                <input
                  type="checkbox"
                  checked={hasOverride}
                  onChange={(e) => handleToggleOverride(e.target.checked)}
                />
                <span>Horaires personnalises</span>
              </label>

              {hasOverride && (
                <div className="modal-time-inputs">
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                  />
                  <span className="timeslot-sep">—</span>
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-actions">
          <button className="modal-btn primary" onClick={handleConfirm}>
            Valider
          </button>
          {override && (
            <button
              className="modal-btn danger"
              onClick={() => {
                onClearOverride();
                onClose();
              }}
            >
              Supprimer l'exception
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
