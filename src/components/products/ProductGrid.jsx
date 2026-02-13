import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

const ProductGrid = ({ products, loading = false, showFilters = true }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filtering logic
  useEffect(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.productCode?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, priceRange]);

  // Sorting handler
  const handleSortChange = (e) => {
    const value = e.target.value;
    const sorted = [...filteredProducts];
    if (value === 'Price: Low—High') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (value === 'Price: High—Low') {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => products.findIndex(p => p.id === a.id) - products.findIndex(p => p.id === b.id));
    }
    setFilteredProducts(sorted);
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center py-40 bg-transparent"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-[1px] bg-pink-400 mb-4"
        />
        <span className="uppercase tracking-[0.4em] text-[10px] text-neutral-400">
          Loading Archive
        </span>
      </motion.div>
    );
  }

  return (
    <div className="text-white antialiased selection:bg-pink-500/30 relative bg-transparent">
      {/* ─── MAIN CONTENT – sits directly on transparent background ─────────── */}
      <div className="container mx-auto px-4 md:px-12 relative z-20">
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20"
          >
            <ProductFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              totalProducts={products.length}
              filteredCount={filteredProducts.length}
            />
          </motion.div>
        )}

        {/* Header Info – Home Editorial Style */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-white/5"
          >
            <div className="space-y-2 mb-6 md:mb-0">
              <h2 className="text-[10px] uppercase tracking-[0.6em] text-pink-400/70 font-extralight">
                The Archive
              </h2>
              <p className="text-3xl md:text-4xl font-extralight uppercase tracking-tighter text-white">
                {selectedCategory === 'all' ? 'The Full Collection' : selectedCategory}
              </p>
            </div>

            <div className="flex items-center gap-8">
              <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-light">
                {filteredProducts.length === 0
                  ? '0 results'
                  : `Showing ${startIndex + 1}–${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length}`}
              </span>
              <div className="relative group">
                <select
                  onChange={handleSortChange}
                  className="appearance-none bg-transparent text-[9px] uppercase tracking-[0.4em] pr-6 outline-none cursor-pointer text-white/80 hover:text-white border-b border-transparent focus:border-pink-400/50 pb-1 transition-all duration-300"
                >
                  <option className="bg-black text-white">Featured</option>
                  <option className="bg-black text-white">Price: Low—High</option>
                  <option className="bg-black text-white">Price: High—Low</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400/60 text-[8px] group-hover:translate-y-0.5 transition-transform">
                  ↓
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-40 border-t border-white/5"
          >
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="block text-4xl font-extralight mb-6 text-neutral-600"
            >
              —
            </motion.span>
            <h3 className="text-[11px] uppercase tracking-[0.6em] text-neutral-500 font-light">
              {searchTerm ? `No matches for "${searchTerm}"` : 'Selection empty'}
            </h3>
          </motion.div>
        ) : (
          <>
            <motion.div
              key={currentPage}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16"
            >
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    layout
                    exit="exit"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination Controls – Editorial with Motion */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-between items-center mt-16 pt-8 border-t border-white/5"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 font-light">
                    Items per page
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-transparent text-[9px] uppercase tracking-[0.3em] text-white/80 hover:text-white border-b border-pink-400/30 pb-1 focus:outline-none focus:border-pink-400 transition-all duration-300"
                  >
                    <option className="bg-black" value={12}>12</option>
                    <option className="bg-black" value={24}>24</option>
                    <option className="bg-black" value={48}>48</option>
                  </select>
                </div>

                <div className="flex items-center space-x-6">
                  <motion.button
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`text-[10px] uppercase tracking-[0.4em] transition-colors ${
                      currentPage === 1
                        ? 'text-neutral-700 cursor-not-allowed'
                        : 'text-neutral-400 hover:text-pink-300'
                    }`}
                  >
                    ← Prev
                  </motion.button>

                  <div className="flex items-center space-x-3">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        totalPages <= 7 ||
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <motion.button
                            key={page}
                            whileHover={{ scale: 1.1, color: '#f472b6' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => goToPage(page)}
                            className={`w-7 h-7 flex items-center justify-center text-[11px] transition-all relative ${
                              currentPage === page
                                ? 'text-white'
                                : 'text-neutral-500 hover:text-pink-300'
                            }`}
                          >
                            {currentPage === page && (
                              <motion.div
                                layoutId="activePage"
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-pink-400"
                                transition={{ duration: 0.2 }}
                              />
                            )}
                            {page}
                          </motion.button>
                        );
                      } else if (
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={page} className="text-neutral-600 text-[11px]">
                            …
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`text-[10px] uppercase tracking-[0.4em] transition-colors ${
                      currentPage === totalPages
                        ? 'text-neutral-700 cursor-not-allowed'
                        : 'text-neutral-400 hover:text-pink-300'
                    }`}
                  >
                    Next →
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;