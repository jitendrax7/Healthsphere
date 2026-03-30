import { useEffect, useState } from 'react';
import { Settings, Shield, Bell, Palette, User, X, Smartphone, Check, Globe, Calendar, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { userSettingsApi , googleApi  } from '../../api/axios';

const TABS = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account', icon: User },
];

const SettingsModal = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useApp();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');
  const initialTab = (queryTab && TABS.find(t => t.id === queryTab)) ? queryTab : 'general';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  // General States
  const [language, setLanguage] = useState(i18n.language);
  const [timezone, setTimezone] = useState('Auto-detect (Asia/Kolkata)');

  // Notification States
  const [emailNotif, setEmailNotif] = useState(true);
  const [phoneNotif, setPhoneNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [appointmentReminder, setAppointmentReminder] = useState(true);
  
  // Google Calendar State
  const [googleCalendar, setGoogleCalendar] = useState({ connected: false });
   
  // (theme cycling is handled by Topbar; here we set explicitly)

  useEffect(() => {
    userSettingsApi.getSettings().then(res => {
      const s = res.data?.settings || res.data || {};
      if (s.general) {
        if (s.general.language) setLanguage(s.general.language);
        if (s.general.timezone) setTimezone(s.general.timezone);
      }
      if (s.appearance && s.appearance.theme) {
        if (s.appearance.theme !== theme && s.appearance.theme !== 'system') setTheme(s.appearance.theme);
      }
      if (s.notifications) {
        if (s.notifications.emailNotifications !== undefined) setEmailNotif(s.notifications.emailNotifications);
        if (s.notifications.phoneNotifications !== undefined) setPhoneNotif(s.notifications.phoneNotifications);
        if (s.notifications.pushNotifications !== undefined) setPushNotif(s.notifications.pushNotifications);
        if (s.notifications.appointmentReminder !== undefined) setAppointmentReminder(s.notifications.appointmentReminder);
      }
      if (s.googleCalendar) {
        setGoogleCalendar(s.googleCalendar);
      }
    }).catch(err => console.error("Failed to load settings:", err))
      .finally(() => setLoading(false));
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

  const handleConnectGoogleCalendar = async ()=>{
    try{
      const res = await googleApi.connect();
      if(res.data?.url){
          window.location.href = res.data.url;
      }
    }catch(error){
      console.log("Google connect error",error);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    try {
      await googleApi.disconnect();
      setGoogleCalendar({ connected: false });
    } catch (error) {
      console.error("Google disconnect error", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 lg:p-8 animate-fade-in">
      <div className="w-full max-w-5xl h-[75vh] glass-dark rounded-2xl shadow-2xl border border-white/10 flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-slide-up relative">
        
        {/* Mobile Header / Close Button */}
        <button onClick={() => navigate('/user/dashboard')} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10">
          <X size={20} />
        </button>

        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-64 bg-dark-900/60 border-r border-white/10 p-4 space-y-1 overflow-y-auto">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4 px-3 pt-2">Settings</h2>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-500/10 text-primary-400' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              {t(tab.label)}
            </button>
          ))}
        </div>

        {/* Right Content Pane */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4 capitalize">{t(activeTab)}</h1>

            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Language Setting */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Language</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { code: 'en', name: 'English' },
                      { code: 'es', name: 'Español' },
                      { code: 'hi', name: 'हिंदी' }
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleUpdateGeneral('language', lang.code)}
                        className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-between transition-colors ${
                          language === lang.code ? 'border-primary-500 bg-primary-500/10 text-primary-400' : 'border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        <span className="flex items-center gap-2"><Globe size={14} /> {lang.name}</span>
                        {language === lang.code && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="border-white/5" />

                <div>
                   <h3 className="text-sm font-semibold text-white mb-2">Time Zone</h3>
                   <select 
                     value={timezone}
                     onChange={(e) => handleUpdateGeneral('timezone', e.target.value)}
                     className="w-full bg-dark-800/50 border border-white/10 rounded-xl p-3 text-sm text-white/80 focus:outline-none focus:border-primary-500/50 transition-colors cursor-pointer"
                   >
                     <option value="Auto-detect (Asia/Kolkata)">Auto-detect (Asia/Kolkata)</option>
                     <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                     <option value="PST (Pacific Standard Time)">PST (Pacific Standard Time)</option>
                   </select>
                </div>

              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Interface Theme</h3>
                  <p className="text-white/40 text-xs mb-4">Choose how HealthSphere looks to you. You can also cycle themes using the 🌿 button in the top-bar.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                    {/* Dark */}
                    <button onClick={() => handleUpdateAppearance('dark')}
                      className={`p-4 rounded-xl border text-sm font-medium flex flex-col items-center gap-3 transition-all ${
                        theme === 'dark' ? 'border-primary-500 bg-primary-500/10 text-primary-400 scale-[1.03]' : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}>
                      <div className="w-full h-10 rounded-lg bg-[#0a0a14] border border-white/20 flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        <div className="w-5 h-1.5 rounded bg-white/20" />
                      </div>
                      <span>Dark</span>
                      {theme === 'dark' && <Check size={13} className="text-primary-400" />}
                    </button>

                    {/* Light */}
                    <button onClick={() => handleUpdateAppearance('light')}
                      className={`p-4 rounded-xl border text-sm font-medium flex flex-col items-center gap-3 transition-all ${
                        theme === 'light' ? 'border-primary-500 bg-primary-500/10 text-primary-400 scale-[1.03]' : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}>
                      <div className="w-full h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <div className="w-5 h-1.5 rounded bg-gray-200" />
                      </div>
                      <span>Light</span>
                      {theme === 'light' && <Check size={13} className="text-primary-400" />}
                    </button>

                    {/* Health 🌿 */}
                    <button onClick={() => handleUpdateAppearance('health')}
                      className={`p-4 rounded-xl border text-sm font-medium flex flex-col items-center gap-3 transition-all ${
                        theme === 'health' ? 'border-green-500 bg-green-500/10 text-green-400 scale-[1.03]' : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}>
                      <div className="w-full h-10 rounded-lg bg-[#f1faf3] border border-green-200 flex items-center justify-center gap-1.5">
                        <Leaf size={13} className="text-green-500" />
                        <div className="w-5 h-1.5 rounded bg-green-200" />
                      </div>
                      <span>Health 🌿</span>
                      {theme === 'health' && <Check size={13} className="text-green-400" />}
                    </button>

                    {/* System */}
                    <button onClick={() => handleUpdateAppearance('system')}
                      className={`p-4 rounded-xl border text-sm font-medium flex flex-col items-center gap-3 transition-all ${
                        theme === 'system' ? 'border-primary-500 bg-primary-500/10 text-primary-400 scale-[1.03]' : 'border-white/10 text-white/60 hover:border-white/30'
                      }`}>
                      <div className="w-full h-10 rounded-lg border border-white/20 bg-gradient-to-r from-[#0a0a14] to-white flex items-center justify-center" />
                      <span>System</span>
                      {theme === 'system' && <Check size={13} className="text-primary-400" />}
                    </button>

                  </div>
                </div>

                {/* Active theme preview pill */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
                    theme === 'health' ? 'bg-green-100' : 'bg-primary-500/10'
                  }`}>
                    {theme === 'dark' ? '🌑' : theme === 'light' ? '☀️' : theme === 'health' ? '🌿' : '⚙️'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold capitalize">{theme === 'health' ? 'Health (Anime Hospital)' : theme} theme active</p>
                    <p className="text-white/40 text-xs mt-0.5">
                      {theme === 'health' ? 'Light green anime hospital style with Nunito font' :
                       theme === 'dark'   ? 'Dark navy interface with glowing accents' :
                       theme === 'light'  ? 'Clean white interface for bright environments' :
                                           'Follows your OS preference'}
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-5 flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-bold flex items-center gap-2 mb-1"><Shield size={16} className="text-primary-400"/> Secure your account</h3>
                    <p className="text-sm text-white/60">Add multi-factor authentication (MFA) to help protect your account when logging in.</p>
                  </div>
                  <button className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap ml-4">Set up MFA</button>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white text-sm font-medium mb-0.5">Change Password</h4>
                      <p className="text-white/40 text-[13px]">Last changed 6 months ago</p>
                    </div>
                    <button className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-white/80 text-sm font-medium transition-colors">Update</button>
                  </div>
                  <hr className="border-white/5" />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white text-sm font-medium mb-0.5">Active Devices</h4>
                      <p className="text-white/40 text-[13px]">Manage the devices logged into your account</p>
                    </div>
                    <button className="px-4 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-white/80 text-sm font-medium transition-colors">Manage <span className="bg-dark-600 px-1.5 rounded-md ml-1 text-xs">2</span></button>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Communication */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-4">Communication Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-dark-800/50 p-4 rounded-xl border border-white/5">
                      <div>
                        <h4 className="text-white text-sm font-medium mb-0.5">Email Notifications</h4>
                        <p className="text-white/40 text-[13px]">Receive appointment confirmations and updates via email</p>
                      </div>
                      <button onClick={() => handleUpdateNotification('emailNotifications', !emailNotif)} className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 ${emailNotif ? 'bg-primary-500' : 'bg-dark-600 border border-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${emailNotif ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-dark-800/50 p-4 rounded-xl border border-white/5">
                      <div>
                        <h4 className="text-white text-sm font-medium mb-0.5">Phone Notifications</h4>
                        <p className="text-white/40 text-[13px]">Receive SMS alerts for upcoming appointments</p>
                      </div>
                      <button onClick={() => handleUpdateNotification('phoneNotifications', !phoneNotif)} className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 ${phoneNotif ? 'bg-primary-500' : 'bg-dark-600 border border-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${phoneNotif ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-dark-800/50 p-4 rounded-xl border border-white/5">
                      <div>
                        <h4 className="text-white text-sm font-medium mb-0.5">Push Notifications</h4>
                        <p className="text-white/40 text-[13px]">Receive browser push notifications</p>
                      </div>
                      <button onClick={() => handleUpdateNotification('pushNotifications', !pushNotif)} className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 ${pushNotif ? 'bg-primary-500' : 'bg-dark-600 border border-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${pushNotif ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-dark-800/50 p-4 rounded-xl border border-white/5">
                      <div>
                        <h4 className="text-white text-sm font-medium mb-0.5">Appointment Reminders</h4>
                        <p className="text-white/40 text-[13px]">Get notified 24 hours before your appointments</p>
                      </div>
                      <button onClick={() => handleUpdateNotification('appointmentReminder', !appointmentReminder)} className={`w-11 h-6 rounded-full flex items-center transition-colors px-1 ${appointmentReminder ? 'bg-primary-500' : 'bg-dark-600 border border-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${appointmentReminder ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-white/5" />

                {/* Integrations */}
                <div id='integrations'>
                  <h3 className="text-sm font-semibold text-white mb-4">Integrations & Reminders</h3>
                  <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-dark-900 flex items-center justify-center border border-white/10 shrink-0">
                        <Calendar size={18} className={googleCalendar?.connected ? "text-green-400" : "text-primary-400"} />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-bold mb-0.5">Google Calendar</h4>
                        <p className="text-white/50 text-[13px]">Sync appointments and set automatic reminders</p>
                      </div>
                    </div>
                    {googleCalendar?.connected ? (
                      <div className="flex items-center justify-end gap-3">
                         <div className="text-right hidden sm:block">
                           <span className="text-sm font-medium text-white block">{googleCalendar.email || 'Connected'}</span>
                           {googleCalendar.expiry && (
                             <span className="text-xs text-white/40">Expires: {new Date(googleCalendar.expiry).toLocaleDateString()} {new Date(googleCalendar.expiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           )}
                         </div>
                         <button onClick={handleDisconnectGoogleCalendar} className="px-4 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                           Disconnect
                         </button>
                      </div>
                    ) : (
                      <button onClick={handleConnectGoogleCalendar} className="px-4 py-2 border border-primary-500/50 hover:bg-primary-500/20 text-primary-400 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
                        Connect
                      </button>
                    )}
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
