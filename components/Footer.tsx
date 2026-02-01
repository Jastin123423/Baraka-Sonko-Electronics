
import React from 'react';
import { COLORS } from '../constants';

interface FooterProps {
  onNavigate?: (path: string, view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string, view: any) => {
    if (onNavigate) onNavigate(path, view);
    else window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-white pt-8 pb-20 border-t border-gray-100">
      <div className="px-6 mb-8 flex flex-col items-center">
        <div 
          className="text-2xl font-black italic tracking-tighter mb-4 cursor-pointer" 
          style={{ color: COLORS.primary }}
          onClick={() => handleNav('/', 'home')}
        >
          BARAKA SONKO
        </div>
        <div className="text-[11px] text-gray-400 text-center leading-relaxed">
          The best online electronics store in Tanzania. Wide variety of products from smartphones to sound systems.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 px-6 mb-8 text-[12px] text-gray-600">
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900 uppercase">Customer Service</h4>
          <button onClick={() => handleNav('/about', 'about')} className="block hover:text-orange-600 transition-colors">Help Center</button>
          <button onClick={() => handleNav('/all-products', 'all-products')} className="block hover:text-orange-600 transition-colors">Shipping Info</button>
          <button onClick={() => handleNav('/terms-of-service', 'terms')} className="block hover:text-orange-600 transition-colors">Returns & Refund</button>
          <button className="block hover:text-orange-600 transition-colors">Contact Us</button>
        </div>
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900 uppercase">About SONKO</h4>
          <button onClick={() => handleNav('/about', 'about')} className="block hover:text-orange-600 transition-colors">Who We Are</button>
          <button className="block hover:text-orange-600 transition-colors">Business Partnership</button>
          <button onClick={() => handleNav('/Privacy-and-Policy', 'privacy')} className="block hover:text-orange-600 transition-colors">Privacy Policy</button>
          <button onClick={() => handleNav('/terms-of-service', 'terms')} className="block hover:text-orange-600 transition-colors">Terms of Use</button>
        </div>
      </div>

      <div className="border-t border-gray-50 pt-4 px-6 flex flex-col items-center">
        <div className="flex space-x-4 mb-4 grayscale opacity-60">
          <img src="https://flagcdn.com/w40/tz.png" alt="tz" className="h-4 w-6 object-cover rounded shadow-sm" />
          <img src="https://picsum.photos/seed/pay1/40/24" alt="visa" className="h-4" />
          <img src="https://picsum.photos/seed/pay2/40/24" alt="master" className="h-4" />
        </div>
        <p className="text-[10px] text-gray-400">© 2025 BARAKA SONKO. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
