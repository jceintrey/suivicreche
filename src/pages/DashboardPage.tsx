import { useState, useEffect } from 'react';
import { MonthCalendar } from '../components/MonthCalendar';
import { MonthSummary } from '../components/MonthSummary';
import { calculateMonth } from '../logic/calculation';
import {
  loadConfig,
  loadSchedule,
  loadSelectedDays,
  saveSelectedDays,
} from '../storage/localStorage';
import type { SelectedDays } from '../types';

export function DashboardPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDays, setSelectedDays] = useState<SelectedDays>(loadSelectedDays);

  const config = loadConfig();
  const schedule = loadSchedule();

  useEffect(() => {
    saveSelectedDays(selectedDays);
  }, [selectedDays]);

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

  const summary = calculateMonth(year, month, selectedDays, schedule, config.hourlyRate);

  return (
    <div className="page">
      <h1>Suivi Creche</h1>
      <MonthCalendar
        year={year}
        month={month}
        selectedDays={selectedDays}
        schedule={schedule}
        onToggleDay={handleToggleDay}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <MonthSummary summary={summary} hourlyRate={config.hourlyRate} />
    </div>
  );
}
