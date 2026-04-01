import { useEffect, useState } from 'react';
import {
  Settings, Palette, Bell, Eye, Shield, X, Globe, Check,
  Moon, Sun, Calendar, Lock, Monitor, MapPin, Crosshair, Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { userSettingsApi, authApi } from '../../api/axios';

const TABS = [
  { id: 'general',      label: 'General',            icon: Settings  },
  { id: 'appearance',   label: 'Appearance',          icon: Palette   },
  { id: 'notifications',label: 'Notifications',       icon: Bell      },
  { id: 'location',     label: 'Location',            icon: MapPin    },
  { id: 'visibility',   label: 'Profile Visibility',  icon: Eye       },
  { id: 'account',      label: 'Account',             icon: Shield    },
];

const ToggleRow = ({ title, desc, value, onToggle, theme }) => (
  <div className={`flex items-center justify-between p-4 rounded-xl border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-dark-800/50 border-white/5'}`}>
    <div>
      <h4 className={`text-sm font-medium mb-0.5 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{title}</h4>
      <p className={`text-[13px] ${theme === 'light' ? 'text-gray-500' : 'text-white/40'}`}>{desc}</p>
    </div>
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 flex-shrink-0 ml-4 ${value ? 'bg-primary-500' : theme === 'light' ? 'bg-gray-200' : 'bg-dark-600 border border-white/20'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const DoctorSettingsModal = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, user } = useApp();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const initialTab = (queryTab && TABS.find(t => t.id === queryTab)) ? queryTab : 'general';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  // General
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  // Notifications
  const [emailNotif, setEmailNotif]           = useState(true);
  const [smsNotif, setSmsNotif]               = useState(false);
  const [pushNotif, setPushNotif]             = useState(true);
  const [appointmentAlert, setAppointmentAlert] = useState(true);

  // Profile Visibility
  const [profilePublic, setProfilePublic]     = useState(true);
  const [showPhone, setShowPhone]             = useState(false);
  const [showEmail, setShowEmail]             = useState(false);
  const [showReviews, setShowReviews]         = useState(true);
  const [showExperience, setShowExperience]   = useState(true);
  const [onlineStatus, setOnlineStatus]       = useState(true);

  // Location
  const [locationCity, setLocationCity]     = useState(user?.location?.city || '');
  const [manualCity, setManualCity]         = useState('');
  const [geoLoading, setGeoLoading]         = useState(false);
  const [locationMsg, setLocationMsg]       = useState('');

  useEffect(() => {
    userSettingsApi.getSettings().then(res => {
      const s = res.data?.settings || res.data || {};
      if (s.general) {
        if (s.general.language) setLanguage(s.general.language);
        if (s.general.timezone) setTimezone(s.general.timezone);
      }
      if (s.appearance?.theme && s.appearance.theme !== 'system') {
        setTheme(s.appearance.theme);
      }
      if (s.notifications) {
        if (s.notifications.emailNotifications !== undefined) setEmailNotif(s.notifications.emailNotifications);
        if (s.notifications.phoneNotifications !== undefined) setSmsNotif(s.notifications.phoneNotifications);
        if (s.notifications.pushNotifications !== undefined)  setPushNotif(s.notifications.pushNotifications);
        if (s.notifications.appointmentReminder !== undefined) setAppointmentAlert(s.notifications.appointmentReminder);
      }
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id }, { replace: true });
  };

  const handleLang = async (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    try { await userSettingsApi.updateGeneral({ language: code }); } catch (_) {}
  };

  const handleTimezone = async (val) => {
    setTimezone(val);
    try { await userSettingsApi.updateGeneral({ timezone: val }); } catch (_) {}
  };

  const handleTheme = async (val) => {
    if (val !== 'system') setTheme(val);
    try { await userSettingsApi.updateAppearance({ theme: val }); } catch (_) {}
  };

  const handleNotif = async (key, val) => {
    const map = {
      emailNotifications: setEmailNotif,
      phoneNotifications: setSmsNotif,
      pushNotifications:  setPushNotif,
      appointmentReminder: setAppointmentAlert,
    };
    map[key]?.(val);
    try { await userSettingsApi.updateNotification({ [key]: val }); } catch (_) {}
  };

  const bg   = theme === 'light' ? 'bg-white'      : 'bg-dark-900';
  const bg2  = theme === 'light' ? 'bg-gray-50/80'  : 'bg-dark-900/60';
  const text = theme === 'light' ? 'text-gray-900'  : 'text-white';
  const sub  = theme === 'light' ? 'text-gray-500'  : 'text-white/40';
  const bdr  = theme === 'light' ? 'border-gray-200' : 'border-white/10';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center md:p-8 animate-fade-in">
      <div className={`w-full max-w-5xl h-[90vh] md:h-[78vh] rounded-t-[2.5rem] md:rounded-2xl shadow-2xl border-t md:border ${bdr} flex flex-col md:flex-row overflow-hidden animate-slide-up relative ${bg} pb-safe`}>

        <div className="md:hidden w-full flex justify-center py-3 bg-transparent absolute top-0 z-50 pointer-events-none">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        <button
          onClick={() => navigate('/doctor/dashboard')}
          className={`absolute top-5 right-5 md:top-4 md:right-4 p-2 rounded-full z-40 transition-colors ${theme === 'light' ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100' : 'text-white/50 hover:text-white bg-white/5 hover:bg-white/10'}`}
        >
          <X size={20} />
        </button>

        <div className={`w-full md:w-64 md:border-r ${theme === 'light' ? 'border-gray-200 bg-gray-50/80' : 'border-white/10 bg-dark-900/60'} p-3 md:p-4 overflow-x-auto md:overflow-y-auto scrollbar-hide flex-shrink-0 border-b md:border-b-0`}>
          <div className="hidden md:flex items-center gap-2 mb-5 px-3 pt-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-primary-500 flex items-center justify-center text-white text-xs font-bold">D</div>
            <h2 className={`text-sm font-bold uppercase tracking-wider ${sub}`}>Doctor Settings</h2>
          </div>
          
          <div className="flex md:flex-col gap-2 mt-8 md:mt-0 px-2 md:px-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-3 md:py-2.5 rounded-full md:rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20 md:border-transparent'
                    : theme === 'light' ? 'text-gray-600 bg-white md:bg-transparent border border-gray-200 md:border-transparent hover:bg-gray-100' : 'text-white/60 bg-white/5 md:bg-transparent border border-white/5 md:border-transparent hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-5 md:p-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h1 className={`text-xl md:text-2xl font-bold mb-6 md:mb-8 border-b pb-4 capitalize ${text} ${bdr}`}>
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>

            {activeTab === 'general' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${text}`}>Language</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[{ code: 'en', name: 'English' }, { code: 'hi', name: 'हिंदी' }, { code: 'es', name: 'Español' }].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLang(lang.code)}
                        className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-between transition-colors ${
                          language === lang.code
                            ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                            : theme === 'light' ? 'border-gray-200 text-gray-600 hover:border-gray-400' : 'border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        <span className="flex items-center gap-2"><Globe size={14} />{lang.name}</span>
                        {language === lang.code && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className={bdr} />

                <div>
                  <h3 className={`text-sm font-semibold mb-2 ${text}`}>Time Zone</h3>
                  <select
                    value={timezone}
                    onChange={e => handleTimezone(e.target.value)}
                    className={`w-full rounded-xl p-3 text-sm border focus:outline-none focus:border-primary-500/50 transition-colors cursor-pointer ${
                      theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800' : 'bg-dark-800/50 border-white/10 text-white/80'
                    }`}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className={`text-sm font-semibold mb-3 ${text}`}>Interface Theme</h3>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {[
                      { id: 'dark',   icon: Moon,    label: 'Dark'   },
                      { id: 'light',  icon: Sun,     label: 'Light'  },
                      { id: 'system', icon: Monitor, label: 'System' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => handleTheme(opt.id)}
                        className={`p-3 md:p-4 rounded-xl border text-xs md:text-sm font-medium flex flex-col items-center gap-3 transition-colors ${
                          theme === opt.id || (opt.id === 'dark' && theme !== 'light')
                            ? 'border-primary-500 bg-primary-500/10 text-primary-500'
                            : theme === 'light' ? 'border-gray-200 text-gray-500 hover:border-gray-400' : 'border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        <div className={`w-10 h-6 md:w-12 md:h-8 rounded-md border ${opt.id === 'dark' ? 'bg-dark-900 border-white/20' : opt.id === 'light' ? 'bg-white border-gray-300' : 'bg-gradient-to-r from-dark-900 to-white border-gray-300'}`} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-3 md:space-y-4 animate-fade-in">
                <ToggleRow theme={theme} title="Email Notifications" desc="Appointment confirmations and updates via email"
                  value={emailNotif} onToggle={() => handleNotif('emailNotifications', !emailNotif)} />
                <ToggleRow theme={theme} title="SMS / Phone Alerts" desc="Text message alerts for new appointments"
                  value={smsNotif} onToggle={() => handleNotif('phoneNotifications', !smsNotif)} />
                <ToggleRow theme={theme} title="Push Notifications" desc="Browser push notifications"
                  value={pushNotif} onToggle={() => handleNotif('pushNotifications', !pushNotif)} />
                <ToggleRow theme={theme} title="Appointment Reminders" desc="Get notified 1 hour before each appointment"
                  value={appointmentAlert} onToggle={() => handleNotif('appointmentReminder', !appointmentAlert)} />

                <hr className={`my-4 ${bdr}`} />
                <div className={`bg-primary-500/5 border border-primary-500/20 rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${bdr} ${bg2}`}>
                      <Calendar size={18} className="text-primary-500" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold mb-0.5 ${text}`}>Google Calendar</h4>
                      <p className={`text-[12px] md:text-[13px] ${sub}`}>Sync appointments and set reminders</p>
                    </div>
                  </div>
                  <button className="w-full md:w-auto px-4 py-2 border border-primary-500/50 hover:bg-primary-500/20 text-primary-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                    Connect
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="space-y-5 md:space-y-6 animate-fade-in">
                <p className={`text-sm ${sub}`}>Set your current location so patients nearby can find you easily.</p>

                <div className={`p-4 md:p-5 rounded-2xl border ${bdr} ${bg2} space-y-4`}>
                  <h3 className={`text-sm font-semibold ${text}`}>Live Location</h3>
                  {locationCity && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 w-fit`}>
                      <MapPin size={13} className="text-green-400" />
                      <span className="text-green-400 text-sm font-medium">{locationCity}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={geoLoading}
                    onClick={() => {
                      if (!navigator.geolocation) return;
                      setGeoLoading(true); setLocationMsg('');
                      navigator.geolocation.getCurrentPosition(
                        async ({ coords }) => {
                          try {
                            const res = await authApi.updateLocation({ latitude: coords.latitude, longitude: coords.longitude });
                            const city = res.data?.location?.city || res.data?.user?.location?.city || `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`;
                            setLocationCity(city);
                            setLocationMsg('Location updated!');
                          } catch { setLocationMsg('Update failed. Try again.'); }
                          finally { setGeoLoading(false); }
                        },
                        () => { setLocationMsg('Permission denied.'); setGeoLoading(false); }
                      );
                    }}
                    className="flex w-full md:w-auto justify-center md:items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                  >
                    {geoLoading ? <Loader2 size={14} className="animate-spin" /> : <Crosshair size={14} />}
                    {geoLoading ? 'Detecting…' : 'Use My Location'}
                  </button>
                  {locationMsg && (
                    <p className={`text-xs ${locationMsg.includes('!') ? 'text-green-400' : 'text-red-400'}`}>{locationMsg}</p>
                  )}
                </div>

                <div className={`p-4 md:p-5 rounded-2xl border ${bdr} ${bg2} space-y-3`}>
                  <h3 className={`text-sm font-semibold ${text}`}>Set City Manually</h3>
                  <p className={`text-xs ${sub}`}>Type your city name if location detection isn't available.</p>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      value={manualCity}
                      onChange={e => setManualCity(e.target.value)}
                      placeholder="e.g. Delhi, Mumbai..."
                      className={`flex-1 rounded-xl px-4 py-2.5 text-sm border focus:outline-none focus:border-primary-500/50 transition-colors ${
                        theme === 'light' ? 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400' : 'bg-dark-800/60 border-white/10 text-white placeholder-white/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!manualCity.trim()) return;
                        try {
                          await authApi.updateLocation({ city: manualCity.trim() });
                          setLocationCity(manualCity.trim());
                          setManualCity('');
                          setLocationMsg('City updated!');
                          setTimeout(() => setLocationMsg(''), 2500);
                        } catch { setLocationMsg('Update failed.'); }
                      }}
                      className="px-4 w-full md:w-auto py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-all"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'visibility' && (
              <div className="space-y-3 md:space-y-4 animate-fade-in">
                <p className={`text-sm mb-4 md:mb-6 ${sub}`}>Control what patients can see on your public profile.</p>

                <ToggleRow theme={theme} title="Public Profile" desc="Allow patients to discover and view your profile"
                  value={profilePublic} onToggle={() => setProfilePublic(v => !v)} />
                <ToggleRow theme={theme} title="Show Phone Number" desc="Display your contact number on your profile"
                  value={showPhone} onToggle={() => setShowPhone(v => !v)} />
                <ToggleRow theme={theme} title="Show Email Address" desc="Display your email publicly on your profile"
                  value={showEmail} onToggle={() => setShowEmail(v => !v)} />
                <ToggleRow theme={theme} title="Show Reviews & Ratings" desc="Let patients see your ratings and feedback"
                  value={showReviews} onToggle={() => setShowReviews(v => !v)} />
                <ToggleRow theme={theme} title="Show Experience & Education" desc="Display your work history and qualifications"
                  value={showExperience} onToggle={() => setShowExperience(v => !v)} />
                <ToggleRow theme={theme} title="Show Online Status" desc="Indicate when you are actively online"
                  value={onlineStatus} onToggle={() => setOnlineStatus(v => !v)} />
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-5 md:space-y-6 animate-fade-in">
                <div className={`bg-primary-500/10 border border-primary-500/20 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
                  <div>
                    <h3 className={`font-bold flex items-center gap-2 mb-1 ${text}`}>
                      <Shield size={16} className="text-primary-500" /> Secure your account
                    </h3>
                    <p className={`text-xs md:text-sm ${sub}`}>Add multi-factor authentication (MFA) to protect your account.</p>
                  </div>
                  <button className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                    Set up MFA
                  </button>
                </div>

                <hr className={bdr} />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-medium mb-0.5 ${text}`}>Change Password</h4>
                      <p className={`text-xs md:text-[13px] ${sub}`}>Update your login password</p>
                    </div>
                    <button className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      theme === 'light' ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-white/10 text-white/80 hover:bg-white/5'
                    }`}>Update</button>
                  </div>
                  <hr className={bdr} />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-medium mb-0.5 ${text}`}>Active Sessions</h4>
                      <p className={`text-xs md:text-[13px] ${sub}`}>Manage devices logged into your account</p>
                    </div>
                    <button className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      theme === 'light' ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-white/10 text-white/80 hover:bg-white/5'
                    }`}>Manage</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSettingsModal;
