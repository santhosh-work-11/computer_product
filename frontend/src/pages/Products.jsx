import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, Search, ArrowUpDown, ShieldAlert } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { isStaticDemo, mockAPI } from '../utils/apiFallback';

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  // Products and loading state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(4000);
  const [stockStatus, setStockStatus] = useState('all'); // all, in-stock
  const [productType, setProductType] = useState('all'); // all, prebuilt, laptop, part, peripheral
  
  // Layout State
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [sortBy, setSortBy] = useState('popularity'); // price-asc, price-desc, rating, popularity
  const [selectedProduct, setSelectedProduct] = useState(null); // for Quick View

  // Update filter hooks if URL search params change
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Load products and categories from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isStaticDemo) {
        setProducts(mockAPI.getProducts());
        setCategories(mockAPI.getCategories());
        setLoading(false);
        return;
      }
      try {
        const prodRes = await fetch('/api/products');
        const catRes = await fetch('/api/products/categories');
        
        if (prodRes.ok && catRes.ok) {
          const prodsData = await prodRes.json();
          const catsData = await catRes.json();
          setProducts(prodsData);
          setCategories(catsData);
        }
      } catch (err) {
        console.error('Error loading catalog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  // Filter and Sort calculation
  const getFilteredProducts = () => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    // Category
    if (selectedCategory) {
      // Find category ID based on slug
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) {
        result = result.filter(p => p.category_id === cat.id);
      }
    }

    // Price limit
    result = result.filter(p => {
      const itemPrice = p.discount_price !== null ? p.discount_price : p.price;
      return itemPrice <= priceRange;
    });

    // Stock Status
    if (stockStatus === 'in-stock') {
      result = result.filter(p => p.stock_status === 'in-stock');
    }

    // Component Type
    if (productType !== 'all') {
      result = result.filter(p => p.type === productType);
    }

    // Sorting
    result.sort((a, b) => {
      const priceA = a.discount_price !== null ? a.discount_price : a.price;
      const priceB = b.discount_price !== null ? b.discount_price : b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      
      // Default / popularity (using review count as popularity index)
      return (b.rating_count || 0) - (a.rating_count || 0);
    });

    return result;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px', minHeight: '80vh' }}>
      
      {/* Top Filter and Search Bar header */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SlidersHorizontal size={20} />
          <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Catalog Catalogue</h2>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({filteredProducts.length} items found)</span>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input"
              style={{ padding: '6px 12px', fontSize: '14px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {/* View Toggler */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'var(--bg-secondary)' : 'transparent',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products display */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }} className="products-grid-layout">
        
        {/* Sidebar Filters */}
        <aside className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', height: 'fit-content' }}>
          {/* Search filter input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Keywords Search</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs, brand..."
                className="glass-input"
                style={{ width: '100%', paddingLeft: '36px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Categories select list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="glass-input"
              style={{ width: '100%', fontSize: '14px' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600 }}>
              <label>Max Price</label>
              <span style={{ color: 'var(--accent-primary)' }}>${priceRange}</span>
            </div>
            <input
              type="range"
              min="20"
              max="4000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-primary)',
                background: 'var(--border-color)',
                height: '6px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Component Types filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Product Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              {[
                { label: 'All Types', value: 'all' },
                { label: 'Prebuilt PCs', value: 'prebuilt' },
                { label: 'Laptops', value: 'laptop' },
                { label: 'Hardware Parts', value: 'part' },
                { label: 'Peripherals', value: 'peripheral' }
              ].map(type => (
                <label key={type.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="productType"
                    checked={productType === type.value}
                    onChange={() => setProductType(type.value)}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  {type.label}
                </label>
              ))}
            </div>
          </div>

          {/* Stock status checkbox */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: 600 }}>Availability</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={stockStatus === 'in-stock'}
                onChange={(e) => setStockStatus(e.target.checked ? 'in-stock' : 'all')}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Catalog Items list */}
        <section style={{ flexGrow: 1 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-panel skeleton" style={{ height: '380px' }} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass-panel" style={{
              padding: '60px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              color: 'var(--text-secondary)'
            }}>
              <ShieldAlert size={48} style={{ color: 'var(--accent-secondary)' }} />
              <h3>No Products Match Your Filters</h3>
              <p style={{ fontSize: '14px', maxWidth: '400px' }}>Try resetting some of your filter options on the sidebar to discover available inventory items.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setPriceRange(4000);
                  setStockStatus('all');
                  setProductType('all');
                }}
                className="btn-secondary"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: viewMode === 'grid' ? 'grid' : 'flex',
              flexDirection: 'column',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {filteredProducts.map((product) => (
                viewMode === 'grid' ? (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                  />
                ) : (
                  // List Mode representation
                  <div 
                    key={product.id} 
                    className="glass-panel" 
                    style={{ 
                      display: 'flex', 
                      gap: '20px', 
                      padding: '20px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      style={{ width: '120px', height: '120px', objectFit: 'contain', background: '#fff', padding: '6px', borderRadius: '8px' }} 
                    />
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600, textTransform: 'uppercase' }}>{product.type}</span>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{product.name}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', maxWidth: '600px' }}>{product.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                        <span style={{ fontSize: '18px', fontWeight: 700 }}>${(product.discount_price || product.price).toFixed(2)}</span>
                        <button onClick={() => setSelectedProduct(product)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>View Details</button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Responsive Inline CSS */}
      <style>{`
        @media (max-width: 768px) {
          .products-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;
