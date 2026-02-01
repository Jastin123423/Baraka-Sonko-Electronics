
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import ProductGrid from './ProductGrid';

interface AllProductsViewProps {
  allProducts: Product[];
  onProductClick: (product: Product) => void;
  onBack: () => void;
  title?: string;
}

const AllProductsView: React.FC<AllProductsViewProps> = ({ allProducts, onProductClick, onBack, title = "Bidhaa Zote" }) => {
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);

  // Shuffle all products once when component mounts for that "Daily Discovery" feel
  const shuffledProducts = useMemo(() => {
    return [...allProducts].sort(() => Math.random() - 0.5);
  }, [allProducts.length]);

  const loadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + PAGE_SIZE);
      setIsLoading(false);
    }, 800);
  };

  // Generate the list to display, handling "infinite" loop for demo purposes
  const displayItems = useMemo(() => {
    let items = [...shuffledProducts];
    while (items.length < visibleCount) {
      items = [...items, ...shuffledProducts.map(p => ({
        ...p,
        id: `${p.id}-loop-${items.length}-${Math.random()}`
      }))];
    }
    return items.slice(0, visibleCount);
  }, [shuffledProducts, visibleCount]);

  return (
    <div className="bg-white min-h-screen animate-fadeIn">
      {/* Sticky Header */}
      <div className="bg-white px-4 py-3 flex items-center sticky top-[68px] z-[40] shadow-sm border-b border-gray-100">
        <button 
          onClick={onBack} 
          className="mr-3 p-2 -ml-2 text-gray-800 active:scale-90 transition-transform bg-gray-50 rounded-full"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">{title}</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Explore Our Collection</p>
        </div>
      </div>

      <div className="pt-2">
        <ProductGrid 
          products={displayItems} 
          onProductClick={onProductClick} 
          onLoadMore={loadMore}
          hasMore={true}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AllProductsView;
