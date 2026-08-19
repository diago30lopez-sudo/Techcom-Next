'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCart, removeFromCart, updateQty, clearCart, toggleSelected, removeSelected, CartItem } from '@/lib/cart';

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export default function SideCart({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (open) setItems(getCart());
  }, [open]);

  if (!open) return null;

  // El total ahora suma solo los seleccionados (que al inicio son 0)
  const total = items.filter(i => i.selected).reduce((sum, i) => sum + i.price * i.qty, 0);
  const selectedCount = items.filter(i => i.selected).length;

  const handleDelete = (id: number) => {
    removeFromCart(id);
    setItems(getCart());
  };

  const handleQty = (id: number, delta: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      updateQty(id, item.qty + delta);
      setItems(getCart());
    }
  };

  const handleToggle = (id: number) => {
    toggleSelected(id);
    setItems(getCart());
  };

  const handleClearAll = () => {
    clearCart();
    setItems([]);
  };

  const handleRemoveSelected = () => {
    removeSelected();
    setItems(getCart());
  };

  return (
    <div className="sidecart-overlay" onClick={onClose}>
      <div className="sidecart-panel" onClick={(e) => e.stopPropagation()}>
        
        <div className="sidecart-header">
          <h3>Tu Carrito ({items.length})</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {items.length > 0 && (
              <button onClick={handleClearAll} className="btn-clear-cart" title="Vaciar carrito">
                <TrashIcon />
                <span>Vaciar</span>
              </button>
            )}
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="sidecart-body">
          {items.length === 0 ? (
            <div className="sidecart-empty">
              <h4>Su carrito está vacío</h4>
              <p>Agregue algunos productos a su carrito.</p>
              <Link href="/tienda" className="btn-outline" onClick={onClose} style={{ display: 'inline-block', marginTop: '1rem' }}>
                Seguir comprando
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                {/* ✅ Checkbox lee item.selected (que ahora es false por defecto) */}
                <input 
                  type="checkbox" 
                  checked={item.selected} 
                  onChange={() => handleToggle(item.id)} 
                />
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="no-img-sm">📦</div>
                )}
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <span className="item-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div className="item-controls">
                  <button onClick={() => handleQty(item.id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => handleQty(item.id, 1)}>+</button>
                </div>
                <button className="delete-item" onClick={() => handleDelete(item.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="sidecart-footer">
            <div className="cart-actions-row">
              <button 
                className="btn-danger" 
                onClick={handleRemoveSelected} 
                disabled={selectedCount === 0}
              >
                Eliminar seleccionados ({selectedCount})
              </button>
              <Link href="/checkout" className="btn-outline" onClick={onClose} style={{ textAlign: 'center', flex: 1 }}>
                Finalizar Compra
              </Link>
            </div>
            <div className="cart-total">
              <span>Total:</span>
              <span className="total-price">${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}