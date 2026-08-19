'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Iconos SVG
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const ContactIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export default function CategoryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cats, setCats] = useState<{ id: number; name: string }[]>([]);
  const [view, setView] = useState<'main' | 'cats'>('main');
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setView('main');
      fetch('/api/categories')
        .then((r) => r.json())
        .then((d) => setCats(d.categories || []))
        .catch(() => {});
    }
  }, [open]);

  if (!open) return null;

  const goCategory = (id: number) => {
    onClose();
    router.push(`/tienda?cat=${id}`);
  };

  const goAll = () => {
    onClose();
    router.push('/tienda');
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>

        {view === 'main' ? (
          <>
            <div className="drawer-header">
              <h3>Menú</h3>
              <button type="button" className="close-btn" onClick={onClose}>✕</button>
            </div>
            <div className="drawer-body">
              <ul className="drawer-menu-list">
                <li>
                  <Link href="/login" className="drawer-menu-link" onClick={onClose}>
                    <span className="drawer-link-left"><UserIcon /> Entrar | Registrarse</span>
                  </Link>
                </li>
                <li>
                  <button type="button" className="drawer-menu-link" onClick={goAll}>
                    <span className="drawer-link-left">Todos los productos</span>
                    <ChevronRight />
                  </button>
                </li>
                <li>
                  <button type="button" className="drawer-menu-link" onClick={() => setView('cats')}>
                    <span className="drawer-link-left">Categorías</span>
                    <ChevronRight />
                  </button>
                </li>
                
                <li>
                  <Link href="/servicios" className="drawer-menu-link" onClick={onClose}>
                    <span className="drawer-link-left">Servicios</span>
                    <ChevronRight />
                  </Link>
                </li>

                <li>
                  <Link href="/ayuda" className="drawer-menu-link" onClick={onClose}>
                    <span className="drawer-link-left"><HelpIcon /> Ayuda</span>
                    <ChevronRight />
                  </Link>
                </li>
                <li>
                  <Link href="/sobre-nosotros" className="drawer-menu-link" onClick={onClose}>
                    <span className="drawer-link-left"><InfoIcon /> Sobre nosotros</span>
                    <ChevronRight />
                  </Link>
                </li>
                <li>
                  {/* ✅ CAMBIO AQUÍ: "Contacto" -> "Contáctenos" */}
                  <Link href="/contacto" className="drawer-menu-link" onClick={onClose}>
                    <span className="drawer-link-left"><ContactIcon /> Contáctenos</span>
                    <ChevronRight />
                  </Link>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="drawer-header">
              <div className="drawer-back-wrap">
                <button type="button" className="drawer-back-btn" onClick={() => setView('main')}>
                  <ChevronLeft />
                </button>
                <h3>Categorías</h3>
              </div>
              <button type="button" className="close-btn" onClick={onClose}>✕</button>
            </div>
            <div className="drawer-body">
              <ul className="drawer-menu-list">
                {cats.length === 0 && (
                  <li><span className="drawer-menu-link" style={{ cursor: 'default' }}>Cargando categorías...</span></li>
                )}
                {cats.map((c) => (
                  <li key={c.id}>
                    <button type="button" className="drawer-menu-link" onClick={() => goCategory(c.id)}>
                      <span className="drawer-link-left">{c.name}</span>
                      <ChevronRight />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

      </div>
    </div>
  );
}