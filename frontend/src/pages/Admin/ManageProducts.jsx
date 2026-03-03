import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/api';
import axios from 'axios';

const API = 'http://localhost:5001/api';

const ManageProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '',
    skin_type: '', category_id: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        axios.get(`${API}/categories`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProducts(prodRes.data.products);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/products`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Product created successfully!');
      setForm({ name: '', description: '', price: '', stock: '', skin_type: '', category_id: '' });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to create product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Product deleted!');
      fetchAll();
    } catch (err) {
      setMsg('Failed to delete product');
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: '#2D2D2D' }}>Manage Products</h1>
          <button onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 rounded-full text-white font-medium hover:opacity-90 transition"
            style={{ backgroundColor: '#FFAB91' }}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {msg && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm text-center" style={{ backgroundColor: '#FFF0EB', color: '#FFAB91' }}>
            {msg}
          </div>
        )}

        {/* Add Product Form */}
        {showForm && (
          <div className="rounded-2xl p-6 mb-8" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
            <h2 className="font-bold mb-4" style={{ color: '#2D2D2D' }}>New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Product Name', placeholder: 'e.g. Hydrating Face Cream' },
                { key: 'price', label: 'Price (৳)', placeholder: 'e.g. 599' },
                { key: 'stock', label: 'Stock', placeholder: 'e.g. 50' },
                { key: 'skin_type', label: 'Skin Type', placeholder: 'e.g. dry, oily, all' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border outline-none"
                    style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }}
                  />
                </div>
              ))}

              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Category</label>
                <select
                  value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border outline-none"
                  style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }}>
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Description</label>
                <textarea
                  placeholder="Product description..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border outline-none resize-none"
                  style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }}
                  rows={3}
                />
              </div>
            </div>

            <button onClick={handleCreate}
              className="mt-4 px-8 py-3 rounded-full text-white font-medium hover:opacity-90 transition"
              style={{ backgroundColor: '#FFAB91' }}>
              Create Product
            </button>
          </div>
        )}

        {/* Products List */}
        {loading ? (
          <div className="text-center py-10 opacity-50">Loading...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map(product => (
              <div key={product.id} className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: '#FFF0EB' }}>
                  🧴
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: '#2D2D2D' }}>{product.name}</h3>
                  <p className="text-xs opacity-60">{product.categories?.name} • {product.skin_type} skin</p>
                  <p className="text-sm font-bold mt-1" style={{ color: '#FFAB91' }}>৳{product.price} • Stock: {product.stock}</p>
                </div>
                <button onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-70 transition"
                  style={{ backgroundColor: '#FFE5E5', color: '#E53E3E' }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;