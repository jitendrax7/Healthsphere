import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Brain, Droplets, MapPin, Shield, Activity,
  UserCheck, FileText, BarChart2, Users, Zap, Building2, ArrowRight
} from 'lucide-react';

const WHO_TABS = {
  patient: {
    icon: '🧑‍⚕️', label: 'For Patients', color: '#1565c0', bg: '#e3f2fd', border: '#90caf9',
    headline: 'Take Charge of Your Health',
    desc: 'Book appointments, track health, find donors, get AI-powered health insights — all in one app designed for you.',
    features: [
      { icon: Calendar,  text: 'Book doctor appointments in 60 seconds' },
      { icon: Brain,     text: 'AI disease risk prediction tools' },
      { icon: Droplets,  text: 'Find blood donors nearby instantly' },
      { icon: MapPin,    text: 'Locate hospitals & clinics near you' },
      { icon: Shield,    text: 'Secure personal health records' },
      { icon: Activity,  text: 'AI skin disease detection' },
    ],
    cta: 'Sign Up as Patient', link: '/register',
  },
  doctor: {
    icon: '👨‍⚕️', label: 'For Doctors', color: '#2e7d32', bg: '#e8f5e9', border: '#a5d6a7',
    headline: 'Manage Your Practice Smarter',
    desc: 'Get a verified profile, manage appointments effortlessly, connect with patients, and grow your practice digitally.',
    features: [
      { icon: UserCheck,  text: 'Verified doctor profile with badge' },
      { icon: Calendar,   text: 'Smart appointment calendar & slot management' },
      { icon: FileText,   text: 'Patient consultation notes & history' },
      { icon: BarChart2,  text: 'Practice dashboard & earnings overview' },
      { icon: Users,      text: 'Connect with hospitals & clinics' },
      { icon: Zap,        text: 'Online & in-person consultation modes' },
    ],
    cta: 'Register as Doctor', link: '/register',
  },
  hospital: {
    icon: '🏥', label: 'For Hospitals', color: '#6a1b9a', bg: '#f3e5f5', border: '#ce93d8',
    headline: 'Digitize Your Hospital Operations',
    desc: 'List your hospital, manage healthcare camps, handle blood donation requests, and connect with doctors seamlessly.',
    features: [
      { icon: Building2,  text: 'Verified hospital listing & profile' },
      { icon: Calendar,   text: 'Healthcare camp & event management' },
      { icon: Droplets,   text: 'Blood donation drive management' },
      { icon: Users,      text: 'Connect & manage associated doctors' },
      { icon: BarChart2,  text: 'Camp registrations & analytics dashboard' },
      { icon: Shield,     text: 'Document verification & accreditation' },
    ],
    cta: 'Register Your Hospital', link: '/register',
  },
};

const LandingWhoSection = () => {
  const [activeTab, setActiveTab] = useState('patient');
  const tab = WHO_TABS[activeTab];

  return (
    <section id="who" className="py-16 sm:py-24 px-4 sm:px-6" style={{ background: '#fafdf9' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-10">
          <div className="leaf-title mb-2"><span className="text-2xl font-black" style={{ color:'#2e7d32' }}>Who Is It For? 🌿</span></div>
          <p className="text-gray-400 font-semibold text-sm sm:text-base">HealthSphere serves three communities under one roof</p>
        </div>

        <div className="flex justify-center mb-6 sm:mb-8 bg-gray-100 rounded-2xl p-1.5 max-w-sm sm:max-w-md mx-auto">
          {Object.entries(WHO_TABS).map(([key, t]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all"
              style={{
                background: activeTab === key ? 'white' : 'transparent',
                color: activeTab === key ? t.color : '#9e9e9e',
                boxShadow: activeTab === key ? '0 2px 12px rgba(0,0,0,.08)' : 'none',
              }}>
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label.split(' ')[1]}</span>
              <span className="sm:hidden text-[11px]">{t.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        <div className="rounded-3xl border-2 p-5 sm:p-8 transition-all duration-300" style={{ borderColor: tab.border, background: tab.bg+'60' }}>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-black mb-4" style={{ background: tab.bg, color: tab.color, border:`2px solid ${tab.border}` }}>
                <span>{tab.icon}</span> {tab.label}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color:'#1b5e20' }}>{tab.headline}</h2>
              <p className="text-gray-500 leading-relaxed mb-6 font-medium text-sm sm:text-base">{tab.desc}</p>
              <Link to={tab.link} className="btn-green inline-flex" style={{ background:`linear-gradient(135deg,${tab.color},${tab.color}cc)` }}>
                {tab.cta} <ArrowRight size={16}/>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {tab.features.map(({ icon: Icon, text }) => (
                <div key={text} className="who-feat">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: tab.color+'15' }}>
                    <Icon size={15} style={{ color: tab.color }}/>
                  </div>
                  <p className="text-gray-600 font-semibold text-sm leading-relaxed pt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingWhoSection;
