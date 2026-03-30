import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Menu, X, ChevronRight, Star, Heart, Leaf, ArrowRight, CheckCircle,
  Calendar, Brain, Droplets, MapPin, Shield, Stethoscope, Building2,
  Users, Activity, Clock, Phone, Award, Zap, FileText, UserCheck, BarChart2
} from 'lucide-react';

/* ══ Inline anime SVG avatars (no external deps) ══ */
const DoctorAvatar = ({ hair = '#5d4037', accent = '#4caf50', flip = false, size = 120 }) => (
  <svg width={size} height={Math.round(size * 1.09)} viewBox="0 0 120 130" fill="none"
    style={{ transform: flip ? 'scaleX(-1)' : 'none', display: 'block' }}>
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

const NurseAvatar = ({ hair = '#f06292', size = 120 }) => (
  <svg width={size} height={Math.round(size * 1.09)} viewBox="0 0 120 130" fill="none" style={{ display: 'block' }}>
    <ellipse cx="60" cy="118" rx="36" ry="16" fill="#fce4ec" stroke="#f8bbd9" strokeWidth="1.5"/>
    <rect x="36" y="85" width="48" height="40" rx="8" fill="#fce4ec"/>
    <rect x="46" y="88" width="28" height="35" rx="4" fill="#f48fb1" opacity="0.8"/>
    <rect x="53" y="68" width="14" height="18" rx="7" fill="#ffccaa"/>
    <ellipse cx="60" cy="56" rx="26" ry="28" fill="#ffccaa"/>
    <ellipse cx="60" cy="32" rx="28" ry="20" fill={hair}/>
    <ellipse cx="34" cy="54" rx="9" ry="20" fill={hair}/>
    <ellipse cx="86" cy="54" rx="9" ry="20" fill={hair}/>
    <rect x="44" y="28" width="32" height="8" rx="4" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
    <rect x="57" y="25" width="6" height="13" rx="3" fill="#e53935" opacity="0.8"/>
    <ellipse cx="50" cy="58" rx="5" ry="6" fill="#fff"/>
    <ellipse cx="50" cy="59" rx="3.5" ry="4.5" fill="#4a148c"/>
    <ellipse cx="51" cy="57.5" rx="1.2" ry="1.5" fill="#fff"/>
    <ellipse cx="70" cy="58" rx="5" ry="6" fill="#fff"/>
    <ellipse cx="70" cy="59" rx="3.5" ry="4.5" fill="#4a148c"/>
    <ellipse cx="71" cy="57.5" rx="1.2" ry="1.5" fill="#fff"/>
    <ellipse cx="44" cy="65" rx="6" ry="3" fill="#ffb3b3" opacity="0.6"/>
    <ellipse cx="76" cy="65" rx="6" ry="3" fill="#ffb3b3" opacity="0.6"/>
    <path d="M54 70 Q60 76 66 70" stroke="#c17b6f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </svg>
);

const HospitalSVG = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <rect x="10" y="35" width="80" height="60" rx="4" fill="#e8f5e9" stroke="#a5d6a7" strokeWidth="2"/>
    <rect x="20" y="20" width="60" height="20" rx="3" fill="#c8e6c9" stroke="#a5d6a7" strokeWidth="1.5"/>
    <rect x="38" y="5" width="24" height="20" rx="3" fill="#4caf50" opacity="0.8"/>
    <rect x="46" y="8" width="8" height="14" rx="2" fill="#fff"/>
    <rect x="43" y="11" width="14" height="8" rx="2" fill="#fff"/>
    <rect x="16" y="50" width="16" height="14" rx="2" fill="#81c784" opacity="0.7"/>
    <rect x="42" y="50" width="16" height="25" rx="2" fill="#fff" stroke="#a5d6a7" strokeWidth="1"/>
    <rect x="68" y="50" width="16" height="14" rx="2" fill="#81c784" opacity="0.7"/>
  </svg>
);

