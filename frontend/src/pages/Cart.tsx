import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, eur } from '../api';
import { useStore } from '../store';

export default function Cart() {
  const { cart, total, setQty, clear, user } = useStore();
  const nav = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const checkout = async () => {
    if (!user) return nav('/connexion', { state: { from: '/panier' } });
    setBusy(true); setError('');
    try {
      const o = await api.order(cart.map((l) => ({ productId: l.product.id, quantity: l.quantity })));
      clear(); setDone(o.id);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  if (done) return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-extrabold">Commande confirmée</h1>
      <p className="mt-2 text-ink/70">Référence {done.slice(0, 8)}. Merci pour votre achat !</p>
      <Link to="/commandes" className="btn mt-6">Voir mes commandes</Link>
    </div>
  );
  if (cart.length === 0) return <div className="py-20 text-center"><p className="mb-4">Votre panier est vide.</p><Link to="/" className="btn">Parcourir le catalogue</Link></div>;

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-ink/10 rounded-xl bg-white">
        {cart.map(({ product: p, quantity }) => (
          <li key={p.id} className="flex items-center gap-4 p-4">
            <img src={p.image} alt="" width={80} height={80} loading="lazy" className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <Link to={`/produit/${p.id}`} className="font-display font-semibold hover:text-sea">{p.name}</Link>
              <p className="text-sm text-ink/60">{eur(p.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost px-3" onClick={() => setQty(p.id, quantity - 1)} aria-label="Retirer un">−</button>
              <span className="w-6 text-center">{quantity}</span>
              <button className="btn-ghost px-3" onClick={() => setQty(p.id, quantity + 1)} aria-label="Ajouter un">+</button>
            </div>
            <p className="w-24 text-right font-bold">{eur(p.price * quantity)}</p>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-xl bg-white p-6">
        <h2 className="text-xl font-bold">Récapitulatif</h2>
        <p className="mt-4 flex justify-between text-lg"><span>Total</span><strong>{eur(total)}</strong></p>
        {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button className="btn mt-4 w-full" onClick={checkout} disabled={busy}>
          {busy ? 'Validation…' : user ? 'Payer la commande' : 'Se connecter pour commander'}
        </button>
        <p className="mt-3 text-xs text-ink/50">Maquette : aucun paiement réel n'est effectué.</p>
      </aside>
    </div>
  );
}
