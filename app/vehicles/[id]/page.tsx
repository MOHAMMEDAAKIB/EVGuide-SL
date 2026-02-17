'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Vehicle } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/lib/utils';
import ImageGallery from '@/components/ImageGallery';
import SpecsTable from '@/components/SpecsTable';
import ChargingInfo from '@/components/ChargingInfo';
import FeaturesList from '@/components/FeaturesList';
import CTAButtons from '@/components/CTAButtons';
import SimilarVehicles from '@/components/SimilarVehicles';

export default function VehicleDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const vehicleId = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'charging' | 'features' | 'compare'>('specs');

  useEffect(() => {
    if (!vehicleId) {
      setError('Vehicle not found');
      setLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', vehicleId)
          .single();
        if (supabaseError) throw supabaseError;

        if (!data) {
          setError('Vehicle not found');
          return;
        }

        setVehicle(data as Vehicle);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-900 dark:border-t-emerald-400"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Vehicle Not Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error || 'The vehicle you are looking for does not exist.'}</p>
          <Link
            href="/vehicles"
            className="inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/vehicles"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              ← Back to Browse
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`rounded-lg px-4 py-2 transition ${
                  isSaved
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                ❤️ Save
              </button>
              <button
                onClick={() => setIsCompared(!isCompared)}
                className={`rounded-lg px-4 py-2 transition ${
                  isCompared
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                🔀 Compare
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section with Gallery */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-12">
          {/* Image Gallery */}
          <div className="lg:col-span-1">
            <ImageGallery
              images={vehicle.image_urls || [vehicle.image_url || '']}
              vehicleName={`${vehicle.make} ${vehicle.model}`}
            />
          </div>

          {/* Vehicle Info */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            {/* Title & Pricing */}
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                {vehicle.body_type} • {vehicle.drive_type} • {vehicle.seating_capacity} Seats
              </p>

              {/* Price Block */}
              <div className="mb-6 rounded-2xl border border-slate-200 bg-linear-to-br from-emerald-50 to-teal-50 p-6 dark:border-slate-700 dark:from-slate-800/50 dark:to-emerald-900/20">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Unregistered</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">
                  {formatCurrency(vehicle.price_lkr)}
                </p>
                {vehicle.price_registered_lkr && (
                  <>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Registered</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(vehicle.price_registered_lkr)}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Year Badge */}
            <div className="inline-block rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Year {vehicle.year}
            </div>
          </div>
        </div>

        {/* Key Specs Cards */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">🔋 Battery</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{vehicle.battery_kwh}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">kWh</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">⚡ Range (SL)</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{vehicle.range_sl_estimate}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">km</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">🏎️ Power</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{vehicle.motor_power_kw}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">kW</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">⏱️ 0-100</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {vehicle.acceleration_0_100 || '—'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">seconds</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-slate-200 dark:border-slate-700">
          {['specs', 'charging', 'features', 'compare'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'border-b-2 border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'specs' && <SpecsTable vehicle={vehicle} />}
          {activeTab === 'charging' && <ChargingInfo vehicle={vehicle} />}
          {activeTab === 'features' && <FeaturesList features={vehicle.features || []} />}
          {activeTab === 'compare' && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-900/50">
              <p className="text-center text-slate-600 dark:text-slate-400">
                Compare this vehicle with others by clicking the compare button above.
              </p>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <CTAButtons vehicleId={vehicle.id} vehicleName={`${vehicle.make} ${vehicle.model}`} />

        {/* Similar Vehicles */}
        <div className="mt-16">
          <SimilarVehicles
            currentVehicleId={vehicle.id}
            bodyType={vehicle.body_type}
            driveType={vehicle.drive_type}
            priceRange={{ low: vehicle.price_lkr * 0.8, high: vehicle.price_lkr * 1.2 }}
          />
        </div>
      </div>
    </main>
  );
}
