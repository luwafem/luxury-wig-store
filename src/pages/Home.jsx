import React, { useState, useEffect, useRef, lazy, Suspense, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SEO from '../components/common/SEO';
import { productService } from '../services/firebase'; // ← IMPORT MISSING

// Lazy load ProductGrid – heavy component
const ProductGrid = lazy(() => import('../components/products/ProductGrid'));

// Simple fallback – no animations, pure CSS
const GridFallback = () => (
  <div className="h-96 flex items-center justify-center">
    <div className="w-12 h-px bg-pink-500/50" />
  </div>
);

// Static trust items – never changes
const TRUST_ITEMS = [
  'Raw Virgin Origin',
  'Global Atelier Shipping',
  'Secure Acquisition',
  'Private Concierge',
  'Hand‑Finished Lace',
  'Ethically Sourced',
];

// ----------------------------------------------
// Magnetic Button – throttled, lightweight
// ----------------------------------------------
const MagneticButton = React.memo(({ children, to, className = '' }) => {
  const ref = useRef(null);
  const rafRef = useRef();

  const handleMouse = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - (left + width / 2)) * 0.1;
      const y = (e.clientY - (top + height / 2)) * 0.1;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  }, []);

  const reset = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={`will-change-transform ${className}`}
      style={{ transition: 'transform 80ms ease' }}
    >
      <Link to={to} className="block w-full h-full">
        {children}
      </Link>
    </div>
  );
});

// ----------------------------------------------
// DECORATIVE HEARTS – Ultra light, client‑only
// ----------------------------------------------
const Heart = ({ size, color, top, left, rotate }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute pointer-events-none will-change-transform"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      opacity: 0.35,
    }}
  >
    <path
      d="M12,4 C8,-2 0,0 0,7 C0,14 12,20 12,20 C12,20 24,14 24,7 C24,0 16,-2 12,4 Z"
      fill={color}
    />
  </svg>
);

const DecorativeHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Client only – avoid SSR mismatch
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 2 : 4;
    const newHearts = [];
    for (let i = 0; i < count; i++) {
      newHearts.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: isMobile ? 28 : 48,
        rotate: Math.random() * 360,
        color: `rgba(236, 72, 153, ${Math.random() * 0.2 + 0.3})`,
      });
    }
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <Heart key={heart.id} {...heart} />
      ))}
    </div>
  );
};

// ----------------------------------------------
// PRODUCT SECTION – Reusable block
// ----------------------------------------------
const ProductSection = React.memo(({ title, products, loading, viewAllLink, highlight }) => (
  <section className="py-32 relative overflow-hidden">
    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 pb-10 border-b border-white/5">
        <div>
          <p className="text-pink-500/80 text-[10px] uppercase tracking-[0.6em] mb-2 font-light">
            Curated Selection
          </p>
          <h2 className="text-5xl md:text-7xl font-extralight uppercase tracking-tighter">
            {title}
            {highlight && (
              <span className="text-pink-300/90 inline-block ml-2">{highlight}</span>
            )}
          </h2>
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 hover:text-pink-300 transition-colors"
          >
            View All
            <span className="inline-block group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="w-12 h-px bg-pink-500/50 animate-pulse" />
        </div>
      ) : (
        <Suspense fallback={<GridFallback />}>
          <ProductGrid products={products} showFilters={false} />
        </Suspense>
      )}
    </div>
  </section>
));

