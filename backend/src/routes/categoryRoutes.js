const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json({ categories: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;