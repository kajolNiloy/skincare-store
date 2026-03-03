import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FFFDF9' }}>
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-sm" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold" style={{ color: '#D4A574', fontFamily: 'Playfair Display, serif' }}>
              🍑 PeachSkin
            </Link>
            <p className="mt-2 text-sm opacity-60" style={{ color: '#2D2D2D' }}>Welcome back! Sign in to your account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center" style={{ backgroundColor: '#FFE5E5', color: '#E53E3E' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none transition"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none transition"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-medium hover:opacity-90 transition mt-2"
              style={{ backgroundColor: '#FFAB91' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm mt-6 opacity-70" style={{ color: '#2D2D2D' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: '#FFAB91' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;