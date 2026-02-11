import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';

const ProductGrid = ({ products, loading = false, showFilters = true }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

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
  }, [products, searchTerm, selectedCategory, priceRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="w-6 h-6 border-t border-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6">
      {showFilters && (
        <div className="mb-20">
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
        </div>
      )}

      {/* Header Info: Editorial Style */}
      {showFilters && (
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-black/5">
          <div className="space-y-2 mb-6 md:mb-0">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 font-bold">The Catalog</h2>
            <p className="text-2xl md:text-3xl font-light uppercase tracking-tighter">
              {selectedCategory === 'all' ? 'The Full Collection' : selectedCategory}
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              Displaying {filteredProducts.length} Results
            </span>
            <div className="relative group">
              <select className="appearance-none bg-transparent text-[9px] uppercase tracking-[0.3em] pr-6 outline-none cursor-pointer">
                <option>Featured</option>
                <option>Price: Low—High</option>
                <option>Price: High—Low</option>
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-[8px]">↓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Asymmetric or Clean Layout */}
      {filteredProducts.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-40 border-t border-black/5"
        >
          <span className="block text-4xl font-light mb-6">—</span>
          <h3 className="text-[11px] uppercase tracking-[0.5em] text-neutral-400">
            {searchTerm ? `No matches found for "${searchTerm}"` : 'Selection Empty'}
          </h3>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
        >
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;