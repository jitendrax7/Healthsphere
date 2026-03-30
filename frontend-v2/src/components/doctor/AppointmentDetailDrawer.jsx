import { useEffect, useState } from 'react';
import {
  X, Calendar, Clock, MapPin, Video, FileText, AlertCircle,
  CheckCircle, XCircle, Loader2, User, Mail, Phone, Building2,
  Navigation, MessageSquare
} from 'lucide-react';
import { appointmentApi } from '../../api/axios';

const STATUS_STYLE = {
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  rejected:  'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={14} className="text-primary-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-white/30 uppercase tracking-wider">{label}</p>
      <div className="text-sm text-white/80 font-medium mt-0.5 break-words">{value}</div>
    </div>
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-[11px] text-white/30 uppercase tracking-wider font-semibold mb-3">{children}</p>
);

const AppointmentDetailDrawer = ({ appt, isHistory, onClose, onAction, acting }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({ open: false, remark: '' });

  useEffect(() => {
    if (!appt) return;
    setLoading(true);
    const req = isHistory
      ? appointmentApi.getDoctorHistoryDetail(appt.appointmentId)
      : appointmentApi.getAppointmentDetail(appt.appointmentId);

    req
      .then(r => setData(r.data))
      .catch(() => {
        // Fallback: synthesize shape from list-item fields
        setData({
          user: { name: appt.name, email: '', phone: '', profilePhoto: '', city: '' },
          appointmentDetails: {
            date: appt.date, startTime: appt.startTime, endTime: appt.endTime,
            mode: appt.mode, reason: '', status: appt.status,
          },
          locations: {},
          cancellation: appt.cancelledByRole ? { cancelledByRole: appt.cancelledByRole } : null,
        });
      })
      .finally(() => setLoading(false));
  }, [appt?.appointmentId]);

  if (!appt) return null;

  const u  = data?.user || {};
  const ad = data?.appointmentDetails || {};
  const loc = data?.locations || {};
  const can = data?.cancellation;

  const status = ad.status || appt.status;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-xl glass-dark rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] animate-fade-in">

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
            <div>
              <h2 className="text-white font-bold text-lg">Appointment Details</h2>
              <p className="text-white/30 text-xs mt-0.5 font-mono">
                #{appt.appointmentId?.slice(-10)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin text-primary-500" />
            </div>
          ) : (
            <div className="overflow-y-auto p-5 space-y-5 custom-scrollbar">

              {/* ── Patient ── */}
              <div className="glass rounded-xl p-4">
                <SectionLabel>Patient</SectionLabel>
                <div className="flex items-center gap-4 mb-4">
                  {u.profilePhoto ? (
                    <img
                      src={u.profilePhoto}
                      alt={u.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                      {(u.name || 'P')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">{u.name || '—'}</p>
                    {u.city && <p className="text-white/40 text-sm flex items-center gap-1 mt-0.5"><Navigation size={11} />{u.city}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {u.email && <InfoRow icon={Mail}  label="Email" value={u.email} />}
                  {u.phone && <InfoRow icon={Phone} label="Phone" value={u.phone} />}
                </div>
              </div>

              {/* ── Appointment Details ── */}
              <div className="glass rounded-xl p-4">
                <SectionLabel>Appointment Info</SectionLabel>
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow icon={Calendar} label="Date"   value={fmt(ad.date)} />
                  <InfoRow icon={Clock}    label="Time"   value={`${ad.startTime} – ${ad.endTime}`} />
                  <InfoRow
                    icon={ad.mode === 'online' ? Video : MapPin}
                    label="Mode"
                    value={<span className="capitalize">{ad.mode || '—'}</span>}
                  />
                  <InfoRow
                    icon={AlertCircle}
                    label="Status"
                    value={
                      <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium capitalize ${STATUS_STYLE[status] || STATUS_STYLE.pending}`}>
                        {status}
                      </span>
                    }
                  />
                </div>

                {ad.reason && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <InfoRow icon={FileText} label="Reason / Symptoms" value={ad.reason} />
                  </div>
                )}
              </div>

              {/* ── Location ── */}
              {(loc.clinicName || loc.address) && (
                <div className="glass rounded-xl p-4">
                  <SectionLabel>Clinic Location</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {loc.clinicName && <InfoRow icon={Building2} label="Clinic" value={loc.clinicName} />}
                    {loc.clinicCity && <InfoRow icon={Navigation} label="City"  value={loc.clinicCity} />}
                    {loc.address    && <InfoRow icon={MapPin}     label="Address" value={loc.address} />}
                    {loc.userCity   && <InfoRow icon={User}       label="Patient City" value={loc.userCity} />}
                  </div>
                </div>
              )}

              {/* ── Cancellation ── */}
              {can && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-2">
                  <SectionLabel>Cancellation Info</SectionLabel>
                  <div className="flex items-center gap-2">
                    <XCircle size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-400/90 text-sm">
                      Cancelled by <span className="font-semibold capitalize">{can.cancelledByRole}</span>
                    </p>
                  </div>
                  {can.remark && (
                    <div className="flex items-start gap-2 mt-1">
                      <MessageSquare size={13} className="text-red-400/60 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400/70 text-sm italic">"{can.remark}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Actions (active only) ── */}
          {!loading && !isHistory && (status === 'pending' || status === 'confirmed') && (
            <div className="p-5 border-t border-white/10 flex-shrink-0 space-y-2">

              {/* pending → confirmed | rejected */}
              {status === 'pending' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onAction(appt.appointmentId, 'confirm')}
                    disabled={!!acting}
                    className="flex items-center justify-center gap-2 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {acting === appt.appointmentId + 'confirm' ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                    Confirm
                  </button>
                  <button
                    onClick={() => onAction(appt.appointmentId, 'reject')}
                    disabled={!!acting}
                    className="flex items-center justify-center gap-2 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {acting === appt.appointmentId + 'reject' ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                    Reject
                  </button>
                </div>
              )}

              {/* confirmed → completed | cancelled */}
              {status === 'confirmed' && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onAction(appt.appointmentId, 'complete')}
                    disabled={!!acting}
                    className="flex items-center justify-center gap-2 py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {acting === appt.appointmentId + 'complete' ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
                    Mark Completed
                  </button>
                  <button
                    onClick={() => setCancelModal({ open: true, remark: '' })}
                    disabled={!!acting}
                    className="flex items-center justify-center gap-2 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                  >
                    <XCircle size={13} />
                    Cancel
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* ── Cancel Confirmation Modal ── */}
      {cancelModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-red-500/20 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">Cancel Appointment?</h3>
                <p className="text-white/40 text-sm mt-0.5">This action cannot be undone.</p>
              </div>
              <button
                onClick={() => setCancelModal({ open: false, remark: '' })}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Remark textarea */}
            <div className="mb-5">
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 font-semibold">
                Reason for Cancellation <span className="text-red-400">*</span>
              </label>
              <textarea
                autoFocus
                rows={4}
                value={cancelModal.remark}
                onChange={e => setCancelModal(p => ({ ...p, remark: e.target.value }))}
                placeholder="Please provide a reason so the patient is informed..."
                className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/40 resize-none transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal({ open: false, remark: '' })}
                className="flex-1 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 rounded-xl text-sm font-medium transition-all"
              >
                Go Back
              </button>
              <button
                disabled={!cancelModal.remark.trim() || !!acting}
                onClick={() => {
                  const remark = cancelModal.remark.trim();
                  setCancelModal({ open: false, remark: '' });
                  onAction(appt.appointmentId, 'cancel', remark);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {acting === appt.appointmentId + 'cancel'
                  ? <Loader2 size={13} className="animate-spin" />
                  : <XCircle size={13} />}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentDetailDrawer;
