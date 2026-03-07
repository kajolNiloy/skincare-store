import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { supabase } from '../services/supabase';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  return (
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D', fontFamily: 'Playfair Display, serif' }}>
            Welcome Back 🍑
          </h1>
          <p className="text-sm opacity-60" style={{ color: '#2D2D2D' }}>Sign in to your PeachSkin account</p>
        </div>

        <div className="rounded-3xl p-8" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>

          {/* Google Login Button */}
          <button onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium mb-6 hover:opacity-80 transition"
            style={{ borderColor: '#F8BBD9', color: '#2D2D2D' }}>
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#F8BBD9' }}></div>
            <span className="text-xs opacity-40" style={{ color: '#2D2D2D' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#F8BBD9' }}></div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-center" style={{ backgroundColor: '#FFE5E5', color: '#E53E3E' }}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none"
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
                className="w-full px-4 py-3 rounded-xl border outline-none"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }}
              />
            </div>
          </div>

          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: '#FFAB91' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm mt-6 opacity-60" style={{ color: '#2D2D2D' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: '#FFAB91' }}>Sign Up</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;