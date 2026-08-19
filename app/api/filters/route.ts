import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export const dynamic = 'force-dynamic';

// Caché simple en memoria
let cachedFilters: any = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 1000; // 60 segundos

export async function GET() {
  const now = Date.now();

  // Si tenemos caché y no ha expirado, devolvemos eso (INSTANTÁNEO)
  if (cachedFilters && (now - lastFetch < CACHE_DURATION)) {
    return NextResponse.json(cachedFilters);
  }

  try {
    // 1. Buscar Templates con variantes (para ignorar servicios)
    const productIds = await odooCall<number[]>('product.template', 'search', [
      [['type', '=', 'product'], ['attribute_line_ids', '!=', false]]
    ]);

    if (!productIds || productIds.length === 0) {
      return NextResponse.json({ attributes: [] });
    }

    // 2. Leer líneas de atributos
    const lines = await odooCall<any[]>('product.template.attribute.line', 'search_read', [
      [['product_tmpl_id', 'in', productIds]],
      ['attribute_id', 'value_ids']
    ]);

    if (!lines || lines.length === 0) {
      return NextResponse.json({ attributes: [] });
    }

    // 3. Agrupar
    const attrMap = new Map<number, { name: string; values: Set<number> }>();
    const allValueIds = new Set<number>();

    lines.forEach(line => {
      const attrId = Array.isArray(line.attribute_id) ? line.attribute_id[0] : line.attribute_id;
      const attrName = Array.isArray(line.attribute_id) ? line.attribute_id[1] : 'Atributo';
      
      if (!attrMap.has(attrId)) attrMap.set(attrId, { name: attrName, values: new Set() });
      if (line.value_ids) line.value_ids.forEach((vid: number) => {
        attrMap.get(attrId)?.values.add(vid);
        allValueIds.add(vid);
      });
    });

    // 4. Leer nombres de valores
    let valuesMap: Record<number, string> = {};
    if (allValueIds.size > 0) {
      const values = await odooCall<any[]>('product.attribute.value', 'read', [
        Array.from(allValueIds), ['name']
      ]);
      values.forEach(v => valuesMap[v.id] = v.name);
    }

    // 5. Estructurar
    const attributes = Array.from(attrMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      values: Array.from(data.values)
        .map(vid => ({ id: vid, name: valuesMap[vid] }))
        .filter(v => v.name)
        .sort((a, b) => a.name.localeCompare(b.name))
    })).filter(attr => attr.values.length > 0);

    const result = { attributes };
    
    // Guardar en caché
    cachedFilters = result;
    lastFetch = now;

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ attributes: [] }, { status: 500 });
  }
}