'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { YearlyData } from '@/lib/tcoCalculations';

interface SavingsChartProps {
  projectionData: YearlyData[];
  breakEvenYears: number;
}

export default function SavingsChart({ projectionData, breakEvenYears }: SavingsChartProps) {
  // Format data for Recharts
  const chartData = projectionData.map(item => ({
    year: `Year ${item.year}`,
    Petrol: item.petrolCumulativeCost,
    Electric: item.evCumulativeCost,
    Savings: item.cumulativeSavings,
  }));
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <p className="font-bold text-slate-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Petrol:</span>{' '}
              {formatCurrency(payload[0].value)}
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Electric:</span>{' '}
              {formatCurrency(payload[1].value)}
            </p>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              Savings: {formatCurrency(payload[2].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-600" /> 5-Year Cost Projection
      </h3>
      
      {breakEvenYears < Infinity && breakEvenYears <= 5 && (
        <div className="mb-4 rounded-lg border-l-4 border-emerald-600 bg-emerald-50 p-4 dark:border-emerald-400 dark:bg-emerald-900/20">
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-emerald-600" /> Break-even point: <span className="text-lg">{breakEvenYears.toFixed(1)} years</span>
          </p>
          <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-1">
            After this point, you start saving money with the EV
          </p>
        </div>
      )}
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis
              dataKey="year"
              className="text-xs text-slate-600 dark:text-slate-400"
              stroke="currentColor"
            />
            <YAxis
              className="text-xs text-slate-600 dark:text-slate-400"
              stroke="currentColor"
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                return value.toString();
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
            <Line
              type="monotone"
              dataKey="Petrol"
              stroke="#64748b"
              strokeWidth={3}
              dot={{ fill: '#64748b', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="Electric"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
          <div className="text-xs text-slate-600 dark:text-slate-400">Total 5-Year Cost (Petrol)</div>
          <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(projectionData[4].petrolCumulativeCost)}
          </div>
        </div>
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <div className="text-xs text-emerald-700 dark:text-emerald-300">Total 5-Year Cost (EV)</div>
          <div className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrency(projectionData[4].evCumulativeCost)}
          </div>
        </div>
      </div>
    </div>
  );
}
