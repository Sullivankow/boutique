import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="mt-12 bg-ink text-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:items-end">
                <div>
                    <Link to="/" className="font-display text-xl font-extrabold">
                        boutique<span className="text-lime">.</span>
                    </Link>
                    <p className="mt-2 max-w-sm text-sm text-white/65">
                        Des objets choisis pour durer, pour la maison, la tech et le quotidien.
                    </p>
                </div>
                <nav aria-label="Navigation de pied de page" className="flex flex-wrap gap-x-6 gap-y-3 text-sm sm:justify-end">
                    <Link to="/" className="transition hover:text-lime">Accueil</Link>
                    <Link to="/panier" className="transition hover:text-lime">Panier</Link>
                    <Link to="/commandes" className="transition hover:text-lime">Mes commandes</Link>
                    <Link to="/connexion" className="transition hover:text-lime">Mon compte</Link>
                </nav>
                <div className="border-t border-white/15 pt-4 text-xs text-white/50 sm:col-span-2">
                    © {new Date().getFullYear()} boutique. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}