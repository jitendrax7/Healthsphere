import { useState, useEffect, useCallback } from 'react';
import {
  Tent, Calendar, MapPin, Users, Clock, FileText, Phone, Send, Loader2, CheckCircle2,
  Info, Check, X, Crosshair, Image as ImageIcon, Plus, Trash2, Tag, Stethoscope
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { hospitalApi } from '../../api/axios';

/* ── Leaflet Icon Fix ─────────────────────────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ── Constants ────────────────────────────────────────────── */
const CAMP_TYPES = [
  'health_checkup', 'eye_camp', 'dental_camp', 'blood_donation',
  'vaccination', 'diabetes_screening', 'heart_health', 'other'
];

/* ── Map Helpers ──────────────────────────────────────────── */
const reverseGeocode = async (lat, lng) => {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { 'Accept-Language': 'en' } });
    const d = await r.json();
    const a = d.address || {};
    const city = a.city || a.town || a.village || a.residential || a.city_district || '';
    const lineParts = [a.road, a.neighbourhood || a.suburb].filter(Boolean);
    const addressLine = lineParts.length ? lineParts.join(', ') : (d.name || '');
    return { addressLine, city, state: a.state || '', pincode: a.postcode || '' };
  } catch { return {}; }
};

const FlyTo = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => { if (lat && lng) map.flyTo([lat, lng], 15, { duration: 1 }); }, [lat, lng]);
  return null;
};

const MapPicker = ({ lat, lng, onChange }) => {
  const Handler = () => {
    useMapEvents({ click: e => onChange(e.latlng.lat, e.latlng.lng) });
    return null;
  };
  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: 260 }}>
      <MapContainer center={[lat || 20.5937, lng || 78.9629]} zoom={lat ? 14 : 5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {lat && lng && <Marker position={[lat, lng]} />}
        <FlyTo lat={lat} lng={lng} />
        <Handler />
      </MapContainer>
    </div>
  );
};

