import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SEO from '../components/common/SEO';
import ProductGrid from '../components/products/ProductGrid';
import { productService } from '../services/firebase';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 80]);
  const y2 = useTransform(scrollY, [0, 500], [0, 120]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [featured, bestSelling] = await Promise.all([
        productService.getFeaturedProducts(8),
        productService.getBestSellers(8),
      ]);
      setFeaturedProducts(featured || []);
      setBestSellers(bestSelling || []);
    } catch (error) {
      console.error('Home products fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const trustItems = [
    'Raw Virgin Origin',
    'Global Atelier Shipping',
    'Secure Acquisition',
    'Private Concierge',
    'Hand‑Finished Lace',
    'Ethically Sourced'
  ];

  const MagneticButton = ({ children, to, className }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    
    const handleMouse = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.2;
      const y = (clientY - (top + height / 2)) * 0.2;
      setPosition({ x, y });
    };
    
    const reset = () => setPosition({ x: 0, y: 0 });
    
    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        className={className}
      >
        <Link to={to} className="block w-full h-full">
          {children}
        </Link>
      </motion.div>
    );
  };

  // ─────────────────────────────────────────────────────────
  //  PERFECT HEART – solid, smooth, filled
  //  No sketchy strokes – clean and precise
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
      // Ultra subtle: 5–12 hearts total, split between left & right edges
      const isMobile = window.innerWidth < 768;
      const count = isMobile
        ? Math.floor(Math.random() * 5) + 3   // 3–8
        : Math.floor(Math.random() * 7) + 5; // 5–12
      
      const minSize = isMobile ? 24 : 32;
      const maxSize = isMobile ? 54 : 84;
      
      const newElements = [];
      for (let i = 0; i < count; i++) {
        const side = Math.random() > 0.5 ? 'left' : 'right';
        let x;
        if (side === 'left') {
          x = Math.random() * 15; // 0–15%
        } else {
          x = Math.random() * 15 + 85; // 85–100%
        }

        newElements.push({
          id: i,
          x,
          y: Math.random() * 100,
          size: Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
          rotate: Math.random() * 360,
          opacity: Math.random() * 0.4 + 0.5, // 0.5–0.9
          color: `rgba(236, 72, 153, ${Math.random() * 0.4 + 0.5})`,
          delay: i * 0.15,
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

  return (
    <div className="bg-black text-white antialiased selection:bg-pink-500/30 overflow-x-hidden">
      <SEO title="Luxury Custom Wigs & Virgin Hair | Boutique Experience" />

      {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
      <DecorativeElements />

      {/* ────────────────── HERO – SILENT COMMAND ────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
        <motion.div
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
          initial={{ scale: 1.06, opacity: 0.95 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 12, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60 z-10" />
          <img
            src="https://www.heavenlytresses.com/cdn/shop/files/Heavenly_Tresses_Luxury_Virgin_Hair_Human_Lace_Wigs_Online_1600x.jpg?v=1724867170"
            className="w-full h-full object-cover object-center"
            alt="Virgin hair – silent luxury"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 z-5 opacity-20 mix-blend-overlay pointer-events-none"
          style={{ y: y2 }}
        >
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4xIiAvPjwvc3ZnPg==')] bg-repeat opacity-20" />
        </motion.div>

        <div className="relative z-30 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
          >
            <span className="uppercase tracking-[0.8em] text-[8px] md:text-[10px] text-pink-200/50 font-extralight block mb-6">
              Est. 2026
            </span>
          </motion.div>

          <h1 className="text-[clamp(4rem,15vw,10rem)] font-extralight uppercase tracking-[-0.06em] leading-[0.8]">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              TIMELESS
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="block text-pink-200/80 mt-1"
            >
              PRESENCE
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-sm md:text-base text-neutral-400 font-light tracking-[0.3em] uppercase mt-8 md:mt-10"
          >
            Virgin. Hand‑finished. Silent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-10 md:gap-16 justify-center items-center mt-12 md:mt-16"
          >
            <MagneticButton to="/shop" className="relative">
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/90 hover:text-pink-200 transition-colors duration-500">
                The Collection
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-pink-200 group-hover:w-full transition-all duration-500" />
            </MagneticButton>
            <MagneticButton to="/custom" className="relative">
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.5em] text-pink-200/80 hover:text-white transition-colors duration-500">
                Bespoke Atelier
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
            </MagneticButton>
          </motion.div>
        </div>

        {/* Trust bar – 🌸 emoji separator (unchanged) */}
        <motion.div
          style={{ y: useTransform(scrollY, [0, 400], [0, -40]) }}
          className="absolute bottom-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-md py-5 border-t border-white/5"
        >
          <motion.div
            className="flex gap-12 md:gap-20 items-center whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          >
            {[...trustItems, ...trustItems].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-6 md:gap-10 flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-white/80">
                  {item}
                </p>
                <motion.span
                  className="text-pink-300 text-sm md:text-base"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  🌸
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center"
        >
          <span className="text-[7px] uppercase tracking-[0.8em] text-neutral-700 mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1 rounded-full bg-pink-400/50"
          />
        </motion.div>
      </section>

      {/* ────────────────── NEW ARRIVALS ────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent -skew-y-12"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-baseline mb-16 pb-10 border-b border-white/5"
          >
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-pink-500/80 text-[10px] uppercase tracking-[0.6em] mb-2 font-light"
              >
                Curated Selection
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-extralight uppercase tracking-tighter"
              >
                New Arrivals
              </motion.h2>
            </div>
            <Link
              to="/shop"
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 hover:text-pink-300 transition-colors"
            >
              View All
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-px bg-pink-500/50"
              />
            </div>
          ) : (
            <ProductGrid products={featuredProducts} showFilters={false} />
          )}
        </div>
      </section>

      {/* ────────────────── EDITORIAL BREAK – MANIFESTO ────────────────── */}
      <section className="py-32 md:py-40 container mx-auto px-6 relative overflow-hidden">
        <motion.div
          className="absolute left-0 top-1/2 w-px h-32 bg-gradient-to-b from-transparent via-pink-500/30 to-transparent"
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-0 bottom-1/2 w-px h-32 bg-gradient-to-t from-transparent via-pink-500/30 to-transparent"
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="grid md:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-6 relative group"
          >
            <motion.div
              className="absolute -inset-4 border border-pink-500/20 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img
              src="https://images.pexels.com/photos/3993443/pexels-photo-3993443.jpeg?auto=compress&cs=tinysrgb&w=1200"
              className="relative z-10 w-full aspect-[4/5] object-cover"
              alt="Artisanal process"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-5 md:col-start-8 space-y-8"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
              className="text-6xl md:text-7xl font-thin uppercase tracking-tighter leading-none text-pink-400/90"
            >
              {'Manifesto.'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-neutral-400 text-lg leading-relaxed font-light"
            >
              True luxury isn't found in a warehouse. It's found in the meticulous alignment of every strand — the hand‑finished lace that disappears against the skin.
            </motion.p>
            <Link
              to="/about"
              className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] text-white/80 hover:text-pink-300 transition-colors"
            >
              <span>Our Story</span>
              <motion.span
                className="h-px w-12 bg-pink-500/50"
                whileHover={{ width: 80 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ────────────────── BEST SELLERS ────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-thin uppercase tracking-tighter mb-4">
              Best{' '}
              <motion.span
                className="text-pink-300/90 inline-block"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                Sellers
              </motion.span>
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              className="h-px bg-pink-500/50 mx-auto"
            />
          </motion.div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border border-pink-500/30 border-t-pink-500 rounded-full"
              />
            </div>
          ) : (
            <ProductGrid products={bestSellers} showFilters={false} />
          )}
        </div>
      </section>

      {/* ────────────────── STATEMENT – LUXURY IS QUIET ────────────────── */}
      <section className="py-48 md:py-60 relative overflow-hidden text-center border-y border-white/5">
        <motion.h2
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-[10rem] font-extralight uppercase tracking-tighter leading-[0.9] px-6"
        >
          Luxury is
          <br />
          <span className="italic text-pink-300/80 font-light">Quiet.</span>
        </motion.h2>
      </section>

      {/* ────────────────── BESPOKE CTA – CINEMATIC ────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img
            src="https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=1200"
            className="w-full h-full object-cover"
            alt="Bespoke craftsmanship"
          />
        </motion.div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-black/30 backdrop-blur-md p-12 md:p-20 border border-white/10"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-light uppercase tracking-tighter mb-6"
            >
              The Bespoke Commission
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-neutral-300 text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed"
            >
              Collaborate with our master stylists. Every unit tailored to your exact measurements and desires.
            </motion.p>
            <MagneticButton to="/custom">
              <motion.div
                className="relative inline-block px-12 py-5 overflow-hidden border border-pink-400/50 hover:border-white transition-all duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                  whileHover={{ width: '100%' }}
                />
                <span className="relative z-10 text-[10px] uppercase tracking-[0.5em] text-white group-hover:text-black transition-colors duration-700">
                  Enter the Atelier
                </span>
              </motion.div>
            </MagneticButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;