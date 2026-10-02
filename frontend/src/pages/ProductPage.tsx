import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, eur } from '../api';
import { useStore } from '../store';
import type { Product } from '../types';

export default function ProductPage() {
  const { id = '' } = useParams();
  const { add } = useStore();
  const [p, setP] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => { api.product(id).then(setP).catch((e) => setError(e.message)); }, [id]);

  if (error) return <p className="py-20 text-center">{error}. <Link to="/" className="underline">Retour au catalogue</Link></p>;
  if (!p) return <p className="py-20 text-center text-ink/60">Chargement…</p>;
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img src={p.image} alt={p.name} width={640} height={640} className="w-full rounded-2xl object-cover" />
      <div className="flex flex-col gap-4">
        <Link to="/" className="text-sm text-sea hover:underline">← Catalogue</Link>
        <h1 className="text-4xl font-extrabold">{p.name}</h1>
        <p className="text-2xl font-bold">{eur(p.price)}</p>
        <p className="max-w-prose text-ink/80">{p.description}</p>
        <p className="text-sm text-ink/60">{p.stock > 0 ? `${p.stock} en stock` : 'Épuisé'}</p>
        <div className="flex items-center gap-3">
          <input type="number" min={1} max={p.stock} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} className="input w-24" aria-label="Quantité" />
          <button className="btn" disabled={p.stock === 0} onClick={() => { add(p, qty); setAdded(true); }}>Ajouter au panier</button>
        </div>
        {added && <p className="text-sm text-sea">Ajouté au panier. <Link to="/panier" className="font-bold underline">Voir le panier</Link></p>}
      </div>
    </div>
  );
}
