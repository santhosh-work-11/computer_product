import React, { useState } from 'react';
import { X, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, wishlistItems } = useCart();
  const [activeImage, setActiveImage] = useState(product.image_url);

  if (!product) return null;

  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const specs = product.specifications || {};
  
  // Format gallery URLs list
  let gallery = [];
  try {
    gallery = typeof product.gallery_urls === 'string' 
      ? JSON.parse(product.gallery_urls) 
      : product.gallery_urls || [];
  } catch (e) {
    gallery = [];
  }

  // Include main image in selection
  const allImages = [product.image_url, ...gallery].filter(Boolean);

  const price = product.price;
  const discountPrice = product.discount_price;
  const isDiscounted = discountPrice !== null && discountPrice < price;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(11, 15, 25, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '20px'
    }} onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          animation: 'slideUp 0.3s ease-out',
          background: 'var(--bg-secondary)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.05)'}
        >
          <X size={18} />
        </button>

        {/* Gallery Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            position: 'relative',
            paddingTop: '80%',
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden'
          }}>
            <img 
              src={activeImage || product.image_url} 
              alt={product.name} 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '20px'
              }}
            />
          </div>

          {/* Thumbnail slides */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    border: activeImage === img ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: '#fff',
                    padding: '4px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            {product.type}
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: '1.3' }}>
            {product.name}
          </h2>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ color: '#fbbf24', fontSize: '18px' }}>★</span>
            <span style={{ fontWeight: 600 }}>{product.rating || '5.0'}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.rating_count || 0} customer reviews)</span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            {isDiscounted ? (
              <>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                  ${discountPrice.toFixed(2)}
                </span>
                <span style={{ fontSize: '18px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
                ${price.toFixed(2)}
              </span>
            )}
            <span style={{
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px',
              background: product.stock_status === 'in-stock' ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.1)',
              color: product.stock_status === 'in-stock' ? '#10b981' : 'var(--text-muted)'
            }}>
              {product.stock_status === 'in-stock' ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            {product.description || 'No detailed description available for this catalog item.'}
          </p>

          {/* Technical Specs List */}
          {Object.keys(specs).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '10px' }}>Key Specifications</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '10px' }}>
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} style={{ fontSize: '12px', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{key}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            <button
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              disabled={product.stock_status === 'out-of-stock'}
              className="btn-primary"
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                background: product.stock_status === 'out-of-stock' ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                cursor: product.stock_status === 'out-of-stock' ? 'not-allowed' : 'pointer'
              }}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className="btn-secondary"
              style={{
                padding: '12px',
                borderColor: isWishlisted ? 'var(--accent-secondary)' : 'var(--text-primary)',
                color: isWishlisted ? 'var(--accent-secondary)' : 'var(--text-primary)'
              }}
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Shipping/Warranty Badges */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Truck size={14} /> Fast Express Delivery</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} /> 2 Year Store Warranty</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={14} /> 14-Day Returns</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default QuickViewModal;
