import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminRoute from '../../components/admin/AdminRoute';
import { orderService } from '../../services/firebase';
import { qrCodeService } from '../../services/qrcode';

const Orders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await orderService.getAllOrders();
      
      const formattedOrders = ordersData.map(order => ({
        ...order,
        createdAt: order.createdAt?.toDate?.() || new Date(order.createdAt),
        updatedAt: order.updatedAt?.toDate?.() || new Date(order.updatedAt),
        customer: order.customer || {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          instructions: '',
        },
        items: order.items || [],
      }));

      setOrders(formattedOrders);

      const statsData = {
        total: formattedOrders.length,
        pending: formattedOrders.filter(o => o.status === 'pending').length,
        processing: formattedOrders.filter(o => o.status === 'processing').length,
        shipped: formattedOrders.filter(o => o.status === 'shipped').length,
        delivered: formattedOrders.filter(o => o.status === 'delivered').length,
      };
      setStats(statsData);

      if (id) {
        const order = formattedOrders.find(o => o.id === id);
        setSelectedOrder(order || null);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrder(orderId, { status: newStatus });
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date() }
            : order
        )
      );
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus, updatedAt: new Date() });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrder(orderId, { paymentStatus: newStatus });
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, paymentStatus: newStatus, updatedAt: new Date() }
            : order
        )
      );
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus, updatedAt: new Date() });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'processing': return 'text-blue-400';
      case 'shipped': return 'text-purple-400';
      case 'delivered': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      case 'refunded': return 'text-neutral-400';
      default: return 'text-neutral-400';
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-black flex justify-center items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border border-pink-500/30 border-t-pink-500 rounded-full"
          />
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="bg-black text-white antialiased min-h-screen p-6">
        {/* Header */}
        <header className="mb-12 border-b border-white/5 pb-8">
          <span className="block uppercase tracking-[0.6em] text-[9px] mb-4 text-pink-400/70">
            Order Management
          </span>
          <h1 className="text-3xl md:text-4xl uppercase tracking-tighter font-light leading-none text-white">
            Orders<span className="italic font-serif text-pink-300 lowercase tracking-normal ml-2">.</span>
          </h1>
        </header>

        {/* Stats – Noir Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {[
            { label: 'Total Orders', value: stats.total, color: 'text-white' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Processing', value: stats.processing, color: 'text-blue-400' },
            { label: 'Shipped', value: stats.shipped, color: 'text-purple-400' },
            { label: 'Delivered', value: stats.delivered, color: 'text-green-400' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-black/80 backdrop-blur-sm border border-white/5 p-6"
            >
              <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
                {stat.label}
              </p>
              <p className={`text-2xl font-light tracking-tight ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="border border-white/5 bg-black/80 backdrop-blur-sm">
              <div className="border-b border-white/5 px-6 py-5 flex items-center justify-between">
                <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium text-pink-300">
                  Recent Orders
                </h2>
                <button
                  onClick={fetchOrders}
                  className="group relative text-[9px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors border-b border-transparent hover:border-pink-400 pb-0.5"
                >
                  Refresh
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/5 bg-black/40">
                    <tr>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className={`hover:bg-white/5 transition-colors cursor-pointer ${
                            selectedOrder?.id === order.id ? 'bg-pink-400/5 border-l-2 border-pink-400' : ''
                          }`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-[10px] uppercase tracking-wider font-mono text-pink-300">
                              {order.orderNumber || order.id?.substring(0, 8) || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[11px] uppercase tracking-wider text-white/90">
                              {order.customer?.fullName || 'N/A'}
                            </p>
                            <p className="text-[9px] uppercase tracking-widest text-neutral-500">
                              {order.customer?.phone || ''}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] tracking-widest font-light text-white">
                              ₦{order.totalAmount?.toLocaleString() || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(order.status).replace('text', 'bg')}`} />
                                <span className={`text-[9px] uppercase tracking-[0.2em] ${getStatusColor(order.status)}`}>
                                  {order.status || 'pending'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${getPaymentStatusColor(order.paymentStatus).replace('text', 'bg')}`} />
                                <span className={`text-[9px] uppercase tracking-[0.2em] ${getPaymentStatusColor(order.paymentStatus)}`}>
                                  {order.paymentStatus || 'pending'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-[9px] uppercase tracking-wider text-neutral-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div>
            {selectedOrder ? (
              <div className="sticky top-[180px] border border-white/5 bg-black/80 backdrop-blur-sm p-8">
                <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-8 text-pink-300">
                  Order #{selectedOrder.orderNumber || selectedOrder.id?.substring(0, 8) || 'N/A'}
                </h2>

                {/* Customer Info */}
                <div className="space-y-6 mb-8">
                  <div className="pb-5 border-b border-white/5">
                    <p className="text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-2">Customer</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/90">
                      {selectedOrder.customer?.fullName || 'N/A'}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      {selectedOrder.customer?.phone || ''}
                    </p>
                    <p className="text-[10px] lowercase text-neutral-400">
                      {selectedOrder.customer?.email || ''}
                    </p>
                  </div>

                  {selectedOrder.customer?.address && (
                    <div className="pb-5 border-b border-white/5">
                      <p className="text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-2">Delivery Address</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/90">
                        {selectedOrder.customer.address}, {selectedOrder.customer.city || ''}, {selectedOrder.customer.state || ''}
                      </p>
                      {selectedOrder.customer.instructions && (
                        <p className="text-[9px] uppercase tracking-wider text-neutral-400 mt-2">
                          Instructions: {selectedOrder.customer.instructions}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Order Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] font-medium mb-5 text-pink-300/80">
                      Items
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0">
                          <div className="w-12 h-12 border border-white/10 overflow-hidden bg-black/40">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover grayscale opacity-80"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl text-neutral-500">
                                💇‍♀️
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-light text-white/90">
                              {item.name}
                            </p>
                            <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-0.5">
                              Code: {item.productCode || 'N/A'} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-[11px] tracking-widest font-light text-white">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t border-white/5 pt-6 mb-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                      <span>Subtotal</span>
                      <span>₦{selectedOrder.subtotal?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                      <span>Shipping</span>
                      <span>₦{selectedOrder.shipping?.toLocaleString() || 0}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-pink-400">
                        <span>Discount</span>
                        <span>-₦{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm uppercase tracking-[0.4em] font-light pt-4 border-t border-white/20">
                      <span>Total</span>
                      <span className="font-bold tracking-normal text-white">
                        ₦{selectedOrder.totalAmount?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="mb-8 text-center">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-3">Order QR Code</p>
                  <div className="inline-block p-4 bg-white border border-white/10 invert grayscale">
                    {qrCodeService.generateOrderQR(selectedOrder.id)}
                  </div>
                </div>

                {/* Status Updates */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
                      Order Status
                    </label>
                    <select
                      value={selectedOrder.status || 'pending'}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-wider text-white focus:border-pink-400 focus:outline-none transition-colors"
                    >
                      <option value="pending" className="bg-black text-white">Pending</option>
                      <option value="processing" className="bg-black text-white">Processing</option>
                      <option value="shipped" className="bg-black text-white">Shipped</option>
                      <option value="delivered" className="bg-black text-white">Delivered</option>
                      <option value="cancelled" className="bg-black text-white">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={selectedOrder.paymentStatus || 'pending'}
                      onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                      className="w-full bg-transparent border border-white/10 px-4 py-3 text-[10px] uppercase tracking-wider text-white focus:border-pink-400 focus:outline-none transition-colors"
                    >
                      <option value="pending" className="bg-black text-white">Pending</option>
                      <option value="paid" className="bg-black text-white">Paid</option>
                      <option value="failed" className="bg-black text-white">Failed</option>
                      <option value="refunded" className="bg-black text-white">Refunded</option>
                    </select>
                  </div>

                  {/* Action Buttons – Magnetic Style */}
                  <div className="flex space-x-4 pt-6">
                    <a
                      href={`https://wa.me/${selectedOrder.customer?.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex-1 h-12 overflow-hidden border border-white/20 text-[9px] uppercase tracking-[0.3em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40 flex items-center justify-center"
                    >
                      <motion.div
                        className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
                        whileHover={{ width: '100%' }}
                      />
                      <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                        WhatsApp
                      </span>
                    </a>
                    <button
                      onClick={() => window.print()}
                      className="group relative flex-1 h-12 overflow-hidden border border-white/20 text-[9px] uppercase tracking-[0.3em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40"
                    >
                      <motion.div
                        className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
                        whileHover={{ width: '100%' }}
                      />
                      <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                        Print Invoice
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-white/5 bg-black/80 backdrop-blur-sm p-12 text-center">
                <span className="text-4xl mb-4 block text-neutral-400">📦</span>
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-3 text-pink-300">
                  Select an Order
                </h3>
                <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">
                  Click on an order from the list to view details and update status.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600">
            mamusca enterprise — order administration
          </p>
        </footer>
      </div>
    </AdminRoute>
  );
};

export default Orders;