'use client';
import { useState } from 'react';
import Link from 'next/link';

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button type="button" className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq-icon">{open ? '−' : '+'}</span>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  );
}

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export default function Ayuda() {
  return (
    <main className="help-page">
      <div className="help-header">
        <h1>Centro de Ayuda</h1>
        <p>Encuentra respuestas a las preguntas más frecuentes sobre ServiTx</p>
      </div>

      <section className="help-section">
        <h2 className="help-section-title"><CartIcon /> Compras y Pedidos</h2>
        <FaqItem q="¿Cómo realizo un pedido?" a="Navega por nuestra tienda, añade los productos al carrito y haz clic en el botón de carrito para finalizar tu compra. Sigue los pasos para ingresar tus datos de contacto." />
        <FaqItem q="¿Qué métodos de pago aceptan?" a="Aceptamos Transfermóvil, EnZona y pago en efectivo contra entrega en zonas seleccionadas." />
        <FaqItem q="¿Puedo modificar o cancelar mi pedido?" a="Si el pedido aún no ha sido procesado, sí. Contáctanos inmediatamente al +53 55963587 con tu número de pedido." />
        <FaqItem q="¿Cómo rastreo mi pedido?" a="Recibirás un correo o mensaje de WhatsApp con el estado de tu pedido. También puedes consultar en la sección 'Mi Perfil' si estás registrado." />
      </section>

      <section className="help-section">
        <h2 className="help-section-title"><WrenchIcon /> Soporte Técnico</h2>
        <FaqItem q="¿Ofrecen instalación de redes?" a="Sí, ofrecemos instalación profesional de cableado estructurado, fibra óptica y configuración de redes WiFi para hogares y negocios." />
        <FaqItem q="¿Tienen garantía los productos?" a="Todos nuestros productos electrónicos tienen garantía de 3 meses por defectos de fábrica. No cubre daños por mal uso." />
        <FaqItem q="¿Cómo solicito soporte remoto?" a="Escríbenos por WhatsApp o desde la página de Contáctenos y coordinamos una sesión de soporte remoto para problemas de software o configuración." />
      </section>

      <div className="help-cta">
        <h3>¿No encontraste lo que buscabas?</h3>
        <p>Nuestro equipo está listo para ayudarte personalmente.</p>
        <Link href="/contacto" className="help-cta-btn">Contactar Soporte</Link>
      </div>
    </main>
  );
}