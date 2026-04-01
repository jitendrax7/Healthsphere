import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, MessageCircle, Droplets, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { path: '/doctor/dashboard',      icon: Home,          label: 'Home' },
  { path: '/doctor/appointments',   icon: Calendar,      label: 'Appts' },
  { path: '/doctor/chat',           icon: MessageCircle, label: 'Chat' },
  { path: '/doctor/blood-donation', icon: Droplets,      label: 'Blood' },
];

const DoctorMobileBottomNav = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-800/95 backdrop-blur-xl border-t border-white/10 safe-area-pb">
      <div className="flex items-end px-2 h-16">
        <div className="flex flex-1 items-center justify-around">
          
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 px-2 sm:px-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-primary-400' : 'text-white/40 hover:text-white/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${isActive ? 'bg-primary-500/20' : ''}`}>
                    <Icon size={18} />
                  </span>
                  <span className="text-[10px] font-medium leading-none">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <button
            onClick={() => navigate('/doctor/settings?tab=general')}
            className="flex flex-col items-center gap-0.5 py-2 px-2 sm:px-3 rounded-xl transition-all text-white/40 hover:text-white/70"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-xl">
              <Settings size={18} />
            </span>
            <span className="text-[10px] font-medium leading-none">Settings</span>
          </button>

          <button
            onClick={() => navigate('/doctor/profile')}
            className="flex flex-col items-center gap-0.5 py-2 px-2 sm:px-3 rounded-xl transition-all text-white/40 hover:text-white/70"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-xl">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="me" className="w-7 h-7 rounded-full object-cover ring-2 ring-primary-500/30" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-cyan to-primary-500 flex items-center justify-center text-xs font-bold text-white">
                  {user?.Name?.[0] || 'D'}
                </div>
              )}
            </span>
            <span className="text-[10px] font-medium leading-none">Profile</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default DoctorMobileBottomNav;
