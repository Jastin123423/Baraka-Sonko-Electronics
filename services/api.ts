
import { Product, Category, Order, User } from '../types';

/**
 * Toggle this to 'true' to use the /api endpoints
 */
const USE_REAL_BACKEND = true;

const DB_KEY = 'sonko_db_products';
const ORDERS_KEY = 'sonko_db_orders';
const USER_KEY = 'sonko_current_user';

// Fallback seed data for local mode
const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Samsung Galaxy S24 Ultra - Titanium Gray',
    price: 2850000,
    discount: 10,
    category: 'Mobiles',
    category_id: 'cat_1',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    soldCount: '42 sold',
    rating: 4.9,
    status: 'online'
  },
  {
    id: 'p2',
    title: 'Sony SRS-XG300 Portable Bluetooth Speaker',
    price: 650000,
    category: 'Spika',
    category_id: 'cat_2',
    image: 'https://images.unsplash.com/photo-1608156639585-34a0a56ee6c9?auto=format&fit=crop&w=600&q=80',
    soldCount: '15 sold',
    rating: 4.7,
    status: 'online'
  },
  {
    id: 'p3',
    title: 'Professional Studio Condenser Mic Bundle',
    price: 320000,
    discount: 15,
    category: 'Mic',
    category_id: 'cat_3',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    soldCount: '8 sold',
    rating: 4.5,
    status: 'online'
  }
];

const getStoredData = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setStoredData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// API Functions
export async function getProducts(): Promise<Product[]> {
  if (USE_REAL_BACKEND) {
    try {
      const response = await fetch('/api/products');
      if (response.ok) return response.json();
    } catch (e) { console.warn("Backend fail, fallback to mock"); }
  }
  return getStoredData(DB_KEY, SEED_PRODUCTS);
}

export async function loginUser(credentials: any): Promise<User> {
  if (USE_REAL_BACKEND) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Login failed');
    }
    const user = await response.json();
    setStoredData(USER_KEY, user);
    return user;
  }
  // Mock login
  await new Promise(r => setTimeout(r, 800));
  const user = { id: 'admin-1', name: 'Sonko Admin', email: credentials.email };
  setStoredData(USER_KEY, user);
  return user;
}

export async function registerUser(data: any): Promise<User> {
  if (USE_REAL_BACKEND) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Registration failed');
    }
    const user = await response.json();
    setStoredData(USER_KEY, user);
    return user;
  }
  // Mock register
  await new Promise(r => setTimeout(r, 800));
  const user = { id: Date.now().toString(), name: data.name, email: data.email };
  setStoredData(USER_KEY, user);
  return user;
}

export function getCurrentUser(): User | null {
  return getStoredData(USER_KEY, null);
}

export function logoutUser(): void {
  localStorage.removeItem(USER_KEY);
}

export async function addProduct(product: Partial<Product>): Promise<Product> {
  if (USE_REAL_BACKEND) {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return response.json();
  }
  const products = await getProducts();
  const newProduct = { ...product, id: Date.now().toString(), created_at: new Date().toISOString() } as Product;
  setStoredData(DB_KEY, [newProduct, ...products]);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  if (USE_REAL_BACKEND) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    return;
  }
  const products = await getProducts();
  setStoredData(DB_KEY, products.filter(p => p.id !== id));
}
