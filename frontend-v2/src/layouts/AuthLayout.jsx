import { Link } from 'react-router-dom';
import { Heart, Leaf } from 'lucide-react';

/* ── Anime Doctor SVG (inline, no deps) ── */
const DocSVG = ({ hair = '#5d4037', accent = '#4caf50', flip = false, size = 130 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 120 130" fill="none"
    style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
    <ellipse cx="60" cy="118" rx="36" ry="16" fill="#fff" stroke="#e0e0e0" strokeWidth="1.5"/>
    <rect x="36" y="85" width="48" height="40" rx="8" fill="#fff" stroke="#e0e0e0" strokeWidth="1.5"/>
    <rect x="46" y="88" width="28" height="35" rx="4" fill={accent} opacity="0.7"/>
    <path d="M48 92 Q44 102 50 108" stroke="#bdbdbd" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <circle cx="50" cy="109" r="3" fill="#9e9e9e"/>
    <rect x="53" y="68" width="14" height="18" rx="7" fill="#ffccaa"/>
    <ellipse cx="60" cy="56" rx="26" ry="28" fill="#ffccaa"/>
    <ellipse cx="60" cy="34" rx="27" ry="18" fill={hair}/>
    <ellipse cx="36" cy="52" rx="10" ry="18" fill={hair}/>
    <ellipse cx="84" cy="52" rx="10" ry="18" fill={hair}/>
    <ellipse cx="50" cy="58" rx="5" ry="6" fill="#fff"/>
    <ellipse cx="50" cy="59" rx="3.5" ry="4.5" fill="#3e2723"/>
    <ellipse cx="51" cy="57.5" rx="1.2" ry="1.5" fill="#fff"/>
    <ellipse cx="70" cy="58" rx="5" ry="6" fill="#fff"/>
    <ellipse cx="70" cy="59" rx="3.5" ry="4.5" fill="#3e2723"/>
    <ellipse cx="71" cy="57.5" rx="1.2" ry="1.5" fill="#fff"/>
    <ellipse cx="44" cy="65" rx="6" ry="3" fill="#ffb3b3" opacity="0.5"/>
    <ellipse cx="76" cy="65" rx="6" ry="3" fill="#ffb3b3" opacity="0.5"/>
    <path d="M54 70 Q60 76 66 70" stroke="#c17b6f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <rect x="55" y="88" width="10" height="10" rx="2" fill="#e53935" opacity="0.85"/>
    <rect x="58.5" y="89.5" width="3" height="7" rx="1" fill="#fff"/>
    <rect x="56.5" y="91.5" width="7" height="3" rx="1" fill="#fff"/>
  </svg>
);

const FEATURES = [
  { emoji: '📅', text: 'Book appointments instantly' },
  { emoji: '🧠', text: 'AI disease risk prediction' },
  { emoji: '🩸', text: 'Blood donor network' },
  { emoji: '🏥', text: 'Find hospitals nearby' },
  { emoji: '👨‍⚕️', text: '500+ verified doctors' },
  { emoji: '🔒', text: 'Secure health records' },
];

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex overflow-hidden" style={{ fontFamily: "'Nunito','Segoe UI',sans-serif", background: '#f9fdf9' }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes sway  { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
      .af { animation: float 3.5s ease-in-out infinite; }
      .af2 { animation: float 4s ease-in-out infinite; animation-delay:0.7s; }
      .sw { animation: sway 4s ease-in-out infinite; transform-origin: bottom; }
    `}</style>

    {/* ── LEFT PANEL: Branding ── */}
    <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-10"
      style={{ background: 'linear-gradient(155deg,#e8f5e9 0%,#c8e6c9 60%,#a5d6a7 100%)' }}>

      {/* Leaf decoration */}
      <div className="absolute top-10 right-6 opacity-20 sw text-green-600"><Leaf size={80}/></div>
      <div className="absolute bottom-16 left-4 opacity-15 sw text-green-500" style={{ animationDelay:'1.2s' }}><Leaf size={55}/></div>
      <div className="absolute top-1/2 right-0 opacity-10 sw text-green-400" style={{ animationDelay:'0.5s' }}><Leaf size={100}/></div>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#2e7d32,#66bb6a)' }}>
          <Heart size={18} className="text-white"/>
        </div>
        <span className="text-2xl font-black" style={{ color: '#1b5e20' }}>HealthSphere</span>
      </Link>

      {/* Center content */}
      <div className="z-10 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black mb-5 w-fit"
          style={{ background: '#fff', color: '#2e7d32', border: '2px solid #a5d6a7' }}>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>For Patients · Doctors · Hospitals
        </div>
        <h2 className="font-black leading-tight mb-4" style={{ fontSize: '2.4rem', color: '#1b5e20' }}>
          Your Health,<br/>
          <span style={{ color: '#388e3c' }}>Our Priority 🌿</span>
        </h2>
        <p className="font-semibold mb-10 leading-relaxed" style={{ color: '#558b2f', fontSize: '1rem' }}>
          India's trusted AI-powered healthcare platform — connect with doctors, hospitals, and health services in one place.
        </p>

        {/* Feature pills */}
        <div className="grid grid-cols-2 gap-2.5">
          {FEATURES.map(f => (
            <div key={f.text} className="flex items-center gap-2.5 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/80 shadow-sm">
              <span className="text-lg">{f.emoji}</span>
              <span className="text-xs font-bold text-gray-600">{f.text}</span>
            </div>
          ))}
        </div>

        {/* Anime doctors */}
        <div className="flex items-end gap-4 mt-8">
          <div className="af"><DocSVG hair="#5d4037" accent="#4caf50" size={110}/></div>
          <div className="af2"><DocSVG hair="#f48fb1" accent="#e91e63" flip size={95}/></div>
          <div className="ml-auto bg-white/70 rounded-2xl shadow-lg p-3 border border-white/80">
            <p className="font-black text-sm" style={{ color: '#1b5e20' }}>⭐ 4.9 / 5.0</p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Patient Satisfaction</p>
          </div>
        </div>
      </div>

      <p className="text-xs font-semibold z-10" style={{ color: '#81c784' }}>© 2026 HealthSphere. All rights reserved.</p>
    </div>

    {/* ── RIGHT PANEL: Form ── */}
    <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto" style={{ background: '#fff' }}>
      <div className="w-full max-w-md">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg,#2e7d32,#66bb6a)' }}>
            <Heart size={16} className="text-white"/>
          </div>
          <span className="text-xl font-black" style={{ color: '#2e7d32' }}>HealthSphere</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8">
          <div className="mb-7">
            <h1 className="font-black text-3xl" style={{ color: '#1b5e20' }}>{title}</h1>
            <p className="text-sm font-semibold mt-1.5" style={{ color: '#78909c' }}>{subtitle}</p>
          </div>
          {children}
        </div>

        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          By continuing, you agree to our <a href="#" className="underline hover:text-green-700">Terms</a> and <a href="#" className="underline hover:text-green-700">Privacy Policy</a>.
        </p>
      </div>
    </div>
  </div>
);

export default AuthLayout;
