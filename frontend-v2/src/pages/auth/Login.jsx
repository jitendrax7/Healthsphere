import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { authApi } from '../../api/axios';
import { useApp } from '../../context/AppContext';

/* ── Shared green input style ── */
const GInp = ({ label, icon: Icon, rightEl, ...props }) => (
  <div>
    <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#558b2f' }}>{label}</label>
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a5d6a7' }} />}
      <input {...props}
        className="w-full rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-colors text-sm font-semibold text-gray-700 placeholder-gray-300 bg-white"
        style={{ padding: Icon ? '11px 40px 11px 38px' : '11px 14px', ...(rightEl ? { paddingRight: '42px' } : {}) }} />
      {rightEl}
    </div>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { setUser, fetchUser } = useApp();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [showPass, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res  = await authApi.login(form);
      const data = res.data;
      if (data.otp_sent) { navigate('/verify-email', { state: { email: form.email } }); return; }
      localStorage.setItem('token', data.token);
      try {
        await fetchUser();
        navigate(data.user.role === 'doctor' ? '/doctor/dashboard' : '/user/dashboard');
      } catch (err) {
        setUser(data.user);
        navigate(data.user.role === 'doctor' ? '/doctor/dashboard' : '/user/dashboard');
      }
    } catch (err) {
      const d = err.response?.data;
      if (d?.otp_sent) { navigate('/verify-email', { state: { email: form.email } }); return; }
      setError(d?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Sign in to continue your health journey">
      <form onSubmit={handleSubmit} className="space-y-4">

        <GInp label="Email Address" icon={Mail}
          type="email" name="email" value={form.email}
          onChange={handleChange} required placeholder="you@example.com" />

        <GInp label="Password" icon={Lock}
          type={showPass ? 'text' : 'password'} name="password" value={form.password}
          onChange={handleChange} required placeholder="••••••••"
          rightEl={
            <button type="button" onClick={() => setShow(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#a5d6a7' }}>
              {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          } />

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border"
            style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', color: '#dc2626' }}>
            <AlertCircle size={14}/> {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-white text-base transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 mt-2"
          style={{ background: 'linear-gradient(135deg, #2e7d32, #43a047)', boxShadow: '0 6px 20px rgba(46,125,50,0.3)' }}>
          {loading ? <><Loader2 size={16} className="animate-spin"/>Signing in…</> : '🔑 Sign In'}
        </button>

        <p className="text-center text-sm font-semibold text-gray-400 pt-1">
          Don't have an account?{' '}
          <Link to="/register" className="font-black hover:underline" style={{ color: '#2e7d32' }}>Create Account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
