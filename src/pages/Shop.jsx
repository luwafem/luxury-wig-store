import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';
import ProductGrid from '../components/products/ProductGrid';
import { productService } from '../services/firebase';

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchParams] = useSearchParams();

  // Read search query from URL on mount and when URL changes
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, sortBy, allProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getAllProducts();
      setAllProducts(productsData || []);
      setFilteredProducts(productsData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...allProducts];
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.productCode?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    // Sorting logic
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // 'newest' – assume default order (by createdAt or similar)
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    setFilteredProducts(filtered);
  };

  const categories = [...new Set(allProducts.map(p => p.category))].filter(Boolean);

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
      // Balanced hearts – same as Home / ProductDetails
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
          id: `SHOP-L-${i}`,
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
          id: `SHOP-R-${i}`,
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

  return (
    <div className="bg-black text-white antialiased min-h-screen overflow-hidden">
      <SEO title="Mamusca – The Archival Shop" />

      {/* ✦ PERFECT HEARTS – LEFT & RIGHT EDGES ONLY ✦ */}
      <DecorativeElements />

      {/* Minimalist Hero Header */}
      <header className="relative pt-32 pb-16 border-b border-pink-400/10">
        <div className="container mx-auto px-4 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-5xl sm:text-7xl md:text-[100px] font-light uppercase tracking-tighter leading-[0.9] mb-12">
              Wig <span className=" text-pink-400 uppercase tracking-normal">shop</span>
            </h1>
            
            {/* Dark‑luxe Search Bar */}
            <div className="w-full max-w-xl relative group">
              <input
                type="text"
                placeholder="SEARCH BY NAME OR CODE"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-pink-400/30 py-4 text-center uppercase tracking-[0.2em] text-[11px] focus:outline-none focus:border-pink-400 transition-colors placeholder:text-neutral-600 text-white"
              />
              <span className="absolute right-0 bottom-4 text-pink-400/50 text-[9px] tracking-[0.3em] opacity-0 group-focus-within:opacity-100 transition-opacity">
                SEARCH
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      

      {/* Sticky Filter Bar – Dark Split */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-pink-400/10">
        <div className="container mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-pink-400/20">
            
            {/* Category Filter – horizontal scroll */}
            <div className="px-6 py-5 overflow-x-auto flex items-center space-x-8 no-scrollbar">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`uppercase tracking-[0.3em] text-[10px] whitespace-nowrap transition-colors ${
                  !selectedCategory 
                    ? 'text-white font-bold after:content-[""] after:block after:w-4 after:h-[1px] after:bg-pink-400 after:mt-1 after:mx-auto' 
                    : 'text-neutral-500 hover:text-pink-300'
                }`}
              >
                All Pieces
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`uppercase tracking-[0.3em] text-[10px] whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'text-white font-bold after:content-[""] after:block after:w-4 after:h-[1px] after:bg-pink-400 after:mt-1 after:mx-auto' 
                      : 'text-neutral-500 hover:text-pink-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Filter */}
            <div className="px-6 py-5 flex items-center justify-between md:justify-end space-x-4">
              <span className="uppercase tracking-[0.2em] text-[9px] text-neutral-500">Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent uppercase tracking-[0.2em] text-[10px] focus:outline-none cursor-pointer text-white"
              >
                <option value="newest" className="bg-black">Latest</option>
                <option value="price-low-high" className="bg-black">Price: Low-High</option>
                <option value="price-high-low" className="bg-black">Price: High-Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Trust Bar – rhythmic, endless */}
      <div className="py-8 border-t border-pink-400/10 bg-black/60 backdrop-blur-sm overflow-hidden flex whitespace-nowrap relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
        <motion.div 
          className="flex gap-12 md:gap-24 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {[...Array(2)].flatMap((_, i) => 
            ['Virgin Origin', 'Global Atelier', 'Secure', 'Concierge', 'Hand‑Finished', 'Ethical'].map((text, idx) => (
              <div key={`${i}-${idx}`} className="flex items-center gap-4">
                <span className="w-1 h-1 rounded-full bg-pink-500/40" />
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-light">
                  {text}
                </p>
              </div>
            ))
          )}
        </motion.div>
      </div>

      {/* Main Product Area */}
      <main className="py-20 md:py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-8 h-[1px] bg-pink-400 animate-pulse mb-4" />
              <span className="uppercase tracking-[0.4em] text-[10px] text-neutral-400">
                Loading Archive
              </span>
            </div>
          ) : (
            <>
              {/* Results count with signature divider */}
              <div className="mb-12 flex justify-between items-end border-b border-pink-400/10 pb-5">
                <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">
                  {filteredProducts.length} Pieces
                </span>
                <span className="text-pink-400/60 text-[8px] uppercase tracking-[0.6em]">
                  {selectedCategory || 'All'}
                </span>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory + searchQuery}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ProductGrid products={filteredProducts} showFilters={false} />
                </motion.div>
              </AnimatePresence>

              {/* Empty state – refined */}
              {filteredProducts.length === 0 && (
                <div className="py-40 text-center">
                  <h3 className="uppercase tracking-[0.4em] text-xs mb-6 text-pink-400/70">
                    No matches found
                  </h3>
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('');}}
                    className="text-[9px] uppercase tracking-[0.3em] border-b border-pink-400/50 pb-1 hover:border-pink-400 transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

     
    </div>
  );
};

export default Shop;