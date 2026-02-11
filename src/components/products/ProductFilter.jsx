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
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <p className="text-gray-600 text-sm">
            {filteredCount} of {totalProducts} products
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-primary-600 hover:text-primary-700"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Products
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, code, or description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-sm rounded-full ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  className={`px-3 py-1.5 text-sm rounded-full ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="1000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="1000000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>₦0</span>
            <span>₦1,000,000+</span>
          </div>
        </div>

        {/* Quick Price Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Price Filters
          </label>
          <div className="grid grid-cols-2 gap-2">
            {priceOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => setPriceRange([option.min, option.max])}
                className={`px-3 py-2 text-sm rounded-lg ${
                  priceRange[0] === option.min && priceRange[1] === option.max
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex space-x-3 pt-4 border-t">
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange([0, 1000000]);
            }}
            className="flex-1 py-2.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear All Filters
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="md:hidden flex-1 py-2.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;