'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Vehicle } from '@/types';
import { formatCurrency, formatRange } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  featured?: boolean;
  categoryLabel?: string;
}

export default function VehicleCard({ vehicle, featured = false, categoryLabel }: VehicleCardProps) {
  return (
    <Link 
      href={`/vehicles/${vehicle.id}`}
      className="block bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      {/* Featured Badge */}
      {featured && categoryLabel && (
        <div className="absolute top-4 left-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {categoryLabel}
        </div>
      )}

      {/* Vehicle Image */}
      <div className="relative h-48 bg-linear-to-br from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600">
        {vehicle.image_url ? (
          <Image
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <span className="text-4xl">🚗</span>
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="p-5">
        {/* Make & Model */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {vehicle.make} {vehicle.model}
        </h3>
        
        {/* Body Type & Year */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {vehicle.body_type} • {vehicle.year}
        </p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-green-600 dark:text-green-500">
            {formatCurrency(vehicle.price_lkr)}
          </span>
          {vehicle.price_registered_lkr && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Registered: {formatCurrency(vehicle.price_registered_lkr)}
            </p>
          )}
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {/* Range */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Range (SL)</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              ⚡ {formatRange(vehicle.range_sl_estimate)}
            </p>
          </div>

          {/* Battery */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Battery</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              🔋 {vehicle.battery_kwh} kWh
            </p>
          </div>
        </div>

        {/* View Details Link */}
        <div className="mt-4 text-green-600 dark:text-green-500 text-sm font-medium group-hover:text-green-700 dark:group-hover:text-green-400">
          View Details →
        </div>
      </div>
    </Link>
  );
}
