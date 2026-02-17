'use client';

import Link from 'next/link';
import { Vehicle } from '@/types';

interface CompareBarProps {
  selectedVehicles: Vehicle[];
  onRemove: (vehicleId: string) => void;
  onClear: () => void;
}

export default function CompareBar({ selectedVehicles, onRemove, onClear }: CompareBarProps) {
  if (selectedVehicles.length === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-4 z-40 mx-auto w-full max-w-6xl px-4">
      <div className="rounded-2xl border border-emerald-200/70 bg-white/95 p-4 shadow-[0_20px_45px_rgba(15,23,42,0.18)] backdrop-blur dark:border-emerald-500/30 dark:bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Compare vehicles ({selectedVehicles.length}/3)
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select up to three models to compare
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-200"
              >
                {vehicle.make} {vehicle.model}
                <button
                  type="button"
                  onClick={() => onRemove(vehicle.id)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-100"
                  aria-label={`Remove ${vehicle.make} ${vehicle.model}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-300"
            >
              Clear
            </button>
            {selectedVehicles.length >= 2 ? (
              <Link
                href={`/compare?ids=${selectedVehicles.map(v => v.id).join(',')}`}
                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Compare
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white opacity-60 cursor-not-allowed"
                title="Select at least 2 vehicles"
              >
                Compare
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
