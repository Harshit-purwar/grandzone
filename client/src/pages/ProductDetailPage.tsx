import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getRelatedProducts } from '../api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      getProduct(id).then(res => {
        setProduct(res.data);
        if (res.data.categoryId) {
          getRelatedProducts(res.data.categoryId, res.data.id).then(r => setRelated(r.data));
        }
      });
    }
  }, [id]);

  if (!product) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const images = product.images ? JSON.parse(product.images) : [];

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <div className="px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
          <FiArrowLeft /> Back
        </Link>
      </div>

      <div className="px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FiShoppingCart className="w-20 h-20" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === i ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
            {product.brand && <p className="text-gray-500 mb-2">{product.brand}</p>}

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-primary-600">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-sm font-bold">
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </p>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-200 rounded-l-lg transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-200 rounded-r-lg transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
