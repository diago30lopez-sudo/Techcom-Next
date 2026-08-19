'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cartCount, onCartChange, addToCart } from '@/lib/cart';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const toastT = useRef<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    setCount(cartCount());
    return onCartChange(() => setCount(cartCount()));
  }, []);

  useEffect(() => {
    const onToast = (e: any) => toast(e.detail);
    window.addEventListener('tc-toast', onToast);
    return () => window.removeEventListener('tc-toast', onToast);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function toast(msg: string) {
    setToastMsg(msg);
    if (toastT.current) clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToastMsg(''), 2600);
  }

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const add = t.closest('.add-cart') as HTMLElement | null;
      if (add) {
        e.preventDefault();
        addToCart(add.dataset);
        add.classList.add('added'); add.textContent = '✓ Añadido';
        setTimeout(() => { add.classList.remove('added'); add.textContent = '🛒 Añadir'; }, 1400);
        window.dispatchEvent(new CustomEvent('tc-toast', { detail: '🛒 Producto añadido al carrito' }));
        return;
      }
      const fav = t.closest('.fav') as HTMLElement | null;
      if (fav) {
        const id = parseInt(fav.dataset.id || '0', 10);
        const favs: number[] = JSON.parse(localStorage.getItem('tc_favs') || '[]');
        const i = favs.indexOf(id);
        if (i >= 0) { favs.splice(i, 1); fav.classList.remove('active'); fav.textContent = '🤍'; }
        else { favs.push(id); fav.classList.add('active'); fav.textContent = '❤️'; }
        localStorage.setItem('tc_favs', JSON.stringify(favs));
      }
    };
    document.addEventListener('click', onDocClick);

    const favs: number[] = JSON.parse(localStorage.getItem('tc_favs') || '[]');
    document.querySelectorAll('.fav').forEach((b: any) => {
      if (favs.indexOf(parseInt(b.dataset.id, 10)) >= 0) { b.classList.add('active'); b.textContent = '❤️'; }
    });

    const track = document.getElementById('cTrack') as HTMLElement | null;
    if (track && track.children.length) {
      const slides = track.children as any;
      const dots = document.getElementById('cDots')!;
      let idx = 0; let timer: any = null;
      const perView = () => (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
      const maxIdx = () => Math.max(0, slides.length - perView());
      const go = (i: number) => {
        idx = Math.max(0, Math.min(i, maxIdx()));
        const step = (slides[0] as HTMLElement).offsetWidth + 18;
        track.style.transform = 'translateX(-' + idx * step + 'px)';
        Array.prototype.forEach.call(dots.children, (d: any, k: number) => d.classList.toggle('active', k === idx));
      };
      for (let i = 0; i <= maxIdx(); i++) {
        const d = document.createElement('button');
        d.className = 'c-dot';
        ((k) => d.addEventListener('click', () => { go(k); restart(); }))(i);
        dots.appendChild(d);
      }
      const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx >= maxIdx() ? 0 : idx + 1), 5000); };
      document.getElementById('cPrev')?.addEventListener('click', () => { go(idx - 1); restart(); });
      document.getElementById('cNext')?.addEventListener('click', () => { go(idx >= maxIdx() ? 0 : idx + 1); restart(); });
      const car = document.getElementById('carousel')!;
      const stop = () => clearInterval(timer);
      car.addEventListener('mouseenter', stop);
      car.addEventListener('mouseleave', restart);
      restart();
    }

    document.querySelectorAll('.tab').forEach((t: any) => {
      t.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach((x) => x.classList.remove('active'));
        t.classList.add('active');
        document.getElementById(t.dataset.tab)?.classList.add('active');
      });
    });

    const grid = document.getElementById('grid');
    if (grid && document.getElementById('filterBtn')) {
      grid.classList.add('tc-anim');
      const cards = Array.prototype.slice.call(grid.querySelectorAll('.p-card')) as HTMLElement[];
      const fPanel = document.getElementById('fPanel')!, fOverlay = document.getElementById('fOverlay')!;
      const rsMin = document.getElementById('rsMin') as HTMLInputElement;
      const rsMax = document.getElementById('rsMax') as HTMLInputElement;
      const rsFill = document.getElementById('rsFill') as HTMLElement;
      const minVal = document.getElementById('rsMinVal')!, maxVal = document.getElementById('rsMaxVal')!;
      const prices = cards.map((c) => parseFloat(c.dataset.price || '0') || 0);
      let LO = Math.floor(Math.min.apply(null, prices) / 10) * 10;
      let HI = Math.ceil(Math.max.apply(null, prices) / 10) * 10;
      if (HI <= LO) HI = LO + 10;
      const GAP = Math.max(1, Math.round((HI - LO) / 100));
      rsMin.min = rsMax.min = String(LO); rsMin.max = rsMax.max = String(HI);
      rsMin.value = String(LO); rsMax.value = String(HI);
      const paint = () => {
        rsFill.style.left = ((+rsMin.value - LO) / (HI - LO) * 100) + '%';
        rsFill.style.width = ((+rsMax.value - +rsMin.value) / (HI - LO) * 100) + '%';
        minVal.textContent = '$' + rsMin.value; maxVal.textContent = '$' + rsMax.value;
      };
      const openF = () => { fPanel.classList.add('open'); fOverlay.classList.add('show'); };
      const closeF = () => { fPanel.classList.remove('open'); fOverlay.classList.remove('show'); };
      document.getElementById('filterBtn')!.addEventListener('click', openF);
      document.getElementById('fClose')!.addEventListener('click', closeF);
      fOverlay.addEventListener('click', closeF);
      const applyFilters = () => {
        const q = ((document.getElementById('fSearch') as HTMLInputElement).value || '').toLowerCase();
        const allCats = Array.prototype.slice.call(document.querySelectorAll('.f-cat')) as HTMLElement[];
        const catsOn = allCats.filter((c) => c.classList.contains('on')).map((c) => c.dataset.cat || '');
        const lo = +rsMin.value, hi = +rsMax.value;
        const sort = (document.getElementById('fSort') as HTMLSelectElement).value;
        const visible = cards.filter((c) => {
          const okCat = catsOn.indexOf(c.dataset.cat || '') >= 0;
          const okQ = !q || (c.dataset.search || '').indexOf(q) >= 0;
          const price = parseFloat(c.dataset.price || '0') || 0;
          return okCat && okQ && price >= lo && price <= hi;
        });
        cards.forEach((c) => { c.style.display = 'none'; });
        if (sort === 'asc') visible.sort((a, b) => parseFloat(a.dataset.price || '0') - parseFloat(b.dataset.price || '0'));
        if (sort === 'desc') visible.sort((a, b) => parseFloat(b.dataset.price || '0') - parseFloat(a.dataset.price || '0'));
        if (sort === 'name') visible.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
        visible.forEach((c, i) => {
          c.style.display = '';
          c.classList.remove('in');
          setTimeout(() => c.classList.add('in'), i * 50);
        });
        document.getElementById('resultCount')!.textContent = visible.length + ' producto' + (visible.length !== 1 ? 's' : '');
        document.getElementById('empty')!.style.display = visible.length ? 'none' : 'block';
        let n = 0;
        if (q) n++;
        if (catsOn.length < allCats.length) n++;
        if (lo > LO || hi < HI) n++;
        if (sort !== 'feat') n++;
        const fab = document.getElementById('fabBadge')!;
        fab.style.display = n ? 'flex' : 'none';
        fab.textContent = String(n);
      };
      rsMin.addEventListener('input', () => { if (+rsMin.value > +rsMax.value - GAP) rsMin.value = String(+rsMax.value - GAP); paint(); applyFilters(); });
      rsMax.addEventListener('input', () => { if (+rsMax.value < +rsMin.value + GAP) rsMax.value = String(+rsMin.value + GAP); paint(); applyFilters(); });
      document.getElementById('fSearch')!.addEventListener('input', applyFilters);
      document.getElementById('fSort')!.addEventListener('change', applyFilters);
      document.getElementById('fCats')!.addEventListener('click', (e) => {
        const c = (e.target as HTMLElement).closest('.f-cat');
        if (!c) return;
        c.classList.toggle('on');
        applyFilters();
      });
      document.getElementById('fApply')!.addEventListener('click', () => { applyFilters(); closeF(); window.dispatchEvent(new CustomEvent('tc-toast', { detail: '✅ Filtros aplicados' })); });
      document.getElementById('fClear')!.addEventListener('click', () => {
        (document.getElementById('fSearch') as HTMLInputElement).value = '';
        (document.getElementById('fSort') as HTMLSelectElement).value = 'feat';
        rsMin.value = String(LO); rsMax.value = String(HI);
        document.querySelectorAll('.f-cat').forEach((c) => c.classList.add('on'));
        paint(); applyFilters();
      });
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          card.classList.add('tilting');
          card.style.transform = 'perspective(900px) rotateY(' + x * 13 + 'deg) rotateX(' + -y * 13 + 'deg) translateY(-6px)';
          card.style.setProperty('--gx', (x + 0.5) * 100 + '%');
          card.style.setProperty('--gy', (y + 0.5) * 100 + '%');
        });
        card.addEventListener('mouseleave', () => { card.classList.remove('tilting'); card.style.transform = ''; });
      });
      paint(); applyFilters();
    }

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((en) => { if (en.isIntersecting) (en.target as HTMLElement).classList.add('in'); });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    } else {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    }

    return () => document.removeEventListener('click', onDocClick);
  }, [pathname]);

  return (
    <>
      <header className="tc-header">
        <div className="tc-topbar">
          <div className="in">
            <span>💲 Precio bajo garantizado</span>
            <span>🧺 30 días para devoluciones</span>
            <span>🚚 Envío estándar a domicilio</span>
          </div>
        </div>
        
        <div className="tc-nav">
          <div className="in">
            {/* Logo a la izquierda */}
            <Link href="/" className="tc-logo" aria-label="Ir al inicio">
              <img src="/logo.png" alt="ServiTx" />
            </Link>
            
            {/* Menú Normal PC */}
            <nav className="tc-menu">
              <Link href="/">Inicio</Link>
              <Link href="/tienda">Tienda</Link>
              <Link href="/servicios">Servicios</Link>
              <Link href="/nosotros">Nosotros</Link>
              <Link href="/contacto">Contacto</Link>
            </nav>

            {/* Acciones Móviles: Hamburguesa abajo/centro y Mi Cesta arriba/derecha */}
            <div className="mobile-actions">
              <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">
                ☰
              </button>
              <Link href="/carrito" className="tc-cartbtn mobile-cart" style={{ textDecoration: 'none' }}>
                🛒 Mi cesta
                {count > 0 && <span className="n">{count}</span>}
              </Link>
            </div>

            {/* Botón Mi Cesta PC */}
            <Link href="/carrito" className="tc-cartbtn pc-cart" style={{ textDecoration: 'none' }}>
              🛒 Mi cesta
              {count > 0 && <span className="n">{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Menú Lateral Celular con Botones y Patrón */}
      <div className={`sidebar-overlay ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}></div>
      <aside className={`mobile-sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-pattern"></div>
        <div className="sidebar-header">
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#1e40af', position: 'relative', zIndex: 2 }}>Menú</span>
          <button className="sidebar-close" onClick={() => setMenuOpen(false)} style={{ position: 'relative', zIndex: 2 }}>✕</button>
        </div>
        <nav style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" className="sidebar-btn">Inicio</Link>
          <Link href="/tienda" className="sidebar-btn">Tienda</Link>
          <Link href="/servicios" className="sidebar-btn">Servicios</Link>
          <Link href="/nosotros" className="sidebar-btn">Nosotros</Link>
          <Link href="/contacto" className="sidebar-btn">Contacto</Link>
          <Link href="/carrito" className="sidebar-btn sidebar-btn-cart">🛒 Mi cesta ({count})</Link>
        </nav>
      </aside>

      <main>{children}</main>

      <footer className="tc-footer">
        <p>📞 +53 55963587 · ✉️ ventas.servitx@gmail.com · 📍 Línea #273-altos, P. Pompa, Bayamo, Granma</p>
        <p>© {new Date().getFullYear()} ServiTx · Telecomunicaciones · Informática · Electrónica</p>
      </footer>

      <a className="wa" href="https://wa.me/5355963587" target="_blank" aria-label="WhatsApp">💬</a>
      <div id="toast" className={toastMsg ? 'show' : ''}>{toastMsg}</div>
    </>
  );
}