/* ══ Data ══ */
const WHO_TABS = {
  patient: {
    icon: '🧑‍⚕️', label: 'For Patients', color: '#1565c0', bg: '#e3f2fd', border: '#90caf9',
    headline: 'Take Charge of Your Health',
    desc: 'Book appointments, track health, find donors, get AI-powered health insights — all in one app designed for you.',
    features: [
      { icon: Calendar,    text: 'Book doctor appointments in 60 seconds' },
      { icon: Brain,       text: 'AI disease risk prediction tools' },
      { icon: Droplets,    text: 'Find blood donors nearby instantly' },
      { icon: MapPin,      text: 'Locate hospitals & clinics near you' },
      { icon: Shield,      text: 'Secure personal health records' },
      { icon: Activity,    text: 'AI skin disease detection' },
    ],
    cta: 'Sign Up as Patient', link: '/register',
  },
  doctor: {
    icon: '👨‍⚕️', label: 'For Doctors', color: '#2e7d32', bg: '#e8f5e9', border: '#a5d6a7',
    headline: 'Manage Your Practice Smarter',
    desc: 'Get a verified profile, manage appointments effortlessly, connect with patients, and grow your practice digitally.',
    features: [
      { icon: UserCheck,   text: 'Verified doctor profile with badge' },
      { icon: Calendar,    text: 'Smart appointment calendar & slot management' },
      { icon: FileText,    text: 'Patient consultation notes & history' },
      { icon: BarChart2,   text: 'Practice dashboard & earnings overview' },
      { icon: Users,       text: 'Connect with hospitals & clinics' },
      { icon: Zap,         text: 'Online & in-person consultation modes' },
    ],
    cta: 'Register as Doctor', link: '/register',
  },
  hospital: {
    icon: '🏥', label: 'For Hospitals', color: '#6a1b9a', bg: '#f3e5f5', border: '#ce93d8',
    headline: 'Digitize Your Hospital Operations',
    desc: 'List your hospital, manage healthcare camps, handle blood donation requests, and connect with doctors seamlessly.',
    features: [
      { icon: Building2,   text: 'Verified hospital listing & profile' },
      { icon: Calendar,    text: 'Healthcare camp & event management' },
      { icon: Droplets,    text: 'Blood donation drive management' },
      { icon: Users,       text: 'Connect & manage associated doctors' },
      { icon: BarChart2,   text: 'Camp registrations & analytics dashboard' },
      { icon: Shield,      text: 'Document verification & accreditation' },
    ],
    cta: 'Register Your Hospital', link: '/register',
  },
};

const SERVICES = [
  { emoji: '🩺', title: 'General Checkup',   desc: 'Comprehensive health assessment by certified physicians.', color: '#e53935' },
  { emoji: '👶', title: 'Pediatrics',         desc: 'Specialized care for infants, children & adolescents.',   color: '#1565c0' },
  { emoji: '🔬', title: 'Diagnostics',        desc: 'Advanced lab tests, imaging, and health screening.',       color: '#6a1b9a' },
  { emoji: '🦷', title: 'Dental Care',        desc: 'Complete dental services for a healthy, confident smile.', color: '#f57c00' },
  { emoji: '❤️', title: 'Cardiology',         desc: 'Expert heart health monitoring and treatment plans.',      color: '#c62828' },
  { emoji: '🧠', title: 'AI Prediction',      desc: 'AI-based early detection for heart disease & diabetes.',   color: '#2e7d32' },
];

const DOCTORS = [
  { name: 'Dr. Aiko Suzuki', role: 'Cardiologist',  hair: '#f48fb1', accent: '#e91e63',  exp: '12 yrs', rating: 4.9 },
  { name: 'Dr. Hiro Tanaka', role: 'Pediatrician',  hair: '#5d4037', accent: '#42a5f5',  exp: '8 yrs',  rating: 4.8 },
  { name: 'Dr. Kenji Mori',  role: 'Neurologist',   hair: '#37474f', accent: '#66bb6a',  exp: '15 yrs', rating: 4.9 },
  { name: 'Dr. Mei Chen',    role: 'Dentist',        hair: '#795548', accent: '#ab47bc',  exp: '6 yrs',  rating: 4.7 },
];

