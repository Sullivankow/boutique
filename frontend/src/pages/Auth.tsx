import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useStore } from '../store';

export default function Auth() {
  const { setSession } = useStore();
  const nav = useNavigate();
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/';
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError('');
    try {
      setSession(mode === 'login' ? await api.login(f.email, f.password) : await api.register(f.name, f.email, f.password));
      nav(from);
    } catch (err) { setError((err as Error).message); }
  };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-sm flex-col gap-3 rounded-xl bg-white p-6">
      <h1 className="text-2xl font-extrabold">{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>
      {mode === 'register' && <input className="input" placeholder="Nom" value={f.name} onChange={set('name')} required minLength={2} />}
      <input className="input" type="email" placeholder="E-mail" value={f.email} onChange={set('email')} required />
      <input className="input" type="password" placeholder="Mot de passe (6 caractères min.)" value={f.password} onChange={set('password')} required minLength={6} />
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button className="btn">{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</button>
      <button type="button" className="text-sm text-sea underline" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Pas de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
      </button>
    </form>
  );
}
