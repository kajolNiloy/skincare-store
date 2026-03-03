import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['All', 'Moisturizer', 'Cleanser', 'Serum', 'Sunscreen', 'Toner'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === '' || selectedCategory === 'All'
      ? true
      : p.categories?.name === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
            Our Products
          </h1>
          <p className="opacity-60" style={{ color: '#2D2D2D' }}>Find the perfect skincare for your routine</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full border outline-none"
            style={{ borderColor: '#F8BBD9', backgroundColor: '#fff' }}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium transition"
              style={{
                backgroundColor: selectedCategory === cat || (selectedCategory === '' && cat === 'All') ? '#FFAB91' : '#F8BBD9',
                color: '#2D2D2D'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 opacity-50">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 opacity-50">No products found 🍑</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map(product => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                style={{ backgroundColor: '#fff' }}
              >
                <div className="h-48 flex items-center justify-center text-6xl" style={{ backgroundColor: '#FFF0EB' }}>
                  🍑
                </div>
                <div className="p-4">
                  <p className="text-xs mb-1 font-medium" style={{ color: '#FFAB91' }}>{product.categories?.name}</p>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#2D2D2D' }}>{product.name}</h3>
                  <p className="text-xs opacity-60 mb-3" style={{ color: '#2D2D2D' }}>{product.skin_type} skin</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold" style={{ color: '#FFAB91' }}>৳{product.price}</p>
                    <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#F8BBD9', color: '#2D2D2D' }}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;