const TESTIMONIALS = [
  { emoji:'🧑‍⚕️', text:'Found a specialist and booked in 2 minutes. The AI health check is incredible!',                              name:'Priya S.',     role:'Patient',     color:'#1565c0' },
  { emoji:'👨‍⚕️', text:'My appointment dashboard is clean and professional. I manage 30+ patients per day effortlessly.',              name:'Dr. Raj M.',   role:'Cardiologist',color:'#2e7d32' },
  { emoji:'🏥',    text:'We listed our hospital, ran 3 healthcare camps, and got 200+ new patient registrations in one month.',         name:'City Medical', role:'Hospital',    color:'#6a1b9a' },
];

/* ══════════════════════════════════════════════════ */
const Landing = () => {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [activeTab,  setActiveTab]  = useState('patient');
  const [bookForm,   setBookForm]   = useState({ name:'', email:'', dept:'', date:'' });

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const tab = WHO_TABS[activeTab];

  return (
    <div className="bg-white overflow-x-hidden" style={{ fontFamily:"'Nunito','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .btn-green { background:linear-gradient(135deg,#2e7d32,#43a047);color:white;padding:11px 26px;border-radius:30px;font-weight:800;font-size:14px;transition:all .3s;display:inline-flex;align-items:center;gap:8px;border:none;cursor:pointer;text-decoration:none; }
        .btn-green:hover { opacity:.92;transform:translateY(-2px);box-shadow:0 8px 24px rgba(46,125,50,.35); }
        .btn-outline-green { background:transparent;color:#2e7d32;padding:11px 26px;border-radius:30px;font-weight:800;font-size:14px;border:2.5px solid #2e7d32;transition:all .3s;display:inline-flex;align-items:center;gap:8px;cursor:pointer;text-decoration:none; }
        .btn-outline-green:hover { background:#f1faf3;transform:translateY(-2px); }
        .leaf-title { display:flex;align-items:center;gap:10px;justify-content:center; }
        .leaf-title::before,.leaf-title::after { content:'';flex:1;height:2px;background:linear-gradient(to right,transparent,#c8e6c9);max-width:70px;border-radius:2px; }
        .card-lift { transition:all .35s cubic-bezier(.4,0,.2,1); }
        .card-lift:hover { transform:translateY(-8px);box-shadow:0 20px 50px rgba(0,0,0,.1); }
        @keyframes float  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-12px)} }
        @keyframes sway   { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
        .float-a { animation:float 3.5s ease-in-out infinite; }
        .float-b { animation:float 4s   ease-in-out infinite;animation-delay:.6s; }
        .float-c { animation:float 3s   ease-in-out infinite;animation-delay:1.2s; }
        .sway    { animation:sway  4s   ease-in-out infinite;transform-origin:bottom; }
        .who-feat { display:flex;align-items:flex-start;gap:10px;padding:8px 0; }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{ background:scrolled?'rgba(255,255,255,.97)':'white', boxShadow:scrolled?'0 2px 24px rgba(0,0,0,.09)':'none', borderBottom:scrolled?'1px solid #e8f5e9':'1px solid #f0f0f0' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background:'linear-gradient(135deg,#2e7d32,#66bb6a)' }}>
              <Heart size={17} className="text-white"/>
            </div>
            <span className="text-xl font-black" style={{ color:'#2e7d32' }}>HealthSphere</span>
          </Link>
          <div className="hidden md:flex items-center gap-7">
            {[['#who','For You'],['#services','Services'],['#doctors','Doctors'],['#hospitals','Hospitals']].map(([href,label]) => (
              <a key={label} href={href} className="text-sm font-bold text-gray-500 hover:text-green-700 transition-colors">{label}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login"    className="text-sm font-bold text-gray-500 hover:text-green-700 px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-green text-sm">Get Started Free</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" style={{ color:'#2e7d32' }}>
            {menuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-green-100 px-6 py-4 space-y-3">
            {[['#who','For You'],['#services','Services'],['#doctors','Doctors']].map(([href,label]) => (
              <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block text-gray-600 font-bold py-2">{label}</a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login"    className="flex-1 text-center border-2 border-green-700 text-green-700 font-bold py-2.5 rounded-full text-sm">Sign In</Link>
              <Link to="/register" className="flex-1 text-center text-white font-bold py-2.5 rounded-full text-sm" style={{ background:'#2e7d32' }}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative pt-16 overflow-hidden" style={{ background:'linear-gradient(150deg,#f1faf3 0%,#e8f5e9 55%,#c8e6c9 100%)', minHeight:'92vh' }}>
        <div className="absolute top-16 left-6 opacity-25 sway text-green-500"><Leaf size={64}/></div>
        <div className="absolute top-28 right-10 opacity-15 sway text-green-400" style={{ animationDelay:'1.5s' }}><Leaf size={90}/></div>
        <div className="absolute bottom-16 left-12 opacity-15 sway" style={{ animationDelay:'.8s',color:'#4caf50' }}><Leaf size={52}/></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-10 pt-14 pb-28">
          {/* Left */}
          <div className="flex-1 z-10 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full mb-6" style={{ background:'#dcfce7',color:'#166534' }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>India's #1 Healthcare Platform
            </div>
            <h1 className="font-black leading-tight mb-4 tracking-tight" style={{ fontSize:'clamp(2.2rem,5vw,3.8rem)',color:'#1b5e20' }}>
              Your Health,<br/>
              <span style={{ color:'#2e7d32' }}>Our Priority </span>
              <span className="sway inline-block text-3xl">🌿</span>
            </h1>
            <p className="text-base font-semibold mb-3" style={{ color:'#388e3c' }}>
              For <strong>Patients</strong> · <strong>Doctors</strong> · <strong>Hospitals</strong>
            </p>
            <p className="leading-relaxed mb-8 font-medium" style={{ color:'#558b2f',fontSize:'1.05rem' }}>
              One unified platform connecting patients, doctors and hospitals. Book appointments, manage clinics, run healthcare camps — all with beautiful simplicity.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
              <Link to="/register" className="btn-green text-base px-8 py-3.5">Get Started Free <ArrowRight size={18}/></Link>
              <a href="#who"       className="btn-outline-green text-base px-7 py-3.5">Learn More</a>
            </div>
            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center lg:justify-start flex-wrap">
              {[['10K+','Patients'],['500+','Doctors'],['50+','Hospitals'],['94%','Accuracy']].map(([v,l]) => (
                <div key={l} className="text-center">
                  <p className="text-2xl font-black" style={{ color:'#2e7d32' }}>{v}</p>
                  <p className="text-xs font-semibold text-gray-400">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Anime characters */}
          <div className="flex-1 flex items-end justify-center gap-1 relative z-10 min-h-[280px]">
            <div className="float-a"><DoctorAvatar hair="#5d4037" accent="#4caf50" size={145}/></div>
            <div className="float-b z-10 -mx-3">
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-2xl" style={{ background:'#fce4ec' }}>
                <NurseAvatar hair="#f48fb1" size={115}/>
                <div className="py-1.5 text-center text-xs font-black" style={{ color:'#e91e63' }}>Patient</div>
              </div>
            </div>
            <div className="float-c"><NurseAvatar hair="#795548" size={130}/></div>
            {/* Hospital badge */}
            <div className="absolute -bottom-2 right-0 bg-white rounded-2xl shadow-xl p-3 border border-green-100 flex items-center gap-3">
              <HospitalSVG size={44}/>
              <div><p className="font-black text-xs text-gray-700">City Hospital</p><p className="text-[10px] text-green-600 font-bold">✅ Verified Partner</p></div>
            </div>
          </div>
        </div>

        {/* 3-highlight strip */}
        <div className="relative mx-6 z-10" style={{ marginTop:'-24px' }}>
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-5 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-green-100">
            {[
              { emoji:'🧑‍⚕️', title:'For Patients',  sub:'Book, track & get AI health insights',       color:'#1565c0' },
              { emoji:'👨‍⚕️', title:'For Doctors',   sub:'Manage appointments & grow your practice',   color:'#2e7d32' },
              { emoji:'🏥',    title:'For Hospitals', sub:'Manage camps, staff & patient flow',          color:'#6a1b9a' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-4 p-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background:item.color+'12' }}>{item.emoji}</div>
                <div>
                  <p className="font-black text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHO IS IT FOR ══ */}
      <section id="who" className="py-24 px-6" style={{ background:'#fafdf9' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Who Is It For? 🌿</span></div>
            <p className="text-gray-400 font-semibold">HealthSphere serves three communities under one roof</p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-8 bg-gray-100 rounded-2xl p-1.5 max-w-md mx-auto">
            {Object.entries(WHO_TABS).map(([key, t]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all"
                style={{ background:activeTab===key?'white':'transparent', color:activeTab===key?t.color:'#9e9e9e', boxShadow:activeTab===key?'0 2px 12px rgba(0,0,0,.08)':'none' }}>
                <span>{t.icon}</span> {t.label.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="rounded-3xl border-2 p-8 transition-all duration-300" style={{ borderColor:tab.border, background:tab.bg+'60' }}>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black mb-4" style={{ background:tab.bg, color:tab.color, border:`2px solid ${tab.border}` }}>
                  <span>{tab.icon}</span> {tab.label}
                </div>
                <h2 className="text-3xl font-black mb-3" style={{ color:'#1b5e20' }}>{tab.headline}</h2>
                <p className="text-gray-500 leading-relaxed mb-6 font-medium">{tab.desc}</p>
                <Link to={tab.link} className="btn-green inline-flex" style={{ background:`linear-gradient(135deg,${tab.color},${tab.color}cc)` }}>
                  {tab.cta} <ArrowRight size={16}/>
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {tab.features.map(({ icon: Icon, text }) => (
                  <div key={text} className="who-feat">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background:tab.color+'15' }}>
                      <Icon size={15} style={{ color:tab.color }}/>
                    </div>
                    <p className="text-gray-600 font-semibold text-sm leading-relaxed pt-1">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section id="services" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Our Services 🌿</span></div>
            <p className="text-gray-400 font-semibold">Best Medical Services, Delivered Digitally</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(s => (
              <div key={s.title} className="card-lift bg-white border-2 border-gray-100 rounded-2xl p-6 cursor-default">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm" style={{ background:s.color+'15' }}>{s.emoji}</div>
                <h4 className="font-black text-gray-800 mb-2">{s.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-20 px-6" style={{ background:'#f9fdf9' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>How It Works 🌿</span></div>
            <p className="text-gray-400 font-semibold">Simple steps for every user</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="absolute top-10 left-[15%] right-[15%] h-0.5 hidden md:block" style={{ background:'linear-gradient(to right,#c8e6c9,#a5d6a7,#c8e6c9)' }}/>
            {[
              { num:1, emoji:'📝', title:'Create Account', desc:'Sign up as patient, doctor, or hospital — free forever.' },
              { num:2, emoji:'🔍', title:'Browse & Discover', desc:'Find doctors, camps, blood donors, hospitals near you.' },
              { num:3, emoji:'📅', title:'Book & Manage', desc:'Confirm appointments or manage your practice dashboard.' },
              { num:4, emoji:'💚', title:'Get Better Care', desc:'Consult, track health, update records — all in one place.' },
            ].map(step => (
              <div key={step.num} className="text-center group card-lift bg-white rounded-2xl p-6 border border-green-100 shadow-sm relative">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all" style={{ background:'linear-gradient(135deg,#e8f5e9,#c8e6c9)' }}>
                  {step.emoji}
                </div>
                <span className="absolute top-4 right-4 w-6 h-6 rounded-full text-white text-[11px] font-black flex items-center justify-center" style={{ background:'#2e7d32' }}>{step.num}</span>
                <h4 className="font-black text-gray-800 mb-2">{step.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MEET DOCTORS + BOOKING ══ */}
      <section id="doctors" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Meet Our Doctors 🌿</span></div>
            <p className="text-gray-400 font-semibold">Certified, Verified, Experienced Specialists</p>
          </div>
          <div className="grid lg:grid-cols-[1fr_1fr_1fr_1fr_280px] gap-5 items-start">
            {DOCTORS.map(doc => (
              <div key={doc.name} className="card-lift bg-white rounded-2xl border-2 border-gray-100 overflow-hidden text-center shadow-sm">
                <div className="flex justify-center py-5 px-4" style={{ background:'linear-gradient(160deg,#e8f5e9,#f9fdf9)' }}>
                  <DoctorAvatar hair={doc.hair} accent={doc.accent} size={105}/>
                </div>
                <div className="px-4 py-4">
                  <p className="font-black text-gray-800 text-sm">{doc.name}</p>
                  <p className="text-xs font-semibold mt-0.5 mb-2" style={{ color:doc.accent }}>{doc.role}</p>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={11} fill="#fbbf24" color="#fbbf24"/>)}
                  </div>
                  <p className="text-xs text-gray-400 font-semibold mb-3">{doc.rating} · {doc.exp} exp</p>
                  <Link to="/register"><button className="btn-green w-full text-xs py-2 px-3">Book Now</button></Link>
                </div>
              </div>
            ))}
            {/* Inline booking form */}
            <div className="bg-white rounded-2xl border border-green-200 shadow-lg p-5 sticky top-24">
              <h3 className="font-black text-gray-800 text-base mb-4 pb-3" style={{ borderBottom:'2px solid #e8f5e9' }}>Book an Appointment</h3>
              <div className="space-y-3">
                <input type="text"   placeholder="Your Name"        value={bookForm.name}   onChange={e=>setBookForm({...bookForm,name:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-colors"/>
                <input type="email"  placeholder="Email Address"    value={bookForm.email}  onChange={e=>setBookForm({...bookForm,email:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-colors"/>
                <select value={bookForm.dept} onChange={e=>setBookForm({...bookForm,dept:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-green-400 transition-colors">
                  <option value="">Select Department</option>
                  <option>Cardiology</option><option>Pediatrics</option><option>Neurology</option><option>Dental</option>
                </select>
                <input type="date" value={bookForm.date} onChange={e=>setBookForm({...bookForm,date:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-green-400 transition-colors"/>
                <Link to="/register"><button className="btn-green w-full py-3 text-base mt-1">Book Now</button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOSPITALS ══ */}
      <section id="hospitals" className="py-20 px-6" style={{ background:'#f9fdf9' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Partner Hospitals 🌿</span></div>
            <p className="text-gray-400 font-semibold">Verified Institutions You Can Trust</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            {[
              { name:'City Medical Center',   city:'New Delhi',  beds:250, dept:'Multi-specialty',       badge:'⭐ Top Rated'        },
              { name:'Green Valley Hospital', city:'Mumbai',     beds:180, dept:'Cardiology & Neuro',    badge:'✅ NABH Accredited'   },
              { name:'Sunrise Clinic',        city:'Bangalore',  beds:80,  dept:'General & Pediatrics',  badge:'🏅 Best 2025'        },
            ].map(h => (
              <div key={h.name} className="card-lift bg-white rounded-2xl border-2 border-purple-100 p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <HospitalSVG size={56}/>
                  <div>
                    <p className="font-black text-gray-800 text-sm">{h.name}</p>
                    <p className="text-xs text-gray-400 font-semibold flex items-center gap-1 mt-0.5"><MapPin size={10}/>{h.city}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:'#f3e5f5',color:'#6a1b9a' }}>{h.dept}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">{h.beds} Beds</span>
                </div>
                <p className="text-xs font-black text-green-700">{h.badge}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm font-semibold mb-4">Is your hospital not listed? Join HealthSphere today!</p>
            <Link to="/register" className="btn-green px-8 py-3">Register Your Hospital <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>What They Say 🌿</span></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-lift bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
                <div className="flex gap-1 mb-3">{[1,2,3,4,5].map(s=><Star key={s} size={13} fill="#fbbf24" color="#fbbf24"/>)}</div>
                <p className="text-gray-500 text-sm leading-relaxed italic mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl" style={{ background:t.color+'15' }}>{t.emoji}</div>
                  <div><p className="font-black text-gray-800 text-sm">{t.name}</p><p className="text-xs font-bold" style={{ color:t.color }}>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3-WAY CTA ══ */}
      <section className="py-20 px-6" style={{ background:'#f9fdf9' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Join HealthSphere 🌿</span></div>
            <p className="text-gray-400 font-semibold">Choose your role and start for free today</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji:'🧑‍⚕️', role:'Patient',  desc:'Book doctors, track health, and get AI insights for free.',                          color:'#1565c0', bg:'#e3f2fd', border:'#90caf9', cta:'Sign Up as Patient' },
              { emoji:'👨‍⚕️', role:'Doctor',   desc:'List your profile, manage appointments, accept online consultations.',               color:'#2e7d32', bg:'#e8f5e9', border:'#a5d6a7', cta:'Register as Doctor' },
              { emoji:'🏥',    role:'Hospital', desc:'Digitize your hospital — camps, blood drives, doctor network.',                      color:'#6a1b9a', bg:'#f3e5f5', border:'#ce93d8', cta:'Register Hospital'  },
            ].map(c => (
              <div key={c.role} className="card-lift rounded-3xl border-2 p-8 text-center" style={{ borderColor:c.border, background:c.bg+'60' }}>
                <div className="text-5xl mb-4">{c.emoji}</div>
                <h3 className="text-xl font-black mb-2" style={{ color:c.color }}>{c.role}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{c.desc}</p>
                <Link to="/register">
                  <button className="btn-green w-full justify-center" style={{ background:`linear-gradient(135deg,${c.color},${c.color}bb)` }}>
                    {c.cta} <ArrowRight size={15}/>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background:'#0d3318' }} className="px-6 pt-12 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#2e7d32,#66bb6a)' }}><Heart size={16} className="text-white"/></div>
                <span className="text-xl font-black text-white">HealthSphere</span>
              </Link>
              <p className="text-green-300/60 text-sm leading-relaxed">For Patients · Doctors · Hospitals. One platform for better healthcare across India.</p>
            </div>
            {[
              { title:'Patients',            links:[['#','Book Appointment'],['#services','AI Health Check'],['#','Blood Donation'],['#','Find Hospital']] },
              { title:'Doctors & Hospitals', links:[['#who','Register as Doctor'],['#who','Register Hospital'],['#','Manage Appointments'],['#','Healthcare Camps']] },
              { title:'Quick Links',         links:[['#services','Services'],['#doctors','Doctors'],['#hospitals','Hospitals'],['/login','Sign In']] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white font-black mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(([href,label]) => (
                    <li key={label}><a href={href} className="text-green-300/60 text-sm hover:text-green-300 transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
            <p className="text-green-300/35 text-sm">© 2026 HealthSphere. All Rights Reserved.</p>
            <div className="flex gap-5">
              {['Home','About','Services','Contact'].map(l=>(
                <a key={l} href="#" className="text-green-300/40 text-sm hover:text-green-300 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
