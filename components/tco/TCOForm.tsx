'use client';

import { useState } from 'react';
import { Car, Zap, Settings, Calculator } from 'lucide-react';
import { Vehicle } from '@/types';
import {
  FUEL_TYPES,
  ELECTRICITY_TARIFFS,
  MAINTENANCE_COSTS,
  CALCULATION_DEFAULTS,
  getElectricityTariffOptions,
  type ElectricityTariffId,
  type FuelType,
} from '@/lib/constants';
import { CalculatorInputs } from '@/lib/tcoCalculations';

interface TCOFormProps {
  vehicles: Vehicle[];
  currentFuelPrices: {
    petrol: number;
    diesel: number;
  };
  initialValues?: Partial<CalculatorInputs>;
  onCalculate: (inputs: CalculatorInputs) => void;
}

export default function TCOForm({
  vehicles,
  currentFuelPrices,
  initialValues,
  onCalculate,
}: TCOFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Form state
  const [fuelType, setFuelType] = useState<FuelType>(
    initialValues?.fuelType ?? 'PETROL'
  );
  const [fuelEfficiency, setFuelEfficiency] = useState(
    initialValues?.fuelEfficiency ?? FUEL_TYPES.PETROL.defaultEfficiency
  );
  const [monthlyDistance, setMonthlyDistance] = useState(
    initialValues?.monthlyDistance ?? CALCULATION_DEFAULTS.MONTHLY_DISTANCE_KM
  );
  const [petrolCarPrice, setPetrolCarPrice] = useState(
    initialValues?.petrolCarPrice ?? CALCULATION_DEFAULTS.PETROL_CAR_PRICE_ESTIMATE
  );
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    initialValues?.selectedVehicleId ?? ''
  );
  const [electricityTariffId, setElectricityTariffId] = useState<ElectricityTariffId>(
    initialValues?.electricityTariffId ?? 'DOMESTIC_HIGH'
  );
  
  // Advanced options
  const [customMaintenancePetrol, setCustomMaintenancePetrol] = useState<number | undefined>(
    initialValues?.customMaintenancePetrol
  );
  const [customMaintenanceEV, setCustomMaintenanceEV] = useState<number | undefined>(
    initialValues?.customMaintenanceEV
  );
  const [customInsurancePetrol, setCustomInsurancePetrol] = useState<number | undefined>(
    initialValues?.customInsurancePetrol
  );
  const [customInsuranceEV, setCustomInsuranceEV] = useState<number | undefined>(
    initialValues?.customInsuranceEV
  );
  const [includeDepreciation, setIncludeDepreciation] = useState(
    initialValues?.includeDepreciation ?? false
  );
  const [governmentIncentive, setGovernmentIncentive] = useState<number | undefined>(
    initialValues?.governmentIncentive
  );
  
  const currentFuelPrice = fuelType === 'PETROL' ? currentFuelPrices.petrol : currentFuelPrices.diesel;
  const tariffOptions = getElectricityTariffOptions();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputs: CalculatorInputs = {
      fuelType,
      fuelEfficiency,
      monthlyDistance,
      fuelPriceLkr: currentFuelPrice,
      petrolCarPrice,
      selectedVehicleId: selectedVehicleId || null,
      electricityTariffId,
      customMaintenancePetrol,
      customMaintenanceEV,
      customInsurancePetrol,
      customInsuranceEV,
      includeDepreciation,
      governmentIncentive,
    };
    
    onCalculate(inputs);
  };
  
  const handleFuelTypeChange = (newFuelType: FuelType) => {
    setFuelType(newFuelType);
    setFuelEfficiency(FUEL_TYPES[newFuelType].defaultEfficiency);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Vehicle Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Car className="w-6 h-6 text-gray-600" /> Your Current Vehicle
        </h3>
        
        <div className="space-y-4">
          {/* Fuel Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Vehicle Type
            </label>
            <select
              value={fuelType}
              onChange={(e) => handleFuelTypeChange(e.target.value as FuelType)}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
            >
              {Object.entries(FUEL_TYPES).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Fuel Efficiency */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Fuel Efficiency (km/L)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              step="0.1"
              value={fuelEfficiency}
              onChange={(e) => setFuelEfficiency(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
              aria-label="Fuel efficiency in kilometers per liter"
            />
          </div>
          
          {/* Monthly Distance */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Monthly Distance (km)
            </label>
            <input
              type="number"
              min="100"
              max="10000"
              step="100"
              value={monthlyDistance}
              onChange={(e) => setMonthlyDistance(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
              aria-label="Monthly distance in kilometers"
            />
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={monthlyDistance}
              onChange={(e) => setMonthlyDistance(Number(e.target.value))}
              className="mt-2 w-full accent-emerald-600"
              aria-label="Monthly distance slider"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>100 km</span>
              <span>{monthlyDistance} km/month</span>
              <span>5000 km</span>
            </div>
          </div>
          
          {/* Current Fuel Price (Display) */}
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Current {fuelType === 'PETROL' ? 'Petrol' : 'Diesel'} Price
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              Rs. {currentFuelPrice.toFixed(2)}/L
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Auto-updated from latest data
            </div>
          </div>
          
          {/* Petrol Car Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Petrol/Diesel Car Price (Rs.)
            </label>
            <input
              type="number"
              min="1000000"
              max="50000000"
              step="100000"
              value={petrolCarPrice}
              onChange={(e) => setPetrolCarPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
              aria-label="Petrol or diesel car price in rupees"
            />
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Approximate purchase price for comparison
            </div>
          </div>
        </div>
      </div>
      
      {/* Electric Vehicle Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" /> Electric Vehicle
        </h3>
        
        <div className="space-y-4">
          {/* EV Selector */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Select EV Model
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
              required
            >
              <option value="">-- Select an electric vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} ({vehicle.year}) - Rs. {(vehicle.price_lkr / 1000000).toFixed(1)}M
                </option>
              ))}
            </select>
          </div>
          
          {/* Electricity Tariff */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Electricity Tariff
            </label>
            <div className="space-y-2">
              {tariffOptions.map((tariff) => (
                <label
                  key={tariff.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200/80 bg-slate-50/50 p-3 transition hover:bg-slate-100/80 dark:border-slate-700/70 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                >
                  <input
                    type="radio"
                    name="tariff"
                    value={tariff.id}
                    checked={electricityTariffId === tariff.id}
                    onChange={(e) => setElectricityTariffId(e.target.value as ElectricityTariffId)}
                    className="mt-1 h-4 w-4 accent-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {tariff.label}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {tariff.description}
                    </div>
                    <div className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      Rs. {tariff.rate}/kWh
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Options (Collapsible) */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between p-6 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-gray-600" /> Advanced Options
          </h3>
          <span className="text-slate-500 dark:text-slate-400">
            {showAdvanced ? '▲' : '▼'}
          </span>
        </button>
        
        {showAdvanced && (
          <div className="border-t border-slate-200 p-6 space-y-4 dark:border-slate-700">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Custom Maintenance Petrol */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Petrol Maintenance (Rs./month)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={customMaintenancePetrol ?? ''}
                  onChange={(e) => setCustomMaintenancePetrol(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={`Default: Rs. ${MAINTENANCE_COSTS.PETROL_MONTHLY}`}
                  className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              
              {/* Custom Maintenance EV */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  EV Maintenance (Rs./month)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={customMaintenanceEV ?? ''}
                  onChange={(e) => setCustomMaintenanceEV(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={`Default: Rs. ${MAINTENANCE_COSTS.EV_MONTHLY}`}
                  className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              
              {/* Custom Insurance Petrol */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Petrol Insurance (Rs./month)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={customInsurancePetrol ?? ''}
                  onChange={(e) => setCustomInsurancePetrol(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Auto-calculated"
                  className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              
              {/* Custom Insurance EV */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  EV Insurance (Rs./month)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={customInsuranceEV ?? ''}
                  onChange={(e) => setCustomInsuranceEV(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Auto-calculated"
                  className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
            
            {/* Government Incentive */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Government Incentive (Rs.)
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                value={governmentIncentive ?? ''}
                onChange={(e) => setGovernmentIncentive(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Enter if applicable"
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700/70 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            
            {/* Include Depreciation */}
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={includeDepreciation}
                onChange={(e) => setIncludeDepreciation(e.target.checked)}
                className="h-5 w-5 rounded accent-emerald-600"
              />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Include depreciation in calculations
              </span>
            </label>
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700 hover:shadow-xl dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        <span className="flex items-center justify-center gap-2">
          <Calculator className="w-6 h-6" /> Calculate Savings
        </span>
      </button>
    </form>
  );
}
