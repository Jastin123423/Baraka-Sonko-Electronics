
import React from 'react';
import { ICONS, COLORS } from '../constants';

interface BottomNavProps {
  currentView: 'home' | 'categories' | 'admin' | 'all-products';
  onViewChange: (view: 'home' | 'categories' | 'admin' | 'all-products') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center py-2 px-2 z-50">
      <button 
        onClick={() => onViewChange('home')}
        className={`flex flex-col items-center transition-colors ${currentView === 'home' ? '' : 'text-gray-400'}`}
        style={currentView === 'home' ? { color: COLORS.primary } : {}}
      >
        <ICONS.Home />
        <span className="text-[10px] mt-0.5 font-bold">Home</span>
      </button>
      
      <button 
        onClick={() => onViewChange('categories')}
        className={`flex flex-col items-center transition-colors ${currentView === 'categories' ? '' : 'text-gray-400'}`}
        style={currentView === 'categories' ? { color: COLORS.primary } : {}}
      >
        <ICONS.List />
        <span className="text-[10px] mt-0.5 font-bold">Categories</span>
      </button>

      <button 
        onClick={() => onViewChange('all-products')}
        className={`flex flex-col items-center transition-colors ${currentView === 'all-products' ? '' : 'text-gray-400'}`}
        style={currentView === 'all-products' ? { color: COLORS.primary } : {}}
      >
        <ICONS.Grid />
        <span className="text-[10px] mt-0.5 font-bold">Bidhaa Zote</span>
      </button>
      
      <button className="flex flex-col items-center text-gray-400 opacity-50 pointer-events-none">
        <ICONS.Search />
        <span className="text-[10px] mt-0.5 font-medium">Search</span>
      </button>
      
      <button 
        onClick={() => onViewChange('admin')}
        className={`flex flex-col items-center transition-colors ${currentView === 'admin' ? '' : 'text-gray-400'}`}
        style={currentView === 'admin' ? { color: COLORS.primary } : {}}
      >
        <div className="relative">
          <ICONS.User />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <span className="text-[10px] mt-0.5 font-medium">Admin</span>
      </button>
    </div>
  );
};

export default BottomNav;
