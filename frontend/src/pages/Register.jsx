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