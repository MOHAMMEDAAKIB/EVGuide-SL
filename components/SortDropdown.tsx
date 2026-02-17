'use client';

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low-High' },
  { value: 'price_desc', label: 'Price: High-Low' },
  { value: 'range_desc', label: 'Range: High-Low' },
  { value: 'range_asc', label: 'Range: Low-High' },
  { value: 'battery_desc', label: 'Battery: High-Low' },
  { value: 'battery_asc', label: 'Battery: Low-High' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Sort
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none dark:text-white"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
