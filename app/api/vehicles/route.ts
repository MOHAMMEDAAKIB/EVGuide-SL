import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = (searchParams.get('search') || '').trim();
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : null;
    const priceMaxParam = searchParams.get('priceMax');
    const minRangeParam = searchParams.get('minRange');

    const priceMax = priceMaxParam ? Number(priceMaxParam) : null;
    const minRange = minRangeParam ? Number(minRangeParam) : null;

    const hasPriceFilter = Number.isFinite(priceMax) && (priceMax as number) > 0;
    const hasRangeFilter = Number.isFinite(minRange) && (minRange as number) > 0;

    if (!search && !hasPriceFilter && !hasRangeFilter) {
      return NextResponse.json([]);
    }

    let query = supabase
      .from('vehicles')
      .select('*')
      .order('price_lkr', { ascending: true });

    if (search) {
      query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%`);
    }

    if (hasPriceFilter) {
      query = query.lte('price_lkr', priceMax as number);
    }

    if (hasRangeFilter) {
      query = query.gte('range_sl_estimate', minRange as number);
    }

    if (Number.isFinite(limit) && (limit as number) > 0) {
      query = query.limit(limit as number);
    }

    const { data: vehicles, error } = await query;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(vehicles || []);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
