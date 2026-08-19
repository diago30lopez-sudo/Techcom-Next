import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export async function GET() {
  try {
    const prods = await odooCall<any[]>('product.template', 'search_read', [
      [['website_published', '=', true], ['type', '!=', 'service']],
    ], { fields: ['public_categ_ids'], limit: 0 });
    const set = new Set<number>();
    prods.forEach((p) => (p.public_categ_ids || []).forEach((i: number) => set.add(i)));
    const ids = [...set];
    if (!ids.length) return NextResponse.json({ categories: [] });
    const cats = await odooCall<any[]>('product.public.category', 'read', [ids], { fields: ['id', 'name'] });
    return NextResponse.json({ categories: cats });
  } catch (e) {
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}