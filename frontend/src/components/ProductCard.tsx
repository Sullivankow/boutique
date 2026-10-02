import { memo } from 'react';
import { Link } from 'react-router-dom';
import { eur } from '../api';
import { useStore } from '../store';
import type { Product } from '../types';

export default memo(function ProductCard({ p }: { p: Product }) {
  const { add } = useStore();
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      <Link to={`/produit/${p.id}`}>
        <img src={p.image} alt={p.name} loading="lazy" width={640} height={640} className="aspect-square w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs text-sea">{p.category}</p>
        <Link to={`/produit/${p.id}`} className="font-display text-lg font-semibold leading-tight hover:text-sea">{p.name}</Link>
        <p className="mt-auto pt-2 font-bold">{eur(p.price)}</p>
        <button className="btn mt-2" disabled={p.stock === 0} onClick={() => add(p)}>
          {p.stock === 0 ? 'Épuisé' : 'Ajouter au panier'}
        </button>
      </div>
    </article>
  );
});
