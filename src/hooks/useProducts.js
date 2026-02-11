import { useState, useEffect } from 'react';
import { productService } from '../services/firebase';

export const useProducts = (options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    featured = false,
    bestSellers = false,
    limit = null,
  } = options;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let productsData;
      
      if (featured) {
        productsData = await productService.getFeaturedProducts();
      } else if (bestSellers) {
        productsData = await productService.getBestSellers();
      } else {
        productsData = await productService.getAllProducts();
      }

      if (limit) {
        productsData = productsData.slice(0, limit);
      }

      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      return await productService.getProductById(id);
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  };

  const searchProducts = async (searchTerm) => {
    try {
      return await productService.searchProducts(searchTerm);
    } catch (err) {
      console.error('Error searching products:', err);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    getProductById,
    searchProducts,
  };
};