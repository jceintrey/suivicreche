export interface DaySchedule {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  enabled: boolean;
}

// 0=dimanche, 1=lundi, ..., 6=samedi (convention JS Date.getDay())
export type WeeklySchedule = Record<number, DaySchedule>;

export interface Config {
  hourlyRate: number;
}

// Cle: "YYYY-MM-DD", valeur: true si jour selectionne
export type SelectedDays = Record<string, boolean>;

// Override horaire pour un jour specifique
export interface DayOverride {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
}

// Cle: "YYYY-MM-DD"
export type DayOverrides = Record<string, DayOverride>;

// Facture mensuelle sauvegardee
export interface MonthInvoice {
  key: string;            // "YYYY-MM"
  year: number;
  month: number;          // 0-indexed
  invoicedAmount: number; // Montant facture par la creche
  calculatedDays: number;
  calculatedHours: number;
  calculatedAmount: number;
  comment: string;        // Note libre
  savedAt: string;        // ISO date
}

export const DAY_NAMES: Record<number, string> = {
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
  0: 'Dimanche',
};

export const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
