import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types';
import ComparisonClient from './ComparisonClient';
import Link from 'next/link';

interface ComparePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const idsParam = params?.ids;

  // Parse vehicle IDs from query string
  const vehicleIds = typeof idsParam === 'string' 
    ? idsParam.split(',').filter(id => id.trim())
    : [];

  // Validate: need at least 2 vehicles and max 3
  if (vehicleIds.length < 2) {
    redirect('/vehicles');
  }

  if (vehicleIds.length > 3) {
    // Trim to first 3 IDs
    redirect(`/compare?ids=${vehicleIds.slice(0, 3).join(',')}`);
  }

  // Fetch vehicles from database
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .in('id', vehicleIds);

  if (error) {
    console.error('Error fetching vehicles for comparison:', error);
    return <ErrorView message="Failed to load vehicles for comparison" />;
  }

  const vehicles = (data as Vehicle[]) || [];

  // Validate: ensure we got the vehicles we requested
  if (vehicles.length < 2) {
    return <ErrorView message="One or more vehicles not found" />;
  }

  // Sort vehicles to match the order of IDs in the URL
  const sortedVehicles = vehicleIds
    .map(id => vehicles.find(v => v.id === id))
    .filter((v): v is Vehicle => v !== undefined);

  if (sortedVehicles.length < 2) {
    return <ErrorView message="One or more vehicles not found" />;
  }

  return <ComparisonClient vehicles={sortedVehicles} />;
}

function ErrorView({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 text-6xl">⚠️</div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Cannot Compare Vehicles
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {message}. Please select 2-3 vehicles from the browse page.
        </p>
        <Link
          href="/vehicles"
          className="inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          Browse Vehicles
        </Link>
      </div>
    </main>
  );
}
