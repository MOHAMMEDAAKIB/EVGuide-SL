import { Vehicle } from '@/types';
import {
  ELECTRICITY_TARIFFS,
  MAINTENANCE_COSTS,
  INSURANCE_RATES,
  DEPRECIATION_RATES,
  CALCULATION_DEFAULTS,
  type ElectricityTariffId,
  type FuelType,
} from './constants';

// ========== TYPES ==========

export interface CalculatorInputs {
  // Current Vehicle (Petrol/Diesel)
  fuelType: FuelType;
  fuelEfficiency: number; // km/L
  monthlyDistance: number; // km
  fuelPriceLkr: number; // Rs. per liter
  petrolCarPrice?: number; // Optional, uses default if not provided

  // Electric Vehicle
  selectedVehicleId: string | null;
  electricityTariffId: ElectricityTariffId;

  // Advanced Options
  customMaintenancePetrol?: number;
  customMaintenanceEV?: number;
  customInsurancePetrol?: number;
  customInsuranceEV?: number;
  includeDepreciation?: boolean;
  governmentIncentive?: number;
}

export interface TCOResults {
  // Monthly Costs
  monthlyFuelCostPetrol: number;
  monthlyFuelCostEV: number;
  monthlyMaintenancePetrol: number;
  monthlyMaintenanceEV: number;
  monthlyInsurancePetrol: number;
  monthlyInsuranceEV: number;
  monthlyTotalPetrol: number;
  monthlyTotalEV: number;
  monthlySavings: number;

  // Annual Costs
  annualSavings: number;

  // Long-term Analysis
  breakEvenYears: number;
  fiveYearSavings: number;
  fiveYearProjection: YearlyData[];

  // Vehicle Info
  evEfficiency: number; // kWh/km
  selectedVehicle: Vehicle | null;
}

export interface YearlyData {
  year: number;
  petrolCumulativeCost: number;
  evCumulativeCost: number;
  cumulativeSavings: number;
}

// ========== CALCULATION FUNCTIONS ==========

/**
 * Calculate EV efficiency from battery capacity and range
 * @param batteryKwh - Battery capacity in kWh
 * @param rangeKm - Range in km (use SL estimate)
 * @returns Efficiency in kWh/km
 */
export function calculateEVEfficiency(batteryKwh: number, rangeKm: number): number {
  if (rangeKm === 0) return 0;
  return batteryKwh / rangeKm;
}

/**
 * Calculate monthly fuel cost for petrol/diesel vehicle
 * @param monthlyKm - Monthly distance in km
 * @param efficiency - Fuel efficiency in km/L
 * @param fuelPrice - Fuel price in Rs./L
 * @returns Monthly fuel cost in LKR
 */
export function calculateMonthlyFuelCostICE(
  monthlyKm: number,
  efficiency: number,
  fuelPrice: number
): number {
  if (efficiency === 0) return 0;
  const litersPerMonth = monthlyKm / efficiency;
  return litersPerMonth * fuelPrice;
}

/**
 * Calculate monthly electricity cost for EV
 * @param monthlyKm - Monthly distance in km
 * @param evEfficiency - EV efficiency in kWh/km
 * @param electricityRate - Electricity rate in Rs./kWh
 * @returns Monthly electricity cost in LKR
 */
export function calculateMonthlyFuelCostEV(
  monthlyKm: number,
  evEfficiency: number,
  electricityRate: number
): number {
  const kwhPerMonth = monthlyKm * evEfficiency;
  return kwhPerMonth * electricityRate;
}

/**
 * Calculate monthly insurance cost
 * @param vehiclePrice - Vehicle price in LKR
 * @param annualPercentage - Annual insurance rate as percentage
 * @returns Monthly insurance cost in LKR
 */
export function calculateMonthlyInsurance(
  vehiclePrice: number,
  annualPercentage: number
): number {
  const annualCost = (vehiclePrice * annualPercentage) / 100;
  return annualCost / 12;
}

/**
 * Calculate break-even point
 * @param evPrice - Electric vehicle price in LKR
 * @param petrolPrice - Petrol car price in LKR
 * @param monthlySavings - Monthly savings in LKR
 * @returns Years to break even
 */
export function calculateBreakEven(
  evPrice: number,
  petrolPrice: number,
  monthlySavings: number
): number {
  if (monthlySavings <= 0) return Infinity;
  const priceDifference = evPrice - petrolPrice;
  if (priceDifference <= 0) return 0; // EV is cheaper or same price
  const monthsToBreakEven = priceDifference / monthlySavings;
  return monthsToBreakEven / 12;
}

