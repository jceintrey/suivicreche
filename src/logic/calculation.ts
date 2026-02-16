import { WeeklySchedule, SelectedDays, DayOverrides } from '../types';

/** Convertit "HH:MM" en nombre d'heures decimales */
export function timeToHours(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
}

/** Calcule les heures pour un jour donne selon la plage horaire */
export function hoursForDay(dayOfWeek: number, schedule: WeeklySchedule): number {
  const slot = schedule[dayOfWeek];
  if (!slot || !slot.enabled) return 0;
  const hours = timeToHours(slot.end) - timeToHours(slot.start);
  return Math.max(0, hours);
}

/** Retourne le jour de semaine (0-6) pour une date "YYYY-MM-DD" */
function getDayOfWeek(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

export interface MonthSummary {
  totalDays: number;
  totalHours: number;
  totalAmount: number;
}

/** Calcule le resume du mois pour les jours selectionnes */
export function calculateMonth(
  year: number,
  month: number,
  selectedDays: SelectedDays,
  schedule: WeeklySchedule,
  hourlyRate: number,
  dayOverrides: DayOverrides = {}
): MonthSummary {
  let totalDays = 0;
  let totalHours = 0;

  // Parcourir tous les jours du mois
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (selectedDays[key]) {
      totalDays++;
      const override = dayOverrides[key];
      if (override) {
        totalHours += Math.max(0, timeToHours(override.end) - timeToHours(override.start));
      } else {
        totalHours += hoursForDay(getDayOfWeek(key), schedule);
      }
    }
  }

  return {
    totalDays,
    totalHours: Math.round(totalHours * 100) / 100,
    totalAmount: Math.round(totalHours * hourlyRate * 100) / 100,
  };
}
