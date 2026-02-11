import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { nigerianStates } from '../../utils/constants';

const CheckoutForm = ({ onSubmit, loading }) => {
  const { cart, getCartTotal, discount, getGrandTotal, promoCode } = useCart();
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoLoading(true);
    setTimeout(() => {
      setPromoLoading(false);
      setPromoCodeInput('');
    }, 1000);
  };

  return (
    <div className="w-full text-black antialiased">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
        
        {/* Section: Identity */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <Input
              label="Full Name"
              {...register('fullName', { required: 'Full name is required' })}
              error={errors.fullName?.message}
              placeholder="JEAN DOE"
              className="border-b border-black rounded-none px-0 focus:ring-0 uppercase placeholder:text-neutral-300 transition-colors"
            />
            
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
              placeholder="EMAIL@EXAMPLE.COM"
              className="border-b border-black rounded-none px-0 focus:ring-0 uppercase placeholder:text-neutral-300"
            />

            <Input
              label="Telephone"
              type="tel"
              {...register('phone', { required: 'Required' })}
              error={errors.phone?.message}
              placeholder="080 0000 0000"
              className="border-b border-black rounded-none px-0 focus:ring-0"
            />
          </div>
        </section>

        {/* Section: Logistics */}
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-10 text-neutral-400">02. Logistics</h3>
          <div className="space-y-10">
            <Input
              label="Address"
              {...register('address', { required: 'Address is required' })}
              error={errors.address?.message}
              placeholder="STREET, APARTMENT, SUITE"
              className="border-b border-black rounded-none px-0 focus:ring-0 uppercase"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative">
                <label className="text-[9px] uppercase tracking-[0.3em] font-medium mb-2 block">State</label>
                <select
                  className="w-full border-b border-black rounded-none bg-transparent py-3 text-[11px] uppercase tracking-widest focus:outline-none appearance-none"
                  {...register('state', { required: 'State is required' })}
                >
                  <option value="">Select</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state.toUpperCase()}</option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-[9px] uppercase tracking-widest text-red-500">{errors.state.message}</p>}
              </div>

              <Input
                label="City"
                {...register('city', { required: 'City is required' })}
                error={errors.city?.message}
                placeholder="LAGOS"
                className="border-b border-black rounded-none px-0 focus:ring-0 uppercase"
              />
            </div>

            <textarea
              className="w-full border-b border-black rounded-none bg-transparent py-4 text-[11px] uppercase tracking-widest focus:outline-none placeholder:text-neutral-300"
              rows="2"
              {...register('instructions')}
              placeholder="DELIVERY INSTRUCTIONS (OPTIONAL)"
            />
          </div>
        </section>

        {/* Promo Code Toggle */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => setShowPromoCode(!showPromoCode)}
            className="text-[10px] uppercase tracking-[0.3em] flex items-center group"
          >
            <span className="border-b border-black/20 group-hover:border-black transition-colors">
              {promoCode ? 'Promo Applied' : 'Avez-vous un code?'}
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
                <div className="flex gap-4 border-b border-black/10 pb-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="ENTER CODE"
                    className="flex-1 bg-transparent text-[11px] uppercase tracking-widest outline-none"
                  />
                  <button 
                    onClick={handleApplyPromoCode}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold"
                  >
                    {promoLoading ? '...' : 'Apply'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* The CTA */}
        <div className="pt-10">
          <Button
            type="submit"
            loading={loading}
            className="w-full py-6 bg-black text-white rounded-none uppercase tracking-[0.4em] text-[11px] transition-all hover:bg-neutral-900 active:scale-[0.99]"
          >
            Continue to payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;