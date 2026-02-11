import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import SEO from '../components/common/SEO';
import Button from '../components/common/Button';
import { orderService } from '../services/firebase';
import { qrCodeService } from '../services/qrcode';
import { whatsappService } from '../services/whatsapp';
import { siteConfig } from '../config/siteConfig';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate(); // Added this line
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const orderData = await orderService.getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink = order ? whatsappService.sendOrderInquiry(order) : '';

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
        <Link to="/shop">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={`Order Confirmation - ${orderId}`} />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Details
                </h2>
                
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                Code: {item.productCode} × {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₦{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>₦{order.shipping.toLocaleString()}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-₦{order.discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total</span>
                          <span>₦{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{order.customer.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{order.customer.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{order.customer.email}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="font-medium">
                          {order.customer.address}, {order.customer.city}, {order.customer.state}
                        </p>
                      </div>
                      {order.customer.instructions && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Delivery Instructions</p>
                          <p className="font-medium">{order.customer.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Status */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Order Status
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            order.status === 'processing' ? 'bg-yellow-500' :
                            order.status === 'shipped' ? 'bg-blue-500' :
                            order.status === 'delivered' ? 'bg-green-500' :
                            'bg-gray-300'
                          }`}></div>
                          <span className="capitalize">{order.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Estimated delivery: {siteConfig.delivery.lagos}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-mono text-sm">{orderId}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Code */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Order QR Code
                </h3>
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border rounded-lg">
                    {qrCodeService.generateOrderQR(orderId)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan to view order details
                  </p>
                  <button
                    onClick={() => qrCodeService.downloadQR(`order-qr-${orderId}`, `order-${orderId}.png`)}
                    className="mt-3 text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Download QR Code
                  </button>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  What's Next?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                      1
                    </span>
                    <p className="text-sm text-gray-600">
                      You'll receive an order confirmation email
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                      2
                    </span>
                    <p className="text-sm text-gray-600">
                      Our team will process your order within 24 hours
                    </p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                      3
                    </span>
                    <p className="text-sm text-gray-600">
                      We'll notify you when your order is shipped
                    </p>
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/shop')}
                >
                  Continue Shopping
                </Button>
                
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    fullWidth
                  >
                    Contact Support
                  </Button>
                </a>
                
                <button className="w-full text-center py-2.5 text-primary-600 hover:text-primary-700">
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;