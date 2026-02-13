import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { nigerianStates } from '../../utils/constants';

const CheckoutForm = ({ onSubmit, loading }) => {
  const { promoCode } = useCart();
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      state: '',
      city: '',
      instructions: '',
      promoCode: '',
    },
  });

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPromoLoading(false);
      setPromoCodeInput('');
      setShowPromoCode(false);
    }, 1000);
  };

  return (
    <div className="w-full antialiased">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        
        {/* === SECTION 1: IDENTITY === */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-8 flex items-center text-pink-300">
            <span className="mr-4 text-white/40 font-serif italic">01</span> Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            
            {/* Full Name */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
                Full Name <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                className={`w-full bg-transparent border-b ${
                  errors.fullName ? 'border-pink-400' : 'border-white/10'
                } py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
                placeholder="JEAN DOE"
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
                Email <span className="text-pink-400">*</span>
              </label>
              <input
                type="email"
                className={`w-full bg-transparent border-b ${
                  errors.email ? 'border-pink-400' : 'border-white/10'
                } py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
                placeholder="EMAIL@EXAMPLE.COM"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email',
                  },
                })}
              />
              {errors.email && (
                <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
                Telephone <span className="text-pink-400">*</span>
              </label>
              <input
                type="tel"
                className={`w-full bg-transparent border-b ${
                  errors.phone ? 'border-pink-400' : 'border-white/10'
                } py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors`}
                placeholder="080 0000 0000"
                {...register('phone', {
                  required: 'Phone number is required',
                  minLength: {
                    value: 10,
                    message: 'Minimum 10 digits',
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* === SECTION 2: LOGISTICS === */}
        <section>
          <h3 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-8 flex items-center text-pink-300">
            <span className="mr-4 text-white/40 font-serif italic">02</span> Logistics
          </h3>
          <div className="space-y-10">
            
            {/* Address */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
                Address <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                className={`w-full bg-transparent border-b ${
                  errors.address ? 'border-pink-400' : 'border-white/10'
                } py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
                placeholder="STREET, APARTMENT, SUITE"
                {...register('address', { required: 'Address is required' })}
              />
              {errors.address && (
                <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* State & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
                  State <span className="text-pink-400">*</span>
                </label>
                <select
                  className={`w-full bg-transparent border-b ${
                    errors.state ? 'border-pink-400' : 'border-white/10'
                  } py-3 text-sm text-white focus:border-pink-400 focus:outline-none transition-colors uppercase appearance-none`}
                  {...register('state', { required: 'State is required' })}
                >
                  <option value="" className="bg-black text-white/60">SELECT</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state} className="bg-black text-white">
                      {state.toUpperCase()}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
                  City <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full bg-transparent border-b ${
                    errors.city ? 'border-pink-400' : 'border-white/10'
                  } py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
                  placeholder="LAGOS"
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && (
                  <p className="mt-2 text-[9px] uppercase tracking-wider text-pink-400">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Instructions */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-400 mb-2">
                Delivery Instructions <span className="text-neutral-600">(optional)</span>
              </label>
              <textarea
                rows={2}
                className="w-full bg-transparent border-b border-white/10 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors resize-none uppercase"
                placeholder="GATE CODE, LANDMARK, ETC."
                {...register('instructions')}
              />
            </div>
          </div>
        </section>

        {/* === PROMO CODE === */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setShowPromoCode(!showPromoCode)}
            className="text-[10px] uppercase tracking-[0.3em] flex items-center group"
          >
            <span className="border-b border-white/20 group-hover:border-pink-400 transition-colors text-neutral-400 group-hover:text-white">
              {promoCode ? 'Promo Applied' : 'Have a promo code?'}
            </span>
          </button>
          
          <AnimatePresence>
            {showPromoCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-6"
              >
                <div className="flex gap-4 border-b border-white/10 pb-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="ENTER CODE"
                    className="flex-1 bg-transparent text-[11px] uppercase tracking-widest text-white placeholder:text-neutral-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-pink-300 hover:text-pink-200 transition-colors"
                    disabled={promoLoading}
                  >
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === SUBMIT BUTTON === */}
        <div className="pt-10">
          <Button
            type="submit"
            loading={loading}
            className="w-full h-16 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-pink-400 transition-all duration-500 disabled:bg-neutral-800 disabled:text-neutral-600"
          >
            Continue to payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;