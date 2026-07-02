const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getInvoice
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Invoice download link (could be clicked from browser - we will verify ownership inside controller)
router.get('/:id/invoice', getInvoice);

// Protected routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin-only routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
