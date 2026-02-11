import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

const Cart = ({ isOpen, onClose }) => {
  const { 
    cart, 
    getCartTotal, 
    getCartCount, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    discount,
    getGrandTotal
  } = useCart();
  
  const [promoInput, setPromoInput] = useState('');

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = getGrandTotal() + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Editorial Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 transition-all duration-700"
          />

          {/* Cart Sidebar: High-Fashion Minimalist */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.19, 1, 0.22, 1], duration: 0.8 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white border-l border-black z-50 flex flex-col antialiased text-black"
          >
            {/* Header: Editorial Style */}
            <div className="flex items-center justify-between p-8 border-b border-black/5">
              <div className="space-y-1">
                <h2 className="text-2xl uppercase tracking-[0.3em] font-extralight">cart</h2>
                <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400">
                  {getCartCount()} {getCartCount() === 1 ? 'Selected Piece' : 'Selected Pieces'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="group p-2 transition-transform duration-500 hover:rotate-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="square" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items: Clean List */}
            <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-8">
                  <p className="uppercase tracking-[0.5em] text-[11px] text-neutral-500 italic font-serif">cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-[10px] uppercase tracking-[0.4em] border-b border-black pb-2 hover:text-neutral-500 hover:border-neutral-300 transition-all"
                  >
                    Return to shop
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-black/5">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-8 flex gap-6 group"
                    >
                      <div className="w-24 h-32 overflow-hidden bg-neutral-100 border border-black/5">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs uppercase tracking-[0.2em] font-medium mb-1">{item.name}</h4>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Ref: {item.productCode || 'N/A'}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-neutral-300 hover:text-black transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="square" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div className="flex items-center space-x-4 border border-black/10 px-3 py-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-xs hover:text-neutral-400">-</button>
                            <span className="text-[10px] uppercase tracking-tighter w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-xs hover:text-neutral-400">+</button>
                          </div>
                          <p className="text-[13px] tracking-widest font-light italic font-serif">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer: Summary & Minimal CTA */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-black space-y-8 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">Subtotal</span>
                    <span className="text-sm tracking-widest">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-500">shipping</span>
                    <span className="text-[10px] uppercase tracking-[0.2em]">
                      {shipping === 0 ? 'Complimentary' : `₦${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-black/5">
                    <span className="text-xs uppercase tracking-[0.5em] font-bold">Total</span>
                    <span className="text-lg tracking-[0.1em] font-light">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to="/checkout" onClick={onClose}>
                    <button className="w-full bg-black text-white py-5 uppercase tracking-[0.4em] text-[10px] hover:bg-neutral-800 transition-all duration-500">
                      Finalize Selection
                    </button>
                  </Link>
                  <button 
                    onClick={onClose}
                    className="w-full py-2 text-[9px] uppercase tracking-[0.5em] text-neutral-400 hover:text-black transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>

                {/* Secure Badge */}
                <p className="text-[9px] text-center uppercase tracking-[0.3em] text-neutral-400 pt-4">
                  Secured by Paystack
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;