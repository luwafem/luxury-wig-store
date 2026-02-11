import React, { useState } from 'react';
import Button from '../common/Button';
import { paystackService } from '../../services/paystack';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/firebase';

const PaymentButton = ({ 
  customerInfo, 
  onSuccess, 
  onError,
  className = '',
  size = 'lg',
  variant = 'primary'
}) => {
  const [processing, setProcessing] = useState(false);
  const { cart, getGrandTotal, clearCart } = useCart();

  const handlePayment = async () => {
    if (!customerInfo) {
      onError?.('Please fill in all customer information');
      return;
    }

    if (cart.length === 0) {
      onError?.('Your cart is empty');
      return;
    }

    setProcessing(true);

    try {
      // Create order in Firebase
      const orderData = {
        customer: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          instructions: customerInfo.instructions,
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          productCode: item.productCode,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0],
        })),
        subtotal: getGrandTotal(),
        shipping: customerInfo.shipping || 2500,
        discount: customerInfo.discount || 0,
        totalAmount: getGrandTotal() + (customerInfo.shipping || 2500) - (customerInfo.discount || 0),
        status: 'pending',
        paymentMethod: 'paystack',
        paymentStatus: 'pending',
      };

      const order = await orderService.createOrder(orderData);
      const reference = paystackService.generateReference();

      // Initialize Paystack payment
      paystackService.initializePayment(
        customerInfo.email,
        order.totalAmount,
        reference,
        {
          order_id: order.id,
          customer_name: customerInfo.fullName,
          customer_phone: customerInfo.phone,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        async (response) => {
          if (response.status === 'success') {
            // Update order with payment success
            await orderService.updateOrder(order.id, {
              paymentStatus: 'paid',
              paymentReference: response.reference,
              status: 'processing',
              transactionId: response.transaction,
            });

            // Clear cart
            clearCart();

            // Call success callback
            onSuccess?.({
              orderId: order.id,
              reference: response.reference,
              amount: order.totalAmount,
              customer: customerInfo,
            });
          } else {
            // Update order with payment failure
            await orderService.updateOrder(order.id, {
              paymentStatus: 'failed',
              status: 'payment_failed',
            });

            onError?.('Payment failed. Please try again.');
          }
          setProcessing(false);
        }
      );

    } catch (error) {
      console.error('Payment error:', error);
      onError?.(error.message || 'An error occurred during payment');
      setProcessing(false);
    }
  };

  const handleTestPayment = () => {
    // For demo purposes, simulate a successful payment
    setProcessing(true);
    
    setTimeout(() => {
      const mockOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const mockReference = `PS-${Date.now()}`;
      
      onSuccess?.({
        orderId: mockOrderId,
        reference: mockReference,
        amount: getGrandTotal(),
        customer: customerInfo,
      });
      
      clearCart();
      setProcessing(false);
    }, 2000);
  };

  // Check if all required customer info is provided
  const isDisabled = !customerInfo || 
    !customerInfo.fullName ||
    !customerInfo.email ||
    !customerInfo.phone ||
    !customerInfo.address ||
    !customerInfo.city ||
    !customerInfo.state;

  return (
    <div className={className}>
      <Button
        variant={variant}
        size={size}
        onClick={handlePayment}
        loading={processing}
        disabled={isDisabled || processing}
        fullWidth
        className="mb-3"
      >
        {processing ? 'Processing Payment...' : 'Pay Now with Paystack'}
      </Button>

      {/* Test/Demo Payment Button (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Button
          variant="outline"
          size={size}
          onClick={handleTestPayment}
          disabled={isDisabled || processing}
          fullWidth
        >
          Test Payment (Demo)
        </Button>
      )}

      {isDisabled && !processing && (
        <p className="text-sm text-red-600 mt-2 text-center">
          Please fill in all required customer information
        </p>
      )}

      {/* Payment Methods Info */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p className="mb-1">Secure payment powered by Paystack</p>
        <div className="flex justify-center items-center space-x-3">
          <span>💳 Cards</span>
          <span>🏦 Bank Transfer</span>
          <span>📱 USSD</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentButton;