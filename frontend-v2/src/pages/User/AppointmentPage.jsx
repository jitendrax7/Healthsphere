import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, Loader2, MapPin, Info, ArrowLeft, Video } from 'lucide-react';
import { appointmentApi } from '../../api/axios';
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

const AppointmentPage = () => {
  const [tab, setTab]             = useState('doctors');
  const [loading, setLoading]     = useState(false);
  
  // Data States
  const [doctors, setDoctors]     = useState([]);
  const [myAppts, setMyAppts]     = useState([]);
  const [history, setHistory]     = useState([]);

  // Modals/Forms
  const navigate = useNavigate();
  const [infoId, setInfoId]               = useState(null);
  const [infoData, setInfoData]           = useState(null);
  const [infoLoading, setInfoLoading]     = useState(false);

  // Cancellation States
  const [cancelId, setCancelId]           = useState(null);
  const [cancelRemark, setCancelRemark]   = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelMsg, setCancelMsg]         = useState({ type: '', text: '' });

  // ── Data Fetching ──
  const fetchDoctors = () => {
    setLoading(true);
    appointmentApi.getDoctors().then(r => setDoctors(r.data.doctors || [])).catch(() => {}).finally(() => setLoading(false));
  };
  const fetchMyAppts = () => {
    setLoading(true);
    appointmentApi.getUserList().then(r => setMyAppts(r.data.appointments || [])).catch(() => {}).finally(() => setLoading(false));
  };
  const fetchHistory = () => {
    setLoading(true);
    appointmentApi.getHistoryList().then(r => setHistory(r.data.appointments || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'doctors') fetchDoctors();
    if (tab === 'my') fetchMyAppts();
    if (tab === 'history') fetchHistory();
  }, [tab]);

  // ── Handlers ──

  const loadMoreInfo = async (id) => {
    setInfoId(id); setInfoLoading(true); setInfoData(null);
    try {
      const res = await appointmentApi.getAppointment(id);
      setInfoData(res.data);
    } catch {
      setInfoData({ error: 'Failed to load details' });
    } finally { setInfoLoading(false); }
  };

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
      // Refresh Info Modal Data smoothly
      loadMoreInfo(infoId);
      // Background refresh lists
      if (tab === 'my') {
        appointmentApi.getMyAppointments().then(res => setMyAppts(res.data.appointments || []));
      }
    } catch (err) {
      setCancelMsg({ type: 'error', text: err.response?.data?.message || 'Failed to cancel appointment' });
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Appointments</h1>
        <p className="text-white/40">Find doctors, book slots, and manage your history</p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 glass rounded-xl w-fit">
        {[
          ['doctors','👨‍⚕️ Doctor Listing'],
          ['my','🗂️ My Appointments'],
          ['history','🕒 History']
        ].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab===k ? 'bg-primary-600 text-white shadow-glow-primary' : 'text-white/50 hover:text-white'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* ── DOCTOR LISTING ── */}
      {tab === 'doctors' && (
        <div className="space-y-4 pt-2">
          {loading && <div className="flex items-center gap-2 text-white/50"><Loader2 size={16} className="animate-spin"/> Loading doctors...</div>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map(d => (
              <div key={d.doctorId} className="glass p-3 sm:p-4 rounded-2xl flex flex-col group hover:border-white/20 transition-all overflow-hidden relative">
                {/* Image Header */}
                <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-dark-800 flex-shrink-0">
                  {d.image ? (
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-accent-cyan/20 flex flex-col items-center justify-center text-primary-400 group-hover:scale-105 transition-transform duration-500">
                      <Stethoscope size={40} className="opacity-50 mb-2" />
                      <span className="text-xl font-bold opacity-50">{d.name.trim()[0].toUpperCase()}</span>
                    </div>
                  )}
                  {/* Experience Badge */}
                  <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-accent-cyan border border-white/10 shadow-lg">
                    {d.experience} Yrs Exp
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 px-1 flex flex-col">
                  <h3 className="font-bold text-white text-lg leading-tight mb-1 truncate" title={d.name}>{d.name}</h3>
                  <p className="text-primary-400 text-sm font-medium mb-3">{d.specialization}</p>

                  <div className="space-y-2.5 mb-5 mt-auto">
                    <p className="text-white/60 text-sm flex items-start gap-2">
                       <MapPin size={15} className="mt-0.5 opacity-70 flex-shrink-0"/>
                       <span className="line-clamp-2 leading-tight">{d.clinic?.clinicName || 'Clinic'}, {d.clinic?.city || 'Unknown'}</span>
                    </p>
                    <p className="text-white/80 text-sm flex items-center gap-2 font-medium">
                       <span className="text-primary-400 font-bold">₹{d.consultationFee}</span> 
                       <span className="text-xs font-normal opacity-60 uppercase tracking-wide">Consultation</span>
                    </p>
                  </div>

                  <button onClick={() => navigate('/user/appointment/' + (d.doctorId || d._id))} className="btn-primary w-full text-sm py-2.5 mt-auto">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MY APPOINTMENTS & HISTORY LISTING ── */}
      {(tab === 'my' || tab === 'history') && (
        <div className="space-y-4 pt-2">
          {loading && <div className="flex items-center gap-2 text-white/50"><Loader2 size={16} className="animate-spin"/> Loading appointments...</div>}
          {listData(tab === 'my' ? myAppts : history, tab)}
        </div>
      )}

      {/* ── MORE INFO MODAL ── */}
      {infoId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setInfoId(null)}>
          <div className="glass w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-white/20 relative animate-slide-up max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5 flex-shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Info size={20} className="text-primary-400"/> Details</h2>
              <button onClick={() => setInfoId(null)} className="text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"><XCircle size={18}/></button>
            </div>
            
            {infoLoading ? (
              <div className="py-12 flex justify-center"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : infoData?.error ? (
              <div className="py-8 text-center text-red-400">{infoData.error}</div>
            ) : infoData ? (
              <div className="space-y-5 overflow-y-auto pr-2 pb-2">
                {/* Status & Mode */}
                <div className="flex items-center justify-between bg-dark-800/50 p-3 rounded-xl border border-white/5">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_STYLE[infoData.status] || STATUS_STYLE.pending} capitalize`}>{infoData.status}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-white/60 bg-white/5 px-3 py-1 rounded-full capitalize">
                    {infoData.mode === 'online' ? <Video size={12}/> : <Stethoscope size={12}/>} {infoData.mode}
                  </span>
                </div>

                {/* Doctor Info */}
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

                {/* Date & Time */}
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Date</p>
                    <p className="text-white text-sm flex items-center gap-1.5"><Calendar size={13}/> {new Date(infoData.appointmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Schedule</p>
                    <p className="text-white text-sm flex items-center gap-1.5"><Clock size={13}/> {infoData.startTime} - {infoData.endTime}</p>
                  </div>
                </div>

                {/* Reason */}
                {infoData.reason && (
                  <div>
                    <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Reason</p>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-white/80 text-sm whitespace-pre-wrap break-words">{infoData.reason}</div>
                  </div>
                )}

                {/* Locations */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-xs text-white/40 font-medium mb-1 uppercase tracking-wider">Your Location</p>
                    {infoData.userLocation?.city ? (
                      <p className="text-white/80 text-sm flex items-start gap-1.5"><MapPin size={14} className="mt-0.5 flex-shrink-0 text-accent-cyan"/> {infoData.userLocation.city}</p>
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

                {/* Actions Timeline */}
                {infoData.actions && infoData.actions.length > 0 && (
                  <div className="border-t border-white/10 pt-5 mt-4">
                    <p className="text-xs text-white/40 font-medium mb-4 uppercase tracking-wider">Activity Timeline</p>
                    <div className="space-y-4 pl-2 border-l-2 border-white/10">
                      {infoData.actions.map((act, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[13px] top-1.5 w-2 h-2 rounded-full bg-primary-500 shadow-glow-primary border-2 border-dark-900"></div>
                          <div className="pl-4">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium text-sm capitalize">{act.action}</span>
                              <span className="text-white/40 text-xs flex items-center gap-1"><Clock size={10}/> {new Date(act.time).toLocaleString()}</span>
                            </div>
                            <p className="text-white/50 text-xs mt-0.5">By {act.performedBy} ({act.role})</p>
                            {act.remark && <div className="mt-2 bg-white/5 px-3 py-2 rounded-md border border-white/5 text-white/80 text-sm italic whitespace-pre-wrap break-words">"{act.remark}"</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancel Action */}
                {(infoData.status?.toLowerCase() === 'pending' || infoData.status?.toLowerCase() === 'confirmed') && (
                  <div className="border-t border-white/10 pt-5 mt-5">
                    {cancelId === infoData.id ? (
                      <div className="space-y-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <label className="block text-xs text-red-400 font-medium">Cancellation Reason</label>
                        <textarea value={cancelRemark} onChange={e => setCancelRemark(e.target.value)} rows={2} placeholder="Please tell us why you are cancelling..." className="w-full bg-dark-900/50 border border-red-500/30 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500/50 resize-none transition-colors" />
                        {cancelMsg.text && <p className="text-xs text-red-400 flex items-center gap-1"><XCircle size={12}/> {cancelMsg.text}</p>}
                        <div className="flex gap-2 pt-1">
                           <button onClick={() => { setCancelId(null); setCancelMsg({type:'',text:''}); }} disabled={cancelLoading} className="flex-1 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium">Keep Appointment</button>
                           <button onClick={handleCancel} disabled={cancelLoading} className="flex-1 py-2 text-sm text-white bg-red-500/80 hover:bg-red-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                             {cancelLoading ? <Loader2 size={14} className="animate-spin"/> : 'Confirm Cancel'}
                           </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setCancelId(infoData.id)} className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-medium text-sm transition-colors flex justify-center items-center gap-2">
                        <XCircle size={16}/> Cancel Appointment
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );

  // Helper render function for list format
  function listData(dataArray, type) {
    if (!loading && dataArray.length === 0) {
      return (
        <div className="glass p-12 rounded-2xl text-center text-white/40 mt-4">
          <Calendar size={36} className="mx-auto mb-3 opacity-30" />
          <p>No {type === 'my' ? 'upcoming' : 'past'} appointments found.</p>
        </div>
      );
    }
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {dataArray.map((a) => (
          <div key={a.id} className="glass p-5 rounded-2xl hover:border-white/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wide font-bold border ${STATUS_STYLE[a.status] || STATUS_STYLE.pending}`}>
                  {a.status}
                </span>
                <span className="flex items-center gap-1 text-xs text-white/50 capitalize bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                  {a.mode === 'online' ? <Video size={10}/> : <Stethoscope size={10}/>} {a.mode}
                </span>
              </div>
              <h4 className="font-bold text-lg text-white mb-1 truncate">{a.doctorName}</h4>
              <div className="space-y-1 mb-4">
                <p className="text-white/60 text-sm flex items-center gap-1.5"><Calendar size={13}/> {new Date(a.date).toLocaleDateString()}</p>
                <p className="text-white/60 text-sm flex items-center gap-1.5"><Clock size={13}/> {a.time}</p>
              </div>
            </div>
            <button onClick={() => loadMoreInfo(a.id)} className="w-full btn-secondary text-sm py-2 flex items-center justify-center gap-2 mt-auto">
              <Info size={14} className="text-primary-400" /> More Info
            </button>
          </div>
        ))}
      </div>
    );
  }
};

export default AppointmentPage;
