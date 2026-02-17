export type { Database, Vehicle, ChargingStation, FuelPrice } from './database';

// Re-export route planning types
export type {
  LatLng,
  RouteData,
  RangeAnalysis,
  StationWithDistance,
} from '@/lib/routeCalculations';

export type { SLLocation } from '@/lib/locations';

// Import for local use
import type { SLLocation } from '@/lib/locations';

// Route planner form inputs
export interface RouteFormInputs {
  origin: SLLocation | null;
  destination: SLLocation | null;
  vehicleId: string;
  startingChargePercent: number;
}
