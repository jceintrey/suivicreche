import type { WeeklySchedule, SelectedDays, DayOverrides } from '../types';
import { timeToHours } from './calculation';

const MONTH_NAMES = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

const DAY_NAMES_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

interface DayRow {
  date: string;
  dayName: string;
  start: string;
  end: string;
  hours: number;
}

function buildRows(
  year: number,
  month: number,
  selectedDays: SelectedDays,
  schedule: WeeklySchedule,
  dayOverrides: DayOverrides,
): DayRow[] {
  const rows: DayRow[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (!selectedDays[key]) continue;

    const jsDay = new Date(year, month, d).getDay();
    const override = dayOverrides[key];
    const slot = override ?? schedule[jsDay];

    if (!slot) continue;

    const start = slot.start;
    const end = slot.end;
    const hours = Math.max(0, timeToHours(end) - timeToHours(start));

    rows.push({
      date: `${String(d).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`,
      dayName: DAY_NAMES_SHORT[jsDay],
      start,
      end,
      hours,
    });
  }

  return rows;
}

export function exportMonthPdf(
  year: number,
  month: number,
  selectedDays: SelectedDays,
  schedule: WeeklySchedule,
  dayOverrides: DayOverrides,
  hourlyRate: number,
  printAfter = true,
) {
  const rows = buildRows(year, month, selectedDays, schedule, dayOverrides);
  const totalHours = Math.round(rows.reduce((s, r) => s + r.hours, 0) * 100) / 100;
  const totalAmount = Math.round(totalHours * hourlyRate * 100) / 100;
  const title = `${MONTH_NAMES[month]} ${year}`;

  const tableRows = rows
    .map(
      (r) => `
      <tr>
        <td>${r.date}</td>
        <td>${r.dayName}</td>
        <td>${r.start}</td>
        <td>${r.end}</td>
        <td class="num">${r.hours.toFixed(2)}h</td>
      </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>SuiviCreche - ${title}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #333; max-width: 600px; margin: 0 auto; }
  h1 { font-size: 1.3rem; margin-bottom: 4px; }
  .subtitle { color: #888; font-size: 0.85rem; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 0.9rem; }
  th { text-align: left; padding: 6px 8px; border-bottom: 2px solid #333; font-weight: 600; }
  td { padding: 5px 8px; border-bottom: 1px solid #ddd; }
  .num { text-align: right; }
  th.num { text-align: right; }
  .summary { border-top: 2px solid #333; padding-top: 12px; font-size: 0.95rem; }
  .summary-row { display: flex; justify-content: space-between; padding: 4px 0; }
  .summary-row.total { font-weight: 700; font-size: 1.1rem; border-top: 1px solid #ccc; margin-top: 4px; padding-top: 8px; }
  @media print {
    body { padding: 0; }
    @page { margin: 15mm; }
  }
</style>
</head>
<body>
  <h1>Releve d'heures - Creche</h1>
  <div class="subtitle">${title} &mdash; ${rows.length} jour${rows.length > 1 ? 's' : ''}</div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Jour</th>
        <th>Debut</th>
        <th>Fin</th>
        <th class="num">Heures</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-row">
      <span>Jours travailles</span>
      <span>${rows.length}</span>
    </div>
    <div class="summary-row">
      <span>Total heures</span>
      <span>${totalHours.toFixed(2)}h</span>
    </div>
    <div class="summary-row">
      <span>Prix horaire</span>
      <span>${hourlyRate.toFixed(2)} &euro;/h</span>
    </div>
    <div class="summary-row total">
      <span>Montant</span>
      <span>${totalAmount.toFixed(2)} &euro;</span>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();

  if (printAfter) {
    win.addEventListener('afterprint', () => win.close());
    setTimeout(() => win.print(), 300);
  }
}
