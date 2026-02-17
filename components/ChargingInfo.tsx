'use client';

import { Vehicle } from '@/types';

interface ChargingInfoProps {
  vehicle: Vehicle;
}

export default function ChargingInfo({ vehicle }: ChargingInfoProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Charging Information</h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* AC Charging */}
        <div className="rounded-2xl border-2 border-blue-200 bg-linear-to-br from-blue-50 to-blue-50/50 p-6 dark:border-blue-500/30 dark:from-blue-900/20 dark:to-blue-900/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🏠</span>
            <div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300">Home AC Charging</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">Type 2 (Standard)</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Full Charge (0-100%)</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {vehicle.charging_time_ac_hours}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">hours</p>
            </div>

            <div className="rounded-lg bg-white/50 p-3 dark:bg-slate-900/50">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Estimated Range Per Hour</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                {Math.round(vehicle.range_sl_estimate / vehicle.charging_time_ac_hours)} km/h
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-100/30 p-3 dark:border-blue-500/30 dark:bg-blue-900/20">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              💡 Best for overnight charging when you have access to a dedicated outlet.
            </p>
          </div>
        </div>

        {/* DC Fast Charging */}
        <div className="rounded-2xl border-2 border-orange-200 bg-linear-to-br from-orange-50 to-orange-50/50 p-6 dark:border-orange-500/30 dark:from-orange-900/20 dark:to-orange-900/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚡</span>
            <div>
              <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300">Fast DC Charging</h3>
              <p className="text-sm text-orange-700 dark:text-orange-400">CCS2 (20-80%)</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">20% → 80% Charge</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {vehicle.charging_time_dc_minutes}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">minutes</p>
            </div>

            <div className="rounded-lg bg-white/50 p-3 dark:bg-slate-900/50">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Estimated Range Added</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
                {Math.round((vehicle.range_sl_estimate * 0.6) / (vehicle.charging_time_dc_minutes / 60))} km/h
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-orange-200 bg-orange-100/30 p-3 dark:border-orange-500/30 dark:bg-orange-900/20">
            <p className="text-xs text-orange-800 dark:text-orange-300">
              ⚡ Fast top-ups on road trips. Recommended for 20-80% charging to preserve battery health.
            </p>
          </div>
        </div>
      </div>

      {/* Charging Timeline */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Typical Charging Scenarios</h3>

        <div className="space-y-4">
          {/* Scenario 1 */}
          <div className="flex items-start gap-4 rounded-lg bg-white p-4 dark:bg-slate-900">
            <span className="text-2xl">🌙</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">Overnight Home Charging</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Full charge at home on AC Type 2: {vehicle.charging_time_ac_hours} hours
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                ✓ Cost-effective • Best for daily use
              </p>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="flex items-start gap-4 rounded-lg bg-white p-4 dark:bg-slate-900">
            <span className="text-2xl">🚗</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">Road Trip Quick Charge</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                DC fast charge from 20% to 80% in {vehicle.charging_time_dc_minutes} mins at a charging station
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                ✓ Fast • Network-based • Preserves battery
              </p>
            </div>
          </div>

          {/* Scenario 3 */}
          <div className="flex items-start gap-4 rounded-lg bg-white p-4 dark:bg-slate-900">
            <span className="text-2xl">🏢</span>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">Office/Workplace Charging</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Slow AC charging during work hours, add {Math.round((vehicle.range_sl_estimate / vehicle.charging_time_ac_hours) * 8)} km of range
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                ✓ Convenient • Enables longer daily range
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Battery Health Tip */}
      <div className="mt-6 rounded-xl border-l-4 border-emerald-600 bg-emerald-50 p-4 dark:border-emerald-400 dark:bg-emerald-900/20">
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-2">🔋 Battery Health Tip</p>
        <p className="text-sm text-emerald-800 dark:text-emerald-200">
          For long-term battery health, regularly charge between 20-80% rather than 0-100%. Avoid fully depleting the battery or frequently charging to 100%.
        </p>
      </div>
    </div>
  );
}
