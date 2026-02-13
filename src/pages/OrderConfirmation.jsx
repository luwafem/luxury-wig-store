import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import Button from '../components/common/Button';
import { orderService } from '../services/firebase';
import { qrCodeService } from '../services/qrcode';
import { whatsappService } from '../services/whatsapp';
import { siteConfig } from '../config/siteConfig';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
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
          id: `CONFIRM-L-${i}`,
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
          id: `CONFIRM-R-${i}`,
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

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
        <DecorativeElements />
        
        <h2 className="text-xl uppercase tracking-[0.4em] mb-8 font-light text-pink-300">Order not found</h2>
        <Link to="/shop" className="text-[10px] uppercase tracking-[0.3em] border-b border-pink-400 pb-1 text-pink-300 hover:text-white transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={`Order Confirmed — ${orderId}`} />
      <div className="bg-black text-white antialiased min-h-screen overflow-hidden relative">
        {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
        <DecorativeElements />

        <div className="relative z-10 container mx-auto px-4 md:px-12 py-16 md:py-24">
          {/* Success header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-pink-400/30 bg-black/40 backdrop-blur-sm mb-6">
                <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-light uppercase tracking-tighter leading-none mb-4">
                Thank You
              </h1>
              <p className="text-neutral-400 text-sm max-w-md mx-auto font-light">
                Your order has been received and is being prepared.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Order Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-black/80 backdrop-blur-sm border border-white/5 p-6 md:p-8 mb-8"
              >
                <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-8 text-pink-300 flex items-center">
                  <span className="mr-4 text-white/40 font-serif italic">01</span> Order Details
                </h2>
                
                <div className="space-y-8">
                  {/* Items */}
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-start justify-between py-4 border-b border-white/5">
                        <div className="flex gap-4">
                          <div className="w-16 h-20 bg-black/40 border border-white/10 overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover grayscale opacity-80"
                              onError={(e) => { e.target.src = '/images/placeholder-product.jpg'; }}
                            />
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase tracking-[0.2em] font-light text-white/90">
                              {item.name}
                            </h4>
                            <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-1">
                              Code: {item.productCode} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] tracking-widest text-pink-300">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                      <span>Subtotal</span>
                      <span>₦{order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                      <span>Shipping</span>
                      <span>{order.shipping === 0 ? 'Complimentary' : `₦${order.shipping.toLocaleString()}`}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-pink-400">
                        <span>Discount</span>
                        <span>-₦{order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base uppercase tracking-[0.4em] font-light pt-4 border-t border-white/20">
                      <span>Total</span>
                      <span className="font-bold tracking-normal text-lg text-white">
                        ₦{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-black/80 backdrop-blur-sm border border-white/5 p-6 md:p-8"
              >
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-6 text-pink-300 flex items-center">
                  <span className="mr-4 text-white/40 font-serif italic">02</span> Client Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500 mb-1">Full Name</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/90">{order.customer.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500 mb-1">Telephone</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/90">{order.customer.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500 mb-1">Email</p>
                    <p className="text-[11px] lowercase text-white/90">{order.customer.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500 mb-1">Delivery Address</p>
                    <p className="text-[11px] uppercase tracking-wider text-white/90">
                      {order.customer.address}, {order.customer.city}, {order.customer.state}
                    </p>
                  </div>
                  {order.customer.instructions && (
                    <div className="md:col-span-2">
                      <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500 mb-1">Instructions</p>
                      <p className="text-[11px] uppercase tracking-wider text-white/90">{order.customer.instructions}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-black/80 backdrop-blur-sm border border-white/5 p-6 md:p-8"
              >
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-6 text-pink-300">
                  Order Status
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      order.status === 'processing' ? 'bg-yellow-500' :
                      order.status === 'shipped' ? 'bg-blue-500' :
                      order.status === 'delivered' ? 'bg-green-500' :
                      'bg-neutral-600'
                    }`} />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/80">
                      {order.status}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500">
                    {order.orderNumber || order.id}
                  </span>
                </div>
                <div className="mt-4 text-[9px] uppercase tracking-widest text-neutral-500 border-t border-white/5 pt-4">
                  <span>Est. Delivery: {siteConfig.delivery.lagos}</span>
                </div>
              </motion.div>

              {/* QR Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-black/80 backdrop-blur-sm border border-white/5 p-6 md:p-8"
              >
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-6 text-pink-300 text-center">
                  QR code
                </h3>
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border border-white/10 invert grayscale">
                    {qrCodeService.generateOrderQR(orderId)}
                  </div>
                  <p className="text-[8px] uppercase tracking-[0.4em] text-neutral-500 mt-4">
                    Scan to track
                  </p>
                  <button
                    onClick={() => qrCodeService.downloadQR(`order-${orderId}`, `order-${orderId}.png`)}
                    className="mt-3 text-[9px] uppercase tracking-widest text-pink-300 hover:text-pink-200 transition-colors"
                  >
                    Download QR
                  </button>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-black/80 backdrop-blur-sm border border-white/5 p-6 md:p-8"
              >
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-6 text-pink-300">
                  Next Steps
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <span className="text-pink-400 text-sm">01</span>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 leading-relaxed">
                      Confirmation email dispatched
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-pink-400  text-sm">02</span>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 leading-relaxed">
                      Atelier processing (24h)
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-pink-400  text-sm">03</span>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 leading-relaxed">
                      Shipment notification
                    </p>
                  </li>
                </ul>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-3"
              >
                <button
                  onClick={() => navigate('/shop')}
                  className="group relative w-full h-14 overflow-hidden border border-white text-[10px] uppercase tracking-[0.4em] font-bold text-white bg-transparent transition-all duration-700"
                >
                  <motion.div
                    className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                    whileHover={{ width: '100%' }}
                  />
                  <span className="relative z-10 group-hover:text-black transition-colors duration-700">
                    Continue Shopping
                  </span>
                </button>
                
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <button className="group relative w-full h-14 overflow-hidden border border-pink-400/30 text-[10px] uppercase tracking-[0.4em] text-pink-300 bg-transparent transition-all duration-700">
                    <motion.div
                      className="absolute inset-0 w-0 bg-pink-400/10 transition-all duration-700 ease-out group-hover:w-full"
                      whileHover={{ width: '100%' }}
                    />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                      Private Concierge
                    </span>
                  </button>
                </a>
                
                <button className="w-full text-center py-3 text-[9px] uppercase tracking-[0.3em] text-neutral-500 hover:text-pink-300 transition-colors">
                  Download Receipt
                </button>
              </motion.div>
            </div>
          </div>

          {/* Footer Branding */}
          <footer className="relative z-10 mt-20 pt-10 border-t border-white/5 text-center">
            <div className="w-10 h-[1px] bg-pink-500/30 mx-auto mb-8" />
            <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600">
              {siteConfig.brandName} — order Confirmation
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;