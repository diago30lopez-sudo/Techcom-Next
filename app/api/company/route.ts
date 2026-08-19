import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const login = process.env.ODOO_USER || '';
    let name = '';
    let email = login;
    let phone = '';
    let address = '';

    // 1) Buscar el usuario cuyo login es el Gmail del .env.local
    const users = await odooCall<any[]>(
      'res.users',
      'search_read',
      [
        [['login', '=', login]],
        ['name', 'login', 'phone', 'mobile', 'partner_id'],
      ],
      { limit: 1 }
    );

    const user = users && users[0];

    if (user) {
      name = user.name || '';
      email = user.login || login;
      phone = user.mobile || user.phone || '';

      // 2) Dirección de trabajo: el partner del usuario
      const partnerId = Array.isArray(user.partner_id) ? user.partner_id[0] : user.partner_id;

      if (partnerId) {
        const partners = await odooCall<any[]>(
          'res.partner',
          'search_read',
          [
            [['id', '=', partnerId]],
            ['street', 'street2', 'city', 'zip', 'state_id', 'country_id'],
          ],
          { limit: 1 }
        );

        const p = partners && partners[0];
        if (p) {
          // ✅ ARREGLO: evitar repetir ciudad/país si ya vienen en la calle
          const streetFull = [p.street, p.street2].filter(Boolean).join(', ');
          const city = p.city || '';
          const state = (p.state_id && p.state_id[1]) || '';
          const country = (p.country_id && p.country_id[1]) || '';

          const parts = [streetFull];
          if (city && !streetFull.includes(city)) parts.push(city);
          if (state && !streetFull.includes(state)) parts.push(state);
          if (country && !streetFull.includes(country)) parts.push(country);

          address = parts.filter(Boolean).join(', ');
        }
      }
    }

    // 3) ÚLTIMO recurso: la empresa (solo si el usuario no tiene dirección)
    if (!address) {
      const companies = await odooCall<any[]>(
        'res.company',
        'search_read',
        [[], ['street', 'street2', 'city', 'state_id', 'country_id']],
        { limit: 1 }
      );
      const c = companies && companies[0];
      if (c) {
        // ✅ ARREGLO: evitar repetir ciudad/país si ya vienen en la calle
        const streetFull = [c.street, c.street2].filter(Boolean).join(', ');
        const city = c.city || '';
        const state = (c.state_id && c.state_id[1]) || '';
        const country = (c.country_id && c.country_id[1]) || '';

        const parts = [streetFull];
        if (city && !streetFull.includes(city)) parts.push(city);
        if (state && !streetFull.includes(state)) parts.push(state);
        if (country && !streetFull.includes(country)) parts.push(country);

        address = parts.filter(Boolean).join(', ');
      }
    }

    return NextResponse.json({ name, email, phone, address });
  } catch (e) {
    console.error('Error en /api/company:', e);
    return NextResponse.json({
      name: 'ServiTx',
      email: process.env.ODOO_USER || '',
      phone: '',
      address: '',
    });
  }
}