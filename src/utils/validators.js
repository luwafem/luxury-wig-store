export const validateEmail = (email) => {
  const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{11}$/;
  return re.test(phone);
};

export const validateNigerianPhone = (phone) => {
  // Nigerian phone numbers: 080, 081, 070, 090, 091
  const re = /^(080|081|070|090|091)[0-9]{8}$/;
  return re.test(phone);
};

export const validatePromoCode = (code) => {
  // Promo code format: 3-20 alphanumeric characters, uppercase
  const re = /^[A-Z0-9]{3,20}$/;
  return re.test(code.toUpperCase());
};

export const validateProductCode = (code) => {
  // Product code format: LL-[CATEGORY]-[NUMBER]
  const re = /^LL-[A-Z]{2,}-[0-9]{3,}$/;
  return re.test(code);
};