import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#2D2D2D', color: '#FFFDF9' }} className="mt-20 px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#FFAB91', fontFamily: 'Playfair Display, serif' }}>
            🍑 PeachSkin
          </h2>
          <p className="text-sm opacity-70 leading-relaxed">
            Natural skincare products made with love. Glow from within with PeachSkin.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-4" style={{ color: '#FFAB91' }}>Quick Links</h3>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm opacity-70 hover:opacity-100">Home</Link>
            <Link to="/shop" className="text-sm opacity-70 hover:opacity-100">Shop</Link>
            <Link to="/account" className="text-sm opacity-70 hover:opacity-100">My Account</Link>
            <Link to="/cart" className="text-sm opacity-70 hover:opacity-100">Cart</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4" style={{ color: '#FFAB91' }}>Contact Us</h3>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <p>📧 hello@peachskin.com</p>
            <p>📞 +880 1700 000000</p>
            <p>📍 Dhaka, Bangladesh</p>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-600 text-center text-sm opacity-50">
        © 2026 PeachSkin. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;