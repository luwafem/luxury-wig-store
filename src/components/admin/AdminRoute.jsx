import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/firebase';

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // ⬆︎ Increased offset to account for both fixed headers
      const offset = 180; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const adminNavItems = [
    { path: '/admin/', label: 'Dashboard', icon: '📊' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/products', label: 'Products', icon: '🛍️' },
    { path: '/admin/promo-codes', label: 'Promo Codes', icon: '🎟️' },
  ];

  const dashboardNavItems = [
    { id: 'stats', label: 'Stats Overview', icon: '📊' },
    { id: 'recent-orders', label: 'Recent Orders', icon: '📦' },
    { id: 'quick-actions', label: 'Quick Actions', icon: '⚡' },
    { id: 'business-info', label: 'Business Info', icon: '🏢' },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = authService.getCurrentUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border border-pink-500/30 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const isDashboardPage = location.pathname === '/admin/dashboard';

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* Fixed Admin Header – Noir */}
      {/* ⬇︎ Now sits below main website header (top-0 → top-[96px]) */}
      <header className="fixed top-[96px] left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            
            {/* Left: Brand & Navigation */}
            <div className="flex items-center space-x-6">
              <h1 className="text-base md:text-lg uppercase tracking-[0.4em] font-light text-white">
                Atelier<span className="italic font-serif text-pink-300 lowercase tracking-normal ml-1">.</span>
              </h1>
              
              <span className="hidden md:inline text-white/10">|</span>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 border-b ${
                      location.pathname === item.path
                        ? 'border-pink-400 text-white'
                        : 'border-transparent text-neutral-500 hover:text-white hover:border-pink-400/50'
                    }`}
                  >
                    <span className="mr-2 text-sm">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Date & Actions */}
            <div className="flex items-center gap-6">
              <span className="hidden md:block text-[9px] uppercase tracking-[0.4em] text-neutral-500">
                {new Date().toLocaleDateString('en-NG', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors border-b border-transparent hover:border-pink-400 pb-0.5"
                >
                  View Site
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 hover:text-pink-400 transition-colors border-b border-transparent hover:border-pink-400 pb-0.5"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="mt-3 md:hidden overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex items-center space-x-6">
              {adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[9px] uppercase tracking-[0.3em] whitespace-nowrap transition-colors border-b ${
                    location.pathname === item.path
                      ? 'border-pink-400 text-white'
                      : 'border-transparent text-neutral-500 hover:text-white hover:border-pink-400/50'
                  }`}
                >
                  <span className="mr-1 text-sm">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Dashboard Section Navigation – Minimal, Pink Underline */}
          {isDashboardPage && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <span className="text-[9px] uppercase tracking-[0.6em] text-pink-400/70">
                  Dashboard Sections
                </span>
                
                <div className="flex overflow-x-auto pb-1 scrollbar-hide">
                  <div className="flex items-center space-x-6">
                    {dashboardNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="group flex items-center gap-1 text-[9px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors border-b border-transparent hover:border-pink-400 pb-0.5"
                      >
                        <span className="text-sm text-neutral-400 group-hover:text-pink-300 transition-colors">
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content – Increased top padding to clear both headers */}
      <main className="pt-56 pb-12 px-6">
        {children}
      </main>
    </div>
  );
};

export default AdminRoute;