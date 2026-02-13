import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminRoute from '../../components/admin/AdminRoute';
import ProductForm from '../../components/admin/ProductForm';
import { productService } from '../../services/firebase';

const Products = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(!!id);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!id) {
      fetchProducts();
    } else {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const productData = await productService.getProductById(productId);
      setSelectedProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleFormSuccess = (updatedProduct) => {
    if (selectedProduct) {
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
    } else {
      setProducts([updatedProduct, ...products]);
    }
    setShowForm(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-black flex justify-center items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border border-pink-500/30 border-t-pink-500 rounded-full"
          />
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="bg-black text-white antialiased min-h-screen p-6">
        {/* Header */}
        <header className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="block uppercase tracking-[0.6em] text-[9px] mb-4 text-pink-400/70">
              {id ? (selectedProduct ? 'Edit Product' : 'Add Product') : 'Product Management'}
            </span>
            <h1 className="text-3xl md:text-4xl uppercase tracking-tighter font-light leading-none text-white">
              {id ? (selectedProduct ? 'Edit Product' : 'Add Product') : 'Products'}
              <span className="italic font-serif text-pink-300 lowercase tracking-normal ml-2">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-3">
              {id ? 'Update product details' : 'Manage your product catalog'}
            </p>
          </div>
          
          {!id && !showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setSelectedProduct(null);
              }}
              className="group relative px-8 py-3 overflow-hidden border border-white text-[9px] uppercase tracking-[0.4em] text-white bg-transparent transition-all duration-700"
            >
              <motion.div
                className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                whileHover={{ width: '100%' }}
              />
              <span className="relative z-10 group-hover:text-black transition-colors duration-700">
                + Add New Product
              </span>
            </button>
          )}
        </header>

        {showForm || id ? (
          <div className="max-w-4xl mx-auto">
            <div className="border border-white/5 bg-black/80 backdrop-blur-sm p-8 mb-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium text-pink-300">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedProduct(null);
                    window.history.back();
                  }}
                  className="group relative px-4 py-2 overflow-hidden border border-white/20 text-[9px] uppercase tracking-[0.3em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40"
                >
                  <motion.div
                    className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
                    whileHover={{ width: '100%' }}
                  />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                    Cancel
                  </span>
                </button>
              </div>
              
              <ProductForm
                product={selectedProduct}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Stats – Noir Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Total Products', value: products.length, color: 'text-white' },
                { label: 'In Stock', value: products.filter(p => p.stockQuantity > 0).length, color: 'text-white' },
                { label: 'Featured', value: products.filter(p => p.isFeatured).length, color: 'text-white' },
                { label: 'Low Stock (<10)', value: products.filter(p => p.stockQuantity < 10).length, color: 'text-red-400' }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-black/80 backdrop-blur-sm border border-white/5 p-6"
                >
                  <p className="text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-light tracking-tight ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Products Table */}
            <div className="border border-white/5 bg-black/80 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/5 bg-black/40">
                    <tr>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Code
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const stockStatus = 
                          product.stockQuantity > 10 ? 'text-green-400' :
                          product.stockQuantity > 0 ? 'text-yellow-400' :
                          'text-red-400';
                        
                        return (
                          <tr key={product.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 border border-white/10 overflow-hidden bg-black/40 flex-shrink-0">
                                  <img
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover grayscale opacity-80"
                                    onError={(e) => { e.target.src = '/images/placeholder-product.jpg'; }}
                                  />
                                </div>
                                <div>
                                  <p className="text-[11px] uppercase tracking-wider text-white/90">
                                    {product.name}
                                  </p>
                                  <p className="text-[9px] uppercase tracking-widest text-neutral-500 truncate max-w-xs mt-0.5">
                                    {product.shortDescription}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] uppercase tracking-wider font-mono text-pink-300 bg-pink-400/10 px-2 py-1 border border-pink-400/20">
                                {product.productCode}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[13px] tracking-widest font-light text-white">
                                ₦{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <p className="text-[9px] tracking-wider text-neutral-500 line-through mt-0.5">
                                  ₦{product.originalPrice.toLocaleString()}
                                </p>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.replace('text', 'bg')}`} />
                                <span className={`text-[9px] uppercase tracking-[0.2em] ${stockStatus}`}>
                                  {product.stockQuantity} units
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                {product.isFeatured && (
                                  <div className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-blue-400" />
                                    <span className="text-[8px] uppercase tracking-[0.2em] text-blue-400">Featured</span>
                                  </div>
                                )}
                                {product.isBestSeller && (
                                  <div className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-yellow-400" />
                                    <span className="text-[8px] uppercase tracking-[0.2em] text-yellow-400">Best Seller</span>
                                  </div>
                                )}
                                {product.isOnSale && (
                                  <div className="flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-pink-400" />
                                    <span className="text-[8px] uppercase tracking-[0.2em] text-pink-400">Sale</span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/admin/products/${product.id}`}
                                  className="group relative px-3 py-1.5 overflow-hidden border border-white/20 text-[9px] uppercase tracking-[0.3em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40"
                                >
                                  <motion.div
                                    className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
                                    whileHover={{ width: '100%' }}
                                  />
                                  <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                                    Edit
                                  </span>
                                </Link>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="group relative px-3 py-1.5 overflow-hidden border border-white/20 text-[9px] uppercase tracking-[0.3em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40"
                                >
                                  <motion.div
                                    className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
                                    whileHover={{ width: '100%' }}
                                  />
                                  <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                                    Delete
                                  </span>
                                </button>
                                <Link
                                  to={`/product/${product.id}`}
                                  target="_blank"
                                  className="group relative px-3 py-1.5 overflow-hidden border border-white/20 text-[9px] uppercase tracking-[0.3em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40"
                                >
                                  <motion.div
                                    className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
                                    whileHover={{ width: '100%' }}
                                  />
                                  <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                                    View
                                  </span>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600">
            mamusca enterprise — product administration
          </p>
        </footer>
      </div>
    </AdminRoute>
  );
};

export default Products;