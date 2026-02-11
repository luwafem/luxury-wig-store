import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminRoute from '../../components/admin/AdminRoute';
import ProductForm from '../../components/admin/ProductForm';
import Button from '../../components/common/Button';
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
      // Update existing product in list
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
    } else {
      // Add new product to list
      setProducts([updatedProduct, ...products]);
    }
    setShowForm(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="flex justify-center items-center min-h-96">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? (selectedProduct ? 'Edit Product' : 'Add Product') : 'Product Management'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Update product details' : 'Manage your product catalog'}
            </p>
          </div>
          
          {!id && !showForm && (
            <Button
              variant="primary"
              onClick={() => {
                setShowForm(true);
                setSelectedProduct(null);
              }}
            >
              + Add New Product
            </Button>
          )}
        </div>

        {showForm || id ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedProduct(null);
                    window.history.back();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
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
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.stockQuantity > 0).length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.isFeatured).length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">Low Stock (less than 10)</p>
                <p className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.stockQuantity < 10).length}
                </p>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 mr-4">
                              <img
                                src={product.images?.[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-500 truncate max-w-xs">
                                {product.shortDescription}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {product.productCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold">
                            ₦{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ₦{product.originalPrice.toLocaleString()}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.stockQuantity > 10 ? 'bg-green-100 text-green-800' :
                            product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stockQuantity} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {product.isFeatured && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                Featured
                              </span>
                            )}
                            {product.isBestSeller && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                Best Seller
                              </span>
                            )}
                            {product.isOnSale && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                Sale
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Link
                              to={`/admin/products/${product.id}`}
                              className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded hover:bg-primary-100"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
                            >
                              Delete
                            </button>
                            <Link
                              to={`/product/${product.id}`}
                              target="_blank"
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminRoute>
  );
};

export default Products;