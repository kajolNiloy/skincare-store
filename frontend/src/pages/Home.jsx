import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.products.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ backgroundColor: '#FFFDF9' }}>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center" style={{ background: 'linear-gradient(135deg, #FFF0EB 0%, #F8BBD9 100%)' }}>
        <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: '#D4A574' }}>Natural • Gentle • Effective</p>
        <h1 className="text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
          Glow From Within
        </h1>
        <p className="text-lg mb-8 max-w-xl mx-auto opacity-70 text-center" style={{ color: '#2D2D2D' }}>
          Discover skincare made with the purest ingredients. Because your skin deserves the best.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/shop" className="px-8 py-3 rounded-full text-white font-medium hover:opacity-90 transition" style={{ backgroundColor: '#FFAB91' }}>
            Shop Now
          </Link>
          <Link to="/shop" className="px-8 py-3 rounded-full font-medium hover:opacity-70 transition border" style={{ borderColor: '#FFAB91', color: '#FFAB91' }}>
            Learn More
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
          Shop by Category
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['Moisturizer', 'Cleanser', 'Serum', 'Sunscreen', 'Toner'].map(cat => (
            <Link
              key={cat}
              to={`/shop?category=${cat.toLowerCase()}`}
              className="px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition"
              style={{ backgroundColor: '#F8BBD9', color: '#2D2D2D' }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
          Featured Products
        </h2>

        {loading ? (
          <div className="text-center py-20 opacity-50">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 opacity-50">No products yet. Check back soon! 🍑</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition" style={{ backgroundColor: '#fff' }}>
                <div className="h-48 flex items-center justify-center text-6xl" style={{ backgroundColor: '#FFF0EB' }}>
                  🍑
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#2D2D2D' }}>{product.name}</h3>
                  <p className="text-xs opacity-60 mb-2" style={{ color: '#2D2D2D' }}>{product.skin_type} skin</p>
                  <p className="font-bold" style={{ color: '#FFAB91' }}>৳{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/shop" className="px-8 py-3 rounded-full text-white font-medium hover:opacity-90 transition" style={{ backgroundColor: '#FFAB91' }}>
            View All Products
          </Link>
        </div>
      </section>

      {/* Why PeachSkin */}
      <section className="px-6 py-16 mt-10" style={{ backgroundColor: '#FFF0EB' }}>
        <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
          Why PeachSkin?
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '🌿', title: 'Natural Ingredients', desc: 'No harmful chemicals. Only the purest ingredients from nature.' },
            { icon: '🐰', title: 'Cruelty Free', desc: 'All our products are tested safely and never on animals.' },
            { icon: '✨', title: 'Dermatologist Tested', desc: 'Formulated and approved by skincare professionals.' },
          ].map(item => (
            <div key={item.title} className="flex flex-col items-center gap-3">
              <span className="text-5xl">{item.icon}</span>
              <h3 className="font-semibold text-lg" style={{ color: '#2D2D2D' }}>{item.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed" style={{ color: '#2D2D2D' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;