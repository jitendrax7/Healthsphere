import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart } from 'lucide-react';
import { MapPin } from 'lucide-react';

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

const HospitalSVG = ({ size = 44 }) => (
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

const STATS = [['10K+','Patients'],['500+','Doctors'],['50+','Hospitals'],['94%','Accuracy']];

const LandingHero = () => (
  <section className="relative pt-16 overflow-hidden" style={{ background: 'linear-gradient(150deg,#f1faf3 0%,#e8f5e9 55%,#c8e6c9 100%)', minHeight: '92vh' }}>
    <div className="absolute top-16 left-6 opacity-25 sway text-green-500"><Leaf size={64}/></div>
    <div className="absolute top-28 right-10 opacity-15 sway text-green-400" style={{ animationDelay:'1.5s' }}><Leaf size={90}/></div>
    <div className="absolute bottom-16 left-12 opacity-15 sway" style={{ animationDelay:'.8s', color:'#4caf50' }}><Leaf size={52}/></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 pt-10 sm:pt-14 pb-24 sm:pb-28">
      <div className="flex-1 z-10 max-w-xl text-center lg:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-full mb-5 sm:mb-6" style={{ background:'#dcfce7', color:'#166534' }}>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>India&apos;s #1 Healthcare Platform
        </div>
        <h1 className="font-black leading-tight mb-4 tracking-tight" style={{ fontSize:'clamp(2rem,5vw,3.8rem)', color:'#1b5e20' }}>
          Your Health,<br/>
          <span style={{ color:'#2e7d32' }}>Our Priority </span>
          <span className="sway inline-block text-3xl">🌿</span>
        </h1>
        <p className="text-base font-semibold mb-3" style={{ color:'#388e3c' }}>
          For <strong>Patients</strong> · <strong>Doctors</strong> · <strong>Hospitals</strong>
        </p>
        <p className="leading-relaxed mb-8 font-medium" style={{ color:'#558b2f', fontSize:'1rem' }}>
          One unified platform connecting patients, doctors and hospitals. Book appointments, manage clinics, run healthcare camps — all with beautiful simplicity.
        </p>
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center lg:justify-start">
          <Link to="/register" className="btn-green text-base px-7 sm:px-8 py-3 sm:py-3.5">Get Started Free <ArrowRight size={18}/></Link>
          <a href="#who" className="btn-outline-green text-base px-6 sm:px-7 py-3 sm:py-3.5">Learn More</a>
        </div>
        <div className="flex gap-5 sm:gap-8 mt-8 sm:mt-10 justify-center lg:justify-start flex-wrap">
          {STATS.map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-xl sm:text-2xl font-black" style={{ color:'#2e7d32' }}>{v}</p>
              <p className="text-xs font-semibold text-gray-400">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-end justify-center gap-1 relative z-10 min-h-[220px] sm:min-h-[280px]">
        <div className="float-a"><DoctorAvatar hair="#5d4037" accent="#4caf50" size={120}/></div>
        <div className="float-b z-10 -mx-3">
          <div className="rounded-2xl overflow-hidden border-4 border-white shadow-2xl" style={{ background:'#fce4ec' }}>
            <NurseAvatar hair="#f48fb1" size={100}/>
            <div className="py-1.5 text-center text-xs font-black" style={{ color:'#e91e63' }}>Patient</div>
          </div>
        </div>
        <div className="float-c"><NurseAvatar hair="#795548" size={110}/></div>
        <div className="absolute -bottom-2 right-0 bg-white rounded-2xl shadow-xl p-2.5 sm:p-3 border border-green-100 flex items-center gap-2 sm:gap-3">
          <HospitalSVG size={38}/>
          <div><p className="font-black text-xs text-gray-700">City Hospital</p><p className="text-[10px] text-green-600 font-bold">✅ Verified Partner</p></div>
        </div>
      </div>
    </div>

    <div className="relative mx-4 sm:mx-6 z-10" style={{ marginTop:'-24px' }}>
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-green-100">
        {[
          { emoji:'🧑‍⚕️', title:'For Patients',  sub:'Book, track & get AI health insights',       color:'#1565c0' },
          { emoji:'👨‍⚕️', title:'For Doctors',   sub:'Manage appointments & grow your practice',   color:'#2e7d32' },
          { emoji:'🏥',    title:'For Hospitals', sub:'Manage camps, staff & patient flow',          color:'#6a1b9a' },
        ].map(item => (
          <div key={item.title} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0" style={{ background:item.color+'12' }}>{item.emoji}</div>
            <div>
              <p className="font-black text-gray-800 text-sm">{item.title}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LandingHero;
