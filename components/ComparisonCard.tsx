'use client';

import Image from 'next/image';
import { Vehicle } from '@/types';
import { Car } from 'lucide-react';

interface ComparisonCardProps {
  vehicle: Vehicle;
  onRemove?: (id: string) => void;
  isCompact?: boolean;
}

export default function ComparisonCard({ vehicle, onRemove, isCompact = false }: ComparisonCardProps) {
  if (isCompact) {
    return (
      <div className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 min-w-50">
        {/* Remove Button */}
        {onRemove && (
          <button
            onClick={() => onRemove(vehicle.id)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
            aria-label="Remove from comparison"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Vehicle Info */}
        <div className="flex items-center space-x-3">
          <div className="shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            {vehicle.image_url ? (
              <Image
                src={vehicle.image_url}
                alt={`${vehicle.make} ${vehicle.model}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {vehicle.make}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{vehicle.model}</p>
            <p className="text-xs font-medium text-green-600 dark:text-green-500 mt-1">
              Rs. {vehicle.price_lkr?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default variant - used in comparison bar
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={() => onRemove(vehicle.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
          aria-label="Remove from comparison"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
        {vehicle.image_url ? (
          <Image
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {vehicle.make} {vehicle.model}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{vehicle.year}</p>

        {/* Key Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Price</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              Rs. {vehicle.price_lkr?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Range</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {vehicle.range_sl_estimate || vehicle.range_wltp || 'N/A'} km
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Battery</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {vehicle.battery_kwh ? `${vehicle.battery_kwh} kWh` : 'N/A'}
            </span>
          </div>

          {vehicle.acceleration_0_100 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">0-100 km/h</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {vehicle.acceleration_0_100}s
              </span>
            </div>
          )}
        </div>

        {/* Type Badge */}
        {vehicle.body_type && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
              {vehicle.body_type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
