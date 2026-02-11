import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../../services/firebase';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  // Function to scroll to sections (for dashboard pages)
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Account for both headers: main header (64px) + admin header (56px) + some padding
      const offset = 120; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Admin navigation items
  const adminNavItems = [
    { path: '/admin/', label: 'Dashboard', icon: '📊' },
    { path: '/admin/orders', label: 'Orders', icon: '📦' },
    { path: '/admin/products', label: 'Products', icon: '🛍️' },
    { path: '/admin/promo-codes', label: 'Promo Codes', icon: '🎟️' },
  ];

  // Dashboard navigation items (only for dashboard page)
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
      // Check if user is logged in via Firebase
      const user = authService.getCurrentUser();
      
      if (user) {
        // You can add additional admin role checks here
        // For now, any authenticated user can access admin
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const isDashboardPage = location.pathname === '/admin/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Admin Header - Fixed position */}
      <header className="fixed top-16 left-0 right-0 z-40 bg-white border-b shadow-sm">
        <div className="px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            {/* Left side: Page title and admin navigation */}
            <div className="flex items-center space-x-4">
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                Admin Panel
              </h1>
              <span className="hidden md:inline text-gray-400">|</span>
              
              {/* Admin Navigation Links */}
              <div className="hidden md:flex items-center space-x-4">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary-600'
                        : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Right side: Date and user actions */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-NG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.location.href = '/'}
                  className="text-sm text-gray-600 hover:text-primary-600 font-medium"
                >
                  View Site
                </button>
                
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Admin Navigation */}
          <div className="mt-2 md:hidden">
            <div className="flex overflow-x-auto space-x-4 pb-1 scrollbar-hide">
              {adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 text-xs font-medium whitespace-nowrap px-2 py-1 rounded ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Dashboard-specific navigation (only on dashboard page) */}
          {isDashboardPage && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h2 className="text-md font-semibold text-gray-900">Dashboard Sections</h2>
                </div>
                
                {/* Dashboard Navigation Tabs */}
                <div className="flex overflow-x-auto pb-1 scrollbar-hide">
                  <div className="flex space-x-1">
                    {dashboardNavItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content with padding to account for both headers */}
      <main className="pt-32 pb-6 px-6">
        {children}
      </main>
    </div>
  );
};

export default AdminRoute;