import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { isStaticDemo, mockAPI } from '../utils/apiFallback';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  
  // Cart State
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Product Comparison State (max 3 products)
  const [compareItems, setCompareItems] = useState(() => {
    const saved = localStorage.getItem('compare');
    return saved ? JSON.parse(saved) : [];
  });

  // Coupon Discount State
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  useEffect(() => {
    localStorage.setItem('compare', JSON.stringify(compareItems));
  }, [compareItems]);

  // Recalculate discount if cart subtotal changes
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.discount_price !== null ? item.discount_price : item.price;
      return acc + price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    if (!coupon) {
      setDiscountAmount(0);
      return;
    }
    const sub = getSubtotal();
    if (coupon.discount_type === 'percentage') {
      setDiscountAmount(sub * (coupon.discount_value / 100));
    } else if (coupon.discount_type === 'fixed') {
      setDiscountAmount(Math.min(sub, coupon.discount_value));
    }
  }, [cartItems, coupon]);

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setDiscountAmount(0);
  };

  // Wishlist Operations
  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Compare Operations
  const toggleCompare = (product) => {
    setCompareItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 products at a time!');
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeCompare = (id) => {
    setCompareItems(prev => prev.filter(item => item.id !== id));
  };

  // Apply Coupon
  const applyCouponCode = async (code) => {
    if (isStaticDemo) {
      const result = mockAPI.applyCoupon(code);
      setCoupon(result);
      return result;
    }

    try {
      const response = await fetch('/api/products/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid Coupon Code');
      }
      setCoupon(data);
      return data;
    } catch (error) {
      setCoupon(null);
      setDiscountAmount(0);
      throw error;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
  };

  // Checkout API
  const checkout = async (shippingAddress, phone, paymentMethod) => {
    if (!token && !isStaticDemo) {
      throw new Error('Please login to place an order.');
    }
    if (cartItems.length === 0) {
      throw new Error('Cart is empty.');
    }

    const orderPayload = {
      items: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity })),
      shipping_address: shippingAddress,
      phone,
      payment_method: paymentMethod,
      coupon_code: coupon ? coupon.code : null,
      discount_amount: discountAmount,
      total_amount: Math.max(0, getSubtotal() - discountAmount)
    };

    if (isStaticDemo) {
      const result = mockAPI.createOrder(orderPayload);
      clearCart();
      return result;
    }

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Checkout failed');
    }

    // Success
    clearCart();
    return data;
  };


  return (
    <CartContext.Provider value={{
      cartItems,
      wishlistItems,
      compareItems,
      coupon,
      discountAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      toggleCompare,
      removeCompare,
      applyCouponCode,
      removeCoupon,
      getSubtotal,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
