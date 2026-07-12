import { useState, useEffect } from 'react';
import { adminGetOrders, updateOrderStatus } from '../api';
import { Order } from '../types';
import { FiEye } from 'react-icons/fi';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    const res = await adminGetOrders(filter || undefined);
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2 bg-white rounded-lg border border-gray-200 outline-none">
          <option value="">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Order #{viewOrder.orderNumber}</h2>
              <button onClick={() => setViewOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-bold text-sm mb-2">Customer Details</h3>
                <p className="text-sm">{viewOrder.name}</p>
                <p className="text-sm text-gray-600">{viewOrder.mobile}</p>
                <p className="text-sm text-gray-600">{viewOrder.address}, {viewOrder.pincode}</p>
                {viewOrder.landmark && <p className="text-sm text-gray-500">Landmark: {viewOrder.landmark}</p>}
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-bold text-sm mb-2">Products</h3>
                {viewOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">₹{viewOrder.totalAmount}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Update Status</label>
                <select
                  value={viewOrder.status}
                  onChange={e => {
                    handleStatusChange(viewOrder.id, e.target.value);
                    setViewOrder({ ...viewOrder, status: e.target.value });
                  }}
                  className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{order.name}</p>
                    <p className="text-xs text-gray-500">{order.mobile}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-primary-600">₹{order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setViewOrder(order)} className="text-blue-600 hover:text-blue-700 p-1">
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
