'use client';

import { useState } from 'react';

export interface SearchFilters {
  searchTerm: string;
  priceRange: number;
  minRange: number;
}

interface QuickSearchBarProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export default function QuickSearchBar({ onFilterChange }: QuickSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(20000000); // 20M LKR default max
  const [minRange, setMinRange] = useState(0);

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
    <section className="bg-white dark:bg-slate-800 py-8 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search by make or model
            </label>
            <input
              id="search"
              type="text"
              placeholder="e.g., Tesla, BYD, Nissan Leaf..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Price Range Slider */}
          <div>
            <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price Range: <span className="text-green-600 dark:text-green-500 font-semibold">
                Up to Rs. {(priceRange / 1_000_000).toFixed(1)}M
              </span>
            </label>
            <input
              id="price-range"
              type="range"
              min="0"
              max="20000000"
              step="500000"
              value={priceRange}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Rs. 0</span>
              <span>Rs. 20M</span>
            </div>
          </div>

          {/* Range Filter Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Range
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRangeFilter(0)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  minRange === 0
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleRangeFilter(200)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  minRange === 200
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                &gt;200km
              </button>
              <button
                onClick={() => handleRangeFilter(300)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  minRange === 300
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                &gt;300km
              </button>
              <button
                onClick={() => handleRangeFilter(400)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  minRange === 400
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                &gt;400km
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
