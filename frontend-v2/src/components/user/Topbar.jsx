import { useState } from 'react';
import { Search, Sun, Moon, Globe, Bell, Leaf } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';
import { userSettingsApi } from '../../api/axios';

const Topbar = () => {
  const { theme, setTheme, setLanguage, notificationCount } = useApp();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage || 'en';
  const [searchOpen, setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = async () => {
    // Cycle: dark → light → health → dark
    const cycle = { dark: 'light', light: 'health', health: 'dark' };
    const newTheme = cycle[theme] || 'dark';
    setTheme(newTheme);
    try { await userSettingsApi.updateAppearance({ theme: newTheme }); } catch (e) {}
  };

  const handleLanguageChange = async (code) => {
    setLanguage(code); // also calls i18n.changeLanguage via AppContext effect
    try { await userSettingsApi.updateGeneral({ language: code }); } catch (e) {}
  };

  return (
    <div className="topbar-root h-16 border-b border-white/10 flex items-center justify-between px-8 bg-dark-900/80 backdrop-blur-xl z-30 sticky top-0 transition-colors duration-300">
      
      {/* Spacer or Title Area */}
      <div className="flex-1 min-w-0"></div>

      {/* Controls */}
      <div className="flex items-center gap-3 md:gap-4 ml-4">
        
        {/* Expandable Search */}
        <div 
          className={`flex items-center transition-all duration-300 overflow-hidden ${searchOpen ? 'w-48 md:w-64 glass px-3 py-2' : 'w-10 h-10 justify-center hover:bg-white/10 rounded-full cursor-pointer'}`}
          onClick={() => !searchOpen && setSearchOpen(true)}
        >
          <Search size={18} className="text-white/60 flex-shrink-0" />
          {searchOpen && (
            <input 
              type="text" 
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setSearchOpen(false)}
              placeholder={t('Search')} 
              className="bg-transparent border-none outline-none text-white text-sm ml-2 w-full placeholder-white/30"
            />
          )}
        </div>

        <div className="h-5 w-px bg-white/10 hidden sm:block"></div>

        {/* Notifications */}
        <button 
          className="relative w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          title={t('Notifications')}
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 shadow-glow-primary text-[9px] font-bold text-white flex items-center justify-center border border-dark-900 leading-none">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* Language Dropdown */}
        <div className="relative group cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
          <Globe size={18} />
          {/* Dropdown Menu */}
          {/* <div className="absolute top-[80%] right-0 mt-3 w-36 glass opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden shadow-card-dark py-1">you */}
            <div className={`absolute top-[80%] right-0 mt-3 w-36 backdrop-blur-md border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden shadow-xl rounded-xl py-1 z-50 ${
              theme === 'light' ? 'bg-white border-gray-200 shadow-gray-300/50' : 'bg-gray-900/95 border-white/10'
            }`}>
            <div className={`px-3 py-2 border-b text-xs uppercase font-semibold ${
              theme === 'light' ? 'border-gray-200 text-gray-400' : 'border-white/10 text-white/40'
            }`}>{t('Language')}</div>
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'Hindi' },
              { code: 'es', label: 'Spanish' },
            ].map(lang => (
              <div 
                key={lang.code} 
              onClick={() => handleLanguageChange(lang.code)}
                className={`px-4 py-2.5 text-sm transition-colors flex items-center justify-between cursor-pointer ${
                  currentLanguage === lang.code
                    ? 'text-primary-500 font-bold bg-primary-500/10'
                    : theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {lang.label}
                {currentLanguage === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-glow-primary"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          title={`Theme: ${theme} → ${({dark:'light',light:'health',health:'dark'})[theme]}`}
        >
          {theme === 'dark'   && <Sun size={18} />}
          {theme === 'light'  && <Moon size={18} />}
          {theme === 'health' && <Leaf size={18} className="text-green-600" />}
        </button>

      </div>
    </div>
  );
};

export default Topbar;
