// Client-Side Simulated Database for GitHub Pages (Static-Only Mode)

// Check if running on GitHub Pages
export const isStaticDemo = window.location.hostname.includes('github.io');

const defaultProducts = [
  {
    id: 1, category_id: 1, name: 'ROG Apex Horizon Gaming PC', slug: 'rog-apex-horizon',
    description: 'Elite pre-built gaming PC featuring Intel Core i9-14900K and NVIDIA RTX 4090.',
    price: 3899.99, discount_price: 3699.99, stock_status: 'in-stock', rating: 4.9, rating_count: 24,
    image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600',
    gallery_urls: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600'
    ],
    power_usage: 850, type: 'prebuilt',
    specifications: { CPU: 'Intel i9-14900K', GPU: 'RTX 4090 24GB', RAM: '64GB DDR5 6000MHz', Storage: '4TB NVMe SSD' }
  },
  {
    id: 2, category_id: 2, name: 'ASUS ROG Zephyrus G16', slug: 'rog-zephyrus-g16',
    description: 'Sleek gaming laptop with Intel Core Ultra 9 and OLED 240Hz screen.',
    price: 2499.99, discount_price: null, stock_status: 'in-stock', rating: 4.8, rating_count: 15,
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600',
    gallery_urls: [],
    power_usage: 240, type: 'laptop',
    specifications: { CPU: 'Intel Ultra 9 185H', GPU: 'RTX 4080 12GB', RAM: '32GB LPDDR5X', Storage: '2TB NVMe SSD' }
  },
  {
    id: 3, category_id: 3, name: 'NVIDIA GeForce RTX 4080 Super', slug: 'rtx-4080-super',
    description: 'Premium graphics card for high-end 4K gaming and AI rendering.',
    price: 999.99, discount_price: 949.99, stock_status: 'in-stock', rating: 4.7, rating_count: 38,
    image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600',
    gallery_urls: [],
    power_usage: 320, type: 'part',
    specifications: { Memory: '16GB GDDR6X', Interface: 'PCIe 4.0 x16', Ports: '3x DP, 1x HDMI', TDP: '320W' }
  },
  {
    id: 4, category_id: 4, name: 'AMD Ryzen 7 7800X3D', slug: 'ryzen-7-7800x3d',
    description: 'The best gaming processor with 3D V-Cache technology.',
    price: 399.99, discount_price: 369.99, stock_status: 'in-stock', rating: 4.95, rating_count: 112,
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    gallery_urls: [],
    power_usage: 120, type: 'part',
    specifications: { Cores: '8 Cores / 16 Threads', Socket: 'AM5', BaseClock: '4.2GHz', Cache: '104MB L3' }
  },
  {
    id: 5, category_id: 3, name: 'ASUS ROG Strix RTX 4090 OC', slug: 'rog-strix-rtx-4090',
    description: 'Ultimate performance graphics card with triple-fan axial cooling.',
    price: 1999.99, discount_price: null, stock_status: 'in-stock', rating: 4.9, rating_count: 52,
    image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600',
    gallery_urls: [],
    power_usage: 450, type: 'part',
    specifications: { Memory: '24GB GDDR6X', Interface: 'PCIe 4.0 x16', TDP: '450W' }
  },
  {
    id: 6, category_id: 4, name: 'Intel Core i9-14900K', slug: 'core-i9-14900k',
    description: 'Intel 14th Gen unlocked desktop processor.',
    price: 549.99, discount_price: 529.99, stock_status: 'in-stock', rating: 4.7, rating_count: 43,
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    gallery_urls: [],
    power_usage: 125, type: 'part',
    specifications: { Cores: '24 Cores (8 P + 16 E)', Socket: 'LGA1700', MaxTurbo: '6.0GHz' }
  }
];

const defaultCategories = [
  { id: 1, name: 'Gaming PCs', slug: 'gaming-pcs', description: 'Ultimate gaming desktop systems' },
  { id: 2, name: 'Laptops', slug: 'laptops', description: 'Premium business and gaming laptops' },
  { id: 3, name: 'Graphics Cards', slug: 'graphics-cards', description: 'NVIDIA GeForce & AMD Radeon GPUs' },
  { id: 4, name: 'Processors', slug: 'processors', description: 'Intel Core & AMD Ryzen CPUs' },
  { id: 5, name: 'Monitors', slug: 'monitors', description: 'High-refresh rate gaming monitors' },
  { id: 6, name: 'RAM', slug: 'ram', description: 'DDR4 & DDR5 high speed memory' }
];

