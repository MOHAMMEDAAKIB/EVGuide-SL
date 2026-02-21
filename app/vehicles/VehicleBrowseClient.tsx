'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterSidebar, { VehicleFilters } from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import CompareBar from '@/components/CompareBar';
import VehicleCard from '@/components/VehicleCard';
import { Vehicle } from '@/types';
import { Search } from 'lucide-react';

interface VehicleBrowseClientProps {
  vehicles: Vehicle[];
  totalCount: number;
  bodyTypes: string[];
  driveTypes: string[];
  page: number;
  pageSize: number;
}

const emptyFilters: VehicleFilters = {
  search: '',
  priceMin: null,
  priceMax: null,
  rangeMin: null,
  rangeMax: null,
  body: '',
  drive: '',
};

export default function VehicleBrowseClient({
  vehicles,
  totalCount,
  bodyTypes,
  driveTypes,
  page,
  pageSize,
}: VehicleBrowseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [limitHit, setLimitHit] = useState(false);

  const currentFilters: VehicleFilters = useMemo(() => {
    const getNumber = (key: string) => {
      const value = searchParams.get(key);
      if (!value) {
        return null;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };

    return {
      search: searchParams.get('q') ?? '',
      priceMin: getNumber('price_min'),
      priceMax: getNumber('price_max'),
      rangeMin: getNumber('range_min'),
      rangeMax: getNumber('range_max'),
      body: searchParams.get('body') ?? '',
      drive: searchParams.get('drive') ?? '',
    };
  }, [searchParams]);

  const sortValue = searchParams.get('sort') ?? 'price_asc';
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const selectedVehicles = useMemo(
    () => vehicles.filter((vehicle) => compareIds.includes(vehicle.id)),
    [compareIds, vehicles]
  );

  const updateSearchParams = useCallback(
    (
      next: Partial<VehicleFilters> & { sort?: string; page?: number | null },
      options?: { resetPage?: boolean }
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      const setParam = (key: string, value: string | number | null | undefined) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
          return;
        }
        params.set(key, String(value));
      };

      setParam('q', next.search ?? currentFilters.search);
      setParam('price_min', next.priceMin ?? currentFilters.priceMin ?? null);
      setParam('price_max', next.priceMax ?? currentFilters.priceMax ?? null);
      setParam('range_min', next.rangeMin ?? currentFilters.rangeMin ?? null);
      setParam('range_max', next.rangeMax ?? currentFilters.rangeMax ?? null);
      setParam('body', next.body ?? currentFilters.body);
      setParam('drive', next.drive ?? currentFilters.drive);

      if (typeof next.sort !== 'undefined') {
        setParam('sort', next.sort);
      }

      if (options?.resetPage) {
        params.delete('page');
      } else if (typeof next.page !== 'undefined') {
        setParam('page', next.page);
      }

      const queryString = params.toString();
      router.replace(queryString ? `/vehicles?${queryString}` : '/vehicles');
    },
    [currentFilters, router, searchParams]
  );

  const handleFilterChange = useCallback(
    (next: Partial<VehicleFilters>, options?: { resetPage?: boolean }) => {
      updateSearchParams(next, { resetPage: options?.resetPage ?? true });
    },
    [updateSearchParams]
  );

  const handleClearFilters = () => {
    updateSearchParams(emptyFilters, { resetPage: true });
  };

  const handleCompareToggle = (vehicleId: string, checked: boolean) => {
    setCompareIds((prev) => {
      if (checked) {
        if (prev.includes(vehicleId)) {
          return prev;
        }
        if (prev.length >= 3) {
          setLimitHit(true);
          return prev;
        }
        return [...prev, vehicleId];
      }
      return prev.filter((id) => id !== vehicleId);
    });
  };

  useEffect(() => {
    if (!limitHit) {
      return;
    }
    const timer = setTimeout(() => setLimitHit(false), 1800);
    return () => clearTimeout(timer);
  }, [limitHit]);

  const goToPage = (nextPage: number) => {
    updateSearchParams({ page: nextPage }, { resetPage: false });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-linear-to-br from-emerald-50 via-white to-white py-12 dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-200/60 transition hover:text-slate-900 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300"
          >
            ← Back
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                All Electric Vehicles ({totalCount})
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Filter by range, price, and drivetrain. Save the URL to share.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                Compare ({compareIds.length}/3)
              </div>
              {limitHit && (
                <span className="text-xs font-semibold text-rose-500">Max 3 vehicles</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <FilterSidebar
            filters={currentFilters}
            bodyTypes={bodyTypes}
            driveTypes={driveTypes}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Showing {vehicles.length} of {totalCount} vehicles
              </div>
              <div className="min-w-55">
                <SortDropdown
                  value={sortValue}
                  onChange={(value) => updateSearchParams({ sort: value }, { resetPage: true })}
                />
              </div>
            </div>

            {vehicles.length === 0 ? (
              <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60">
                <div className="text-5xl"><Search className="w-12 h-12 text-slate-400 dark:text-slate-500" /></div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                  No vehicles found
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try widening your filters or clearing the search term.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    showCompare
                    isCompared={compareIds.includes(vehicle.id)}
                    onCompareToggle={(checked) => handleCompareToggle(vehicle.id, checked)}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="rounded-full border border-slate-200/70 px-3 py-1 disabled:opacity-40 dark:border-slate-700/70"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="rounded-full border border-slate-200/70 px-3 py-1 disabled:opacity-40 dark:border-slate-700/70"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <CompareBar
        selectedVehicles={selectedVehicles}
        onRemove={(id) => handleCompareToggle(id, false)}
        onClear={() => setCompareIds([])}
      />
    </main>
  );
}
