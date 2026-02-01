
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import QuickActions from './components/QuickActions';
import CategorySection from './components/CategorySection';
import FlashSale from './components/FlashSale';
import ProductGrid from './components/ProductGrid';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import AdminView from './components/AdminView';
import AuthView from './components/AuthView';
import ProductDetailView from './components/ProductDetailView';
import CategoriesView from './components/CategoriesView';
import AllProductsView from './components/AllProductsView';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { Product, User, Category } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'home' | 'admin' | 'product-detail' | 'category-results' | 'categories' | 'search-results' | 'all-products'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Infinite Scroll State
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PAGE_SIZE = 8;

  // Search Logic
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return products.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category?.toLowerCase().includes(q)
    );
  }, [searchQuery, products]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return CATEGORIES.filter(c => c.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setView('search-results');
    } else {
      setView('home');
    }
  };

  // Initialize home products
  useEffect(() => {
    setVisibleProducts(products.slice(0, PAGE_SIZE));
  }, [products]);

  // Handle Home Infinite Scroll
  const loadMoreHome = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleProducts(prev => {
        const nextBatch = products.slice(prev.length, prev.length + PAGE_SIZE);
        if (nextBatch.length === 0) {
          return [...prev, ...products.slice(0, PAGE_SIZE).map(p => ({ ...p, id: p.id + Math.random().toString() }))];
        }
        return [...prev, ...nextBatch];
      });
      setIsLoadingMore(false);
    }, 800);
  };

  const handleCategorySelect = (category: Category) => {
    if (category.name === 'Bidhaa Zote') {
      setView('all-products');
      setIsSidebarOpen(false);
      window.scrollTo(0, 0);
      return;
    }
    setSelectedCategory(category);
    const filtered = products.filter(p => p.category === category.name);
    setCategoryProducts(filtered.length > 0 ? filtered.slice(0, PAGE_SIZE) : products.slice(0, PAGE_SIZE)); // Fallback for mock
    setView('category-results');
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const [user, setUser] = useState<User | null>({
    id: 'admin-1',
    name: 'Sonko Admin',
    email: 'admin@sonko.com'
  });
  
  const [showAuth, setShowAuth] = useState(false);

  const addProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAdminAccess = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setView('admin');
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setShowAuth(false);
    setView('admin');
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* Product Detail Overlay */}
      {view === 'product-detail' && selectedProduct && (
        <ProductDetailView 
          product={selectedProduct} 
          allProducts={products}
          onBack={() => {
            if (searchQuery) setView('search-results');
            else if (selectedCategory) setView('category-results');
            else if (view === 'all-products') setView('all-products'); // Stay on all products
            else setView('home');
          }} 
          onProductClick={handleProductClick}
        />
      )}

      {/* Auth Portal Overlay */}
      {showAuth && (
        <AuthView 
          onLogin={handleLogin} 
          onBack={() => setShowAuth(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onCategorySelect={handleCategorySelect}
      />

      {/* Persistent Header */}
      {view !== 'product-detail' && (
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onSearch={handleSearch}
          initialValue={searchQuery}
        />
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-[600px] mx-auto pb-24">
        {view === 'home' ? (
          <>
            <HeroBanner />
            <QuickActions onActionClick={() => setView('all-products')} />
            <CategorySection 
              onCategorySelect={handleCategorySelect} 
              onMoreClick={() => setView('all-products')}
            />
            <FlashSale 
              products={products.slice(0, 5)} 
              onProductClick={handleProductClick} 
              onSeeAllClick={() => setView('all-products')}
            />
            <ProductGrid 
              title="Daily Discoveries" 
              products={visibleProducts} 
              onProductClick={handleProductClick} 
              onLoadMore={loadMoreHome}
              hasMore={true}
              isLoading={isLoadingMore}
            />
          </>
        ) : view === 'all-products' ? (
          <AllProductsView 
            allProducts={products} 
            onProductClick={handleProductClick} 
            onBack={() => setView('home')} 
          />
        ) : view === 'search-results' ? (
          <div className="animate-fadeIn p-4">
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                Results for "{searchQuery}"
              </h2>
              
              {filteredCategories.length > 0 && (
                <div className="mb-6">
                   <h3 className="text-[10px] font-black text-gray-400 uppercase mb-3">Matching Categories</h3>
                   <div className="flex flex-wrap gap-2">
                      {filteredCategories.map(cat => (
                        <button 
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat)}
                          className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-xs font-bold text-gray-700 active:scale-95 transition-all flex items-center space-x-2"
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {filteredProducts.length > 0 ? (
                <ProductGrid 
                  products={filteredProducts} 
                  onProductClick={handleProductClick} 
                />
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-sm font-bold text-gray-400">Hakuna bidhaa iliyopatikana kwa "{searchQuery}"</p>
                  <button 
                    onClick={() => handleSearch('')}
                    className="mt-4 text-orange-600 font-bold text-xs underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : view === 'categories' ? (
          <CategoriesView onCategorySelect={handleCategorySelect} />
        ) : view === 'category-results' && selectedCategory ? (
          <div className="animate-fadeIn">
            <div className="bg-white px-4 py-4 flex items-center sticky top-[68px] z-30 shadow-sm border-b border-gray-50">
              <button 
                onClick={() => {
                  setView('categories');
                  setSelectedCategory(null);
                }} 
                className="mr-3 p-1 text-gray-800"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <h2 className="text-lg font-black text-gray-800 flex items-center space-x-2">
                <span>{selectedCategory.name}</span>
              </h2>
            </div>
            <div className="pt-2">
              <ProductGrid 
                products={categoryProducts} 
                onProductClick={handleProductClick} 
                onLoadMore={() => {}} // Category view simpler for now
                hasMore={false}
                isLoading={false}
              />
            </div>
          </div>
        ) : view === 'admin' ? (
          <div className="bg-white min-h-screen">
             <div className="p-4 bg-gray-50 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {user?.name.charAt(0)}
                   </div>
                   <div>
                      <p className="text-xs text-gray-400 font-medium">Logged in as</p>
                      <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                   </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                >
                  LOGOUT
                </button>
             </div>
             <AdminView 
               products={products} 
               onAddProduct={addProduct} 
               onDeleteProduct={deleteProduct} 
             />
          </div>
        ) : null}
      </main>

      {/* Bottom Sticky Navigation */}
      {view !== 'product-detail' && (
        <BottomNav 
          currentView={view === 'admin' ? 'admin' : (view === 'categories' ? 'categories' : (view === 'all-products' ? 'all-products' : 'home'))} 
          onViewChange={(v) => {
            if (v === 'admin') {
              handleAdminAccess();
            } else {
              setSearchQuery('');
              setView(v as any);
              setSelectedCategory(null);
            }
          }} 
        />
      )}
    </div>
  );
};

export default App;