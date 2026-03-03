import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5001/api';

const ManageOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API}/orders/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Order status updated!');
      fetchOrders();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Failed to update status');
    }
  };

  const statusColor = (status) => {
    if (status === 'delivered') return '#22C55E';
    if (status === 'cancelled') return '#EF4444';
    if (status === 'processing') return '#3B82F6';
    return '#FFAB91';
  };

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8" style={{ color: '#2D2D2D' }}>Manage Orders</h1>

        {msg && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm text-center" style={{ backgroundColor: '#FFF0EB', color: '#FFAB91' }}>
            {msg}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 opacity-50">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 opacity-50">No orders yet!</div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="rounded-2xl p-5" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#2D2D2D' }}>Order #{order.id.slice(0, 8)}...</p>
                    <p className="text-xs opacity-50">{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="text-xs opacity-50 mt-1">{order.users?.name} • {order.users?.email}</p>
                  </div>
                  <span className="text-xl font-bold" style={{ color: '#FFAB91' }}>৳{order.total_amount}</span>
                </div>

                <div className="flex flex-col gap-1 mb-4">
                  {order.order_items?.map(item => (
                    <p key={item.id} className="text-xs opacity-60">
                      {item.products?.name} x{item.quantity} — ৳{item.price * item.quantity}
                    </p>
                  ))}
                </div>

                <p className="text-xs opacity-60 mb-4">
                  Payment: {order.payment_method} • Address: {order.delivery_address?.slice(0, 40)}...
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs px-3 py-1 rounded-full text-white" style={{ backgroundColor: statusColor(order.status) }}>
                    {order.status}
                  </span>
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button key={s} onClick={() => updateStatus(order.id, s)}
                      disabled={order.status === s}
                      className="text-xs px-3 py-1 rounded-full border hover:opacity-70 transition disabled:opacity-30"
                      style={{ borderColor: '#F8BBD9', color: '#2D2D2D' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;