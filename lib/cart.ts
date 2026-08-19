export type CartItem = {
  id: number; // variantId
  name: string;
  price: number;
  image: string;
  qty: number;
  selected: boolean; 
};

const KEY = 'servitx_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(id: number, name: string, price: number, image: string, qty = 1) {
  const items = getCart();
  const existing = items.find((i) => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    // ✅ CAMBIO AQUÍ: selected: false (entra desmarcado)
    items.push({ id, name, price, image, qty, selected: false }); 
  }
  saveCart(items);
}

export function updateQty(id: number, qty: number) {
  const items = getCart();
  const item = items.find((i) => i.id === id);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(items);
  }
}

export function removeFromCart(id: number) {
  const items = getCart().filter((i) => i.id !== id);
  saveCart(items);
}

export function clearCart() {
  localStorage.removeItem(KEY);
}

export function toggleSelected(id: number) {
  const items = getCart();
  const item = items.find((i) => i.id === id);
  if (item) {
    item.selected = !item.selected;
    saveCart(items);
  }
}

export function removeSelected() {
  const items = getCart().filter((i) => !i.selected);
  saveCart(items);
}

export function cartCount(): number {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}