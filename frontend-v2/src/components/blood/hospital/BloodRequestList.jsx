import { useState, useEffect, useCallback } from 'react';
import {
  Droplets, Clock, XCircle, Loader2, ChevronRight,
  AlertTriangle, CheckCircle2, Circle, Users, Activity, History, ChevronLeft,
} from 'lucide-react';
import { bloodRequestApi } from '../../../api/axios';

const ACTIVE_STATUSES   = ['OPEN', 'MATCHING', 'PARTIAL'];
const HISTORY_STATUSES  = ['COMPLETED', 'CANCELLED', 'EXPIRED'];

const URGENCY_CHIP = {
  CRITICAL: 'bg-red-500/15 border-red-500/30 text-red-400',
  URGENT:   'bg-orange-500/15 border-orange-500/30 text-orange-400',
  NORMAL:   'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
};

const STATUS_CHIP = {
  OPEN:      'bg-sky-500/15 border-sky-500/30 text-sky-400',
  MATCHING:  'bg-violet-500/15 border-violet-500/30 text-violet-400',
  PARTIAL:   'bg-amber-500/15 border-amber-500/30 text-amber-400',
  COMPLETED: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  CANCELLED: 'bg-white/5 border-white/10 text-white/30',
  EXPIRED:   'bg-white/5 border-white/10 text-white/25',
};

const STATUS_ICON = {
  OPEN:      <Circle size={10} className="text-sky-400 fill-sky-400" />,
  MATCHING:  <Circle size={10} className="text-violet-400 fill-violet-400 animate-pulse" />,
  PARTIAL:   <Circle size={10} className="text-amber-400 fill-amber-400" />,
  COMPLETED: <CheckCircle2 size={10} className="text-emerald-400" />,
  CANCELLED: <XCircle size={10} className="text-white/25" />,
  EXPIRED:   <XCircle size={10} className="text-white/20" />,
};

const SUB_FILTER_LABELS = {
  active:  ['OPEN', 'MATCHING', 'PARTIAL'],
  history: ['COMPLETED', 'CANCELLED', 'EXPIRED'],
};

