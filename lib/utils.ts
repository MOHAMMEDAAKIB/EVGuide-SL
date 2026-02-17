import { Vehicle } from '@/types';

/**
 * Format Sri Lankan Rupee currency
 * @param lkr - Amount in LKR
 * @returns Formatted string like "Rs. 10.5M" or "Rs. 950K"
 */
export function formatCurrency(lkr: number): string {
  if (lkr >= 1_000_000) {
    const millions = lkr / 1_000_000;
    return `Rs. ${millions.toFixed(1)}M`;
  } else if (lkr >= 1_000) {
    const thousands = lkr / 1_000;
    return `Rs. ${thousands.toFixed(0)}K`;
  }
  return `Rs. ${lkr.toLocaleString()}`;
}

/**
 * Format range display
 * @param km - Range in kilometers
 * @returns Formatted string like "420 km"
 */
export function formatRange(km: number): string {
  return `${km} km`;
}

/**
 * Calculate best value vehicle (best price-to-range ratio)
 * @param vehicles - Array of vehicles
 * @returns Vehicle with best value (lowest cost per km of range)
 */
export function calculateBestValue(vehicles: Vehicle[]): Vehicle | null {
  if (vehicles.length === 0) return null;
  
  return vehicles.reduce((best, current) => {
    const currentValue = current.price_lkr / current.range_sl_estimate;
    const bestValue = best.price_lkr / best.range_sl_estimate;
    return currentValue < bestValue ? current : best;
  });
}

/**
 * Filter vehicles based on search criteria
 * @param vehicles - Array of vehicles to filter
 * @param searchTerm - Search term for make/model
 * @param priceRange - Maximum price in LKR (0 = no filter)
 * @param minRange - Minimum range in km (0 = no filter)
 * @returns Filtered array of vehicles
 */
export function filterVehicles(
  vehicles: Vehicle[],
  searchTerm: string,
  priceRange: number,
  minRange: number
): Vehicle[] {
  return vehicles.filter((vehicle) => {
    // Search term filter (make or model)
    const matchesSearch = searchTerm
      ? vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Price range filter
    const matchesPrice = priceRange > 0 ? vehicle.price_lkr <= priceRange : true;

    // Minimum range filter
    const matchesRange = minRange > 0 ? vehicle.range_sl_estimate >= minRange : true;

    return matchesSearch && matchesPrice && matchesRange;
  });
}

/**
 * Find similar vehicles based on body type, drive type, and price band
 * @param allVehicles - Array of all vehicles
 * @param currentVehicleId - ID of the current vehicle
 * @param bodyType - Body type to match
 * @param driveType - Drive type to match
 * @param priceRange - Price range object with low/high bounds
 * @param limit - Maximum number of similar vehicles to return
 * @returns Array of similar vehicles (excluding current vehicle)
 */
export function findSimilarVehicles(
  allVehicles: Vehicle[],
  currentVehicleId: string,
  bodyType: string,
  driveType: string,
  priceRange: { low: number; high: number },
  limit: number = 3
): Vehicle[] {
  const similar = allVehicles
    .filter((vehicle) => {
      // Exclude the current vehicle
      if (vehicle.id === currentVehicleId) return false;

      // Match body type
      if (vehicle.body_type !== bodyType) return false;

      // Match drive type
      if (vehicle.drive_type !== driveType) return false;

      // Match price range (within 20% of current vehicle's price)
      if (vehicle.price_lkr < priceRange.low || vehicle.price_lkr > priceRange.high) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by closest price to current vehicle
      const aPriceDistance = Math.abs(a.price_lkr - priceRange.low);
      const bPriceDistance = Math.abs(b.price_lkr - priceRange.low);
      return aPriceDistance - bPriceDistance;
    })
    .slice(0, limit);

  return similar;
}

/**
 * Utility for conditional classnames (like clsx/cn)
 * @param classes - Array of class names or conditional classes
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ========== COMPARISON UTILITIES ==========

export interface SpecComparison {
  label: string;
  icon: string;
  unit?: string;
  values: (number | string | null)[];
  winnerIndices: number[];
  comparisonType: 'higher' | 'lower' | 'none';
}

export interface SpecCategory {
  name: string;
  icon: string;
  specs: SpecComparison[];
}

/**
 * Compare vehicle specs and identify winners for each metric
 * @param vehicles - Array of vehicles to compare
 * @returns Array of spec comparisons with winner indices
 */
