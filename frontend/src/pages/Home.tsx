import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

const CATEGORIES = ['Maison', 'Tech', 'Mode'];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    setState('loading');
    const t = setTimeout(() => {
      api.products(search, category).then((d) => { setProducts(d); setState('ok'); }).catch(() => setState('error'));
    }, 250); // debounce de la recherche
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <>
      <section className="mb-8 rounded-2xl bg-ink p-8 text-white md:p-12">
        <h1 className="max-w-xl text-4xl font-extrabold leading-tight md:text-5xl">Des objets choisis pour durer.</h1>
        <p className="mt-3 max-w-md text-white/70">Maison, tech et mode : une petite sélection, livrée en 48 h.</p>
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" placeholder="Rechercher un produit" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Rechercher" />
        {['', ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${category === c ? 'bg-ink text-white' : 'bg-white hover:bg-ink/10'}`}>
            {c || 'Tout'}
          </button>
        ))}
      </div>

      {state === 'error' && <p className="rounded-lg bg-red-50 p-4 text-red-700">Impossible de joindre l'API. Vérifiez que le backend tourne sur le port 3000.</p>}
      {state === 'ok' && products.length === 0 && <p className="py-10 text-center text-ink/60">Aucun produit ne correspond à votre recherche.</p>}
      <div className={`grid grid-cols-2 gap-4 transition-opacity md:grid-cols-3 lg:grid-cols-4 ${state === 'loading' ? 'opacity-50' : ''}`}>
        {products.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </>
  );
}
