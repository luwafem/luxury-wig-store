import { siteConfig } from '../config/siteConfig';

export const paystackService = {
  initializePayment(email, amount, reference, metadata, callback) {
    if (!window.PaystackPop) {
      console.error('Paystack script not loaded');
      return;
    }
    
    const handler = window.PaystackPop.setup({
      key: siteConfig.payment.paystackPublicKey,
      email,
      amount: amount * 100, // Convert to kobo
      currency: siteConfig.payment.currency,
      ref: reference,
      metadata,
      callback: function(response) {
        callback(response);
      },
      onClose: function() {
        console.log('Payment window closed');
      }
    });
    
    handler.openIframe();
  },
  
  verifyPayment(reference) {
    // This would typically call your backend to verify payment
    // For demo, we'll simulate verification
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          reference,
          verified: true,
        });
      }, 2000);
    });
  },
  
  generateReference() {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
};