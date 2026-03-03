const supabase = require('../config/supabase');

// Place an order
const createOrder = async (req, res) => {
  try {
    const { items, delivery_address, payment_method } = req.body;
    const user_id = req.user.id;

    // Calculate total
    let total_amount = 0;
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('price, stock')
        .eq('id', item.product_id)
        .single();

      if (!product) return res.status(404).json({ error: `Product not found` });
      if (product.stock < item.quantity) return res.status(400).json({ error: `Not enough stock` });

      total_amount += product.price * item.quantity;
    }

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert([{ user_id, total_amount, delivery_address, payment_method }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) return res.status(500).json({ error: itemsError.message });

    // Update stock
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      await supabase
        .from('products')
        .update({ stock: product.stock - item.quantity })
        .eq('id', item.product_id);
    }

    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get my orders (customer)
const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name, images))')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, users(name, email), order_items(*, products(name))')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json({ orders: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .update({ status, payment_status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Order updated successfully', order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };