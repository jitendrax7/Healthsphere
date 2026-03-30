import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { doctorApi } from '../../api/axios';
import { useApp } from '../../context/AppContext';

const DoctorChat = () => {
  const { user }         = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Doctor-patient chat. Select a patient to start messaging.' }
  ]);
  const [loading, setLoad] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const msg = { role: 'doctor', content: input };
    setMessages(m => [...m, msg]); setInput(''); setLoad(true);
    try {
      await doctorApi.sendMessage({ message: input });
    } catch { }
    finally { setLoad(false); }
  };

  return (
    <div className="space-y-4 animate-fade-in h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Chat</h1>
        <p className="text-white/40">Communicate with your patients</p>
      </div>

      <div className="glass rounded-2xl flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan to-primary-500 flex items-center justify-center">
            <MessageCircle size={16} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">Patient Chat</p>
            <p className="text-white/40 text-xs">HealthSphere messaging</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'doctor' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl max-w-[70%] text-sm ${
                msg.role === 'doctor'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-dark-700 text-white/80 border border-white/10 rounded-bl-sm'
              }`}>{msg.content}</div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 bg-dark-700 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-500 transition-all placeholder-white/30"
          />
          <button onClick={send} disabled={!input.trim()}
            className="w-10 h-10 bg-primary-600 hover:bg-primary-500 disabled:opacity-30 rounded-xl flex items-center justify-center transition-all shadow-glow-primary">
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorChat;
