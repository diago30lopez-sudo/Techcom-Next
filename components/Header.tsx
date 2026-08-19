'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '@/lib/auth';
import type { User } from '@/lib/auth';
import { cartCount } from '@/lib/cart';
import SideCart from '@/components/SideCart';
import CategoryDrawer from '@/components/CategoryDrawer';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [qty, setQty] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setQty(cartCount());
    const i = setInterval(() => setQty(cartCount()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <header className="tc-header">
      <div className="header-top">
        <div className="container">
          <button className="hamburger-btn" onClick={() => setCatOpen(true)} aria-label="Categorías">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <Link href="/" className="tc-logo">
            <img src="/logo.png" alt="ServiTx" />
          </Link>

          <div className="tc-search">
            <input
              type="text"
              placeholder="Buscar productos o servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
            {showSearch && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((p) => (
                  <Link key={p.id} href={`/producto/${p.id}`} className="search-item">
                    <span>{p.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="tc-actions">
            {user ? (
              <div className="user-menu">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="user-btn">
                  <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="name">{user.name.split(' ')[0]}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link href="/perfil">Mi Perfil</Link>
                    <button onClick={() => { logout(); setShowUserMenu(false); }}>Cerrar Sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-auth-split">
                <span className="auth-icon"><UserIcon /></span>
                <span className="auth-text">
                  <span>Entrar/</span>
                  <span>Registrarse</span>
                </span>
              </Link>
            )}

            <button className="btn-cart-clean" onClick={() => setCartOpen(true)} aria-label="Carrito">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="19" cy="21" r="1.5" />
                <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L23 7H6" />
              </svg>
              {qty > 0 && <span className="cart-count">{qty}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <nav className="tc-menu">
            <Link href="/tienda">Todos los productos</Link>
            <Link href="/servicios">Servicios</Link>
          </nav>
        </div>
      </div>

      <SideCart open={cartOpen} onClose={() => { setCartOpen(false); setQty(cartCount()); }} />
      <CategoryDrawer open={catOpen} onClose={() => setCatOpen(false)} />
    </header>
  );
}