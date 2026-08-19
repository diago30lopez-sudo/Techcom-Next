import { NextResponse } from 'next/server';
import { odooCall } from '@/lib/odoo';

export async function GET() {
  try {
    // Buscamos usuarios que sean administradores (no compartidos/portales)
    // Ordenamos por ID para asegurar que el primero sea el "Super Admin" o el primer creado
    const users = await odooCall<any[]>('res.users', 'search_read', [
      [['share', '=', false], ['active', '=', true]], 
      ['id', 'name', 'phone', 'mobile'], 
      { order: 'id asc', limit: 5 }
    ]);

    // Buscamos el primero que tenga teléfono o móvil
    const admin = users.find(u => u.mobile || u.phone);

    if (!admin) {
      return NextResponse.json({ phone: null });
    }

    // Limpiamos el número: quitamos espacios, guiones, paréntesis y el + inicial
    // WhatsApp necesita el formato internacional sin el símbolo + (ej: 5355963587)
    const rawPhone = admin.mobile || admin.phone;
    const cleanPhone = rawPhone.replace(/[^0-9]/g, ''); 

    return NextResponse.json({ phone: cleanPhone });
  } catch (error) {
    console.error('Error fetching admin phone:', error);
    return NextResponse.json({ phone: null });
  }
}