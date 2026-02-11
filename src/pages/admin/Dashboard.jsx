import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminRoute from '../../components/admin/AdminRoute';
import { orderService, productService, promoCodeService } from '../../services/firebase';
import { siteConfig } from '../../config/siteConfig';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [orders, products, promoCodes] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts(),
        promoCodeService.getAllPromoCodes(),
      ]);

      // Filter out invalid orders and ensure they have required properties
      const validOrders = Array.isArray(orders) 
        ? orders.filter(order => order && order.id && order.paymentStatus && order.totalAmount !== undefined)
        : [];

      const validProducts = Array.isArray(products) 
        ? products.filter(product => product && product.stockQuantity !== undefined)
        : [];

      // Calculate stats with default values
      const totalRevenue = validOrders
        .filter(order => order.paymentStatus === 'paid')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const pendingOrders = validOrders.filter(order => order.status === 'pending').length;
      const lowStockProducts = validProducts.filter(product => product.stockQuantity < 10).length;

      setStats({
        totalOrders: validOrders.length,
        pendingOrders,
        totalRevenue,
        totalProducts: validProducts.length,
        lowStockProducts,
      });

      // Get recent valid orders (most recent first)
      const sortedOrders = [...validOrders]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
      setRecentOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AdminRoute>
      {/* No header here - it's now in AdminRoute */}
      
      {/* Stats Grid */}
      <div id="stats" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Stats Overview</h2>
          <button
            onClick={() => {
              const element = document.getElementById('stats');
              if (element) {
                window.scrollTo({
                  top: element.offsetTop - 120,
                  behavior: 'smooth'
                });
              }
            }}
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            Jump to Stats ↑
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStockProducts}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div id="recent-orders" className="bg-white rounded-xl shadow">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => {
                  const element = document.getElementById('recent-orders');
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 120,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Jump to Orders ↑
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No recent orders found
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => {
                      // Skip rendering if order doesn't have required fields
                      if (!order || !order.id) {
                        return null;
                      }
                      
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-primary-600 hover:text-primary-900 font-mono text-sm"
                            >
                              {order.id ? `${order.id.substring(0, 8)}...` : 'N/A'}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">
                                {order.customer?.fullName || 'Unknown Customer'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.customer?.phone || 'No phone'}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold">
                              ₦{(order.totalAmount || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.createdAt 
                              ? new Date(order.createdAt).toLocaleDateString() 
                              : 'N/A'
                            }
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {recentOrders.length > 0 && (
              <div className="p-4 border-t">
                <Link
                  to="/admin/orders"
                  className="text-primary-600 hover:text-primary-900 font-medium"
                >
                  View all orders →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div id="quick-actions" className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <button
                onClick={() => {
                  const element = document.getElementById('quick-actions');
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 120,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Jump to Actions ↑
              </button>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/products/new"
                className="block w-full text-left p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">➕</span>
                  <div>
                    <p className="font-medium">Add New Product</p>
                    <p className="text-sm text-gray-600">Create a new product listing</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/promo-codes/new"
                className="block w-full text-left p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎟️</span>
                  <div>
                    <p className="font-medium">Create Promo Code</p>
                    <p className="text-sm text-gray-600">Add discount codes</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/orders"
                className="block w-full text-left p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  <div>
                    <p className="font-medium">Manage Orders</p>
                    <p className="text-sm text-gray-600">View and update orders</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/products"
                className="block w-full text-left p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  <div>
                    <p className="font-medium">Inventory</p>
                    <p className="text-sm text-gray-600">Manage stock levels</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Business Info */}
          <div id="business-info" className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">Business Information</h3>
              <button
                onClick={() => {
                  const element = document.getElementById('business-info');
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 120,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Jump to Info ↑
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600">Business Name:</span>
                <span className="font-medium">{siteConfig.business.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{siteConfig.business.phone}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{siteConfig.business.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Working Hours:</span>
                <span className="font-medium">{siteConfig.business.workingHours}</span>
              </p>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Stats Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Products:</span>
                <span className="font-bold text-primary-700">{stats.totalProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Orders Today:</span>
                <span className="font-bold text-primary-700">
                  {recentOrders.filter(order => {
                    const today = new Date().toDateString();
                    const orderDate = order.createdAt ? new Date(order.createdAt).toDateString() : '';
                    return orderDate === today;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Order Value:</span>
                <span className="font-bold text-primary-700">
                  ₦{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : '0'}
                </span>
              </div>
              <div className="pt-3 border-t">
                <button
                  onClick={fetchDashboardData}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Refresh Dashboard Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          <span>↑</span>
          <span>Back to Top</span>
        </button>
      </div>
    </AdminRoute>
  );
};

export default Dashboard;