const defaultServices = [
  { id: 1, title: 'Gaming PC Build', description: 'Professional hardware assembly, cable management, and thermal optimization.', price: 99.99, icon_name: 'Cpu', type: 'build' },
  { id: 2, title: 'Computer Repair & Diagnostics', description: 'Troubleshoot hardware failures, blue screens, and system crashes.', price: 49.99, icon_name: 'Wrench', type: 'repair' },
  { id: 3, title: 'Data Recovery & Backup', description: 'Retrieve lost files from corrupted drives, SSDs, or deleted partitions.', price: 149.99, icon_name: 'Database', type: 'repair' },
  { id: 4, title: 'Annual Maintenance Contract', description: 'Routine cleaning, hardware tests, OS optimization, and antivirus updates.', price: 199.99, icon_name: 'ShieldCheck', type: 'other' }
];

const defaultCoupons = [
  { code: 'GAMER2026', discount_type: 'percentage', discount_value: 10 },
  { code: 'FREESHIP', discount_type: 'fixed', discount_value: 20 }
];

// Initialize localStorage values
if (isStaticDemo) {
  if (!localStorage.getItem('demo_products')) {
    localStorage.setItem('demo_products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('demo_orders')) {
    localStorage.setItem('demo_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('demo_categories')) {
    localStorage.setItem('demo_categories', JSON.stringify(defaultCategories));
  }
  if (!localStorage.getItem('demo_coupons')) {
    localStorage.setItem('demo_coupons', JSON.stringify(defaultCoupons));
  }
  if (!localStorage.getItem('demo_users')) {
    localStorage.setItem('demo_users', JSON.stringify([
      { id: 1, username: 'admin', email: 'admin@store.com', role: 'admin' },
      { id: 2, username: 'john_doe', email: 'john@gmail.com', role: 'user' },
      { id: 3, username: 'cyber_builder', email: 'build@cyber.io', role: 'user' }
    ]));
  }
}

// Mock API Call Mappers
export const mockAPI = {
  getProducts: () => {
    return JSON.parse(localStorage.getItem('demo_products')) || defaultProducts;
  },

  getCategories: () => {
    return JSON.parse(localStorage.getItem('demo_categories')) || defaultCategories;
  },

  addCategory: (cat) => {
    const cats = JSON.parse(localStorage.getItem('demo_categories')) || defaultCategories;
    const newId = cats.length > 0 ? Math.max(...cats.map(c => c.id)) + 1 : 1;
    const newC = { ...cat, id: newId, slug: cat.name.toLowerCase().replace(/ /g, '-') };
    cats.push(newC);
    localStorage.setItem('demo_categories', JSON.stringify(cats));
    return newC;
  },

  deleteCategory: (id) => {
    let cats = JSON.parse(localStorage.getItem('demo_categories')) || defaultCategories;
    cats = cats.filter(c => c.id !== id);
    localStorage.setItem('demo_categories', JSON.stringify(cats));
    return true;
  },

  getCoupons: () => {
    return JSON.parse(localStorage.getItem('demo_coupons')) || defaultCoupons;
  },

  addCoupon: (coupon) => {
    const coupons = JSON.parse(localStorage.getItem('demo_coupons')) || defaultCoupons;
    if (coupons.some(c => c.code.toUpperCase() === coupon.code.toUpperCase())) {
      throw new Error('Coupon code already exists');
    }
    coupons.push(coupon);
    localStorage.setItem('demo_coupons', JSON.stringify(coupons));
    return coupon;
  },

  deleteCoupon: (code) => {
    let coupons = JSON.parse(localStorage.getItem('demo_coupons')) || defaultCoupons;
    coupons = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    localStorage.setItem('demo_coupons', JSON.stringify(coupons));
    return true;
  },

  getUsers: () => {
    return JSON.parse(localStorage.getItem('demo_users')) || [];
  },

  toggleUserRole: (id) => {
    const users = JSON.parse(localStorage.getItem('demo_users')) || [];
    const updated = users.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u);
    localStorage.setItem('demo_users', JSON.stringify(updated));
    return true;
  },

  deleteUser: (id) => {
    let users = JSON.parse(localStorage.getItem('demo_users')) || [];
    users = users.filter(u => u.id !== id);
    localStorage.setItem('demo_users', JSON.stringify(users));
    return true;
  },

  getServices: () => {
    return defaultServices;
  },

  applyCoupon: (code) => {
    const coupons = JSON.parse(localStorage.getItem('demo_coupons')) || defaultCoupons;
    const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!found) throw new Error('Invalid coupon code');
    return found;
  },

  login: (email, password) => {
    if (email === 'admin@store.com' && password === 'admin123') {
      return { id: 1, username: 'admin', email: 'admin@store.com', role: 'admin', token: 'mock-admin-token' };
    }
    return { id: 2, username: 'john_doe', email: email, role: 'user', token: 'mock-user-token' };
  },

  register: (username, email, password) => {
    return { id: 3, username: username, email: email, role: 'user', token: 'mock-user-token' };
  },

  createOrder: (payload) => {
    const orders = JSON.parse(localStorage.getItem('demo_orders')) || [];
    const orderId = orders.length + 1;
    const order_number = 'CS-' + Math.floor(100000 + Math.random() * 900000);
    const tracking_number = 'TRK' + Math.floor(100000000 + Math.random() * 900000000) + 'US';
    
    const newOrder = {
      id: orderId,
      order_number,
      tracking_number,
      total_amount: payload.total_amount || 0,
      shipping_address: payload.shipping_address,
      phone: payload.phone,
      payment_method: payload.payment_method,
      order_status: 'processing',
      created_at: new Date().toISOString(),
      items: payload.items
    };

    orders.push(newOrder);
    localStorage.setItem('demo_orders', JSON.stringify(orders));
    return {
      order_id: orderId,
      order_number,
      tracking_number,
      total_amount: newOrder.total_amount,
      invoice_url: '#'
    };
  },

  getMyOrders: () => {
    return JSON.parse(localStorage.getItem('demo_orders')) || [];
  },

  getDashboardStats: () => {
    const orders = JSON.parse(localStorage.getItem('demo_orders')) || [];
    const products = JSON.parse(localStorage.getItem('demo_products')) || defaultProducts;

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
    
    const categorySales = [
      { name: 'Gaming PCs', value: 12 },
      { name: 'Laptops', value: 8 },
      { name: 'Graphics Cards', value: 24 },
      { name: 'Processors', value: 16 }
    ];

    const monthlyRevenue = [
      { month: 'Jan', sales: 12000 },
      { month: 'Feb', sales: 19000 },
      { month: 'Mar', sales: 15000 },
      { month: 'Apr', sales: 24000 },
      { month: 'May', sales: 22000 },
      { month: 'Jun', sales: totalRevenue > 0 ? totalRevenue : 32000 }
    ];

    return {
      metrics: {
        totalRevenue: totalRevenue || 124000,
        totalOrders: orders.length || 18,
        totalProducts: products.length,
        totalUsers: 14
      },
      recentOrders: orders.length > 0 ? orders : [
        { id: 1, order_number: 'CS-481923', shipping_address: '100 Silicon Blvd, CA', payment_method: 'card', total_amount: 1999.99, order_status: 'delivered' },
        { id: 2, order_number: 'CS-892301', shipping_address: '250 Tech St, NY', payment_method: 'cod', total_amount: 549.99, order_status: 'processing' }
      ],
      monthlyRevenue,
      categorySales,
      lowStockAlerts: []
    };
  },

  addProduct: (product) => {
    const products = JSON.parse(localStorage.getItem('demo_products')) || defaultProducts;
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newP = {
      ...product,
      id: newId,
      rating: 5,
      rating_count: 0
    };
    products.push(newP);
    localStorage.setItem('demo_products', JSON.stringify(products));
    return newP;
  },

  deleteProduct: (id) => {
    let products = JSON.parse(localStorage.getItem('demo_products')) || defaultProducts;
    products = products.filter(p => p.id !== id);
    localStorage.setItem('demo_products', JSON.stringify(products));
    return true;
  }
};
