export type User = { id: number; name: string; email: string; phone?: string };

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('tc_user') || 'null'); } catch { return null; }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (user) localStorage.setItem('tc_user', JSON.stringify(user));
  else localStorage.removeItem('tc_user');
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.user) { setCurrentUser(data.user); return data.user; }
    return null;
  } catch { return null; }
}

export async function register(name: string, email: string, password: string, phone?: string): Promise<User | null> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await res.json();
    if (data.user) { setCurrentUser(data.user); return data.user; }
    return null;
  } catch { return null; }
}

export function logout() {
  setCurrentUser(null);
  if (typeof window !== 'undefined') window.location.href = '/';
}

export async function getUserOrders(userId: number) {
  try {
    const res = await fetch(`/api/orders?userId=${userId}`);
    const data = await res.json();
    return data.orders || [];
  } catch { return []; }
}