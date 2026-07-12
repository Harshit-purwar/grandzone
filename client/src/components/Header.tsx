import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export const Header = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 bg-white shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GZ</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">GrandZone</h1>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/search')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiSearch className="w-5 h-5 text-gray-600" />
            </button>
            <Link
              to="/cart"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <FiShoppingCart className="w-5 h-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <FiMapPin className="w-4 h-4 text-primary-600" />
          <span>Deliver to: <strong className="text-gray-700">Your Location</strong></span>
        </div>
      </div>
    </header>
  );
};
