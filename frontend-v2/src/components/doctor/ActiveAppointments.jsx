import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Video, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { appointmentApi } from '../../api/axios';
import AppointmentDetailDrawer from './AppointmentDetailDrawer';

const TABS = [
  { key: 'all',       label: 'All Active' },
  { key: 'pending',   label: 'Pending'    },
  { key: 'confirmed', label: 'Confirmed'  },
];

const STATUS_STYLE = {
  confirmed: { pill: 'bg-green-500/10 text-green-400 border-green-500/20',  dot: 'bg-green-400'  },
  pending:   { pill: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', dot: 'bg-yellow-400' },
};

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const StatusPill = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {status}
    </span>
  );
};

const ActiveAppointments = ({ onAction, acting }) => {
  const [filter, setFilter]     = useState('all');
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);

  const load = useCallback((status = filter) => {
    setLoading(true);
    appointmentApi.getDoctorList(status)
      .then(r => setItems(r.data.appointments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => { load(filter); }, [filter]);

  const handleAction = async (id, action, remark) => {
    await onAction(id, action, remark);
    load(filter);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl overflow-x-auto scrollbar-hide max-w-[70vw] sm:max-w-none">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all capitalize whitespace-nowrap ${
                filter === key ? 'bg-primary-600 text-white shadow-glow-primary' : 'text-white/50 hover:text-white'
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
          <Loader2 size={20} className="animate-spin text-primary-500" />
          <span className="text-white/30 text-sm">Loading…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-14">
          <Calendar size={36} className="mx-auto mb-3 text-white/15" />
          <p className="text-white/30 text-sm">No {filter === 'all' ? 'active' : filter} appointments.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map(a => (
            <div
              key={a.appointmentId}
              onClick={() => setSelected(a)}
              className="glass rounded-xl hover:border-white/20 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:px-5 sm:py-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {(a.name || 'P')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate text-sm sm:text-base">{a.name || 'Patient'}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5 text-white/50 text-[10px] sm:text-xs">
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
                  <ChevronRight size={15} className="text-white/20 group-hover:text-white/50 transition-colors hidden sm:block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <AppointmentDetailDrawer
          appt={selected}
          isHistory={false}
          onClose={() => setSelected(null)}
          onAction={handleAction}
          acting={acting}
        />
      )}
    </div>
  );
};

export default ActiveAppointments;
