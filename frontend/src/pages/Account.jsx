import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const statusColor = (status) => {
    if (status === 'delivered') return '#22C55E';
    if (status === 'cancelled') return '#EF4444';
    return '#FFAB91';
  };

  const serif = { fontFamily: 'Playfair Display, serif' };

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-4xl mx-auto">

        <div className="rounded-3xl p-6 mb-8 flex items-center gap-5" style={{ backgroundColor: '#FFF0EB' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: '#FFAB91' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold" style={{ ...serif, color: '#2D2D2D' }}>{user?.name}</h1>
            <p className="text-sm opacity-60" style={{ color: '#2D2D2D' }}>{user?.email}</p>
            <span className="text-xs px-3 py-1 rounded-full mt-1 inline-block" style={{ backgroundColor: '#FFAB91', color: '#fff' }}>
              {user?.role}
            </span>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="px-5 py-2 rounded-full border text-sm font-medium hover:opacity-70 transition"
            style={{ borderColor: '#FFAB91', color: '#FFAB91' }}>
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6" style={{ ...serif, color: '#2D2D2D' }}>
          My Orders
        </h2>

        {loading ? (
          <div className="text-center py-10 opacity-50">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 opacity-50">No orders yet. Start shopping!</div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="rounded-2xl p-5" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs opacity-50 mb-1">Order ID: {order.id.slice(0, 8)}...</p>
                    <p className="text-xs opacity-50">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1 rounded-full text-white" style={{ backgroundColor: statusColor(order.status) }}>
                      {order.status}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#F8BBD9', color: '#2D2D2D' }}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-3">
                  {order.order_items?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span style={{ color: '#2D2D2D' }}>{item.products?.name} x{item.quantity}</span>
                      <span style={{ color: '#FFAB91' }}>৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: '#F8BBD9' }}>
                  <span className="text-sm opacity-60">{order.payment_method} • {order.delivery_address?.slice(0, 30)}...</span>
                  <span className="font-bold" style={{ color: '#FFAB91' }}>৳{order.total_amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;