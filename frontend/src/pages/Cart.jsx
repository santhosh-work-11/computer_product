import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, Plus, Minus, Ticket, CheckCircle2 } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    coupon,
    discountAmount,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setLoadingCoupon(true);
    setCouponError('');
    try {
      await applyCouponCode(couponCode.trim());
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setLoadingCoupon(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="section-container" style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '20px'
      }}>
        <ShoppingBag size={64} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '24px' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Add parts or prebuilts from our catalog to get started.</p>
        <Link to="/products" className="btn-primary">Browse Catalogue</Link>
      </div>
    );
  }

  return (
    <div className="section-container cart-page-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
      
      {/* Items list container */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2>Shopping Cart</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.map((item) => {
            const price = item.discount_price !== null ? item.discount_price : item.price;
            return (
              <div key={item.id} className="glass-panel" style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                alignItems: 'center',
                padding: '20px',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#fff', padding: '4px', borderRadius: '8px' }}
                />
                
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{item.name}</h3>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ${price.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Quantity selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '6px 10px', background: 'transparent', border: 0, color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 12px', fontWeight: 600, fontSize: '14px' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '6px 10px', background: 'transparent', border: 0, color: 'var(--text-primary)', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'transparent', border: 0, color: 'var(--accent-secondary)', cursor: 'pointer', padding: '6px' }}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cart Summary Details */}
      <aside>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
          <h3>Order Summary</h3>
          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          {/* Pricing calculations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-secondary)' }}>
                <span>Discount ({coupon?.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
            <span>Total</span>
            <span className="gradient-text">${finalTotal.toFixed(2)}</span>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          {/* Coupon Code Applying Panel */}
          {coupon ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid #10b981',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>Coupon Applied: {coupon.code}</span>
              </div>
              <button
                onClick={removeCoupon}
                style={{ background: 'transparent', border: 0, color: 'var(--accent-secondary)', fontWeight: 600, cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="glass-input"
                style={{ flexGrow: 1, padding: '8px 12px', fontSize: '13px', textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '13px', gap: '4px' }}>
                <Ticket size={14} /> Apply
              </button>
            </form>
          )}
          {couponError && <span style={{ fontSize: '12px', color: 'var(--accent-secondary)' }}>{couponError}</span>}

          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>

      {/* Responsive stylesheet */}
      <style>{`
        @media (max-width: 992px) {
          .cart-page-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
