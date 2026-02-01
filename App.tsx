
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import Footer from './components/Footer';
import { CATEGORIES } from './constants';
import { Product, User, Category } from './types';
import { slugify, getProductUrl, getCategoryUrl } from './utils/routing';
import { getCurrentUser, logoutUser, getProducts } from './services/api';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'home' | 'admin' | 'product-detail' | 'category-results' | 'categories' | 'search-results' | 'all-products' | 'about' | 'privacy' | 'terms'>('home');
  const [listTitle, setListTitle] = useState('Bidhaa Zote');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  
  const loadData = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    setUser(getCurrentUser());
  }, [loadData]);

  const handleRouteChange = useCallback(async () => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    setIsSidebarOpen(false);

    if (path === '/' || segments.length === 0) {
      setView('home');
      setSearchQuery('');
      setSelectedProduct(null);
      setSelectedCategory(null);
    } else if (path === '/admin') {
      setView('admin');
    } else if (path === '/categories') {
      setView('categories');
    } else if (path === '/all-products') {
      setView('all-products');
      if (!listTitle || listTitle === 'Bidhaa Zote') setListTitle('Bidhaa Zote');
    } else if (path === '/about') {
      setView('about');
    } else if (path === '/Privacy-and-Policy') {
      setView('privacy');
    } else if (path === '/terms-of-service') {
      setView('terms');
    } else if (segments[0] === 'category' && segments[1]) {
      const cat = CATEGORIES.find(c => slugify(c.name) === segments[1]);
      if (cat) {
        setSelectedCategory(cat);
        setView('category-results');
      } else {
        setView('home');
      }
    } else if (segments[0] === 'search' && segments[1]) {
      setSearchQuery(decodeURIComponent(segments[1]));
      setView('search-results');
    } else if (segments.length >= 1) {
      const lastSegment = segments[segments.length - 1];
      const idMatch = lastSegment ? lastSegment.match(/--([a-z0-9.-]+)$/i) : null;
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];
        let prod = products.find(p => p.id === id);
        if (prod) {
          setSelectedProduct(prod);
          setView('product-detail');
        } else {
          // Attempt fetch if not in local list
          try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
              const data = await res.json();
              setSelectedProduct(data);
              setView('product-detail');
            } else {
              setView('home');
            }
          } catch(e) { setView('home'); }
        }
      } else {
        setView('home');
      }
    } else {
      setView('home');
    }
    window.scrollTo(0, 0);
  }, [products, listTitle]);

  const navigate = useCallback((path: string, newView: typeof view, title?: string, prod?: Product | null, cat?: Category | null) => {
    if (title) setListTitle(title);
    window.history.pushState({ view: newView, title, prod, cat }, '', path);
    handleRouteChange();
  }, [handleRouteChange]);

  useEffect(() => {
    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [handleRouteChange]);

  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PAGE_SIZE = 8;

  useEffect(() => {
    setVisibleProducts(products.slice(0, PAGE_SIZE));
  }, [products]);

  const loadMoreHome = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleProducts(prev => {
        const nextBatch = products.slice(prev.length, prev.length + PAGE_SIZE);
        return [...prev, ...nextBatch];
      });
      setIsLoadingMore(false);
    }, 800);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search/${encodeURIComponent(query)}`, 'search-results');
    } else {
      navigate('/', 'home');
    }
  };

  const handleCategorySelect = (category: Category) => {
    if (category.name === 'Bidhaa Zote') {
      openAllProducts('Bidhaa Zote');
      return;
    }
    navigate(getCategoryUrl(category.name), 'category-results', '', null, category);
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(newProduct),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleAdminAccess = () => {
    if (!user) setShowAuth(true);
    else navigate('/admin', 'admin');
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setShowAuth(false);
    navigate('/admin', 'admin');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/', 'home');
  };

  const handleProductClick = (product: Product) => {
    navigate(getProductUrl(product.category_name || product.category || 'electronics', product.title, product.id), 'product-detail', '', product);
  };

  const openAllProducts = (title: string) => {
    setListTitle(title);
    navigate('/all-products', 'all-products', title);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-white">
      {view === 'product-detail' && selectedProduct && (
        <ProductDetailView 
          product={selectedProduct} 
          allProducts={products}
          onBack={() => window.history.back()} 
          onProductClick={handleProductClick}
        />
      )}

      {showAuth && (
        <AuthView 
          onLogin={handleLogin} 
          onBack={() => setShowAuth(false)} 
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onCategorySelect={handleCategorySelect}
        onInfoPageSelect={(page) => {
          if (page === 'about') navigate('/about', 'about');
          if (page === 'privacy') navigate('/Privacy-and-Policy', 'privacy');
          if (page === 'terms') navigate('/terms-of-service', 'terms');
        }}
      />

      {view !== 'product-detail' && (
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onSearch={handleSearch}
          initialValue={searchQuery}
          onHomeClick={() => navigate('/', 'home')}
        />
      )}

      <main className="w-full max-w-[600px] mx-auto pb-24">
        {view === 'home' ? (
          <>
            <HeroBanner />
            <QuickActions onActionClick={(label) => openAllProducts(label)} />
            <CategorySection 
              onCategorySelect={handleCategorySelect} 
              onMoreClick={() => openAllProducts('All Categories')}
            />
            <FlashSale 
              products={products.slice(0, 5)} 
              onProductClick={handleProductClick} 
              onSeeAllClick={() => openAllProducts('Flash Sale')}
            />
            <ProductGrid 
              title="Daily Discoveries" 
              products={visibleProducts} 
              onProductClick={handleProductClick} 
              onLoadMore={loadMoreHome}
              hasMore={visibleProducts.length < products.length}
              isLoading={isLoadingMore}
            />
            <Footer onNavigate={(path, v) => navigate(path, v)} />
          </>
        ) : view === 'all-products' ? (
          <>
            <AllProductsView 
              allProducts={products} 
              onProductClick={handleProductClick} 
              onBack={() => window.history.back()} 
              title={listTitle}
            />
            <Footer onNavigate={(path, v) => navigate(path, v)} />
          </>
        ) : view === 'search-results' ? (
          <div className="animate-fadeIn p-4">
             <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Results for "{searchQuery}"
                </h2>
                {filteredProducts.length > 0 ? (
                  <ProductGrid 
                    products={filteredProducts} 
                    onProductClick={handleProductClick} 
                  />
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-sm font-bold text-gray-400">No products found</p>
                    <button onClick={() => handleSearch('')} className="mt-4 text-orange-600 font-bold text-xs underline">Clear Search</button>
                  </div>
                )}
             </div>
             <Footer onNavigate={(path, v) => navigate(path, v)} />
          </div>
        ) : view === 'categories' ? (
          <>
            <CategoriesView onCategorySelect={handleCategorySelect} />
            <Footer onNavigate={(path, v) => navigate(path, v)} />
          </>
        ) : view === 'category-results' && selectedCategory ? (
          <div className="animate-fadeIn">
            <div className="bg-white px-4 py-4 flex items-center sticky top-[68px] z-30 shadow-sm border-b border-gray-100">
              <button onClick={() => window.history.back()} className="mr-3 p-1 text-gray-800">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <h2 className="text-lg font-black text-gray-800 uppercase">{selectedCategory.name}</h2>
            </div>
            <ProductGrid 
              products={products.filter(p => p.category_name === selectedCategory.name || p.category === selectedCategory.name)} 
              onProductClick={handleProductClick} 
            />
            <Footer onNavigate={(path, v) => navigate(path, v)} />
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
               onAddProduct={handleAddProduct} 
               onDeleteProduct={handleDeleteProduct} 
             />
          </div>
        ) : (view === 'about' || view === 'privacy' || view === 'terms') ? (
          <div className="animate-fadeIn p-6 bg-white min-h-screen">
             <div className="flex items-center mb-6">
                <button onClick={() => window.history.back()} className="mr-4 p-2 bg-gray-50 rounded-full">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <h2 className="text-xl font-black uppercase tracking-tight">
                   {view === 'about' ? 'About Us' : view === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h2>
             </div>
             <div className="prose prose-sm text-gray-600 leading-relaxed mb-12">
                <p className="font-bold text-gray-800">Baraka Sonko Electronics is Tanzania's premier electronics retailer.</p>
                <p>We provide high-quality smartphones, audio systems, and appliances directly from verified manufacturers. Our goal is to bring the latest technology to every household in Tanzania with reliable service and genuine products.</p>
                <h3 className="text-gray-900 font-black mt-8 mb-2">Our Mission</h3>
                <p>To deliver high-end electronic products at competitive prices, backed by local support and authentic warranties.</p>
             </div>
             <Footer onNavigate={(path, v) => navigate(path, v)} />
          </div>
        ) : null}
      </main>

      {view !== 'product-detail' && (
        <BottomNav 
          currentView={view === 'admin' ? 'admin' : (view === 'categories' ? 'categories' : (view === 'all-products' ? 'all-products' : 'home'))} 
          onViewChange={(v) => {
            if (v === 'admin') handleAdminAccess();
            else if (v === 'all-products') openAllProducts('Bidhaa Zote');
            else if (v === 'categories') navigate('/categories', 'categories');
            else if (v === 'home') navigate('/', 'home');
          }} 
        />
      )}
    </div>
  );
};

export default App;
