'use client';

import { useEffect, useState } from 'react';

export interface SearchFilters {
  searchTerm: string;
  priceRange: number;
  minRange: number;
}

interface QuickSearchBarProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export default function QuickSearchBar({ onFilterChange }: QuickSearchBarProps) {
  const storageKey = 'quickSearchOpenV2';
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(20000000); 
  const [minRange, setMinRange] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const minRangeLabel = minRange === 0 ? 'Any range' : `>= ${minRange}km`;

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'true' || stored === 'false') {
      setIsOpen(stored === 'true');
    } else {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, String(isOpen));
  }, [isOpen]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange({ searchTerm: value, priceRange, minRange });
  };

  const handlePriceChange = (value: number) => {
    setPriceRange(value);
    onFilterChange({ searchTerm, priceRange: value, minRange });
  };

  const handleRangeFilter = (range: number) => {
    setMinRange(range);
    onFilterChange({ searchTerm, priceRange, minRange: range });
  };

  return (
    <section className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-2xl border border-slate-200/70 bg-linear-to-br from-white via-white to-slate-50/70 p-6 ring-1 ring-slate-900/5 shadow-sm dark:border-slate-800/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950/40 dark:ring-white/5 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Refine your search</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set budget and range preferences
              </p>
            </div>
          </div>

          <div
            id="quick-search-panel"
            className={`grid gap-6 overflow-hidden pt-6 transition-all duration-300 ease-out ${
              isOpen
                ? 'max-h-160 opacity-100'
                : 'pointer-events-none max-h-0 opacity-0'
            }`}
          >
            {/* Search Input */}
            <div>
              <label
                htmlFor="search"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                Search by make or model
              </label>
              <input
                id="search"
                type="text"
                placeholder="e.g., Tesla, BYD, Nissan Leaf..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-100"
              />
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="price-range"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  Price Range
                </label>
                <span className="rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Up to Rs. {(priceRange / 1_000_000).toFixed(1)}M
                </span>
              </div>
              <input
                id="price-range"
                type="range"
                min="0"
                max="20000000"
                step="500000"
                value={priceRange}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-emerald-500 dark:bg-slate-700"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Rs. 0</span>
                <span>Rs. 20M</span>
              </div>
            </div>

            {/* Range Filter Buttons */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Minimum Range
                </label>
                <span className="rounded-full border border-slate-200/70 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-200">
                  {minRangeLabel}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleRangeFilter(0)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    minRange === 0
                      ? 'border-emerald-500/60 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleRangeFilter(200)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    minRange === 200
                      ? 'border-emerald-500/60 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  &gt;200km
                </button>
                <button
                  onClick={() => handleRangeFilter(300)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    minRange === 300
                      ? 'border-emerald-500/60 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  &gt;300km
                </button>
                <button
                  onClick={() => handleRangeFilter(400)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    minRange === 400
                      ? 'border-emerald-500/60 bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'border-slate-200/70 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  &gt;400km
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="quick-search-panel"
              aria-label={isOpen ? 'Collapse filters' : 'Expand filters'}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span className="inline-flex items-center gap-2">
                {isOpen ? 'Hide filters' : 'Show filters'}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 7.72a.75.75 0 0 1 1.06 0L10 11.44l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.78a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
