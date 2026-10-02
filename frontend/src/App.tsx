import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

const Home = lazy(() => import('./pages/Home'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const Cart = lazy(() => import('./pages/Cart'));
const Auth = lazy(() => import('./pages/Auth'));
const Orders = lazy(() => import('./pages/Orders'));

export default function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<p className="py-20 text-center text-ink/60">Chargement…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produit/:id" element={<ProductPage />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/connexion" element={<Auth />} />
            <Route path="/commandes" element={<Orders />} />
            <Route path="*" element={<p className="py-20 text-center">Page introuvable.</p>} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
