'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { addToCart } from '@/lib/cart';

type GalleryItem = { id: string; url: string };
type ProductDetail = {
  id: number;
  name: string;
  price: number;
  shortDescription: string;
  descriptionHtml: string;
  variantId: number;
  categories: { id: number; name: string }[];
  attributes: string[]; // ["8GB RAM", "Intel i5"]
  gallery: GalleryItem[];
};

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const BoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="60" height="60">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export default function ProductoPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    fetch(`/api/producto/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((d) => { setProduct(d); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addToCart(product.variantId, product.name, product.price, product.gallery[0]?.url || '', qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) return <div className="loading-spinner" style={{ padding: '4rem 0' }}>Cargando producto...</div>;

  if (notFound || !product) {
    return (
      <div className="end-message" style={{ padding: '4rem 0' }}>
        Producto no encontrado. <Link href="/tienda" style={{ color: 'var(--primary)' }}>Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="container product-detail">
      <nav className="product-breadcrumb">
        <Link href="/tienda" className="back-link">
          <ArrowLeftIcon />
          <span>Seguir comprando</span>
        </Link>
      </nav>

      <div className="product-grid-3cols">
        
        {/* Columna 1: Imagen Grande */}
        <div className="col-image">
          <div className="gallery-main">
            {product.gallery.length > 0 ? (
              <img src={product.gallery[activeImg]?.url} alt={product.name} />
            ) : (
              <div className="default-icon-container" style={{ height: '400px' }}><BoxIcon /></div>
            )}
          </div>
        </div>

        {/* Columna 2: Miniaturas Verticales */}
        {product.gallery.length > 1 && (
          <div className="col-thumbs">
            <div className="thumbs-vertical">
              {product.gallery.map((g, i) => (
                <button
                  key={g.id}
                  type="button"
                  className={`thumb-btn ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={g.url} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Columna 3: Información */}
        <div className="col-info">
          <h1>{product.name}</h1>

          {/* ✅ CATEGORÍAS Y VARIANTES (Etiquetas) */}
          <div className="product-meta-row">
            {product.categories.length > 0 && (
              <div className="product-cats">
                {product.categories.map((c) => (
                  <Link key={c.id} href={`/tienda?cat=${c.id}`}>{c.name}</Link>
                ))}
              </div>
            )}
            
            {product.attributes.length > 0 && (
              <div className="product-variants">
                {product.attributes.map((attr, idx) => (
                  <span key={idx} className="variant-badge">{attr}</span>
                ))}
              </div>
            )}
          </div>

          <div className="product-price">${(product.price || 0).toFixed(2)}</div>

          {product.shortDescription && (
            <div className="product-desc-block">
              <h4>Descripción de ventas</h4>
              <p className="product-desc">{product.shortDescription}</p>
            </div>
          )}

          {product.descriptionHtml && (
            <div className="product-desc-block">
              <h4>Descripción del producto</h4>
              <div className="product-desc-html" dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            </div>
          )}

          <div className="product-buy">
            <div className="qty-stepper">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button type="button" className={`btn-add-cart ${added ? 'added' : ''}`} onClick={handleAdd}>
              {added ? '✓ Añadido al carrito' : 'Añadir al carrito'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}