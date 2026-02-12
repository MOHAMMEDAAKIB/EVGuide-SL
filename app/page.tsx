import { supabase } from '@/lib/supabase';
import { Vehicle, ChargingStation } from '@/types';
import HomePageClient from '@/components/HomePageClient';

async function getVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('price_lkr', { ascending: true });
  
  if (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
  
  return data || [];
}

async function getChargingStations(): Promise<ChargingStation[]> {
  const { data, error } = await supabase
    .from('charging_stations')
    .select('*');
  
  if (error) {
    console.error('Error fetching charging stations:', error);
    return [];
  }
  
  return data || [];
}

export default async function Home() {
  const [vehicles, chargingStations] = await Promise.all([
    getVehicles(),
    getChargingStations(),
  ]);

  return (
    <HomePageClient 
      vehicles={vehicles}
      vehicleCount={vehicles.length}
      chargerCount={chargingStations.length}
    />
  );
}
