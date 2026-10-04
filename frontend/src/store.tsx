import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartLine, Product, User } from './types';

const read = <T,>(k: string, d: T): T => { try { return JSON.parse(localStorage.getItem(k) || '') as T; } catch { return d; } };

interface Store {
  user: User | null; setSession: (s: { token: string; user: User } | null) => void;
  cart: CartLine[]; count: number; total: number;
  add: (p: Product, q?: number) => void; setQty: (id: string, q: number) => void; clear: () => void;
}
const Ctx = createContext<Store>(null!);
export const useStore = () => useContext(Ctx);

export function StoreProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(() => read('user', null));
  const [cart, setCart] = useState<CartLine[]>(() => read('cart', []));
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);

  const setSession = useCallback((s: { token: string; user: User } | null) => {
    if (s) { localStorage.setItem('token', s.token); localStorage.setItem('user', JSON.stringify(s.user)); }
    else { localStorage.removeItem('token'); localStorage.removeItem('user'); }
    setUser(s?.user ?? null);
  }, []);

  const add = useCallback((p: Product, q = 1) => setCart((c) => {
    const l = c.find((x) => x.product.id === p.id);
    const quantity = Math.min(p.stock, (l?.quantity ?? 0) + q);
    return l ? c.map((x) => (x.product.id === p.id ? { ...x, quantity } : x)) : [...c, { product: p, quantity }];
  }), []);
  const setQty = useCallback((id: string, q: number) => {
    setCart((currentCart) =>
      currentCart.flatMap((item) => {
        // 1. Si ce n'est pas le produit recherché, on le garde tel quel
        if (item.product.id !== id) {
          return [item];
        }

        // 2. Si la quantité est inférieure ou égale à 0, on retire l'article du panier
        if (q <= 0) {
          return [];
        }

        // 3. Sinon, on met à jour la quantité en respectant la limite du stock
        const updatedQuantity = Math.min(q, item.product.stock);
        return [{ ...item, quantity: updatedQuantity }];
      })
    );
  }, []);

  const clear = useCallback(() => setCart([]), []);

  const value = useMemo(() => ({
    user, setSession, cart, add, setQty, clear,
    count: cart.reduce((n, l) => n + l.quantity, 0),
    total: cart.reduce((n, l) => n + l.quantity * l.product.price, 0),
  }), [user, setSession, cart, add, setQty, clear]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
