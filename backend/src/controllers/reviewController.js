const supabase = require('../config/supabase');

// Add a review
const addReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;
    const user_id = req.user.id;

    // Check if user already reviewed this product
    const { data: existing } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert([{ user_id, product_id, rating, comment }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: 'Review added successfully', review: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;

    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(name)')
      .eq('product_id', product_id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Calculate average rating
    const avgRating = data.length > 0
      ? (data.reduce((sum, r) => sum + r.rating, 0) / data.length).toFixed(1)
      : 0;

    res.json({ reviews: data, average_rating: avgRating, total: data.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a review (admin only)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addReview, getProductReviews, deleteReview };