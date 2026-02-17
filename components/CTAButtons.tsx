'use client';

import Link from 'next/link';

interface CTAButtonsProps {
  vehicleId: string;
  vehicleName: string;
}

export default function CTAButtons({ vehicleId, vehicleName }: CTAButtonsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50/50 p-8 dark:border-slate-700 dark:from-slate-900 dark:to-slate-900/50">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">💰 Decision Tools</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* TCO Calculator Button */}
        <Link
          href={`/tools/tco-calculator?vehicleId=${vehicleId}`}
          className="group flex items-center gap-4 rounded-2xl border-2 border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 px-6 py-4 transition hover:border-emerald-400 hover:shadow-lg dark:border-emerald-500/30 dark:from-emerald-900/20 dark:to-teal-900/20 dark:hover:border-emerald-400 dark:hover:shadow-lg"
        >
          <span className="text-3xl group-hover:scale-110 transition">💰</span>
          <div className="text-left">
            <h4 className="font-bold text-emerald-700 dark:text-emerald-300">Calculate Savings</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Total cost of ownership vs petrol</p>
          </div>
          <span className="ml-auto text-lg text-emerald-600 dark:text-emerald-400">→</span>
        </Link>

        {/* Route Planner Button */}
        <Link
          href={`/tools/route-planner?vehicleId=${vehicleId}`}
          className="group flex items-center gap-4 rounded-2xl border-2 border-orange-200 bg-linear-to-br from-orange-50 to-amber-50 px-6 py-4 transition hover:border-orange-400 hover:shadow-lg dark:border-orange-500/30 dark:from-orange-900/20 dark:to-amber-900/20 dark:hover:border-orange-400 dark:hover:shadow-lg"
        >
          <span className="text-3xl group-hover:scale-110 transition">🗺️</span>
          <div className="text-left">
            <h4 className="font-bold text-orange-700 dark:text-orange-300">Plan Your Route</h4>
            <p className="text-xs text-orange-600 dark:text-orange-400">Check journey feasibility</p>
          </div>
          <span className="ml-auto text-lg text-orange-600 dark:text-orange-400">→</span>
        </Link>
      </div>

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-2xl mb-2">⚡</p>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Fast Charging Available</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            DC fast charging networks available across Sri Lanka for extended journeys.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-2xl mb-2">💚</p>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Low Operating Costs</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Electricity is significantly cheaper than fuel, reducing your per-km cost.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
          <p className="text-2xl mb-2">🌍</p>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Zero Emissions</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Help reduce carbon emissions and improve air quality in your community.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 rounded-2xl border-2 border-emerald-600 bg-linear-to-r from-emerald-600 to-teal-600 p-6 text-center dark:border-emerald-400 dark:from-emerald-600 dark:to-teal-600">
        <h3 className="text-xl font-bold text-white mb-2">Ready to Go Electric?</h3>
        <p className="text-emerald-100 text-sm mb-4">
          This {vehicleName} could be your next vehicle. Compare with similar options or learn more about the EV buying process.
        </p>
        <button className="rounded-lg bg-white px-6 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:hover:bg-slate-100">
          Contact Dealer
        </button>
      </div>
    </div>
  );
}