/**
 * Calculate 5-year cost projection
 * @param monthlyPetrol - Monthly cost for petrol vehicle
 * @param monthlyEV - Monthly cost for EV
 * @param evPrice - EV purchase price
 * @param petrolPrice - Petrol car purchase price
 * @returns Array of yearly cumulative costs
 */
export function calculateFiveYearProjection(
  monthlyPetrol: number,
  monthlyEV: number,
  evPrice: number,
  petrolPrice: number
): YearlyData[] {
  const projection: YearlyData[] = [];
  
  for (let year = 1; year <= CALCULATION_DEFAULTS.YEARS_OF_OWNERSHIP; year++) {
    const monthsElapsed = year * 12;
    const petrolCumulativeCost = petrolPrice + (monthlyPetrol * monthsElapsed);
    const evCumulativeCost = evPrice + (monthlyEV * monthsElapsed);
    const cumulativeSavings = petrolCumulativeCost - evCumulativeCost;
    
    projection.push({
      year,
      petrolCumulativeCost,
      evCumulativeCost,
      cumulativeSavings,
    });
  }
  
  return projection;
}

/**
 * Main TCO calculation function
 * @param inputs - Calculator inputs
 * @param selectedVehicle - Selected EV data
 * @returns Complete TCO results
 */
export function calculateTCO(
  inputs: CalculatorInputs,
  selectedVehicle: Vehicle | null
): TCOResults {
  // Get electricity rate
  const electricityRate = ELECTRICITY_TARIFFS[inputs.electricityTariffId].rate;
  
  // Calculate EV efficiency
  const evEfficiency = selectedVehicle
    ? calculateEVEfficiency(selectedVehicle.battery_kwh, selectedVehicle.range_sl_estimate)
    : 0;
  
  // Monthly Fuel Costs
  const monthlyFuelCostPetrol = calculateMonthlyFuelCostICE(
    inputs.monthlyDistance,
    inputs.fuelEfficiency,
    inputs.fuelPriceLkr
  );
  
  const monthlyFuelCostEV = calculateMonthlyFuelCostEV(
    inputs.monthlyDistance,
    evEfficiency,
    electricityRate
  );
  
  // Monthly Maintenance
  const monthlyMaintenancePetrol = inputs.customMaintenancePetrol ?? 
    (inputs.fuelType === 'PETROL' ? MAINTENANCE_COSTS.PETROL_MONTHLY : MAINTENANCE_COSTS.DIESEL_MONTHLY);
  const monthlyMaintenanceEV = inputs.customMaintenanceEV ?? MAINTENANCE_COSTS.EV_MONTHLY;
  
  // Monthly Insurance
  const petrolCarPrice = inputs.petrolCarPrice ?? CALCULATION_DEFAULTS.PETROL_CAR_PRICE_ESTIMATE;
  const evPrice = selectedVehicle?.price_lkr ?? 0;
  
  const monthlyInsurancePetrol = inputs.customInsurancePetrol ??
    calculateMonthlyInsurance(
      petrolCarPrice,
      inputs.fuelType === 'PETROL' ? INSURANCE_RATES.PETROL_ANNUAL_PERCENTAGE : INSURANCE_RATES.DIESEL_ANNUAL_PERCENTAGE
    );
  
  const monthlyInsuranceEV = inputs.customInsuranceEV ??
    calculateMonthlyInsurance(evPrice, INSURANCE_RATES.EV_ANNUAL_PERCENTAGE);
  
  // Monthly Totals
  const monthlyTotalPetrol = monthlyFuelCostPetrol + monthlyMaintenancePetrol + monthlyInsurancePetrol;
  const monthlyTotalEV = monthlyFuelCostEV + monthlyMaintenanceEV + monthlyInsuranceEV;
  const monthlySavings = monthlyTotalPetrol - monthlyTotalEV;
  
  // Annual
  const annualSavings = monthlySavings * 12;
  
  // Break-even
  const breakEvenYears = calculateBreakEven(evPrice, petrolCarPrice, monthlySavings);
  
  // 5-Year Projection
  const fiveYearProjection = calculateFiveYearProjection(
    monthlyTotalPetrol,
    monthlyTotalEV,
    evPrice,
    petrolCarPrice
  );
  
  const fiveYearSavings = fiveYearProjection[4].cumulativeSavings;
  
  return {
    monthlyFuelCostPetrol,
    monthlyFuelCostEV,
    monthlyMaintenancePetrol,
    monthlyMaintenanceEV,
    monthlyInsurancePetrol,
    monthlyInsuranceEV,
    monthlyTotalPetrol,
    monthlyTotalEV,
    monthlySavings,
    annualSavings,
    breakEvenYears,
    fiveYearSavings,
    fiveYearProjection,
    evEfficiency,
    selectedVehicle,
  };
}

