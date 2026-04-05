import { useState, useEffect } from 'react';
import { AlertTriangle, X, CheckCircle, Info } from 'lucide-react';

const ApiToast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      setToast({ type: e.detail.type || 'error', message: e.detail.message });
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToast((prev) => (prev?.message === e.detail.message ? null : prev));
      }, 5000);
    };

    window.addEventListener('api-toast', handleToast);
    return () => window.removeEventListener('api-toast', handleToast);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-fade-in sm:top-6 sm:right-6">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md max-w-sm w-full transition-all ${
        toast.type === 'error' 
          ? 'bg-red-500/20 border-red-500/40 text-red-50' 
          : toast.type === 'success'
          ? 'bg-green-500/20 border-green-500/40 text-green-50'
          : 'bg-primary-500/20 border-primary-500/40 text-primary-50'
      }`}>
        {toast.type === 'error' ? (
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={18} />
        ) : toast.type === 'success' ? (
          <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={18} />
        ) : (
          <Info className="text-primary-400 shrink-0 mt-0.5" size={18} />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed drop-shadow-sm">{toast.message}</p>
        </div>
        <button 
          onClick={() => setToast(null)}
          className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors opacity-70 hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default ApiToast;
