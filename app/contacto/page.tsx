'use client';

import { useState, useEffect } from 'react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  // Cargar información de la empresa desde Odoo
  useEffect(() => {
    fetch('/api/company')
      .then(res => res.json())
      .then(data => setCompanyInfo(data))
      .catch(err => console.error('Error fetching company info:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <h1>Contáctenos</h1>
          <p>Estamos aquí para ayudarte. Escríbenos y te responderemos pronto.</p>
        </div>
      </section>

      <div className="container contact-grid">
        {/* Columna Izquierda: Información */}
        <div className="contact-info-card">
          <h3>Información de Contacto</h3>
          <p>Comunícate con nosotros a través de nuestros canales oficiales.</p>
          
          <div className="contact-detail">
            <div className="contact-detail-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div className="contact-detail-text">
              <strong>Teléfono / WhatsApp</strong>
              <span>{companyInfo?.phone || '+53 55963587'}</span>
            </div>
          </div>

          <div className="contact-detail">
            <div className="contact-detail-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="contact-detail-text">
              <strong>Correo Electrónico</strong>
              <span>{companyInfo?.email || 'ventas.servitx@gmail.com'}</span>
            </div>
          </div>

          <div className="contact-detail">
            <div className="contact-detail-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div className="contact-detail-text">
              <strong>Dirección</strong>
              <span>{companyInfo?.address || 'Línea #273-altos, P. Pompa, Bayamo, Granma'}</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="contact-form-card">
          <h3>Envíanos un mensaje</h3>
          {status === 'success' && (
            <div className="form-success">
              ¡Mensaje enviado correctamente! Te contactaremos pronto.
            </div>
          )}
          {status === 'error' && (
            <div className="form-error">
              Hubo un error al enviar el mensaje. Por favor intenta de nuevo.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@ejemplo.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono (Opcional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+53 5XXXXXXX"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="¿En qué podemos ayudarte?"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}