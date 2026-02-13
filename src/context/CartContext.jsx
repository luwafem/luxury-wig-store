import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

/**
 * BRAND NOTIFICATION HELPER
 * Matches the Noir & Pink aesthetic: Sharp corners, bold tracking, and high contrast.
 */
const notify = (message, type = 'success') => {
  const baseStyle = {
    borderRadius: '0px',
    fontSize: '9px',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    fontFamily: 'inherit',
    fontWeight: '700',
    padding: '16px',
  };

  if (type === 'success') {
    toast.success(message, {
      style: {
        ...baseStyle,
        background: '#ec4899',
        color: '#000'
      },
      icon: false,
      progressStyle: { background: '#000' }
    });
  } else {
    toast.info(message, {
      style: {
        ...baseStyle,
        background: '#0A0A0A',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      },
      icon: false,
      progressStyle: { background: '#ec4899' }
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

  // ========== PERSISTENCE WITH SAFE LOADING ==========
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('vibrant_noir_selection');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Filter out items without a valid ID (prevents checkout errors)
        const validCart = parsed.filter(item => 
          item && typeof item.id === 'string' && item.id.trim() !== ''
        );
        
        if (validCart.length !== parsed.length) {
          console.warn('🧹 Removed invalid cart items (missing or empty id)');
          // Optional: notify user that some items were removed
          notify('Some items were removed from your selection', 'info');
        }
        
        setCart(validCart);
      }
    } catch (error) {
      console.error('❌ Failed to load cart from localStorage:', error);
      // Clear corrupted storage
      localStorage.removeItem('vibrant_noir_selection');
    }
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem('vibrant_noir_selection', JSON.stringify(cart));
  }, [cart]);

  // ========== CART ACTIONS WITH GUARDS ==========
  const addToCart = (product, quantity = 1) => {
    // 🔒 GUARD: Do not add product without a valid ID
    if (!product || !product.id) {
      console.error('❌ Cannot add product without ID to cart', product);
      notify('Invalid product – missing identifier', 'error');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });

    notify(`Selection Added: ${product.name}`);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    notify('Piece Removed', 'info');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode(null);
    setDiscount(0);
  };

  // ========== CALCULATIONS ==========
  const getCartTotal = () =>
    cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const getCartCount = () =>
    cart.reduce((count, item) => count + item.quantity, 0);

  const getGrandTotal = () => Math.max(0, getCartTotal() - discount);

  // ========== PROMO CODES ==========
  const applyPromoCode = async (code) => {
    const total = getCartTotal();
    const response = await validatePromoCode(code, total);

    if (response.valid) {
      const { discountType, discountValue } = response.data;
      const amount = discountType === 'percentage'
        ? total * (discountValue / 100)
        : discountValue;

      setPromoCode(response.data);
      setDiscount(amount);
      notify(`Benefit Applied: ₦${amount.toLocaleString()}`);
      return { success: true };
    }

    notify(response.error, 'error');
    return { success: false };
  };

  const removePromoCode = () => {
    setPromoCode(null);
    setDiscount(0);
    notify('Benefit Revoked', 'info');
  };

  /**
   * UPDATED PROMO CODES
   * Matching the new boutique/noir vocabulary
   */
  const validatePromoCode = async (code, orderAmount) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const codes = {
          'NOIR10': { discountType: 'percentage', discountValue: 10, minOrderAmount: 0 },
          'VIBRANT': { discountType: 'percentage', discountValue: 15, minOrderAmount: 150000 },
          'ATELIER': { discountType: 'fixed', discountValue: 25000, minOrderAmount: 200000 },
        };

        const data = codes[code.toUpperCase()];
        if (!data) resolve({ valid: false, error: 'Invalid Code' });
        else if (orderAmount < data.minOrderAmount) {
          resolve({ valid: false, error: `Minimum Order ₦${data.minOrderAmount.toLocaleString()}` });
        } else {
          resolve({ valid: true, data });
        }
      }, 800);
    });
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    applyPromoCode,
    removePromoCode,
    promoCode,
    discount,
    getGrandTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};