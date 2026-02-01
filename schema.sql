
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
  image TEXT NOT NULL,
  images TEXT, -- Stored as JSON string array
  description_images TEXT, -- Stored as JSON string array
  video_url TEXT,
  price REAL NOT NULL,
  original_price REAL,
  discount INTEGER,
  sold_count TEXT DEFAULT '0 sold',
  order_count TEXT DEFAULT '0 orders',
  rating REAL DEFAULT 5.0,
  category_id TEXT,
  status TEXT DEFAULT 'online',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- For real auth
  role TEXT DEFAULT 'user', -- 'admin' or 'user'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'canceled'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items (Many-to-Many linking orders and products)
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price_at_purchase REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Initial Category Seeding
INSERT OR IGNORE INTO categories (id, name, icon) VALUES 
('cat_1', 'Mobiles', '📱'),
('cat_2', 'Spika', '🔊'),
('cat_3', 'Mic', '🎤'),
('cat_4', 'Subwoofer', '📻'),
('cat_5', 'Fridge', '🧊'),
('cat_6', 'TV', '📺'),
('cat_7', 'Accessories', '🎧');
