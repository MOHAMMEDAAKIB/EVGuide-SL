import { Vehicle } from '@/types';
import VehicleCard from './VehicleCard';
import { calculateBestValue } from '@/lib/utils';

interface FeaturedVehiclesProps {
  vehicles: Vehicle[];
}

export default function FeaturedVehicles({ vehicles }: FeaturedVehiclesProps) {
  if (vehicles.length === 0) {
    return null;
  }

  // Calculate featured vehicles
  const featured: Array<{ vehicle: Vehicle; label: string }> = [];
  const usedIds = new Set<string>();

  // 1. Lowest Price
  const lowestPrice = vehicles.reduce((min, v) => 
    v.price_lkr < min.price_lkr ? v : min
  );
  featured.push({ vehicle: lowestPrice, label: 'Lowest Price' });
  usedIds.add(lowestPrice.id);

  // 2. Best Value (price/range ratio)
  const bestValue = calculateBestValue(vehicles);
  if (bestValue && !usedIds.has(bestValue.id)) {
    featured.push({ vehicle: bestValue, label: 'Best Value' });
    usedIds.add(bestValue.id);
  }

  // 3. Longest Range
  const longestRange = vehicles.reduce((max, v) => 
    v.range_sl_estimate > max.range_sl_estimate ? v : max
  );
  if (!usedIds.has(longestRange.id)) {
    featured.push({ vehicle: longestRange, label: 'Longest Range' });
    usedIds.add(longestRange.id);
  }

  // 4. Newest (most recently added)
  const newest = [...vehicles].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];
  if (newest && !usedIds.has(newest.id)) {
    featured.push({ vehicle: newest, label: 'Recently Added' });
    usedIds.add(newest.id);
  }

  return (
    <section className="py-16 bg-linear-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Electric Vehicles
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover our top picks for Sri Lankan drivers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(({ vehicle, label }) => (
            <VehicleCard
              key={`featured-${vehicle.id}`}
              vehicle={vehicle}
              featured={true}
              categoryLabel={label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
