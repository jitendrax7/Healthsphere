import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Loader2, CheckCircle, XCircle, ArrowLeft,
  Video, Stethoscope, MapPin, Star, GraduationCap, IndianRupee,
  Briefcase, Heart, Globe, Languages, Building2, Activity, Navigation,
  Phone, MessageCircle, Shield
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { appointmentApi } from '../../api/axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DAYS_SHORT = { Monday:'Mon', Tuesday:'Tue', Wednesday:'Wed', Thursday:'Thu', Friday:'Fri', Saturday:'Sat', Sunday:'Sun' };

/* ── Small helpers ── */
const Tag = ({ label, color = 'bg-white/5 text-white/60 border-white/10' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${color}`}>{label}</span>
);

const InfoChip = ({ icon: Icon, label, color = 'text-white/50' }) => (
  <span className={`flex items-center gap-1 text-xs font-medium ${color} bg-white/5 border border-white/8 px-2.5 py-1 rounded-full`}>
    <Icon size={10} />{label}
  </span>
);

/* ══════════════════════════════════════════════════════════ */
const BookAppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [form, setForm] = useState({ date: '', startTime: '', endTime: '', reason: '', mode: 'offline' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  /* ── Fetch Doctor ── */
  useEffect(() => {
    appointmentApi.getDoctorById(id)
      .then(res => { if (res.data?.doctor) setData(res.data); else navigate('/user/appointment'); })
      .catch(() => navigate('/user/appointment'))
      .finally(() => setPageLoading(false));
  }, [id, navigate]);

  /* ── Fetch Slots on date change ── */
  useEffect(() => {
    if (!data || !form.date) { setAvailableSlots(null); return; }
    setSlotsLoading(true);
    setAvailableSlots(null);
    setForm(p => ({ ...p, startTime: '', endTime: '' }));
    const timer = setTimeout(() => {
      appointmentApi.getAvailableSlots(data.doctor.id, form.date)
        .then(res => setAvailableSlots(res.data.availableSlots || []))
        .catch(() => setAvailableSlots([]))
        .finally(() => setSlotsLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [data, form.date]);

  /* ── Book ── */
  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.startTime || !form.endTime) { setMsg({ type: 'error', text: 'Please select a time slot.' }); return; }
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      await appointmentApi.book({ doctorId: data.doctor.id, ...form });
      setMsg({ type: 'success', text: 'Appointment confirmed! Redirecting…' });
      setTimeout(() => navigate('/user/appointment'), 1800);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Booking failed. Please try again.' });
    } finally { setLoading(false); }
  };

  if (pageLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );
  if (!data) return null;

  const { doctor, professional, qualifications = [], languages = [], services = [], clinic, availability } = data;
  const consultModes = professional.consultationMode === 'both' ? ['offline', 'online'] : [professional.consultationMode];
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6 pb-10">

      {/* ── Back ── */}
      <button onClick={() => navigate('/user/appointment')}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/8 w-fit">
        <ArrowLeft size={15} /> Back to Doctors
      </button>

      <div className="grid lg:grid-cols-12 gap-6 items-start">

        {/* ══ LEFT COLUMN: Doctor Profile ══ */}
        <div className="lg:col-span-5 space-y-4">

          {/* Hero Card */}
          <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-xl">
            {/* Gradient banner */}
            <div className="h-24 bg-gradient-to-br from-primary-600/40 via-accent-cyan/20 to-transparent relative">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
            </div>
            <div className="px-6 pb-6 -mt-12 relative">
              <div className="flex items-end justify-between mb-4">
                {/* Avatar */}
                {doctor.profilePhoto ? (
                  <img src={doctor.profilePhoto} alt={doctor.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-dark-900 shadow-2xl" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-3xl font-bold text-white border-4 border-dark-900 shadow-2xl">
                    {doctor.name?.[0]?.toUpperCase() || 'D'}
                  </div>
                )}
                {/* Rating */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={13} className={s <= Math.round(doctor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'} />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40 mt-0.5">{doctor.reviewCount > 0 ? `${doctor.reviewCount} reviews` : 'No reviews yet'}</p>
                </div>
              </div>

              {/* Name & specialization */}
              <h1 className="text-xl font-bold text-white">{doctor.name}</h1>
              <p className="text-primary-400 font-semibold text-sm mt-0.5">{professional.specialization}</p>

              {/* Chips row */}
              <div className="flex flex-wrap gap-2 mt-3">
                {professional.experience > 0 && <InfoChip icon={Briefcase} label={`${professional.experience} yrs exp`} />}
                <InfoChip icon={IndianRupee} label={`₹${professional.consultationFee} / visit`} color="text-green-400" />
                {doctor.city && <InfoChip icon={MapPin} label={doctor.city} />}
                {professional.consultationMode && (
                  <InfoChip icon={professional.consultationMode === 'online' ? Video : Stethoscope}
                    label={professional.consultationMode === 'both' ? 'Online & In-person' : professional.consultationMode}
                    color="text-accent-cyan" />
                )}
              </div>

              {/* Bio */}
              {professional.bio && (
                <p className="text-white/60 text-sm leading-relaxed mt-4 pt-4 border-t border-white/8">{professional.bio}</p>
              )}
            </div>
          </div>

          {/* Languages & Services */}
          {(languages.length > 0 || services.length > 0) && (
            <div className="glass rounded-2xl p-5 border border-white/5 space-y-4">
              {languages.length > 0 && (
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5"><Languages size={11}/>Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(l => <Tag key={l} label={l} />)}
                  </div>
                </div>
              )}
              {services.length > 0 && (
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5"><Activity size={11}/>Services</p>
                  <div className="flex flex-wrap gap-2">
                    {services.map(s => <Tag key={s} label={s} color="bg-accent-cyan/8 text-accent-cyan border-accent-cyan/20" />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Qualifications */}
          {qualifications.length > 0 && (
            <div className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5"><GraduationCap size={11}/>Qualifications</p>
              <div className="space-y-2">
                {qualifications.map((q, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center shrink-0">
                      <GraduationCap size={14} className="text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{q.degree}</p>
                      <p className="text-[11px] text-white/40 mt-0.5">{q.institute}{q.year ? ` · ${q.year}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {availability && (
            <div className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5"><Calendar size={11}/>Availability</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                  <span key={d} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${availability.availableDays?.includes(d) ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-white/3 text-white/20'}`}>
                    {DAYS_SHORT[d]}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between bg-white/3 rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Clock size={13} className="text-accent-cyan" />
                  {availability.startTime} – {availability.endTime}
                </div>
                <span className="text-[11px] font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded">
                  {availability.slotDuration}m slots
                </span>
              </div>
              {availability.bookingEnabled ? (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-green-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" /> Accepting appointments
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-red-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> Not accepting new appointments
                </div>
              )}
            </div>
          )}

          {/* Clinic Location */}
          {clinic && (
            <div className="glass rounded-2xl p-5 border border-white/5">
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5"><Navigation size={11}/>Clinic Location</p>
              <p className="text-sm font-bold text-white mb-1">{clinic.clinicName}</p>
              <p className="text-xs text-white/50 mb-3 leading-relaxed">
                {[clinic.address, clinic.city, clinic.state, clinic.pincode].filter(Boolean).join(', ')}
              </p>
              {clinic.latitude && clinic.longitude && (
                <div className="h-44 rounded-xl overflow-hidden border border-white/10">
                  <MapContainer center={[clinic.latitude, clinic.longitude]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[clinic.latitude, clinic.longitude]} />
                  </MapContainer>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ══ RIGHT COLUMN: Booking Form ══ */}
        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-6 lg:p-8 border border-white/5 shadow-xl sticky top-6">
            {/* Booking header */}
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-white/8">
              <div>
                <h2 className="text-xl font-bold text-white">Book Appointment</h2>
                <p className="text-white/40 text-sm mt-1">with {doctor.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">₹{professional.consultationFee}</p>
                <p className="text-[11px] text-white/30 font-medium">per consultation</p>
              </div>
            </div>

            <form onSubmit={handleBook} className="space-y-5">

              {/* Date picker */}
              <div>
                <label className="block text-xs text-white/40 mb-2 font-bold uppercase tracking-wider">Select Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input type="date" value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    min={today} required
                    className="w-full bg-dark-800/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 [&::-webkit-calendar-picker-indicator]:invert-[0.6] [&::-webkit-calendar-picker-indicator]:cursor-pointer transition-colors" />
                </div>
              </div>

              {/* Slots */}
              {form.date && (
                <div className="bg-dark-800/40 rounded-2xl border border-white/5 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Available Slots</label>
                    {slotsLoading && <Loader2 size={13} className="animate-spin text-primary-400" />}
                  </div>

                  {!slotsLoading && availableSlots?.length === 0 && (
                    <div className="text-center py-3">
                      <XCircle size={22} className="text-white/20 mx-auto mb-2" />
                      <p className="text-white/30 text-sm">No slots available for this date.</p>
                    </div>
                  )}

                  {!slotsLoading && availableSlots?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {availableSlots.map((slot, i) => (
                        <button type="button" key={i}
                          onClick={() => setForm(p => ({ ...p, startTime: slot.startTime, endTime: slot.endTime }))}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                            form.startTime === slot.startTime && form.endTime === slot.endTime
                              ? 'bg-primary-500/30 border-primary-500 text-white shadow-glow-primary scale-105'
                              : 'bg-dark-800/60 border-white/10 text-white/60 hover:border-primary-500/40 hover:text-white'
                          }`}>
                          <Clock size={11} /> {slot.startTime} – {slot.endTime}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Manual time picker — always visible after date is chosen */}
                  {!slotsLoading && (
                    <div className={`${availableSlots?.length > 0 ? 'pt-3 border-t border-white/5' : ''}`}>
                      <p className="text-[10px] text-white/30 uppercase font-bold mb-2.5 flex items-center gap-1.5">
                        <Clock size={10} /> {availableSlots?.length > 0 ? 'Or enter time manually' : 'Enter preferred time'}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-white/30 mb-1.5 font-medium">Start Time</label>
                          <input type="time" value={form.startTime}
                            onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                            className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/30 mb-1.5 font-medium">End Time</label>
                          <input type="time" value={form.endTime}
                            onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                            className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected summary */}
                  {form.startTime && form.endTime && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <CheckCircle size={13} className="text-green-400 shrink-0" />
                      <p className="text-sm font-bold text-green-300">{form.startTime} – {form.endTime}</p>
                      <button type="button" onClick={() => setForm(p => ({ ...p, startTime: '', endTime: '' }))}
                        className="ml-auto text-[10px] text-white/30 hover:text-red-400 transition-colors font-bold">Clear</button>
                    </div>
                  )}
                </div>
              )}

              {/* Consultation Mode */}
              {consultModes.length > 1 ? (
                <div>
                  <label className="block text-xs text-white/40 mb-2 font-bold uppercase tracking-wider">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    {consultModes.map(m => (
                      <button type="button" key={m} onClick={() => setForm({ ...form, mode: m })}
                        className={`py-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-all capitalize ${
                          form.mode === m
                            ? 'bg-primary-600 border-primary-500 text-white shadow-glow-primary'
                            : 'bg-dark-800/50 border-white/10 text-white/50 hover:border-white/30'
                        }`}>
                        {m === 'online' ? <Video size={15}/> : <Stethoscope size={15}/>} {m === 'online' ? 'Video Call' : 'In-person'}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-white/3 border border-white/8 rounded-xl">
                  {consultModes[0] === 'online' ? <Video size={15} className="text-accent-cyan"/> : <Stethoscope size={15} className="text-primary-400"/>}
                  <p className="text-sm text-white/70 font-medium capitalize">{consultModes[0] === 'online' ? 'Video Call consultation' : 'In-person visit'}</p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-xs text-white/40 mb-2 font-bold uppercase tracking-wider">Reason / Symptoms</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                  rows={4} placeholder="Briefly describe your symptoms or reason for visit..."
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-primary-500/50 placeholder-white/20 transition-colors" />
              </div>

              {/* Summary before booking */}
              {form.date && form.startTime && (
                <div className="bg-primary-500/8 border border-primary-500/20 rounded-xl p-4 space-y-2">
                  <p className="text-[11px] text-primary-300 font-bold uppercase tracking-wider">Booking Summary</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                    <span><span className="text-white/40">Date:</span> {new Date(form.date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })}</span>
                    <span><span className="text-white/40">Time:</span> {form.startTime} – {form.endTime}</span>
                    <span><span className="text-white/40">Mode:</span> {form.mode}</span>
                    <span><span className="text-white/40">Fee:</span> ₹{professional.consultationFee}</span>
                  </div>
                </div>
              )}

              {/* Status msg */}
              {msg.text && (
                <div className={`flex items-center gap-2 p-3.5 rounded-xl text-sm border font-medium ${
                  msg.type === 'success'
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {msg.type === 'success' ? <CheckCircle size={15}/> : <XCircle size={15}/>} {msg.text}
                </div>
              )}

              {/* Submit */}
              {availability?.bookingEnabled !== false ? (
                <button type="submit" disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 bg-gradient-to-r from-primary-600 to-accent-cyan text-white font-bold text-[15px] rounded-xl shadow-glow-primary hover:opacity-90 disabled:opacity-60 transition-all">
                  {loading
                    ? <><Loader2 size={18} className="animate-spin"/>Confirming…</>
                    : <><CheckCircle size={18}/>Confirm Appointment</>
                  }
                </button>
              ) : (
                <div className="text-center py-3 text-red-400 text-sm font-medium bg-red-500/8 border border-red-500/20 rounded-xl">
                  This doctor is not accepting appointments at the moment.
                </div>
              )}

              <p className="text-center text-[11px] text-white/25 flex items-center justify-center gap-1.5">
                <Shield size={10}/> Your data is encrypted and secure.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
