import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, menu_items(*)')
      .eq('user_id', user.id)
    
    if (cartError || !cartItems?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    
    const total = cartItems.reduce((sum, item) => 
      sum + (item.menu_items.price * item.quantity), 0
    )
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total,
        status: 'pending'
      })
      .select()
      .single()
    
    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }
    
    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price_at_time: item.menu_items.price
    }))
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 })
    }
    
    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', user.id)
    
    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
