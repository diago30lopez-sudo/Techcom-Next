import { getProducts } from '@/lib/odoo';
import BannerCarousel from '@/components/BannerCarousel';
import FeaturedCarousel from '@/components/FeaturedCarousel';

export const revalidate = 60;

// Iconos SVG integrados (no dependen de archivos externos)
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
);

const HeadsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
    <path d="M3 11h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z" />
    <path d="M21 11h-1a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z" />
    <path d="M3 11V9a9 9 0 0 1 18 0v2" />
    <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
  </svg>
);

export default async function Home() {
  const products = await getProducts(8);

  return (
    <main className="home-page">
      <BannerCarousel />

      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            {/* Beneficio 1: Calidad (antes 100% Seguro) */}
            <div className="benefit-card">
              <div className="benefit-icon">
                <ShieldIcon />
              </div>
              <h3>Calidad Garantizada</h3>
              <p>Productos y servicios verificados bajo estándares técnicos profesionales.</p>
            </div>

            {/* Beneficio 2: Precios (antes Grandes Ofertas) */}
            <div className="benefit-card">
              <div className="benefit-icon">
                <TagIcon />
              </div>
              <h3>Precios Competitivos</h3>
              <p>Soluciones tecnológicas accesibles adaptadas a tu presupuesto real.</p>
            </div>

            {/* Beneficio 3: Soporte (antes Soporte Experto) */}
            <div className="benefit-card">
              <div className="benefit-icon">
                <HeadsetIcon />
              </div>
              <h3>Soporte Técnico</h3>
              <p>Asistencia especializada para resolver tus dudas e incidencias rápidamente.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary)', fontSize: '2rem' }}>
            Productos Destacados
          </h2>
          <FeaturedCarousel products={products} />
        </div>
      </section>
    </main>
  );
}