import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Policies from './pages/Policies';
import InstagramFeed from './pages/InstagramFeed';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import AdminLogin from './pages/admin/Login';
import Orders from './pages/admin/Orders';
import PromoCodes from './pages/admin/PromoCodes';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <Router>
              <div className="App">
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/policies" element={<Policies />} />
                    <Route path="/instagram" element={<InstagramFeed />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/products" element={<Products />} />
                    <Route path="/admin/products/new" element={<Products />} />
                    <Route path="/admin/products/:id" element={<Products />} />
                    <Route path="/admin/orders" element={<Orders />} />
                    <Route path="/admin/orders/:id" element={<Orders />} />
                    <Route path="/admin/promo-codes" element={<PromoCodes />} />
                    <Route path="/admin/promo-codes/new" element={<PromoCodes />} />
                    <Route path="/admin/promo-codes/:id" element={<PromoCodes />} />
                  </Routes>
                </Layout>
                
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div>
            </Router>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;