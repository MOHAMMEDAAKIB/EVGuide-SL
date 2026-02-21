'use client';

import { forwardRef, useState } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/types';
import { 
  compareVehicleSpecs, 
  calculateWinnerCounts, 
  groupSpecsByCategory,
  SpecCategory
} from '@/lib/utils';
import ComparisonRow from './ComparisonRow';
import { GitCompare, X, Car, ChevronDown, ChevronUp, DollarSign, Battery, Rocket, Zap, Ruler } from 'lucide-react';

interface ComparisonTableProps {
  vehicles: Vehicle[];
  onRemoveVehicle: (vehicleId: string) => void;
  onChangeVehicle: (vehicleId: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'dollar-sign': <DollarSign className="w-5 h-5 text-emerald-600" />,
    'battery': <Battery className="w-5 h-5 text-green-500" />,
    'rocket': <Rocket className="w-5 h-5 text-red-500" />,
    'zap': <Zap className="w-5 h-5 text-yellow-500" />,
    'ruler': <Ruler className="w-5 h-5 text-blue-500" />,
  };
  
  return iconMap[iconName] || <span>{iconName}</span>;
};

const ComparisonTable = forwardRef<HTMLDivElement, ComparisonTableProps>(
  ({ vehicles, onRemoveVehicle, onChangeVehicle }, ref) => {
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

    const specs = compareVehicleSpecs(vehicles);
    const categories = groupSpecsByCategory(specs);
    const winnerCounts = calculateWinnerCounts(specs, vehicles.length);
    const totalSpecs = specs.filter(s => s.comparisonType !== 'none').length;

    const toggleCategory = (categoryName: string) => {
      setCollapsedCategories(prev => {
        const next = new Set(prev);
        if (next.has(categoryName)) {
          next.delete(categoryName);
        } else {
          next.add(categoryName);
        }
        return next;
      });
    };

    return (
      <div ref={ref} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        {/* Horizontal scroll container for mobile */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 border-collapse">
            {/* Header Row with Vehicle Cards */}
            <thead>
              <tr className="border-b-2 border-slate-200/70 bg-slate-50/50 dark:border-slate-700/70 dark:bg-slate-800/50">
                <th className="sticky left-0 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-6 text-left font-bold text-slate-900 dark:text-white border-r border-slate-200/70 dark:border-slate-700/70 z-20">
                  <span className="text-sm">Specification</span>
                </th>
                {vehicles.map((vehicle) => (
                  <th
                    key={vehicle.id}
                    className="px-4 py-6 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      {/* Vehicle Image */}
                      <div className="relative h-32 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                        {vehicle.image_url ? (
                          <Image
                            src={vehicle.image_url}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            fill
                            className="object-cover"
                            sizes="300px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-4xl text-slate-400">
                            <Car className="w-12 h-12" />
                          </div>
                        )}
                      </div>

                      {/* Vehicle Name */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {vehicle.make}
                        </h3>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                          {vehicle.model}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {vehicle.year} • {vehicle.body_type}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => onChangeVehicle(vehicle.id)}
                          className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 flex items-center gap-1"
                        >
                          <GitCompare className="w-3 h-3" /> Change
                        </button>
                        <button
                          onClick={() => onRemoveVehicle(vehicle.id)}
                          className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body with Category Groups */}
            <tbody>
              {categories.map((category: SpecCategory, categoryIndex: number) => {
                const isCollapsed = collapsedCategories.has(category.name);
                
                return (
                  <tbody key={categoryIndex}>
                    {/* Category Header */}
                    <tr className="bg-slate-100/70 dark:bg-slate-800/70 border-y border-slate-200/70 dark:border-slate-700/70">
                      <td
                        colSpan={vehicles.length + 1}
                        className="px-4 py-3"
                      >
                        <button
                          onClick={() => toggleCategory(category.name)}
                          className="flex w-full items-center justify-between font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                        >
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category.icon)}
                            <span className="text-sm uppercase tracking-wide">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400">
                            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                          </span>
                        </button>
                      </td>
                    </tr>

                    {/* Category Specs */}
                    {!isCollapsed && category.specs.map((spec, specIndex) => (
                      <ComparisonRow key={specIndex} spec={spec} />
                    ))}
                  </tbody>
                );
              })}

              {/* Winner Summary Row */}
              <tr className="border-t-2 border-slate-200/70 bg-emerald-50/50 dark:border-slate-700/70 dark:bg-emerald-900/10">
                <td className="sticky left-0 bg-emerald-50/50 dark:bg-emerald-900/10 px-4 py-4 font-bold text-slate-900 dark:text-white border-r border-slate-200/70 dark:border-slate-700/70 z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span className="text-sm">Winner Count</span>
                  </div>
                </td>
                {winnerCounts.map((count, index) => (
                  <td
                    key={index}
                    className="px-4 py-4 text-center font-bold text-emerald-700 dark:text-emerald-300"
                  >
                    <div className="flex items-center justify-center gap-2 text-lg">
                      {count > 0 && <span>🏆</span>}
                      <span>
                        {count}/{totalSpecs}
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

ComparisonTable.displayName = 'ComparisonTable';

export default ComparisonTable;
