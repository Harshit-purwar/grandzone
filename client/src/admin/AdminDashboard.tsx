import { useState, useEffect } from 'react';
import { getDashboard } from '../api';
import { DashboardStats } from '../types';
import { FiPackage, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboard().then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="text-center py-8">Loading...</div>;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, icon: FiPackage, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-purple-500' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Confirmed', value: stats.confirmedOrders, icon: FiCheckCircle, color: 'bg-blue-500' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: FiCheckCircle, color: 'bg-green-500' },
    { label: 'Cancelled', value: stats.cancelledOrders, icon: FiXCircle, color: 'bg-red-500' },
    { label: "Today's Orders", value: stats.todayOrders, icon: FiClock, color: 'bg-indigo-500' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: FiDollarSign, color: 'bg-green-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
