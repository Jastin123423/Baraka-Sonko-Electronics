
import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import { COLORS, CATEGORIES } from '../constants';

interface AdminViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

type AdminTab = 'dashboard' | 'products' | 'orders';

const AdminView: React.FC<AdminViewProps> = ({ products, onAddProduct, onDeleteProduct }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    discount: '',
    category: '',
    videoUrl: '',
    images: [] as string[],
    descriptionImages: [] as string[]
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const data = new FormData();
        data.append('file', files[i]);
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data
        });
        
        if (res.ok) {
          const result = await res.json();
          urls.push(result.url);
        }
      }
      if (type === 'image') {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
      } else {
        setFormData(prev => ({ ...prev, videoUrl: urls[0] }));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || formData.images.length === 0) return;

    const newProduct: Product = {
      id: Date.now().toString(),
      title: formData.title,
      price: parseFloat(formData.price),
      discount: formData.discount ? parseInt(formData.discount) : undefined,
      category: formData.category,
      image: formData.images[0],
      images: formData.images,
      descriptionImages: formData.descriptionImages,
      videoUrl: formData.videoUrl,
      soldCount: '0 sold',
      status: 'online'
    };

    onAddProduct(newProduct);
    setIsAdding(false);
    setFormData({ title: '', price: '', discount: '', category: '', videoUrl: '', images: [], descriptionImages: [] });
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</p>
        <p className="text-xl font-black text-gray-800 mt-1">TSh 4.2M</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</p>
        <p className="text-xl font-black text-gray-800 mt-1">128</p>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Listings</h3>
        <button onClick={() => setIsAdding(true)} className="bg-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-xl">ADD NEW</button>
      </div>
      {products.map(p => (
        <div key={p.id} className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center space-x-3">
          <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
          <div className="flex-grow min-w-0">
            <p className="text-[11px] font-bold text-gray-800 truncate">{p.title}</p>
            <p className="text-[10px] font-black text-orange-600 uppercase">TSh {p.price.toLocaleString()}</p>
          </div>
          <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-gray-300 hover:text-red-500">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100 px-4">
        <div className="flex space-x-8 py-4">
          {(['dashboard', 'products', 'orders'] as AdminTab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-[11px] font-black uppercase tracking-wider relative pb-2 ${activeTab === tab ? 'text-orange-600' : 'text-gray-400'}`}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && (
          <div className="text-center py-20 opacity-30">
            <p className="text-xs font-bold uppercase tracking-widest">No orders yet</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-end">
           <div className="bg-white w-full rounded-t-3xl p-6 animate-slideUp overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between mb-6">
                <h3 className="text-lg font-black uppercase">Publish Product</h3>
                <button onClick={() => setIsAdding(false)} className="text-2xl">&times;</button>
             </div>
             <form onSubmit={handleSubmit} className="space-y-4 pb-10">
                <input type="text" placeholder="Title" required className="w-full bg-gray-50 p-4 rounded-xl text-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <input type="number" placeholder="Price" required className="w-full bg-gray-50 p-4 rounded-xl text-sm" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <select required className="w-full bg-gray-50 p-4 rounded-xl text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <div className="p-4 border-2 border-dashed border-gray-100 rounded-xl text-center">
                   <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Featured Image</p>
                   <input type="file" onChange={e => handleFileUpload(e, 'image')} className="hidden" id="img-upload" />
                   <label htmlFor="img-upload" className="inline-block bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-[10px] font-black cursor-pointer">CHOOSE FILE</label>
                   {formData.images.length > 0 && <p className="text-[9px] mt-2 text-green-500">{formData.images.length} images selected</p>}
                </div>
                <button disabled={isUploading} type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-sm uppercase">
                  {isUploading ? 'Uploading...' : 'Publish Product'}
                </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
