import { useState } from 'react';
import { paystackService } from '../services/paystack';
import { orderService } from '../services/firebase';

export const usePayment = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const initializePayment = async (paymentData) => {
    setProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const reference = paystackService.generateReference();
      
      return new Promise((resolve, reject) => {
        paystackService.initializePayment(
          paymentData.email,
          paymentData.amount,
          reference,
          paymentData.metadata,
          async (response) => {
            if (response.status === 'success') {
              setSuccess(true);
              
              // Update order with payment success
              if (paymentData.orderId) {
                await orderService.updateOrder(paymentData.orderId, {
                  paymentStatus: 'paid',
                  paymentReference: response.reference,
                  status: 'processing',
                });
              }
              
              resolve({
                success: true,
                reference: response.reference,
                data: response,
              });
            } else {
              setError('Payment was not successful');
              reject(new Error('Payment was not successful'));
            }
            setProcessing(false);
          }
        );
      });
    } catch (err) {
      setError(err.message);
      setProcessing(false);
      throw err;
    }
  };

  const verifyPayment = async (reference) => {
    try {
      return await paystackService.verifyPayment(reference);
    } catch (err) {
      console.error('Error verifying payment:', err);
      throw err;
    }
  };

  return {
    processing,
    error,
    success,
    initializePayment,
    verifyPayment,
  };
};