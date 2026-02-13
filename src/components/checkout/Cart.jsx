import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const Cart = ({ isOpen, onClose }) => {
  const { 
    cart, 
    getCartTotal, 
    getCartCount, 
    updateQuantity, 
    removeFromCart,
    getGrandTotal
  } = useCart();
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 150000 ? 0 : 5000;
  const total = getGrandTotal() + shipping;

  // ─────────────────────────────────────────────────────────
  //  PERFECT HEART – subtle, filled, floating
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

  const CartHearts = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 2) + 1   // 1–2
        : Math.floor(Math.random() * 2) + 2; // 2–4
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 16 : 20;
      const maxSize = isMobile ? 30 : 40;
      
      const newElements = [];

      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `CART-L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.15 + 0.1, // 0.1–0.25
          color: `rgba(236, 72, 153, ${Math.random() * 0.15 + 0.1})`,
          delay: i * 0.15,
        });
      }

      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `CART-R-${i}`,
          x: Math.random() * 15 + 85,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.15 + 0.1,
          color: `rgba(236, 72, 153, ${Math.random() * 0.15 + 0.1})`,
          delay: (leftCount + i) * 0.15,
        });
      }

      setElements(newElements);
    }, []);

    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Moody Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] transition-all duration-700"
          />

          {/* Cart Sidebar: Pure Black + Subtle Hearts */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.19, 1, 0.22, 1], duration: 0.8 }}
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-black border-l border-white/5 z-[70] flex flex-col antialiased text-white shadow-2xl"
          >
            {/* ✦ CART HEARTS – EXTREMELY SUBTLE ✦ */}
            <CartHearts />

            {/* Header: Boutique Style */}
            <div className="relative z-10 flex items-center justify-between px-8 py-10 border-b border-white/5">
              <div className="space-y-2">
                <h2 className="text-3xl uppercase tracking-[0.4em] font-light text-pink-400">Your Cart</h2>
                <div className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                   <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-500">
                    {getCartCount()} {getCartCount() === 1 ? 'Curated Piece' : 'Curated Pieces'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="group p-2 transition-transform duration-500 hover:rotate-90 text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="relative z-10 flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-10">
                  <div className="w-12 h-[1px] bg-pink-500/30" />
                  <p className="uppercase tracking-[0.6em] text-[10px] text-neutral-500">Empty Selection</p>
                  <button 
                    onClick={onClose}
                    className="text-[9px] uppercase tracking-[0.4em] border-b border-pink-500/50 pb-2 text-pink-300 hover:text-white hover:border-white transition-all duration-500"
                  >
                    Explore Shop
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="py-10 flex gap-6 group"
                    >
                      {/* Image Container */}
                      <div className="w-24 h-32 overflow-hidden bg-neutral-900 relative">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-[11px] uppercase tracking-[0.25em] font-light text-white mb-2 group-hover:text-pink-300 transition-colors">{item.name}</h4>
                            <p className="text-[8px] text-neutral-600 uppercase tracking-widest">Code: {item.productCode || 'Luxe-01'}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-neutral-700 hover:text-pink-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="square" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div className="flex items-center space-x-6 border border-white/10 px-4 py-2 bg-black/40">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-sm text-neutral-500 hover:text-pink-400 transition-colors">-</button>
                            <span className="text-[10px] uppercase tracking-tighter w-4 text-center font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-sm text-neutral-500 hover:text-pink-400 transition-colors">+</button>
                          </div>
                          <p className="text-[14px] tracking-widest font-light text-white">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="relative z-10 p-8 pb-12 border-t border-white/10 space-y-8 bg-black/80 backdrop-blur-xl">
                <div className="space-y-5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-medium">Subtotal</span>
                    <span className="text-sm tracking-widest font-light">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-medium">Shipping</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-pink-400">
                      {shipping === 0 ? 'Complimentary' : `₦${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-6 border-t border-white/5">
                    <span className="text-xs uppercase tracking-[0.6em] font-bold text-white">Total</span>
                    <span className="text-xl tracking-[0.1em] font-light text-pink-400">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to="/checkout" onClick={onClose}>
                    <button className="relative w-full overflow-hidden group bg-white text-black py-6 uppercase tracking-[0.5em] text-[10px] font-bold transition-all duration-500">
                      <span className="relative z-10 group-hover:text-white transition-colors duration-500">Checkout</span>
                      <div className="absolute inset-0 bg-pink-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                  </Link>
                  <button 
                    onClick={onClose}
                    className="w-full py-2 text-[8px] uppercase tracking-[0.6em] text-neutral-500 hover:text-pink-300 transition-all duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;