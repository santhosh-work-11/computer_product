import React from 'react';
import { ShoppingCart, Heart, Eye, ArrowLeftRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, wishlistItems, toggleCompare, compareItems } = useCart();

  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const isCompared = compareItems.some(item => item.id === product.id);

  const price = product.price;
  const discountPrice = product.discount_price;
  const isDiscounted = discountPrice !== null && discountPrice < price;

  const discountPercentage = isDiscounted
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Product Image Container */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: '75%', background: '#fff' }}>
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '12px',
            transition: 'transform 0.5s ease'
          }}
          className="product-card-img"
        />

        {/* Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 10 }}>
          {isDiscounted && (
            <span style={{
              background: 'var(--accent-secondary)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: '6px',
              boxShadow: '0 4px 10px rgba(236,72,153,0.3)'
            }}>
              -{discountPercentage}%
            </span>
          )}
          {product.stock_status === 'out-of-stock' && (
            <span style={{
              background: 'var(--text-muted)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px'
            }}>
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="card-actions-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(11, 15, 25, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          opacity: 0,
          transition: 'var(--transition-smooth)',
          zIndex: 20
        }}>
          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(product)}
            className="action-btn"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
          
          {/* Compare Button */}
          <button
            onClick={() => toggleCompare(product)}
            className={`action-btn ${isCompared ? 'active' : ''}`}
            title="Compare Specs"
          >
            <ArrowLeftRight size={18} />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`action-btn ${isWishlisted ? 'active' : ''}`}
            title="Add to Wishlist"
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Product Information Details */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          {product.type}
        </span>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '8px',
          lineHeight: '1.4',
          height: '44px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.name}
        </h3>

        {/* Rating stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <span style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{product.rating || '5.0'}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({product.rating_count || '0'})</span>
        </div>

        {/* Price and Cart Action Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div>
            {isDiscounted ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                  ${price.toFixed(2)}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                  ${discountPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ${price.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock_status === 'out-of-stock'}
            className="btn-primary"
            style={{
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none',
              background: product.stock_status === 'out-of-stock' ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              cursor: product.stock_status === 'out-of-stock' ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .premium-card:hover .product-card-img {
          transform: scale(1.08);
        }
        .premium-card:hover .card-actions-overlay {
          opacity: 1;
        }
        .action-btn {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .action-btn:hover {
          background: var(--accent-primary);
          color: #ffffff;
          border-color: var(--accent-primary);
          transform: scale(1.1);
        }
        .action-btn.active {
          background: var(--accent-secondary);
          color: #ffffff;
          border-color: var(--accent-secondary);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
