import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import { supabase } from '../services/supabase';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
    <div style={{ backgroundColor: '#FFFDF9', minHeight: '100vh' }} className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#2D2D2D', fontFamily: 'Playfair Display, serif' }}>
            Join PeachSkin 🍑
          </h1>
          <p className="text-sm opacity-60" style={{ color: '#2D2D2D' }}>Create your account and start glowing</p>
        </div>
        <div className="rounded-3xl p-8" style={{ backgroundColor: '#fff', border: '1px solid #F8BBD9' }}>
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
              <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Full Name</label>
              <input type="text" placeholder="Your full name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Email</label>
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Phone</label>
              <input type="text" placeholder="01700000000" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: '#2D2D2D' }}>Password</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none"
                style={{ borderColor: '#F8BBD9', backgroundColor: '#FFFDF9' }} />
            </div>
          </div>
          <button onClick={handleRegister} disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: '#FFAB91' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          <p className="text-center text-sm mt-6 opacity-60" style={{ color: '#2D2D2D' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: '#FFAB91' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;