import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, ArrowRight, CheckCircle,
  Calendar, Brain, Droplets, MapPin, Shield,
  Stethoscope, Building2, Users, Activity, Clock,
  Award, Zap, FileText, UserCheck, BarChart2,
  Heart
} from 'lucide-react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingWhoSection from '../components/landing/LandingWhoSection';
import LandingFooter from '../components/landing/LandingFooter';

const DoctorAvatar = ({ hair = '#5d4037', accent = '#4caf50', size = 120 }) => (
  <svg width={size} height={Math.round(size * 1.09)} viewBox="0 0 120 130" fill="none" style={{ display:'block' }}>
    <ellipse cx="60" cy="118" rx="36" ry="16" fill="#fff" stroke="#e0e0e0" strokeWidth="1.5"/>
    <rect x="36" y="85" width="48" height="40" rx="8" fill="#fff" stroke="#e0e0e0" strokeWidth="1.5"/>
    <rect x="46" y="88" width="28" height="35" rx="4" fill={accent} opacity="0.7"/>
    <rect x="53" y="68" width="14" height="18" rx="7" fill="#ffccaa"/>
    <ellipse cx="60" cy="56" rx="26" ry="28" fill="#ffccaa"/>
    <ellipse cx="60" cy="34" rx="27" ry="18" fill={hair}/>
    <ellipse cx="36" cy="52" rx="10" ry="18" fill={hair}/>
    <ellipse cx="84" cy="52" rx="10" ry="18" fill={hair}/>
    <ellipse cx="50" cy="58" rx="5" ry="6" fill="#fff"/>
    <ellipse cx="50" cy="59" rx="3.5" ry="4.5" fill="#3e2723"/>
    <ellipse cx="70" cy="58" rx="5" ry="6" fill="#fff"/>
    <ellipse cx="70" cy="59" rx="3.5" ry="4.5" fill="#3e2723"/>
    <path d="M54 70 Q60 76 66 70" stroke="#c17b6f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <rect x="55" y="88" width="10" height="10" rx="2" fill="#e53935" opacity="0.85"/>
    <rect x="58.5" y="89.5" width="3" height="7" rx="1" fill="#fff"/>
    <rect x="56.5" y="91.5" width="7" height="3" rx="1" fill="#fff"/>
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

const SERVICES = [
  { emoji:'🩺', title:'General Checkup',  desc:'Comprehensive health assessment by certified physicians.', color:'#e53935' },
  { emoji:'👶', title:'Pediatrics',        desc:'Specialized care for infants, children & adolescents.',   color:'#1565c0' },
  { emoji:'🔬', title:'Diagnostics',       desc:'Advanced lab tests, imaging, and health screening.',       color:'#6a1b9a' },
  { emoji:'🦷', title:'Dental Care',       desc:'Complete dental services for a healthy, confident smile.', color:'#f57c00' },
  { emoji:'❤️', title:'Cardiology',        desc:'Expert heart health monitoring and treatment plans.',      color:'#c62828' },
  { emoji:'🧠', title:'AI Prediction',     desc:'AI-based early detection for heart disease & diabetes.',   color:'#2e7d32' },
];

const DOCTORS = [
  { name:'Dr. Aiko Suzuki', role:'Cardiologist',  hair:'#f48fb1', accent:'#e91e63', exp:'12 yrs', rating:4.9 },
  { name:'Dr. Hiro Tanaka', role:'Pediatrician',  hair:'#5d4037', accent:'#42a5f5', exp:'8 yrs',  rating:4.8 },
  { name:'Dr. Kenji Mori',  role:'Neurologist',   hair:'#37474f', accent:'#66bb6a', exp:'15 yrs', rating:4.9 },
  { name:'Dr. Mei Chen',    role:'Dentist',        hair:'#795548', accent:'#ab47bc', exp:'6 yrs',  rating:4.7 },
];

const TESTIMONIALS = [
  { emoji:'🧑‍⚕️', text:'Found a specialist and booked in 2 minutes. The AI health check is incredible!',                             name:'Priya S.',     role:'Patient',     color:'#1565c0' },
  { emoji:'👨‍⚕️', text:'My appointment dashboard is clean and professional. I manage 30+ patients per day effortlessly.',             name:'Dr. Raj M.',   role:'Cardiologist',color:'#2e7d32' },
  { emoji:'🏥',    text:'We listed our hospital, ran 3 healthcare camps, and got 200+ new patient registrations in one month.',        name:'City Medical', role:'Hospital',    color:'#6a1b9a' },
];

const Landing = () => {
  const [bookForm, setBookForm] = useState({ name:'', email:'', dept:'', date:'' });

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

      <LandingNavbar />
      <LandingHero />
      <LandingWhoSection />

      <section id="services" className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Our Services 🌿</span></div>
            <p className="text-gray-400 font-semibold text-sm sm:text-base">Best Medical Services, Delivered Digitally</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICES.map(s => (
              <div key={s.title} className="card-lift bg-white border-2 border-gray-100 rounded-2xl p-5 sm:p-6 cursor-default">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 shadow-sm" style={{ background:s.color+'15' }}>{s.emoji}</div>
                <h4 className="font-black text-gray-800 mb-2">{s.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background:'#f9fdf9' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>How It Works 🌿</span></div>
            <p className="text-gray-400 font-semibold text-sm sm:text-base">Simple steps for every user</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative">
            <div className="absolute top-10 left-[15%] right-[15%] h-0.5 hidden md:block" style={{ background:'linear-gradient(to right,#c8e6c9,#a5d6a7,#c8e6c9)' }}/>
            {[
              { num:1, emoji:'📝', title:'Create Account', desc:'Sign up as patient, doctor, or hospital — free forever.' },
              { num:2, emoji:'🔍', title:'Browse & Discover', desc:'Find doctors, camps, blood donors, hospitals near you.' },
              { num:3, emoji:'📅', title:'Book & Manage', desc:'Confirm appointments or manage your practice dashboard.' },
              { num:4, emoji:'💚', title:'Get Better Care', desc:'Consult, track health, update records — all in one place.' },
            ].map(step => (
              <div key={step.num} className="text-center group card-lift bg-white rounded-2xl p-4 sm:p-6 border border-green-100 shadow-sm relative">
                <div className="w-14 sm:w-20 h-14 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4 shadow-md" style={{ background:'linear-gradient(135deg,#e8f5e9,#c8e6c9)' }}>
                  {step.emoji}
                </div>
                <span className="absolute top-3 right-3 w-5 sm:w-6 h-5 sm:h-6 rounded-full text-white text-[10px] sm:text-[11px] font-black flex items-center justify-center" style={{ background:'#2e7d32' }}>{step.num}</span>
                <h4 className="font-black text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{step.title}</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="doctors" className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Meet Our Doctors 🌿</span></div>
            <p className="text-gray-400 font-semibold text-sm sm:text-base">Certified, Verified, Experienced Specialists</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_280px] gap-4 sm:gap-5 items-start">
            {DOCTORS.map(doc => (
              <div key={doc.name} className="card-lift bg-white rounded-2xl border-2 border-gray-100 overflow-hidden text-center shadow-sm">
                <div className="flex justify-center py-4 px-3" style={{ background:'linear-gradient(160deg,#e8f5e9,#f9fdf9)' }}>
                  <DoctorAvatar hair={doc.hair} accent={doc.accent} size={85}/>
                </div>
                <div className="px-3 py-3">
                  <p className="font-black text-gray-800 text-xs sm:text-sm">{doc.name}</p>
                  <p className="text-xs font-semibold mt-0.5 mb-1.5" style={{ color:doc.accent }}>{doc.role}</p>
                  <div className="flex items-center justify-center gap-0.5 mb-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="#fbbf24" color="#fbbf24"/>)}
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold mb-2">{doc.rating} · {doc.exp}</p>
                  <Link to="/register"><button className="btn-green w-full text-xs py-1.5 px-2">Book Now</button></Link>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl border border-green-200 shadow-lg p-4 sm:p-5 col-span-2 lg:col-span-1 lg:sticky lg:top-24">
              <h3 className="font-black text-gray-800 text-sm sm:text-base mb-3 pb-3" style={{ borderBottom:'2px solid #e8f5e9' }}>Book an Appointment</h3>
              <div className="space-y-2.5 sm:space-y-3">
                <input type="text" placeholder="Your Name" value={bookForm.name} onChange={e => setBookForm({...bookForm,name:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 sm:py-2.5 text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-colors"/>
                <input type="email" placeholder="Email Address" value={bookForm.email} onChange={e => setBookForm({...bookForm,email:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 sm:py-2.5 text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-colors"/>
                <select value={bookForm.dept} onChange={e => setBookForm({...bookForm,dept:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 sm:py-2.5 text-sm text-gray-500 focus:outline-none focus:border-green-400 transition-colors">
                  <option value="">Select Department</option>
                  <option>Cardiology</option><option>Pediatrics</option><option>Neurology</option><option>Dental</option>
                </select>
                <input type="date" value={bookForm.date} onChange={e => setBookForm({...bookForm,date:e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 sm:py-2.5 text-sm text-gray-500 focus:outline-none focus:border-green-400 transition-colors"/>
                <Link to="/register"><button className="btn-green w-full py-2.5 sm:py-3 text-sm sm:text-base mt-1">Book Now</button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hospitals" className="py-16 sm:py-20 px-4 sm:px-6" style={{ background:'#f9fdf9' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Partner Hospitals 🌿</span></div>
            <p className="text-gray-400 font-semibold text-sm sm:text-base">Verified Institutions You Can Trust</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {[
              { name:'City Medical Center',   city:'New Delhi',  beds:250, dept:'Multi-specialty',      badge:'⭐ Top Rated'       },
              { name:'Green Valley Hospital', city:'Mumbai',     beds:180, dept:'Cardiology & Neuro',   badge:'✅ NABH Accredited'  },
              { name:'Sunrise Clinic',        city:'Bangalore',  beds:80,  dept:'General & Pediatrics', badge:'🏅 Best 2025'       },
            ].map(h => (
              <div key={h.name} className="card-lift bg-white rounded-2xl border-2 border-purple-100 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <HospitalSVG size={44}/>
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
            <Link to="/register" className="btn-green px-7 sm:px-8 py-2.5 sm:py-3">Register Your Hospital <ArrowRight size={16}/></Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>What They Say 🌿</span></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-lift bg-white rounded-2xl border-2 border-gray-100 p-5 sm:p-6 shadow-sm">
                <div className="flex gap-1 mb-3">{[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#fbbf24" color="#fbbf24"/>)}</div>
                <p className="text-gray-500 text-sm leading-relaxed italic mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-full flex items-center justify-center text-xl" style={{ background:t.color+'15' }}>{t.emoji}</div>
                  <div><p className="font-black text-gray-800 text-sm">{t.name}</p><p className="text-xs font-bold" style={{ color:t.color }}>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background:'#f9fdf9' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Join HealthSphere 🌿</span></div>
            <p className="text-gray-400 font-semibold text-sm sm:text-base">Choose your role and start for free today</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { emoji:'🧑‍⚕️', role:'Patient',  desc:'Book doctors, track health, and get AI insights for free.',           color:'#1565c0', bg:'#e3f2fd', border:'#90caf9', cta:'Sign Up as Patient' },
              { emoji:'👨‍⚕️', role:'Doctor',   desc:'List your profile, manage appointments, accept online consultations.', color:'#2e7d32', bg:'#e8f5e9', border:'#a5d6a7', cta:'Register as Doctor' },
              { emoji:'🏥',    role:'Hospital', desc:'Digitize your hospital — camps, blood drives, doctor network.',         color:'#6a1b9a', bg:'#f3e5f5', border:'#ce93d8', cta:'Register Hospital'  },
            ].map(c => (
              <div key={c.role} className="card-lift rounded-3xl border-2 p-6 sm:p-8 text-center" style={{ borderColor:c.border, background:c.bg+'60' }}>
                <div className="text-4xl sm:text-5xl mb-4">{c.emoji}</div>
                <h3 className="text-lg sm:text-xl font-black mb-2" style={{ color:c.color }}>{c.role}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{c.desc}</p>
                <Link to="/register">
                  <button className="btn-green w-full justify-center text-sm sm:text-base" style={{ background:`linear-gradient(135deg,${c.color},${c.color}bb)` }}>
                    {c.cta} <ArrowRight size={15}/>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Landing;
