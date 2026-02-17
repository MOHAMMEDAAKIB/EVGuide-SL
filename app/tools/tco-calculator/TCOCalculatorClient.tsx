'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Vehicle } from '@/types';
import TCOForm from '@/components/tco/TCOForm';
import TCOResults from '@/components/tco/TCOResults';
import {
  CalculatorInputs,
  TCOResults as TCOResultsType,
  calculateTCO,
  encodeCalculationToURL,
  decodeCalculationFromURL,
} from '@/lib/tcoCalculations';
import { copyComparisonLink } from '@/lib/exportPdf';

interface TCOCalculatorClientProps {
  vehicles: Vehicle[];
  currentFuelPrices: {
    petrol: number;
    diesel: number;
  };
  preselectedVehicle?: Vehicle | null;
}

export default function TCOCalculatorClient({
  vehicles,
  currentFuelPrices,
  preselectedVehicle,
}: TCOCalculatorClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<TCOResultsType | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<CalculatorInputs>>({});
  
  // Decode URL params on mount
  useEffect(() => {
    const params: Record<string, string | string[] | undefined> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    const decoded = decodeCalculationFromURL(params);
    
    if (decoded && Object.keys(decoded).length > 0) {
      setInitialValues(decoded);
      
      // Auto-calculate if we have enough parameters
      if (decoded.selectedVehicleId && decoded.fuelEfficiency && decoded.monthlyDistance) {
        const selectedVehicle = vehicles.find(v => v.id === decoded.selectedVehicleId);
        if (selectedVehicle) {
          const fullInputs: CalculatorInputs = {
            fuelType: decoded.fuelType ?? 'PETROL',
            fuelEfficiency: decoded.fuelEfficiency,
            monthlyDistance: decoded.monthlyDistance,
            fuelPriceLkr: decoded.fuelPriceLkr ?? currentFuelPrices.petrol,
            petrolCarPrice: decoded.petrolCarPrice,
            selectedVehicleId: decoded.selectedVehicleId,
            electricityTariffId: decoded.electricityTariffId ?? 'DOMESTIC_HIGH',
            customMaintenancePetrol: decoded.customMaintenancePetrol,
            customMaintenanceEV: decoded.customMaintenanceEV,
            customInsurancePetrol: decoded.customInsurancePetrol,
            customInsuranceEV: decoded.customInsuranceEV,
            includeDepreciation: decoded.includeDepreciation,
            governmentIncentive: decoded.governmentIncentive,
          };
          
          const calcResults = calculateTCO(fullInputs, selectedVehicle);
          setResults(calcResults);
          setIsCalculated(true);
        }
      }
    } else if (preselectedVehicle) {
      // Pre-populate with vehicle from URL vehicleId param
      setInitialValues({
        selectedVehicleId: preselectedVehicle.id,
      });
    }
  }, [searchParams, vehicles, currentFuelPrices, preselectedVehicle]);
  
  const handleCalculate = (inputs: CalculatorInputs) => {
    const selectedVehicle = vehicles.find(v => v.id === inputs.selectedVehicleId);
    
    if (!selectedVehicle) {
      alert('Please select an electric vehicle');
      return;
    }
    
    // Calculate TCO
    const calcResults = calculateTCO(inputs, selectedVehicle);
    setResults(calcResults);
    setIsCalculated(true);
    
    // Update URL with encoded inputs
    const queryString = encodeCalculationToURL(inputs);
    router.replace(`/tools/tco-calculator?${queryString}`, { scroll: false });
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };
  
  const handleShare = async () => {
    if (!results) return;
    
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link to clipboard');
    }
  };
  
  const handleReset = () => {
    setResults(null);
    setIsCalculated(false);
    setInitialValues({});
    router.replace('/tools/tco-calculator');
  };
  
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <section className="border-b border-slate-200/70 bg-linear-to-br from-emerald-50 via-white to-white py-12 dark:border-slate-800/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
              💰 Total Cost of Ownership Calculator
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Compare the true cost of owning an electric vehicle vs petrol/diesel
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
              Includes fuel, maintenance, insurance, and 5-year projections
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Form */}
        <TCOForm
          vehicles={vehicles}
          currentFuelPrices={currentFuelPrices}
          initialValues={initialValues}
          onCalculate={handleCalculate}
        />
        
        {/* Results */}
        {isCalculated && results && (
          <div id="results" className="mt-12 scroll-mt-8">
            {/* Action Buttons */}
            <div className="mb-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={handleShare}
                disabled={isCopied}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {isCopied ? '✓ Copied!' : '🔗 Share Calculation'}
              </button>
              
              <button
                onClick={handleReset}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                🔄 Reset
              </button>
            </div>
            
            {/* Results Display */}
            <TCOResults results={results} />
          </div>
        )}
        
        {/* Info Section (when no results) */}
        {!isCalculated && (
          <div className="mt-12 space-y-6">
            <div className="rounded-xl border-l-4 border-emerald-600 bg-emerald-50 p-6 dark:border-emerald-400 dark:bg-emerald-900/20">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 mb-3">
                💡 How to use this calculator
              </h3>
              <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">1.</span>
                  <span>Enter your current vehicle details (fuel type, efficiency, monthly driving distance)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">2.</span>
                  <span>Select an electric vehicle from our database</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">3.</span>
                  <span>Choose your electricity tariff (domestic rates vary by consumption)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">4.</span>
                  <span>Optionally customize maintenance and insurance costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">5.</span>
                  <span>Click "Calculate Savings" to see your personalized results</span>
                </li>
              </ul>
            </div>
            
            <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-900/50">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                🇱🇰 Sri Lankan Data Used
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Fuel Prices</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Petrol: Rs. {currentFuelPrices.petrol}/L<br />
                    Diesel: Rs. {currentFuelPrices.diesel}/L
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Electricity Tariffs</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Domestic: Rs. 30-50/kWh<br />
                    Off-Peak: Rs. 35/kWh
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Maintenance (Monthly)</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Petrol/Diesel: Rs. 5,000<br />
                    Electric: Rs. 2,000
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">Range Adjustment</div>
                  <div className="text-slate-600 dark:text-slate-400">
                    EV ranges adjusted 15% down<br />
                    from WLTP for SL conditions
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
