'use client';
import { useEffect, useState } from 'react';
import { getCurrentUser, getUserOrders, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Order = {
  id: number;
  name: string;
  date: string;
  total: number;
  state: string;
};

export default function Perfil() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    getUserOrders(currentUser.id).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [router]);

  if (!user) return <div className="container" style={{ padding: '3rem 0' }}>Cargando...</div>;

  return (
    <main className="container" style={{ padding: '3rem 0', minHeight: '60vh' }}>
      <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Mi Perfil</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Información</h3>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Correo:</strong> {user.email}</p>
          {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
          <button onClick={() => { logout(); router.push('/'); }} className="btn-primary" style={{ marginTop: '1.5rem' }}>
            Cerrar Sesión
          </button>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Mis Pedidos</h3>
          {loading ? (
            <p>Cargando pedidos...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: 'var(--text-light)' }}>No has realizado ningún pedido aún.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Pedido</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Fecha</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Total</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem' }}>{order.name}</td>
                    <td style={{ padding: '0.75rem' }}>{new Date(order.date).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>${Number(order.total).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        background: order.state === 'done' ? '#d1fae5' : '#fee2e2',
                        color: order.state === 'done' ? '#065f46' : '#991b1b',
                        fontSize: '0.85rem',
                      }}>
                        {order.state === 'done' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}