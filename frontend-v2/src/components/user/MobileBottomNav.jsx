import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, Settings, User, Sparkles, X, Send, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { chatbotApi } from '../../api/axios';

const LEFT_NAV = [
  { path: '/user/dashboard',   icon: Home,    label: 'Home'  },
  { path: '/user/appointment', icon: Calendar, label: 'Appts' },
];

const RIGHT_NAV = [
  { path: '/user/settings', icon: Settings, label: 'Settings' },
];

const MobileBottomNav = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  const [chatOpen, setChatOpen]   = useState(false);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [messages, setMessages]   = useState([
    { role: 'assistant', content: 'Welcome to HealthSphere 👋\n\nI can help you:\n• Book doctor appointments\n• Find healthcare camps\n• Register for blood donation\n• Get general health guidance\n\nHow can I assist you today?' }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(m => [...m, userMsg]);
    setInput(''); setLoading(true);
    try {
      const res = await chatbotApi.send(input);
      const fullText = res.data.reply || 'No response.';
      setMessages(m => [...m, { role: 'assistant', content: '' }]);
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setMessages(m => { const next = [...m]; next[next.length-1].content = fullText.slice(0, i); return next; });
        if (i >= fullText.length) { clearInterval(iv); setLoading(false); }
      }, 12);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' }]);
      setLoading(false);
    }
  };

  return (
    <>
      {chatOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col" onClick={() => setChatOpen(false)}>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" />
          <div
            className="w-full bg-dark-800 border-t border-white/10 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
            style={{ height: '70vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-gradient-to-r from-primary-600/20 to-accent-purple/20">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">HealthSphere AI</p>
                <p className="text-xs text-accent-cyan flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-pulse" /> Online
                </p>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto text-white/40 hover:text-white transition-colors p-1.5">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[82%] text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm shadow-glow-primary/30'
                      : 'bg-dark-700 text-white/90 border border-white/10 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-dark-700 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1.5 items-center">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay:`${i*150}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2 pb-safe">
              <input
                type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about appointments, health..."
                className="flex-1 bg-dark-700 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-500 transition-all placeholder-white/30"
              />
              <button
                onClick={sendMessage} disabled={!input.trim()}
                className="w-10 h-10 bg-primary-600 hover:bg-primary-500 disabled:opacity-30 rounded-xl flex items-center justify-center text-white transition-all shadow-glow-primary"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-800/95 backdrop-blur-xl border-t border-white/10 safe-area-pb">
        <div className="flex items-end px-2 h-16">

          <div className="flex flex-1 items-center justify-around">
            {LEFT_NAV.map(({ path, icon: Icon, label, isSettings }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 ${
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
          </div>

          <div className="flex items-center justify-center px-1 pb-1 -mt-5">
            <button
              onClick={() => setChatOpen(true)}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-accent-purple shadow-glow-primary flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-200 relative border-4 border-dark-800"
            >
              <Sparkles size={22} />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-accent-cyan rounded-full animate-pulse-slow border-2 border-dark-800" />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-around">
            {RIGHT_NAV.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200 ${
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
              onClick={() => navigate('/user/profile')}
              className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all text-white/40 hover:text-white/70"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="me" className="w-7 h-7 rounded-full object-cover ring-2 ring-primary-500/30" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-xs font-bold text-white">
                    {user?.Name?.[0] || 'U'}
                  </div>
                )}
              </span>
              <span className="text-[10px] font-medium leading-none">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
