'use client';

import { SpecComparison } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { CheckCheck, DollarSign, Zap, BarChart3, Battery, Gauge, Timer, Rocket, Users, Package, Plug, Car, Route } from 'lucide-react';

interface ComparisonRowProps {
  spec: SpecComparison;
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'dollar-sign': <DollarSign className="w-5 h-5 text-emerald-600" />,
    'zap': <Zap className="w-5 h-5 text-yellow-500" />,
    'bar-chart-3': <BarChart3 className="w-5 h-5 text-blue-500" />,
    'battery': <Battery className="w-5 h-5 text-green-500" />,
    'gauge': <Gauge className="w-5 h-5 text-orange-500" />,
    'timer': <Timer className="w-5 h-5 text-indigo-500" />,
    'rocket': <Rocket className="w-5 h-5 text-red-500" />,
    'users': <Users className="w-5 h-5 text-purple-500" />,
    'package': <Package className="w-5 h-5 text-amber-500" />,
    'plug': <Plug className="w-5 h-5 text-cyan-500" />,
    'car': <Car className="w-5 h-5 text-cyan-500" />,
    'route': <Route className="w-5 h-5 text-teal-500" />,
  };
  
  return iconMap[iconName] || <span>{iconName}</span>;
};

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
          {getIconComponent(spec.icon)}
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
                <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
}
