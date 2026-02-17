import { Suspense } from 'react';
import VehicleBrowseClient from './VehicleBrowseClient';
import { supabase } from '@/lib/supabase';
import { Vehicle } from '@/types';

interface VehiclesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const DEFAULT_PAGE_SIZE = 12;

const getFirstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const parseNumberParam = (value: string | undefined) => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

async function getFilterOptions() {
  const { data } = await supabase.from('vehicles').select('body_type, drive_type') as { data: Array<{ body_type: string | null; drive_type: string | null }> | null };
  const bodyTypes = Array.from(new Set(data?.map((item) => item.body_type).filter((v): v is string => v !== null) ?? []));
  const driveTypes = Array.from(new Set(data?.map((item) => item.drive_type).filter((v): v is string => v !== null) ?? []));

  return {
    bodyTypes: bodyTypes.sort(),
    driveTypes: driveTypes.sort(),
  };
}

async function getVehicles(filters: {
  search: string;
  priceMin: number | null;
  priceMax: number | null;
  rangeMin: number | null;
  rangeMax: number | null;
  body: string;
  drive: string;
  sort: string;
  page: number;
  pageSize: number;
}) {
  let query = supabase.from('vehicles').select('*', { count: 'exact' });

  if (filters.search) {
    query = query.or(`make.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
  }

  if (filters.priceMin !== null) {
    query = query.gte('price_lkr', filters.priceMin);
  }

  if (filters.priceMax !== null) {
    query = query.lte('price_lkr', filters.priceMax);
  }

  if (filters.rangeMin !== null) {
    query = query.gte('range_sl_estimate', filters.rangeMin);
  }

  if (filters.rangeMax !== null) {
    query = query.lte('range_sl_estimate', filters.rangeMax);
  }

  if (filters.body) {
    query = query.eq('body_type', filters.body);
  }

  if (filters.drive) {
    query = query.eq('drive_type', filters.drive);
  }

  switch (filters.sort) {
    case 'price_desc':
      query = query.order('price_lkr', { ascending: false });
      break;
    case 'range_desc':
      query = query.order('range_sl_estimate', { ascending: false });
      break;
    case 'range_asc':
      query = query.order('range_sl_estimate', { ascending: true });
      break;
    case 'battery_desc':
      query = query.order('battery_kwh', { ascending: false });
      break;
    case 'battery_asc':
      query = query.order('battery_kwh', { ascending: true });
      break;
    case 'name_desc':
      query = query.order('make', { ascending: false }).order('model', { ascending: false });
      break;
    case 'name_asc':
      query = query.order('make', { ascending: true }).order('model', { ascending: true });
      break;
    case 'price_asc':
    default:
      query = query.order('price_lkr', { ascending: true });
      break;
  }

  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Error fetching vehicles:', error);
    return { vehicles: [], totalCount: 0 };
  }

  return { vehicles: (data ?? []) as Vehicle[], totalCount: count ?? 0 };
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const search = getFirstParam(resolvedSearchParams.q) ?? '';
  const priceMin = parseNumberParam(getFirstParam(resolvedSearchParams.price_min));
  const priceMax = parseNumberParam(getFirstParam(resolvedSearchParams.price_max));
  const rangeMin = parseNumberParam(getFirstParam(resolvedSearchParams.range_min));
  const rangeMax = parseNumberParam(getFirstParam(resolvedSearchParams.range_max));
  const body = getFirstParam(resolvedSearchParams.body) ?? '';
  const drive = getFirstParam(resolvedSearchParams.drive) ?? '';
  const sort = getFirstParam(resolvedSearchParams.sort) ?? 'price_asc';
  const page = Math.max(parseNumberParam(getFirstParam(resolvedSearchParams.page)) ?? 1, 1);
  const pageSize = Math.min(
    Math.max(parseNumberParam(getFirstParam(resolvedSearchParams.page_size)) ?? DEFAULT_PAGE_SIZE, 6),
    24
  );

  const [vehicleResult, filterOptions] = await Promise.all([
    getVehicles({
      search,
      priceMin,
      priceMax,
      rangeMin,
      rangeMax,
      body,
      drive,
      sort,
      page,
      pageSize,
    }),
    getFilterOptions(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-900 dark:border-t-emerald-400"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading vehicles...</p>
          </div>
        </div>
      }
    >
      <VehicleBrowseClient
        vehicles={vehicleResult.vehicles}
        totalCount={vehicleResult.totalCount}
        bodyTypes={filterOptions.bodyTypes}
        driveTypes={filterOptions.driveTypes}
        page={page}
        pageSize={pageSize}
      />
    </Suspense>
  );
}
