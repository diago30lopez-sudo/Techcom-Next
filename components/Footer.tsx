'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type CompanyInfo = { name?: string; email?: string; phone?: string; address?: string };
type Cat = { id: number; name: string };

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function Footer() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [info, setInfo] = useState<CompanyInfo>({});

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCats(d.categories || []))
      .catch(() => {});

    fetch('/api/company')
      .then((r) => r.json())
      .then((d) => setInfo(d || {}))
      .catch(() => {});
  }, []);

  return (
    <footer className="tc-footer">
      <div className="container">
        <div className="footer-grid">
          
          {/* Columna 1: Solo el texto, sin título */}
          <div className="footer-col">
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Somos líderes en soluciones de telecomunicaciones, informática y electrónica. Conectamos tu hogar y negocio con la mejor tecnología.
            </p>
          </div>

          {/* Columna 2: Categorías */}
          <div className="footer-col">
            <h3>Categorías</h3>
            <ul>
              {cats.length > 0 ? (
                cats.map((c) => (
                  <li key={c.id}>
                    <Link href={`/tienda?cat=${c.id}`}>{c.name}</Link>
                  </li>
                ))
              ) : (
                <li><Link href="/tienda">Ver productos</Link></li>
              )}
            </ul>
          </div>

          {/* Columna 3: Enlaces (con Sobre nosotros agregado) */}
          <div className="footer-col">
            <h3>Enlaces</h3>
            <ul>
              <li><Link href="/tienda">Todos los productos</Link></li>
              <li><Link href="/servicios">Servicios</Link></li>
              <li><Link href="/ayuda">Ayuda</Link></li>
              <li><Link href="/sobre-nosotros">Sobre nosotros</Link></li>
              <li><Link href="/contacto">Contáctenos</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="footer-col">
            <h3>Contacto</h3>
            <ul className="footer-contact">
              <li><PhoneIcon /> <span>{info.phone || '+53 55963587'}</span></li>
              <li><MailIcon /> <span>{info.email || 'ventas.servitx@gmail.com'}</span></li>
              <li><MapPinIcon /> <span>{info.address || 'Bayamo, Granma'}</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ServiTx. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}