const db = require('../config/db');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category_id } = req.query;
  try {
    let queryStr = 'SELECT * FROM products';
    let params = [];

    if (category_id) {
      queryStr = 'SELECT * FROM products WHERE category_id = ?';
      params = [category_id];
    }

    const [products] = await db.query(queryStr, params);
    
    // Parse JSON fields if using MySQL (the mock driver already returns parsed objects/strings)
    const formattedProducts = products.map(product => {
      let specifications = product.specifications;
      let gallery_urls = product.gallery_urls;

      if (typeof specifications === 'string') {
        try { specifications = JSON.parse(specifications); } catch (e) {}
      }
      if (typeof gallery_urls === 'string') {
        try { gallery_urls = JSON.parse(gallery_urls); } catch (e) {}
      }

      return {
        ...product,
        specifications,
        gallery_urls
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    let specifications = product.specifications;
    let gallery_urls = product.gallery_urls;

    if (typeof specifications === 'string') {
      try { specifications = JSON.parse(specifications); } catch (e) {}
    }
    if (typeof gallery_urls === 'string') {
      try { gallery_urls = JSON.parse(gallery_urls); } catch (e) {}
    }

    res.json({
      ...product,
      specifications,
      gallery_urls
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Error retrieving product details' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const {
    category_id, name, description, price, discount_price,
    stock_status, image_url, gallery_urls, specifications, power_usage, type
  } = req.body;

  if (!category_id || !name || !price) {
    return res.status(400).json({ message: 'Category, Name, and Price are required' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const specsStr = typeof specifications === 'object' ? JSON.stringify(specifications) : specifications || '{}';
    const galleryStr = Array.isArray(gallery_urls) ? JSON.stringify(gallery_urls) : gallery_urls || '[]';

    const [result] = await db.query(
      'INSERT INTO products (category_id, name, slug, description, price, discount_price, stock_status, image_url, gallery_urls, rating, rating_count, specifications, power_usage, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        category_id, name, slug, description || '', price, discount_price || null,
        stock_status || 'in-stock', image_url || '', galleryStr, 5.0, 0, specsStr, power_usage || 0, type || 'part'
      ]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      price
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error adding product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, description, price, stock_status } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.query(
      'UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, stock_status = ? WHERE id = ?',
      [category_id, name, description || '', price, stock_status, id]
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: 'Error getting categories' });
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const [services] = await db.query('SELECT * FROM services');
    res.json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ message: 'Error getting services' });
  }
};

// @desc    Apply coupon
// @route   POST /api/products/coupon
// @access  Public
const applyCoupon = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Coupon code is required' });
  }

  try {
    const [coupons] = await db.query('SELECT * FROM coupons WHERE code = ?', [code]);
    if (coupons.length === 0) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    const coupon = coupons[0];
    
    // Check expiry
    const expiry = new Date(coupon.expiry_date);
    if (expiry < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    res.json({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value
    });
  } catch (error) {
    console.error('Coupon lookup error:', error);
    res.status(500).json({ message: 'Server error during coupon validation' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getServices,
  applyCoupon
};
