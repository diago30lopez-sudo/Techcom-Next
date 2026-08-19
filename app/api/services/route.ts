import { NextResponse } from 'next/server';
import { odooCall, imgUrl, hasImage, variantId } from '@/lib/odoo';

export async function GET() {
  try {
    const ids = await odooCall<number[]>('product.template', 'search', [[['website_published', '=', true], ['type', '=', 'service']]]);
    if (!ids || !ids.length) return NextResponse.json({ services: [] });
    const raw = await odooCall<any[]>('product.template', 'read', [ids], {
      fields: ['id', 'name', 'list_price', 'description_sale', 'image_1920', 'image_512', 'product_variant_id'],
    });
    return NextResponse.json({
      services: raw.map((p) => ({
        id: p.id, name: p.name, list_price: p.list_price,
        description: p.description_sale || '', image: hasImage(p) ? imgUrl(p.id, 512) : '',
        variantId: variantId(p),
      })),
    });
  } catch {
    return NextResponse.json({ services: [] }, { status: 500 });
  }
}