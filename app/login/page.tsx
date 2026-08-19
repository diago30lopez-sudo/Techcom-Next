'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const user = await login(email, password);
    if (user) router.push('/');
    else setError('Credenciales incorrectas');
    setLoading(false);
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>
        <p className="auth-sub">Bienvenido a ServiTx</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Entrando...' : 'Ingresar'}</button>
        </form>
        <p className="auth-footer">¿No tienes cuenta? <Link href="/register">Regístrate</Link></p>
      </div>
    </div>
  );
}