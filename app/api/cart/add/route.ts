import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const variantId = formData.get('variantId');
    const name = formData.get('name');
    const price = formData.get('price');
    const img = formData.get('img');
    
    if (!variantId || !name || !price) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}