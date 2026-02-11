import React, { createContext, useState, useContext, useEffect } from 'react';
import { productService } from '../services/firebase';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const [allProducts, featured, bestSelling] = await Promise.all([
        productService.getAllProducts(),
        productService.getFeaturedProducts(),
        productService.getBestSellers(),
      ]);

      setProducts(allProducts);
      setFeaturedProducts(featured);
      setBestSellers(bestSelling);
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
      console.error('Error fetching product by ID:', err);
      throw err;
    }
  };

  const getProductByCode = async (code) => {
    try {
      return await productService.getProductByCode(code);
    } catch (err) {
      console.error('Error fetching product by code:', err);
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

  const updateProduct = async (productId, updates) => {
    try {
      const updated = await productService.saveProduct(updates, productId);
      
      // Update local state
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
      
      if (updates.isFeatured) {
        setFeaturedProducts(prev => {
          const exists = prev.find(p => p.id === productId);
          if (exists) {
            return prev.map(p => p.id === productId ? { ...p, ...updates } : p);
          } else {
            return [...prev, { ...updates, id: productId }];
          }
        });
      }

      if (updates.isBestSeller) {
        setBestSellers(prev => {
          const exists = prev.find(p => p.id === productId);
          if (exists) {
            return prev.map(p => p.id === productId ? { ...p, ...updates } : p);
          } else {
            return [...prev, { ...updates, id: productId }];
          }
        });
      }

      return updated;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.saveProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      
      if (productData.isFeatured) {
        setFeaturedProducts(prev => [newProduct, ...prev]);
      }
      
      if (productData.isBestSeller) {
        setBestSellers(prev => [newProduct, ...prev]);
      }
      
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      
      // Remove from local state
      setProducts(prev => prev.filter(p => p.id !== productId));
      setFeaturedProducts(prev => prev.filter(p => p.id !== productId));
      setBestSellers(prev => prev.filter(p => p.id !== productId));
      
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const getCategories = () => {
    const categories = new Set();
    products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories);
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
  };

  const getLowStockProducts = () => {
    return products.filter(product => product.stockQuantity < 10);
  };

  const getOutOfStockProducts = () => {
    return products.filter(product => product.stockQuantity === 0);
  };

  const value = {
    products,
    featuredProducts,
    bestSellers,
    loading,
    error,
    refreshProducts: fetchAllProducts,
    getProductById,
    getProductByCode,
    searchProducts,
    updateProduct,
    addProduct,
    deleteProduct,
    getCategories,
    getProductsByCategory,
    getLowStockProducts,
    getOutOfStockProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};