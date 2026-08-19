export default function Nosotros() {
  return (
    <div id="wrap">
      <section className="section page-head">
        <h2 className="center">¿Qué nos hace diferentes?</h2>
        <p className="sub center">No vendemos cajas. Vendemos que tu negocio funcione.</p>

        <div className="features">
          <div className="feature reveal">
            <div className="fi">🛒</div>
            <h3>Todo en un solo lugar</h3>
            <p className="quote">"Sin andar de tienda en tienda"</p>
            <p>Equipos de informática, redes y electrónica seleccionados. Probados antes de venderlos.</p>
          </div>

          <div className="feature reveal">
            <div className="fi">🚚</div>
            <h3>Te lo dejamos funcionando</h3>
            <p className="quote">"No te tiramos la caja en la puerta"</p>
            <p>Entrega, instalación y configuración a domicilio. Tú solo disfrutas.</p>
          </div>

          <div className="feature reveal">
            <div className="fi">🛡️</div>
            <h3>Garantía de verdad</h3>
            <p className="quote">"Si falla, lo arreglamos. Punto."</p>
            <p>Cada producto tiene garantía real. No te mandamos a un call center, te atendemos nosotros.</p>
          </div>

          <div className="feature reveal">
            <div className="fi">⚡</div>
            <h3>Respuesta rápida</h3>
            <p className="quote">"Te escribimos por WhatsApp en minutos"</p>
            <p>Sin bots ni esperas eternas. Hablas con un técnico que sabe de lo que habla.</p>
          </div>
        </div>
      </section>

      <section className="quote-band">
        <h2>Llevamos más de 10 años conectando negocios en Granma. Sabemos lo que hacemos.</h2>
      </section>

      <section className="section">
        <div className="cta reveal">
          <h3>¿Listo para trabajar con nosotros?</h3>
          <a href="/contacto" className="tc-btn">Escríbenos hoy</a>
          <a href="/tienda" className="tc-btn tc-btn-sec" style={{ marginLeft: 10 }}>Ver tienda</a>
        </div>
      </section>
    </div>
  );
}