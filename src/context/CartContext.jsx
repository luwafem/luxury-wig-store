import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

// Styled notification helper to match the brand aesthetic
const notify = (message, type = 'success') => {
  const toastStyle = {
    borderRadius: '0px',
    background: '#000',
    color: '#fff',
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontFamily: 'sans-serif',
  };

  if (type === 'success') {
    toast.success(message, { style: toastStyle, icon: false });
  } else {
    toast.info(message, { 
      style: { ...toastStyle, background: '#f9f9f9', color: '#000', border: '1px solid #000' },
      icon: false 
    });
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Persistence with a brand-specific key
  useEffect(() => {
    const savedCart = localStorage.getItem('maison_luxe_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('maison_luxe_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    
    notify(`${product.name} Added to Bag`);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    notify('Item Removed', 'info');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
    setDiscount(0);
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const getCartCount = () => cart.reduce((count, item) => count + item.quantity, 0);

  const applyPromoCode = async (code) => {
    const total = getCartTotal();
    const response = await validatePromoCode(code, total);
    
    if (response.valid) {
      const { discountType, discountValue } = response.data;
      const amount = discountType === 'percentage' ? total * (discountValue / 100) : discountValue;
      
      setPromoCode(response.data);
      setDiscount(amount);
      notify(`Credit Applied: ₦${amount.toLocaleString()}`);
      return { success: true };
    }
    
    notify(response.error, 'error');
    return { success: false };
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscount(0);
    notify('Promo Removed', 'info');
  };

  const getGrandTotal = () => Math.max(0, getCartTotal() - discount);

  // Simulated API call with updated high-end mock data
  const validatePromoCode = async (code, orderAmount) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const codes = {
          'MAISON10': { discountType: 'percentage', discountValue: 10, minOrderAmount: 0 },
          'EDITORIAL': { discountType: 'percentage', discountValue: 15, minOrderAmount: 100000 },
          'BESPOKE': { discountType: 'fixed', discountValue: 10000, minOrderAmount: 50000 },
        };
        
        const data = codes[code.toUpperCase()];
        if (!data) resolve({ valid: false, error: 'Code Invalid' });
        else if (orderAmount < data.minOrderAmount) {
          resolve({ valid: false, error: `Minimum ₦${data.minOrderAmount.toLocaleString()} required` });
        } else {
          resolve({ valid: true, data });
        }
      }, 600);
    });
  };

  const value = {
    cart, addToCart, removeFromCart, updateQuantity, 
    clearCart, getCartTotal, getCartCount, applyPromoCode, 
    removePromoCode, promoCode, discount, getGrandTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};