'use client';

import { useState } from 'react';
import { ChargingStation } from '@/types/database';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import ChargingStationForm from '@/components/admin/ChargingStationForm';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useRouter } from 'next/navigation';

interface ChargingStationManagementClientProps {
  initialStations: ChargingStation[];
}

export default function ChargingStationManagementClient({
  initialStations,
}: ChargingStationManagementClientProps) {
  const [stations, setStations] = useState<ChargingStation[]>(initialStations);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<ChargingStation | null>(null);
  const [deletingStation, setDeletingStation] = useState<ChargingStation | null>(null);
  const router = useRouter();

  const filteredStations = stations.filter((station) =>
    `${station.name} ${station.operator} ${station.address}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingStation(null);
    setIsFormOpen(true);
  };

  const handleEdit = (station: ChargingStation) => {
    setEditingStation(station);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingStation) return;

    try {
      const response = await fetch(`/api/admin/charging-stations/${deletingStation.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete charging station');
      }

      setStations(stations.filter((s) => s.id !== deletingStation.id));
      setDeletingStation(null);
      router.refresh();
    } catch (error) {
      console.error('Error deleting charging station:', error);
      alert('Failed to delete charging station. Please try again.');
    }
  };

  const handleFormSuccess = (station: ChargingStation) => {
    if (editingStation) {
      setStations(stations.map((s) => (s.id === station.id ? station : s)));
    } else {
      setStations([station, ...stations]);
    }
    setIsFormOpen(false);
    setEditingStation(null);
    router.refresh();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                     text-white rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Station
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Operator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Power (kW)
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
                {filteredStations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No stations found matching your search.' : 'No stations yet. Add your first station!'}
                    </td>
                  </tr>
                ) : (
                  filteredStations.map((station) => (
                    <tr key={station.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {station.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {station.operator}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {station.address}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {station.power_output_kw} kW
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          station.status === 'available'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : station.status === 'maintenance'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {station.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(station)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          <Edit className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => setDeletingStation(station)}
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
      </div>

      {isFormOpen && (
        <ChargingStationForm
          station={editingStation}
          onClose={() => {
            setIsFormOpen(false);
            setEditingStation(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {deletingStation && (
        <ConfirmDialog
          isOpen={!!deletingStation}
          title="Delete Charging Station"
          message={`Are you sure you want to delete ${deletingStation.name}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingStation(null)}
          confirmText="Delete"
          danger
        />
      )}
    </>
  );
}
