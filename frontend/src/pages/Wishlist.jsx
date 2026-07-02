import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ShoppingCart, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist, addToCart } = useCart();

  if (wishlistItems.length === 0) {
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
        <Heart size={64} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '24px' }}>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Fave components or notebooks in the shop to list them here.</p>
        <Link to="/products" className="btn-primary">Browse Catalogue</Link>
      </div>
    );
  }

  return (
    <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px', minHeight: '80vh' }}>
      <div>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My Wishlist</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Saved hardware products and accessories for quick checkout.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {wishlistItems.map((product) => {
          const itemPrice = product.discount_price !== null ? product.discount_price : product.price;
          return (
            <div key={product.id} className="glass-panel" style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              gap: '16px',
              position: 'relative'
            }}>
              {/* Image */}
              <div style={{ position: 'relative', paddingTop: '75%', background: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                />
              </div>

              {/* Title & Price */}
              <div>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  height: '42px',
                  overflow: 'hidden',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  marginBottom: '8px'
                }}>
                  {product.name}
                </h3>
                <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--accent-primary)' }}>
                  ${itemPrice.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    toggleWishlist(product);
                  }}
                  className="btn-primary"
                  style={{ flexGrow: 1, justifyContent: 'center', padding: '10px' }}
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn-secondary"
                  style={{ padding: '10px', color: 'var(--accent-secondary)', borderColor: 'var(--accent-secondary)' }}
                  title="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
