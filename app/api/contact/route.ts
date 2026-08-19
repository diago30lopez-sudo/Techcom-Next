import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

// Escapa caracteres para evitar inyección de HTML
const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // 👉 Destinatario: el Gmail que está en ODOO_USER del .env.local
    const destino = process.env.ODOO_USER;

    if (!destino) {
      return NextResponse.json({ error: 'ODOO_USER no está definido en .env.local' }, { status: 500 });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #e2e8f0;border-radius:8px;">
        <h2 style="color:#1e3a8a;">Nuevo mensaje desde la web ServiTx</h2>
        <p><strong>Nombre:</strong> ${esc(name)}</p>
        <p><strong>Correo del cliente:</strong> ${esc(email)}</p>
        <p><strong>Teléfono:</strong> ${esc(phone) || 'No proporcionado'}</p>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:15px 0;" />
        <p style="white-space:pre-line;">${esc(message)}</p>
        <p style="color:#64748b;font-size:12px;margin-top:20px;">
          Responde directamente a este correo: al pulsar Responder irás al correo del cliente.
        </p>
      </div>
    `;

    // Se crea el correo en Odoo y se envía al Gmail de ODOO_USER
    const mailId = await odooCall<number>('mail.mail', 'create', [
      {
        subject: `📩 Contáctenos ServiTx: ${esc(name)}`,
        body_html: html,
        email_to: destino,
        email_from: destino,
        reply_to: esc(email), // para que al responder le llegue al cliente
      },
    ]);

    await odooCall('mail.mail', 'send', [[mailId]]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('ERROR en /api/contact:', e);
    return NextResponse.json(
      { error: 'No se pudo enviar. Revisa el servidor de correo saliente de Odoo.' },
      { status: 500 }
    );
  }
}