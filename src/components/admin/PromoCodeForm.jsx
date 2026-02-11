import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

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
      // Format the data
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

      // In production, call Firebase service
      console.log('Promo code data:', promoData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess(promoData);
    } catch (error) {
      console.error('Error saving promo code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Promo Code"
        {...register('code', {
          required: 'Promo code is required',
          pattern: {
            value: /^[A-Z0-9]{3,20}$/,
            message: 'Use 3-20 uppercase letters or numbers'
          }
        })}
        error={errors.code?.message}
        placeholder="e.g., WELCOME10"
        helperText="Customers will enter this code at checkout"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="percentage"
                {...register('discountType')}
                className="mr-2"
              />
              Percentage (%)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="fixed"
                {...register('discountType')}
                className="mr-2"
              />
              Fixed Amount (₦)
            </label>
          </div>
        </div>

        <Input
          label={discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (₦)'}
          type="number"
          {...register('discountValue', {
            required: 'Discount value is required',
            min: { value: 0, message: 'Must be positive' },
            max: discountType === 'percentage' 
              ? { value: 100, message: 'Cannot exceed 100%' }
              : undefined
          })}
          error={errors.discountValue?.message}
          step={discountType === 'percentage' ? '0.1' : '1'}
        />
      </div>

      <Input
        label="Minimum Order Amount (₦)"
        type="number"
        {...register('minOrderAmount', {
          min: { value: 0, message: 'Must be positive' }
        })}
        error={errors.minOrderAmount?.message}
        helperText="Set 0 for no minimum"
      />

      <Input
        label="Maximum Usage Limit"
        type="number"
        {...register('maxUsage', {
          min: { value: 1, message: 'Must be at least 1' }
        })}
        error={errors.maxUsage?.message}
        helperText="Leave empty for unlimited usage"
        placeholder="Unlimited"
      />

      <Input
        label="Expiry Date"
        type="date"
        {...register('expiryDate')}
        error={errors.expiryDate?.message}
        helperText="Leave empty for no expiry"
        min={new Date().toISOString().split('T')[0]}
      />

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('isActive')}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Active (promo code can be used)</span>
        </label>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Preview</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono font-bold">
                {watch('code') || 'YOURCODE'}
              </p>
              <p className="text-sm text-gray-600">
                {watch('discountType') === 'percentage' 
                  ? `${watch('discountValue') || 0}% off` 
                  : `₦${(watch('discountValue') || 0).toLocaleString()} off`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Min. order: ₦{(watch('minOrderAmount') || 0).toLocaleString()}
              </p>
              {watch('expiryDate') && (
                <p className="text-sm text-gray-600">
                  Expires: {new Date(watch('expiryDate')).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        fullWidth
      >
        {promoCode ? 'Update Promo Code' : 'Create Promo Code'}
      </Button>
    </form>
  );
};

export default PromoCodeForm;