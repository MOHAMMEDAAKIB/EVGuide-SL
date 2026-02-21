'use client';

import { Vehicle, RangeAnalysis, RouteData, StationWithDistance } from '@/types';
import { Map, Marker, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface RouteResultsProps {
  vehicle: Vehicle;
  rangeAnalysis: RangeAnalysis;
  routeData: RouteData;
  nearbyStations: StationWithDistance[];
  originName: string;
  destinationName: string;
  startingChargePercent: number;
}

export default function RouteResults({
  vehicle,
  rangeAnalysis,
  routeData,
  nearbyStations,
  originName,
  destinationName,
  startingChargePercent,
}: RouteResultsProps) {
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const origin = routeData.polyline[0];
  const destination = routeData.polyline[routeData.polyline.length - 1];

  // Calculate map center (midpoint)
  const center = {
    lat: (origin.lat + destination.lat) / 2,
    lng: (origin.lng + destination.lng) / 2,
  };

  return (
    <div className="space-y-6">
      {/* Feasibility Verdict */}
      <div
        className={`rounded-2xl border p-8 ${
          rangeAnalysis.feasible
            ? 'border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-emerald-50/50 dark:border-emerald-500/30 dark:from-emerald-900/20 dark:via-slate-900 dark:to-emerald-900/10'
            : 'border-red-200 bg-linear-to-br from-red-50 via-white to-red-50/50 dark:border-red-500/30 dark:from-red-900/20 dark:via-slate-900 dark:to-red-900/10'
        }`}
      >
        <div className="flex items-start gap-6">
          <div
            className={`${rangeAnalysis.feasible ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {rangeAnalysis.feasible ? <CheckCircle className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
          </div>
          <div className="flex-1">
            <h2
              className={`text-3xl font-bold mb-2 ${
                rangeAnalysis.feasible
                  ? 'text-emerald-900 dark:text-emerald-300'
                  : 'text-red-900 dark:text-red-300'
              }`}
            >
              {rangeAnalysis.feasible
                ? 'YES! You can make this trip'
                : 'Not feasible without charging'}
            </h2>
            <p
              className={`text-lg ${
                rangeAnalysis.feasible
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              }`}
            >
              {rangeAnalysis.feasible
                ? `You'll arrive with ${rangeAnalysis.remainingRangeKm} km (${rangeAnalysis.remainingPercent}%) remaining.`
                : `You need ${rangeAnalysis.distanceKm} km but only have ${Math.round(
                    (vehicle.range_sl_estimate * startingChargePercent) / 100
                  )} km available. Check charging stations below.`}
            </p>
          </div>
        </div>

        {/* Energy Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg bg-white/50 p-4 dark:bg-slate-800/50">
            <div className="text-sm text-slate-600 dark:text-slate-400">Distance</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {routeData.distance} km
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500">
              ~{routeData.duration} minutes
            </div>
          </div>

          <div className="rounded-lg bg-white/50 p-4 dark:bg-slate-800/50">
            <div className="text-sm text-slate-600 dark:text-slate-400">Energy Required</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {rangeAnalysis.energyRequiredKm} km
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500">of range</div>
          </div>

          <div className="rounded-lg bg-white/50 p-4 dark:bg-slate-800/50">
            <div className="text-sm text-slate-600 dark:text-slate-400">Remaining Charge</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {rangeAnalysis.remainingRangeKm} km
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500">
              {rangeAnalysis.remainingPercent}% battery
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🗺️</span> Route Map
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {originName} → {destinationName}
          </p>
        </div>

        <div className="h-96 w-full">
          <Map
            defaultCenter={center}
            defaultZoom={9}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID'}
            gestureHandling="greedy"
          >
            {/* Route Polyline - Note: Polyline rendering requires additional setup */}
            {/* TODO: Implement polyline using google.maps.Polyline directly */}

            {/* Origin Marker */}
            <Marker
              position={origin}
              label={{
                text: 'A',
                color: 'white',
                fontWeight: 'bold',
              }}
              title={`Start: ${originName} (${startingChargePercent}% charge)`}
            />

            {/* Destination Marker */}
            <Marker
              position={destination}
              label={{
                text: 'B',
                color: 'white',
                fontWeight: 'bold',
              }}
              title={`End: ${destinationName} (${rangeAnalysis.remainingPercent}% charge)`}
            />

            {/* Charging Station Markers */}
            {nearbyStations.map((station) => (
              <AdvancedMarker
                key={station.id}
                position={{ lat: station.latitude, lng: station.longitude }}
                onClick={() => setSelectedStation(station.id)}
              >
                <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg cursor-pointer shadow-lg hover:scale-110 transition">
                  ⚡
                </div>

                {selectedStation === station.id && (
                  <InfoWindow
                    position={{ lat: station.latitude, lng: station.longitude }}
                    onCloseClick={() => setSelectedStation(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h4 className="font-bold text-slate-900">{station.name}</h4>
                      <p className="text-sm text-slate-600">{station.operator}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {station.distanceFromOrigin} km from start
                      </p>
                      <p className="text-xs text-emerald-600 font-medium mt-1">
                        {station.power_output_kw} kW • {station.charging_type}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </AdvancedMarker>
            ))}
          </Map>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">Note:</span> Range calculations are estimates based on
          ideal conditions. Actual range may vary with speed, terrain, weather, and driving style.
          Always maintain a safety buffer of 20%.
        </div>
      </div>

      {/* Charging Stations List */}
      {nearbyStations.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Charging Stations Along Route ({nearbyStations.length})
          </h3>

          <div className="space-y-3">
            {nearbyStations.map((station) => (
              <div
                key={station.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-orange-300 hover:bg-orange-50 transition dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-500/30 dark:hover:bg-orange-900/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {station.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {station.operator} • {station.address}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {station.connector_types.map((type) => (
                        <span
                          key={type}
                          className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                          {type}
                        </span>
                      ))}
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {station.power_output_kw} kW
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          station.status === 'available'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {station.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {station.distanceFromOrigin} km
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">from start</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {nearbyStations.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-slate-600 dark:text-slate-400">
            No charging stations found along this route. Consider a different route or check nearby
            areas.
          </p>
        </div>
      )}
    </div>
  );
}