/**
 * Encode calculator inputs to URL query string
 * @param inputs - Calculator inputs
 * @returns URL query string (without ?)
 */
export function encodeCalculationToURL(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();
  
  params.set('fuelType', inputs.fuelType);
  params.set('fuelEff', inputs.fuelEfficiency.toString());
  params.set('monthlyKm', inputs.monthlyDistance.toString());
  params.set('fuelPrice', inputs.fuelPriceLkr.toString());
  
  if (inputs.petrolCarPrice) {
    params.set('petrolPrice', inputs.petrolCarPrice.toString());
  }
  
  if (inputs.selectedVehicleId) {
    params.set('vehicleId', inputs.selectedVehicleId);
  }
  
  params.set('tariff', inputs.electricityTariffId);
  
  if (inputs.customMaintenancePetrol) {
    params.set('maintP', inputs.customMaintenancePetrol.toString());
  }
  if (inputs.customMaintenanceEV) {
    params.set('maintEV', inputs.customMaintenanceEV.toString());
  }
  if (inputs.customInsurancePetrol) {
    params.set('insP', inputs.customInsurancePetrol.toString());
  }
  if (inputs.customInsuranceEV) {
    params.set('insEV', inputs.customInsuranceEV.toString());
  }
  if (inputs.includeDepreciation) {
    params.set('depr', '1');
  }
  if (inputs.governmentIncentive) {
    params.set('incentive', inputs.governmentIncentive.toString());
  }
  
  return params.toString();
}

/**
 * Decode calculator inputs from URL search params
 * @param searchParams - URL search params
 * @returns Calculator inputs or null if invalid
 */
export function decodeCalculationFromURL(
  searchParams: Record<string, string | string[] | undefined>
): Partial<CalculatorInputs> | null {
  try {
    const getParam = (key: string): string | undefined => {
      const value = searchParams[key];
      return Array.isArray(value) ? value[0] : value;
    };
    
    const getNumber = (key: string): number | undefined => {
      const value = getParam(key);
      if (!value) return undefined;
      const num = Number(value);
      return Number.isFinite(num) ? num : undefined;
    };
    
    const inputs: Partial<CalculatorInputs> = {};
    
    const fuelType = getParam('fuelType');
    if (fuelType === 'PETROL' || fuelType === 'DIESEL') {
      inputs.fuelType = fuelType as FuelType;
    }
    
    const fuelEff = getNumber('fuelEff');
    if (fuelEff) inputs.fuelEfficiency = fuelEff;
    
    const monthlyKm = getNumber('monthlyKm');
    if (monthlyKm) inputs.monthlyDistance = monthlyKm;
    
    const fuelPrice = getNumber('fuelPrice');
    if (fuelPrice) inputs.fuelPriceLkr = fuelPrice;
    
    const petrolPrice = getNumber('petrolPrice');
    if (petrolPrice) inputs.petrolCarPrice = petrolPrice;
    
    const vehicleId = getParam('vehicleId');
    if (vehicleId) inputs.selectedVehicleId = vehicleId;
    
    const tariff = getParam('tariff');
    if (tariff && tariff in ELECTRICITY_TARIFFS) {
      inputs.electricityTariffId = tariff as ElectricityTariffId;
    }
    
    const maintP = getNumber('maintP');
    if (maintP) inputs.customMaintenancePetrol = maintP;
    
    const maintEV = getNumber('maintEV');
    if (maintEV) inputs.customMaintenanceEV = maintEV;
    
    const insP = getNumber('insP');
    if (insP) inputs.customInsurancePetrol = insP;
    
    const insEV = getNumber('insEV');
    if (insEV) inputs.customInsuranceEV = insEV;
    
    const depr = getParam('depr');
    if (depr === '1') inputs.includeDepreciation = true;
    
    const incentive = getNumber('incentive');
    if (incentive) inputs.governmentIncentive = incentive;
    
    return inputs;
  } catch (error) {
    console.error('Error decoding URL params:', error);
    return null;
  }
}
