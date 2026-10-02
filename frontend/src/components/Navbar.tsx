import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Navbar() {
  const { user, setSession, count } = useStore();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-10 bg-ink text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-xl font-extrabold tracking-tight">boutique<span className="text-lime">.</span></Link>
        <nav className="flex items-center gap-5 text-sm">
          {user ? (
            <>
              <Link to="/commandes" className="hover:text-lime">Mes commandes</Link>
              <button onClick={() => { setSession(null); nav('/'); }} className="hover:text-lime">Se déconnecter</button>
            </>
          ) : <Link to="/connexion" className="hover:text-lime">Se connecter</Link>}
          <Link to="/panier" className="rounded-full bg-lime px-3 py-1 font-bold text-ink">Panier ({count})</Link>
        </nav>
      </div>
    </header>
  );
}
