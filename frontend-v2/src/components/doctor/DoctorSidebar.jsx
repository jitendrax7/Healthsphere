import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Home, Calendar, MessageCircle, Droplets, User, Settings, LogOut, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { name: 'Dashboard',     path: '/doctor/dashboard',     icon: Home            },
  { name: 'Appointments',  path: '/doctor/appointments',  icon: Calendar        },
  { name: 'Chat',          path: '/doctor/chat',          icon: MessageCircle   },
  { name: 'Blood Donation',path: '/doctor/blood-donation',icon: Droplets        },
  { name: 'Profile',       path: '/doctor/profile',       icon: User            }
];

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-dark-800/95 backdrop-blur-xl border-r border-white/10 flex-col z-40">

      <div className="flex items-center gap-3 p-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan to-primary-500 flex items-center justify-center font-bold text-white shadow-glow-cyan flex-shrink-0">D</div>
        <div>
          <p className="text-sm font-bold text-white">Doctor Panel</p>
          <p className="text-xs text-accent-cyan">HealthSphere</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-full glass flex items-center gap-3 p-3 rounded-xl hover:border-primary-500/40 transition-all"
        >
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user?.Name}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-primary-500/30" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-cyan to-primary-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {user?.Name?.[0] || 'D'}
            </div>
          )}
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.Name || 'Doctor'}</p>
            <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
          </div>
          <ChevronUp size={14} className={`text-white/40 transition-transform ${showMenu ? '' : 'rotate-180'}`} />
        </button>

        {showMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 glass-dark rounded-xl p-2 shadow-card-dark animate-slide-up">
            <NavLink to="/doctor/profile" onClick={() => setShowMenu(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-white/80 hover:text-white transition-all">
              <User size={14} /> View Profile
            </NavLink>
            <button onClick={() => { setShowMenu(false); navigate('/doctor/settings?tab=general'); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/5 text-sm text-white/80 hover:text-white transition-all text-left">
              <Settings size={14} /> Settings
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-sm text-red-400 hover:text-red-300 transition-all">
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DoctorSidebar;
