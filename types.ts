
export interface Product {
  id: string;
  title: string;
  image: string; // Featured image
  images?: string[]; // Gallery slider images
  descriptionImages?: string[]; // Images shown below description
  videoUrl?: string; // Product video
  price: number;
  originalPrice?: number;
  discount?: number;
  soldCount?: string;
  orderCount?: string; // For masonry view
  rating?: number; // For masonry view
  category?: string;
  category_name?: string; // Added to match backend fields and frontend usage
  category_id?: string; // DB foreign key
  status?: 'online' | 'pending' | 'out-of-stock';
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Banner {
  id: string;
  image: string;
  link: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
}

export interface Order {
  id: string;
  customer: string;
  customer_phone?: string;
  total: number;
  status: 'processing' | 'completed' | 'canceled';
  date: string;
  items?: OrderItem[];
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface AdminStats {
  netSales: number;
  earnings: number;
  pageViews: number;
  totalOrders: number;
}
