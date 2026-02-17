import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Vehicle, ChargingStation } from '@/types';
import RoutePlannerClient from './RoutePlannerClient';

export const metadata: Metadata = {
  title: 'EV Route Planner - EVGuide SL',
  description:
    'Check if your electric vehicle can complete journeys across Sri Lanka. Calculate range, find charging stations, and plan your EV trips with confidence.',
  keywords: [
    'EV route planner',
    'electric vehicle',
    'Sri Lanka',
    'charging stations',
    'EV range',
    'journey planner',
  ],
};

interface RoutePlannerPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// Fetch all vehicles for dropdown
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

// Fetch all public charging stations
async function getChargingStations(): Promise<ChargingStation[]> {
  try {
    const { data, error } = await supabase
      .from('charging_stations')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'available')
      .order('name', { ascending: true });

    if (error) throw error;

    return (data as ChargingStation[]) || [];
  } catch (error) {
    console.error('Error fetching charging stations:', error);
    return [];
  }
}

export default async function RoutePlannerPage({ searchParams }: RoutePlannerPageProps) {
  // Fetch data
  const [vehicles, chargingStations] = await Promise.all([
    getVehicles(),
    getChargingStations(),
  ]);

  // Await and parse search params
  const params = searchParams ? await searchParams : {};
  const vehicleId = typeof params.vehicleId === 'string' ? params.vehicleId : undefined;
  const origin = typeof params.origin === 'string' ? params.origin : undefined;
  const destination = typeof params.destination === 'string' ? params.destination : undefined;
  const charge = typeof params.charge === 'string' ? parseInt(params.charge) : undefined;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <section className="border-b border-slate-200/70 bg-linear-to-br from-emerald-50 via-white to-white py-12 dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              Route Planning
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              🗺️ EV Route Feasibility Checker
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Plan your electric vehicle journey across Sri Lanka. Check if your EV can complete
              the trip, find charging stations along the way, and travel with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <RoutePlannerClient
              vehicles={vehicles}
              chargingStations={chargingStations}
              initialVehicleId={vehicleId}
              initialOriginId={origin}
              initialDestinationId={destination}
              initialCharge={charge}
            />
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-2">📍</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Set Your Journey
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose your starting point and destination from major Sri Lankan cities or search
                  for specific locations.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Select Your EV</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Pick your electric vehicle and set your current battery charge level to get
                  accurate range estimates.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Get Your Results
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  See if your EV can make the trip, view the route on a map, and find charging
                  stations along the way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
