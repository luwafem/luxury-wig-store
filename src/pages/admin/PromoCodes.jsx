import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminRoute from '../../components/admin/AdminRoute';
import PromoCodeForm from '../../components/admin/PromoCodeForm';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

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
      // Mock data - in production, fetch from Firebase
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
      // Mock data - in production, fetch from Firebase
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
        // In production, delete from Firebase
        setPromoCodes(promoCodes.filter(p => p.id !== promoId));
      } catch (error) {
        console.error('Error deleting promo code:', error);
      }
    }
  };

  const togglePromoCodeStatus = async (promoId, currentStatus) => {
    try {
      // In production, update in Firebase
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
      // Update existing promo code
      setPromoCodes(promoCodes.map(p => 
        p.id === selectedPromoCode.id ? { ...promoData, id: selectedPromoCode.id } : p
      ));
    } else {
      // Add new promo code
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

  const getStatusBadge = (promo) => {
    const now = new Date();
    const expiryDate = promo.expiryDate ? new Date(promo.expiryDate) : null;

    if (!promo.isActive) {
      return { text: 'Inactive', color: 'bg-red-100 text-red-800' };
    }

    if (expiryDate && expiryDate < now) {
      return { text: 'Expired', color: 'bg-gray-100 text-gray-800' };
    }

    if (promo.maxUsage && promo.usedCount >= promo.maxUsage) {
      return { text: 'Usage Limit Reached', color: 'bg-yellow-100 text-yellow-800' };
    }

    return { text: 'Active', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="lg" />
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
              {id ? (selectedPromoCode ? 'Edit Promo Code' : 'Add Promo Code') : 'Promo Code Management'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Update discount code details' : 'Create and manage discount codes'}
            </p>
          </div>
          
          {!id && !showForm && (
            <Button
              variant="primary"
              onClick={() => {
                setShowForm(true);
                setSelectedPromoCode(null);
              }}
            >
              + Create Promo Code
            </Button>
          )}
        </div>

        {showForm || id ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPromoCode ? 'Edit Promo Code' : 'Create New Promo Code'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedPromoCode(null);
                    window.history.back();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
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
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">Total Promo Codes</p>
                <p className="text-2xl font-bold">{promoCodes.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">Active Codes</p>
                <p className="text-2xl font-bold text-green-600">
                  {promoCodes.filter(p => p.isActive).length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">
                  {promoCodes.reduce((sum, p) => sum + (p.usedCount || 0), 0)}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-sm text-gray-600">Expired Soon</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {promoCodes.filter(p => {
                    if (!p.expiryDate) return false;
                    const expiry = new Date(p.expiryDate);
                    const now = new Date();
                    const thirtyDaysFromNow = new Date(now.setDate(now.getDate() + 30));
                    return expiry > now && expiry < thirtyDaysFromNow;
                  }).length}
                </p>
              </div>
            </div>

            {/* Promo Codes Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promo Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {promoCodes.map((promo) => {
                      const status = getStatusBadge(promo);
                      return (
                        <tr key={promo.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-mono font-bold">{promo.code}</div>
                            <div className="text-sm text-gray-500">
                              Created: {new Date(promo.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium">
                              {promo.discountType === 'percentage' 
                                ? `${promo.discountValue}%` 
                                : `₦${promo.discountValue.toLocaleString()}`}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {promo.minOrderAmount > 0 
                              ? `₦${promo.minOrderAmount.toLocaleString()}` 
                              : 'No minimum'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <p>Used: {promo.usedCount || 0}</p>
                              <p>Limit: {promo.maxUsage || 'Unlimited'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {promo.expiryDate 
                              ? new Date(promo.expiryDate).toLocaleDateString()
                              : 'No expiry'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Link
                                to={`/admin/promo-codes/${promo.id}`}
                                className="px-3 py-1 text-sm bg-primary-50 text-primary-700 rounded hover:bg-primary-100"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => togglePromoCodeStatus(promo.id, promo.isActive)}
                                className={`px-3 py-1 text-sm rounded ${
                                  promo.isActive
                                    ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                              >
                                {promo.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(promo.id)}
                                className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="p-4 bg-white border border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 text-center"
                >
                  <span className="text-2xl mb-2 block">➕</span>
                  <p className="font-medium">Create New Code</p>
                  <p className="text-sm text-gray-600">Add a discount code</p>
                </button>
                
                <button className="p-4 bg-white border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 text-center">
                  <span className="text-2xl mb-2 block">📊</span>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-gray-600">See promo code performance</p>
                </button>
                
                <button className="p-4 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center">
                  <span className="text-2xl mb-2 block">📋</span>
                  <p className="font-medium">Export Codes</p>
                  <p className="text-sm text-gray-600">Download as CSV</p>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminRoute>
  );
};

export default PromoCodes;