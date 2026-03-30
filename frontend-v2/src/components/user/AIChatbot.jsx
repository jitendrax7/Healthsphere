import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { chatbotApi } from '../../api/axios';

const AIChatbot = () => {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Welcome to HealthSphere 👋\n\nI can help you:\n• Book doctor appointments\n• Find healthcare camps\n• Register for blood donation\n• Get general health guidance\n\nHow can I assist you today?' }
  ]);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

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
        setMessages(m => {
          const next = [...m]; next[next.length-1].content = fullText.slice(0, i); return next;
        });
        if (i >= fullText.length) { clearInterval(iv); setLoading(false); }
      }, 12);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' }]);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setOpen(!open)}
          className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-purple rounded-2xl shadow-glow-primary flex items-center justify-center text-white hover:scale-110 transition-all duration-300 relative">
          {open ? <X size={20} /> : <Sparkles size={20} />}
          {!open && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-cyan rounded-full animate-pulse-slow" />}
        </button>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 w-[400px] max-w-[calc(100vw-2rem)] bg-dark-800 border border-white/10 rounded-2xl shadow-card-dark z-50 flex flex-col overflow-hidden transition-all duration-400 ${
        open ? 'opacity-100 translate-y-0 scale-100 h-[560px]' : 'opacity-0 translate-y-8 scale-95 h-0 pointer-events-none'
      }`}>

        {/* Header */}
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
          <button onClick={() => setOpen(false)} className="ml-auto text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-line ${
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
                    <span key={i} className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i*150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about appointments, health..."
            className="flex-1 bg-dark-700 border border-white/10 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary-500 transition-all placeholder-white/30"
          />
          <button onClick={sendMessage} disabled={!input.trim()}
            className="w-10 h-10 bg-primary-600 hover:bg-primary-500 disabled:opacity-30 rounded-xl flex items-center justify-center text-white transition-all shadow-glow-primary">
            <Send size={15} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
