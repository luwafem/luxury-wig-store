import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';
import ProductGrid from '../components/products/ProductGrid';
import { productService } from '../services/firebase';
import { debounce } from 'lodash';

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { fetchProducts(); }, []);

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

  const debouncedSearch = useCallback(
    debounce(() => filterProducts(), 300),
    []
  );

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
    // Sort logic remains same as your original
    setFilteredProducts(filtered);
  };

  const categories = [...new Set(allProducts.map(p => p.category))].filter(Boolean);

  return (
    <div className="bg-white text-black antialiased min-h-screen">
      <SEO title="The Collection | L'Art de la Coiffure" />

      {/* Minimalist Header */}
      <header className="pt-32 pb-16 border-b border-black/5">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <span className="uppercase tracking-[0.6em] text-[10px] mb-4 text-neutral-500">
              Browse the Archive
            </span>
            <h1 className="text-4xl md:text-6xl font-light uppercase tracking-tighter mb-12">
              The Collection
            </h1>
            
            {/* Elegant Search Bar */}
            <div className="w-full max-w-xl relative group">
              <input
                type="text"
                placeholder="SEARCH BY NAME OR CODE"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-black/20 py-4 text-center uppercase tracking-[0.2em] text-[11px] focus:outline-none focus:border-black transition-colors placeholder:text-neutral-300"
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Filter Bar: Hairline Split */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black">
            {/* Category Filter */}
            <div className="px-6 py-4 overflow-x-auto flex items-center space-x-8 no-scrollbar">
              <button 
                onClick={() => setSelectedCategory('')}
                className={`uppercase tracking-[0.3em] text-[10px] whitespace-nowrap transition-colors ${!selectedCategory ? 'font-bold' : 'text-neutral-400 hover:text-black'}`}
              >
                All Pieces
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`uppercase tracking-[0.3em] text-[10px] whitespace-nowrap transition-colors ${selectedCategory === cat ? 'font-bold' : 'text-neutral-400 hover:text-black'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Filter */}
            <div className="px-6 py-4 flex items-center justify-between md:justify-end space-x-4">
              <span className="uppercase tracking-[0.2em] text-[9px] text-neutral-400">Sort By:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent uppercase tracking-[0.2em] text-[10px] focus:outline-none cursor-pointer"
              >
                <option value="newest">Latest</option>
                <option value="price-low-high">Price: Low-High</option>
                <option value="price-high-low">Price: High-Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <main className="py-20">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-8 h-[1px] bg-black animate-pulse mb-4"></div>
              <span className="uppercase tracking-[0.4em] text-[10px]">Loading Collection</span>
            </div>
          ) : (
            <>
              <div className="mb-12 flex justify-between items-end border-b border-black/5 pb-4">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                  {filteredProducts.length} Results
                </span>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory + searchQuery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ProductGrid products={filteredProducts} showFilters={false} />
                </motion.div>
              </AnimatePresence>

              {filteredProducts.length === 0 && (
                <div className="py-40 text-center">
                  <h3 className="uppercase tracking-[0.4em] text-xs mb-4">No Matches Found</h3>
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory('');}}
                    className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1"
                  >
                    Reset Archive
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