'use client';

import { useState, useEffect } from 'react';
import { Vehicle, RouteFormInputs, SLLocation } from '@/types';
import { SRI_LANKAN_LOCATIONS, searchLocations } from '@/lib/locations';
import { Zap, Loader2 } from 'lucide-react';

interface RoutePlannerFormProps {
  vehicles: Vehicle[];
  initialValues?: Partial<RouteFormInputs>;
  onCalculate: (inputs: RouteFormInputs) => void;
  isCalculating?: boolean;
}

export default function RoutePlannerForm({
  vehicles,
  initialValues,
  onCalculate,
  isCalculating = false,
}: RoutePlannerFormProps) {
  const [origin, setOrigin] = useState<SLLocation | null>(initialValues?.origin || null);
  const [destination, setDestination] = useState<SLLocation | null>(initialValues?.destination || null);
  const [vehicleId, setVehicleId] = useState<string>(initialValues?.vehicleId || '');
  const [startingCharge, setStartingCharge] = useState<number>(
    initialValues?.startingChargePercent || 80
  );

  // Search states for location autocomplete
  const [originSearch, setOriginSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<SLLocation[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<SLLocation[]>([]);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // Update search when location is selected
  useEffect(() => {
    if (origin) setOriginSearch(origin.name);
  }, [origin]);

  useEffect(() => {
    if (destination) setDestinationSearch(destination.name);
  }, [destination]);

  // Handle origin search
  const handleOriginSearch = (query: string) => {
    setOriginSearch(query);
    if (query.length > 0) {
      const results = searchLocations(query);
      setOriginSuggestions(results.slice(0, 5));
      setShowOriginDropdown(true);
    } else {
      setOriginSuggestions([]);
      setShowOriginDropdown(false);
    }
  };

  // Handle destination search
  const handleDestinationSearch = (query: string) => {
    setDestinationSearch(query);
    if (query.length > 0) {
      const results = searchLocations(query);
      setDestinationSuggestions(results.slice(0, 5));
      setShowDestinationDropdown(true);
    } else {
      setDestinationSuggestions([]);
      setShowDestinationDropdown(false);
    }
  };

  // Select origin
  const handleSelectOrigin = (location: SLLocation) => {
    setOrigin(location);
    setOriginSearch(location.name);
    setShowOriginDropdown(false);
  };

  // Select destination
  const handleSelectDestination = (location: SLLocation) => {
    setDestination(location);
    setDestinationSearch(location.name);
    setShowDestinationDropdown(false);
  };

  // Calculate button handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !destination || !vehicleId) {
      alert('Please fill in all fields');
      return;
    }

    onCalculate({
      origin,
      destination,
      vehicleId,
      startingChargePercent: startingCharge,
    });
  };

  // Get selected vehicle for display
  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Journey Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>🗺️</span> Your Journey
        </h3>

        <div className="space-y-4">
          {/* Origin Input */}
          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                value={originSearch}
                onChange={(e) => handleOriginSearch(e.target.value)}
                onFocus={() => {
                  if (originSuggestions.length > 0) setShowOriginDropdown(true);
                }}
                placeholder="Search or select a location"
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 pr-10 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
                aria-label="Origin location"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">📍</span>
            </div>

            {/* Origin Dropdown */}
            {showOriginDropdown && originSuggestions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {originSuggestions.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectOrigin(loc)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">{loc.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{loc.district}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Select Buttons for Origin */}
            <div className="mt-2 flex flex-wrap gap-2">
              {SRI_LANKAN_LOCATIONS.filter((l) => l.category === 'major')
                .slice(0, 4)
                .map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectOrigin(loc)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {loc.name.split(',')[0]}
                  </button>
                ))}
            </div>
          </div>

          {/* Destination Input */}
          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                value={destinationSearch}
                onChange={(e) => handleDestinationSearch(e.target.value)}
                onFocus={() => {
                  if (destinationSuggestions.length > 0) setShowDestinationDropdown(true);
                }}
                placeholder="Search or select a destination"
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 pr-10 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
                aria-label="Destination location"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">📍</span>
            </div>

            {/* Destination Dropdown */}
            {showDestinationDropdown && destinationSuggestions.length > 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {destinationSuggestions.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectDestination(loc)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="font-medium text-slate-900 dark:text-white">{loc.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{loc.district}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Select Buttons for Destination */}
            <div className="mt-2 flex flex-wrap gap-2">
              {SRI_LANKAN_LOCATIONS.filter((l) => l.category === 'major')
                .slice(4, 8)
                .map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => handleSelectDestination(loc)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {loc.name.split(',')[0]}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span>⚡</span> Select Vehicle
        </h3>

        <div className="space-y-4">
          {/* Vehicle Dropdown */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Electric Vehicle
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
              aria-label="Select electric vehicle"
            >
              <option value="">Choose a vehicle...</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.range_sl_estimate} km range)
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Info Display */}
          {selectedVehicle && (
            <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-emerald-900 dark:text-emerald-300">
                    {selectedVehicle.make} {selectedVehicle.model}
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-400">
                    {selectedVehicle.battery_kwh} kWh Battery
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedVehicle.range_sl_estimate} km
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-500">Full Range</div>
                </div>
              </div>
            </div>
          )}

          {/* Starting Charge Slider */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Starting Charge: {startingCharge}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={startingCharge}
              onChange={(e) => setStartingCharge(Number(e.target.value))}
              className="w-full accent-emerald-600"
              aria-label="Starting battery charge percentage"
            />
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-300"
                  style={{ width: `${startingCharge}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedVehicle
                  ? Math.round((selectedVehicle.range_sl_estimate * startingCharge) / 100)
                  : 0}{' '}
                km
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>10%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!origin || !destination || !vehicleId || isCalculating}
        className="w-full rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Calculating Route...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" /> Check Route
          </>
        )}
      </button>
    </form>
  );
}
