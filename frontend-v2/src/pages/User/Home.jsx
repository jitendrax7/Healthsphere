import { useNavigate } from 'react-router-dom';
import { Activity, Calendar, Droplets, MapPin, Brain, Stethoscope, ArrowRight, Tent, Heart, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const OVERVIEW = [
  { label: 'Predictions',    icon: Brain,    color: 'from-primary-500 to-primary-700', value: '12' },
  { label: 'Appointments',   icon: Calendar, color: 'from-accent-cyan to-primary-500',  value: '1'  },
  { label: 'Reminders',      icon: Activity, color: 'from-accent-purple to-accent-pink',value: '2'  },
  { label: 'Health Records', icon: Heart,    color: 'from-accent-green to-accent-cyan', value: '5'  },
];

const SERVICES = [
  { title: 'Disease Prediction', icon: Brain,    desc: 'Check symptom-based risk levels for heart disease, diabetes, and skin conditions.', path: '/user/disease',        color: 'from-primary-500 to-primary-700'   },
  { title: 'Book Appointment',   icon: Calendar, desc: 'Schedule appointments with verified doctors across specialties.',                    path: '/user/appointment',    color: 'from-accent-cyan to-primary-500'   },
  { title: 'AI Health Chatbot',  icon: Zap,      desc: 'Ask health-related questions and get intelligent guidance instantly.',               path: null,                   color: 'from-accent-purple to-accent-pink' },
  { title: 'Blood Donation',     icon: Droplets, desc: 'Register as a donor or find blood donors near you.',                                 path: '/user/blood-donation', color: 'from-accent-pink to-accent-orange' },
  { title: 'Healthcare Camps',   icon: Tent,     desc: 'Discover and register for upcoming medical camps in your area.',                     path: '/user/healthcarecamp', color: 'from-accent-green to-accent-cyan'  },
  { title: 'Nearby Finder',      icon: MapPin,   desc: 'Locate hospitals, clinics, and pharmacies near you in real-time.',                   path: '/user/nearby',         color: 'from-accent-orange to-accent-pink' },
];

const UserHome = () => {
  const { user } = useApp();
  const navigate  = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">

      <div className="relative glass p-5 sm:p-8 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-purple/10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-radial from-primary-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="glow-dot" />
            <span className="text-accent-cyan text-xs sm:text-sm font-medium">{greeting}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Welcome back, {user?.Name || 'there'} 👋
          </h1>
          <p className="text-white/50 text-sm sm:text-base">Your complete AI-powered healthcare ecosystem.</p>
          <button
            onClick={() => navigate('/user/setup-profile')}
            className="mt-4 sm:mt-5 btn-primary inline-flex items-center gap-2 text-sm py-2"
          >
            Update Health Profile <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {OVERVIEW.map(({ label, icon: Icon, color, value }) => (
          <div key={label} className="stat-card">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 sm:mb-4 shadow-lg`}>
              <Icon size={16} className="text-white" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
            <p className="text-white/40 text-xs sm:text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-5">Core Health Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {SERVICES.map(({ title, icon: Icon, desc, path, color }) => (
            <div
              key={title}
              onClick={() => path && navigate(path)}
              className={`glass p-4 sm:p-6 rounded-2xl group ${path ? 'cursor-pointer hover:-translate-y-1 hover:border-white/20' : 'cursor-default'} transition-all duration-300`}
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={18} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1.5 sm:mb-2 text-sm sm:text-base">{title}</h3>
              <p className="text-white/40 text-xs sm:text-sm leading-relaxed">{desc}</p>
              {path && (
                <div className="flex items-center gap-1.5 mt-3 sm:mt-4 text-primary-400 text-sm font-medium group-hover:gap-2.5 transition-all">
                  Explore <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-5 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-purple/10 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center flex-shrink-0 shadow-glow-primary">
            <Brain size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-base sm:text-lg mb-1">Smart Health Insight</h3>
            <p className="text-white/50 text-xs sm:text-sm">Based on your profile, maintaining regular checkups and updating your health records improves prediction accuracy by up to 40%.</p>
          </div>
          <button
            onClick={() => navigate('/user/setup-profile')}
            className="btn-primary flex-shrink-0 text-sm py-2 sm:py-2.5 w-full sm:w-auto"
          >
            Update Profile
          </button>
        </div>
      </div>

    </div>
  );
};

export default UserHome;
