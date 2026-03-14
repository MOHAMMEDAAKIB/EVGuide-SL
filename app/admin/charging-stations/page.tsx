import { createServerSupabaseClient } from '@/lib/supabase-server';
import ChargingStationManagementClient from './ChargingStationManagementClient';

export default async function ChargingStationsAdminPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all charging stations
  const { data: stations, error } = await supabase
    .from('charging_stations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching charging stations:', error);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Charging Station Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage EV charging infrastructure across Sri Lanka
        </p>
      </div>

      <ChargingStationManagementClient initialStations={stations || []} />
    </div>
  );
}
