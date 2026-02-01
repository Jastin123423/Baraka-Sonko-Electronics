
import { Product, Category, Order } from '../types';

/**
 * Toggle this to 'true' when you deploy the Worker backend provided in worker.ts
 */
const USE_REAL_BACKEND = false;
const API_BASE_URL = 'https://api.barakasonko.com';

const DB_KEY = 'sonko_db_products';
const ORDERS_KEY = 'sonko_db_orders';

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
    const response = await fetch(`${API_BASE_URL}/api/products`);
    return response.json();
  }
  
  // Simulation Mode
  await new Promise(r => setTimeout(r, 500));
  return getStoredData(DB_KEY, SEED_PRODUCTS);
}

export async function getProductById(id: string): Promise<Product> {
  if (USE_REAL_BACKEND) {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    return response.json();
  }

  const products = await getProducts();
  const prod = products.find(p => p.id === id);
  if (!prod) throw new Error('Product not found');
  return prod;
}

export async function addProduct(product: Partial<Product>): Promise<Product> {
  if (USE_REAL_BACKEND) {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return response.json();
  }

  const products = await getProducts();
  const newProduct = { 
    ...product, 
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  } as Product;
  setStoredData(DB_KEY, [newProduct, ...products]);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  if (USE_REAL_BACKEND) {
    await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
    return;
  }

  const products = await getProducts();
  setStoredData(DB_KEY, products.filter(p => p.id !== id));
}

export async function getOrders(): Promise<Order[]> {
  if (USE_REAL_BACKEND) {
    const response = await fetch(`${API_BASE_URL}/api/orders`);
    return response.json();
  }
  return getStoredData(ORDERS_KEY, []);
}

export async function uploadMedia(file: File | string, type: 'image' | 'video'): Promise<string> {
  if (typeof file === 'string') return file;

  if (USE_REAL_BACKEND) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    return result.url;
  }

  // Simulation Mode: Create local URL
  return URL.createObjectURL(file);
}
