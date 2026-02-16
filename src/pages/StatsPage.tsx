import { useState, useEffect } from 'react';
import { loadInvoices } from '../storage/localStorage';
import { SimpleChart } from '../components/SimpleChart';
import type { MonthInvoice } from '../types';

const MONTH_NAMES = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

export function StatsPage() {
  const [invoices, setInvoices] = useState<MonthInvoice[]>([]);

  useEffect(() => {
    setInvoices(loadInvoices());
  }, []);

  if (invoices.length === 0) {
    return (
      <div className="page">
        <h1>Statistiques</h1>
        <div className="stats-empty">
          <p>Aucune facture sauvegardee.</p>
          <p>Sauvegardez votre premiere facture depuis la page Suivi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Statistiques</h1>

      <section className="stats-section">
        <h2>Evolution</h2>
        <SimpleChart invoices={invoices} />
      </section>

      <section className="stats-section">
        <h2>Historique</h2>
        <div className="invoice-history">
          {[...invoices].reverse().map((inv) => {
            const diff = Math.round((inv.invoicedAmount - inv.calculatedAmount) * 100) / 100;
            const hasDiff = Math.abs(diff) > 0.01;
            return (
              <div key={inv.key} className="invoice-card">
                <div className="invoice-card-header">
                  <span className="invoice-card-month">
                    {MONTH_NAMES[inv.month]} {inv.year}
                  </span>
                  <span className="invoice-card-amount">
                    {inv.calculatedAmount.toFixed(2)} &euro;
                  </span>
                </div>
                <div className="invoice-card-details">
                  <span>{inv.calculatedDays} jours</span>
                  <span>{inv.calculatedHours.toFixed(1)}h</span>
                </div>
                {hasDiff && (
                  <div className={`invoice-card-diff ${diff > 0 ? 'diff-positive' : 'diff-negative'}`}>
                    Ecart facture : {diff > 0 ? '+' : ''}{diff.toFixed(2)} &euro;
                  </div>
                )}
                {inv.comment && (
                  <div className="invoice-card-comment">{inv.comment}</div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
