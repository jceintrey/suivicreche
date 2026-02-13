import { useState, useEffect } from 'react';
import { TimeSlotEditor } from '../components/TimeSlotEditor';
import { loadConfig, saveConfig, loadSchedule, saveSchedule } from '../storage/localStorage';
import type { Config, WeeklySchedule } from '../types';

export function ConfigPage() {
  const [config, setConfig] = useState<Config>(loadConfig);
  const [schedule, setSchedule] = useState<WeeklySchedule>(loadSchedule);

  useEffect(() => { saveConfig(config); }, [config]);
  useEffect(() => { saveSchedule(schedule); }, [schedule]);

  const handleRateChange = (value: string) => {
    const rate = parseFloat(value);
    if (!isNaN(rate) && rate >= 0) {
      setConfig({ ...config, hourlyRate: rate });
    }
  };

  return (
    <div className="page">
      <h1>Configuration</h1>

      <section className="config-section">
        <h2>Prix horaire</h2>
        <div className="rate-input">
          <input
            type="number"
            step="0.01"
            min="0"
            value={config.hourlyRate}
            onChange={(e) => handleRateChange(e.target.value)}
          />
          <span className="rate-unit">€ / heure</span>
        </div>
      </section>

      <section className="config-section">
        <h2>Plages horaires</h2>
        <TimeSlotEditor schedule={schedule} onChange={setSchedule} />
      </section>
    </div>
  );
}
