'use client';

import { Vehicle } from '@/types';

interface SpecsTableProps {
  vehicle: Vehicle;
}

export default function SpecsTable({ vehicle }: SpecsTableProps) {
  const specs = [
    {
      label: 'Battery Capacity',
      value: `${vehicle.battery_kwh} kWh`,
      icon: '🔋',
    },
    {
      label: 'Range (WLTP)',
      value: `${vehicle.range_wltp} km`,
      icon: '📊',
    },
    {
      label: 'Range (SL Estimate)',
      value: `${vehicle.range_sl_estimate} km (85% adjustment)`,
      icon: '⚡',
    },
    {
      label: 'Motor Power',
      value: `${vehicle.motor_power_kw} kW (${Math.round(vehicle.motor_power_kw * 1.3)} HP)`,
      icon: '💪',
    },
    {
      label: 'Top Speed',
      value: vehicle.top_speed_kmh ? `${vehicle.top_speed_kmh} km/h` : 'N/A',
      icon: '🚀',
    },
    {
      label: 'Acceleration (0-100 km/h)',
      value: vehicle.acceleration_0_100 ? `${vehicle.acceleration_0_100} seconds` : 'N/A',
      icon: '⏱️',
    },
    {
      label: 'Drive Type',
      value: vehicle.drive_type,
      icon: '🛣️',
    },
    {
      label: 'Seating Capacity',
      value: `${vehicle.seating_capacity} seats`,
      icon: '👥',
    },
    {
      label: 'Cargo Space',
      value: vehicle.cargo_space_liters ? `${vehicle.cargo_space_liters} liters` : 'N/A',
      icon: '📦',
    },
    {
      label: 'Body Type',
      value: vehicle.body_type,
      icon: '🚗',
    },
    {
      label: 'Year',
      value: `${vehicle.year}`,
      icon: '📅',
    },
    {
      label: 'Tax Bracket',
      value: vehicle.tax_bracket || 'N/A',
      icon: '💰',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Specifications</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {specs.map((spec, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-xl border border-slate-100 bg-linear-to-br from-slate-50 to-slate-50/50 p-4 dark:border-slate-800 dark:from-slate-800/50 dark:to-slate-800/30"
          >
            <span className="text-2xl">{spec.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{spec.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{spec.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Key Takeaway */}
      <div className="mt-8 rounded-xl border-l-4 border-emerald-600 bg-emerald-50 p-4 dark:border-emerald-400 dark:bg-emerald-900/20">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-1">💡 Key Information</p>
        <p className="text-sm text-emerald-800 dark:text-emerald-200">
          The range estimate shown above is adjusted for Sri Lankan conditions (85% of WLTP). Actual range may vary based on driving habits, weather, and road conditions.
        </p>
      </div>
    </div>
  );
}
