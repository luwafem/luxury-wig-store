import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import Cart from '../checkout/Cart';
import { siteConfig } from '../../config/siteConfig';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/shop', label: 'shop' },
    { path: '/contact', label: 'contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-700 antialiased ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-lg py-3 border-b border-black/5' 
          : 'bg-white py-6 border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center h-12">
          
          {/* Brand Identity */}
          <Link to="/" className="relative group">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center md:items-start"
            >
              <h1 className="text-xl md:text-2xl font-light uppercase tracking-[0.4em] leading-none mb-1">
                {siteConfig.brandName}
              </h1>
              <div className="overflow-hidden h-[10px]">
                <span className="block text-[7px] uppercase tracking-[0.7em] text-neutral-400 transition-transform duration-500 group-hover:-translate-y-full">
                  enterprise
                </span>
                <span className="block text-[7px] uppercase tracking-[0.7em] text-black transition-transform duration-500 group-hover:-translate-y-full italic font-serif">
                  nigeria
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation: Ultra Minimal */}
          <nav className="hidden md:flex items-center space-x-16">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  relative text-[9px] uppercase tracking-[0.5em] transition-colors duration-700
                  ${isActive ? 'text-black font-medium' : 'text-neutral-400 hover:text-black'}
                `}
              >
                {({ isActive }) => (
                  <span className="relative pb-1">
                    {link.label}
                    {isActive && (
                      <motion.div 
                        layoutId="navUnderline"
                        className="absolute -bottom-1 left-0 right-0 h-[1px] bg-black"
                        transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Refined Bag Interaction */}
          <div className="flex items-center space-x-10">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="group flex items-center gap-3"
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-black transition-colors hidden sm:block">
                cart
              </span>
              <div className="relative border border-black/10 px-2 py-1 group-hover:border-black transition-colors">
                 <span className="text-[10px] font-light">
                   {cartCount < 10 ? `0${cartCount}` : cartCount}
                 </span>
              </div>
            </button>

            {/* Premium Burger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col justify-center items-end space-y-1.5 w-8 h-8"
            >
              <motion.span 
                animate={isMenuOpen ? { rotate: 45, y: 7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                className="h-[1px] bg-black transition-all" 
              />
              <motion.span 
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1, width: "70%" }}
                className="h-[1px] bg-black transition-all" 
              />
              <motion.span 
                animate={isMenuOpen ? { rotate: -45, y: -7, width: "100%" } : { rotate: 0, y: 0, width: "100%" }}
                className="h-[1px] bg-black transition-all" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white z-[60] flex flex-col"
            >
              <div className="flex justify-between items-center px-6 py-8 border-b border-black/5">
                <span className="text-[10px] uppercase tracking-widest font-light text-neutral-400">mamusca</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[10px] uppercase tracking-[0.3em] font-medium"
                >
                  Close [×]
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center px-12 space-y-12">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-baseline gap-4"
                    >
                      <span className="text-[10px] font-serif italic text-neutral-300">0{i + 1}</span>
                      <h2 className="text-5xl font-extralight uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-700">
                        {link.label}
                      </h2>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-12 border-t border-black/5 flex flex-col space-y-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-400">reach out to us</p>
                <a href={`https://wa.me/${siteConfig.business.whatsapp}`} className="text-xs uppercase tracking-widest">
                  {siteConfig.business.phone}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;