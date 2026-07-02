import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, CheckCircle2, FileDown, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const Checkout = () => {
  const { cartItems, getSubtotal, discountAmount, coupon, checkout } = useCart();
  const navigate = useNavigate();

  // Address and payment states
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState(null);

  const subtotal = getSubtotal();
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phone.trim()) {
      setErrorMessage('Please fill in shipping address and phone number.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const result = await checkout(shippingAddress.trim(), phone.trim(), paymentMethod);
      setCompletedOrder(result);
      
      // Premium visual confetti effect!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setErrorMessage(err.message || 'Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view layout
  if (completedOrder) {
    return (
      <div className="section-container" style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 60%)'
      }}>
        <div className="glass-panel" style={{
          maxWidth: '550px',
          width: '100%',
          padding: '40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.1)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={44} />
          </div>

          <div>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>Purchase Complete!</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Thank you for shopping at Luxury Tech. Your order has been placed.</p>
          </div>

          <div className="glass-panel" style={{
            width: '100%',
            background: 'var(--bg-primary)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            fontSize: '13px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order Number:</span>
              <span style={{ fontWeight: 'bold' }}>{completedOrder.order_number}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tracking Number:</span>
              <span style={{ fontWeight: 'bold' }}>{completedOrder.tracking_number}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
              <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>${completedOrder.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', width: '100%', flexWrap: 'wrap' }}>
            <a 
              href={`/api/orders/${completedOrder.order_id}/invoice`} 
              className="btn-primary"
              style={{ flexGrow: 1, justifyContent: 'center' }}
            >
              <FileDown size={16} /> Download Invoice
            </a>
            <Link to="/products" className="btn-secondary" style={{ flexGrow: 1, justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cart Empty Redirect
  if (cartItems.length === 0) {
    return (
      <div className="section-container" style={{ minHeight: '60vh', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <h2>Cart is Empty</h2>
        <p>You cannot checkout with an empty cart.</p>
        <Link to="/products" className="btn-primary">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="section-container checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
      
      {/* Shipping details Form */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2>Checkout Details</h2>
        <form onSubmit={handlePlaceOrder} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Shipping & Delivery Address</label>
            <input
              type="text"
              required
              placeholder="123 Silicon St, Suite 400, San Jose, CA"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="glass-input"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Contact Phone Number</label>
            <input
              type="tel"
              required
              placeholder="+1 (555) 019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="glass-input"
            />
          </div>

          {/* Payment options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <label style={{
                border: paymentMethod === 'card' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                background: paymentMethod === 'card' ? 'var(--bg-tertiary)' : 'transparent',
                transition: 'var(--transition-smooth)'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  style={{ display: 'none' }}
                />
                <CreditCard size={18} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Credit Card</span>
              </label>

              <label style={{
                border: paymentMethod === 'cod' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                background: paymentMethod === 'cod' ? 'var(--bg-tertiary)' : 'transparent',
                transition: 'var(--transition-smooth)'
              }}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  style={{ display: 'none' }}
                />
                <Truck size={18} style={{ color: 'var(--accent-secondary)' }} />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Cash on Delivery</span>
              </label>
            </div>
          </div>

          {errorMessage && <span style={{ fontSize: '13px', color: 'var(--accent-secondary)' }}>{errorMessage}</span>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            {isSubmitting ? 'Processing Order...' : `Authorize & Pay $${finalTotal.toFixed(2)}`}
          </button>
        </form>
      </section>

      {/* Review Side Summary */}
      <aside>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
          <h3>Review Build</h3>
          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          {/* Items preview list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxH: '250px', overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
                </span>
                <span style={{ fontWeight: 600 }}>
                  ${((item.discount_price || item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          {/* Totals calculations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-secondary)' }}>
                <span>Coupon ({coupon?.code}):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>FREE</span>
            </div>
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px' }}>
            <span>Final Total:</span>
            <span className="gradient-text">${finalTotal.toFixed(2)}</span>
          </div>

          {/* Guarantee stamp */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '16px',
            color: 'var(--text-muted)',
            fontSize: '12px'
          }}>
            <ShieldCheck size={18} style={{ color: '#10b981' }} />
            <span>256-Bit SSL Encrypted Transaction</span>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 992px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
