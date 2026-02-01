
-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL, -- Featured image URL
  images TEXT, -- JSON array of gallery image URLs
  description_images TEXT, -- JSON array of detailed description image URLs
  video_url TEXT,
  price REAL NOT NULL,
  original_price REAL,
  discount INTEGER,
  sold_count TEXT DEFAULT '0 sold',
  order_count TEXT DEFAULT '0 orders',
  rating REAL DEFAULT 5.0,
  category_id TEXT,
  category_name TEXT, -- Denormalized for simpler UI logic
  status TEXT DEFAULT 'online',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Users Table (Admin & Customer)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user', -- 'admin' or 'user'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'canceled'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price_at_purchase REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Initial Categories
INSERT OR IGNORE INTO categories (id, name, icon) VALUES 
('c1', 'Mobiles', '📱'),
('c2', 'Spika', '🔊'),
('c3', 'Mic', '🎤'),
('c4', 'Subwoofer', '📻'),
('c5', 'Fridge', '🧊'),
('c6', 'TV', '📺'),
('c7', 'Accessories', '🎧');
