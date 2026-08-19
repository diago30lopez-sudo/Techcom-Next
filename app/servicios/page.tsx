'use client';
import { useEffect, useState } from 'react';
import { addToCart } from '@/lib/cart';

type S = { id: number; name: string; list_price: number; description: string; image: string; variantId: number };

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="60" height="60">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

function ServiceCard({ s }: { s: S }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = () => {
    addToCart(s.variantId, s.name, s.list_price, s.image, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };
  return (
    <div className="service-card">
      <div className="card-img">
        {s.image ? <img src={s.image} alt={s.name} /> : <div className="default-icon-container"><WrenchIcon /></div>}
      </div>
      <div className="card-body">
        <h3>{s.name}</h3>
        {s.description && <p style={{ color: 'var(--text-light)', fontSize: '.9rem', flex: 1 }}>{s.description}</p>}
        <span className="price-big">${(s.list_price || 0).toFixed(2)}</span>
        <div className="card-actions">
          <div className="qty-stepper">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button className={`btn-add-round ${added ? 'added' : ''}`} onClick={add}>
            {added ? '✓' : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22"><circle cx="9" cy="21" r="1.5" /><circle cx="19" cy="21" r="1.5" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 7H6" /></svg>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Servicios() {
  const [services, setServices] = useState<S[]>([]);
  useEffect(() => {
    fetch('/api/services').then((r) => r.json()).then((d) => setServices(d.services || [])).catch(() => setServices([]));
  }, []);
  return (
    <main>
      <section className="services-hero">
        <div className="container"><h1>Nuestros Servicios</h1><p>Soluciones profesionales de principio a fin.</p></div>
      </section>
      <div className="container" style={{ paddingBottom: '3rem' }}>
        <div className="services-list">
          {services.map((s) => <ServiceCard key={s.id} s={s} />)}
          {services.length === 0 && <p className="empty-msg">Cargando servicios...</p>}
        </div>
      </div>
    </main>
  );
}