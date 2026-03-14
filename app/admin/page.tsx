import { createServerSupabaseClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { Car, Zap, DollarSign, Plus, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  // Fetch counts for all tables
  const [vehiclesCount, stationsCount, fuelPricesCount] = await Promise.all([
    supabase.from('vehicles').select('*', { count: 'exact', head: true }),
    supabase.from('charging_stations').select('*', { count: 'exact', head: true }),
    supabase.from('fuel_prices').select('*', { count: 'exact', head: true }),
  ]);

  // Fetch recent additions
  const { data: recentVehicles } = await supabase
    .from('vehicles')
    .select('make, model, year, created_at')
    .order('created_at', { ascending: false })
    .limit(5) as { data: Array<{ make: string; model: string; year: number; created_at: string }> | null };

  const { data: recentStations } = await supabase
    .from('charging_stations')
    .select('name, operator, created_at')
    .order('created_at', { ascending: false })
    .limit(5) as { data: Array<{ name: string; operator: string; created_at: string }> | null };

  const stats = [
    {
      title: 'Total Vehicles',
      value: vehiclesCount.count || 0,
      icon: Car,
      color: 'bg-blue-500',
      href: '/admin/vehicles',
    },
    {
      title: 'Charging Stations',
      value: stationsCount.count || 0,
      icon: Zap,
      color: 'bg-green-500',
      href: '/admin/charging-stations',
    },
    {
      title: 'Fuel Prices',
      value: fuelPricesCount.count || 0,
      icon: DollarSign,
      color: 'bg-orange-500',
      href: '/admin/fuel-prices',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to the EVGuide admin panel. Manage your EV inventory and charging infrastructure.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 
                       hover:shadow-md transition-shadow duration-200
                       border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/vehicles"
            className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 
                     text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 
                     dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Vehicle</span>
          </Link>
          <Link
            href="/admin/charging-stations"
            className="flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 
                     text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 
                     dark:hover:bg-green-900/30 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Station</span>
          </Link>
          <Link
            href="/admin/fuel-prices"
            className="flex items-center gap-3 px-4 py-3 bg-orange-50 dark:bg-orange-900/20 
                     text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 
                     dark:hover:bg-orange-900/30 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Update Fuel Price</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vehicles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Vehicles
            </h2>
          </div>
          <div className="space-y-3">
            {recentVehicles && recentVehicles.length > 0 ? (
              recentVehicles.map((vehicle, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Year: {vehicle.year}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(vehicle.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No vehicles added yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Charging Stations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Stations
            </h2>
          </div>
          <div className="space-y-3">
            {recentStations && recentStations.length > 0 ? (
              recentStations.map((station, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {station.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {station.operator}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(station.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No charging stations added yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
