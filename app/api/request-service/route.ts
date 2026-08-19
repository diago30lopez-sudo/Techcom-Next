import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    await odooCall('crm.lead', 'create', [{
      name: 'Solicitud de servicio web: ' + name,
      description: 'El cliente solicitó este servicio desde la página web.',
    }]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}