import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, eur } from '../api';
import { useStore } from '../store';
import type { Order } from '../types';

export default function Orders() {
  const { user } = useStore();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { if (user) api.orders().then(setOrders).catch((e) => setError(e.message)); }, [user]);

  if (!user) return <p className="py-20 text-center"><Link to="/connexion" className="underline">Connectez-vous</Link> pour voir vos commandes.</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  if (!orders) return <p className="py-20 text-center text-ink/60">Chargement…</p>;
  if (!orders.length) return <p className="py-20 text-center">Vous n'avez pas encore de commande.</p>;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold">Mes commandes</h1>
      {orders.map((o) => (
        <section key={o.id} className="rounded-xl bg-white p-5">
          <div className="flex justify-between font-bold">
            <span>{new Date(o.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span><span>{eur(o.total)}</span>
          </div>
          <ul className="mt-2 text-sm text-ink/70">
            {o.items.map((i) => <li key={i.id}>{i.quantity} × {i.name}</li>)}
          </ul>
        </section>
      ))}
    </div>
  );
}
