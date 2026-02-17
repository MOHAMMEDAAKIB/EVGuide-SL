'use client';

import { SpecComparison } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface ComparisonRowProps {
  spec: SpecComparison;
}

export default function ComparisonRow({ spec }: ComparisonRowProps) {
  const formatValue = (value: number | string | null, index: number): string => {
    if (value === null) return 'N/A';
    
    // Special formatting for price
    if (spec.label === 'Price' && typeof value === 'number') {
      return formatCurrency(value);
    }
    
    // Format numeric values with unit
    if (typeof value === 'number') {
      return `${value}${spec.unit ? ' ' + spec.unit : ''}`;
    }
    
    // Return string values as-is
    return String(value);
  };

  const isWinner = (index: number): boolean => {
    return spec.winnerIndices.includes(index);
  };

  return (
    <tr className="border-b border-slate-200/70 dark:border-slate-700/70 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
      {/* Spec Label */}
      <td className="sticky left-0 bg-white dark:bg-slate-900 px-4 py-4 font-medium text-slate-900 dark:text-white border-r border-slate-200/70 dark:border-slate-700/70 z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg">{spec.icon}</span>
          <span className="text-sm">{spec.label}</span>
        </div>
      </td>

      {/* Vehicle Values */}
      {spec.values.map((value, index) => {
        const winner = isWinner(index);
        return (
          <td
            key={index}
            className={`px-4 py-4 text-center ${
              winner
                ? 'bg-emerald-50 dark:bg-emerald-900/20 font-bold text-emerald-900 dark:text-emerald-300'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm">{formatValue(value, index)}</span>
              {winner && spec.comparisonType !== 'none' && (
                <span className="text-emerald-600 dark:text-emerald-400">✓✓</span>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
}
