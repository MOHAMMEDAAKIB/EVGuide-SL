// Sri Lankan specific constants for TCO Calculator

export const ELECTRICITY_TARIFFS = {
  DOMESTIC_LOW: {
    id: 'DOMESTIC_LOW',
    label: 'Domestic (<90 units/month)',
    rate: 30, // Rs. per kWh
    description: 'Lower tariff for households consuming less than 90 units per month',
  },
  DOMESTIC_HIGH: {
    id: 'DOMESTIC_HIGH',
    label: 'Domestic (>90 units/month)',
    rate: 50, // Rs. per kWh
    description: 'Standard domestic tariff for higher consumption',
  },
  OFF_PEAK: {
    id: 'OFF_PEAK',
    label: 'Off-Peak Hours',
    rate: 35, // Rs. per kWh
    description: 'Reduced rate during off-peak hours (typically 10 PM - 6 AM)',
  },
  PUBLIC_CHARGING: {
    id: 'PUBLIC_CHARGING',
    label: 'Public Fast Charging',
    rate: 45, // Rs. per kWh
    description: 'Commercial charging station rates',
  },
} as const;

export type ElectricityTariffId = keyof typeof ELECTRICITY_TARIFFS;

// Default maintenance costs (monthly, in LKR)
export const MAINTENANCE_COSTS = {
  PETROL_MONTHLY: 5000, // Rs. per month
  DIESEL_MONTHLY: 5500, // Rs. per month
  EV_MONTHLY: 2000, // Rs. per month (60% less than ICE)
} as const;

// Insurance cost multipliers (as percentage of vehicle value per year)
export const INSURANCE_RATES = {
  PETROL_ANNUAL_PERCENTAGE: 3.5, // 3.5% of vehicle value per year
  DIESEL_ANNUAL_PERCENTAGE: 3.5,
  EV_ANNUAL_PERCENTAGE: 4.0, // Slightly higher for EVs
} as const;

// Depreciation rates (% per year)
export const DEPRECIATION_RATES = {
  PETROL_ANNUAL: 15, // 15% per year
  DIESEL_ANNUAL: 15,
  EV_ANNUAL: 12, // EVs depreciate slower due to simpler mechanics
} as const;

// Government incentives (in LKR)
export const GOVERNMENT_INCENTIVES = {
  EV_TAX_REDUCTION: 0, // Current tax reduction for EVs (can be customized)
  EV_REGISTRATION_DISCOUNT: 0, // Registration fee discounts
} as const;

// Fuel types
export const FUEL_TYPES = {
  PETROL: {
    id: 'PETROL',
    label: 'Petrol',
    defaultEfficiency: 15, // km/L typical for Sri Lankan conditions
  },
  DIESEL: {
    id: 'DIESEL',
    label: 'Diesel',
    defaultEfficiency: 18, // km/L typically better than petrol
  },
} as const;

export type FuelType = keyof typeof FUEL_TYPES;

// Calculation defaults
export const CALCULATION_DEFAULTS = {
  MONTHLY_DISTANCE_KM: 1000, // Average monthly driving in Sri Lanka
  YEARS_OF_OWNERSHIP: 5, // Standard calculation period
  PETROL_CAR_PRICE_ESTIMATE: 5000000, // Average petrol car price (Rs. 5M)
} as const;

// Helper function to get all tariff options as array
export function getElectricityTariffOptions() {
  return Object.values(ELECTRICITY_TARIFFS);
}

// Helper function to get fuel type options as array
export function getFuelTypeOptions() {
  return Object.values(FUEL_TYPES);
}
