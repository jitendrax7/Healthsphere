import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Video, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { appointmentApi } from '../../api/axios';
import AppointmentDetailDrawer from './AppointmentDetailDrawer';

const TABS = [
  { key: 'all',       label: 'All History' },
  { key: 'completed', label: 'Completed'   },
  { key: 'rejected',  label: 'Rejected'    },
  { key: 'cancelled', label: 'Cancelled'   },
];

const STATUS_STYLE = {
  completed: { pill: 'bg-blue-500/10 text-blue-400 border-blue-500/20',   dot: 'bg-blue-400'   },
  cancelled: { pill: 'bg-red-500/10 text-red-400 border-red-500/20',      dot: 'bg-red-400'    },
  rejected:  { pill: 'bg-rose-500/10 text-rose-400 border-rose-500/20',   dot: 'bg-rose-400'   },
};

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const StatusPill = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.cancelled;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {status}
    </span>
  );
};

const AppointmentHistory = () => {
  const [filter, setFilter]     = useState('all');
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback((status = filter) => {
    setLoading(true);
    appointmentApi.getDoctorHistory(status)
      .then(r => setItems(r.data.appointments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(filter); }, [filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl overflow-x-auto scrollbar-hide max-w-[70vw] sm:max-w-none">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all capitalize whitespace-nowrap ${
                filter === key ? 'bg-accent-orange/80 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {!loading && (
            <span className="text-xs text-white/30">{items.length} record{items.length !== 1 ? 's' : ''}</span>
          )}
          <button
            onClick={() => load(filter)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14 gap-2">
          <Loader2 size={20} className="animate-spin text-accent-orange" />
          <span className="text-white/30 text-sm">Loading history…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-14">
          <Calendar size={36} className="mx-auto mb-3 text-white/15" />
          <p className="text-white/30 text-sm">No {filter === 'all' ? '' : filter + ' '}history found.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map(a => (
            <div
              key={a.appointmentId}
              onClick={() => setSelected(a)}
              className="glass rounded-xl hover:border-white/20 transition-all cursor-pointer group opacity-90 hover:opacity-100"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:px-5 sm:py-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-bold text-white/60 flex-shrink-0">
                    {(a.name || 'P')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white/80 truncate text-sm sm:text-base">{a.name || 'Patient'}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 text-white/30 text-[10px] sm:text-xs">
                      <span className="flex items-center gap-1"><Calendar size={10} />{fmt(a.date)}</span>
                      <span className="flex items-center gap-1"><Clock size={10} />{a.startTime} – {a.endTime}</span>
                      {a.mode && (
                        <span className="flex items-center gap-1 capitalize">
                          {a.mode === 'online' ? <Video size={10} /> : <MapPin size={10} />}{a.mode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-white/5 sm:border-t-0 flex-shrink-0">
                  <StatusPill status={a.status} />
                  {a.cancelledByRole && a.status === 'cancelled' && (
                    <span className="text-[11px] text-white/25 border border-white/10 rounded-full px-2 py-0.5">
                      by {a.cancelledByRole}
                    </span>
                  )}
                  <ChevronRight size={15} className="text-white/15 group-hover:text-white/40 transition-colors hidden sm:block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <AppointmentDetailDrawer
          appt={selected}
          isHistory={true}
          onClose={() => setSelected(null)}
          onAction={() => {}}
          acting={null}
        />
      )}
    </div>
  );
};

export default AppointmentHistory;
