import { NextResponse } from 'next/server';
import { createSaleOrder } from '@/lib/odoo';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.lines || !body.lines.length) {
      return NextResponse.json({ error: 'Cesta vacía' }, { status: 400 });
    }
    const order = await createSaleOrder(body);
    return NextResponse.json({ order });
  } catch (err: any) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: err.message || 'Error al crear pedido' }, { status: 500 });
  }
}