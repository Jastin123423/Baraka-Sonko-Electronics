
import { Product, Category, Order } from '../types';

const DB_KEY = 'sonko_db_products';
const ORDERS_KEY = 'sonko_db_orders';

// Seed Data to ensure preview isn't blank on first load
const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Samsung Galaxy S24 Ultra - Titanium Gray',
    price: 2850000,
    discount: 10,
    category: 'Mobiles',
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

export const api = {
  // Products (Simulating D1)
  getProducts: async (): Promise<Product[]> => {
    // Artificial delay to simulate real network
    await new Promise(r => setTimeout(r, 500));
    return getStoredData(DB_KEY, SEED_PRODUCTS);
  },

  getProductById: async (id: string): Promise<Product> => {
    const products = await api.getProducts();
    const prod = products.find(p => p.id === id);
    if (!prod) throw new Error('Product not found');
    return prod;
  },

  addProduct: async (product: Partial<Product>): Promise<Product> => {
    const products = await api.getProducts();
    const newProduct = { ...product, id: Date.now().toString() } as Product;
    setStoredData(DB_KEY, [newProduct, ...products]);
    return newProduct;
  },

  deleteProduct: async (id: string): Promise<void> => {
    const products = await api.getProducts();
    setStoredData(DB_KEY, products.filter(p => p.id !== id));
  },

  // Orders (Simulating D1)
  getOrders: async (): Promise<Order[]> => {
    return getStoredData(ORDERS_KEY, []);
  },

  // Media Upload (Simulating R2)
  uploadMedia: async (file: File | string, type: 'image' | 'video'): Promise<string> => {
    if (typeof file === 'string') return file;
    // In a real app, this would upload to R2 and return a public URL.
    // For this simulation, we'll create a local Object URL or return a placeholder
    return URL.createObjectURL(file);
  }
};
