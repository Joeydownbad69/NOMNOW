import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurant = searchParams.get('restaurant');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const supabase = await createClient();

    // If filtering by restaurant, use a different approach
    if (restaurant) {
      // First get the restaurant ID
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('slug', restaurant)
        .single();

      if (restaurantError || !restaurantData) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
      }

      // Then query menu items by restaurant_id
      let query = supabase
        .from('menu_items')
        .select('*, categories(name)')
        .eq('restaurant_id', restaurantData.id)
        .eq('available', true);

      if (category) {
        query = query.eq('categories.slug', category);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data);
    }

    // No restaurant filter — return all
    let query = supabase
      .from('menu_items')
      .select('*, categories(name), restaurants(name, slug)')
      .eq('available', true);

    if (category) {
      query = query.eq('categories.slug', category);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}