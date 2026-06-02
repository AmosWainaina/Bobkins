import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign, FiRefreshCw, FiTrendingUp, FiTruck, FiCheckCircle } from 'react-icons/fi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    salesData: { labels: [], data: [] },
    topProducts: [],
    pendingOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated, user, accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const isAdmin = user?.is_staff === true || 
                    user?.role === 'admin' || 
                    user?.is_superuser === true ||
                    user?.user_type === 'admin';
    
    if (!isAuthenticated) {
      toast.error('Please login to access admin dashboard');
      navigate('/login');
    } else if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/shop');
    } else {
      fetchDashboardData();
    }
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = accessToken || localStorage.getItem('access_token');
      
      if (!token) {
        toast.error('Authentication token not found');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/analytics/dashboard/`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/shop');
      } else {
        toast.error('Failed to load dashboard data');
        // Set mock data for development
        setStats({
          totalSales: 125430,
          totalOrders: 342,
          totalProducts: 156,
          totalUsers: 1245,
          pendingOrders: 23,
          completedOrders: 319,
          recentOrders: [
            { id: 'ORD-001', user_name: 'John Doe', total: 2450, status: 'pending', created_at: '2024-01-15' },
            { id: 'ORD-002', user_name: 'Jane Smith', total: 1890, status: 'processing', created_at: '2024-01-14' },
            { id: 'ORD-003', user_name: 'Mike Johnson', total: 3200, status: 'shipped', created_at: '2024-01-13' },
          ],
          salesData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [12400, 19800, 15600, 28900, 34500, 42100]
          },
          topProducts: [
            { name: 'Smartphone X', sales: 234, revenue: 117000 },
            { name: 'Laptop Pro', sales: 156, revenue: 234000 },
            { name: 'Wireless Earbuds', sales: 445, revenue: 44500 },
          ]
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast.success('Dashboard refreshed!');
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = accessToken || localStorage.getItem('access_token');
      await axios.patch(`${API_URL}/orders/${orderId}/`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const salesChartData = {
    labels: stats.salesData.labels,
    datasets: [
      {
        label: 'Sales (Ksh)',
        data: stats.salesData.data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const topProductsChartData = {
    labels: stats.topProducts.map(p => p.name),
    datasets: [
      {
        label: 'Units Sold',
        data: stats.topProducts.map(p => p.sales),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.full_name || user?.phone || 'Admin'}!
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
        >
          <FiRefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 dark:text-gray-400">Total Sales</h3>
            <FiDollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            KES {stats.totalSales.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <FiTrendingUp className="h-3 w-3" />
            +12.5% from last month
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 dark:text-gray-400">Total Orders</h3>
            <FiShoppingBag className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.totalOrders}</p>
          <div className="flex gap-2 mt-2 text-xs">
            <span className="text-yellow-600">Pending: {stats.pendingOrders}</span>
            <span className="text-green-600">Completed: {stats.completedOrders}</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 dark:text-gray-400">Products</h3>
            <FiPackage className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.totalProducts}</p>
          <p className="text-sm text-gray-500 mt-2">Active products in store</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 dark:text-gray-400">Users</h3>
            <FiUsers className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.totalUsers}</p>
          <p className="text-sm text-gray-500 mt-2">Registered customers</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sales Overview</h2>
          <Line data={salesChartData} options={chartOptions} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Products</h2>
          <Bar data={topProductsChartData} options={chartOptions} />
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 rounded-lg">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order, index) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">#{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{order.user_name}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">KES {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)} border-0 cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition">
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {stats.recentOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;