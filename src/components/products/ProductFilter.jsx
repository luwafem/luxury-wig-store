import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProductFilter = ({
  searchTerm,
  setSearchTerm,
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  totalProducts,
  filteredCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priceOptions = [
    { label: 'All Prices', min: 0, max: 1000000 },
    { label: 'Under ₦20,000', min: 0, max: 20000 },
    { label: '₦20,000 - ₦50,000', min: 20000, max: 50000 },
    { label: '₦50,000 - ₦100,000', min: 50000, max: 100000 },
    { label: 'Over ₦100,000', min: 100000, max: 1000000 },
  ];

  return (
    <div className="bg-black/80 backdrop-blur-sm border border-white/5 p-8 mb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium text-pink-300">
            Filters
          </h2>
          <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 mt-2">
            {filteredCount} of {totalProducts} products
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-[9px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white border-b border-transparent hover:border-pink-400 pb-0.5 transition-colors"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Search */}
        <div className="mb-8">
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
            Search Products
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, code, or description..."
            className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-3">
            Category
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-[9px] uppercase tracking-[0.3em] border transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'border-pink-400 text-white bg-pink-400/5'
                  : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
              }`}
            >
              All Categories
            </button>
            {categories
              .filter(cat => cat !== 'all')
              .map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-[9px] uppercase tracking-[0.3em] border transition-all duration-300 ${
                    selectedCategory === category
                      ? 'border-pink-400 text-white bg-pink-400/5'
                      : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-3">
            Price Range: ₦{priceRange[0].toLocaleString()} – ₦{priceRange[1].toLocaleString()}
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="1000000"
              step="1000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-full h-1.5 bg-white/10 rounded-none appearance-none cursor-pointer accent-pink-400"
              style={{
                background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(priceRange[0] / 1000000) * 100}%, rgba(255,255,255,0.1) ${(priceRange[0] / 1000000) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
            <input
              type="range"
              min="0"
              max="1000000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-1.5 bg-white/10 rounded-none appearance-none cursor-pointer accent-pink-400"
              style={{
                background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(priceRange[1] / 1000000) * 100}%, rgba(255,255,255,0.1) ${(priceRange[1] / 1000000) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] uppercase tracking-[0.3em] text-neutral-500 mt-3">
            <span>₦0</span>
            <span>₦1,000,000+</span>
          </div>
        </div>

        {/* Quick Price Filters */}
        <div className="mb-8">
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-3">
            Quick Price Filters
          </label>
          <div className="grid grid-cols-2 gap-3">
            {priceOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setPriceRange([option.min, option.max])}
                className={`px-3 py-2.5 text-[9px] uppercase tracking-[0.3em] border transition-all duration-300 ${
                  priceRange[0] === option.min && priceRange[1] === option.max
                    ? 'border-pink-400 text-white bg-pink-400/5'
                    : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex space-x-4 pt-6 border-t border-white/5">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange([0, 1000000]);
            }}
            className="group relative flex-1 h-12 overflow-hidden border border-white/20 text-[9px] uppercase tracking-[0.3em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40"
          >
            <motion.div
              className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
              whileHover={{ width: '100%' }}
            />
            <span className="relative z-10 group-hover:text-white transition-colors duration-700">
              Clear All Filters
            </span>
          </button>
          
          <button
            onClick={() => setIsExpanded(false)}
            className="md:hidden group relative flex-1 h-12 overflow-hidden border border-white text-[9px] uppercase tracking-[0.3em] text-white bg-transparent transition-all duration-700"
          >
            <motion.div
              className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
              whileHover={{ width: '100%' }}
            />
            <span className="relative z-10 group-hover:text-black transition-colors duration-700">
              Apply Filters
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;