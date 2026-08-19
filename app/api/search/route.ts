import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    if (!q) return NextResponse.json({ products: [] });

    const ids = await odooCall<number[]>('product.template', 'search', [
      [['website_published', '=', true], '|', ['name', 'ilike', q], ['description_sale', 'ilike', q]]
    ], { limit: 5 });

    if (!ids.length) return NextResponse.json({ products: [] });

    const products = await odooCall<any[]>('product.template', 'read', [ids], { fields: ['id', 'name'] });
    return NextResponse.json({ products: products.map((p) => ({ id: p.id, name: p.name })) });
  } catch {
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}