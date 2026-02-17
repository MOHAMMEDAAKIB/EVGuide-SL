'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { TCOResults as TCOResultsType } from '@/lib/tcoCalculations';
import CostBreakdown from './CostBreakdown';
import SavingsChart from './SavingsChart';

interface TCOResultsProps {
  results: TCOResultsType;
}

export default function TCOResults({ results }: TCOResultsProps) {
  const savingsPercentage = results.monthlyTotalPetrol > 0
    ? ((results.monthlySavings / results.monthlyTotalPetrol) * 100)
    : 0;
  
  // Calculate max value for bar chart scaling
  const maxMonthlyCost = Math.max(results.monthlyTotalPetrol, results.monthlyTotalEV);
  const petrolBarWidth = (results.monthlyTotalPetrol / maxMonthlyCost) * 100;
  const evBarWidth = (results.monthlyTotalEV / maxMonthlyCost) * 100;
  
  const isEVCheaper = results.monthlySavings > 0;
  
  return (
    <div className="space-y-6">
      {/* Main Results Card */}
      <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-emerald-50/50 p-8 dark:border-emerald-500/30 dark:from-emerald-900/20 dark:via-slate-900 dark:to-emerald-900/10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          💰 Your Savings with Electric
        </h2>
        
        {/* Monthly Comparison Bars */}
        <div className="mb-8 space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Petrol/Diesel
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatCurrency(results.monthlyTotalPetrol)}/month
              </span>
            </div>
            <div className="h-10 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-linear-to-r from-slate-400 to-slate-600 transition-all duration-500"
                style={{ width: `${petrolBarWidth}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                Electric
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(results.monthlyTotalEV)}/month
              </span>
            </div>
            <div className="h-10 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                style={{ width: `${evBarWidth}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Savings Highlight */}
        {isEVCheaper ? (
          <div className="rounded-xl border-2 border-emerald-600 bg-white p-6 text-center dark:border-emerald-400 dark:bg-slate-900">
            <div className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              You Save
            </div>
            <div className="mt-2 text-5xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(results.monthlySavings)}
            </div>
            <div className="mt-1 text-lg text-slate-600 dark:text-slate-400">
              per month
            </div>
            <div className="mt-4 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(results.annualSavings)}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              per year
            </div>
            <div className="mt-4 inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              {savingsPercentage.toFixed(1)}% cheaper than petrol
            </div>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-amber-600 bg-white p-6 text-center dark:border-amber-400 dark:bg-slate-900">
            <div className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Additional Cost
            </div>
            <div className="mt-2 text-5xl font-bold text-amber-700 dark:text-amber-300">
              {formatCurrency(Math.abs(results.monthlySavings))}
            </div>
            <div className="mt-1 text-lg text-slate-600 dark:text-slate-400">
              per month more
            </div>
            <div className="mt-4 text-xs text-slate-600 dark:text-slate-400">
              EV may still be worth it for environmental benefits and convenience
            </div>
          </div>
        )}
        
        {/* Break-even & 5-Year Savings */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Break-Even Point
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              {results.breakEvenYears === Infinity
                ? 'Never'
                : results.breakEvenYears < 0
                ? 'Immediate'
                : `${results.breakEvenYears.toFixed(1)} years`}
            </div>
            {results.breakEvenYears < Infinity && results.breakEvenYears > 0 && (
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Time to recover price difference
              </div>
            )}
          </div>
          
          <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              5-Year Savings
            </div>
            <div className="mt-2 text-3xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(results.fiveYearSavings)}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              Total saved over 5 years
            </div>
          </div>
        </div>
      </div>
      
      {/* Cost Breakdown Table */}
      <CostBreakdown
        monthlyFuelCostPetrol={results.monthlyFuelCostPetrol}
        monthlyFuelCostEV={results.monthlyFuelCostEV}
        monthlyMaintenancePetrol={results.monthlyMaintenancePetrol}
        monthlyMaintenanceEV={results.monthlyMaintenanceEV}
        monthlyInsurancePetrol={results.monthlyInsurancePetrol}
        monthlyInsuranceEV={results.monthlyInsuranceEV}
        monthlyTotalPetrol={results.monthlyTotalPetrol}
        monthlyTotalEV={results.monthlyTotalEV}
      />
      
      {/* 5-Year Chart */}
      <SavingsChart
        projectionData={results.fiveYearProjection}
        breakEvenYears={results.breakEvenYears}
      />
      
      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {results.selectedVehicle && (
          <Link
            href={`/vehicles/${results.selectedVehicle.id}`}
            className="rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            🚗 View This Vehicle
          </Link>
        )}
        
        <Link
          href="/vehicles"
          className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          📊 Compare All EVs
        </Link>
      </div>
      
      {/* Info Box */}
      <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-4 dark:border-blue-400 dark:bg-blue-900/20">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
          ℹ️ About This Calculation
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          This calculator uses current Sri Lankan fuel prices, electricity tariffs, and typical maintenance costs. 
          Actual savings may vary based on driving habits, charging patterns, and market conditions. 
          EV efficiency is calculated from battery capacity and real-world Sri Lankan range estimates.
        </p>
      </div>
    </div>
  );
}
