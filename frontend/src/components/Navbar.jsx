import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav style={{ backgroundColor: '#FFFDF9', borderBottom: '1px solid #F8BBD9' }} className="sticky top-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold" style={{ color: '#D4A574', fontFamily: 'Playfair Display, serif' }}>
          🍑 PeachSkin
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium hover:opacity-70" style={{ color: '#2D2D2D' }}>Home</Link>
          <Link to="/shop" className="text-sm font-medium hover:opacity-70" style={{ color: '#2D2D2D' }}>Shop</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium hover:opacity-70" style={{ color: '#D4A574' }}>Admin</Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link to="/cart" className="relative">
            <span className="text-xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: '#FFAB91' }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/account" className="text-sm font-medium" style={{ color: '#2D2D2D' }}>
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="text-sm px-4 py-2 rounded-full border hover:opacity-70" style={{ borderColor: '#FFAB91', color: '#FFAB91' }}>
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium" style={{ color: '#2D2D2D' }}>Login</Link>
              <Link to="/register" className="text-sm px-4 py-2 rounded-full text-white hover:opacity-70" style={{ backgroundColor: '#FFAB91' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;