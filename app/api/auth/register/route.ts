import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }

    // Verificar si ya existe
    const existing = await odooCall<any[]>('res.users', 'search_read', [[['login', '=', email]], ['id']], { limit: 1 });
    if (existing && existing.length) {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 409 });
    }

    // Crear usuario en Odoo (necesita grupo de portal para login web)
    const userId = await odooCall<number>('res.users', 'create', [{
      name,
      login: email,
      email,
      phone: phone || '',
      password,
      groups_id: [[6, 0, [await getPortalGroupId()]]],
    }]);

    const user = { id: userId, name, email, phone: phone || '' };
    return NextResponse.json({ user });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function getPortalGroupId(): Promise<number> {
  const ids = await odooCall<number[]>('res.groups', 'search', [[['name', '=', 'Portal']]]);
  return ids?.[0] || 0;
}