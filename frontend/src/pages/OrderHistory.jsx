import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, FileText, Truck, Calendar, ShoppingBag, ShieldCheck } from 'lucide-react';
import { isStaticDemo, mockAPI } from '../utils/apiFallback';

const OrderHistory = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search/Track order state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [loadingTrack, setLoadingTrack] = useState(false);

  // Load orders history
  useEffect(() => {
    const fetchOrders = async () => {
      if (isStaticDemo) {
        setOrders(mockAPI.getMyOrders());
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Track order query
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setLoadingTrack(true);
    setTrackError('');
    setTrackedOrder(null);
    try {
      if (isStaticDemo) {
        const items = mockAPI.getMyOrders();
        const found = items.find(o => 
          o.order_number === trackQuery.trim() || 
          o.tracking_number === trackQuery.trim()
        );
        if (found) {
          setTrackedOrder({
            order: found,
            items: found.items || []
          });
        } else {
          setTrackError('No matching order number or tracking code found.');
        }
        setLoadingTrack(false);
        return;
      }

      // Find order by order number or tracking code
      // We can query the orders endpoint by order number
      const res = await fetch(`/api/orders?search=${trackQuery.trim()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        // Look up target order
        const found = data.find(o => 
          o.order_number === trackQuery.trim() || 
          o.tracking_number === trackQuery.trim()
        );
        if (found) {
          // Fetch order details
          const detailRes = await fetch(`/api/orders/${found.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            setTrackedOrder(detailData);
          }
        } else {
          setTrackError('No matching order number or tracking code found.');
        }
      }
    } catch (err) {
      setTrackError('Error finding order details.');
    } finally {
      setLoadingTrack(false);
    }
  };

  // Helper to map status styles
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981'; // Green
      case 'shipped': return '#06b6d4'; // Cyan
      case 'processing': return '#fbbf24'; // Yellow
      case 'cancelled': return '#ef4444'; // Red
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="section-container history-page-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }}>
      
      {/* List of past orders */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2>Order History</h2>
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="glass-panel skeleton" style={{ height: '140px' }} />
          ))
        ) : orders.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3>No Orders Found</h3>
            <p style={{ fontSize: '13px' }}>You have not placed any orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div key={order.id} className="glass-panel" style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{order.order_number}</span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: `${getStatusColor(order.order_status)}15`,
                      color: getStatusColor(order.order_status)
                    }}>
                      {order.order_status}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Date: {new Date(order.created_at).toLocaleDateString()}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tracking: {order.tracking_number}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Amount</span>
                    <span style={{ fontWeight: 700, fontSize: '18px' }}>${order.total_amount.toFixed(2)}</span>
                  </div>
                  <a
                    href={`/api/orders/${order.id}/invoice`}
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '12px', gap: '4px' }}
                    title="Download Receipt"
                  >
                    <FileText size={14} /> Invoice
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Live Order Tracker sidebar */}
      <aside>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
          <h3>Track Order</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Enter your order ID or tracking code to query current shipping progress.</p>
          
          <form onSubmit={handleTrackOrder} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="e.g. CS-481923"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              className="glass-input"
              style={{ flexGrow: 1, padding: '8px 12px', fontSize: '13px' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '8px 12px' }}>
              <Search size={16} />
            </button>
          </form>
          {trackError && <span style={{ fontSize: '12px', color: 'var(--accent-secondary)' }}>{trackError}</span>}

          {/* Tracked Order Result Box */}
          {trackedOrder && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              border: '1px solid var(--border-color)',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '13px',
              background: 'var(--bg-primary)',
              animation: 'fadeIn 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{trackedOrder.order.order_number}</span>
                <span style={{ fontWeight: 'bold', color: getStatusColor(trackedOrder.order.order_status) }}>
                  {trackedOrder.order.order_status.toUpperCase()}
                </span>
              </div>
              <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />
              
              {/* Simple progress roadmap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: trackedOrder.order.order_status !== 'cancelled' ? '#10b981' : 'var(--text-muted)' }}>
                  <Calendar size={14} /> <span>Order Received</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: ['processing', 'shipped', 'delivered'].includes(trackedOrder.order.order_status) ? '#10b981' : 'var(--text-muted)' }}>
                  <ShieldCheck size={14} /> <span>Build & QA Tested</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: ['shipped', 'delivered'].includes(trackedOrder.order.order_status) ? '#10b981' : 'var(--text-muted)' }}>
                  <Truck size={14} /> <span>Shipped (Transit)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      <style>{`
        @media (max-width: 992px) {
          .history-page-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderHistory;
