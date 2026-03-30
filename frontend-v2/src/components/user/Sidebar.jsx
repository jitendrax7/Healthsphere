import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Home, Activity, Calendar, Tent, Droplets, MapPin,
  LogOut, ChevronLeft, ChevronRight, User, Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { userApi, authApi } from '../../api/axios';
import { useTranslation } from 'react-i18next';
import SettingsModal from './SettingsModal';
const navItems = [
  { name: 'Dashboard',         path: '/user/dashboard',     icon: Home     },
  { name: 'Disease Prediction',path: '/user/disease',       icon: Activity },
  { name: 'Appointment',       path: '/user/appointment',   icon: Calendar },
  { name: 'Healthcare Camps',  path: '/user/healthcarecamp',icon: Tent     },
  { name: 'Blood Donation',    path: '/user/blood-donation',icon: Droplets },
  { name: 'Nearby Finder',     path: '/user/nearby',        icon: MapPin   },
];

const Sidebar = () => {
  const { user, logout } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [collapsed, setCollapsed]         = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [settingsOpen, setSettingsOpen]   = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [manualCity, setManualCity]       = useState('');
  const [cityLabel, setCityLabel]         = useState('');

  useEffect(() => {
    if (searchParams.get('settings')) {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
    }
  }, [searchParams]);

  const handleCloseSettings = () => {
    searchParams.delete('settings');
    setSearchParams(searchParams, { replace: true });
    setSettingsOpen(false);
  };

  useEffect(() => {
    if (user?.location?.city) setCityLabel(user.location.city);
  }, [user]);

  const handleLiveLocation = () => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await authApi.updateLocation({ latitude: coords.latitude, longitude: coords.longitude });
        setCityLabel(res.data.user?.location?.city || `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`);
        setLocationModal(false);
      } catch { alert('Location update failed'); }
    }, () => alert('Please allow location permission.'));
  };

  const handleSaveManual = () => {
    if (manualCity.trim()) { setCityLabel(manualCity); setManualCity(''); setLocationModal(false); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <aside className={`fixed left-0 top-0 h-screen bg-dark-800/95 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>

        {/* ── Logo ── */}
        <div className={`flex items-center gap-3 p-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center font-bold text-white shadow-glow-primary flex-shrink-0">
            H
          </div>
          {!collapsed && <span className="text-lg font-bold gradient-text">HealthSphere</span>}
        </div>

        {/* ── Toggle ── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-dark-600 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-primary-600 transition-all duration-200 z-50"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* ── Nav ── */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path}
              className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
              title={collapsed ? name : ''}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{t(name)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom ── */}
        <div className="p-3 border-t border-white/10 space-y-3">
          {/* Location */}
          {!collapsed && (
            <button
              onClick={() => setLocationModal(true)}
              className="w-full glass p-3 rounded-xl text-left hover:border-primary-500/40 transition-all"
            >
              <p className="text-white/40 text-xs mb-1">{t('Current Location')}</p>
              <p className="text-white/80 text-sm flex items-center gap-1.5">
                <MapPin size={12} className="text-accent-cyan flex-shrink-0" />
                {cityLabel || t('Set location')}
              </p>
            </button>
          )}

          {/* User profile & Menu Flow */}
          {user && (
            <div className="relative">
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)} 
                className={`w-full glass hover:bg-white/10 p-3 rounded-xl flex items-center gap-3 transition-colors ${collapsed ? 'justify-center' : ''}`}
              >
                {user.profilePhoto
                  ? <img src={user.profilePhoto} alt="avatar" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-sm font-bold flex-shrink-0">{user.Name?.[0] || 'U'}</div>
                }
                {!collapsed && (
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-semibold text-white truncate">{user.Name}</p>
                    <p className="text-xs text-white/40 truncate">{user.email}</p>
                  </div>
                )}
              </button>
              
              {/* ChatGPT-style Popup Menu */}
              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                  <div className={`absolute bottom-[calc(100%+10px)] glass-dark border border-white/10 rounded-xl p-2 shadow-2xl animate-fade-in z-50 ${collapsed ? 'left-14 w-48' : 'left-0 w-full'}`}>
                    <button 
                      onClick={() => { setProfileMenuOpen(false); navigate('/user/profile'); }} 
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 text-white text-sm font-medium transition-colors text-left"
                    >
                      <User size={16} className="text-white/60" /> {t('Profile')}
                    </button>
                    <button 
                      onClick={() => { setProfileMenuOpen(false); navigate('/user/settings?tab=general'); }} 
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 text-white text-sm font-medium transition-colors text-left"
                    >
                      <Settings size={16} className="text-white/60" /> {t('Settings')}
                    </button>
                    <div className="h-px bg-white/10 my-1 w-full relative left-0 right-0"></div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/10 text-red-400 text-sm font-medium transition-colors text-left"
                    >
                      <LogOut size={16} className="opacity-80" /> {t('Logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ── Location Modal ── */}
      {locationModal && (
        <div onClick={() => setLocationModal(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div onClick={e => e.stopPropagation()} className="glass-dark w-full max-w-sm mx-4 p-6 rounded-2xl shadow-card-dark animate-slide-up">
            <h2 className="text-lg font-semibold text-white mb-5">Set Your Location</h2>

            <button onClick={handleLiveLocation} className="btn-primary w-full mb-4 flex items-center justify-center gap-2">
              <MapPin size={16} /> Use Live Location
            </button>

            <p className="text-center text-white/30 text-sm mb-4">— OR —</p>

            <input
              type="text" placeholder="Enter city name..."
              value={manualCity} onChange={e => setManualCity(e.target.value)}
              className="input-dark mb-3"
            />
            <button onClick={handleSaveManual} className="btn-secondary w-full">Save Location</button>
          </div>
        </div>
      )}
      {/* ── Settings Modal ── */}
      {settingsOpen && <SettingsModal onClose={handleCloseSettings} />}
    </>
  );
};

export default Sidebar;
