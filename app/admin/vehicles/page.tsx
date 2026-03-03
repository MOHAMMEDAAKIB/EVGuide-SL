import { createServerSupabaseClient } from '@/lib/supabase-server';
import VehicleManagementClient from './VehicleManagementClient';

export default async function VehiclesAdminPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all vehicles
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching vehicles:', error);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Vehicle Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add, edit, and manage electric vehicles in your inventory
        </p>
      </div>

      <VehicleManagementClient initialVehicles={vehicles || []} />
    </div>
  );
}
