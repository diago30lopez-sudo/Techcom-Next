export default function SobreNosotros() {
  return (
    <main style={{ padding: '3rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1rem' }}>Sobre ServiTx</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
            Somos líderes en soluciones de telecomunicaciones, informática y electrónica. Conectamos tu hogar y negocio con la mejor tecnología.
          </p>
        </div>

        {/* Bloques Horizontales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30, 58, 138, 0.05)', borderRadius: '50%' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Calidad Garantizada</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Productos y servicios verificados bajo estándares técnicos profesionales.</p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30, 58, 138, 0.05)', borderRadius: '50%' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Soporte Experto</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Asistencia especializada antes y después de tu compra.</p>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30, 58, 138, 0.05)', borderRadius: '50%' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Confianza Total</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>Tus datos y tus compras están protegidos con nosotros.</p>
          </div>
        </div>

        <div style={{ background: 'var(--bg-light)', padding: '3rem', borderRadius: '16px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Nuestra Misión</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
            En ServiTx, nos dedicamos a proporcionar soluciones integrales de telecomunicaciones e informática. 
            Desde cables de red hasta servidores y telefonía IP, contamos con todo lo necesario para mantener tu infraestructura funcionando al 100%.
          </p>
        </div>
      </div>
    </main>
  );
}