import { Calendar, Clock, Info, Video, Stethoscope } from 'lucide-react';

const STATUS_STYLE = {
  Pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  Completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Rejected:  'bg-red-500/10 text-red-400 border-red-500/20',
  rejected:  'bg-red-500/10 text-red-400 border-red-500/20',
  Cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const AppointmentCard = ({ appointment: a, onMoreInfo }) => (
  <div className="glass p-4 sm:p-5 rounded-2xl hover:border-white/20 transition-all flex flex-col justify-between">
    <div>
      <div className="flex items-start justify-between mb-3 gap-2">
        <span className={`px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wide font-bold border ${STATUS_STYLE[a.status] || STATUS_STYLE.pending} flex-shrink-0`}>
          {a.status}
        </span>
        <span className="flex items-center gap-1 text-xs text-white/50 capitalize bg-white/5 px-2 py-0.5 rounded-md border border-white/5 flex-shrink-0">
          {a.mode === 'online' ? <Video size={10} /> : <Stethoscope size={10} />} {a.mode}
        </span>
      </div>
      <h4 className="font-bold text-lg text-white mb-1 truncate">{a.doctorName}</h4>
      <div className="space-y-1 mb-4">
        <p className="text-white/60 text-sm flex items-center gap-1.5"><Calendar size={13} /> {new Date(a.date).toLocaleDateString()}</p>
        <p className="text-white/60 text-sm flex items-center gap-1.5"><Clock size={13} /> {a.time}</p>
      </div>
    </div>
    <button
      onClick={() => onMoreInfo(a.id)}
      className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2 mt-auto"
    >
      <Info size={14} className="text-primary-400" /> More Info
    </button>
  </div>
);

export default AppointmentCard;
