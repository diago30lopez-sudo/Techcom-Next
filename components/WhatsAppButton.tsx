'use client';
import { useEffect, useState } from 'react';

export default function WhatsAppButton() {
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Pedir el número al endpoint que lee ODOO_USER en Odoo
    fetch('/api/company')
      .then((r) => r.json())
      .then((d) => {
        // Limpiamos el número (quitamos +, espacios, guiones)
        const clean = String(d?.phone || '').replace(/[^0-9]/g, '');
        // Si Odoo devuelve número, lo usamos. Si no, un respaldo.
        setPhone(clean || '5355963587');
      })
      .catch(() => setPhone('5355963587'));
  }, []);

  if (!phone) return null;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent('Hola, vengo de la web ServiTx y quisiera más información.')}`;

  return (
    <>
      <a href={url} target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="Chatear por WhatsApp">
        <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.508 1.132 6.756 3.054 9.404L1.05 31.39l6.16-1.966A15.93 15.93 0 0 0 16.004 32C24.826 32 32 24.822 32 16.004 32 7.176 24.826 0 16.004 0zm9.338 22.594c-.39 1.1-2.286 2.06-3.19 2.136-.846.072-1.89.102-3.054-.266a27.6 27.6 0 0 1-2.776-1.024c-4.866-2.1-8.046-7.018-8.29-7.342-.244-.324-1.99-2.654-1.99-5.064 0-2.41 1.266-3.598 1.714-4.09.448-.492.978-.614 1.304-.614.326 0 .652.002.936.016.3.016.704-.114 1.1.826.39.94 1.334 3.266 1.452 3.502.118.236.198.51.04.826-.158.316-.238.514-.476.794-.238.28-.5.624-.714.838-.238.238-.486.496-.21.974.276.478 1.226 2.022 2.63 3.274 1.806 1.606 3.328 2.106 3.8 2.342.472.236.748.198 1.024-.118.276-.316 1.18-1.374 1.494-1.846.314-.472.628-.394 1.058-.236.43.158 2.73 1.288 3.2 1.524.47.236.784.354.9.55.118.198.118 1.14-.272 2.24z" />
        </svg>
      </a>
      <style>{`
        .whatsapp-float { 
          position: fixed; 
          width: 60px; 
          height: 60px; 
          bottom: 10px; /* 👈 MÁS ABAJO */
          right: 150px;  /* 👈 MÁS A LA IZQUIERDA (antes estaba en 40px) */
          background-color: #25d366; 
          color: #fff; 
          border-radius: 50px; 
          box-shadow: 2px 2px 10px rgba(0,0,0,0.3); 
          z-index: 1000; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          transition: all 0.3s ease; 
          text-decoration: none; 
        }
        .whatsapp-float:hover { 
          background-color: #128c7e; 
          transform: scale(1.1); 
        }
        @media (max-width: 768px) { 
          .whatsapp-float { 
            width: 50px; 
            height: 50px; 
            bottom: 15px; /* 👈 EN MÓVIL TAMBIÉN MÁS ABAJO */
            right: 15px;  /* 👈 EN MÓVIL MÁS A LA IZQUIERDA */
          } 
          .whatsapp-float svg { 
            width: 28px; 
            height: 28px; 
          } 
        }
      `}</style>
    </>
  );
}