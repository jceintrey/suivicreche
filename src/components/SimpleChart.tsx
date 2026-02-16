import type { MonthInvoice } from '../types';

interface Props {
  invoices: MonthInvoice[];
}

const MONTH_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const W = 440;
const H = 220;
const PAD_LEFT = 45;
const PAD_RIGHT = 40;
const PAD_TOP = 15;
const PAD_BOTTOM = 30;
const CHART_W = W - PAD_LEFT - PAD_RIGHT;
const CHART_H = H - PAD_TOP - PAD_BOTTOM;

function niceMax(val: number): number {
  if (val <= 0) return 100;
  const magnitude = Math.pow(10, Math.floor(Math.log10(val)));
  const normalized = val / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

export function SimpleChart({ invoices }: Props) {
  if (invoices.length === 0) return null;

  const maxAmount = niceMax(
    Math.max(...invoices.flatMap((i) => [i.calculatedAmount, i.invoicedAmount]))
  );
  const maxHours = niceMax(Math.max(...invoices.map((i) => i.calculatedHours)));

  const n = invoices.length;
  const groupWidth = CHART_W / n;
  const barWidth = groupWidth * 0.3;
  const gap = groupWidth * 0.05;

  const yAmount = (val: number) => PAD_TOP + CHART_H - (val / maxAmount) * CHART_H;
  const yHours = (val: number) => PAD_TOP + CHART_H - (val / maxHours) * CHART_H;
  const xCenter = (i: number) => PAD_LEFT + groupWidth * i + groupWidth / 2;

  const linePoints = invoices
    .map((inv, i) => `${xCenter(i)},${yHours(inv.calculatedHours)}`)
    .join(' ');

  return (
    <div className="chart-container">
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#4a90d9' }} /> Calcule
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: '#f0a030' }} /> Facture
        </span>
        <span className="legend-item">
          <span className="legend-line" /> Heures
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
        {/* Grille et axe Y gauche (montants) */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const val = maxAmount * frac;
          const y = yAmount(val);
          return (
            <g key={`grid-${frac}`}>
              <line
                x1={PAD_LEFT} y1={y} x2={W - PAD_RIGHT} y2={y}
                stroke="#e0e0e0" strokeWidth="0.5"
              />
              <text x={PAD_LEFT - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#888">
                {val.toFixed(0)}&euro;
              </text>
            </g>
          );
        })}

        {/* Axe Y droit (heures) */}
        {[0, 0.5, 1].map((frac) => {
          const val = maxHours * frac;
          const y = yHours(val);
          return (
            <text
              key={`hours-${frac}`}
              x={W - PAD_RIGHT + 4} y={y + 3}
              textAnchor="start" fontSize="8" fill="#27ae60"
            >
              {val.toFixed(0)}h
            </text>
          );
        })}

        {/* Barres */}
        {invoices.map((inv, i) => {
          const cx = xCenter(i);
          const calcH = (inv.calculatedAmount / maxAmount) * CHART_H;
          const invH = (inv.invoicedAmount / maxAmount) * CHART_H;
          return (
            <g key={inv.key}>
              <rect
                x={cx - barWidth - gap / 2}
                y={PAD_TOP + CHART_H - calcH}
                width={barWidth}
                height={calcH}
                fill="#4a90d9"
                rx="2"
              />
              <rect
                x={cx + gap / 2}
                y={PAD_TOP + CHART_H - invH}
                width={barWidth}
                height={invH}
                fill="#f0a030"
                rx="2"
              />
            </g>
          );
        })}

        {/* Ligne des heures */}
        <polyline
          points={linePoints}
          fill="none"
          stroke="#27ae60"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {invoices.map((inv, i) => (
          <circle
            key={`dot-${inv.key}`}
            cx={xCenter(i)}
            cy={yHours(inv.calculatedHours)}
            r="3"
            fill="#27ae60"
          />
        ))}

        {/* Labels axe X */}
        {invoices.map((inv, i) => (
          <text
            key={`label-${inv.key}`}
            x={xCenter(i)}
            y={H - 5}
            textAnchor="middle"
            fontSize="8"
            fill="#666"
          >
            {MONTH_LABELS[inv.month]}{inv.year % 100}
          </text>
        ))}
      </svg>
    </div>
  );
}
