import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId'));
    if (!userId) return NextResponse.json({ orders: [] });

    const orders = await odooCall<any[]>('sale.order', 'search_read', [
      [['partner_id', '=', userId]],
      ['id', 'name', 'date_order', 'amount_total', 'state'],
      { order: 'date_order desc' },
    ]);
    return NextResponse.json({ orders: orders || [] });
  } catch {
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}