const StatusMenu = ({ req, onUpdate, onClose }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);

  const update = async (status, e) => {
    e.stopPropagation();
    setLoading(status);
    setOpen(false);
    try {
      if (status === 'CANCELLED') {
        await bloodRequestApi.close(req._id);
      } else {
        await bloodRequestApi.updateStatus({ requestId: req._id, status });
      }
      onUpdate();
    } catch {}
    finally { setLoading(null); }
  };

  const actions = [
    { status: 'COMPLETED', label: 'Mark Complete', icon: CheckCircle2, cls: 'text-emerald-400 hover:bg-emerald-500/10' },
    { status: 'CANCELLED', label: 'Cancel Request', icon: XCircle,     cls: 'text-red-400 hover:bg-red-500/10' },
  ];

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        disabled={!!loading}
        className="flex items-center gap-1 text-xs text-white/40 hover:text-white border border-transparent hover:border-white/15 px-2.5 py-1.5 rounded-lg transition-all"
      >
        {loading ? <Loader2 size={11} className="animate-spin" /> : '···'}
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1.5 bg-dark-800 border border-white/10 rounded-xl shadow-2xl z-20 w-44 overflow-hidden">
          {actions.map(({ status, label, icon: Icon, cls }) => (
            <button
              key={status}
              onClick={e => update(status, e)}
              className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-semibold transition-all ${cls}`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const RequestCard = ({ req, onClick, onUpdate, isHistory }) => (
  <div
    onClick={() => onClick(req)}
    className="glass rounded-xl p-4 hover:border-white/20 transition-all cursor-pointer group"
  >
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
      <div className="flex items-center gap-3 w-full">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/30 flex items-center justify-center font-black text-red-300 text-sm flex-shrink-0">
          {req.bloodGroup}
        </div>
        <div>
          <p className="font-semibold text-white text-sm">
            {req.unitsRequired} unit{req.unitsRequired !== 1 ? 's' : ''} needed
          </p>
          {req.patientName && <p className="text-xs text-white/40 mt-0.5">{req.patientName}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap sm:flex-nowrap w-full sm:w-auto">
        <span className={`flex items-center gap-1 text-xs font-semibold border px-2 py-0.5 rounded-full ${URGENCY_CHIP[req.urgencyLevel] || URGENCY_CHIP.NORMAL}`}>
          {req.urgencyLevel === 'CRITICAL' && <AlertTriangle size={9} />}
          {req.urgencyLevel}
        </span>
        <span className={`flex items-center gap-1 text-xs font-semibold border px-2 py-0.5 rounded-full ${STATUS_CHIP[req.status] || STATUS_CHIP.OPEN}`}>
          {STATUS_ICON[req.status]}
          {req.status}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-3 flex-wrap text-xs text-white/35 mb-3">
      <span className="flex items-center gap-1">
        <Clock size={10} />
        {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
      {req.matchedDonorsCount > 0 && (
        <span className="flex items-center gap-1">
          <Users size={10} className="text-violet-400" />
          {req.matchedDonorsCount} matched · {req.acceptedDonorsCount} accepted
        </span>
      )}
      {req.expiresAt && !isHistory && (
        <span>Expires {new Date(req.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
      )}
    </div>

    <div className="flex items-center justify-between">
      <div onClick={e => e.stopPropagation()}>
        {!isHistory && (
          <StatusMenu req={req} onUpdate={onUpdate} />
        )}
      </div>
      <span className="flex items-center gap-1 text-xs text-white/25 group-hover:text-white/60 transition-colors">
        View donors <ChevronRight size={13} />
      </span>
    </div>
  </div>
);

const BloodRequestList = ({ onSelectRequest }) => {
  const [section, setSection]     = useState('active');
  const [subFilter, setSubFilter] = useState('');
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isHistory = section === 'history';

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const status = subFilter || '';
      const res = await bloodRequestApi.list(status);
      const d = res.data.data || {};
      const all = d.requests || [];
      const allowed = isHistory ? HISTORY_STATUSES : ACTIVE_STATUSES;
      setRequests(subFilter ? all : all.filter(r => allowed.includes(r.status)));
      setTotalPages(d.totalPages || 1);
    } catch {}
    finally { setLoading(false); }
  }, [subFilter, isHistory]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const switchSection = s => {
    setSection(s);
    setSubFilter('');
    setPage(1);
  };

  const subOptions = SUB_FILTER_LABELS[section];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex gap-1 p-1 glass rounded-xl w-full sm:w-fit">
          <button
            onClick={() => switchSection('active')}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              section === 'active'
                ? 'bg-red-500/20 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Activity size={13} />
            Active
            {section === 'active' && requests.length > 0 && (
              <span className="bg-red-500/30 text-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {requests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => switchSection('history')}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              section === 'history'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <History size={13} />
            History
          </button>
        </div>

        <div className="flex items-center gap-1 p-1 glass rounded-xl overflow-x-auto scrollbar-hide">
          <button
            onClick={() => { setSubFilter(''); setPage(1); }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
              subFilter === '' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            All
          </button>
          {subOptions.map(s => (
            <button
              key={s}
              onClick={() => { setSubFilter(s); setPage(1); }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                subFilter === s
                  ? `${STATUS_CHIP[s]} shadow-sm`
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 text-sm">Loading requests...</p>
          </div>
        </div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            {isHistory ? <History size={22} className="text-white/20" /> : <Droplets size={22} className="text-white/20" />}
          </div>
          <p className="text-white/40 text-sm">
            No {subFilter ? subFilter.toLowerCase() : isHistory ? 'past' : 'active'} requests found.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {requests.map(req => (
              <RequestCard
                key={req._id}
                req={req}
                onClick={onSelectRequest}
                onUpdate={fetchRequests}
                isHistory={isHistory}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-white/50">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BloodRequestList;
