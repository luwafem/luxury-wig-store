import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/common/SEO';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/firebase';
import { paystackService } from '../services/paystack';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getGrandTotal, getCartTotal } = useCart();
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

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
      // Balanced hearts – same as all other pages
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 5) + 3   // 3–8
        : Math.floor(Math.random() * 7) + 5; // 5–12
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 24 : 32;
      const maxSize = isMobile ? 54 : 84;
      
      const newElements = [];

      // Left side (0–15%)
      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `CHECKOUT-L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5, // 0.5–0.9
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: i * 0.15,
        });
      }

      // Right side (85–100%)
      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `CHECKOUT-R-${i}`,
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

  const sendOrderConfirmationEmail = async (order, customer) => {
    try {
      const apiKey = process.env.REACT_APP_RESEND_API_KEY;
      if (!apiKey) {
        console.warn('⚠️ Resend API key missing');
        return;
      }

      const itemsList = order.items.map(item => 
        `<tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #222;">${item.name} × ${item.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #222; text-align: right;">₦${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`
      ).join('');

      const html = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body style="background: #000; color: #fff; font-family: 'Helvetica', sans-serif; padding: 40px;">
            <div style="max-width: 600px; margin: 0 auto; border: 1px solid rgba(236,72,153,0.2); padding: 32px;">
              <h1 style="font-weight: 300; letter-spacing: 6px; text-transform: uppercase; margin: 0 0 8px;">
                Order <span style="color: #ec4899; font-style: italic;">Confirmed</span>
              </h1>
              <p style="color: #a0a0a0; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">
                #${order.orderNumber || order.id}
              </p>
              <div style="height: 1px; background: #333; margin: 24px 0;"></div>
              <p style="font-size: 14px; color: #ddd;">
                Dear ${customer.fullName},<br><br>
                Your selection has been received and is now being prepared in our atelier.
              </p>
              <h3 style="margin-top: 32px; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                ${itemsList}
              </table>
              <div style="border-top: 1px solid #333; padding-top: 16px;">
                <p style="display: flex; justify-content: space-between;">
                  <span>Subtotal</span>
                  <span>₦${order.subtotal.toLocaleString()}</span>
                </p>
                <p style="display: flex; justify-content: space-between;">
                  <span>Shipping</span>
                  <span>${order.shipping === 0 ? 'Complimentary' : `₦${order.shipping.toLocaleString()}`}</span>
                </p>
                ${order.discount > 0 ? `
                  <p style="display: flex; justify-content: space-between; color: #ec4899;">
                    <span>Discount</span>
                    <span>-₦${order.discount.toLocaleString()}</span>
                  </p>
                ` : ''}
                <p style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin-top: 16px; padding-top: 16px; border-top: 1px solid #333;">
                  <span>Total</span>
                  <span>₦${order.totalAmount.toLocaleString()}</span>
                </p>
              </div>
              <p style="margin-top: 40px; font-size: 11px; color: #ec4899; letter-spacing: 3px; text-transform: uppercase; text-align: center;">
                — Luxury Locks Atelier
              </p>
            </div>
          </body>
        </html>
      `;

      const response = await axios.post('https://api.resend.com/emails', {
        from: 'Luxury Locks <onboarding@resend.dev>',
        to: [customer.email],
        subject: `Order Confirmed – ${order.orderNumber || order.id}`,
        html,
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Resend email sent:', response.data);
    } catch (error) {
      console.error('❌ Resend error:', error.response?.data || error.message);
    }
  };

  const handleSubmit = async (data) => {
  if (cart.length === 0) return;
  setLoading(true);

  try {
    // 1️⃣ Create ORDER ONLY (no stock updates)
    const orderData = {
      customer: { ...data },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        productCode: item.productCode,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || null,
      })),
      subtotal,
      shipping,
      totalAmount: total,
      status: 'pending',          // 👈 very important
      paymentStatus: 'pending',   // 👈 very important
    };

    const order = await orderService.createOrder(orderData);

    // 2️⃣ Initialize Paystack payment
    paystackService.initializePayment(
      data.email,
      order.totalAmount,
      order.id,
      {
        order_id: order.id,
        customer_name: data.fullName,
      },
      async (response) => {
        try {
          if (response.status === 'success') {
            // 3️⃣ Update ORDER ONLY (admin/server will handle stock later)
            await orderService.updateOrder(order.id, {
              paymentStatus: 'paid',
              paymentReference: response.reference,
              status: 'processing', // or 'confirmed'
              updatedAt: new Date(),
            });

            clearCart();

            // 4️⃣ Send confirmation email
            await sendOrderConfirmationEmail(order, orderData.customer);

            navigate(`/order-confirmation/${order.id}`);
          } else {
            alert('Transaction declined. Please try again.');
          }
        } catch (err) {
          console.error('❌ Post-payment update failed:', err);
          alert('Payment received but order update failed. Please contact support.');
        } finally {
          setLoading(false);
        }
      }
    );
  } catch (error) {
    console.error('❌ Order creation error:', error);
    setLoading(false);
  }
};


  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 relative overflow-hidden">
        {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
        <DecorativeElements />
        
        <h2 className="text-2xl uppercase tracking-[0.4em] font-light mb-6 text-pink-300">Your cart is Empty</h2>
        <Link to="/shop">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-12 py-4 overflow-hidden border border-white text-[10px] uppercase tracking-[0.4em] text-white bg-transparent transition-all duration-700"
          >
            <motion.div
              className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
              whileHover={{ width: '100%' }}
            />
            <span className="relative z-10 group-hover:text-black transition-colors duration-700">
              Return to Collection
            </span>
          </motion.button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white antialiased min-h-screen overflow-hidden relative">
      {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
      <DecorativeElements />

      <SEO title="Checkout — Secure Acquisition" />

      {/* Editorial Header */}
      <header className="relative z-10 py-16 md:py-24 border-b border-white/5 text-center">
        <h1 className="text-5xl md:text-7xl uppercase tracking-tighter font-light leading-none text-white">
          checkout
        </h1>
        <div className="w-12 h-[1px] bg-pink-500/30 mx-auto mt-8" />
      </header>

      <div className="container mx-auto px-4 md:px-12 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* LEFT: Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="mb-10">
              
              <CheckoutForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </motion.div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-black/80 backdrop-blur-sm border border-white/5 p-8 md:p-12">
              <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-10 text-center text-pink-300">
                Order Summary
              </h2>
              
              <div className="space-y-6 mb-10 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-20 bg-black/40 border border-white/10 overflow-hidden">
                        <img 
                          src={item.images?.[0]} 
                          alt={item.name} 
                          className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 transition-opacity"
                          onError={(e) => { e.target.src = '/images/placeholder-product.jpg'; }}
                        />
                      </div>
                      <div>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-light leading-tight text-white/90">
                          {item.name}
                        </h3>
                        <p className="text-[8px] text-neutral-500 uppercase tracking-widest mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] tracking-widest  text-pink-300">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : `₦${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-base uppercase tracking-[0.4em] font-light pt-4 border-t border-white/20">
                  <span>Total</span>
                  <span className="font-bold tracking-normal  text-lg text-white">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-600 leading-relaxed">
                  By completing your order, you agree to our <br />
                  <span className="text-white border-b border-pink-400/30 cursor-pointer hover:text-pink-300 transition-colors">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-white border-b border-pink-400/30 cursor-pointer hover:text-pink-300 transition-colors">
                    Return Policy
                  </span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 py-20 border-t border-white/5 text-center">
        <div className="w-10 h-[1px] bg-pink-500/30 mx-auto mb-8" />
        <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600">
          mamusca enterprise
        </p>
      </footer>
    </div>
  );
};

export default Checkout;