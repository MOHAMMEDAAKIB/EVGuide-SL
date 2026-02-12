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
 * Utility for conditional classnames (like clsx/cn)
 * @param classes - Array of class names or conditional classes
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
