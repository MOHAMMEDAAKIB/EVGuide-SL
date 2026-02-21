'use client';

import { Vehicle } from '@/types';
import VehicleCard from './VehicleCard';
import { Search } from 'lucide-react';

interface VehicleGridProps {
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  isFiltered: boolean;
}

export default function VehicleGrid({ vehicles, filteredVehicles, isFiltered }: VehicleGridProps) {
  const displayVehicles = isFiltered ? filteredVehicles : vehicles;

  return (
    <section id="vehicles" className="py-16 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {isFiltered ? 'Search Results' : 'All Electric Vehicles'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Showing {displayVehicles.length} {displayVehicles.length === 1 ? 'vehicle' : 'vehicles'}
            </p>
          </div>
        </div>

        {displayVehicles.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search filters to see more results
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          // Vehicle Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
