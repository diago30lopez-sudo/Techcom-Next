import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export async function POST(req: Request) {
  try {
    const { lines, customer } = await req.json();
    if (!lines || !lines.length) return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 });

    // Crear/obtener partner
    let partnerId: number;
    const existing = await odooCall<any[]>('res.partner', 'search_read', [[['email', '=', customer.email]], ['id']], { limit: 1 });
    if (existing?.length) {
      partnerId = existing[0].id;
    } else {
      partnerId = await odooCall<number>('res.partner', 'create', [{
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        street: customer.address || '',
      }]);
    }

    const orderLines = lines.map((l: any) => [0, 0, {
      product_id: l.variantId,
      product_uom_qty: l.qty,
      price_unit: l.price,
    }]);

    const orderId = await odooCall<number>('sale.order', 'create', [{
      partner_id: partnerId,
      order_line: orderLines,
      note: 'Pedido web ServiTx',
      client_order_ref: `WEB-${Date.now()}`,
    }]);

    const order = await odooCall<any[]>('sale.order', 'read', [[orderId]], { fields: ['name', 'amount_total'] });
    return NextResponse.json({ ok: true, orderName: order[0]?.name, total: order[0]?.amount_total });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}