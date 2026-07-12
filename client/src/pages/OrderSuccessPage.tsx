import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../api';
import { Order } from '../types';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';

export const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      getOrder(id).then(res => setOrder(res.data));
    }
  }, [id]);

  return (
    <div className="px-4 py-8 text-center animate-bounce-in">
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheckCircle className="w-12 h-12 text-primary-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-6">Thank you for shopping with GrandZone</p>

      {order && (
        <div className="bg-white rounded-xl p-4 shadow-sm text-left mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FiPackage className="text-primary-600" />
            <span className="font-bold text-gray-800">Order #{order.orderNumber}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{order.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mobile</span>
              <span className="font-medium">{order.mobile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount</span>
              <span className="font-bold text-primary-600">₹{order.totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">
                {order.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <Link
        to="/"
        className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};
