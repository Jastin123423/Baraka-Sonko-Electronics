
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
  status?: 'online' | 'pending' | 'out-of-stock';
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
}

export interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'processing' | 'completed' | 'canceled';
  date: string;
}

export interface AdminStats {
  netSales: number;
  earnings: number;
  pageViews: number;
  totalOrders: number;
}
