
import React from 'react';
import { CATEGORIES, COLORS } from '../constants';
import { Category } from '../types';

interface CategoriesViewProps {
  onCategorySelect: (category: Category) => void;
}

const CategoriesView: React.FC<CategoriesViewProps> = ({ onCategorySelect }) => {
  return (
    <div className="bg-white min-h-screen pb-10 animate-fadeIn">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 flex flex-col">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">All Categories</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Explore Baraka Sonko Collection</p>
      </div>

      {/* Grid */}
      <div className="px-4 grid grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => onCategorySelect(cat)}
            className="flex flex-col items-center justify-center aspect-square p-4 rounded-3xl bg-gray-50 border border-gray-100 active:scale-95 transition-all group cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <span className="text-[11px] font-black text-gray-800 text-center leading-tight tracking-tighter">
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 px-6 py-8 bg-gray-50 border-t border-gray-100 flex flex-col items-center text-center">
        <div className="w-12 h-1 bg-orange-200 rounded-full mb-4" />
        <p className="text-sm font-bold text-gray-600 leading-relaxed">
          Can't find what you're looking for?<br/>
          Check our <span className="text-orange-600">New Arrivals</span> daily!
        </p>
      </div>
    </div>
  );
};

export default CategoriesView;
