import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminRoute from '../../components/admin/AdminRoute';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
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

  // Fetch all orders from Firestore
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await orderService.getAllOrders();
      
      // Convert Firestore timestamps to JS Date objects
      const formattedOrders = ordersData.map(order => ({
        ...order,
        createdAt: order.createdAt?.toDate?.() || new Date(order.createdAt),
        updatedAt: order.updatedAt?.toDate?.() || new Date(order.updatedAt),
        // Ensure customer object exists (backward compatibility)
        customer: order.customer || {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          instructions: '',
        },
        // Ensure items array exists
        items: order.items || [],
      }));

      setOrders(formattedOrders);

      // Calculate stats
      const statsData = {
        total: formattedOrders.length,
        pending: formattedOrders.filter(o => o.status === 'pending').length,
        processing: formattedOrders.filter(o => o.status === 'processing').length,
        shipped: formattedOrders.filter(o => o.status === 'shipped').length,
        delivered: formattedOrders.filter(o => o.status === 'delivered').length,
      };
      setStats(statsData);

      // If URL contains an order ID, select that order
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

  // Update order status in Firestore
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrder(orderId, { status: newStatus });
      
      // Update local state
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

  // Update payment status in Firestore
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">View and manage customer orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-sm text-gray-600">Processing</p>
            <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-sm text-gray-600">Shipped</p>
            <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-sm text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <button
                    onClick={fetchOrders}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Refresh
                  </button>
                </div>
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
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No orders yet.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedOrder?.id === order.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="px-6 py-4">
                            <div className="font-mono text-sm">{order.orderNumber || order.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium">{order.customer?.fullName || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{order.customer?.phone || ''}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold">₦{order.totalAmount?.toLocaleString() || 0}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status || 'pending'}
                              </span>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                  order.paymentStatus
                                )}`}
                              >
                                {order.paymentStatus || 'pending'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
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
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order #{selectedOrder.orderNumber || selectedOrder.id}
                </h2>

                {/* Customer Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{selectedOrder.customer?.fullName || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer?.phone || ''}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer?.email || ''}</p>
                  </div>

                  {selectedOrder.customer?.address && (
                    <div>
                      <p className="text-sm text-gray-600">Delivery Address</p>
                      <p className="font-medium">
                        {selectedOrder.customer.address}, {selectedOrder.customer.city || ''},{' '}
                        {selectedOrder.customer.state || ''}
                      </p>
                      {selectedOrder.customer.instructions && (
                        <p className="text-sm text-gray-600 mt-1">
                          Instructions: {selectedOrder.customer.instructions}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Order Items */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary-100 to-luxury-rose/20 flex items-center justify-center">
                                <span className="text-lg">💇‍♀️</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Code: {item.productCode || 'N/A'} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="border-t pt-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₦{selectedOrder.subtotal?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₦{selectedOrder.shipping?.toLocaleString() || 0}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₦{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total</span>
                      <span>₦{selectedOrder.totalAmount?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="mb-6 text-center">
                  <p className="text-sm text-gray-600 mb-2">Order QR Code</p>
                  <div className="inline-block p-4 bg-white border rounded-lg">
                    {qrCodeService.generateOrderQR(selectedOrder.id)}
                  </div>
                </div>

                {/* Status Updates */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Order Status
                    </label>
                    <select
                      value={selectedOrder.status || 'pending'}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Payment Status
                    </label>
                    <select
                      value={selectedOrder.paymentStatus || 'pending'}
                      onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                      className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <a
                      href={`https://wa.me/${selectedOrder.customer?.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      WhatsApp
                    </a>
                    <button
                      className="flex-1 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50"
                      onClick={() => window.print()}
                    >
                      Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <span className="text-4xl mb-4 block">📦</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Select an Order</h3>
                <p className="text-gray-600">
                  Click on an order from the list to view details and update status.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Orders;