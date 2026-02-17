'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatRange } from '@/lib/utils';

interface VehicleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (vehicleId: string) => void;
  currentVehicleIds: string[];
  replacingVehicleId?: string;
}

export default function VehicleSelector({
  isOpen,
  onClose,
  onSelect,
  currentVehicleIds,
  replacingVehicleId,
}: VehicleSelectorProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('make', { ascending: true })
        .order('model', { ascending: true });

      if (error) throw error;
      setVehicles(data as Vehicle[]);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    // Filter by search term
    const matchesSearch = searchTerm
      ? vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesSearch;
  });

  const isVehicleDisabled = (vehicleId: string) => {
    // Don't disable the vehicle being replaced
    if (vehicleId === replacingVehicleId) return false;
    // Disable vehicles already in comparison
    return currentVehicleIds.includes(vehicleId);
  };

  const handleSelect = (vehicleId: string) => {
    if (isVehicleDisabled(vehicleId)) return;
    onSelect(vehicleId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/95 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/95 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {replacingVehicleId ? 'Replace Vehicle' : 'Add Vehicle'}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by make or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
          />
        </div>

        {/* Vehicle Grid */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-900 dark:border-t-emerald-400"></div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No vehicles found matching "{searchTerm}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map((vehicle) => {
                const disabled = isVehicleDisabled(vehicle.id);
                
                return (
                  <button
                    key={vehicle.id}
                    onClick={() => handleSelect(vehicle.id)}
                    disabled={disabled}
                    className={`group relative overflow-hidden rounded-xl border text-left transition ${
                      disabled
                        ? 'cursor-not-allowed border-slate-300 bg-slate-100 opacity-50 dark:border-slate-700 dark:bg-slate-800'
                        : 'cursor-pointer border-slate-200 bg-white hover:border-emerald-500 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-400'
                    }`}
                  >
                    {/* Vehicle Image */}
                    <div className="relative h-36 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {vehicle.image_url ? (
                        <Image
                          src={vehicle.image_url}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-slate-400">
                          🚗
                        </div>
                      )}
                      {disabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900">
                            Already Selected
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Details */}
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {vehicle.year} • {vehicle.body_type}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(vehicle.price_lkr)}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {formatRange(vehicle.range_sl_estimate)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
