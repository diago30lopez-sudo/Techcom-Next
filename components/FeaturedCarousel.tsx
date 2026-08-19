'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToCart } from '@/lib/cart';

type Item = { 
  id: number; 
  name: string; 
  price: number; 
  image: string; 
  variantId: number;
  type: 'product' | 'service';
  uniqueId: string;
};

// Icono SVG para Productos (Caja)
const ProductIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="60" height="60">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

// Icono SVG para Servicios (Llave inglesa)
const ServiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="60" height="60">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export default function FeaturedCarousel() {
  const [items, setItems] = useState<Item[]>([]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch('/api/products?limit=10').then(r => r.json()).catch(() => ({ products: [] })),
      fetch('/api/services?limit=10').then(r => r.json()).catch(() => ({ services: [] }))
    ]).then(([prodData, servData]) => {
      if (!mounted) return;
      const products = (prodData.products || []).map((p: any) => ({
        id: p.id, name: p.name, price: p.list_price || 0, image: p.image,
        variantId: p.variantId, type: 'product' as const, uniqueId: `prod-${p.id}`
      }));
      
      const services = (servData.services || []).map((s: any) => ({
        id: s.id, name: s.name, price: s.list_price || s.price || 0, image: s.image,
        variantId: s.variantId || s.id, type: 'service' as const, uniqueId: `serv-${s.id}`
      }));

      // Mezclamos productos y servicios
      const mixed = [...products, ...services].sort(() => 0.5 - Math.random());
      setItems(mixed);
    }).catch(err => console.error("Error cargando carrusel:", err));

    return () => { mounted = false; };
  }, []);

  const handleAdd = (e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item.variantId, item.name, item.price, item.image);
    setAddedId(item.uniqueId);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (items.length === 0) return null;

  // Duplicamos los items para crear el efecto de bucle infinito perfecto
  // Si tenemos 10 items, renderizamos 20. La animación moverá del 0% al -50%.
  const displayItems = [...items, ...items];

  return (
    <section 
      className="featured-section" 
      style={{ overflow: 'hidden', padding: '2rem 0', background: 'var(--bg-light)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carousel-viewport">
        {/* La pista se mueve con animación CSS pura */}
        <div 
          className={`carousel-track ${isPaused ? 'paused' : ''}`}
        >
          {displayItems.map((item, idx) => (
            <div key={`${item.uniqueId}-${idx}`} className="carousel-slide">
              <div className="product-card-mini">
                <Link href={`/${item.type === 'service' ? 'servicio' : 'producto'}/${item.id}`}>
                  <div className="card-img">
                    {item.image ? (
                      <img src={item.image} alt={item.name} loading="lazy" />
                    ) : (
                      <div className="default-icon-container">
                        {item.type === 'service' ? <ServiceIcon /> : <ProductIcon />}
                      </div>
                    )}
                  </div>
                  <h3>{item.name}</h3>
                  <span className="price">${(item.price || 0).toFixed(2)}</span>
                </Link>
                
                <button 
                  className={`btn-add-cart ${addedId === item.uniqueId ? 'added' : ''}`}
                  onClick={(e) => handleAdd(e, item)}
                >
                  {addedId === item.uniqueId ? '✓ Añadido' : 'Añadir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .carousel-viewport {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        
        /* Pista del carrusel */
        .carousel-track {
          display: flex;
          width: max-content; /* El ancho se ajusta al contenido total */
          animation: scroll 60s linear infinite; /* Velocidad constante */
        }
        
        /* Pausa al pasar el mouse */
        .carousel-track.paused {
          animation-play-state: paused;
        }

        /* Animación infinita: se mueve hasta la mitad (-50%) porque duplicamos los items */
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Cada tarjeta ocupa un espacio fijo para que se vean aprox 5 en desktop */
        .carousel-slide {
          flex-shrink: 0;
          width: 300px; /* Ancho fijo por tarjeta */
          padding: 0 0.75rem;
          box-sizing: border-box;
        }
        
        .product-card-mini {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 400px;
        }
        .product-card-mini a {
          text-decoration: none;
          color: inherit;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .card-img {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          overflow: hidden;
        }
        .card-img img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .default-icon-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
        }
        
        .product-card-mini h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          color: var(--primary);
          line-height: 1.4;
          min-height: 4.5em;
          display: flex;
          align-items: flex-start;
          text-align: left;
        }
        
        .product-card-mini .price {
          display: block;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 1.5rem;
          text-align: left;
        }
        
        .btn-add-cart {
          width: 100%;
          padding: 0.8rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s;
          margin-top: auto;
        }
        .btn-add-cart:hover {
          background: var(--primary-dark);
        }
        .btn-add-cart.added {
          background: #10b981 !important;
        }

        /* Responsive: En móviles las tarjetas son más anchas relativas a la pantalla */
        @media (max-width: 768px) {
          .carousel-slide { width: 85vw; } /* Casi todo el ancho en móvil */
        }
      `}</style>
    </section>
  );
}