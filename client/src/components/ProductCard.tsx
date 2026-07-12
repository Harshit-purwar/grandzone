import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const images = product.images ? JSON.parse(product.images) : [];
  const imageUrl = images.length > 0 ? images[0] : null;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiShoppingCart className="w-12 h-12" />
            </div>
          )}
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-secondary-400 text-white text-xs px-2 py-1 rounded-full font-bold">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-primary-600">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
