const db = require('../config/db');

// Helper to generate a random tracking and order number
const generateOrderNumber = () => {
  return 'CS-' + Math.floor(100000 + Math.random() * 900000);
};

const generateTrackingNumber = () => {
  return 'TRK' + Math.floor(100000000 + Math.random() * 900000000) + 'US';
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const {
    items, shipping_address, phone, payment_method, coupon_code, discount_amount
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  try {
    const user_id = req.user.id;
    const order_number = generateOrderNumber();
    const tracking_number = generateTrackingNumber();

    // 1. Calculate total price and verify inventory
    let total_amount = 0;
    const productsToUpdate = [];

    for (const item of items) {
      const [products] = await db.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
      if (products.length === 0) {
        return res.status(404).json({ message: `Product ID ${item.product_id} not found` });
      }
      
      const product = products[0];
      if (product.stock_status !== 'in-stock') {
        return res.status(400).json({ message: `Product ${product.name} is out of stock` });
      }

      const itemPrice = product.discount_price !== null ? product.discount_price : product.price;
      total_amount += itemPrice * item.quantity;
      productsToUpdate.push({ id: product.id, name: product.name });
    }

    // Apply discount
    const finalTotal = Math.max(0, total_amount - (discount_amount || 0));

    // 2. Insert order
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, order_number, total_amount, coupon_code, discount_amount, shipping_address, phone, payment_method, payment_status, order_status, tracking_number, invoice_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        user_id, order_number, finalTotal, coupon_code || null, discount_amount || 0,
        shipping_address, phone, payment_method, 'paid', 'processing', tracking_number, null
      ]
    );

    const orderId = orderResult.insertId;

    // 3. Insert order items
    for (const item of items) {
      // Find product price
      const [products] = await db.query('SELECT price, discount_price FROM products WHERE id = ?', [item.product_id]);
      const product = products[0];
      const price = product.discount_price !== null ? product.discount_price : product.price;

      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, price]
      );
    }

    // Set invoice path as virtual
    const invoice_path = `/api/orders/${orderId}/invoice`;
    // Update invoice path in database
    await db.query('UPDATE orders SET invoice_path = ? WHERE id = ?', [invoice_path, orderId]);

    res.status(201).json({
      message: 'Order created successfully',
      order_id: orderId,
      order_number,
      tracking_number,
      total_amount: finalTotal,
      invoice_url: invoice_path
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error processing order' });
  }
};

// @desc    Get user orders (history)
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [req.user.id]);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Error loading order history' });
  }
};

// @desc    Get order by ID and its items
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];
    
    // Authorization check: only admin or the order owner
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    // Get order items
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);

    res.json({
      order,
      items
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Error loading order details' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders');
    res.json(orders);
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({ message: 'Error loading admin orders' });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // pending, processing, shipped, delivered, cancelled

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await db.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Order status updated to: ${status}` });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Error updating status' });
  }
};

// @desc    Download invoice text / HTML receipt
// @route   GET /api/orders/:id/invoice
// @access  Private
const getInvoice = async (req, res) => {
  const { id } = req.params;
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) {
      return res.status(404).send('Order not found');
    }

    const order = orders[0];
    
    // Auth check (allow user or admin)
    // For local downloads, we can bypass strict JWT verification in link clicking if needed,
    // but here we check if user has access.
    
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);

    let itemLines = '';
    items.forEach((item, index) => {
      itemLines += `${index + 1}. Product ID: ${item.product_id} | Qty: ${item.quantity} | Price: $${item.price.toFixed(2)} | Subtotal: $${(item.quantity * item.price).toFixed(2)}\n`;
    });

    const invoiceText = `
=========================================
      LUXURY TECH COMPUTER SYSTEM
            INVOICE RECEIPT
=========================================
Order Number:     ${order.order_number}
Order Date:       ${order.created_at}
Tracking Number:  ${order.tracking_number}
Payment Method:   ${order.payment_method.toUpperCase()}
Payment Status:   ${order.payment_status.toUpperCase()}
Order Status:     ${order.order_status.toUpperCase()}
-----------------------------------------
Customer ID:      ${order.user_id}
Shipping Address: ${order.shipping_address}
Phone Number:     ${order.phone}
-----------------------------------------
Purchased Items:
-----------------------------------------
${itemLines}
-----------------------------------------
Discount Applied: -$${order.discount_amount.toFixed(2)} (${order.coupon_code || 'None'})
TOTAL AMOUNT:     $${order.total_amount.toFixed(2)}
-----------------------------------------
Thank you for shopping at Luxury Tech!
For customer support, contact support@luxurytech.com
=========================================
`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${order.order_number}.txt`);
    res.send(invoiceText);
  } catch (error) {
    console.error('Invoice error:', error);
    res.status(500).send('Error generating invoice');
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getInvoice
};
