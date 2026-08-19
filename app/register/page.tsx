'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const user = await register(form.name, form.email, form.password, form.phone);
    if (user) router.push('/');
    else setError('Error al crear la cuenta');
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Crear Cuenta</h2>
        <p className="auth-sub">Únete a ServiTx</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Nombre completo</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label>Correo electrónico</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <label>Teléfono</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label>Contraseña</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creando...' : 'Registrarse'}</button>
        </form>
        <p className="auth-footer">¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}