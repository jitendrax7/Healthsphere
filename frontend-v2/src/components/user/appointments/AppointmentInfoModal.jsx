import { useState } from 'react';
import {
  Info, XCircle, Loader2, Calendar, Clock, Video, Stethoscope,
  MapPin
} from 'lucide-react';
import { appointmentApi } from '../../../api/axios';

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

const AppointmentInfoModal = ({ infoId, infoData, infoLoading, onClose, onRefresh }) => {
  const [cancelId, setCancelId]           = useState(null);
  const [cancelRemark, setCancelRemark]   = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMsg, setCancelMsg]         = useState({ type: '', text: '' });

  const handleCancel = async () => {
    if (!cancelRemark.trim()) {
      setCancelMsg({ type: 'error', text: 'Please provide a reason for cancellation' });
      return;
    }
    setCancelLoading(true);
    setCancelMsg({ type: '', text: '' });
    try {
      await appointmentApi.cancelAppointment({ appointmentId: cancelId, remark: cancelRemark });
      setCancelId(null);
      setCancelRemark('');
      onRefresh(infoId);
    } catch (err) {
      setCancelMsg({ type: 'error', text: err.response?.data?.message || 'Failed to cancel appointment' });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="glass w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/20 relative animate-slide-up max-h-[92vh] sm:max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5 flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><Info size={20} className="text-primary-400" /> Details</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            <XCircle size={18} />
          </button>
        </div>

        {infoLoading ? (
          <div className="py-12 flex justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : infoData?.error ? (
          <div className="py-8 text-center text-red-400">{infoData.error}</div>
        ) : infoData ? (
          <div className="space-y-5 overflow-y-auto pr-1 pb-2">
            <div className="flex items-center justify-between bg-dark-800/50 p-3 rounded-xl border border-white/5">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[infoData.status] || STATUS_STYLE.pending} capitalize`}>{infoData.status}</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-white/60 bg-white/5 px-3 py-1 rounded-full capitalize">
                {infoData.mode === 'online' ? <Video size={12} /> : <Stethoscope size={12} />} {infoData.mode}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {infoData.doctor?.image ? (
                <img src={infoData.doctor.image} alt={infoData.doctor?.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-white/10" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-cyan flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-glow-primary">
                  {infoData.doctor?.name?.trim()[0]?.toUpperCase() || 'D'}
                </div>
              )}
              <div>
                <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Doctor</p>
                <p className="text-white font-medium text-lg leading-tight">{infoData.doctor?.name}</p>
                <p className="text-white/60 text-sm mt-0.5">{infoData.doctor?.email}</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div>
                <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Date</p>
                <p className="text-white text-sm flex items-center gap-1.5"><Calendar size={13} /> {new Date(infoData.appointmentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Schedule</p>
                <p className="text-white text-sm flex items-center gap-1.5"><Clock size={13} /> {infoData.startTime} - {infoData.endTime}</p>
              </div>
            </div>

            {infoData.reason && (
              <div>
                <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Reason</p>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-white/80 text-sm whitespace-pre-wrap break-words">{infoData.reason}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Your Location</p>
                {infoData.userLocation?.city ? (
                  <p className="text-white/80 text-sm flex items-start gap-1.5"><MapPin size={14} className="mt-0.5 flex-shrink-0 text-accent-cyan" /> {infoData.userLocation.city}</p>
                ) : <p className="text-white/40 text-sm italic">Not provided</p>}
              </div>
              <div>
                <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Clinic Location</p>
                {infoData.doctorLocation?.clinicName || infoData.doctorLocation?.city ? (
                  <div>
                    <p className="text-white/80 text-sm font-medium">{infoData.doctorLocation.clinicName || 'Clinic'}</p>
                    <p className="text-white/50 text-xs mt-0.5 mb-2">{infoData.doctorLocation.addressLine}, {infoData.doctorLocation.city}</p>
                    {(infoData.doctorLocation.latitude || infoData.doctorLocation.lati) && (infoData.doctorLocation.longitude || infoData.doctorLocation.lang) && (
                      <a href={`https://maps.google.com/?q=${infoData.doctorLocation.latitude || infoData.doctorLocation.lati},${infoData.doctorLocation.longitude || infoData.doctorLocation.lang}`} target="_blank" rel="noreferrer" className="text-accent-cyan hover:text-white transition-colors text-xs font-medium flex items-center gap-1 w-fit bg-accent-cyan/10 px-2 py-1 rounded-md">
                        <MapPin size={10} /> View on map
                      </a>
                    )}
                  </div>
                ) : <p className="text-white/40 text-sm italic">Online / Not mapped</p>}
              </div>
            </div>

            {infoData.actions && infoData.actions.length > 0 && (
              <div className="border-t border-white/10 pt-5 mt-4">
                <p className="text-xs text-white/40 font-medium mb-4 uppercase tracking-wider">Activity Timeline</p>
                <div className="space-y-4 pl-2 border-l-2 border-white/10">
                  {infoData.actions.map((act, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[13px] top-1.5 w-2 h-2 rounded-full bg-primary-500 shadow-glow-primary border-2 border-dark-900" />
                      <div className="pl-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-medium text-sm capitalize">{act.action}</span>
                          <span className="text-white/40 text-xs flex items-center gap-1"><Clock size={10} /> {new Date(act.time).toLocaleString()}</span>
                        </div>
                        <p className="text-white/50 text-xs mt-0.5">By {act.performedBy} ({act.role})</p>
                        {act.remark && <div className="mt-2 bg-white/5 px-3 py-2 rounded-md border border-white/5 text-white/80 text-sm italic whitespace-pre-wrap break-words">"{act.remark}"</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(infoData.status?.toLowerCase() === 'pending' || infoData.status?.toLowerCase() === 'confirmed') && (
              <div className="border-t border-white/10 pt-5 mt-5">
                {cancelId === infoData.id ? (
                  <div className="space-y-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <label className="block text-xs text-red-400 font-medium">Cancellation Reason</label>
                    <textarea
                      value={cancelRemark}
                      onChange={e => setCancelRemark(e.target.value)}
                      rows={2}
                      placeholder="Please tell us why you are cancelling..."
                      className="w-full bg-dark-900/50 border border-red-500/30 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 resize-none transition-colors"
                    />
                    {cancelMsg.text && <p className="text-xs text-red-400 flex items-center gap-1"><XCircle size={12} /> {cancelMsg.text}</p>}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => { setCancelId(null); setCancelMsg({ type: '', text: '' }); }}
                        disabled={cancelLoading}
                        className="flex-1 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium"
                      >Keep Appointment</button>
                      <button
                        onClick={handleCancel}
                        disabled={cancelLoading}
                        className="flex-1 py-2 text-sm text-white bg-red-500/80 hover:bg-red-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {cancelLoading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Cancel'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setCancelId(infoData.id)}
                    className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors flex justify-center items-center gap-2"
                  >
                    <XCircle size={16} /> Cancel Appointment
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AppointmentInfoModal;
