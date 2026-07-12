import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api';
import { FiMapPin, FiUser, FiPhone, FiFileText } from 'react-icons/fi';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    address: '',
    pincode: '',
    landmark: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        ...form,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };
      const res = await placeOrder(orderData);
      clearCart();
      navigate(`/order-success/${res.data.id}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link to="/" className="text-primary-600 font-medium">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Delivery Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FiMapPin className="text-primary-600" /> Delivery Details
          </h2>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Mobile Number *</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                required
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Complete Address *</label>
            <textarea
              required
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              rows={3}
              placeholder="Enter complete address"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Pincode *</label>
            <input
              type="text"
              required
              value={form.pincode}
              onChange={e => setForm({ ...form, pincode: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Enter pincode"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Landmark (Optional)</label>
            <input
              type="text"
              value={form.landmark}
              onChange={e => setForm({ ...form, landmark: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Enter landmark"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
            <FiFileText className="text-primary-600" /> Order Summary
          </h2>
          <div className="space-y-2 mb-3">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{product.name} x{quantity}</span>
                <span className="font-medium">₹{product.price * quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-bold text-gray-800">Total</span>
            <span className="font-bold text-primary-600 text-lg">₹{totalPrice}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-2">Payment Method</h2>
          <div className="flex items-center gap-3 bg-primary-50 p-3 rounded-lg">
            <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="font-medium text-primary-800">Cash on Delivery</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3.5 rounded-xl font-bold text-lg transition-colors"
        >
          {loading ? 'Placing Order...' : `Place Order - ₹${totalPrice}`}
        </button>
      </form>
    </div>
  );
};
