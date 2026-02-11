export const formatCurrency = (amount, currency = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Date(date).toLocaleDateString('en-NG', defaultOptions);
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateProductCode = (category = 'WIG') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `LL-${category}-${timestamp.toString().slice(-6)}-${random.toString().padStart(3, '0')}`;
};

export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random.toString().padStart(4, '0')}`;
};

export const validateEmail = (email) => {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{11}$/;
  return re.test(phone);
};

export const formatPhoneNumber = (phone) => {
  // Format: 080 1234 5678
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
  }
  return phone;
};

export const calculateDiscount = (amount, discountType, discountValue) => {
  if (discountType === 'percentage') {
    return (amount * discountValue) / 100;
  } else if (discountType === 'fixed') {
    return discountValue;
  }
  return 0;
};

export const getDeliveryEstimate = (state) => {
  if (state.toLowerCase() === 'lagos') {
    return '1-2 business days';
  }
  return '3-5 business days';
};