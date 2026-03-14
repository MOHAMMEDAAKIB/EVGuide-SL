import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// POST - Create new fuel price
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // If setting this price as active, deactivate other prices for the same fuel type
    if (data.is_active) {
      await supabase
        .from('fuel_prices')
        .update({ is_active: false } as never)
        .eq('fuel_type', data.fuel_type)
        .eq('is_active', true);
    }

    const { data: price, error } = await supabase
      .from('fuel_prices')
      .insert([{
        ...data,
        updated_at: new Date().toISOString(),
      }] as never)
      .select()
      .single();

    if (error) {
      console.error('Error creating fuel price:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(price);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
