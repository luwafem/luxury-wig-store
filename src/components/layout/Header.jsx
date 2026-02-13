import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import Cart from '../checkout/Cart';
import { siteConfig } from '../../config/siteConfig';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef(null);

  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { path: '/shop', label: 'shop' },
    { path: '/contact', label: 'contact' },
  ];

  // Determine if header should be solid – scrolled OR search open
  const isSolid = scrolled || isSearchOpen;

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

  // ─────────────────────────────────────────────────────────
  //  DECORATIVE HEARTS – main background (header)
  // ─────────────────────────────────────────────────────────
  const DecorativeElements = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 2) + 1   // 1–3
        : Math.floor(Math.random() * 3) + 2; // 2–5
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 16 : 20;
      const maxSize = isMobile ? 40 : 50;
      
      const newElements = [];

      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `L-${i}`,
          x: Math.random() * 15,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.2 + 0.15, // 0.15–0.35
          color: `rgba(236, 72, 153, ${Math.random() * 0.2 + 0.15})`,
          delay: i * 0.15,
        });
      }

      for (let i = 0; i < rightCount; i++) {
        newElements.push({
          id: `R-${i}`,
          x: Math.random() * 15 + 85,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.2 + 0.15,
          color: `rgba(236, 72, 153, ${Math.random() * 0.2 + 0.15})`,
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
  //  OVERLAY HEARTS – even more subtle, inside slide-out menu
  // ─────────────────────────────────────────────────────────
  const OverlayHearts = () => {
    const [elements, setElements] = useState([]);

    useEffect(() => {
      const isMobile = window.innerWidth < 768;
      const total = isMobile
        ? Math.floor(Math.random() * 2) + 1   // 1–2
        : Math.floor(Math.random() * 2) + 2; // 2–3
      
      const leftCount = Math.ceil(total / 2);
      const rightCount = Math.floor(total / 2);
      
      const minSize = isMobile ? 16 : 20;
      const maxSize = isMobile ? 40 : 50;
      
      const newElements = [];

      for (let i = 0; i < leftCount; i++) {
        newElements.push({
          id: `OL-${i}`,
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
          id: `OR-${i}`,
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
    <>
      {/* ✦ PERFECT HEARTS – MAIN BACKGROUND ✦ */}
      <DecorativeElements />

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-1000 antialiased ${
          isSolid
            ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5'
            : 'bg-transparent py-10'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          {/* MAIN HEADER ROW */}
          <div className="flex justify-between items-center relative">
            {/* Left: Burger Menu */}
            <div className="flex-1 flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="group flex items-center gap-4 focus:outline-none"
              >
                <div className="flex flex-col space-y-1.5">
                  <span className="w-8 h-[1px] bg-white group-hover:bg-pink-400 transition-all duration-500" />
                  <span className="w-5 h-[1px] bg-pink-500" />
                </div>
                <span className="hidden md:block text-[9px] uppercase tracking-[0.5em] text-white/50 group-hover:text-white transition-colors duration-500">
                  Menu
                </span>
              </button>
            </div>

            {/* Center: Brand Identity */}
            <div className="flex-none">
              <Link to="/" className="group text-center block">
                <h1 className="text-xl md:text-2xl font-extralight uppercase tracking-[0.6em] text-white leading-none transition-all duration-700 group-hover:tracking-[0.7em]">
                  {siteConfig.brandName}
                </h1>
                <span className="text-[7px] uppercase tracking-[0.8em] text-pink-500/80 mt-2 block ml-[0.8em] font-bold">
                  enterprise
                </span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex-1 flex justify-end items-center">
              <div className="flex items-center space-x-6 md:space-x-8">
                {/* DESKTOP: Inline expanding search (hidden on mobile) */}
                <div className="hidden md:flex relative items-center">
                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.form
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '180px', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        onSubmit={handleSearchSubmit}
                        className="overflow-hidden mr-3"
                      >
                        {/* Search input is intentionally empty – your original code had no input here; preserved */}
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="text-white/60 hover:text-pink-300 transition-colors duration-500"
                  >
                    {isSearchOpen ? (
                      <span className="text-[10px] tracking-tighter font-light">✕</span>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* MOBILE: Search icon - toggles full-width search bar below */}
                <div className="flex md:hidden items-center">
                  <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="text-white/60 hover:text-pink-300 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                </div>

                {/* Cart Toggle */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative group py-1"
                  aria-label="Shopping bag"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60 group-hover:text-pink-300 transition-colors">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 text-[7px] font-bold bg-pink-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE SEARCH DROPDOWN - appears below header when search is open */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2">
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SEARCH COLLECTIONS"
                      className="flex-1 bg-transparent border-b border-white/20 py-2 text-[10px] uppercase tracking-[0.3em] focus:outline-none focus:border-pink-400/50 transition-colors placeholder:text-neutral-700 text-white"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-neutral-400 border border-white/10 hover:text-white hover:border-white/20 transition-all"
                    >
                      Go
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Fullscreen Navigation Overlay – with its own hearts */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black z-[70] flex flex-col"
          >
            {/* ✦ OVERLAY HEARTS – EXTREMELY SUBTLE ✦ */}
            <OverlayHearts />

            <div className="flex justify-between items-center p-8 md:p-12 border-b border-white/5">
              <span className="text-[9px] uppercase tracking-[0.6em] text-white font-bold">mamusca
enterprise

</span>
              <button onClick={() => setIsMenuOpen(false)} className="group flex items-center gap-3">
                <span className="text-[9px] uppercase tracking-widest text-white/40 group-hover:text-white">Close</span>
                <div className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full group-hover:border-pink-500 transition-colors">
                  <div className="relative w-4 h-4 text-white">✕</div>
                </div>
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 md:px-24">
              <nav className="space-y-4 md:space-y-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-baseline gap-6"
                    >
                      <span className="text-sm font-light text-pink-500/30 italic">0{i + 1}</span>
                      <h2 className="text-6xl md:text-9xl font-extralight uppercase tracking-tighter text-white group-hover:italic group-hover:text-pink-300 transition-all duration-700">
                        {link.label}
                      </h2>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 border-t border-white/5">
              <div>
                <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-4">Inquiries</p>
                <a href={`mailto:${siteConfig.business.email}`} className="text-sm text-pink-300 hover:text-white transition-colors">
                  {siteConfig.business.email}
                </a>
              </div>
              <div className="md:text-right">
                <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-4">Social</p>
                <div className="flex md:justify-end gap-6 text-[10px] uppercase tracking-widest text-white">
                  <a href="#" className="hover:text-pink-300 transition-colors">Instagram</a>
                  <a href="#" className="hover:text-pink-300 transition-colors">WhatsApp</a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;