// ----------------------------------------------
// EDITORIAL BREAK – Manifesto
// ----------------------------------------------
const EditorialBreak = React.memo(() => (
  <section className="py-32 md:py-40 container mx-auto px-6 relative overflow-hidden">
    <div className="absolute left-0 top-1/2 w-px h-32 bg-gradient-to-b from-transparent via-pink-500/30 to-transparent" />
    <div className="absolute right-0 bottom-1/2 w-px h-32 bg-gradient-to-t from-transparent via-pink-500/30 to-transparent" />

    <div className="grid md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-6 relative group">
        <div className="absolute -inset-4 border border-pink-500/20 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700" />
        <img
          src="https://images.pexels.com/photos/3993443/pexels-photo-3993443.jpeg?auto=compress&cs=tinysrgb&w=1200"
          className="relative z-10 w-full aspect-[4/5] object-cover"
          alt="Artisanal process"
          loading="lazy"
          width="600"
          height="750"
        />
      </div>

      <div className="md:col-span-5 md:col-start-8 space-y-8">
        <h2 className="text-6xl md:text-7xl font-thin uppercase tracking-tighter leading-none text-pink-400/90">
          {'Manifesto.'.split('').map((char, i) => (
            <span key={i} className="inline-block animate-fadeInUp" style={{ animationDelay: `${i * 0.03}s` }}>
              {char}
            </span>
          ))}
        </h2>
        <p className="text-neutral-400 text-lg leading-relaxed font-light">
          True luxury isn't found in a warehouse. It's found in the meticulous alignment of every strand the
          hand finished lace that disappears against the skin.
        </p>
        <Link
          to="/about"
          className="group inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] text-white/80 hover:text-pink-300 transition-colors"
        >
          <span>Our Story</span>
          <span className="h-px w-12 bg-pink-500/50 group-hover:w-20 transition-all duration-500" />
        </Link>
      </div>
    </div>
  </section>
));

// ----------------------------------------------
// STATEMENT – Luxury is Quiet
// ----------------------------------------------
const Statement = React.memo(() => (
  <section className="py-48 md:py-60 relative overflow-hidden text-center border-y border-white/5">
    <h2 className="text-6xl md:text-[10rem] font-extralight uppercase tracking-tighter leading-[0.9] px-6 animate-fadeIn">
      Luxury is
      <br />
      <span className="italic text-pink-300/80 font-light">Quiet.</span>
    </h2>
  </section>
));

// ----------------------------------------------
// BESPOKE CTA – Cinematic
// ----------------------------------------------
const BespokeCTA = React.memo(() => (
  <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/30 z-10" />
      <img
        src="https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=1200"
        className="w-full h-full object-cover"
        alt="Bespoke craftsmanship"
        loading="lazy"
        width="1200"
        height="800"
      />
    </div>

    <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
      <div className="bg-black/30 backdrop-blur-md p-12 md:p-20 border border-white/10">
        <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter mb-6">
          The Bespoke Commission
        </h2>
        <p className="text-neutral-300 text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed">
          Collaborate with our master stylists. Every unit tailored to your exact measurements and desires.
        </p>
        <MagneticButton to="/custom">
          <div className="relative inline-block px-12 py-5 overflow-hidden border border-pink-400/50 hover:border-white transition-all duration-500">
            <span className="relative z-10 text-[10px] uppercase tracking-[0.5em] text-white group-hover:text-black transition-colors duration-700">
              Enter the Atelier
            </span>
          </div>
        </MagneticButton>
      </div>
    </div>
  </section>
));

