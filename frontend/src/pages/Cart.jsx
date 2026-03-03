import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#FFFDF9' }}>
      <span className="text-6xl">🛒</span>
      <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>Your cart is empty</h2>
      <p className="opacity-60 text-sm">Add some products to get started!</p>
      <Link to="/shop" className="px-8 py-3 rounded-full text-white font-medium hover:opacity-90 transition" style={{ backgroundColor: '#FFAB91' }}>
        Shop Now
      </Link>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="px-6 py-12">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Playfair Display, serif', color: '#2D2D2D' }}>
          Your Cart 🛒
        </h1>

        <div className="flex flex-col gap-4 mb-8">
          {cart.map(item => (
            <div key={item.id} className="rounded-2xl p-5 flex items-center gap-4" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>

              {/* Image */}
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: '#FFF0EB' }}>
                🍑
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: '#2D2D2D' }}>{item.name}</h3>
                <p className="text-sm font-bold mt-1" style={{ color: '#FFAB91' }}>৳{item.price}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: '#F8BBD9' }}>−</button>
                <span className="font-medium w-6 text-center text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: '#F8BBD9' }}>+</button>
              </div>

              {/* Subtotal */}
              <p className="font-bold w-20 text-right" style={{ color: '#2D2D2D' }}>৳{item.price * item.quantity}</p>

              {/* Remove */}
              <button onClick={() => removeFromCart(item.id)} className="text-lg opacity-40 hover:opacity-70 ml-2">✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#FFF0EB' }}>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium" style={{ color: '#2D2D2D' }}>Total</span>
            <span className="text-2xl font-bold" style={{ color: '#FFAB91' }}>৳{totalPrice}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={clearCart} className="px-6 py-3 rounded-full border font-medium hover:opacity-70 transition text-sm" style={{ borderColor: '#FFAB91', color: '#FFAB91' }}>
              Clear Cart
            </button>
            <button onClick={() => navigate('/checkout')} className="flex-1 py-3 rounded-full text-white font-medium hover:opacity-90 transition" style={{ backgroundColor: '#FFAB91' }}>
              Proceed to Checkout →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;