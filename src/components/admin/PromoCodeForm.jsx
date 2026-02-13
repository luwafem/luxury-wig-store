import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const PromoCodeForm = ({ promoCode, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: promoCode || {
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      maxUsage: null,
      expiryDate: '',
      isActive: true,
    }
  });

  const discountType = watch('discountType');

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const promoData = {
        ...data,
        code: data.code.toUpperCase(),
        discountValue: parseFloat(data.discountValue),
        minOrderAmount: parseFloat(data.minOrderAmount) || 0,
        maxUsage: data.maxUsage ? parseInt(data.maxUsage) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        usedCount: promoCode?.usedCount || 0,
        createdAt: promoCode?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      console.log('Promo code data:', promoData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess(promoData);
    } catch (error) {
      console.error('Error saving promo code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Promo Code */}
      <div>
        <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
          Promo Code <span className="text-pink-400">*</span>
        </label>
        <input
          type="text"
          className={`w-full bg-transparent border ${
            errors.code ? 'border-pink-400' : 'border-white/10'
          } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
          placeholder="WELCOME10"
          {...register('code', {
            required: 'Promo code is required',
            pattern: {
              value: /^[A-Z0-9]{3,20}$/,
              message: 'Use 3-20 uppercase letters or numbers'
            }
          })}
        />
        {errors.code && (
          <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
            {errors.code.message}
          </p>
        )}
        <p className="mt-2 text-[8px] uppercase tracking-widest text-neutral-600">
          Customers will enter this code at checkout
        </p>
      </div>

      {/* Discount Type & Value */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-3">
            Discount Type
          </label>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 group">
              <input
                type="radio"
                value="percentage"
                {...register('discountType')}
                className="w-4 h-4 bg-transparent border border-white/20 checked:bg-pink-400 checked:border-pink-400 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
              />
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors">
                Percentage (%)
              </span>
            </label>
            <label className="flex items-center space-x-3 group">
              <input
                type="radio"
                value="fixed"
                {...register('discountType')}
                className="w-4 h-4 bg-transparent border border-white/20 checked:bg-pink-400 checked:border-pink-400 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
              />
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors">
                Fixed Amount (₦)
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
            {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₦)'} <span className="text-pink-400">*</span>
          </label>
          <input
            type="number"
            step={discountType === 'percentage' ? '0.1' : '1'}
            className={`w-full bg-transparent border ${
              errors.discountValue ? 'border-pink-400' : 'border-white/10'
            } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
            placeholder={discountType === 'percentage' ? '10' : '5000'}
            {...register('discountValue', {
              required: 'Discount value is required',
              min: { value: 0, message: 'Must be positive' },
              max: discountType === 'percentage' 
                ? { value: 100, message: 'Cannot exceed 100%' }
                : undefined
            })}
          />
          {errors.discountValue && (
            <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
              {errors.discountValue.message}
            </p>
          )}
        </div>
      </div>

      {/* Minimum Order Amount */}
      <div>
        <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
          Minimum Order Amount (₦)
        </label>
        <input
          type="number"
          step="1"
          min="0"
          className={`w-full bg-transparent border ${
            errors.minOrderAmount ? 'border-pink-400' : 'border-white/10'
          } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
          placeholder="0"
          {...register('minOrderAmount', {
            min: { value: 0, message: 'Must be positive' }
          })}
        />
        {errors.minOrderAmount && (
          <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
            {errors.minOrderAmount.message}
          </p>
        )}
        <p className="mt-2 text-[8px] uppercase tracking-widest text-neutral-600">
          Set 0 for no minimum
        </p>
      </div>

      {/* Maximum Usage Limit */}
      <div>
        <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
          Maximum Usage Limit
        </label>
        <input
          type="number"
          step="1"
          min="1"
          className={`w-full bg-transparent border ${
            errors.maxUsage ? 'border-pink-400' : 'border-white/10'
          } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
          placeholder="UNLIMITED"
          {...register('maxUsage', {
            min: { value: 1, message: 'Must be at least 1' }
          })}
        />
        {errors.maxUsage && (
          <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
            {errors.maxUsage.message}
          </p>
        )}
        <p className="mt-2 text-[8px] uppercase tracking-widest text-neutral-600">
          Leave empty for unlimited usage
        </p>
      </div>

      {/* Expiry Date */}
      <div>
        <label className="block text-[9px] uppercase tracking-[0.4em] text-neutral-500 mb-2">
          Expiry Date
        </label>
        <input
          type="date"
          className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase"
          min={new Date().toISOString().split('T')[0]}
          {...register('expiryDate')}
        />
        <p className="mt-2 text-[8px] uppercase tracking-widest text-neutral-600">
          Leave empty for no expiry
        </p>
      </div>

      {/* Active Checkbox */}
      <div>
        <label className="flex items-center space-x-3 group">
          <input
            type="checkbox"
            {...register('isActive')}
            className="w-4 h-4 bg-transparent border border-white/20 checked:bg-pink-400 checked:border-pink-400 focus:ring-0 focus:ring-offset-0 focus:outline-none transition-colors"
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 group-hover:text-white transition-colors">
            Active (promo code can be used)
          </span>
        </label>
      </div>

      {/* Preview – Noir Card */}
      <div className="pt-6 border-t border-white/5">
        <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium text-pink-300 mb-6">
          Preview
        </h3>
        <div className="border border-white/5 bg-black/80 backdrop-blur-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-mono text-[13px] uppercase tracking-wider text-pink-300">
                {watch('code') || 'YOURCODE'}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-1">
                {watch('discountType') === 'percentage' 
                  ? `${watch('discountValue') || 0}% OFF` 
                  : `₦${(watch('discountValue') || 0).toLocaleString()} OFF`}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">
                Min. order: ₦{(watch('minOrderAmount') || 0).toLocaleString()}
              </p>
              {watch('expiryDate') && (
                <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 mt-1">
                  Expires: {new Date(watch('expiryDate')).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button – Magnetic Style */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full h-14 overflow-hidden border border-white text-[10px] uppercase tracking-[0.4em] font-bold text-white bg-transparent transition-all duration-700 disabled:opacity-50"
        >
          <motion.div
            className="absolute inset-0 w-0 bg-white transition-all duration-700 ease-out group-hover:w-full"
            whileHover={{ width: '100%' }}
          />
          <span className="relative z-10 group-hover:text-black transition-colors duration-700">
            {loading ? 'Processing...' : promoCode ? 'Update Promo Code' : 'Create Promo Code'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default PromoCodeForm;