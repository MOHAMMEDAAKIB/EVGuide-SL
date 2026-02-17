'use client';

import { useEffect, useState } from 'react';

export interface VehicleFilters {
  search: string;
  priceMin: number | null;
  priceMax: number | null;
  rangeMin: number | null;
  rangeMax: number | null;
  body: string;
  drive: string;
}

interface FilterSidebarProps {
  filters: VehicleFilters;
  bodyTypes: string[];
  driveTypes: string[];
  onFilterChange: (next: Partial<VehicleFilters>, options?: { resetPage?: boolean }) => void;
  onClear: () => void;
}

export default function FilterSidebar({
  filters,
  bodyTypes,
  driveTypes,
  onFilterChange,
  onClear,
}: FilterSidebarProps) {
  const [searchDraft, setSearchDraft] = useState(filters.search);

  useEffect(() => {
    setSearchDraft(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (searchDraft === filters.search) {
      return;
    }
    const timer = setTimeout(() => {
      onFilterChange({ search: searchDraft }, { resetPage: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search, onFilterChange, searchDraft]);

  const handleNumberInput = (
    key: keyof Pick<VehicleFilters, 'priceMin' | 'priceMax' | 'rangeMin' | 'rangeMax'>,
    value: string
  ) => {
    const parsed = value === '' ? null : Number(value);
    onFilterChange({ [key]: Number.isFinite(parsed) ? parsed : null } as Partial<VehicleFilters>, {
      resetPage: true,
    });
  };

  return (
    <aside className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Filters</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Refine by budget and specs</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
        >
          Clear
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Search
          </label>
          <input
            type="text"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Make or model"
            className="w-full rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Price (LKR)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min={0}
              value={filters.priceMin ?? ''}
              onChange={(event) => handleNumberInput('priceMin', event.target.value)}
              placeholder="Min"
              className="w-full rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100"
            />
            <input
              type="number"
              min={0}
              value={filters.priceMax ?? ''}
              onChange={(event) => handleNumberInput('priceMax', event.target.value)}
              placeholder="Max"
              className="w-full rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Range (km)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min={0}
              value={filters.rangeMin ?? ''}
              onChange={(event) => handleNumberInput('rangeMin', event.target.value)}
              placeholder="Min"
              className="w-full rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100"
            />
            <input
              type="number"
              min={0}
              value={filters.rangeMax ?? ''}
              onChange={(event) => handleNumberInput('rangeMax', event.target.value)}
              placeholder="Max"
              className="w-full rounded-xl border border-slate-200/80 bg-white/90 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Body Type
          </label>
          <div className="flex flex-wrap gap-2">
            {['All', ...bodyTypes].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  onFilterChange({ body: type === 'All' ? '' : type }, { resetPage: true })
                }
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  filters.body === (type === 'All' ? '' : type)
                    ? 'border-emerald-500/60 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Drive Type
          </label>
          <div className="flex flex-wrap gap-2">
            {['All', ...driveTypes].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  onFilterChange({ drive: type === 'All' ? '' : type }, { resetPage: true })
                }
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  filters.drive === (type === 'All' ? '' : type)
                    ? 'border-emerald-500/60 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
