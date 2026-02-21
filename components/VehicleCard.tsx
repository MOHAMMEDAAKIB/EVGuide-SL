'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '@/types';
import { formatCurrency, formatRange } from '@/lib/utils';
import { Battery, Car, Zap } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  featured?: boolean;
  categoryLabel?: string;
  showCompare?: boolean;
  isCompared?: boolean;
  onCompareToggle?: (checked: boolean) => void;
}

export default function VehicleCard({ 
  vehicle, 
  featured = false, 
  categoryLabel,
  showCompare = false,
  isCompared = false,
  onCompareToggle,
}: VehicleCardProps) {
  return (
    <div className="relative">
      {showCompare && (
        <div
          className="absolute right-4 top-4 z-20"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <label className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm shadow-emerald-600/10 backdrop-blur dark:border-emerald-500/30 dark:bg-slate-900/80 dark:text-emerald-300">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={(event) => onCompareToggle?.(event.target.checked)}
              className="h-4 w-4 accent-emerald-600"
              aria-label={`Compare ${vehicle.make} ${vehicle.model}`}
            />
            Compare
          </label>
        </div>
      )}

      <Link 
        href={`/vehicles/${vehicle.id}`}
        className="group relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-white via-slate-50 to-emerald-50/50 shadow-[0_18px_45px_rgba(15,23,42,0.12),0_1px_0_rgba(255,255,255,0.7)_inset] transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(15,23,42,0.2)] dark:border-slate-700/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-500/10 dark:shadow-[0_22px_55px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.06)_inset]"
      >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-emerald-400/25 blur-3xl" />
        <div className="absolute -bottom-28 -right-16 h-64 w-64 rounded-full bg-teal-400/25 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 translate-x-6 bg-linear-to-br from-white/50 via-white/5 to-transparent opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-slate-900/5 group-hover:ring-emerald-500/30 dark:ring-white/10" />

      {/* Featured Badge */}
      {featured && categoryLabel && (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-emerald-600/30">
          {categoryLabel}
        </div>
      )}

      {/* Vehicle Image */}
      <div className="relative h-52 overflow-hidden bg-linear-to-br from-emerald-50 via-white to-emerald-100/60 dark:from-slate-800 dark:via-slate-900 dark:to-emerald-900/30">
        {vehicle.image_url ? (
          <Image
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition duration-700 group-hover:scale-[1.08]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <Car className="w-12 h-12" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/40 via-transparent to-transparent opacity-80" />
      </div>

      {/* Vehicle Details */}
      <div className="relative p-6">
        <div className="pointer-events-none absolute inset-0 rounded-b-2xl bg-white/70 backdrop-blur-[2px] dark:bg-slate-900/65" />
        <div className="relative">
          {/* Make & Model */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {vehicle.make} {vehicle.model}
          </h3>
          
          {/* Body Type & Year */}
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            {vehicle.body_type} • {vehicle.year}
          </p>

          {/* Price */}
          <div className="mb-4">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(vehicle.price_lkr)}
            </span>
            {vehicle.price_registered_lkr && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Registered: {formatCurrency(vehicle.price_registered_lkr)}
              </p>
            )}
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-3 dark:border-slate-700/70">
            {/* Range */}
            <div>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Range (SL)</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                <Zap className="w-5 h-5 text-yellow-500 mb-2" /> {formatRange(vehicle.range_sl_estimate)}
              </p>
            </div>

            {/* Battery */}
            <div>
              <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Battery</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                <Battery className="w-5 h-5 text-emerald-600 mb-2" /> {vehicle.battery_kwh} kWh
              </p>
            </div>
          </div>

          {/* View Details Link */}
          <div className="mt-4 text-sm font-semibold text-emerald-600 transition group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-emerald-300">
            View Details →
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}
