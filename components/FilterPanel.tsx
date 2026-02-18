'use client';

import { useState } from 'react';

export interface FilterOptions {
  priceRange: [number, number];
  bodyTypes: string[];
  brands: string[];
  range: [number, number];
  batteryCapacity: [number, number];
  available: boolean;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onReset: () => void;
  variant?: 'sidebar' | 'modal';
  onClose?: () => void;
}

const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Crossover', 'Pickup', 'Van'];
const POPULAR_BRANDS = ['BYD', 'MG', 'Nissan', 'Tesla', 'Hyundai', 'Audi', 'BMW', 'Mercedes-Benz'];

export default function FilterPanel({ 
  filters, 
  onChange, 
  onReset,
  variant = 'sidebar',
  onClose 
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handlePriceChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localFilters.priceRange] as [number, number];
    newRange[index] = value;
    const updated = { ...localFilters, priceRange: newRange };
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localFilters.range] as [number, number];
    newRange[index] = value;
    const updated = { ...localFilters, range: newRange };
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleBatteryChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localFilters.batteryCapacity] as [number, number];
    newRange[index] = value;
    const updated = { ...localFilters, batteryCapacity: newRange };
    setLocalFilters(updated);
    onChange(updated);
  };

  const toggleBodyType = (type: string) => {
    const updated = {
      ...localFilters,
      bodyTypes: localFilters.bodyTypes.includes(type)
        ? localFilters.bodyTypes.filter((t) => t !== type)
        : [...localFilters.bodyTypes, type],
    };
    setLocalFilters(updated);
    onChange(updated);
  };

  const toggleBrand = (brand: string) => {
    const updated = {
      ...localFilters,
      brands: localFilters.brands.includes(brand)
        ? localFilters.brands.filter((b) => b !== brand)
        : [...localFilters.brands, brand],
    };
    setLocalFilters(updated);
    onChange(updated);
  };

  const toggleAvailability = () => {
    const updated = { ...localFilters, available: !localFilters.available };
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleReset = () => {
    onReset();
    setLocalFilters(filters);
  };

  const content = (
    <div className="space-y-6">
      {/* Header (for modal variant) */}
      {variant === 'modal' && (
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Close filters"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Price Range (LKR)
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Rs. {localFilters.priceRange[0].toLocaleString()}</span>
            <span>Rs. {localFilters.priceRange[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="30000000"
            step="500000"
            value={localFilters.priceRange[0]}
            onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min="0"
            max="30000000"
            step="500000"
            value={localFilters.priceRange[1]}
            onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Range (km)
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{localFilters.range[0]} km</span>
            <span>{localFilters.range[1]} km</span>
          </div>
          <input
            type="range"
            min="0"
            max="800"
            step="50"
            value={localFilters.range[0]}
            onChange={(e) => handleRangeChange(0, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
            aria-label="Minimum range"
          />
          <input
            type="range"
            min="0"
            max="800"
            step="50"
            value={localFilters.range[1]}
            onChange={(e) => handleRangeChange(1, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
            aria-label="Maximum range"
          />
        </div>
      </div>

      {/* Battery Capacity */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Battery Capacity (kWh)
        </label>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{localFilters.batteryCapacity[0]} kWh</span>
            <span>{localFilters.batteryCapacity[1]} kWh</span>
          </div>
          <input
            type="range"
            min="0"
            max="150"
            step="5"
            value={localFilters.batteryCapacity[0]}
            onChange={(e) => handleBatteryChange(0, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
            aria-label="Minimum battery capacity"
          />
          <input
            type="range"
            min="0"
            max="150"
            step="5"
            value={localFilters.batteryCapacity[1]}
            onChange={(e) => handleBatteryChange(1, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
            aria-label="Maximum battery capacity"
          />
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Body Type
        </label>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleBodyType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                localFilters.bodyTypes.includes(type)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Brand
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {POPULAR_BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localFilters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Available in Sri Lanka
          </span>
          <input
            type="checkbox"
            checked={localFilters.available}
            onChange={toggleAvailability}
            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </label>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
      >
        Reset Filters
      </button>

      {/* Apply Button (for modal variant) */}
      {variant === 'modal' && (
        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          Apply Filters
        </button>
      )}
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="p-6">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Filters</h2>
      {content}
    </div>
  );
}
