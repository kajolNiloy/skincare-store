import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0) {
    navigate('/shop');
    return null;
  }

  const handleOrder = async () => {
    if (!address.trim()) {
      setError('Please enter your delivery address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      await createOrder({ items, delivery_address: address, payment_method: paymentMethod });
      clearCart();
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left - Form */}
          <div className="flex flex-col gap-6">

            {/* Delivery Address */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
              <h2 className="font-semibold mb-4" style={{ color: '#2D2D2D' }}>Delivery Address</h2>
              <textarea
                placeholder="Enter your full delivery address..."
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border outline-none resize-none"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }}
                rows={4}
              />
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
              <h2 className="font-semibold mb-4" style={{ color: '#2D2D2D' }}>Payment Method</h2>
              <div className="flex flex-col gap-3">
                {['COD', 'bKash', 'Nagad'].map(method => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      style={{ accentColor: '#FFAB91' }}
                    />
                    <span className="text-sm font-medium" style={{ color: '#2D2D2D' }}>
                      {method === 'COD' ? 'Cash on Delivery' : method}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div>
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFF0EB' }}>
              <h2 className="font-semibold mb-4" style={{ color: '#2D2D2D' }}>Order Summary</h2>

              <div className="flex flex-col gap-3 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#2D2D2D' }}>{item.name} x{item.quantity}</span>
                    <span className="text-sm font-medium" style={{ color: '#2D2D2D' }}>৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center mb-6" style={{ borderColor: '#F8BBD9' }}>
                <span className="font-semibold" style={{ color: '#2D2D2D' }}>Total</span>
                <span className="text-xl font-bold" style={{ color: '#FFAB91' }}>৳{totalPrice}</span>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center" style={{ backgroundColor: '#FFE5E5', color: '#E53E3E' }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full py-3 rounded-full text-white font-medium hover:opacity-90 transition"
                style={{ backgroundColor: '#FFAB91' }}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;