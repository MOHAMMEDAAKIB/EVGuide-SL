import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types';
import Image from "next/image";

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

export default async function Home() {
  const vehicles = await getVehicles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Electric Vehicle
            </h1>
            <p className="text-lg md:text-xl text-green-50 mb-8">
              Compare EVs with real Sri Lankan data. Understand costs. Make the right choice.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                Browse EVs
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
                Calculate Savings
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Popular EVs in Sri Lanka
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {vehicles.length > 0 
              ? `${vehicles.length} vehicles available with real-world range estimates`
              : 'Connect to Supabase to see vehicles'}
          </p>
        </div>

        {/* Vehicle Grid */}
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Vehicle Image */}
                <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
                  {vehicle.image_url ? (
                    <Image
                      src={vehicle.image_url}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Vehicle Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {vehicle.body_type} • {vehicle.year}
                  </p>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <p className="text-xs text-green-700 dark:text-green-400 font-medium">Range (SL)</p>
                      <p className="text-lg font-bold text-green-900 dark:text-green-300">
                        {vehicle.range_sl_estimate} km
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Battery</p>
                      <p className="text-lg font-bold text-blue-900 dark:text-blue-300">
                        {vehicle.battery_kwh} kWh
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Starting from</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      Rs. {(vehicle.price_lkr / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-200 mb-2">
              Supabase Not Connected
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 mb-4">
              Add your Supabase credentials to .env.local to see vehicles
            </p>
            <ol className="text-left max-w-md mx-auto space-y-2 text-yellow-800 dark:text-yellow-200">
              <li>1. Create a Supabase project at supabase.com</li>
              <li>2. Run the SQL in supabase-schema.sql</li>
              <li>3. Add your credentials to .env.local</li>
              <li>4. Restart the dev server</li>
            </ol>
          </div>
        )}
      </main>
    </div>
  );
}
