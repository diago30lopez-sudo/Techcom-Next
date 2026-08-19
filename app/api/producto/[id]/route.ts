import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id, 10);
    if (!productId) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });

    // Leemos la variante específica
    const rows = await odooCall<any[]>('product.product', 'read', [[productId], [
      'name', 'list_price', 'description', 'description_sale',
      'image_1920', 'product_tmpl_id', 'product_template_attribute_value_ids', 'type',
    ]]);

    const p = rows && rows[0];
    if (!p) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });

    const base = (process.env.ODOO_URL || 'http://localhost:8069').replace(/\/$/, '');

    // --- GALERÍA ---
    const gallery: { id: string; url: string }[] = [];
    
    // 1. Imagen principal de la variante
    if (p.image_1920) {
      gallery.push({ id: `main-${p.id}`, url: `${base}/web/image/product.product/${p.id}/image_1920/800x800` });
    }
    
    // 2. Imágenes extra del template (si la variante no tiene suficientes)
    if (p.product_tmpl_id) {
      const tmplId = Array.isArray(p.product_tmpl_id) ? p.product_tmpl_id[0] : p.product_tmpl_id;
      try {
        const tmpl = await odooCall<any[]>('product.template', 'read', [[tmplId], ['product_template_image_ids']]);
        if (tmpl && tmpl[0] && tmpl[0].product_template_image_ids) {
           tmpl[0].product_template_image_ids.forEach((imgId: number) => {
              // Evitar duplicados si la imagen principal ya está
              if (!gallery.some(g => g.url.includes(imgId.toString()))) {
                 gallery.push({ id: `extra-${imgId}`, url: `${base}/web/image/product.image/${imgId}/image_1920/800x800` });
              }
           });
        }
      } catch (e) { console.warn('Error leyendo imagenes extra', e); }
    }

    // --- CATEGORÍAS Y VARIANTES ---
    let categories: { id: number; name: string }[] = [];
    let attributes: string[] = [];
    
    if (p.product_tmpl_id) {
      const tmplId = Array.isArray(p.product_tmpl_id) ? p.product_tmpl_id[0] : p.product_tmpl_id;
      
      // Leer Template para Categorías y Nombre Base
      const tmpl = await odooCall<any[]>('product.template', 'read', [[tmplId], ['public_categ_ids', 'name']]);
      
      if (tmpl && tmpl[0]) {
        // Categorías
        if (tmpl[0].public_categ_ids && tmpl[0].public_categ_ids.length > 0) {
          const cats = await odooCall<any[]>('product.public.category', 'read', [tmpl[0].public_categ_ids, ['name']]);
          categories = (cats || []).map((c: any) => ({ id: c.id, name: c.name }));
        }
        
        // Nombre Base para construir el título limpio
        const baseName = tmpl[0].name;
        
        // Leer Valores de Atributos (RAM, CPU, etc.)
        if (p.product_template_attribute_value_ids && p.product_template_attribute_value_ids.length > 0) {
          try {
            // Leemos los registros intermedios para obtener el valor real
            const ptavs = await odooCall<any[]>('product.template.attribute.value', 'read', [
              p.product_template_attribute_value_ids, 
              ['product_attribute_value_id']
            ]);
            
            const valueIds = ptavs.map((ptav: any) => 
              Array.isArray(ptav.product_attribute_value_id) ? ptav.product_attribute_value_id[0] : ptav.product_attribute_value_id
            ).filter(Boolean);

            if (valueIds.length > 0) {
              const vals = await odooCall<any[]>('product.attribute.value', 'read', [valueIds, ['name']]);
              attributes = vals.map((v: any) => v.name);
              
              // Renombrar producto: "Base - Atributo1, Atributo2"
              p.name = `${baseName} - ${attributes.join(', ')}`;
            }
          } catch (e) {
            console.warn('Error leyendo atributos detallados', e);
            // Si falla, mantenemos el nombre original de Odoo
          }
        }
      }
    }

    return NextResponse.json({
      id: p.id,
      name: p.name,
      price: p.list_price,
      shortDescription: p.description_sale || '',
      descriptionHtml: p.description || '',
      variantId: p.id,
      categories,
      attributes, // Lista de strings ["8GB RAM", "Dual Core"]
      gallery,
    });
  } catch (e) {
    console.error('Error en /api/producto:', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}