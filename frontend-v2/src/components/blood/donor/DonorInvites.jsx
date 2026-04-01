import { useState, useEffect, useCallback } from 'react';
import { Building2, Droplets, MapPin, Phone, Clock, CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { donorApi } from '../../../api/axios';

const URGENCY_CONFIG = {
  CRITICAL: { label: 'Critical', cls: 'bg-red-500/15 border-red-500/30 text-red-400' },
  URGENT:   { label: 'Urgent',   cls: 'bg-orange-500/15 border-orange-500/30 text-orange-400' },
  NORMAL:   { label: 'Normal',   cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
};

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   cls: 'bg-amber-500/15 border-amber-500/30 text-amber-400' },
  ACCEPTED:  { label: 'Accepted',  cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  DECLINED:  { label: 'Declined',  cls: 'bg-red-500/15 border-red-500/30 text-red-400' },
  EXPIRED:   { label: 'Expired',   cls: 'bg-white/5 border-white/10 text-white/30' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-white/5 border-white/10 text-white/30' },
};

const InviteCard = ({ invite, onRespond }) => {
  const [loading, setLoading] = useState(null);
  const urgency  = URGENCY_CONFIG[invite.request?.urgencyLevel] || URGENCY_CONFIG.NORMAL;
  const status   = STATUS_CONFIG[invite.status] || STATUS_CONFIG.PENDING;
  const hospital = invite.hospital || {};
  const isPending = invite.status === 'PENDING';

  const respond = async action => {
    setLoading(action);
    try {
      await donorApi.respondInvite(invite._id, action);
      onRespond();
    } catch {}
    finally { setLoading(null); }
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
            <Building2 size={14} className="text-rose-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate">{hospital.hospitalName || 'Hospital'}</p>
            <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={9} className="flex-shrink-0" />{hospital.city}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`text-[10px] sm:text-xs font-semibold border px-2 py-0.5 rounded-full ${urgency.cls}`}>{urgency.label}</span>
          <span className={`text-[10px] sm:text-xs font-semibold border px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-3 text-xs text-white/40 mb-3">
        <span className="flex items-center gap-1.5">
          <Droplets size={10} className="text-rose-400" />
          {invite.request?.bloodGroup} · {invite.request?.unitsRequired} unit{invite.request?.unitsRequired !== 1 ? 's' : ''}
        </span>
        {invite.request?.city && <span className="flex items-center gap-1"><MapPin size={9} />{invite.request.city}</span>}
        <span className="flex items-center gap-1 ml-auto">
          <Clock size={9} />
          {new Date(invite.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {invite.expiresAt && isPending && (
        <p className="text-[11px] text-amber-400/70 mb-2">
          Expires {new Date(invite.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </p>
      )}

      {hospital.contactNumber && (
        <a href={`tel:${hospital.contactNumber}`} className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 mb-3 transition-colors">
          <Phone size={10} />{hospital.contactNumber}
        </a>
      )}

      {isPending && (
        <div className="flex gap-2 mt-2">
          <button onClick={() => respond('ACCEPTED')} disabled={!!loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all">
            {loading === 'ACCEPTED' ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
            Accept
          </button>
          <button onClick={() => respond('DECLINED')} disabled={!!loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 transition-all">
            {loading === 'DECLINED' ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

const DonorInvites = () => {
  const [invites, setInvites]       = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);

  const fetchInvites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await donorApi.getInvites(page);
      const d = res.data.data || {};
      setInvites(d.invites || []);
      setTotalPages(d.totalPages || 1);
    } catch {}
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchInvites(); }, [fetchInvites]);

  const pendingCount = invites.filter(i => i.status === 'PENDING').length;

  if (loading) return (
    <div className="flex items-center justify-center py-14">
      <div className="w-7 h-7 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white text-sm sm:text-base">Hospital Invites</h2>
        {pendingCount > 0 && (
          <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {pendingCount} pending
          </span>
        )}
      </div>

      {invites.length === 0 ? (
        <div className="glass rounded-2xl p-10 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={20} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm">No invites yet.</p>
          <p className="text-white/25 text-xs mt-1">Hospitals will invite you when they need your blood type.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invites.map(invite => <InviteCard key={invite._id} invite={invite} onRespond={fetchInvites} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-all">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-white/50">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorInvites;
