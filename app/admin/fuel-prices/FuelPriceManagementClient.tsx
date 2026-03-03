'use client';

import { useState } from 'react';
import { FuelPrice } from '@/types/database';
import { Plus, Edit, Trash2 } from 'lucide-react';
import FuelPriceForm from '@/components/admin/FuelPriceForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useRouter } from 'next/navigation';

interface FuelPriceManagementClientProps {
  initialFuelPrices: FuelPrice[];
}

export default function FuelPriceManagementClient({
  initialFuelPrices,
}: FuelPriceManagementClientProps) {
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>(initialFuelPrices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<FuelPrice | null>(null);
  const [deletingPrice, setDeletingPrice] = useState<FuelPrice | null>(null);
  const router = useRouter();

  const handleAdd = () => {
    setEditingPrice(null);
    setIsFormOpen(true);
  };

  const handleEdit = (price: FuelPrice) => {
    setEditingPrice(price);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingPrice) return;

    try {
      const response = await fetch(`/api/admin/fuel-prices/${deletingPrice.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete fuel price');
      }

      setFuelPrices(fuelPrices.filter((p) => p.id !== deletingPrice.id));
      setDeletingPrice(null);
      router.refresh();
    } catch (error) {
      console.error('Error deleting fuel price:', error);
      alert('Failed to delete fuel price. Please try again.');
    }
  };

  const handleFormSuccess = (price: FuelPrice) => {
    if (editingPrice) {
      setFuelPrices(fuelPrices.map((p) => (p.id === price.id ? price : p)));
    } else {
      setFuelPrices([price, ...fuelPrices]);
    }
    setIsFormOpen(false);
    setEditingPrice(null);
    router.refresh();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                     text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Fuel Price
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Fuel Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Price (LKR/L)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Effective Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {fuelPrices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No fuel prices yet. Add your first fuel price!
                    </td>
                  </tr>
                ) : (
                  fuelPrices.map((price) => (
                    <tr key={price.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-sm font-medium rounded-full capitalize
                                       bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          {price.fuel_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        LKR {price.price_lkr.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(price.effective_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          price.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {price.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(price)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          <Edit className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => setDeletingPrice(price)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Only one fuel type can be active at a time. Setting a new price as active will
            automatically deactivate other prices for the same fuel type.
          </p>
        </div>
      </div>

      {isFormOpen && (
        <FuelPriceForm
          fuelPrice={editingPrice}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPrice(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {deletingPrice && (
        <ConfirmDialog
          isOpen={!!deletingPrice}
          title="Delete Fuel Price"
          message={`Are you sure you want to delete this ${deletingPrice.fuel_type} price record? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPrice(null)}
          confirmText="Delete"
          danger
        />
      )}
    </>
  );
}
