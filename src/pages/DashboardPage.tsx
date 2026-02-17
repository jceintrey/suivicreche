import { useState, useEffect } from 'react';
import { MonthCalendar } from '../components/MonthCalendar';
import { MonthSummary } from '../components/MonthSummary';
import { DayDetailModal } from '../components/DayDetailModal';
import { calculateMonth } from '../logic/calculation';
import { exportMonthPdf } from '../logic/exportPdf';
import {
  loadConfig,
  loadSchedule,
  loadSelectedDays,
  saveSelectedDays,
  loadDayOverrides,
  saveDayOverrides,
  loadInvoices,
  saveInvoices,
} from '../storage/localStorage';
import type { SelectedDays, DayOverrides, DayOverride, MonthInvoice } from '../types';

export function DashboardPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDays, setSelectedDays] = useState<SelectedDays>(loadSelectedDays);
  const [dayOverrides, setDayOverrides] = useState<DayOverrides>(loadDayOverrides);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [invoicedAmount, setInvoicedAmount] = useState('');
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);

  const config = loadConfig();
  const schedule = loadSchedule();

  useEffect(() => {
    saveSelectedDays(selectedDays);
  }, [selectedDays]);

  useEffect(() => {
    saveDayOverrides(dayOverrides);
  }, [dayOverrides]);

  const summary = calculateMonth(year, month, selectedDays, schedule, config.hourlyRate, dayOverrides);

  // Charger la facture existante quand on change de mois
  useEffect(() => {
    const invoices = loadInvoices();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const existing = invoices.find((inv) => inv.key === monthKey);
    if (existing) {
      setInvoicedAmount(String(existing.invoicedAmount));
      setComment(existing.comment);
    } else {
      setInvoicedAmount('');
      setComment('');
    }
    setSaved(false);
  }, [year, month]);

  const handleDayClick = (dateKey: string) => {
    setSelectedDays((prev) => {
      const next = { ...prev };
      if (next[dateKey]) {
        delete next[dateKey];
      } else {
        next[dateKey] = true;
      }
      return next;
    });
  };

  const handleDayLongPress = (dateKey: string) => {
    if (!selectedDays[dateKey]) {
      setSelectedDays((prev) => ({ ...prev, [dateKey]: true }));
    }
    setEditingDay(dateKey);
  };

  const handleToggleDay = (dateKey: string) => {
    setSelectedDays((prev) => {
      const next = { ...prev };
      if (next[dateKey]) {
        delete next[dateKey];
      } else {
        next[dateKey] = true;
      }
      return next;
    });
  };

  const handleSaveOverride = (dateKey: string, override: DayOverride) => {
    setDayOverrides((prev) => ({ ...prev, [dateKey]: override }));
  };

  const handleClearOverride = (dateKey: string) => {
    setDayOverrides((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  };

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleSaveInvoice = () => {
    const amount = invoicedAmount ? parseFloat(invoicedAmount) : summary.totalAmount;
    if (isNaN(amount) || amount < 0) return;

    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const invoice: MonthInvoice = {
      key: monthKey,
      year,
      month,
      invoicedAmount: amount,
      calculatedDays: summary.totalDays,
      calculatedHours: summary.totalHours,
      calculatedAmount: summary.totalAmount,
      comment,
      savedAt: new Date().toISOString(),
    };

    const invoices = loadInvoices();
    const idx = invoices.findIndex((inv) => inv.key === monthKey);
    if (idx >= 0) {
      invoices[idx] = invoice;
    } else {
      invoices.push(invoice);
    }
    invoices.sort((a, b) => a.key.localeCompare(b.key));
    saveInvoices(invoices);

    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const diff = invoicedAmount
    ? Math.round((parseFloat(invoicedAmount) - summary.totalAmount) * 100) / 100
    : 0;
  const hasDiff = invoicedAmount && !isNaN(parseFloat(invoicedAmount)) && Math.abs(diff) > 0.01;

  return (
    <div className="page">
      <h1>Suivi Creche</h1>
      <MonthCalendar
        year={year}
        month={month}
        selectedDays={selectedDays}
        schedule={schedule}
        dayOverrides={dayOverrides}
        onDayClick={handleDayClick}
        onDayLongPress={handleDayLongPress}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <MonthSummary summary={summary} hourlyRate={config.hourlyRate} />

      <div className="invoice-save">
        <h3>Enregistrer le mois</h3>
        <div className="invoice-input-row">
          <label htmlFor="invoiced-amount">Montant facture :</label>
          <div className="invoice-input-group">
            <input
              id="invoiced-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder={summary.totalAmount.toFixed(2)}
              value={invoicedAmount}
              onChange={(e) => setInvoicedAmount(e.target.value)}
            />
            <span className="rate-unit">&euro;</span>
          </div>
        </div>
        {hasDiff && (
          <div className={`invoice-diff ${diff > 0 ? 'diff-positive' : 'diff-negative'}`}>
            Ecart : {diff > 0 ? '+' : ''}{diff.toFixed(2)} &euro;
          </div>
        )}
        <textarea
          className="invoice-comment"
          placeholder="Commentaire (optionnel)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
        />
        <button
          className={`modal-btn primary invoice-save-btn${saved ? ' saved' : ''}`}
          onClick={handleSaveInvoice}
        >
          {saved ? 'Sauvegarde !' : 'Sauvegarder'}
        </button>
      </div>

      <button
        className="modal-btn primary export-pdf-btn"
        onClick={() => exportMonthPdf(year, month, selectedDays, schedule, dayOverrides, config.hourlyRate)}
      >
        Exporter PDF
      </button>

      {editingDay && (
        <DayDetailModal
          dateKey={editingDay}
          dayOfWeek={(() => {
            const [y, m, d] = editingDay.split('-').map(Number);
            return new Date(y, m - 1, d).getDay();
          })()}
          isSelected={!!selectedDays[editingDay]}
          schedule={schedule}
          override={dayOverrides[editingDay] ?? null}
          onToggle={() => handleToggleDay(editingDay)}
          onSaveOverride={(ov) => handleSaveOverride(editingDay, ov)}
          onClearOverride={() => handleClearOverride(editingDay)}
          onClose={() => setEditingDay(null)}
        />
      )}
    </div>
  );
}
