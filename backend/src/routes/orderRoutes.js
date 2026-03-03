const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer - place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, delivery_address, payment_method } = req.body;
    const user_id = req.user.id;

    const total_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order, error } = await supabase
      .from('orders')
      .insert([{ user_id, total_amount, delivery_address, payment_method }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) return res.status(500).json({ error: itemsError.message });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer - get my orders
router.get('/my', protect, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name))')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - get all orders
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name)), users(name, email)')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Status updated', order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;