// ----------------------------------------------
// MAIN HOME COMPONENT
// ----------------------------------------------
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 80]);
  const y2 = useTransform(scrollY, [0, 500], [0, 120]);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [featured, bestSelling] = await Promise.all([
          productService.getFeaturedProducts(8),
          productService.getBestSellers(8),
        ]);
        if (isMounted) {
          setFeaturedProducts(featured || []);
          setBestSellers(bestSelling || []);
        }
      } catch (error) {
        console.error('Home products fetch error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-black text-white antialiased selection:bg-pink-500/30 overflow-x-hidden">
      <SEO title="Luxury Custom Wigs & Virgin Hair | Boutique Experience" />

      {/* Static hearts – no JS after mount */}
      <DecorativeHearts />

      {/* ────────────────── HERO – SILENT COMMAND ────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60 z-10" />
          <img
            src="https://www.heavenlytresses.com/cdn/shop/files/Heavenly_Tresses_Luxury_Virgin_Hair_Human_Lace_Wigs_Online_1600x.jpg"
            srcSet="
              https://www.heavenlytresses.com/cdn/shop/files/Heavenly_Tresses_Luxury_Virgin_Hair_Human_Lace_Wigs_Online_800x.jpg 800w,
              https://www.heavenlytresses.com/cdn/shop/files/Heavenly_Tresses_Luxury_Virgin_Hair_Human_Lace_Wigs_Online_1600x.jpg 1600w
            "
            sizes="(max-width: 768px) 100vw, 100vw"
            className="w-full h-full object-cover object-center"
            alt="Virgin hair – silent luxury"
            fetchpriority="high"
            loading="eager"
            width="1600"
            height="900"
          />
        </motion.div>

        {/* Noise overlay */}
        <div
          className="absolute inset-0 z-5 opacity-20 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.74' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)' opacity='0.1' /%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-30 text-center px-6 max-w-6xl mx-auto">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <span className="uppercase tracking-[0.8em] text-[8px] md:text-[10px] text-pink-200/50 font-extralight block mb-6">
              Est. 2026
            </span>
          </div>

          <h1 className="text-[clamp(4rem,15vw,10rem)] font-extralight uppercase tracking-[-0.06em] leading-[0.8]">
            <span className="block animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              TIMELESS
            </span>
            <span
              className="block text-pink-200/80 mt-1 animate-fadeInUp"
              style={{ animationDelay: '1.0s' }}
            >
              PRESENCE
            </span>
          </h1>

          <p
            className="text-sm md:text-base text-neutral-400 font-light tracking-[0.3em] uppercase mt-8 md:mt-10 animate-fadeIn"
            style={{ animationDelay: '1.4s' }}
          >
            Virgin. Hand‑finished. Silent.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-10 md:gap-16 justify-center items-center mt-12 md:mt-16 animate-fadeInUp"
            style={{ animationDelay: '1.8s' }}
          >
            <MagneticButton to="/shop" className="relative group">
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/90 hover:text-pink-200 transition-colors duration-500">
                browse shop
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-pink-200 group-hover:w-full transition-all duration-500" />
            </MagneticButton>
            <MagneticButton to="/contact" className="relative group">
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.5em] text-pink-200/80 hover:text-white transition-colors duration-500">
                get a custom wig
              </span>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-white group-hover:w-full transition-all duration-500" />
            </MagneticButton>
          </div>
        </div>

        {/* Trust bar – infinite scroll */}
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-md py-5 border-t border-white/5">
          <div className="flex gap-12 md:gap-20 items-center whitespace-nowrap animate-scroll">
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-6 md:gap-10 flex-shrink-0">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-white/80">
                  {item}
                </p>
                <span className="text-pink-300 text-sm md:text-base animate-spin-slow">🌸</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center">
          <span className="text-[7px] uppercase tracking-[0.8em] text-neutral-700 mb-2">Scroll</span>
          <div className="w-1 h-1 rounded-full bg-pink-400/50 animate-bounce-slow" />
        </div>
      </section>

      {/* ────────────────── LAZY LOADED SECTIONS ────────────────── */}
      <Suspense fallback={<GridFallback />}>
        <ProductSection
          title="New Arrivals"
          products={featuredProducts}
          loading={loading}
          viewAllLink="/shop"
        />
      </Suspense>

      <Suspense fallback={<div className="h-96" />}>
        <EditorialBreak />
      </Suspense>

      <Suspense fallback={<GridFallback />}>
        <ProductSection
          title="Best "
          products={bestSellers}
          loading={loading}
          viewAllLink="/shop"
          highlight="Sellers"
        />
      </Suspense>

      <Suspense fallback={<div className="h-96" />}>
        <Statement />
      </Suspense>

      <Suspense fallback={<div className="h-screen" />}>
        <BespokeCTA />
      </Suspense>
    </div>
  );
};

export default Home;