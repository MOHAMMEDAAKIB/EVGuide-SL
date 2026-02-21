'use client';

import { formatCurrency } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface CostBreakdownProps {
  monthlyFuelCostPetrol: number;
  monthlyFuelCostEV: number;
  monthlyMaintenancePetrol: number;
  monthlyMaintenanceEV: number;
  monthlyInsurancePetrol: number;
  monthlyInsuranceEV: number;
  monthlyTotalPetrol: number;
  monthlyTotalEV: number;
}

export default function CostBreakdown({
  monthlyFuelCostPetrol,
  monthlyFuelCostEV,
  monthlyMaintenancePetrol,
  monthlyMaintenanceEV,
  monthlyInsurancePetrol,
  monthlyInsuranceEV,
  monthlyTotalPetrol,
  monthlyTotalEV,
}: CostBreakdownProps) {
  const annualFuelPetrol = monthlyFuelCostPetrol * 12;
  const annualFuelEV = monthlyFuelCostEV * 12;
  const annualMaintenancePetrol = monthlyMaintenancePetrol * 12;
  const annualMaintenanceEV = monthlyMaintenanceEV * 12;
  const annualInsurancePetrol = monthlyInsurancePetrol * 12;
  const annualInsuranceEV = monthlyInsuranceEV * 12;
  const annualTotalPetrol = monthlyTotalPetrol * 12;
  const annualTotalEV = monthlyTotalEV * 12;
  
  const evIsWinner = monthlyTotalEV < monthlyTotalPetrol;
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-500" /> Detailed Cost Breakdown
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200/70 dark:border-slate-700/70">
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-900 dark:text-white">
                Cost Item
              </th>
              <th className="px-4 py-3 text-right text-sm font-bold text-slate-900 dark:text-white">
                Petrol/Diesel
              </th>
              <th className={`px-4 py-3 text-right text-sm font-bold ${evIsWinner ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                Electric
              </th>
              <th className="px-4 py-3 text-right text-sm font-bold text-slate-900 dark:text-white">
                Savings
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Monthly Fuel */}
            <tr className="border-b border-slate-200/50 hover:bg-slate-50/50 dark:border-slate-700/50 dark:hover:bg-slate-800/30">
              <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Monthly Fuel/Electricity
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                {formatCurrency(monthlyFuelCostPetrol)}
              </td>
              <td className={`px-4 py-3 text-right text-sm font-semibold ${monthlyFuelCostEV < monthlyFuelCostPetrol ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                {formatCurrency(monthlyFuelCostEV)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-400">
                {formatCurrency(monthlyFuelCostPetrol - monthlyFuelCostEV)}
              </td>
            </tr>
            
            {/* Monthly Maintenance */}
            <tr className="border-b border-slate-200/50 hover:bg-slate-50/50 dark:border-slate-700/50 dark:hover:bg-slate-800/30">
              <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Monthly Maintenance
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                {formatCurrency(monthlyMaintenancePetrol)}
              </td>
              <td className={`px-4 py-3 text-right text-sm font-semibold ${monthlyMaintenanceEV < monthlyMaintenancePetrol ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                {formatCurrency(monthlyMaintenanceEV)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-400">
                {formatCurrency(monthlyMaintenancePetrol - monthlyMaintenanceEV)}
              </td>
            </tr>
            
            {/* Monthly Insurance */}
            <tr className="border-b border-slate-200/50 hover:bg-slate-50/50 dark:border-slate-700/50 dark:hover:bg-slate-800/30">
              <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Monthly Insurance
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-white">
                {formatCurrency(monthlyInsurancePetrol)}
              </td>
              <td className={`px-4 py-3 text-right text-sm font-semibold ${monthlyInsuranceEV < monthlyInsurancePetrol ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                {formatCurrency(monthlyInsuranceEV)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-slate-600 dark:text-slate-400">
                {formatCurrency(monthlyInsurancePetrol - monthlyInsuranceEV)}
              </td>
            </tr>
            
            {/* Monthly Total */}
            <tr className="border-b-2 border-slate-200/70 bg-slate-50/50 font-bold dark:border-slate-700/70 dark:bg-slate-800/50">
              <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                Total Per Month
              </td>
              <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">
                {formatCurrency(monthlyTotalPetrol)}
              </td>
              <td className={`px-4 py-3 text-right text-sm ${evIsWinner ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                {formatCurrency(monthlyTotalEV)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-emerald-700 dark:text-emerald-300">
                {formatCurrency(monthlyTotalPetrol - monthlyTotalEV)}
              </td>
            </tr>
            
            {/* Annual Total */}
            <tr className="bg-emerald-50/50 font-bold dark:bg-emerald-900/10">
              <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                Total Per Year
              </td>
              <td className="px-4 py-3 text-right text-sm text-slate-900 dark:text-white">
                {formatCurrency(annualTotalPetrol)}
              </td>
              <td className={`px-4 py-3 text-right text-sm ${evIsWinner ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-900 dark:text-white'}`}>
                {formatCurrency(annualTotalEV)}
              </td>
              <td className="px-4 py-3 text-right text-sm text-emerald-700 dark:text-emerald-300">
                {formatCurrency(annualTotalPetrol - annualTotalEV)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
