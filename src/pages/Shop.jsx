import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { productService } from '../services/firebase';

// ---------- Lazy load ProductGrid ----------
const ProductGrid = lazy(() => import('../components/products/ProductGrid'));

// ---------- Simple fallback ----------
const GridFallback = () => (
  <div className="flex flex-col items-center justify-center py-40">
    <div className="w-8 h-[1px] bg-pink-400 animate-pulse mb-4" />
    <span className="uppercase tracking-[0.4em] text-[10px] text-neutral-400">
      Loading shop
    </span>
  </div>
);

// ---------- Static hearts – no motion, no JavaScript after mount ----------
const hearts = (() => {
  if (typeof window === 'undefined') return [];
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 2 : 3;
  return Array.from({ length: count }, (_, i) => ({
    id: `shop-${i}`,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: isMobile ? 24 : 40,
    rotate: Math.random() * 360,
    color: `rgba(236, 72, 153, ${Math.random() * 0.2 + 0.2})`,
  }));
})();

const DecorativeHearts = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {hearts.map(({ id, left, top, size, rotate, color }) => (
      <svg
        key={id}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="absolute will-change-transform"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          opacity: 0.3,
        }}
      >
        <path
          d="M12,4 C8,-2 0,0 0,7 C0,14 12,20 12,20 C12,20 24,14 24,7 C24,0 16,-2 12,4 Z"
          fill={color}
        />
      </svg>
    ))}
  </div>
);

// ---------- Shop Component ----------
const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchParams] = useSearchParams();

  // ---------- Read URL search param ----------
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // ---------- Fetch products with cleanup ----------
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await productService.getAllProducts();
        if (isMounted) {
          setAllProducts(productsData || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  // ---------- Memoized categories ----------
  const categories = useMemo(() => {
    return [...new Set(allProducts.map(p => p.category))].filter(Boolean);
  }, [allProducts]);

  // ---------- Memoized filtered & sorted products ----------
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.productCode?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sorting
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // 'newest' – fallback to createdAt or default order
      filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return filtered;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  // ---------- Event handlers (memoized) ----------
  const handleCategoryChange = useCallback((cat) => {
    setSelectedCategory(cat);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('');
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortBy(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="bg-black text-white antialiased min-h-screen overflow-hidden">
      <SEO title="Mamusca – The Archival Shop" />

      {/* Static hearts – ultra light */}
      <DecorativeHearts />

      {/* Minimalist Hero Header – CSS fade animation */}
      <header className="relative pt-32 pb-16 border-b border-pink-400/10">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col items-center text-center animate-fadeInUp">
            <h1 className="text-5xl sm:text-7xl md:text-[100px] font-light uppercase tracking-tighter leading-[0.9] mb-12">
              Wig <span className="text-pink-400 uppercase tracking-normal">shop</span>
            </h1>

            {/* Dark‑luxe Search Bar */}
            <div className="w-full max-w-xl relative group">
              <input
                type="text"
                placeholder="SEARCH BY NAME OR CODE"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-transparent border-b border-pink-400/30 py-4 text-center uppercase tracking-[0.2em] text-[11px] focus:outline-none focus:border-pink-400 transition-colors placeholder:text-neutral-600 text-white"
              />
              <span className="absolute right-0 bottom-4 text-pink-400/50 text-[9px] tracking-[0.3em] opacity-0 group-focus-within:opacity-100 transition-opacity">
                SEARCH
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Filter Bar – Dark Split */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-pink-400/10">
        <div className="container mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-pink-400/20">
            {/* Category Filter – horizontal scroll */}
            <div className="px-6 py-5 overflow-x-auto flex items-center space-x-8 no-scrollbar">
              <button
                onClick={() => handleCategoryChange('')}
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
                  onClick={() => handleCategoryChange(cat)}
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
                onChange={handleSortChange}
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

      {/* Subtle Trust Bar – rhythmic, endless (CSS animation) */}
      <div className="py-8 border-t border-pink-400/10 bg-black/60 backdrop-blur-sm overflow-hidden flex whitespace-nowrap relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
        <div className="flex gap-12 md:gap-24 items-center animate-scroll">
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
        </div>
      </div>

      {/* Main Product Area */}
      <main className="py-20 md:py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-12">
          {loading ? (
            <GridFallback />
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

              {/* Product Grid with lazy loading & CSS fade */}
              <Suspense fallback={<GridFallback />}>
                <div key={selectedCategory + searchQuery} className="animate-fadeIn">
                  <ProductGrid products={filteredProducts} showFilters={false} />
                </div>
              </Suspense>

              {/* Empty state – refined */}
              {filteredProducts.length === 0 && !loading && (
                <div className="py-40 text-center animate-fadeIn">
                  <h3 className="uppercase tracking-[0.4em] text-xs mb-6 text-pink-400/70">
                    No matches found
                  </h3>
                  <button
                    onClick={handleClearFilters}
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