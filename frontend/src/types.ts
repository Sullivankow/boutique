export interface Product { id: string; name: string; description: string; price: number; image: string; category: string; stock: number }
export interface User { id: string; email: string; name: string }
export interface CartLine { product: Product; quantity: number }
export interface Order { id: string; total: number; createdAt: string; items: { id: string; name: string; price: number; quantity: number }[] }
