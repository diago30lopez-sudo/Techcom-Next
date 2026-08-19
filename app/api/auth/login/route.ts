import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    // Autenticar contra Odoo (res.users)
    const users = await odooCall<any[]>('res.users', 'search_read', [
      [['login', '=', email], ['active', '=', true]],
      ['id', 'name', 'email', 'phone'],
    ], { limit: 1 });

    if (!users || !users.length) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    // Verificar contraseña via authenticate del servicio common
    const ODOO_URL = process.env.ODOO_URL || 'http://localhost:8069';
    const ODOO_DB = process.env.ODOO_DB || 'servitx';
    const authRes = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', method: 'call',
        params: { service: 'common', method: 'authenticate', args: [ODOO_DB, email, password, {}] },
      }),
    });
    const authData = await authRes.json();
    if (!authData.result || typeof authData.result !== 'number') {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}