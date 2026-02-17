'use client';

import { useEffect, useState } from 'react';
import { Vehicle } from '@/types';
import { supabase } from '@/lib/supabase';
import { findSimilarVehicles } from '@/lib/utils';
import VehicleCard from './VehicleCard';

interface SimilarVehiclesProps {
  currentVehicleId: string;
  bodyType: string;
  driveType: string;
  priceRange: { low: number; high: number };
}

export default function SimilarVehicles({
  currentVehicleId,
  bodyType,
  driveType,
  priceRange,
}: SimilarVehiclesProps) {
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarVehicles = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('vehicles')
          .select('*');

        if (supabaseError) throw supabaseError;

        if (data) {
          const similar = findSimilarVehicles(
            data as Vehicle[],
            currentVehicleId,
            bodyType,
            driveType,
            priceRange,
            3
          );

          setSimilarVehicles(similar);
        }
      } catch (err) {
        console.error('Error fetching similar vehicles:', err);
        setError('Failed to load similar vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarVehicles();
  }, [currentVehicleId, bodyType, driveType, priceRange]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600 dark:border-emerald-900 dark:border-t-emerald-400"></div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Loading similar vehicles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400">{error}</p>
      </div>
    );
  }

  if (similarVehicles.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          No similar vehicles found matching your criteria.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Try adjusting filters or explore other vehicle categories.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Similar Vehicles</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Other {bodyType.toLowerCase()}s with {driveType} drive in a similar price range
      </p>

      {/* Similar Vehicles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {similarVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* Browse All Button */}
      <div className="mt-12 flex justify-center">
        <a
          href={`/vehicles?body=${encodeURIComponent(bodyType)}&drive=${encodeURIComponent(driveType)}`}
          className="rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          Browse All {bodyType}s →
        </a>
      </div>
    </div>
  );
}
