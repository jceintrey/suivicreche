import { MonthSummary as Summary } from '../logic/calculation';

interface Props {
  summary: Summary;
  hourlyRate: number;
}

export function MonthSummary({ summary, hourlyRate }: Props) {
  return (
    <div className="month-summary">
      <div className="summary-row">
        <span>Jours travaillés</span>
        <strong>{summary.totalDays}</strong>
      </div>
      <div className="summary-row">
        <span>Total heures</span>
        <strong>{summary.totalHours.toFixed(2)} h</strong>
      </div>
      <div className="summary-row">
        <span>Prix horaire</span>
        <strong>{hourlyRate.toFixed(2)} €/h</strong>
      </div>
      <div className="summary-row total">
        <span>Montant à payer</span>
        <strong>{summary.totalAmount.toFixed(2)} €</strong>
      </div>
    </div>
  );
}
