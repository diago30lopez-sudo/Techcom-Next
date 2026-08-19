'use client';
import { useState, useEffect } from 'react';
import { getCart, clearCart } from '@/lib/cart';
import { getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone || '', address: '' });
    setCart(getCart());
  }, [router]);

  const total = cart.reduce((a, l) => a + l.qty * l.price, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: cart.map((l) => ({
            variantId: parseInt(l.variant),
            qty: l.qty,
            price: l.price,
            name: l.name,
          })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        clearCart();
        setTimeout(() => router.push('/'), 3000);
      } else {
        setError(data.error || 'Error al crear el pedido');
      }
    } catch {
      setError('Error de conexión');
    }
    setLoading(false);
  }

  if (cart.length === 0 && !success) {
    return (
      <main className="container" style={{ padding: '3rem 0', minHeight: '60vh', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Tu carrito está vacío</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Agrega productos antes de finalizar la compra.</p>
        <button onClick={() => router.push('/tienda')} className="btn-primary">Ir a la tienda</button>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '3rem 0' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>Finalizar Compra</h1>
      
      {success ? (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>✓ ¡Pedido realizado con éxito!</h2>
          <p>Te redirigiremos al inicio en unos segundos...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Información de envío</h3>
            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Nombre completo *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px' }} />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Correo electrónico *</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px' }} />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Teléfono</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px' }} />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>Dirección de envío *</label>
              <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '6px', minHeight: '80px' }} />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
              {loading ? 'Procesando...' : `Pagar $${total.toFixed(2)}`}
            </button>
          </form>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', height: 'fit-content' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Resumen del pedido</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {cart.map((item) => (
                <div key={item.variant} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  {item.img && <img src={item.img} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain', background: 'var(--bg-light)', borderRadius: '6px' }} />}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Cantidad: {item.qty}</p>
                    <p style={{ fontWeight: 600, color: 'var(--primary)' }}>${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)', borderTop: '2px solid var(--border)', paddingTop: '1rem' }}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}