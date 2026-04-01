import { useState, useEffect } from 'react';
import { X, Droplets, MapPin, Phone, User, Lock, Send, XCircle, Loader2, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { bloodRequestApi } from '../../../api/axios';

const URGENCY_CHIP = {
  CRITICAL: 'bg-red-500/15 border-red-500/30 text-red-400',
  URGENT:   'bg-orange-500/15 border-orange-500/30 text-orange-400',
  NORMAL:   'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
};

const INVITE_STATUS_CHIP = {
  PENDING:   'bg-amber-500/15 border-amber-500/30 text-amber-400',
  ACCEPTED:  'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  DECLINED:  'bg-red-500/15 border-red-500/30 text-red-400',
  CANCELLED: 'bg-white/5 border-white/10 text-white/30',
  EXPIRED:   'bg-white/5 border-white/10 text-white/25',
};

const DonorRow = ({ donor, requestId, onAction }) => {
  const [sending, setSending]       = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [invite, setInvite]         = useState(donor.invite || null);

  const isAnonymous = !donor.name;
  const distanceKm  = donor.distance ? (donor.distance / 1000).toFixed(1) : null;

  const sendInvite = async () => {
    setSending(true);
    try {
      const res = await bloodRequestApi.invite({ requestId, donorId: donor.donorId });
      setInvite(res.data.data?.invite || { status: 'PENDING' });
      onAction();
    } catch {}
    finally { setSending(false); }
  };

  const cancelInvite = async () => {
    setCancelling(true);
    try {
      await bloodRequestApi.cancelInvite(invite._id);
      setInvite(prev => ({ ...prev, status: 'CANCELLED' }));
      onAction();
    } catch {}
    finally { setCancelling(false); }
  };

  const canInvite = !invite || ['DECLINED', 'CANCELLED', 'EXPIRED'].includes(invite.status);

  return (
    <div className="flex items-start gap-2.5 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-600/20 border border-rose-500/30 flex items-center justify-center font-bold text-rose-300 text-xs flex-shrink-0">
        {donor.bloodGroup}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isAnonymous ? (
            <span className="flex items-center gap-1 text-white/35 text-xs">
              <Lock size={9} /> Anonymous
            </span>
          ) : (
            <p className="text-sm font-medium text-white truncate">{donor.name}</p>
          )}
          {invite?.status && (
            <span className={`text-[10px] font-semibold border px-1.5 py-0.5 rounded-full flex-shrink-0 ${INVITE_STATUS_CHIP[invite.status] || INVITE_STATUS_CHIP.PENDING}`}>
              {invite.status}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/30 mt-0.5 flex-wrap">
          {!isAnonymous && donor.phone && <span className="flex items-center gap-0.5"><Phone size={8} />{donor.phone}</span>}
          {distanceKm && <span className="flex items-center gap-0.5"><MapPin size={8} />{distanceKm}km</span>}
          {donor.totalDonations > 0 && <span>{donor.totalDonations} donations</span>}
          {donor.emergencyAvailable && <span className="text-rose-400/70">⚡ Emergency</span>}
        </div>
      </div>
      <div className="flex items-center flex-shrink-0">
        {canInvite ? (
          <button onClick={sendInvite} disabled={sending}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25 transition-all whitespace-nowrap">
            {sending ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
            <span className="hidden sm:inline">Invite</span>
          </button>
        ) : invite?.status === 'PENDING' ? (
          <button onClick={cancelInvite} disabled={cancelling}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/30 transition-all">
            {cancelling ? <Loader2 size={10} className="animate-spin" /> : <XCircle size={10} />}
          </button>
        ) : invite?.status === 'ACCEPTED' ? (
          <CheckCircle2 size={14} className="text-emerald-400" />
        ) : null}
      </div>
    </div>
  );
};

const BloodRequestDetail = ({ request, onClose }) => {
  const [donors, setDonors]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const res  = await bloodRequestApi.getDonors(request._id);
      const d    = res.data.data || {};
      setDonors(d.donors || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDonors(); }, [request._id]);

  const urgencyClass = URGENCY_CHIP[request.urgencyLevel] || URGENCY_CHIP.NORMAL;
  const hasInfo = request.patientName || request.disease || request.location?.city || request.contactNumber || request.notes;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-stretch" onClick={onClose}>
      <div className="hidden sm:block flex-1 bg-black/50 backdrop-blur-sm" />

      <div
        className="w-full sm:max-w-md bg-dark-800 sm:border-l border-t sm:border-t-0 border-white/10 flex flex-col sm:h-full max-h-[92dvh] sm:max-h-full overflow-hidden shadow-2xl rounded-t-2xl sm:rounded-none"
        onClick={e => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1 bg-white/15 rounded-full mx-auto mt-3 mb-1 flex-shrink-0" />

        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/30 flex items-center justify-center font-black text-red-300 text-sm flex-shrink-0">
              {request.bloodGroup}
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                {request.unitsRequired} unit{request.unitsRequired !== 1 ? 's' : ''} · {request.bloodGroup}
              </p>
              <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${urgencyClass}`}>
                {request.urgencyLevel}
              </span>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-white transition-colors flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {hasInfo && (
          <div className="flex-shrink-0 border-b border-white/5">
            <button
              onClick={() => setInfoOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 sm:px-5 py-2.5 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              <span className="font-semibold">Request Info</span>
              {infoOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {infoOpen && (
              <div className="px-4 sm:px-5 pb-3 space-y-1.5">
                {request.patientName  && <p className="text-xs text-white/50">Patient: <span className="text-white/80 font-medium">{request.patientName}</span></p>}
                {request.disease      && <p className="text-xs text-white/50">Condition: <span className="text-white/80 font-medium">{request.disease}</span></p>}
                {request.location?.city && (
                  <p className="text-xs text-white/35 flex items-center gap-1">
                    <MapPin size={9} /> {request.location.addressLine || ''} {request.location.city}
                  </p>
                )}
                {request.contactNumber && (
                  <a href={`tel:${request.contactNumber}`} className="flex items-center gap-1 text-xs text-rose-400/80 hover:text-rose-400 transition-colors">
                    <Phone size={9} /> {request.contactPerson} — {request.contactNumber}
                  </a>
                )}
                {request.notes && <p className="text-xs text-white/30 italic">{request.notes}</p>}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User size={13} className="text-rose-400" /> Matched Donors
            </h3>
            {!loading && <span className="text-xs text-white/35">{donors.length} found</span>}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : donors.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={16} className="text-white/20" />
              </div>
              <p className="text-white/40 text-sm">No matched donors found.</p>
              <p className="text-white/25 text-xs mt-1">Donors with the required blood group will appear here.</p>
            </div>
          ) : (
            <div>
              {donors.map((donor, i) => (
                <DonorRow
                  key={donor.donorId || i}
                  donor={donor}
                  requestId={request._id}
                  onAction={fetchDonors}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-white/5 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-white/25">
            <Lock size={10} />
            <span>Anonymous donors' details revealed only after accepting.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodRequestDetail;
