import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminRoute from '../../components/admin/AdminRoute';
import PromoCodeForm from '../../components/admin/PromoCodeForm';

const PromoCodes = () => {
  const { id } = useParams();
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(!!id);
  const [selectedPromoCode, setSelectedPromoCode] = useState(null);

  useEffect(() => {
    if (!id) {
      fetchPromoCodes();
    } else {
      fetchPromoCode(id);
    }
  }, [id]);

  const fetchPromoCodes = async () => {
    try {
      // Mock data – in production, fetch from Firebase
      const mockPromoCodes = [
        {
          id: '1',
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          minOrderAmount: 0,
          maxUsage: 100,
          usedCount: 42,
          expiryDate: new Date('2024-12-31'),
          isActive: true,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          code: 'SAVE5000',
          discountType: 'fixed',
          discountValue: 5000,
          minOrderAmount: 20000,
          maxUsage: 50,
          usedCount: 18,
          expiryDate: new Date('2024-06-30'),
          isActive: true,
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '3',
          code: 'LUXURY20',
          discountType: 'percentage',
          discountValue: 20,
          minOrderAmount: 50000,
          maxUsage: null,
          usedCount: 7,
          expiryDate: new Date('2024-03-31'),
          isActive: false,
          createdAt: new Date('2024-02-01'),
        },
      ];

      setPromoCodes(mockPromoCodes);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromoCode = async (promoId) => {
    try {
      // Mock data – in production, fetch from Firebase
      const mockPromoCode = {
        id: promoId,
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 0,
        maxUsage: 100,
        usedCount: 42,
        expiryDate: new Date('2024-12-31'),
        isActive: true,
        createdAt: new Date('2024-01-01'),
      };

      setSelectedPromoCode(mockPromoCode);
    } catch (error) {
      console.error('Error fetching promo code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (promoId) => {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      try {
        setPromoCodes(promoCodes.filter(p => p.id !== promoId));
      } catch (error) {
        console.error('Error deleting promo code:', error);
      }
    }
  };

  const togglePromoCodeStatus = async (promoId, currentStatus) => {
    try {
      const updatedPromoCodes = promoCodes.map(promo => 
        promo.id === promoId 
          ? { ...promo, isActive: !currentStatus }
          : promo
      );
      setPromoCodes(updatedPromoCodes);
    } catch (error) {
      console.error('Error updating promo code:', error);
    }
  };

  const handleFormSuccess = (promoData) => {
    if (selectedPromoCode) {
      setPromoCodes(promoCodes.map(p => 
        p.id === selectedPromoCode.id ? { ...promoData, id: selectedPromoCode.id } : p
      ));
    } else {
      const newPromo = {
        ...promoData,
        id: Date.now().toString(),
        usedCount: 0,
        createdAt: new Date(),
      };
      setPromoCodes([newPromo, ...promoCodes]);
    }
    
    setShowForm(false);
    setSelectedPromoCode(null);
  };

  const getStatusStyle = (promo) => {
    const now = new Date();
    const expiryDate = promo.expiryDate ? new Date(promo.expiryDate) : null;

    if (!promo.isActive) {
      return { text: 'Inactive', color: 'text-red-400', dot: 'bg-red-400' };
    }

    if (expiryDate && expiryDate < now) {
      return { text: 'Expired', color: 'text-neutral-400', dot: 'bg-neutral-400' };
    }

    if (promo.maxUsage && promo.usedCount >= promo.maxUsage) {
      return { text: 'Limit Reached', color: 'text-yellow-400', dot: 'bg-yellow-400' };
    }

    return { text: 'Active', color: 'text-green-400', dot: 'bg-green-400' };
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
              {id ? (selectedPromoCode ? 'Edit Promo Code' : 'Add Promo Code') : 'Promo Code Management'}
            </span>
            <h1 className="text-3xl md:text-4xl uppercase tracking-tighter font-light leading-none text-white">
              {id ? (selectedPromoCode ? 'Edit Code' : 'Add Code') : 'Promo Codes'}
              <span className="italic font-serif text-pink-300 lowercase tracking-normal ml-2">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-3">
              {id ? 'Update discount code details' : 'Create and manage discount codes'}
            </p>
          </div>
          
          {!id && !showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setSelectedPromoCode(null);
              }}
              className="group relative px-8 py-3 overflow-hidden border border-white text-[9px] uppercase tracking-[0.4em] text-white bg-transparent transition-all duration-700"
            >
              <motion.div
                className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
                whileHover={{ width: '100%' }}
              />
              <span className="relative z-10 group-hover:text-black transition-colors duration-700">
                + Create Promo Code
              </span>
            </button>
          )}
        </header>

        {showForm || id ? (
          <div className="max-w-2xl mx-auto">
            <div className="border border-white/5 bg-black/80 backdrop-blur-sm p-8 mb-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium text-pink-300">
                  {selectedPromoCode ? 'Edit Promo Code' : 'Create New Promo Code'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedPromoCode(null);
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
              
              <PromoCodeForm
                promoCode={selectedPromoCode}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Stats – Noir Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Total Codes', value: promoCodes.length, color: 'text-white' },
                { label: 'Active Codes', value: promoCodes.filter(p => p.isActive).length, color: 'text-green-400' },
                { label: 'Total Usage', value: promoCodes.reduce((sum, p) => sum + (p.usedCount || 0), 0), color: 'text-white' },
                { label: 'Expiring Soon', value: promoCodes.filter(p => {
                    if (!p.expiryDate) return false;
                    const expiry = new Date(p.expiryDate);
                    const now = new Date();
                    const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));
                    return expiry > now && expiry < thirtyDaysFromNow;
                  }).length, color: 'text-yellow-400' }
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

            {/* Promo Codes Table */}
            <div className="border border-white/5 bg-black/80 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/5 bg-black/40">
                    <tr>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Promo Code
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Discount
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Min Order
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Usage
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Expiry
                      </th>
                      <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {promoCodes.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                          No promo codes found.
                        </td>
                      </tr>
                    ) : (
                      promoCodes.map((promo) => {
                        const status = getStatusStyle(promo);
                        return (
                          <tr key={promo.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-mono text-[11px] uppercase tracking-wider text-pink-300">
                                {promo.code}
                              </div>
                              <p className="text-[8px] uppercase tracking-widest text-neutral-500 mt-1">
                                Created: {new Date(promo.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[11px] uppercase tracking-wider text-white/90">
                                {promo.discountType === 'percentage' 
                                  ? `${promo.discountValue}%` 
                                  : `₦${promo.discountValue.toLocaleString()}`}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                                {promo.minOrderAmount > 0 
                                  ? `₦${promo.minOrderAmount.toLocaleString()}` 
                                  : 'No minimum'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-[10px] uppercase tracking-wider text-white/80">
                                Used: {promo.usedCount || 0}
                              </p>
                              <p className="text-[9px] uppercase tracking-widest text-neutral-500">
                                Limit: {promo.maxUsage || 'Unlimited'}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                <span className={`text-[9px] uppercase tracking-[0.2em] ${status.color}`}>
                                  {status.text}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                                {promo.expiryDate 
                                  ? new Date(promo.expiryDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
                                  : 'No expiry'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/admin/promo-codes/${promo.id}`}
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
                                  onClick={() => togglePromoCodeStatus(promo.id, promo.isActive)}
                                  className={`group relative px-3 py-1.5 overflow-hidden border ${
                                    promo.isActive
                                      ? 'border-yellow-400/30 text-yellow-400 hover:border-yellow-400/50'
                                      : 'border-green-400/30 text-green-400 hover:border-green-400/50'
                                  } text-[9px] uppercase tracking-[0.3em] bg-transparent transition-all duration-700`}
                                >
                                  <motion.div
                                    className={`absolute inset-0 w-0 ${
                                      promo.isActive
                                        ? 'bg-yellow-400/10'
                                        : 'bg-green-400/10'
                                    } transition-all duration-700 ease-out group-hover:w-full`}
                                    whileHover={{ width: '100%' }}
                                  />
                                  <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                                    {promo.isActive ? 'Deactivate' : 'Activate'}
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleDelete(promo.id)}
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

            {/* Quick Actions – Noir Cards */}
            <div className="mt-12 border border-white/5 bg-black/80 backdrop-blur-sm p-8">
              <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-6 text-pink-300">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative p-6 overflow-hidden border border-white/5 hover:border-pink-400/30 transition-all duration-500 bg-black/40 flex flex-col items-center"
                >
                  <span className="text-2xl mb-3 text-neutral-400 group-hover:text-pink-300 transition-colors">➕</span>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white mb-1">
                    Create New Code
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500">
                    Add a discount code
                  </p>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-pink-400/0 group-hover:bg-pink-400/50 transition-all duration-500" />
                </button>
                
                <button className="group relative p-6 overflow-hidden border border-white/5 hover:border-pink-400/30 transition-all duration-500 bg-black/40 flex flex-col items-center">
                  <span className="text-2xl mb-3 text-neutral-400 group-hover:text-pink-300 transition-colors">📊</span>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white mb-1">
                    View Analytics
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500">
                    See promo code performance
                  </p>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-pink-400/0 group-hover:bg-pink-400/50 transition-all duration-500" />
                </button>
                
                <button className="group relative p-6 overflow-hidden border border-white/5 hover:border-pink-400/30 transition-all duration-500 bg-black/40 flex flex-col items-center">
                  <span className="text-2xl mb-3 text-neutral-400 group-hover:text-pink-300 transition-colors">📋</span>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white mb-1">
                    Export Codes
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-neutral-500">
                    Download as CSV
                  </p>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-pink-400/0 group-hover:bg-pink-400/50 transition-all duration-500" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] uppercase tracking-[0.6em] text-neutral-600">
            mamusca enterprise — promo code administration
          </p>
        </footer>
      </div>
    </AdminRoute>
  );
};

export default PromoCodes;