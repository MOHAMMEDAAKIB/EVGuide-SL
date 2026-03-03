import { createServerSupabaseClient } from '@/lib/supabase-server';
import FuelPriceManagementClient from './FuelPriceManagementClient';

export default async function FuelPricesAdminPage() {
  const supabase = await createServerSupabaseClient();

  // Fetch all fuel prices
  const { data: fuelPrices, error } = await supabase
    .from('fuel_prices')
    .select('*')
    .order('effective_date', { ascending: false });

  if (error) {
    console.error('Error fetching fuel prices:', error);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Fuel Price Management
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Update fuel prices for TCO calculations
        </p>
      </div>

      <FuelPriceManagementClient initialFuelPrices={fuelPrices || []} />
    </div>
  );
}
