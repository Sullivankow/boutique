import type { Order, Product, User } from './types';

export const getToken = () => localStorage.getItem('token');

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch('/api' + path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Erreur serveur');
  return data as T;
}

type Session = { token: string; user: User };
export const api = {
  products: (search = '', category = '') => http<Product[]>(`/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`),
  product: (id: string) => http<Product>(`/products/${id}`),
  login: (email: string, password: string) => http<Session>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => http<Session>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  order: (items: { productId: string; quantity: number }[]) => http<{ id: string; total: number }>('/orders', { method: 'POST', body: JSON.stringify({ items }) }),
  orders: () => http<Order[]>('/orders'),
};
export const eur = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
