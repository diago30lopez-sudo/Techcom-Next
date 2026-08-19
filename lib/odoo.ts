const ODOO_URL = process.env.ODOO_URL || 'http://localhost:8069';
const ODOO_DB = process.env.ODOO_DB || 'servitx';
const ODOO_USER = process.env.ODOO_USER || '';
const ODOO_API_KEY = process.env.ODOO_API_KEY || '';
export const ODOO_BASE = ODOO_URL;

let cachedUid: number | null = null;

async function getUid(): Promise<number> {
  if (cachedUid) return cachedUid;
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call',
      params: { service: 'common', method: 'authenticate', args: [ODOO_DB, ODOO_USER, ODOO_API_KEY, {}] },
    }),
    cache: 'no-store',
  });
  const data = await res.json();
  if (!data.result) throw new Error('API Key o Usuario inválidos');
  cachedUid = data.result as number;
  return cachedUid;
}

export async function odooCall<T = any>(model: string, method: string, args: any[] = [], kwargs: Record<string, any> = {}): Promise<T> {
  const uid = await getUid();
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call',
      params: { service: 'object', method: 'execute_kw', args: [ODOO_DB, uid, ODOO_API_KEY, model, method, args, kwargs] },
    }),
    cache: 'no-store',
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.data?.message || JSON.stringify(data.error));
  return data.result as T;
}

export type OdooProduct = {
  id: number;
  name: string;
  list_price: number;
  website_url: string;
  description_sale: string | false;
  product_variant_id: any;
  public_categ_ids: number[];
  type: string;
  image_1920: string | false;
  image_512: string | false;
};

export type OdooCategory = { id: number; name: string };

export function variantId(p: OdooProduct): number {
  return Array.isArray(p.product_variant_id) ? p.product_variant_id[0] : p.product_variant_id;
}

export function imgUrl(id: number, size: 256 | 512 | 1920 = 512): string {
  return `${ODOO_URL}/web/image/product.template/${id}/image_${size}`;
}

export function hasImage(p: OdooProduct): boolean {
  return !!(p.image_1920 || p.image_512);
}

export function money(n: number): string {
  return '$' + (n || 0).toFixed(2);
}

const FIELDS = ['id', 'name', 'list_price', 'website_url', 'description_sale', 'product_variant_id', 'public_categ_ids', 'type', 'image_1920', 'image_512'];

export async function getProducts(limit = 0): Promise<OdooProduct[]> {
  const ids = await odooCall<number[]>(
    'product.template', 'search',
    [[['website_published', '=', true]]],
    { order: 'website_sequence asc', limit }
  );
  if (!ids || !ids.length) return [];
  return await odooCall<OdooProduct[]>('product.template', 'read', [ids], { fields: FIELDS });
}

export async function getCategories(): Promise<OdooCategory[]> {
  const ids = await odooCall<number[]>(
    'product.public.category', 'search', [[]], { order: 'sequence asc', limit: 0 }
  );
  if (!ids || !ids.length) return [];
  return await odooCall<OdooCategory[]>('product.public.category', 'read', [ids], { fields: ['id', 'name'] });
}

export async function getCategoryNameMap(): Promise<Record<number, string>> {
  const cats = await getCategories();
  const map: Record<number, string> = {};
  cats.forEach((c) => { map[c.id] = c.name; });
  return map;
}

export async function sendContactEmail(dataForm: { name: string; email: string; phone: string; message: string }) {
  const uid = await getUid();
  const user = await odooCall<any[]>('res.users', 'read', [[uid]], { fields: ['email'] });
  const emailTo = user[0]?.email || ODOO_USER;

  try {
    await odooCall('crm.lead', 'create', [{
      name: 'Web: ' + dataForm.name,
      contact_name: dataForm.name,
      email_from: dataForm.email,
      phone: dataForm.phone,
      description: dataForm.message,
    }]);
  } catch {}

  const body = `<h2> Nueva consulta web</h2><p><b>Nombre:</b> ${dataForm.name}</p><p><b>Correo:</b> ${dataForm.email}</p><p><b>Teléfono:</b> ${dataForm.phone || '-'}</p><p><b>Mensaje:</b><br/>${dataForm.message.replace(/\n/g, '<br/>')}</p>`;
  const mailId = await odooCall<number>('mail.mail', 'create', [{
    subject: '📩 Web: ' + dataForm.name,
    body_html: body,
    email_to: emailTo,
    email_from: emailTo,
    reply_to: dataForm.email,
  }]);
  await odooCall('mail.mail', 'send', [[mailId]]);
  return true;
}

export async function createSaleOrder(payload: {
  name: string; email: string; phone: string; address: string; payMethod: string;
  lines: { variantId: number; qty: number; price: number; name: string }[];
}) {
  const partnerId = await odooCall<number>('res.partner', 'create', [{
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    street: payload.address,
  }]);
  const lines = payload.lines.map((l) => [0, 0, {
    product_id: l.variantId,
    product_uom_qty: l.qty,
    price_unit: l.price,
  }]);
  const orderId = await odooCall<number>('sale.order', 'create', [{
    partner_id: partnerId,
    order_line: lines,
    note: 'Web · Pago: ' + payload.payMethod,
  }]);
  const order = await odooCall<any>('sale.order', 'read', [[orderId]], { fields: ['name', 'amount_total'] });
  return { id: orderId, name: order[0].name, total: order[0].amount_total };
}