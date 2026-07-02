const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuration
const useFallback = process.env.DB_FALLBACK !== 'false';
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'computer_store'
};

let pool = null;
let isFallbackActive = false;

// Fallback JSON database file paths
const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read/write JSON tables
function readTable(tableName) {
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    // Return empty array or default seeds if available
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeTable(tableName, data) {
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Seed JSON tables if empty
function seedJSONDatabase() {
  const seeds = {
    users: [
      { id: 1, username: 'admin', email: 'admin@store.com', password: '$2a$10$wK1Gv5.sYnE7Ghyf99Lq1O4v0nOswP6G0Qz/lW9y8Tj1zP5j6nN6y', role: 'admin', created_at: new Date().toISOString() }, // password: admin123
      { id: 2, username: 'john_doe', email: 'john@gmail.com', password: '$2a$10$tZ26Y1nreN4i.B8H3v8hye092Fm3p1SgR7jN5m5i2g9K2f5hN5n1y', role: 'user', created_at: new Date().toISOString() } // password: password123
    ],
    categories: [
      { id: 1, name: 'Gaming PCs', slug: 'gaming-pcs', description: 'Ultimate gaming desktop systems' },
      { id: 2, name: 'Laptops', slug: 'laptops', description: 'Premium business and gaming laptops' },
      { id: 3, name: 'Graphics Cards', slug: 'graphics-cards', description: 'NVIDIA GeForce & AMD Radeon GPUs' },
      { id: 4, name: 'Processors', slug: 'processors', description: 'Intel Core & AMD Ryzen CPUs' },
      { id: 5, name: 'Monitors', slug: 'monitors', description: 'High-refresh rate gaming monitors' },
      { id: 6, name: 'RAM', slug: 'ram', description: 'DDR4 & DDR5 high speed memory' }
    ],
    products: [
      {
        id: 1, category_id: 1, name: 'ROG Apex Horizon Gaming PC', slug: 'rog-apex-horizon',
        description: 'Elite pre-built gaming PC featuring Intel Core i9-14900K and NVIDIA RTX 4090.',
        price: 3899.99, discount_price: 3699.99, stock_status: 'in-stock', rating: 4.9, rating_count: 24,
        image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600',
        gallery_urls: JSON.stringify([
          'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600'
        ]),
        power_usage: 850, type: 'prebuilt',
        specifications: JSON.stringify({ CPU: 'Intel i9-14900K', GPU: 'RTX 4090 24GB', RAM: '64GB DDR5 6000MHz', Storage: '4TB NVMe SSD' })
      },
      {
        id: 2, category_id: 2, name: 'ASUS ROG Zephyrus G16', slug: 'rog-zephyrus-g16',
        description: 'Sleek gaming laptop with Intel Core Ultra 9 and OLED 240Hz screen.',
        price: 2499.99, discount_price: null, stock_status: 'in-stock', rating: 4.8, rating_count: 15,
        image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600',
        gallery_urls: JSON.stringify([]),
        power_usage: 240, type: 'laptop',
        specifications: JSON.stringify({ CPU: 'Intel Ultra 9 185H', GPU: 'RTX 4080 12GB', RAM: '32GB LPDDR5X', Storage: '2TB NVMe SSD' })
      },
      {
        id: 3, category_id: 3, name: 'NVIDIA GeForce RTX 4080 Super', slug: 'rtx-4080-super',
        description: 'Premium graphics card for high-end 4K gaming and AI rendering.',
        price: 999.99, discount_price: 949.99, stock_status: 'in-stock', rating: 4.7, rating_count: 38,
        image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600',
        gallery_urls: JSON.stringify([]),
        power_usage: 320, type: 'part',
        specifications: JSON.stringify({ Memory: '16GB GDDR6X', Interface: 'PCIe 4.0 x16', Ports: '3x DP, 1x HDMI', TDP: '320W' })
      },
      {
        id: 4, category_id: 4, name: 'AMD Ryzen 7 7800X3D', slug: 'ryzen-7-7800x3d',
        description: 'The best gaming processor with 3D V-Cache technology.',
        price: 399.99, discount_price: 369.99, stock_status: 'in-stock', rating: 4.95, rating_count: 112,
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
        gallery_urls: JSON.stringify([]),
        power_usage: 120, type: 'part',
        specifications: JSON.stringify({ Cores: '8 Cores / 16 Threads', Socket: 'AM5', BaseClock: '4.2GHz', Cache: '104MB L3' })
      },
      {
        id: 5, category_id: 3, name: 'ASUS ROG Strix RTX 4090 OC', slug: 'rog-strix-rtx-4090',
        description: 'Ultimate performance graphics card with triple-fan axial cooling.',
        price: 1999.99, discount_price: null, stock_status: 'in-stock', rating: 4.9, rating_count: 52,
        image_url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600',
        gallery_urls: JSON.stringify([]),
        power_usage: 450, type: 'part',
        specifications: JSON.stringify({ Memory: '24GB GDDR6X', Interface: 'PCIe 4.0 x16', TDP: '450W' })
      },
      {
        id: 6, category_id: 4, name: 'Intel Core i9-14900K', slug: 'core-i9-14900k',
        description: 'Intel 14th Gen unlocked desktop processor.',
        price: 549.99, discount_price: 529.99, stock_status: 'in-stock', rating: 4.7, rating_count: 43,
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
        gallery_urls: JSON.stringify([]),
        power_usage: 125, type: 'part',
        specifications: JSON.stringify({ Cores: '24 Cores (8 P + 16 E)', Socket: 'LGA1700', MaxTurbo: '6.0GHz' })
      }
    ],
    services: [
      { id: 1, title: 'Gaming PC Build', description: 'Professional hardware assembly, cable management, and thermal optimization.', price: 99.99, icon_name: 'Cpu', type: 'build' },
      { id: 2, title: 'Computer Repair & Diagnostics', description: 'Troubleshoot hardware failures, blue screens, and system crashes.', price: 49.99, icon_name: 'Wrench', type: 'repair' },
      { id: 3, title: 'Data Recovery & Backup', description: 'Retrieve lost files from corrupted drives, SSDs, or deleted partitions.', price: 149.99, icon_name: 'Database', type: 'repair' },
      { id: 4, title: 'Annual Maintenance Contract', description: 'Routine cleaning, hardware tests, OS optimization, and antivirus updates.', price: 199.99, icon_name: 'ShieldCheck', type: 'other' }
    ],
    coupons: [
      { id: 1, code: 'GAMER2026', discount_type: 'percentage', discount_value: 10, active: 1, expiry_date: '2027-12-31' },
      { id: 2, code: 'FREESHIP', discount_type: 'fixed', discount_value: 20, active: 1, expiry_date: '2027-12-31' }
    ],
    orders: [],
    order_items: [],
    reviews: []
  };

  Object.keys(seeds).forEach(table => {
    const filePath = path.join(DATA_DIR, `${table}.json`);
    if (!fs.existsSync(filePath)) {
      writeTable(table, seeds[table]);
    }
  });
}

// Attempt to initialize MySQL Pool
async function initMySQL() {
  try {
    pool = mysql.createPool({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    // Test connection
    const conn = await pool.getConnection();
    console.log(`Successfully connected to MySQL database: ${dbConfig.database}`);
    conn.release();
  } catch (error) {
    console.warn(`MySQL Connection failed: ${error.message}`);
    if (useFallback) {
      console.log('Falling back to local JSON file-based database...');
      isFallbackActive = true;
      seedJSONDatabase();
    } else {
      throw error;
    }
  }
}

// Emulate SQL operations in Javascript for JSON files
function emulateQuery(sql, params = []) {
  const normalizedSql = sql.trim().replace(/\s+/g, ' ');
  
  // 1. SELECT * FROM users WHERE email = ?
  if (normalizedSql.match(/SELECT \* FROM users WHERE email = \?/i)) {
    const users = readTable('users');
    const user = users.find(u => u.email === params[0]);
    return [user ? [user] : [], []];
  }
  
  // 2. INSERT INTO users
  if (normalizedSql.match(/INSERT INTO users/i)) {
    const users = readTable('users');
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username: params[0],
      email: params[1],
      password: params[2],
      role: params[3] || 'user',
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    writeTable('users', users);
    return [{ insertId: newUser.id }, []];
  }
  
  // 3. SELECT * FROM categories
  if (normalizedSql.match(/SELECT \* FROM categories/i)) {
    return [readTable('categories'), []];
  }
  
  // 4. SELECT * FROM products
  if (normalizedSql.match(/SELECT \* FROM products/i)) {
    let products = readTable('products');
    // If filtering by ID is in the query (simple regex check for product ID)
    if (normalizedSql.match(/WHERE id = \?/i)) {
      const prod = products.find(p => p.id == params[0]);
      return [prod ? [prod] : [], []];
    }
    if (normalizedSql.match(/WHERE category_id = \?/i)) {
      products = products.filter(p => p.category_id == params[0]);
    }
    return [products, []];
  }
  
  // 5. INSERT INTO products
  if (normalizedSql.match(/INSERT INTO products/i)) {
    const products = readTable('products');
    const newProd = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      category_id: params[0],
      name: params[1],
      slug: params[2],
      description: params[3],
      price: parseFloat(params[4]),
      discount_price: params[5] ? parseFloat(params[5]) : null,
      stock_status: params[6] || 'in-stock',
      image_url: params[7],
      gallery_urls: params[8] || '[]',
      rating: parseFloat(params[9] || 5),
      rating_count: parseInt(params[10] || 0),
      specifications: params[11] || '{}',
      power_usage: parseInt(params[12] || 0),
      type: params[13] || 'part'
    };
    products.push(newProd);
    writeTable('products', products);
    return [{ insertId: newProd.id }, []];
  }
  
  // 6. UPDATE products
  if (normalizedSql.match(/UPDATE products SET/i)) {
    const products = readTable('products');
    // For simplicity, match parameters based on order. Let's make it robust if needed.
    // In our controllers, we will update products. We can implement updates easily.
    // Match ID at the end of the query parameter list
    const prodId = params[params.length - 1];
    const index = products.findIndex(p => p.id == prodId);
    if (index !== -1) {
      // Basic update simulation
      products[index] = { ...products[index] };
      // Map params: name=?, price=?, stock_status=?, rating=?
      // Let's implement a simple direct update based on standard controllers
      if (params.length === 6) { // category_id, name, description, price, stock_status, id
        products[index].category_id = params[0];
        products[index].name = params[1];
        products[index].description = params[2];
        products[index].price = parseFloat(params[3]);
        products[index].stock_status = params[4];
      }
      writeTable('products', products);
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  // 7. DELETE FROM products WHERE id = ?
  if (normalizedSql.match(/DELETE FROM products WHERE id = \?/i)) {
    const products = readTable('products');
    const newProducts = products.filter(p => p.id != params[0]);
    writeTable('products', newProducts);
    return [{ affectedRows: products.length !== newProducts.length ? 1 : 0 }, []];
  }
  
  // 8. SELECT * FROM services
  if (normalizedSql.match(/SELECT \* FROM services/i)) {
    return [readTable('services'), []];
  }
  
  // 9. SELECT * FROM coupons WHERE code = ?
  if (normalizedSql.match(/SELECT \* FROM coupons WHERE code = \?/i)) {
    const coupons = readTable('coupons');
    const coupon = coupons.find(c => c.code.toUpperCase() === params[0].toUpperCase() && c.active == 1);
    return [coupon ? [coupon] : [], []];
  }
  
  // 10. INSERT INTO orders
  if (normalizedSql.match(/INSERT INTO orders/i)) {
    const orders = readTable('orders');
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      user_id: params[0],
      order_number: params[1],
      total_amount: parseFloat(params[2]),
      coupon_code: params[3] || null,
      discount_amount: parseFloat(params[4] || 0),
      shipping_address: params[5],
      phone: params[6],
      payment_method: params[7],
      payment_status: params[8] || 'pending',
      order_status: params[9] || 'pending',
      tracking_number: params[10] || null,
      invoice_path: params[11] || null,
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    writeTable('orders', orders);
    return [{ insertId: newOrder.id }, []];
  }
  
  // 11. INSERT INTO order_items
  if (normalizedSql.match(/INSERT INTO order_items/i)) {
    const items = readTable('order_items');
    const newItem = {
      id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
      order_id: params[0],
      product_id: params[1],
      quantity: params[2],
      price: parseFloat(params[3])
    };
    items.push(newItem);
    writeTable('order_items', items);
    return [{ insertId: newItem.id }, []];
  }
  
  // 12. SELECT * FROM orders / SELECT * FROM orders WHERE user_id = ?
  if (normalizedSql.match(/SELECT \* FROM orders/i)) {
    let orders = readTable('orders');
    if (normalizedSql.match(/WHERE user_id = \?/i)) {
      orders = orders.filter(o => o.user_id == params[0]);
    }
    if (normalizedSql.match(/WHERE order_number = \?/i)) {
      orders = orders.filter(o => o.order_number == params[0]);
    }
    // Sort descending by id (latest orders first)
    orders.sort((a, b) => b.id - a.id);
    return [orders, []];
  }

  // 13. SELECT * FROM order_items WHERE order_id = ?
  if (normalizedSql.match(/SELECT \* FROM order_items WHERE order_id = \?/i)) {
    const items = readTable('order_items');
    const products = readTable('products');
    const filteredItems = items.filter(item => item.order_id == params[0]).map(item => {
      const product = products.find(p => p.id == item.product_id);
      return {
        ...item,
        product_name: product ? product.name : 'Unknown Product',
        product_image: product ? product.image_url : ''
      };
    });
    return [filteredItems, []];
  }

  // 14. UPDATE orders SET order_status = ? WHERE id = ?
  if (normalizedSql.match(/UPDATE orders SET order_status = \? WHERE id = \?/i)) {
    const orders = readTable('orders');
    const index = orders.findIndex(o => o.id == params[1]);
    if (index !== -1) {
      orders[index].order_status = params[0];
      writeTable('orders', orders);
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  // 15. SELECT * FROM reviews WHERE product_id = ?
  if (normalizedSql.match(/SELECT \* FROM reviews WHERE product_id = \?/i)) {
    const reviews = readTable('reviews');
    const users = readTable('users');
    const filteredReviews = reviews.filter(r => r.product_id == params[0]).map(r => {
      const user = users.find(u => u.id == r.user_id);
      return {
        ...r,
        username: user ? user.username : 'Anonymous'
      };
    });
    return [filteredReviews, []];
  }

  // 16. INSERT INTO reviews
  if (normalizedSql.match(/INSERT INTO reviews/i)) {
    const reviews = readTable('reviews');
    const newReview = {
      id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
      product_id: params[0],
      user_id: params[1],
      rating: parseInt(params[2]),
      comment: params[3],
      created_at: new Date().toISOString()
    };
    reviews.push(newReview);
    writeTable('reviews', reviews);
    return [{ insertId: newReview.id }, []];
  }

  // 17. Default fallback query logger
  console.warn(`Unmatched emulated SQL query: ${normalizedSql}`);
  return [[], []];
}

// Exported db wrapper mimicking mysql2 promise structure
const db = {
  query: async function(sql, params) {
    if (isFallbackActive) {
      return emulateQuery(sql, params);
    }
    try {
      if (!pool) {
        await initMySQL();
        if (isFallbackActive) {
          return emulateQuery(sql, params);
        }
      }
      return await pool.query(sql, params);
    } catch (err) {
      console.error('Database query error:', err);
      throw err;
    }
  },
  isFallback: () => isFallbackActive
};

module.exports = db;
