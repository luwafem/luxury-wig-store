import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
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
    setTimeout(() => {
      setPromoLoading(false);
      setPromoCodeInput('');
      setShowPromoCode(false);
    }, 1000);
  };

  return (
    <div className="w-full antialiased">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        
        {/* === SECTION 1: IDENTITY === */}
        <section>
          <h2 className="text-[11px] uppercase tracking-[0.5em] font-medium mb-8 flex items-center text-pink-300">
            <span className="mr-4 text-white/40 font-serif italic">01</span> Shipping Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                Full Name <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                className={`w-full bg-transparent border ${
                  errors.fullName ? 'border-pink-400' : 'border-white/10'
                } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
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
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                Email <span className="text-pink-400">*</span>
              </label>
              <input
                type="email"
                className={`w-full bg-transparent border ${
                  errors.email ? 'border-pink-400' : 'border-white/10'
                } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
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
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                Telephone <span className="text-pink-400">*</span>
              </label>
              <input
                type="tel"
                className={`w-full bg-transparent border ${
                  errors.phone ? 'border-pink-400' : 'border-white/10'
                } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
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
          <div className="space-y-6">
            
            {/* Address */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                Address <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                className={`w-full bg-transparent border ${
                  errors.address ? 'border-pink-400' : 'border-white/10'
                } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                  State <span className="text-pink-400">*</span>
                </label>
                <select
                  className={`w-full bg-transparent border ${
                    errors.state ? 'border-pink-400' : 'border-white/10'
                  } px-4 py-3 text-sm text-white focus:border-pink-400 focus:outline-none transition-colors uppercase appearance-none`}
                  {...register('state', { required: 'State is required' })}
                >
                  <option value="" className="bg-black text-neutral-500">SELECT</option>
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
                <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                  City <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full bg-transparent border ${
                    errors.city ? 'border-pink-400' : 'border-white/10'
                  } px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors uppercase`}
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
              <label className="block text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-2">
                Delivery Instructions <span className="text-neutral-600">(optional)</span>
              </label>
              <textarea
                rows={2}
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors resize-none uppercase"
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
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors"
          >
            <span className="border-b border-transparent group-hover:border-pink-400 transition-all">
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
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="ENTER CODE"
                    className="flex-1 bg-transparent border border-white/10 px-4 py-3 text-[11px] uppercase tracking-widest text-white placeholder:text-neutral-700 focus:border-pink-400 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    disabled={promoLoading}
                    className="group relative px-6 py-3 overflow-hidden border border-white/20 text-[10px] uppercase tracking-[0.3em] text-neutral-400 bg-transparent transition-all duration-700 hover:border-white/40 disabled:opacity-50"
                  >
                    <motion.div
                      className="absolute inset-0 w-0 bg-white/10 transition-all duration-700 ease-out group-hover:w-full"
                      whileHover={{ width: '100%' }}
                    />
                    <span className="relative z-10 group-hover:text-white transition-colors duration-700">
                      {promoLoading ? '...' : 'Apply'}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* === SUBMIT BUTTON – MAGNETIC STYLE === */}
        <div className="pt-10">
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full h-16 overflow-hidden border  border-white text-[10px] uppercase tracking-[0.4em] font-bold text-black bg-transparent transition-all duration-700 disabled:opacity-50"
          >
            <motion.div
              className="absolute inset-0 w-0 bg-white hover:bg-black transition-all duration-700 ease-out group-hover:w-full"
              whileHover={{ width: '100%' }}
            />
            <span className="relative z-10 group-hover:text-white  transition-colors duration-700">
              {loading ? 'Processing...' : 'Continue to payment'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;