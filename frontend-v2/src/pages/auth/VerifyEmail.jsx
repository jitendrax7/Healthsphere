import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { authApi } from '../../api/axios';
import { useApp } from '../../context/AppContext';

const VerifyEmail = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { setUser, fetchUser } = useApp();
  const email     = location.state?.email || '';
  const [otp, setOtp]           = useState(['','','','','','']);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [resending, setResend]  = useState(false);
  const [countdown, setCount]   = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (val, idx) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) document.getElementById(`otp-${idx+1}`)?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) document.getElementById(`otp-${idx-1}`)?.focus();
  };

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await authApi.verifyEmail({ email, otp: otp.join('') });
      localStorage.setItem('token', res.data.token);
      const role = res.data.user?.role;
      try { await fetchUser(); } catch (_) { setUser(res.data.user); }
      if (role === 'doctor') {
        const isNew = res.data.user?.newUser ?? false;
        navigate(isNew ? '/doctor/onboarding' : '/doctor/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP, please try again.');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    setResend(true);
    try { await authApi.resendOtp(email); setCount(60); }
    catch { setError('Failed to resend OTP'); }
    finally { setResend(false); }
  };

  const filled = otp.join('').length === 6;

  return (
    <AuthLayout title="Verify Your Email 📬" subtitle={email ? `We sent a 6-digit code to ${email}` : 'Enter the code we sent to your email'}>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', border: '2.5px solid #a5d6a7' }}>
            <ShieldCheck size={34} style={{ color: '#2e7d32' }} />
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-2xl px-5 py-4 text-sm font-semibold text-center"
          style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#166534' }}>
          📩 Check your inbox and enter the 6-digit code below
        </div>

        {/* OTP boxes */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-3 text-center" style={{ color: '#558b2f' }}>Enter OTP Code</label>
          <div className="flex gap-2.5 justify-center">
            {otp.map((digit, idx) => (
              <input key={idx} id={`otp-${idx}`}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => handleChange(e.target.value, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className="w-12 h-14 text-center text-xl font-black rounded-2xl border-2 focus:outline-none transition-all"
                style={{
                  background: digit ? '#f0fdf4' : '#fff',
                  borderColor: digit ? '#4caf50' : '#e5e7eb',
                  color: '#1b5e20',
                  boxShadow: digit ? '0 0 0 3px #bbf7d040' : 'none',
                }} />
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', color: '#dc2626' }}>
            <AlertCircle size={14}/> {error}
          </div>
        )}

        <button type="submit" disabled={loading || !filled}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-white text-base transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
          style={{ background: filled ? 'linear-gradient(135deg, #2e7d32, #43a047)' : '#9e9e9e', boxShadow: filled ? '0 6px 20px rgba(46,125,50,0.3)' : 'none' }}>
          {loading ? <><Loader2 size={16} className="animate-spin"/>Verifying…</> : '✅ Verify Email'}
        </button>

        {/* Resend */}
        <div className="text-center text-sm font-semibold" style={{ color: '#9e9e9e' }}>
          {countdown > 0
            ? <>Resend code in <span className="font-black" style={{ color: '#2e7d32' }}>{countdown}s</span></>
            : (
              <button type="button" onClick={handleResend} disabled={resending}
                className="inline-flex items-center gap-1.5 font-black hover:underline transition-colors"
                style={{ color: '#2e7d32' }}>
                <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                {resending ? 'Sending…' : 'Resend Code'}
              </button>
            )
          }
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;
