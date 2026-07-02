import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, ShoppingBag, Box, Users, Plus, Trash2, Edit, CheckCircle, Clock, Tag, Settings, AlertCircle, Calendar, Megaphone, UserCheck } from 'lucide-react';
import { isStaticDemo, mockAPI } from '../utils/apiFallback';

const AdminDashboard = () => {
  const { token } = useAuth();
  
  // Dashboard states
  const [metrics, setMetrics] = useState({ totalRevenue: 124000, totalOrders: 0, totalProducts: 0, totalUsers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State: overview, products, orders, customers, categories, coupons, settings
  const [activeTab, setActiveTab] = useState('overview');

  // Add Product form state
  const [newProd, setNewProd] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    stock_status: 'in-stock',
    image_url: '',
    type: 'part',
    power_usage: '0'
  });
  const [addSuccess, setAddSuccess] = useState(false);

  // Coupon form state
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_type: 'percentage', discount_value: '' });
  // Category form state
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  // Settings states
  const [bannerText, setBannerText] = useState(localStorage.getItem('admin_banner_text') || 'Futuristic Summer Drop: Code GAMER2026 for 10% off!');
  const [customCursor, setCustomCursor] = useState(localStorage.getItem('admin_custom_cursor') !== 'false');
  const [storeStatus, setStoreStatus] = useState(localStorage.getItem('admin_store_status') || 'online');

  // Load stats & catalog products
  const fetchStats = async () => {
    try {
      if (isStaticDemo) {
        const stats = mockAPI.getDashboardStats();
        const prods = mockAPI.getProducts();
        const cats = mockAPI.getCategories();
        const users = mockAPI.getUsers();
        const coups = mockAPI.getCoupons();
        setMetrics(stats.metrics);
        setRecentOrders(stats.recentOrders);
        setMonthlyRevenue(stats.monthlyRevenue);
        setCategorySales(stats.categorySales);
        setProducts(prods);
        setCategories(cats);
        setCustomers(users);
        setCoupons(coups);
        if (cats.length > 0 && !newProd.category_id) {
          setNewProd(prev => ({ ...prev, category_id: cats[0].id }));
        }
        setLoading(false);
        return;
      }

      const statsRes = await fetch('/api/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const prodRes = await fetch('/api/products');
      const catRes = await fetch('/api/products/categories');

      if (statsRes.ok && prodRes.ok && catRes.ok) {
        const stats = await statsRes.json();
        const prods = await prodRes.json();
        const cats = await catRes.json();

        setMetrics(stats.metrics);
        setRecentOrders(stats.recentOrders);
        setMonthlyRevenue(stats.monthlyRevenue);
        setCategorySales(stats.categorySales);
        setProducts(prods);
        setCategories(cats);
        if (cats.length > 0 && !newProd.category_id) {
          setNewProd(prev => ({ ...prev, category_id: cats[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  // Add Product Handler
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (isStaticDemo) {
      mockAPI.addProduct({
        ...newProd,
        price: parseFloat(newProd.price),
        power_usage: parseInt(newProd.power_usage || 0),
        category_id: parseInt(newProd.category_id)
      });
      setAddSuccess(true);
      setNewProd({
        category_id: categories[0]?.id || '',
        name: '',
        description: '',
        price: '',
        stock_status: 'in-stock',
        image_url: '',
        type: 'part',
        power_usage: '0'
      });
      setTimeout(() => setAddSuccess(false), 3000);
      fetchStats();
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProd,
          price: parseFloat(newProd.price),
          power_usage: parseInt(newProd.power_usage)
        })
      });
      if (res.ok) {
        setAddSuccess(true);
        setNewProd({
          category_id: categories[0]?.id || '',
          name: '',
          description: '',
          price: '',
          stock_status: 'in-stock',
          image_url: '',
          type: 'part',
          power_usage: '0'
        });
        setTimeout(() => setAddSuccess(false), 3000);
        fetchStats(); // refresh data
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    if (isStaticDemo) {
      mockAPI.deleteProduct(id);
      alert('Product deleted successfully');
      fetchStats();
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Product deleted successfully');
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };


  // Update Order Status Handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (isStaticDemo) {
      const orders = JSON.parse(localStorage.getItem('demo_orders')) || [];
      const updated = orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o);
      localStorage.setItem('demo_orders', JSON.stringify(updated));
      alert(`Order status updated to: ${newStatus}`);
      fetchStats();
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        alert(`Order status updated to: ${newStatus}`);
        fetchStats();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleToggleUserRole = (id) => {
    if (isStaticDemo) {
      mockAPI.toggleUserRole(id);
      fetchStats();
      return;
    }
    alert('Feature only simulated in static demo mode');
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('Delete this user?')) return;
    if (isStaticDemo) {
      mockAPI.deleteUser(id);
      fetchStats();
      return;
    }
    alert('Feature only simulated in static demo mode');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    if (isStaticDemo) {
      mockAPI.addCategory({ name: newCat.name, description: newCat.description });
      setNewCat({ name: '', description: '' });
      fetchStats();
      return;
    }
    alert('Feature only simulated in static demo mode');
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm('Delete this category?')) return;
    if (isStaticDemo) {
      mockAPI.deleteCategory(id);
      fetchStats();
      return;
    }
    alert('Feature only simulated in static demo mode');
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;
    try {
      if (isStaticDemo) {
        mockAPI.addCoupon({
          code: newCoupon.code.toUpperCase(),
          discount_type: newCoupon.discount_type,
          discount_value: parseFloat(newCoupon.discount_value)
        });
        setNewCoupon({ code: '', discount_type: 'percentage', discount_value: '' });
        fetchStats();
        return;
      }
      alert('Feature only simulated in static demo mode');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCoupon = (code) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return;
    if (isStaticDemo) {
      mockAPI.deleteCoupon(code);
      fetchStats();
      return;
    }
    alert('Feature only simulated in static demo mode');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('admin_banner_text', bannerText);
    localStorage.setItem('admin_custom_cursor', customCursor);
    localStorage.setItem('admin_store_status', storeStatus);
    window.dispatchEvent(new Event('storage'));
    alert('Settings saved successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#06b6d4';
      case 'processing': return '#fbbf24';
      case 'cancelled': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px', minHeight: '80vh' }}>
      
      {/* Admin Panel Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Management Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review sales, orders metrics, and adjust catalog items.</p>
        </div>

        {/* Tab Controls */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-tertiary)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          {['overview', 'products', 'orders', 'customers', 'categories', 'coupons', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'var(--bg-secondary)' : 'transparent',
                border: 0,
                color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'var(--transition-smooth)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div>Loading dashboard metrics...</div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW ANALYTICS */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Metrics cards grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '12px' }}><DollarSign size={24} /></div>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Revenue</span>
                    <h3 style={{ fontSize: '22px' }}>${metrics.totalRevenue.toFixed(2)}</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', background: 'rgba(6,182,212,0.1)', color: 'var(--accent-primary)', borderRadius: '12px' }}><ShoppingBag size={24} /></div>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Orders</span>
                    <h3 style={{ fontSize: '22px' }}>{metrics.totalOrders}</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', background: 'rgba(236,72,153,0.1)', color: 'var(--accent-secondary)', borderRadius: '12px' }}><Box size={24} /></div>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Parts</span>
                    <h3 style={{ fontSize: '22px' }}>{metrics.totalProducts}</h3>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', background: 'rgba(99,102,241,0.1)', color: '#6366f1', borderRadius: '12px' }}><Users size={24} /></div>
                  <div>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Customers</span>
                    <h3 style={{ fontSize: '22px' }}>{metrics.totalUsers}</h3>
                  </div>
                </div>
              </div>

              {/* Graphical Charts Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' }} className="admin-charts-grid">
                
                {/* Monthly sales area chart */}
                <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Sales Progress</h3>
                  <div style={{ flexGrow: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyRevenue}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                        <Area type="monotone" dataKey="sales" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category sales bar chart */}
                <div className="glass-panel" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Category Breakdown</h3>
                  <div style={{ flexGrow: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categorySales}>
                        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {categorySales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }} className="admin-products-layout">
              {/* Product items table */}
              <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '20px' }}>Current Inventory</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Type</th>
                      <th style={{ padding: '12px' }}>Price</th>
                      <th style={{ padding: '12px' }}>Stock</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{prod.name}</td>
                        <td style={{ padding: '12px', textTransform: 'uppercase', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 'bold' }}>{prod.type}</td>
                        <td style={{ padding: '12px' }}>${prod.price.toFixed(2)}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            color: prod.stock_status === 'in-stock' ? '#10b981' : '#ef4444',
                            fontWeight: 600
                          }}>{prod.stock_status}</span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            style={{ background: 'transparent', border: 0, color: 'var(--accent-secondary)', cursor: 'pointer' }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Product Sidebar Panel */}
              <aside>
                <form onSubmit={handleAddProduct} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3>Add Product</h3>
                  <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />
                  
                  {addSuccess && <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 'bold' }}>✓ Product added successfully!</span>}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Category</label>
                    <select
                      value={newProd.category_id}
                      onChange={(e) => setNewProd(prev => ({ ...prev, category_id: e.target.value }))}
                      className="glass-input"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Product Name"
                    value={newProd.name}
                    onChange={(e) => setNewProd(prev => ({ ...prev, name: e.target.value }))}
                    className="glass-input"
                  />

                  <textarea
                    placeholder="Description"
                    rows="3"
                    value={newProd.description}
                    onChange={(e) => setNewProd(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-input"
                    style={{ resize: 'none' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="Price ($)"
                      value={newProd.price}
                      onChange={(e) => setNewProd(prev => ({ ...prev, price: e.target.value }))}
                      className="glass-input"
                    />
                    <input
                      type="number"
                      placeholder="Power (Watts)"
                      value={newProd.power_usage}
                      onChange={(e) => setNewProd(prev => ({ ...prev, power_usage: e.target.value }))}
                      className="glass-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select
                      value={newProd.type}
                      onChange={(e) => setNewProd(prev => ({ ...prev, type: e.target.value }))}
                      className="glass-input"
                    >
                      <option value="part">Part</option>
                      <option value="prebuilt">Prebuilt Rig</option>
                      <option value="laptop">Laptop</option>
                      <option value="peripheral">Peripheral</option>
                    </select>

                    <select
                      value={newProd.stock_status}
                      onChange={(e) => setNewProd(prev => ({ ...prev, stock_status: e.target.value }))}
                      className="glass-input"
                    >
                      <option value="in-stock">In Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProd.image_url}
                    onChange={(e) => setNewProd(prev => ({ ...prev, image_url: e.target.value }))}
                    className="glass-input"
                  />

                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                    <Plus size={16} /> Save Product
                  </button>
                </form>
              </aside>
            </div>
          )}

          {/* TAB 3: ORDER MANAGER */}
          {activeTab === 'orders' && (
            <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
              <h3 style={{ marginBottom: '20px' }}>Active System Orders</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Order #</th>
                    <th style={{ padding: '12px' }}>Address</th>
                    <th style={{ padding: '12px' }}>Payment</th>
                    <th style={{ padding: '12px' }}>Total Amount</th>
                    <th style={{ padding: '12px' }}>Shipping Status</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{order.order_number}</td>
                      <td style={{ padding: '12px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.shipping_address}</td>
                      <td style={{ padding: '12px', textTransform: 'uppercase' }}>{order.payment_method}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>${order.total_amount.toFixed(2)}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          color: getStatusColor(order.order_status),
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          fontSize: '11px'
                        }}>{order.order_status}</span>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <select
                          value={order.order_status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="glass-input"
                          style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: CUSTOMER MANAGEMENT */}
          {activeTab === 'customers' && (
            <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
              <h3 style={{ marginBottom: '20px' }}>Registered Customers</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Username</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px' }}>#{c.id}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{c.username}</td>
                      <td style={{ padding: '12px' }}>{c.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          background: c.role === 'admin' ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.05)',
                          color: c.role === 'admin' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                        }}>{c.role}</span>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button
                          onClick={() => handleToggleUserRole(c.id)}
                          style={{ background: 'transparent', border: 0, color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                          title="Toggle Admin/User Role"
                        >
                          <UserCheck size={14} /> Toggle Role
                        </button>
                        {c.id !== 1 && (
                          <button
                            onClick={() => handleDeleteUser(c.id)}
                            style={{ background: 'transparent', border: 0, color: 'var(--accent-secondary)', cursor: 'pointer' }}
                            title="Delete Customer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 5: CATEGORY MANAGEMENT */}
          {activeTab === 'categories' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }} className="admin-products-layout">
              <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '20px' }}>Product Categories</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px' }}>ID</th>
                      <th style={{ padding: '12px' }}>Name</th>
                      <th style={{ padding: '12px' }}>Slug</th>
                      <th style={{ padding: '12px' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px' }}>#{cat.id}</td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{cat.name}</td>
                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{cat.slug}</td>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{cat.description}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {cat.id > 6 && (
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              style={{ background: 'transparent', border: 0, color: 'var(--accent-secondary)', cursor: 'pointer' }}
                              title="Delete Category"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <aside>
                <form onSubmit={handleAddCategory} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3>Add Category</h3>
                  <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Category Name"
                    value={newCat.name}
                    onChange={(e) => setNewCat(prev => ({ ...prev, name: e.target.value }))}
                    className="glass-input"
                  />
                  <textarea
                    placeholder="Category Description"
                    rows="3"
                    value={newCat.description}
                    onChange={(e) => setNewCat(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-input"
                    style={{ resize: 'none' }}
                  />
                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                    <Plus size={16} /> Create Category
                  </button>
                </form>
              </aside>
            </div>
          )}

          {/* TAB 6: OFFERS & COUPONS */}
          {activeTab === 'coupons' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }} className="admin-products-layout">
              <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '20px' }}>Active Promo Codes</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px' }}>Code</th>
                      <th style={{ padding: '12px' }}>Discount Type</th>
                      <th style={{ padding: '12px' }}>Value</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(coupon => (
                      <tr key={coupon.code} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{coupon.code}</td>
                        <td style={{ padding: '12px', textTransform: 'capitalize' }}>{coupon.discount_type}</td>
                        <td style={{ padding: '12px', fontWeight: 600 }}>
                          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `$${coupon.discount_value.toFixed(2)}`}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.code)}
                            style={{ background: 'transparent', border: 0, color: 'var(--accent-secondary)', cursor: 'pointer' }}
                            title="Delete Coupon"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <aside>
                <form onSubmit={handleAddCoupon} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3>Create Coupon</h3>
                  <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />
                  <input
                    type="text"
                    required
                    placeholder="COUPONCODE (e.g. ULTRA20)"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                    className="glass-input"
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>Type</label>
                    <select
                      value={newCoupon.discount_type}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, discount_type: e.target.value }))}
                      className="glass-input"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    required
                    placeholder="Discount Value"
                    value={newCoupon.discount_value}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, discount_value: e.target.value }))}
                    className="glass-input"
                  />
                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                    <Plus size={16} /> Activate Offer
                  </button>
                </form>
              </aside>
            </div>
          )}

          {/* TAB 7: GLOBAL SETTINGS & BANNER */}
          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }} className="admin-products-layout">
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={20} /> System Configurations</h3>
                <hr style={{ border: 0, borderTop: '1px solid var(--border-color)' }} />
                
                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Megaphone size={16} style={{ color: 'var(--accent-primary)' }} /> Announcement Bar Text
                    </label>
                    <input
                      type="text"
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      className="glass-input"
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>Custom Trailing Cursor</span>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Toggle glowing cursor particle trailing trail effects.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={customCursor}
                      onChange={(e) => setCustomCursor(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Store System Status</label>
                    <select
                      value={storeStatus}
                      onChange={(e) => setStoreStatus(e.target.value)}
                      className="glass-input"
                    >
                      <option value="online">Online (Live Transactions)</option>
                      <option value="maintenance">Maintenance Mode</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Save Configurations
                  </button>
                </form>
              </div>

              <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Reports generator panel */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3>System Reports</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Export e-commerce or customer tracking logs as downloadable files.</p>
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ metrics, products, recentOrders, customers }, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `LuxuryTech_SystemReport_${new Date().toISOString().split('T')[0]}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Generate Sales Report (JSON)
                  </button>
                  <button
                    onClick={() => {
                      alert('Alert notification sent to all customer dashboards regarding system status update!');
                    }}
                    className="btn-glass"
                    style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--accent-glow)', color: 'var(--text-primary)' }}
                  >
                    Send System Notification
                  </button>
                </div>
              </aside>
            </div>
          )}
        </>
      )}

      {/* Responsive Inline CSS */}
      <style>{`
        @media (max-width: 992px) {
          .admin-charts-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-products-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
