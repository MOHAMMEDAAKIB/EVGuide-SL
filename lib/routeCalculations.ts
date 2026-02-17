import { Vehicle, ChargingStation } from '@/types';
import { calculateDistance } from './locations';

// ========== TYPES ==========

export interface LatLng {
  lat: number;
  lng: number;
}

export interface RouteData {
  distance: number; // km
  duration: number; // minutes
  polyline: LatLng[]; // Route coordinates
  osmrResponse?: any; // Raw OSRM response for debugging
}

export interface RangeAnalysis {
  distanceKm: number;
  energyRequiredKm: number; // How much range is consumed
  remainingRangeKm: number; // Range left after journey
  remainingPercent: number; // Battery % left after journey
  feasible: boolean; // Can the vehicle complete the journey?
  safetyMargin: number; // Extra km of buffer (20% of starting range)
}

export interface StationWithDistance extends ChargingStation {
  distanceFromOrigin: number; // km from start point
}

// ========== OSRM ROUTE CALCULATION ==========

/**
 * Calculate route using OpenStreetMap's OSRM (Open Source Routing Machine)
 * Free public API - no key required
 */
export async function calculateRouteWithOSRM(
  origin: LatLng,
  destination: LatLng
): Promise<RouteData | null> {
  try {
    // OSRM API: https://router.project-osrm.org/route/v1/driving/{lng},{lat};{lng},{lat}
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    const distanceMeters = route.distance;
    const durationSeconds = route.duration;
    const geometry = route.geometry;

    // Convert GeoJSON coordinates [lng, lat] to our LatLng format
    const polyline: LatLng[] = geometry.coordinates.map((coord: number[]) => ({
      lat: coord[1],
      lng: coord[0],
    }));

    return {
      distance: Math.round((distanceMeters / 1000) * 10) / 10, // Convert to km, round to 1 decimal
      duration: Math.round(durationSeconds / 60), // Convert to minutes
      polyline,
      osmrResponse: data,
    };
  } catch (error) {
    console.error('Error calculating route with OSRM:', error);
    return null;
  }
}

// ========== EV RANGE CALCULATIONS ==========

/**
 * Calculate if EV can complete the journey and remaining range
 * Includes 20% safety margin
 */
export function calculateEVRangeConsumption(
  distanceKm: number,
  vehicle: Vehicle,
  startingChargePercent: number
): RangeAnalysis {
  // Starting available range (based on charge %)
  const startingRangeKm = (vehicle.range_sl_estimate * startingChargePercent) / 100;
  
  // Safety margin: Keep 20% reserve battery
  const safetyMargin = vehicle.range_sl_estimate * 0.2;
  const usableRange = startingRangeKm - safetyMargin;

  // Energy required for this journey
  const energyRequiredKm = distanceKm;

  // Remaining range after journey (before safety margin)
  const remainingRangeKm = startingRangeKm - energyRequiredKm;

  // Remaining percentage
  const remainingPercent = Math.max(
    0,
    Math.round((remainingRangeKm / vehicle.range_sl_estimate) * 100)
  );

  // Feasible if remaining range is above safety margin
  const feasible = remainingRangeKm >= safetyMargin;

  return {
    distanceKm,
    energyRequiredKm,
    remainingRangeKm: Math.max(0, Math.round(remainingRangeKm)),
    remainingPercent,
    feasible,
    safetyMargin: Math.round(safetyMargin),
  };
}

/**
 * Calculate energy efficiency (km per kWh)
 * Used for detailed breakdowns
 */
export function calculateEfficiency(vehicle: Vehicle): number {
  // Efficiency = Range / Battery Capacity
  return vehicle.range_sl_estimate / vehicle.battery_kwh;
}

/**
 * Calculate energy consumption for journey (kWh)
 */
export function calculateEnergyConsumption(
  distanceKm: number,
  vehicle: Vehicle
): number {
  const efficiency = calculateEfficiency(vehicle);
  return distanceKm / efficiency;
}

// ========== CHARGING STATION FILTERING ==========

/**
 * Find charging stations along the route
 * Uses a buffer zone around the route polyline
 */
export function findChargingStationsAlongRoute(
  route: LatLng[],
  stations: ChargingStation[],
  maxDeviationKm: number = 5 // Max distance from route
): StationWithDistance[] {
  if (route.length === 0) return [];

  const origin = route[0];
  const stationsWithDistance: StationWithDistance[] = [];

  stations.forEach((station) => {
    // Check if station is within buffer of any point on route
    const minDistanceToRoute = Math.min(
      ...route.map((point) =>
        calculateDistance(point.lat, point.lng, station.latitude, station.longitude)
      )
    );

    if (minDistanceToRoute <= maxDeviationKm) {
      // Calculate distance from origin
      const distanceFromOrigin = calculateDistance(
        origin.lat,
        origin.lng,
        station.latitude,
        station.longitude
      );

      stationsWithDistance.push({
        ...station,
        distanceFromOrigin: Math.round(distanceFromOrigin * 10) / 10,
      });
    }
  });

  // Sort by distance from origin
  return stationsWithDistance.sort((a, b) => a.distanceFromOrigin - b.distanceFromOrigin);
}

/**
 * Filter stations by connector type
 */
export function filterStationsByConnector(
  stations: StationWithDistance[],
  connectorType: string
): StationWithDistance[] {
  if (!connectorType) return stations;
  
  return stations.filter((station) =>
    station.connector_types.includes(connectorType)
  );
}

/**
 * Filter stations by operator
 */
export function filterStationsByOperator(
  stations: StationWithDistance[],
  operator: string
): StationWithDistance[] {
  if (!operator) return stations;
  
  return stations.filter(
    (station) => station.operator.toLowerCase() === operator.toLowerCase()
  );
}

/**
 * Get unique connector types from stations list
 */
export function getUniqueConnectors(stations: ChargingStation[]): string[] {
  const connectors = new Set<string>();
  stations.forEach((station) => {
    station.connector_types.forEach((type) => connectors.add(type));
  });
  return Array.from(connectors).sort();
}

/**
 * Get unique operators from stations list
 */
export function getUniqueOperators(stations: ChargingStation[]): string[] {
  const operators = new Set<string>();
  stations.forEach((station) => {
    operators.add(station.operator);
  });
  return Array.from(operators).sort();
}

// ========== URL ENCODING ==========

/**
 * Encode route parameters for shareable URL
 */
export function encodeRouteToURL(params: {
  originId?: string;
  destinationId?: string;
  vehicleId: string;
  startingCharge: number;
}): string {
  const searchParams = new URLSearchParams();
  
  if (params.originId) searchParams.set('origin', params.originId);
  if (params.destinationId) searchParams.set('destination', params.destinationId);
  searchParams.set('vehicleId', params.vehicleId);
  searchParams.set('charge', params.startingCharge.toString());
  
  return searchParams.toString();
}

/**
 * Decode route parameters from URL
 */
export function decodeRouteFromURL(searchParams: URLSearchParams): {
  originId?: string;
  destinationId?: string;
  vehicleId?: string;
  startingCharge?: number;
} {
  return {
    originId: searchParams.get('origin') || undefined,
    destinationId: searchParams.get('destination') || undefined,
    vehicleId: searchParams.get('vehicleId') || undefined,
    startingCharge: searchParams.get('charge')
      ? parseInt(searchParams.get('charge')!)
      : undefined,
  };
}
