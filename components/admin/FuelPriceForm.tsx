'use client';

import { useState } from 'react';
import { FuelPrice } from '@/types/database';
import { X } from 'lucide-react';

interface FuelPriceFormProps {
  fuelPrice: FuelPrice | null;
  onClose: () => void;
  onSuccess: (fuelPrice: FuelPrice) => void;
}

export default function FuelPriceForm({
  fuelPrice,
  onClose,
  onSuccess,
}: FuelPriceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      fuel_type: formData.get('fuel_type') as string,
      price_lkr: parseFloat(formData.get('price_lkr') as string),
      effective_date: formData.get('effective_date') as string,
      is_active: formData.get('is_active') === 'true',
    };

    try {
      const url = fuelPrice
        ? `/api/admin/fuel-prices/${fuelPrice.id}`
        : '/api/admin/fuel-prices';
      const method = fuelPrice ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save fuel price');
      }

      const savedPrice = await response.json();
      onSuccess(savedPrice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for the date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {fuelPrice ? 'Edit Fuel Price' : 'Add New Fuel Price'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                name="fuel_type"
                required
                defaultValue={fuelPrice?.fuel_type}
                disabled= {!!fuelPrice}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select...</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
              </select>
              {fuelPrice && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Fuel type cannot be changed when editing
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price per Liter (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price_lkr"
                required
                min="0"
                step="0.01"
                defaultValue={fuelPrice?.price_lkr}
                placeholder="350.00"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Effective Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="effective_date"
                required
                defaultValue={fuelPrice?.effective_date || today}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="is_active"
                required
                defaultValue={fuelPrice?.is_active !== undefined ? String(fuelPrice.is_active) : 'true'}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Setting this as active will deactivate other prices for the same fuel type
              </p>
            </div>

            <div className="flex gap-3 justify-end border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 
                         hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : fuelPrice ? 'Update Price' : 'Add Price'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
