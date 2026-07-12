import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories, getProducts } from '../api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

// Category icon mapping
const categoryIcons: Record<string, string> = {
  'Chargers': '🔌', 'Fast Chargers': '⚡', 'Type-C Cable': '🔗',
  'Lightning Cable': '⚡', 'Micro USB Cable': '🔌', 'Power Bank': '🔋',
  'Earbuds': '🎧', 'Bluetooth Speaker': '🔊', 'Neckband': '🎵',
  'Smart Watch': '⌚', 'Phone Cover': '📱', 'Tempered Glass': '🛡️',
  'Car Charger': '🚗', 'Mobile Stand': '📐', 'Tripod': '📷',
  'Ring Light': '💡', 'Memory Card': '💾', 'Pendrive': '💿',
  'Laptop Accessories': '💻', 'Perfume': '🧴', 'Wallet': '👛',
  'Bag': '🎒', 'Bottle': '🍶',
};

const getIcon = (name: string, icon?: string) => categoryIcons[name] || icon || '📦';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(res => {
      setCategories(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getProducts({ category: selectedCategory }).then(res => setProducts(res.data));
    } else {
      setProducts([]);
    }
  }, [selectedCategory]);

  return (
    <div className="px-4 py-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Categories</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`p-4 rounded-xl text-center transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
            }`}
          >
            <span className="text-2xl block mb-2">{getIcon(cat.name, cat.icon)}</span>
            <span className="text-sm font-medium">{cat.name}</span>
            {cat._count && (
              <span className={`text-xs block mt-1 ${selectedCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                {cat._count.products} items
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            {categories.find(c => c.id === selectedCategory)?.name}
          </h2>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products in this category</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
