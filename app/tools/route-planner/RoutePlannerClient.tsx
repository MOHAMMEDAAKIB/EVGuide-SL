'use client';

import { useState, useEffect } from 'react';
import { Vehicle, ChargingStation, RouteFormInputs, RouteData, RangeAnalysis } from '@/types';
import { getLocationById } from '@/lib/locations';
import {
  calculateRouteWithOSRM,
  calculateEVRangeConsumption,
  findChargingStationsAlongRoute,
  encodeRouteToURL,
  decodeRouteFromURL,
  StationWithDistance,
} from '@/lib/routeCalculations';
import RoutePlannerForm from '@/components/route-planner/RoutePlannerForm';
import RouteResults from '@/components/route-planner/RouteResults';
import GoogleMapsProvider from '@/components/route-planner/GoogleMapsProvider';

interface RoutePlannerClientProps {
  vehicles: Vehicle[];
  chargingStations: ChargingStation[];
  initialVehicleId?: string;
  initialOriginId?: string;
  initialDestinationId?: string;
  initialCharge?: number;
}

export default function RoutePlannerClient({
  vehicles,
  chargingStations,
  initialVehicleId,
  initialOriginId,
  initialDestinationId,
  initialCharge,
}: RoutePlannerClientProps) {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [rangeAnalysis, setRangeAnalysis] = useState<RangeAnalysis | null>(null);
  const [nearbyStations, setNearbyStations] = useState<StationWithDistance[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [formInputs, setFormInputs] = useState<RouteFormInputs | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    if (initialVehicleId && initialOriginId && initialDestinationId) {
      const origin = getLocationById(initialOriginId);
      const destination = getLocationById(initialDestinationId);
      const vehicle = vehicles.find((v) => v.id === initialVehicleId);

      if (origin && destination && vehicle) {
        const inputs: RouteFormInputs = {
          origin,
          destination,
          vehicleId: initialVehicleId,
          startingChargePercent: initialCharge || 80,
        };

        setFormInputs(inputs);
        // Auto-calculate on mount if params are present
        handleCalculate(inputs);
      }
    }
  }, [initialVehicleId, initialOriginId, initialDestinationId, initialCharge, vehicles]);

  // Handle route calculation
  const handleCalculate = async (inputs: RouteFormInputs) => {
    setIsCalculating(true);
    setFormInputs(inputs);

    try {
      // Find selected vehicle
      const vehicle = vehicles.find((v) => v.id === inputs.vehicleId);
      if (!vehicle) {
        alert('Vehicle not found');
        return;
      }

      setSelectedVehicle(vehicle);

      // Step 1: Calculate route with OSRM
      const route = await calculateRouteWithOSRM(
        { lat: inputs.origin!.lat, lng: inputs.origin!.lng },
        { lat: inputs.destination!.lat, lng: inputs.destination!.lng }
      );

      if (!route) {
        alert('Could not calculate route. Please try a different location.');
        setIsCalculating(false);
        return;
      }

      setRouteData(route);

      // Step 2: Calculate EV range consumption
      const analysis = calculateEVRangeConsumption(
        route.distance,
        vehicle,
        inputs.startingChargePercent
      );

      setRangeAnalysis(analysis);

      // Step 3: Find charging stations along route
      const stations = findChargingStationsAlongRoute(route.polyline, chargingStations, 5);

      setNearbyStations(stations);

      // Update URL with parameters
      const urlParams = encodeRouteToURL({
        originId: inputs.origin!.id,
        destinationId: inputs.destination!.id,
        vehicleId: inputs.vehicleId,
        startingCharge: inputs.startingChargePercent,
      });

      window.history.replaceState(null, '', `?${urlParams}`);
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('An error occurred while calculating the route. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Share button handler
  const handleShare = () => {
    if (!formInputs) return;

    const urlParams = encodeRouteToURL({
      originId: formInputs.origin!.id,
      destinationId: formInputs.destination!.id,
      vehicleId: formInputs.vehicleId,
      startingCharge: formInputs.startingChargePercent,
    });

    const shareUrl = `${window.location.origin}/tools/route-planner?${urlParams}`;

    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Get initial form values from state or URL
  const initialFormValues: Partial<RouteFormInputs> | undefined = formInputs
    ? {
        origin: formInputs.origin,
        destination: formInputs.destination,
        vehicleId: formInputs.vehicleId,
        startingChargePercent: formInputs.startingChargePercent,
      }
    : initialVehicleId || initialOriginId || initialDestinationId
    ? {
        origin: initialOriginId ? getLocationById(initialOriginId) : null,
        destination: initialDestinationId ? getLocationById(initialDestinationId) : null,
        vehicleId: initialVehicleId,
        startingChargePercent: initialCharge || 80,
      }
    : undefined;

  return (
    <div className="space-y-8">
      {/* Form */}
      <RoutePlannerForm
        vehicles={vehicles}
        initialValues={initialFormValues}
        onCalculate={handleCalculate}
        isCalculating={isCalculating}
      />

      {/* Results */}
      {routeData && rangeAnalysis && selectedVehicle && formInputs && (
        <div className="space-y-6">
          {/* Share Button */}
          <div className="flex justify-end">
            <button
              onClick={handleShare}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {isCopied ? '✓ Link Copied!' : '🔗 Share This Route'}
            </button>
          </div>

          <GoogleMapsProvider>
            <RouteResults
              vehicle={selectedVehicle}
              rangeAnalysis={rangeAnalysis}
              routeData={routeData}
              nearbyStations={nearbyStations}
              originName={formInputs.origin!.name}
              destinationName={formInputs.destination!.name}
              startingChargePercent={formInputs.startingChargePercent}
            />
          </GoogleMapsProvider>
        </div>
      )}

      {/* Empty State */}
      {!routeData && !isCalculating && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Plan Your EV Journey
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Fill in the form above to check if your electric vehicle can complete the trip and find
            charging stations along the way.
          </p>
        </div>
      )}
    </div>
  );
}
