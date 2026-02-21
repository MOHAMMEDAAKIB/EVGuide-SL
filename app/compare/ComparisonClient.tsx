'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Vehicle } from '@/types';
import ComparisonTable from '@/components/comparison/ComparisonTable';
import VehicleSelector from '@/components/comparison/VehicleSelector';
import { exportComparisonToPdf, copyComparisonLink } from '@/lib/exportPdf';
import { Link2, FileDown, Check } from 'lucide-react';

interface ComparisonClientProps {
  vehicles: Vehicle[];
}

export default function ComparisonClient({ vehicles }: ComparisonClientProps) {
  const router = useRouter();
  const tableRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [replacingVehicleId, setReplacingVehicleId] = useState<string | undefined>();

  const vehicleIds = vehicles.map(v => v.id);

  const handleRemoveVehicle = (vehicleId: string) => {
    const newIds = vehicleIds.filter(id => id !== vehicleId);
    
    if (newIds.length < 2) {
      // Redirect to browse page if less than 2 vehicles remain
      router.push('/vehicles');
      return;
    }
    
    router.push(`/compare?ids=${newIds.join(',')}`);
  };

  const handleChangeVehicle = (vehicleId: string) => {
    setReplacingVehicleId(vehicleId);
    setSelectorOpen(true);
  };

  const handleAddVehicle = () => {
    setReplacingVehicleId(undefined);
    setSelectorOpen(true);
  };

  const handleSelectVehicle = (newVehicleId: string) => {
    let newIds: string[];
    
    if (replacingVehicleId) {
      // Replace existing vehicle
      newIds = vehicleIds.map(id => id === replacingVehicleId ? newVehicleId : id);
    } else {
      // Add new vehicle
      newIds = [...vehicleIds, newVehicleId];
    }
    
    router.push(`/compare?ids=${newIds.join(',')}`);
  };

  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    
    setIsExporting(true);
    try {
      const vehicleNames = vehicles.map(v => `${v.make}-${v.model}`);
      await exportComparisonToPdf(tableRef.current, vehicleNames);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await copyComparisonLink(vehicleIds);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <section className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/95 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/95">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Back Button & Title */}
            <div className="flex items-center gap-4">
              <Link
                href="/vehicles"
                className="flex items-center gap-2 rounded-lg border border-slate-200/70 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-emerald-600 dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
              >
                ← Back
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  Compare Vehicles ({vehicles.length})
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                  Side-by-side comparison of specs and features
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {vehicles.length < 3 && (
                <button
                  onClick={handleAddVehicle}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                >
                  + Add Vehicle
                </button>
              )}
              
              <button
                onClick={handleCopyLink}
                disabled={isCopied}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" /> Share
                  </>
                )}
              </button>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600 flex items-center gap-2"
              >
                {isExporting ? 'Exporting...' : (
                  <>
                    <FileDown className="w-4 h-4" /> Export PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ComparisonTable
          ref={tableRef}
          vehicles={vehicles}
          onRemoveVehicle={handleRemoveVehicle}
          onChangeVehicle={handleChangeVehicle}
        />

        {/* Action Buttons Below Table */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={`/vehicles/${vehicles[0].id}`}
            className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            View Full Details
          </Link>
          
          <button
            disabled
            className="rounded-lg bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500 opacity-60 dark:bg-slate-800 dark:text-slate-400"
            title="TCO Calculator coming soon"
          >
            Calculate TCO for Winners
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 rounded-xl border-l-4 border-emerald-600 bg-emerald-50 p-4 dark:border-emerald-400 dark:bg-emerald-900/20">
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
            💡 How to read this comparison
          </p>
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            Green highlights (✓✓) indicate the best value in each category. Winner count shows overall performance. 
            Click category headers to collapse/expand sections.
          </p>
        </div>
      </section>

      {/* Vehicle Selector Modal */}
      <VehicleSelector
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleSelectVehicle}
        currentVehicleIds={vehicleIds}
        replacingVehicleId={replacingVehicleId}
      />
    </main>
  );
}