/* ── UI Helpers ───────────────────────────────────────────── */
const Field = ({ label, icon: Icon, hint, required, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1.5 text-sm font-medium text-white/70">
      {Icon && <Icon size={14} className="text-white/40" />}
      {label}{required && <span className="text-red-400 text-xs">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-secondary-400">{hint}</p>}
  </div>
);

const ChipInput = ({ items, setItems, placeholder, icon: Icon }) => {
  const [val, setVal] = useState('');
  const handleAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = val.trim();
      if (trimmed && !items.includes(trimmed)) setItems([...items, trimmed]);
      setVal('');
    }
  };
  return (
    <div className="space-y-3">
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />}
        <input type="text" value={val} onChange={e => setVal(e.target.value)} onKeyDown={handleAdd}
          className={`input-dark w-full ${Icon ? 'pl-9' : ''}`} placeholder={placeholder} />
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-lg text-xs">
              {item} <X size={12} className="cursor-pointer hover:text-white" onClick={() => setItems(items.filter((_, idx) => idx !== i))} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const CampCreateForm = ({ initialData, onFinish }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitMode, setSubmitMode] = useState('published');

  // Main strings, numbers and booleans
  const [form, setForm] = useState({
    title: '', description: '', campType: 'health_checkup',
    startDate: '', endDate: '', startTime: '', endTime: '', registrationDeadline: '',
    maxParticipants: '', registrationRequired: true, isFree: true, campFee: 0, contactNumber: '',
    addressLine: '', city: '', state: '', pincode: '', latitude: null, longitude: null
  });

  // Multivalue states
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]); // [{ doctorName: '', specialization: '' }]
  const [poster, setPoster] = useState(null);

  // Doctor inline form
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('');

  // Map states
  const [autoFill, setAutoFill] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const addDoctor = () => {
    if (docName.trim() && docSpec.trim()) {
      setDoctors([...doctors, { doctorId: null, doctorName: docName.trim(), specialization: docSpec.trim() }]);
      setDocName(''); setDocSpec('');
    }
  };

  const removeDoctor = (idx) => {
    setDoctors(doctors.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    if (initialData) {
      const geoPoints = initialData.location?.geo?.coordinates || [];
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        campType: initialData.campType || 'health_checkup',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        registrationDeadline: initialData.registrationDeadline ? new Date(initialData.registrationDeadline).toISOString().split('T')[0] : '',
        maxParticipants: initialData.maxParticipants || '',
        registrationRequired: initialData.registrationRequired ?? true,
        isFree: initialData.isFree ?? true,
        campFee: initialData.campFee || 0,
        contactNumber: initialData.contactNumber || '',
        addressLine: initialData.location?.addressLine || '',
        city: initialData.location?.city || '',
        state: initialData.location?.state || '',
        pincode: initialData.location?.pincode || '',
        latitude: geoPoints[1] || null,
        longitude: geoPoints[0] || null,
      });
      setDepartments(initialData.departments || []);
      setServices(initialData.services || []);
      setDoctors(initialData.doctors || []);
      setPoster(initialData.posterImage?.url || initialData.posterImage || null);
      setSubmitMode(initialData.status === 'draft' ? 'draft' : 'published');
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Map Listeners
  const handleMapPin = useCallback(async (lat, lng) => {
    setForm(p => ({ ...p, latitude: lat, longitude: lng }));
    if (!autoFill) return;
    setGeocoding(true);
    const geo = await reverseGeocode(lat, lng);
    setForm(p => ({ ...p, ...geo }));
    setGeocoding(false);
  }, [autoFill]);

  const handleLiveLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setForm(p => ({ ...p, latitude, longitude }));
        setGeoLoading(false);
        if (!autoFill) return;
        setGeocoding(true);
        const geo = await reverseGeocode(latitude, longitude);
        setForm(p => ({ ...p, ...geo }));
        setGeocoding(false);
      },
      () => setGeoLoading(false)
    );
  }, [autoFill]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!poster && !initialData) return setError("Please upload a camp poster");
    if (!form.latitude || !form.longitude) return setError("Please pin the location on the map");
    if (doctors.length === 0) return setError("Please add at least one organizing doctor");

    setError(''); setLoading(true);
    try {
      const fd = new FormData();
      // File (only append if a new file was uploaded)
      if (poster instanceof File) {
         fd.append('poster', poster);
      }
      fd.append('status', submitMode);

      // Arrays
      fd.append('departments', JSON.stringify(departments));
      fd.append('services', JSON.stringify(services));
      fd.append('doctors', JSON.stringify(doctors));

      // Scalars
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null && val !== '') fd.append(key, val);
      });

      if (initialData) {
         await hospitalApi.updateCamp(initialData.id || initialData._id, fd);
      } else {
         await hospitalApi.createCamp(fd);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${initialData ? 'update' : 'create'} camp. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto py-20 animate-fade-in shadow-xl">
        <div className="glass rounded-2xl p-12 text-center space-y-4 shadow-xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-glow-primary">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white relative z-10 transition-colors">
             {initialData ? 'Camp Updated Successfully!' : 'Healthcare Camp Scheduled!'}
          </h2>
          <p className="text-white/50 max-w-sm mx-auto mb-6">
            {initialData 
              ? `Your changes have been saved${submitMode === 'published' ? ' and the camp is now live' : ' as a draft'}.` 
              : 'Your healthcare camp has been structured. It will now appear to users searching for nearby camps.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
             {onFinish && (
               <button onClick={onFinish} className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all text-sm font-medium">
                  Go Back
               </button>
             )}
             {!initialData && (
                <button onClick={() => {
                  setSuccess(false);
                  setForm({...form, title: '', description: ''});
                  setPoster(null); setDoctors([]); setServices([]); setDepartments([]);
                }} className="btn-primary text-sm shadow-glow-primary">
                  Create Another Camp
                </button>
             )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
            <FileText size={16} /> Camp Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6">
            {/* Poster Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Poster / Banner <span className="text-red-400">*</span></label>
              <label className={`block w-full aspect-square md:aspect-[3/4] rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
                poster ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/15 hover:border-white/30 hover:bg-white/5'
              }`}>
                {poster ? (
                  <img src={typeof poster === 'string' ? poster : URL.createObjectURL(poster)} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon size={24} className="mx-auto text-white/40 mb-2" />
                    <span className="text-xs text-white/40 leading-tight">Click to upload poster image</span>
                  </div>
                )}
                <input type="file" required={!poster && !initialData} accept="image/*" onChange={e => setPoster(e.target.files[0])} className="sr-only" />
              </label>
            </div>

            <div className="space-y-5">
              <Field label="Camp Title" required>
                <input type="text" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Free Eye Checkup Camp" className="input-dark w-full" />
              </Field>

              <Field label="Camp Type" required>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {CAMP_TYPES.map(type => (
                    <button key={type} type="button" onClick={() => setForm({ ...form, campType: type })}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-left capitalize transition-all ${
                        form.campType === type ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/70'
                      }`}>
                      {type.replace('_',' ')}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Description" hint="Detailed information about the camp" required>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} required placeholder="We are organizing..." className="input-dark w-full resize-none" />
              </Field>
            </div>
          </div>
        </div>

        {/* Arrays: Services & Departments */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 space-y-5">
             <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Departments</h2>
             <ChipInput items={departments} setItems={setDepartments} icon={Tent} placeholder="Type + Enter (e.g. Cardiology)" />
          </div>
          <div className="glass rounded-2xl p-6 space-y-5">
             <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Services Provided</h2>
             <ChipInput items={services} setItems={setServices} icon={ActivityIcon=> <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} placeholder="Type + Enter (e.g. Blood Test)" />
          </div>
        </div>

        {/* Doctors Array */}
        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
            <Stethoscope size={16} /> Organizing & Attending Doctors
          </h2>
          
          <div className="space-y-3">
            {doctors.map((doc, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Stethoscope size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm text-white font-semibold">{doc.doctorName}</h4>
                      <p className="text-xs text-white/40">{doc.specialization}</p>
                    </div>
                 </div>
                 <button type="button" onClick={() => removeDoctor(i)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end p-4 border border-dashed border-white/20 rounded-xl bg-white/4">
            <Field label="Doctor Name">
               <input type="text" value={docName} onChange={e=>setDocName(e.target.value)} placeholder="Dr. Rajesh Sharma" className="input-dark w-full text-sm" />
            </Field>
            <Field label="Specialty">
               <input type="text" value={docSpec} onChange={e=>setDocSpec(e.target.value)} placeholder="Cardiologist" className="input-dark w-full text-sm" />
            </Field>
            <button type="button" onClick={addDoctor} disabled={!docName.trim() || !docSpec.trim()} className="h-[42px] px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
               <Plus size={16}/> Add Doctor
            </button>
          </div>
        </div>

        {/* Timing & Dates */}
        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
            <Calendar size={16} /> Schedule & Limits
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
             <Field label="Start Date" required>
               <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="input-dark w-full" min={new Date().toISOString().split('T')[0]} />
             </Field>
             <Field label="End Date" required>
               <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="input-dark w-full" min={form.startDate || new Date().toISOString().split('T')[0]} />
             </Field>
             <Field label="Start Time" required>
               <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required className="input-dark w-full" />
             </Field>
             <Field label="End Time" required>
               <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required className="input-dark w-full" />
             </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
             <Field label="Registration Deadline" required>
               <input type="date" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} required className="input-dark w-full" 
                 max={form.startDate || ''} />
             </Field>
             <Field label="Max Participants" required>
               <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} required className="input-dark w-full" min="1" placeholder="e.g. 150" />
             </Field>
             <Field label="Contact Phone" required>
               <input type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange} required className="input-dark w-full" placeholder="+91 9876543210" />
             </Field>
          </div>
        </div>

        {/* Registration & Fees Form */}
        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
            <Tag size={16} /> Entry & Fees
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${form.registrationRequired ? 'bg-emerald-500 shadow-glow-primary' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${form.registrationRequired ? 'left-[22px]' : 'left-0.5'}`} />
              </div>
              <div>
                <span className="block text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">Registration Required</span>
                <span className="block text-xs text-white/40 mt-0.5">Users must RSVP via app</span>
              </div>
              <input type="checkbox" name="registrationRequired" checked={form.registrationRequired} onChange={handleChange} className="sr-only" />
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${form.isFree ? 'bg-emerald-500 shadow-glow-primary' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${form.isFree ? 'left-[22px]' : 'left-0.5'}`} />
              </div>
              <div>
                <span className="block text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">Free Entry</span>
                <span className="block text-xs text-white/40 mt-0.5">Camp is free of charge</span>
              </div>
              <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} className="sr-only" />
            </label>
            
            {!form.isFree && (
              <Field label="Camp Fee (₹)" required={!form.isFree}>
                <input type="number" name="campFee" value={form.campFee} onChange={handleChange} min="1" placeholder="e.g. 50" required className="input-dark w-full" />
              </Field>
            )}
          </div>
        </div>

        {/* Map & Location */}
        <div className="glass rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} /> Location Venue
            </h2>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setAutoFill(!autoFill)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${autoFill ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
                {autoFill ? <Check size={12} /> : <X size={12} />} Auto-fill Address
              </button>
              <button type="button" onClick={handleLiveLocation} disabled={geoLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20 rounded-lg text-xs font-medium transition-all">
                {geoLoading ? <Loader2 size={12} className="animate-spin" /> : <Crosshair size={12} />} My Location
              </button>
            </div>
          </div>

          <p className="text-xs text-secondary-300 flex items-center gap-1.5 text-white/60">
            Click the map to pin the exact camp spot. {geocoding && <span className="text-emerald-400 italic">Detecting address...</span>}
          </p>

          <MapPicker lat={form.latitude} lng={form.longitude} onChange={handleMapPin} />

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-3">
              <Field label="Address Line" required><input type="text" name="addressLine" value={form.addressLine} onChange={handleChange} required placeholder="Community Hall..." className="input-dark w-full"/></Field>
            </div>
            <div className="md:col-span-1">
              <Field label="City" required><input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="Jabalpur" className="input-dark w-full"/></Field>
            </div>
            <div className="md:col-span-1">
              <Field label="State" required><input type="text" name="state" value={form.state} onChange={handleChange} required placeholder="MP" className="input-dark w-full"/></Field>
            </div>
            <div className="md:col-span-1">
              <Field label="Pincode" required><input type="text" name="pincode" value={form.pincode} onChange={handleChange} required placeholder="482001" className="input-dark w-full"/></Field>
            </div>
          </div>
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-2"><Info size={16} className="mt-0.5 shrink-0"/>{error}</div>}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
          <p className="text-[11px] text-white/40 max-w-xs leading-relaxed">
            <strong className="text-amber-400 font-medium">Note:</strong> Once published, a camp can only be marked as completed or cancelled. It cannot return to draft status.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
          {(!initialData || initialData.status === 'draft') && (
            <button type="submit" onClick={() => setSubmitMode('draft')} disabled={loading} className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 hover:text-white font-medium transition-all">
               {initialData ? 'Update Draft' : 'Save as Draft'}
            </button>
          )}
          <button type="submit" onClick={() => setSubmitMode('published')} disabled={loading} className="btn-primary w-full sm:w-auto px-12 py-3.5 text-base flex items-center justify-center gap-2">
            {loading && submitMode === 'published' ? <><Loader2 size={18} className="animate-spin" /> {initialData ? 'Updating...' : 'Publishing...'}</> : <><Send size={18} /> {initialData && initialData.status === 'published' ? 'Update Camp Details' : 'Publish Camp'}</>}
          </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CampCreateForm;
