import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  Stethoscope, Building2, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { authApi } from '../../api/axios';

/* ── Green styled input ── */
const GInp = ({ label, icon: Icon, rightEl, borderOverride, ...props }) => (
  <div>
    <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#558b2f' }}>{label}</label>
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a5d6a7' }} />}
      <input {...props}
        className="w-full rounded-xl border-2 focus:outline-none transition-colors text-sm font-semibold text-gray-700 placeholder-gray-300 bg-white"
        style={{
          padding: Icon ? '11px 40px 11px 38px' : '11px 14px',
          borderColor: borderOverride || '#e5e7eb',
          ...(rightEl ? { paddingRight: '42px' } : {}),
        }}
        onFocus={e => !borderOverride && (e.target.style.borderColor = '#4caf50')}
        onBlur={e => !borderOverride && (e.target.style.borderColor = '#e5e7eb')}
      />
      {rightEl}
    </div>
  </div>
);

/* ── Role card data ── */
const ROLES = [
  { role: 'user',     label: 'Patient',  subtitle: 'Book & track health',      emoji: '🧑‍⚕️', color: '#1565c0', bg: '#e3f2fd', border: '#90caf9' },
  { role: 'doctor',   label: 'Doctor',   subtitle: 'Manage appointments',       emoji: '👨‍⚕️', color: '#2e7d32', bg: '#e8f5e9', border: '#a5d6a7' },
  { role: 'hospital', label: 'Hospital', subtitle: 'Camps & blood drives',       emoji: '🏥', color: '#6a1b9a', bg: '#f3e5f5', border: '#ce93d8' },
];

/* ── Component ── */
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Name: '', email: '', password: '', confirmPassword: '',
    phoneNumber: '', role: 'user', organizationName: '',
  });
  const [showPass, setShow]     = useState(false);
  const [showConfirm, setShowC] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      if (payload.role !== 'hospital') delete payload.organizationName;
      const res = await authApi.register(payload);
      if (res.data.otp_sent) navigate('/verify-email', { state: { email: res.data.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const pwMatch = form.confirmPassword && form.password === form.confirmPassword;
  const pwMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <AuthLayout title="Create Account 🌿" subtitle="Join HealthSphere — for patients, doctors & hospitals">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Role selector */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-2" style={{ color: '#558b2f' }}>I am registering as</label>
          <div className="grid grid-cols-3 gap-2.5">
            {ROLES.map(r => {
              const active = form.role === r.role;
              return (
                <button key={r.role} type="button" onClick={() => setForm({ ...form, role: r.role })}
                  className="relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 transition-all text-center"
                  style={{
                    borderColor: active ? r.border : '#e5e7eb',
                    background: active ? r.bg : '#fff',
                    boxShadow: active ? `0 4px 16px ${r.color}25` : 'none',
                    transform: active ? 'scale(1.03)' : 'scale(1)',
                  }}>
                  {active && <CheckCircle2 size={13} className="absolute top-2 right-2" style={{ color: r.color }}/>}
                  <span className="text-2xl">{r.emoji}</span>
                  <p className="text-xs font-black" style={{ color: active ? r.color : '#9e9e9e' }}>{r.label}</p>
                  <p className="text-[10px] font-semibold leading-tight" style={{ color: active ? r.color + '99' : '#bdbdbd' }}>{r.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        <GInp label="Full Name" icon={User} type="text" name="Name" value={form.Name} onChange={handleChange} required placeholder="John Doe" />

        {form.role === 'hospital' && (
          <GInp label="Hospital / Organization Name" icon={Building2} type="text" name="organizationName" value={form.organizationName} onChange={handleChange} required placeholder="City General Hospital" />
        )}

        <GInp label="Email Address" icon={Mail} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />

        <GInp label="Phone Number" icon={Phone} type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required placeholder="+91 98765 43210" />

        {/* Password */}
        <GInp label="Password" icon={Lock}
          type={showPass ? 'text' : 'password'} name="password" value={form.password}
          onChange={handleChange} required placeholder="Min. 8 characters"
          rightEl={
            <button type="button" onClick={() => setShow(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#a5d6a7' }}>
              {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          } />

        {/* Confirm password */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#558b2f' }}>Confirm Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#a5d6a7' }}/>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword" value={form.confirmPassword}
              onChange={handleChange} required placeholder="Re-enter your password"
              className="w-full rounded-xl border-2 focus:outline-none transition-colors text-sm font-semibold text-gray-700 placeholder-gray-300 bg-white"
              style={{
                padding: '11px 42px 11px 38px',
                borderColor: pwMatch ? '#4caf50' : pwMismatch ? '#ef4444' : '#e5e7eb',
              }} />
            <button type="button" onClick={() => setShowC(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#a5d6a7' }}>
              {showConfirm ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>
          {form.confirmPassword && (
            <p className={`text-xs mt-1.5 flex items-center gap-1 font-bold ${pwMatch ? 'text-green-600' : 'text-red-500'}`}>
              {pwMatch ? <><CheckCircle2 size={11}/> Passwords match</> : '✗ Passwords do not match'}
            </p>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
            style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', color: '#dc2626' }}>
            <AlertCircle size={14}/> {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-white text-base transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60 mt-1"
          style={{ background: 'linear-gradient(135deg, #2e7d32, #43a047)', boxShadow: '0 6px 20px rgba(46,125,50,0.3)' }}>
          {loading ? <><Loader2 size={16} className="animate-spin"/>Creating Account…</> : '🌿 Create Account'}
        </button>

        <p className="text-center text-sm font-semibold text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-black hover:underline" style={{ color: '#2e7d32' }}>Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
