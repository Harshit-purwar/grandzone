import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, getBanners } from '../api';
import { Product, Category, Banner } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FiChevronRight } from 'react-icons/fi';

// Category icon mapping
const categoryIcons: Record<string, string> = {
  'Chargers': '🔌',
  'Fast Chargers': '⚡',
  'Type-C Cable': '🔗',
  'Lightning Cable': '⚡',
  'Micro USB Cable': '🔌',
  'Power Bank': '🔋',
  'Earbuds': '🎧',
  'Bluetooth Speaker': '🔊',
  'Neckband': '🎵',
  'Smart Watch': '⌚',
  'Phone Cover': '📱',
  'Tempered Glass': '🛡️',
  'Car Charger': '🚗',
  'Mobile Stand': '📐',
  'Tripod': '📷',
  'Ring Light': '💡',
  'Memory Card': '💾',
  'Pendrive': '💿',
  'Laptop Accessories': '💻',
  'Perfume': '🧴',
  'Wallet': '👛',
  'Bag': '🎒',
  'Bottle': '🍶',
};

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, bannersRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getBanners()
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setBanners(bannersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-scroll banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const getIcon = (catName: string, icon?: string) => categoryIcons[catName] || icon || '📦';

  return (
    <div className="px-4 py-4 space-y-6 animate-fade-in">
      {/* Offer Banner Slider */}
      {banners.length > 0 && (
        <div className="relative overflow-hidden rounded-xl" ref={bannerRef}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className={`flex-shrink-0 w-full bg-gradient-to-r ${banner.bgColor} rounded-xl p-6 relative overflow-hidden`}
              >
                {banner.image && (
                  <img src={banner.image} alt="" className="absolute right-0 top-0 h-full w-1/3 object-cover opacity-30" />
                )}
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white">{banner.title}</h2>
                  {banner.subtitle && <p className="text-white/90 mt-1">{banner.subtitle}</p>}
                  {banner.link && (
                    <button className="mt-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Shop Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Dots indicator */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentBanner ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories with Icons */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Categories</h2>
          <Link to="/categories" className="text-primary-600 text-sm flex items-center gap-1">
            View All <FiChevronRight />
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/search?category=${cat.id}`}
              className="bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">{getIcon(cat.name, cat.icon)}</span>
              </div>
              <p className="text-xs text-gray-700 line-clamp-2 font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 className="text-lg font-bold text-gray-800 mb-3">All Products</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
