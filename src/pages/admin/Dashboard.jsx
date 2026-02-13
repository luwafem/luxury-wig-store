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

      const validOrders = Array.isArray(orders) 
        ? orders.filter(order => order && order.id && order.paymentStatus && order.totalAmount !== undefined)
        : [];

      const validProducts = Array.isArray(products) 
        ? products.filter(product => product && product.stockQuantity !== undefined)
        : [];

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

  // ─────────────────────────────────────────────────────────
  //  PERFECT HEART – solid, filled, smooth
  //  Placed only on left/right edges, balanced counts
  // ─────────────────────────────────────────────────────────
  const PerfectHeart = ({ size, color, opacity, rotate, delay }) => {
    const heartPath = "M12,4 C8,-2 0,0 0,7 C0,14 12,20 12,20 C12,20 24,14 24,7 C24,0 16,-2 12,4 Z";

    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ rotate }}
        initial={{ opacity: 0, y: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1,
          y: [0, -6, 0],
          scale: 1
        }}
        transition={{
          opacity: { delay, duration: 0.6, ease: "easeOut" },
          scale: { delay, duration: 0.6, ease: "easeOut" },
          y: {
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay + 0.8
          }
        }}
      >
        <path
          d={heartPath}
          fill={color}
          fillOpacity={opacity}
        />
      </motion.svg>
    );
  };

  const DecorativeElements = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 5) + 3   // 3–8
        : Math.floor(Math.random() * 7) + 5; // 5–12
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 24 : 32;
      const maxSize = isMobile ? 54 : 84;
      
      const newElements = [];

      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `DASH-L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5,
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: i * 0.15,
        });
      }

      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `DASH-R-${i}`,
          x: Math.random() * 15 + 85,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5,
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: (leftCount + i) * 0.15,
        });
      }

      setElements(newElements);
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {elements.map((el) => (
          <div
            key={el.id}
            className="absolute"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <PerfectHeart
              size={el.size}
              color={el.color}
              opacity={el.opacity}
              rotate={el.rotate}
              delay={el.delay}
            />
          </div>
        ))}
      </div>
    );
  };
  // ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border border-pink-500/30 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="bg-black text-white antialiased min-h-screen relative overflow-hidden">
        {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
        <DecorativeElements />

        <div className="relative z-10 container mx-auto px-6 py-16 md:py-20">
          
          {/* Editorial Header */}
          <header className="mb-16 border-b border-white/5 pb-12">
            <span className="block uppercase tracking-[0.6em] text-[9px] mb-4 text-pink-400/70">
              Admin Portal
            </span>
            <h1 className="text-4xl md:text-5xl uppercase tracking-tighter font-light leading-none text-white">
              Atelier<span className="italic font-serif text-pink-300 lowercase tracking-normal">.</span>
            </h1>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-neutral-400">
              Dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>

          {/* Stats Grid – Noir Cards */}
          <div className="mb-20">
            <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-10 text-pink-300 flex items-center">
              <span className="mr-4 text-white/40 font-serif italic">01</span> Stats Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '📦', label: 'Total Orders', value: stats.totalOrders, delay: 0 },
                { icon: '⏳', label: 'Pending Orders', value: stats.pendingOrders, delay: 0.1 },
                { icon: '💰', label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, delay: 0.2 },
                { icon: '⚠️', label: 'Low Stock', value: stats.lowStockProducts, delay: 0.3 }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: stat.delay }}
                  className="bg-black/80 backdrop-blur-sm border border-white/5 p-8"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl text-neutral-400">{stat.icon}</span>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-light tracking-tight text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Grid: Recent Orders & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Recent Orders – Table */}
            <div className="lg:col-span-2">
              <div className="border border-white/5 bg-black/80 backdrop-blur-sm">
                <div className="border-b border-white/5 px-8 py-6">
                  <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium text-pink-300 flex items-center">
                    <span className="mr-4 text-white/40 font-serif italic">02</span> Recent Orders
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/5 bg-black/40">
                      <tr>
                        <th className="px-8 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                          Order ID
                        </th>
                        <th className="px-8 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                          Customer
                        </th>
                        <th className="px-8 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                          Amount
                        </th>
                        <th className="px-8 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                          Status
                        </th>
                        <th className="px-8 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-8 py-12 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                            No recent orders found
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map((order) => {
                          if (!order || !order.id) return null;
                          
                          const statusColor = 
                            order.status === 'delivered' ? 'text-green-400' :
                            order.status === 'shipped' ? 'text-blue-400' :
                            order.status === 'processing' ? 'text-yellow-400' :
                            'text-neutral-400';

                          return (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-8 py-5 whitespace-nowrap">
                                <Link
                                  to={`/admin/orders/${order.id}`}
                                  className="text-[11px] uppercase tracking-wider text-pink-300 hover:text-pink-200 border-b border-transparent hover:border-pink-400 transition-all"
                                >
                                  {order.id ? `${order.id.substring(0, 8)}...` : 'N/A'}
                                </Link>
                              </td>
                              <td className="px-8 py-5">
                                <p className="text-[11px] uppercase tracking-wider text-white/90">
                                  {order.customer?.fullName || 'Unknown'}
                                </p>
                                <p className="text-[9px] uppercase tracking-widest text-neutral-500 mt-0.5">
                                  {order.customer?.phone || 'No phone'}
                                </p>
                              </td>
                              <td className="px-8 py-5">
                                <span className="text-[13px] tracking-widest font-light text-white">
                                  ₦{(order.totalAmount || 0).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-8 py-5">
                                <span className={`text-[10px] uppercase tracking-[0.2em] ${statusColor}`}>
                                  {order.status || 'pending'}
                                </span>
                              </td>
                              <td className="px-8 py-5 whitespace-nowrap text-[10px] uppercase tracking-wider text-neutral-500">
                                {order.createdAt 
                                  ? new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
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
                  <div className="border-t border-white/5 px-8 py-6">
                    <Link
                      to="/admin/orders"
                      className="group relative inline-block text-[10px] uppercase tracking-[0.4em] text-white border-b border-pink-400/30 pb-1 hover:text-pink-300 transition-colors"
                    >
                      View all orders
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-10">
              
              {/* Quick Actions */}
              <div className="border border-white/5 bg-black/80 backdrop-blur-sm p-8">
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-8 text-pink-300 flex items-center">
                  <span className="mr-4 text-white/40 font-serif italic">03</span> Quick Actions
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: '➕', to: '/admin/products/new', label: 'Add New Product', desc: 'Create a new product listing' },
                    { icon: '🎟️', to: '/admin/promo-codes/new', label: 'Create Promo Code', desc: 'Add discount codes' },
                    { icon: '📋', to: '/admin/orders', label: 'Manage Orders', desc: 'View and update orders' },
                    { icon: '📊', to: '/admin/products', label: 'Inventory', desc: 'Manage stock levels' }
                  ].map((action, i) => (
                    <Link
                      key={i}
                      to={action.to}
                      className="group flex items-start gap-4 p-5 border border-white/5 hover:border-pink-400/30 transition-all duration-500 bg-black/40"
                    >
                      <span className="text-xl text-neutral-400 group-hover:text-pink-300 transition-colors">
                        {action.icon}
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white mb-1">
                          {action.label}
                        </p>
                        <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500">
                          {action.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Business Information */}
              <div className="border border-white/5 bg-black/80 backdrop-blur-sm p-8">
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-6 text-pink-300">
                  Business Information
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-500">Business Name</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/90">{siteConfig.business.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-500">Phone</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/90">{siteConfig.business.phone}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-500">Email</span>
                    <span className="text-[10px] lowercase text-white/90">{siteConfig.business.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-neutral-500">Working Hours</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/90">{siteConfig.business.workingHours}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Summary */}
              <div className="border border-pink-400/20 bg-black/40 p-8">
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-6 text-pink-300">
                  Quick Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">Active Products</span>
                    <span className="text-base font-light text-white">{stats.totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">Orders Today</span>
                    <span className="text-base font-light text-white">
                      {recentOrders.filter(order => {
                        const today = new Date().toDateString();
                        const orderDate = order.createdAt ? new Date(order.createdAt).toDateString() : '';
                        return orderDate === today;
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">Avg. Order Value</span>
                    <span className="text-base font-light text-white">
                      ₦{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="pt-6">
                    <button
                      onClick={fetchDashboardData}
                      className="group relative w-full h-12 overflow-hidden border border-pink-400/30 text-[9px] uppercase tracking-[0.4em] text-pink-300 bg-transparent transition-all duration-700"
                    >
                      <motion.div
                        className="absolute inset-0 w-0 bg-pink-400/10 transition-all duration-700 ease-out group-hover:w-full"
                        whileHover={{ width: '100%' }}
                      />
                      <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                        Refresh Data
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <footer className="mt-20 pt-12 border-t border-white/5 text-center">
            <div className="w-10 h-[1px] bg-pink-500/30 mx-auto mb-8" />
            <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600">
              {siteConfig.brandName} — Atelier Administration
            </p>
          </footer>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Dashboard;