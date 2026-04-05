import { useEffect, useState } from 'react';
import { Settings, Bell, Palette, User, X, Check, Globe, Calendar, Leaf, Shield, ChevronRight, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { userSettingsApi, googleApi } from '../../api/axios';

const TABS = [
  { id: 'general',       label: 'General',       icon: Settings },
  { id: 'appearance',    label: 'Appearance',     icon: Palette  },
  { id: 'notifications', label: 'Notifications',  icon: Bell     },
  { id: 'account',       label: 'Account',        icon: User     },
];

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`w-12 h-6.5 sm:w-11 sm:h-6 rounded-full flex items-center transition-all px-1 flex-shrink-0 ${value ? 'bg-primary-500' : 'bg-dark-600 border border-white/20'}`}
  >
    <div className={`w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-white shadow-md transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const SettingsModal = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme, logout } = useApp();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const initialTab = (queryTab && TABS.find(t => t.id === queryTab)) ? queryTab : 'general';

  const [activeTab, setActiveTab]             = useState(initialTab);
  const [loading, setLoading]                 = useState(true);
  const [language, setLanguage]               = useState(i18n.language);
  const [timezone, setTimezone]               = useState('Auto-detect (Asia/Kolkata)');
  const [emailNotif, setEmailNotif]           = useState(true);
  const [phoneNotif, setPhoneNotif]           = useState(false);
  const [pushNotif, setPushNotif]             = useState(true);
  const [appointmentReminder, setAppointmentReminder] = useState(true);
  const [googleCalendar, setGoogleCalendar]   = useState({ connected: false });

  useEffect(() => {
    userSettingsApi.getSettings().then(res => {
      const s = res.data?.settings || res.data || {};
      if (s.general) {
        if (s.general.language) setLanguage(s.general.language);
        if (s.general.timezone) setTimezone(s.general.timezone);
      }
      if (s.appearance?.theme) {
        if (s.appearance.theme !== theme && s.appearance.theme !== 'system') setTheme(s.appearance.theme);
      }
      if (s.notifications) {
        if (s.notifications.emailNotifications !== undefined) setEmailNotif(s.notifications.emailNotifications);
        if (s.notifications.phoneNotifications !== undefined) setPhoneNotif(s.notifications.phoneNotifications);
        if (s.notifications.pushNotifications !== undefined) setPushNotif(s.notifications.pushNotifications);
        if (s.notifications.appointmentReminder !== undefined) setAppointmentReminder(s.notifications.appointmentReminder);
      }
      if (s.googleCalendar) setGoogleCalendar(s.googleCalendar);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUpdateGeneral = async (key, val) => {
    if (key === 'language') { setLanguage(val); i18n.changeLanguage(val); }
    if (key === 'timezone') setTimezone(val);
    try { await userSettingsApi.updateGeneral({ [key]: val }); } catch (e) {}
  };

  const handleUpdateAppearance = async (val) => {
    if (val !== 'system') setTheme(val);
    try { await userSettingsApi.updateAppearance({ theme: val }); } catch (e) {}
  };

  const handleUpdateNotification = async (key, val) => {
    if (key === 'emailNotifications') setEmailNotif(val);
    if (key === 'phoneNotifications') setPhoneNotif(val);
    if (key === 'pushNotifications') setPushNotif(val);
    if (key === 'appointmentReminder') setAppointmentReminder(val);
    try { await userSettingsApi.updateNotification({ [key]: val }); } catch (e) {}
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
  };

  const handleConnectGoogleCalendar = async () => {
    try {
      const res = await googleApi.connect();
      if (res.data?.url) window.location.href = res.data.url;
    } catch (error) { console.log('Google connect error', error); }
  };

  const handleDisconnectGoogleCalendar = async () => {
    try {
      await googleApi.disconnect();
      setGoogleCalendar({ connected: false });
    } catch (error) { console.error('Google disconnect error', error); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center sm:p-4 lg:p-8 animate-fade-in">
      <div className="w-full max-w-5xl h-[92vh] sm:h-[80vh] bg-dark-900 sm:glass-dark rounded-t-[2.5rem] sm:rounded-2xl shadow-[0_-10px_50px_rgba(0,0,0,0.5)] sm:shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t sm:border border-white/10 flex flex-col md:flex-row overflow-hidden animate-slide-up relative">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-dark-800/50 shrink-0">
          <div className="flex-1" />
          <div className="flex flex-col items-center flex-1">
            <div className="w-10 h-1.5 bg-white/20 rounded-full mb-3" />
            <h2 className="text-lg font-bold text-white tracking-wide">Settings</h2>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Desktop Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Navigation Sidebar / Tabs */}
        <div className="md:w-56 lg:w-64 bg-dark-900 sm:bg-dark-900/60 md:border-r border-b md:border-b-0 border-white/5 md:p-4 shrink-0 flex flex-col">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider hidden md:block mb-4 px-3 pt-2">Settings</h2>

          <div className="flex md:flex-col gap-2 overflow-x-auto px-5 md:px-0 py-4 md:py-0 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 md:py-3 rounded-2xl text-[13px] md:text-sm font-bold transition-all whitespace-nowrap shrink-0 md:w-full ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow-primary'
                    : 'glass border border-white/5 text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={16} className={activeTab === tab.id ? 'opacity-100 text-white' : 'opacity-70'} />
                {t(tab.label)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto bg-dark-900/50 sm:bg-transparent">
          <div className="max-w-2xl mx-auto md:mx-0">
            <h1 className="hidden md:block text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4 capitalize">{t(activeTab)}</h1>

            {activeTab === 'general' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in relative">
                <div>
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider mb-3">Language</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[{ code:'en', name:'English' }, { code:'es', name:'Español' }, { code:'hi', name:'हिंदी' }].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleUpdateGeneral('language', lang.code)}
                        className={`p-4 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all ${
                          language === lang.code 
                            ? 'border-primary-500 bg-primary-500/10 text-primary-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]' 
                            : 'border-white/5 glass text-white/70 hover:border-white/20 hover:bg-white/5'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate"><Globe size={16} className="opacity-70" /> {lang.name}</span>
                        {language === lang.code && <Check size={16} className="text-primary-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider mb-3">Time Zone</h3>
                  <div className="glass border border-white/5 rounded-2xl overflow-hidden focus-within:border-primary-500/50 transition-colors">
                    <select
                      value={timezone}
                      onChange={e => handleUpdateGeneral('timezone', e.target.value)}
                      className="w-full bg-transparent px-4 py-4 text-sm text-white focus:outline-none cursor-pointer appearance-none"
                    >
                      <option value="Auto-detect (Asia/Kolkata)" className="bg-dark-800">Auto-detect (Asia/Kolkata)</option>
                      <option value="UTC (Coordinated Universal Time)" className="bg-dark-800">UTC (Coordinated Universal Time)</option>
                      <option value="PST (Pacific Standard Time)" className="bg-dark-800">PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider mb-4">Interface Theme</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { key:'dark',   label:'Dark',       preview: <div className="w-full h-12 rounded-lg bg-[#0a0a14] border border-white/20 flex items-center justify-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500" /><div className="w-6 h-2 rounded bg-white/20" /></div> },
                      { key:'light',  label:'Light',      preview: <div className="w-full h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-400" /><div className="w-6 h-2 rounded bg-gray-200" /></div> },
                      { key:'health', label:'Health 🌿',  preview: <div className="w-full h-12 rounded-lg bg-[#f1faf3] border border-green-200 flex items-center justify-center gap-1.5"><Leaf size={14} className="text-green-500" /><div className="w-6 h-2 rounded bg-green-200" /></div> },
                      { key:'system', label:'System',     preview: <div className="w-full h-12 rounded-lg border border-white/20 bg-gradient-to-r from-[#0a0a14] to-white flex items-center justify-center" /> },
                    ].map(({ key, label, preview }) => (
                      <button
                        key={key}
                        onClick={() => handleUpdateAppearance(key)}
                        className={`p-3 rounded-2xl border text-[13px] sm:text-sm font-semibold flex flex-col items-center gap-3 transition-all ${
                          theme === key
                            ? key === 'health' ? 'border-green-500 bg-green-500/10 text-green-400 ring-2 ring-green-500/20' : 'border-primary-500 bg-primary-500/10 text-primary-400 ring-2 ring-primary-500/20'
                            : 'border-white/5 glass text-white/60 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        {preview}
                        <div className="flex items-center gap-1.5">
                          {label} {theme === key && <Check size={14} />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl glass border border-white/5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${theme === 'health' ? 'bg-green-500/20 text-green-400' : 'bg-primary-500/20 text-primary-400'}`}>
                    {theme === 'dark' ? '🌑' : theme === 'light' ? '☀️' : theme === 'health' ? '🌿' : '⚙️'}
                  </div>
                  <div>
                    <p className="text-white text-base font-bold capitalize">{theme === 'health' ? 'Anime Hospital' : theme} Mode</p>
                    <p className="text-white/50 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      {theme === 'health' ? 'A relaxing light green layout tailored for healthcare efficiency.' : theme === 'dark' ? 'Easier on the eyes in low-light environments with glowing accents.' : theme === 'light' ? 'Bright and high-contrast styling for clear visibility.' : 'Automatically switches based on your device settings.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <div className="bg-gradient-to-r from-primary-600/20 to-accent-purple/10 border border-primary-500/20 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm pointer-events-none text-9xl"><Shield /></div>
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">Two-Factor Auth <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase">Disabled</span></h3>
                      <p className="text-sm text-white/60 max-w-sm">Protect your personal health data by adding an extra layer of security to your account.</p>
                    </div>
                    <button className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-glow-primary sm:w-auto w-full">Enable 2FA</button>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider mb-3">Security & Devices</h3>
                  <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                    {[
                      { title:'Change Password', desc:'Last changed 6 months ago', btn:'Update' },
                      { title:'Active Devices',  desc:'1 active session on Windows PC', btn:'Manage' },
                    ].map((item, idx) => (
                      <div key={item.title} className={`flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-white/5 transition-colors cursor-pointer group ${idx !== 0 ? 'border-t border-white/5' : ''}`}>
                        <div>
                          <h4 className="text-white text-[15px] font-bold mb-0.5">{item.title}</h4>
                          <p className="text-white/40 text-[13px]">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                          <span className="text-sm font-semibold hidden sm:inline">{item.btn}</span>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Session / Logout */}
                <div className="glass p-5 sm:p-6 rounded-2xl border border-red-500/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                      <LogOut size={16} className="text-red-400" />
                    </div>
                    <h2 className="font-semibold text-white">Account Session</h2>
                  </div>
                  <p className="text-white/50 text-sm mb-5 leading-relaxed">
                    Ready to leave? Clicking the button below will securely log you out of your current session on this device.
                  </p>
                  <button onClick={logout} className="flex items-center justify-center sm:justify-start w-full sm:w-auto gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all shadow-glow-sm">
                    <LogOut size={16}/> Log Out Securely
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 sm:space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider mb-4">Communication</h3>
                  <div className="glass rounded-[1.5rem] border border-white/5 overflow-hidden">
                    {[
                      { key:'emailNotifications', title:'Email Alerts', desc:'Booking confirmations and receipts', value:emailNotif, set:setEmailNotif },
                      { key:'phoneNotifications', title:'SMS Updates', desc:'Text messages for urgent updates', value:phoneNotif, set:setPhoneNotif },
                      { key:'pushNotifications',  title:'Push Notifications', desc:'Real-time browser notifications', value:pushNotif, set:setPushNotif },
                      { key:'appointmentReminder',title:'Appt Reminders', desc:'Alert me 24h before visits', value:appointmentReminder, set:setAppointmentReminder },
                    ].map((item, i) => (
                      <div key={item.key} className={`flex items-center justify-between p-4 sm:p-5 ${i !== 0 ? 'border-t border-white/5' : ''}`}>
                        <div className="pr-4">
                          <h4 className="text-white text-[15px] font-bold mb-0.5">{item.title}</h4>
                          <p className="text-white/40 text-[13px] leading-tight">{item.desc}</p>
                        </div>
                        <Toggle value={item.value} onChange={val => { item.set(val); handleUpdateNotification(item.key, val); }} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-white/50 uppercase tracking-wider mb-3">Integrations</h3>
                  <div className="glass border border-white/5 rounded-[1.5rem] p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${googleCalendar?.connected ? 'bg-green-500/20 text-green-400' : 'bg-white/5 border border-white/10 text-white/60'}`}>
                          <Calendar size={20} />
                        </div>
                        <div>
                          <h4 className="text-white text-[15px] font-bold mb-0.5">Google Calendar</h4>
                          <p className="text-white/40 text-[13px]">Auto-sync appointments</p>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        {googleCalendar?.connected ? (
                          <div className="flex items-center justify-between w-full sm:w-auto p-2.5 sm:p-1.5 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[13px] font-medium text-white/70 px-2 truncate max-w-[120px]">{googleCalendar.email || 'Connected'}</span>
                            <button onClick={handleDisconnectGoogleCalendar} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider">Disconnect</button>
                          </div>
                        ) : (
                          <button onClick={handleConnectGoogleCalendar} className="w-full sm:w-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">Connect Account</button>
                        )}
                      </div>
                    </div>
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

export default SettingsModal;

