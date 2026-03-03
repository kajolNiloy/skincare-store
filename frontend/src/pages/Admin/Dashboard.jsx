import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../services/api';
import axios from 'axios';

const API = 'https://peachskin-backend.onrender.com/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [prodRes, orderRes] = await Promise.all([
          getProducts(),
          axios.get(`${API}/orders/all`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const orders = orderRes.data.orders || [];
        const revenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        setStats({
          products: prodRes.data.products.length,
          orders: orders.length,
          revenue
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D' }}>Admin Dashboard</h1>
        <p className="opacity-60 mb-10 text-sm" style={{ color: '#2D2D2D' }}>Welcome back, {user?.name}</p>

        {/* Stats */}
        {loading ? (
          <div className="text-center py-10 opacity-50">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Products', value: stats.products, icon: '🧴' },
              { label: 'Total Orders', value: stats.orders, icon: '📦' },
              { label: 'Total Revenue', value: `৳${stats.revenue}`, icon: '💰' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl p-6 text-center" style={{ backgroundColor: '#FFF0EB' }}>
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-2xl font-bold mb-1" style={{ color: '#FFAB91' }}>{stat.value}</p>
                <p className="text-sm opacity-60" style={{ color: '#2D2D2D' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/products" className="rounded-2xl p-6 hover:shadow-md transition" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
            <div className="text-3xl mb-3">🧴</div>
            <h2 className="font-bold text-lg mb-1" style={{ color: '#2D2D2D' }}>Manage Products</h2>
            <p className="text-sm opacity-60" style={{ color: '#2D2D2D' }}>Add, edit or delete products</p>
          </Link>
          <Link to="/admin/orders" className="rounded-2xl p-6 hover:shadow-md transition" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
            <div className="text-3xl mb-3">📦</div>
            <h2 className="font-bold text-lg mb-1" style={{ color: '#2D2D2D' }}>Manage Orders</h2>
            <p className="text-sm opacity-60" style={{ color: '#2D2D2D' }}>View and update order status</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;