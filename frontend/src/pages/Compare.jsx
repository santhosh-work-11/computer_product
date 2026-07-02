import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, ArrowLeftRight, ShoppingCart, Trash2 } from 'lucide-react';

const Compare = () => {
  const { compareItems, removeCompare, addToCart } = useCart();

  if (compareItems.length === 0) {
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
        <ArrowLeftRight size={64} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '24px' }}>No Products for Comparison</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Click the compare buttons on product cards to add them here.</p>
        <Link to="/products" className="btn-primary">Browse Catalogue</Link>
      </div>
    );
  }

  // Find all unique keys in the specifications of compared products
  const getSpecs = (product) => {
    if (!product) return {};
    if (typeof product.specifications === 'string') {
      try { return JSON.parse(product.specifications); } catch (e) { return {}; }
    }
    return product.specifications || {};
  };

  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap(item => Object.keys(getSpecs(item)))
    )
  );

  return (
    <div className="section-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Compare Components</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Detailed side-by-side specifications review.</p>
      </div>

      <div style={{ overflowX: 'auto' }} className="glass-panel">
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '24px', width: '200px', fontWeight: 600 }}>Features</th>
              {compareItems.map(item => (
                <th key={item.id} style={{ padding: '24px', minWidth: '220px', position: 'relative' }}>
                  {/* Remove Button */}
                  <button
                    onClick={() => removeCompare(item.id)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'transparent',
                      border: 0,
                      color: 'var(--accent-secondary)',
                      cursor: 'pointer'
                    }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '20px' }}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#fff', padding: '4px', borderRadius: '8px' }}
                    />
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                      {item.type}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '14px', lineHeight: '1.4' }}>{item.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Price</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ padding: '16px 24px', fontWeight: 700, fontSize: '16px' }}>
                  ${(item.discount_price || item.price).toFixed(2)}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Rating</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ padding: '16px 24px' }}>
                  ★ {item.rating || '5.0'} ({item.rating_count || 0})
                </td>
              ))}
            </tr>

            {/* Stock status Row */}
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)' }}>Availability</td>
              {compareItems.map(item => (
                <td key={item.id} style={{ padding: '16px 24px', fontWeight: 600, color: item.stock_status === 'in-stock' ? '#10b981' : 'var(--text-muted)' }}>
                  {item.stock_status === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                </td>
              ))}
            </tr>

            {/* Dynamic Specifications rows */}
            {allSpecKeys.map(key => (
              <tr key={key} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {key}
                </td>
                {compareItems.map(item => {
                  const specs = getSpecs(item);
                  return (
                    <td key={item.id} style={{ padding: '16px 24px' }}>
                      {specs[key] || '-'}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Add to Cart CTA Row */}
            <tr>
              <td style={{ padding: '24px' }}></td>
              {compareItems.map(item => (
                <td key={item.id} style={{ padding: '24px' }}>
                  <button
                    onClick={() => addToCart(item, 1)}
                    disabled={item.stock_status === 'out-of-stock'}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: '13px',
                      background: item.stock_status === 'out-of-stock' ? 'var(--text-muted)' : undefined,
                      cursor: item.stock_status === 'out-of-stock' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
