import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// POST - Create new charging station
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const { data: station, error } = await supabase
      .from('charging_stations')
      .insert([{
        ...data,
        updated_at: new Date().toISOString(),
      }] as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating charging station:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(station);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
