const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  addReview,
  getProductReviews,
  deleteReview
} = require('../controllers/reviewController');

// Public routes
router.get('/:product_id', getProductReviews);

// Customer routes
router.post('/', protect, addReview);

// Admin routes
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;