const supabase = require('../config/supabase');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all products
const getProducts = async (req, res) => {
  try {
    const { category, skin_type, search } = req.query;

    let query = supabase.from('products').select('*, categories(name)');

    if (category) query = query.eq('category_id', category);
    if (skin_type) query = query.eq('skin_type', skin_type);
    if (search) query = query.ilike('name', `%${search}%`);

    const { data, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    res.json({ products: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Product not found' });

    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create product (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id, skin_type } = req.body;

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        images.push(result.secure_url);
      }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, stock, category_id, skin_type, images }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json({ message: 'Product created successfully', product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product (admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Product updated successfully', product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };