import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Vehicle, FuelPrice } from '@/types';
import TCOCalculatorClient from './TCOCalculatorClient';

export const metadata: Metadata = {
  title: 'TCO Calculator - EVGuide SL',
  description: 'Calculate the Total Cost of Ownership for electric vehicles vs petrol/diesel cars in Sri Lanka. Compare fuel costs, maintenance, insurance, and see your 5-year savings.',
  keywords: ['EV calculator', 'TCO', 'electric vehicle cost', 'Sri Lanka', 'fuel savings', 'EV savings'],
};

interface TCOCalculatorPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// Get fuel prices from database
async function getFuelPrices(): Promise<{ petrol: number; diesel: number }> {
  try {
    const { data, error } = await supabase
      .from('fuel_prices')
      .select('fuel_type, price_lkr')
      .eq('is_active', true)
      .order('effective_date', { ascending: false });

    if (error) throw error;

    const fuelPrices = data as FuelPrice[];
    
    const petrolPrice = fuelPrices.find(p => p.fuel_type === 'petrol')?.price_lkr ?? 350;
    const dieselPrice = fuelPrices.find(p => p.fuel_type === 'diesel')?.price_lkr ?? 320;

    return {
      petrol: petrolPrice,
      diesel: dieselPrice,
    };
  } catch (error) {
    console.error('Error fetching fuel prices:', error);
    // Return default values if database fetch fails
    return {
      petrol: 350,
      diesel: 320,
    };
  }
}

// Get all vehicles for dropdown
async function getVehicles(): Promise<Vehicle[]> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('make', { ascending: true })
      .order('model', { ascending: true });

    if (error) throw error;

    return (data as Vehicle[]) || [];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }
}

// Get specific vehicle if vehicleId is provided
async function getVehicleById(vehicleId: string): Promise<Vehicle | null> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (error) throw error;

    return data as Vehicle;
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return null;
  }
}

export default async function TCOCalculatorPage({ searchParams }: TCOCalculatorPageProps) {
  const params = await searchParams;
  const vehicleIdParam = params?.vehicleId;
  const vehicleId = typeof vehicleIdParam === 'string' ? vehicleIdParam : undefined;

  // Fetch data in parallel
  const [vehicles, fuelPrices, preselectedVehicle] = await Promise.all([
    getVehicles(),
    getFuelPrices(),
    vehicleId ? getVehicleById(vehicleId) : Promise.resolve(null),
  ]);

  if (vehicles.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center max-w-md px-4">
          <div className="mb-6 text-6xl">⚠️</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            No Vehicles Available
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Unable to load vehicle data. Please check your database connection.
          </p>
        </div>
      </main>
    );
  }

  return (
    <TCOCalculatorClient
      vehicles={vehicles}
      currentFuelPrices={fuelPrices}
      preselectedVehicle={preselectedVehicle}
    />
  );
}
