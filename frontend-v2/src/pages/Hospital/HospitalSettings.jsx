import { Settings, Clock } from 'lucide-react';

const HospitalSettings = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 animate-fade-in">
      <div className="w-24 h-24 rounded-3xl bg-dark-800 border-2 border-dashed border-violet-500/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(139,92,246,0.15)]">
        <Settings size={40} className="text-violet-400 animate-[spin_4s_linear_infinite]" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center shadow-lg border-2 border-dark-900">
          <Clock size={16} className="text-white" />
        </div>
      </div>
      
      <div className="max-w-md space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Settings Dashboard
        </h1>
        <p className="text-white/50 text-sm sm:text-base leading-relaxed">
          We are currently working hard behind the scenes to build the hospital settings and preferences panel. 
          <span className="block mt-1 text-violet-400 font-medium">This feature will be implemented natively soon!</span>
        </p>
      </div>
      
      <div className="glass px-6 py-3 rounded-xl border border-white/10 flex items-center gap-3 mt-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">In Development Phase</span>
      </div>
    </div>
  );
};

export default HospitalSettings;