export function compareVehicleSpecs(vehicles: Vehicle[]): SpecComparison[] {
  if (vehicles.length === 0) return [];

  const specs: SpecComparison[] = [
    {
      label: 'Price',
      icon: '💰',
      unit: '',
      values: vehicles.map(v => v.price_lkr),
      winnerIndices: [],
      comparisonType: 'lower',
    },
    {
      label: 'Range (SL Est.)',
      icon: '⚡',
      unit: 'km',
      values: vehicles.map(v => v.range_sl_estimate),
      winnerIndices: [],
      comparisonType: 'higher',
    },
    {
      label: 'Range (WLTP)',
      icon: '📊',
      unit: 'km',
      values: vehicles.map(v => v.range_wltp),
      winnerIndices: [],
      comparisonType: 'higher',
    },
    {
      label: 'Battery Capacity',
      icon: '🔋',
      unit: 'kWh',
      values: vehicles.map(v => v.battery_kwh),
      winnerIndices: [],
      comparisonType: 'higher',
    },
    {
      label: 'Motor Power',
      icon: '💪',
      unit: 'kW',
      values: vehicles.map(v => v.motor_power_kw),
      winnerIndices: [],
      comparisonType: 'higher',
    },
    {
      label: '0-100 km/h',
      icon: '⏱️',
      unit: 's',
      values: vehicles.map(v => v.acceleration_0_100),
      winnerIndices: [],
      comparisonType: 'lower',
    },
    {
      label: 'Top Speed',
      icon: '🚀',
      unit: 'km/h',
      values: vehicles.map(v => v.top_speed_kmh),
      winnerIndices: [],
      comparisonType: 'higher',
    },
    {
      label: 'Seating',
      icon: '👥',
      unit: 'seats',
      values: vehicles.map(v => v.seating_capacity),
      winnerIndices: [],
      comparisonType: 'higher',
    },
    {
      label: 'Cargo Space',
      icon: '📦',
      unit: 'L',
      values: vehicles.map(v => v.cargo_space_liters),
      winnerIndices: [],
      comparisonType: 'higher',
    },
    {
      label: 'DC Fast Charging',
      icon: '⚡',
      unit: 'min (20-80%)',
      values: vehicles.map(v => v.charging_time_dc_minutes),
      winnerIndices: [],
      comparisonType: 'lower',
    },
    {
      label: 'AC Charging',
      icon: '🔌',
      unit: 'hrs (0-100%)',
      values: vehicles.map(v => v.charging_time_ac_hours),
      winnerIndices: [],
      comparisonType: 'lower',
    },
    {
      label: 'Body Type',
      icon: '🚗',
      unit: '',
      values: vehicles.map(v => v.body_type),
      winnerIndices: [],
      comparisonType: 'none',
    },
    {
      label: 'Drive Type',
      icon: '🛣️',
      unit: '',
      values: vehicles.map(v => v.drive_type),
      winnerIndices: [],
      comparisonType: 'none',
    },
  ];

  // Calculate winners for each spec
  specs.forEach(spec => {
    if (spec.comparisonType === 'none') return;

    const numericValues = spec.values.map((v, idx) => ({
      value: typeof v === 'number' ? v : null,
      index: idx,
    })).filter(item => item.value !== null) as { value: number; index: number }[];

    if (numericValues.length === 0) return;

    const bestValue = spec.comparisonType === 'higher'
      ? Math.max(...numericValues.map(item => item.value))
      : Math.min(...numericValues.map(item => item.value));

    spec.winnerIndices = numericValues
      .filter(item => item.value === bestValue)
      .map(item => item.index);
  });

  return specs;
}

/**
 * Calculate winner counts for each vehicle in comparison
 * @param specs - Array of spec comparisons
 * @param vehicleCount - Number of vehicles being compared
 * @returns Array of winner counts per vehicle
 */
export function calculateWinnerCounts(specs: SpecComparison[], vehicleCount: number): number[] {
  const counts = Array(vehicleCount).fill(0);
  
  specs.forEach(spec => {
    spec.winnerIndices.forEach(idx => {
      if (idx < vehicleCount) {
        counts[idx]++;
      }
    });
  });

  return counts;
}

/**
 * Group specs by category for organized display
 * @param specs - Array of all spec comparisons
 * @returns Array of categorized specs
 */
export function groupSpecsByCategory(specs: SpecComparison[]): SpecCategory[] {
  const categories: SpecCategory[] = [
    {
      name: 'Pricing',
      icon: '💰',
      specs: specs.filter(s => s.label === 'Price'),
    },
    {
      name: 'Range & Battery',
      icon: '🔋',
      specs: specs.filter(s => 
        ['Range (SL Est.)', 'Range (WLTP)', 'Battery Capacity'].includes(s.label)
      ),
    },
    {
      name: 'Performance',
      icon: '🚀',
      specs: specs.filter(s => 
        ['Motor Power', '0-100 km/h', 'Top Speed'].includes(s.label)
      ),
    },
    {
      name: 'Charging',
      icon: '⚡',
      specs: specs.filter(s => 
        ['DC Fast Charging', 'AC Charging'].includes(s.label)
      ),
    },
    {
      name: 'Dimensions',
      icon: '📏',
      specs: specs.filter(s => 
        ['Seating', 'Cargo Space', 'Body Type', 'Drive Type'].includes(s.label)
      ),
    },
  ];

  return categories.filter(cat => cat.specs.length > 0);
}
