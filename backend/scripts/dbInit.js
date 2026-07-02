const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'computer_store'
};

async function main() {
  console.log('Starting MySQL database initialization...');

  let connection;
  try {
    // 1. Connect without database first (to create database if not exists)
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    console.log('Connected to MySQL host...');

    // 2. Read and run schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split queries by semicolon (excluding comment lines)
    const queries = schemaSql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0 && !q.startsWith('--'));

    console.log(`Executing ${queries.length} schema creation queries...`);
    for (const query of queries) {
      await connection.query(query);
    }
    console.log('Database tables successfully created!');
    await connection.end();

    // 3. Reconnect directly to the new database to seed it
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database to seed default data...');

    // Check if categories are already seeded
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM categories');
    if (rows[0].count > 0) {
      console.log('Database already has data. Skipping seed phase.');
      await connection.end();
      return;
    }

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('password123', salt);

    // Seed Categories
    console.log('Seeding categories...');
    const categories = [
      ['Gaming PCs', 'gaming-pcs', 'Ultimate gaming desktop systems'],
      ['Laptops', 'laptops', 'Premium business and gaming laptops'],
      ['Graphics Cards', 'graphics-cards', 'NVIDIA GeForce & AMD Radeon GPUs'],
      ['Processors', 'processors', 'Intel Core & AMD Ryzen CPUs'],
      ['Monitors', 'monitors', 'High-refresh rate gaming monitors'],
      ['RAM', 'ram', 'DDR4 & DDR5 high speed memory']
    ];
    for (const cat of categories) {
      await connection.query('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)', cat);
    }

    // Get categories mapping (slug -> ID)
    const [dbCats] = await connection.query('SELECT id, slug FROM categories');
    const catMap = {};
    dbCats.forEach(c => { catMap[c.slug] = c.id; });

    // Seed Users
    console.log('Seeding default accounts...');
    await connection.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', ['admin', 'admin@store.com', adminPassword, 'admin']);
    await connection.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', ['john_doe', 'john@gmail.com', userPassword, 'user']);

    // Seed Products
    console.log('Seeding catalog products...');
    const products = [
      [
        catMap['gaming-pcs'], 'ROG Apex Horizon Gaming PC', 'rog-apex-horizon',
        'Elite pre-built gaming PC featuring Intel Core i9-14900K and NVIDIA RTX 4090.',
        3899.99, 3699.99, 'in-stock',
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600',
        JSON.stringify([
          'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600'
        ]),
        4.9, 24,
        JSON.stringify({ CPU: 'Intel i9-14900K', GPU: 'RTX 4090 24GB', RAM: '64GB DDR5 6000MHz', Storage: '4TB NVMe SSD' }),
        850, 'prebuilt'
      ],
      [
        catMap['laptops'], 'ASUS ROG Zephyrus G16', 'rog-zephyrus-g16',
        'Sleek gaming laptop with Intel Core Ultra 9 and OLED 240Hz screen.',
        2499.99, null, 'in-stock',
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600',
        JSON.stringify([]),
        4.8, 15,
        JSON.stringify({ CPU: 'Intel Ultra 9 185H', GPU: 'RTX 4080 12GB', RAM: '32GB LPDDR5X', Storage: '2TB NVMe SSD' }),
        240, 'laptop'
      ],
      [
        catMap['graphics-cards'], 'NVIDIA GeForce RTX 4080 Super', 'rtx-4080-super',
        'Premium graphics card for high-end 4K gaming and AI rendering.',
        999.99, 949.99, 'in-stock',
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600',
        JSON.stringify([]),
        4.7, 38,
        JSON.stringify({ Memory: '16GB GDDR6X', Interface: 'PCIe 4.0 x16', Ports: '3x DP, 1x HDMI', TDP: '320W' }),
        320, 'part'
      ],
      [
        catMap['processors'], 'AMD Ryzen 7 7800X3D', 'ryzen-7-7800x3d',
        'The best gaming processor with 3D V-Cache technology.',
        399.99, 369.99, 'in-stock',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
        JSON.stringify([]),
        4.95, 112,
        JSON.stringify({ Cores: '8 Cores / 16 Threads', Socket: 'AM5', BaseClock: '4.2GHz', Cache: '104MB L3' }),
        120, 'part'
      ],
      [
        catMap['graphics-cards'], 'ASUS ROG Strix RTX 4090 OC', 'rog-strix-rtx-4090',
        'Ultimate performance graphics card with triple-fan axial cooling.',
        1999.99, null, 'in-stock',
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600',
        JSON.stringify([]),
        4.9, 52,
        JSON.stringify({ Memory: '24GB GDDR6X', Interface: 'PCIe 4.0 x16', TDP: '450W' }),
        450, 'part'
      ],
      [
        catMap['processors'], 'Intel Core i9-14900K', 'core-i9-14900k',
        'Intel 14th Gen unlocked desktop processor.',
        549.99, 529.99, 'in-stock',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
        JSON.stringify([]),
        4.7, 43,
        JSON.stringify({ Cores: '24 Cores (8 P + 16 E)', Socket: 'LGA1700', MaxTurbo: '6.0GHz' }),
        125, 'part'
      ]
    ];

    for (const prod of products) {
      await connection.query(
        'INSERT INTO products (category_id, name, slug, description, price, discount_price, stock_status, image_url, gallery_urls, rating, rating_count, specifications, power_usage, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        prod
      );
    }

    // Seed Services
    console.log('Seeding repair & install services...');
    const services = [
      ['Gaming PC Build', 'Professional hardware assembly, cable management, and thermal optimization.', 99.99, 'Cpu', 'build'],
      ['Computer Repair & Diagnostics', 'Troubleshoot hardware failures, blue screens, and system crashes.', 49.99, 'Wrench', 'repair'],
      ['Data Recovery & Backup', 'Retrieve lost files from corrupted drives, SSDs, or deleted partitions.', 149.99, 'Database', 'repair'],
      ['Annual Maintenance Contract', 'Routine cleaning, hardware tests, OS optimization, and antivirus updates.', 199.99, 'ShieldCheck', 'other']
    ];
    for (const serv of services) {
      await connection.query('INSERT INTO services (title, description, price, icon_name, type) VALUES (?, ?, ?, ?, ?)', serv);
    }

    // Seed Coupons
    console.log('Seeding promo coupons...');
    const coupons = [
      ['GAMER2026', 'percentage', 10.00, 1, '2027-12-31'],
      ['FREESHIP', 'fixed', 20.00, 1, '2027-12-31']
    ];
    for (const coup of coupons) {
      await connection.query('INSERT INTO coupons (code, discount_type, discount_value, active, expiry_date) VALUES (?, ?, ?, ?, ?)', coup);
    }

    console.log('MySQL Database successfully initialized and seeded with default data!');
    await connection.end();
  } catch (err) {
    console.error('MySQL seeding failed:', err.message);
    if (connection) {
      await connection.end();
    }
  }
}

main();
