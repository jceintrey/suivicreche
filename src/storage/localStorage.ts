import { Config, WeeklySchedule, SelectedDays } from '../types';

const KEYS = {
  config: 'suivicreche_config',
  schedule: 'suivicreche_schedule',
  selectedDays: 'suivicreche_selected_days',
} as const;

const DEFAULT_CONFIG: Config = { hourlyRate: 3.20 };

const DEFAULT_SCHEDULE: WeeklySchedule = {
  1: { start: '08:30', end: '17:30', enabled: true },
  2: { start: '08:30', end: '17:30', enabled: true },
  3: { start: '08:30', end: '17:30', enabled: true },
  4: { start: '08:30', end: '17:30', enabled: true },
  5: { start: '08:30', end: '17:30', enabled: true },
  6: { start: '08:30', end: '17:30', enabled: false },
  0: { start: '08:30', end: '17:30', enabled: false },
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadConfig(): Config {
  return load(KEYS.config, DEFAULT_CONFIG);
}

export function saveConfig(config: Config): void {
  save(KEYS.config, config);
}

export function loadSchedule(): WeeklySchedule {
  return load(KEYS.schedule, DEFAULT_SCHEDULE);
}

export function saveSchedule(schedule: WeeklySchedule): void {
  save(KEYS.schedule, schedule);
}

export function loadSelectedDays(): SelectedDays {
  return load(KEYS.selectedDays, {});
}

export function saveSelectedDays(days: SelectedDays): void {
  save(KEYS.selectedDays, days);
}
