import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!search || search.length < 2) {
      return NextResponse.json([]);
    }

    // Search in make and model (matching actual database schema)
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .or(`make.ilike.%${search}%,model.ilike.%${search}%`)
      .limit(limit);

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
