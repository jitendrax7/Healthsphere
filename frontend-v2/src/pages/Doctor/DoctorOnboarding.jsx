import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, GraduationCap, Building2, MapPin, Clock, FileText,
  ChevronRight, ChevronLeft, Check, Loader2, Plus, Trash2, X,
  IndianRupee, Briefcase, Sparkles, AlertCircle, Navigation
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { doctorApi } from '../../api/axios';
import { useApp } from '../../context/AppContext';

/* ── Leaflet Icons ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ── Nominatim Reverse Geocoding ── */
const reverseGeocode = async (lat, lng) => {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const d = await r.json();
    const a = d.address || {};

    const city = a.city || a.town || a.village || a.residential || a.city_district || a.state_district || a.municipality || '';
    const lineParts = [a.road, a.neighbourhood || a.suburb].filter(Boolean);
    const addressLine = lineParts.length ? lineParts.join(', ') : (d.name || (d.display_name ? d.display_name.split(',')[0].trim() : ''));

    return { addressLine, city, state: a.state || '', pincode: a.postcode || '' };
  } catch { return {}; }
};

const FlyTo = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => { if (lat && lng) map.flyTo([lat, lng], 15, { duration: 1 }); }, [lat, lng, map]);
  return null;
};

/* ── Map Picker ── */
const MapPicker = ({ lat, lng, onChange }) => {
  const Handler = () => {
    useMapEvents({ click(e) { onChange(e.latlng.lat, e.latlng.lng); } });
    return null;
  };
  return (
    <div className="h-64 rounded-xl overflow-hidden border border-white/10 z-0 relative">
      <MapContainer center={[lat || 20.5937, lng || 78.9629]} zoom={lat ? 15 : 5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {lat && lng && <Marker position={[lat, lng]} />}
        <FlyTo lat={lat} lng={lng} />
        <Handler />
      </MapContainer>
    </div>
  );
};

/* ── Helpers ── */
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const Input = (props) => (
  <input {...props} className={`w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 transition-colors ${props.className || ''}`} />
);
const Select = (props) => (
  <select {...props} className={`w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 transition-colors ${props.className || ''}`}>
    {props.children}
  </select>
);
const Label = ({ children }) => <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">{children}</p>;

/* ── Steps ── */
const STEPS = [
  { id: 'welcome',       title: 'Welcome!',            icon: Sparkles,      desc: 'Quick setup to get your profile ready' },
  { id: 'professional',  title: 'Professional Details',icon: Stethoscope,   desc: 'Your specialization and practice config' },
  { id: 'qualifications',title: 'Qualifications',      icon: GraduationCap, desc: 'Degrees, services, and awards'         },
  { id: 'documents',     title: 'Experience & Docs',   icon: FileText,      desc: 'Work history and verification forms'   },
  { id: 'availability',  title: 'Availability & Map',  icon: Clock,         desc: 'Clinic location and schedule'          },
  { id: 'done',          title: "You're all set!",     icon: Check,         desc: 'Profile saved successfully'            },
];

const Ring = ({ step, total }) => {
  const pct = step / total;
  const r = 22; const c = 2 * Math.PI * r;
  return (
    <svg width="60" height="60" className="rotate-[-90deg]">
      <circle cx="30" cy="30" r={r} strokeWidth="4" fill="none" stroke="rgba(255,255,255,0.08)" />
      <circle cx="30" cy="30" r={r} strokeWidth="4" fill="none" stroke="url(#pg)" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient>
      </defs>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════ */
const DoctorOnboarding = () => {
  const navigate = useNavigate();
  const { setDoctorCtx } = useApp();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fields: Basic
  const [prof, setProf] = useState({ specialization: '', totalExperience: '', consultationFee: '', employmentType: 'independent', consultationMode: 'both', bio: '' });
  
  // Fields: String Arrays
  const [languages, setLanguages] = useState(['English', 'Hindi']);
  const [servicesOffered, setServicesOffered] = useState([]);
  const [tagInput, setTagInput] = useState({ lang: '', serv: '' });

  // Fields: Object Arrays
  const [quals, setQuals] = useState([{ degree: '', institute: '', year: '' }]);
  const [certs, setCerts] = useState([]);
  const [awards, setAwards] = useState([]);
  const [experienceList, setExperienceList] = useState([]);

  // Fields: Complex Objs
  const [avail, setAvail] = useState({ availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'], startTime: '09:00', endTime: '18:00', slotDuration: 30 });
  const [clinic, setClinic] = useState({ clinicName: '', addressLine: '', city: '', state: '', pincode: '', latitude: null, longitude: null });

  // Map States
  const [geocoding, setGeocoding] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [autoFill, setAutoFill] = useState(true);

  // Map Handlers
  const handleMapPin = useCallback(async (lat, lng) => {
    setClinic(p => ({ ...p, latitude: lat, longitude: lng }));
    if (!autoFill) return;
    setGeocoding(true);
    const geo = await reverseGeocode(lat, lng);
    setClinic(p => ({ ...p, ...geo }));
    setGeocoding(false);
  }, [autoFill]);

  const handleLiveLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setClinic(p => ({ ...p, latitude, longitude }));
        setGeoLoading(false);
        if (!autoFill) return;
        setGeocoding(true);
        const geo = await reverseGeocode(latitude, longitude);
        setClinic(p => ({ ...p, ...geo }));
        setGeocoding(false);
      },
      () => setGeoLoading(false)
    );
  }, [autoFill]);

  // Fields: Files (Arrays for multiples, Single for maxCount:1)
  const [docs, setDocs] = useState({ medical_license: null, degree_certificate: [], id_proof: null, experience_certificate: [], other: [] });

  const totalSteps = STEPS.length;
  const current = STEPS[step];

  const go = (dir) => { setError(''); setStep(s => s + dir); };

  const handleSave = async () => {
    // Validate
    if (!clinic.latitude || !clinic.longitude) return setError("Please pin your clinic location on the map.");
    if (!docs.medical_license) return setError("Medical License is required.");
    if (quals.some(q => !q.degree || !q.institute || !q.year)) return setError("Please fill out all initial qualification fields.");

    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      
      // Scalars
      Object.entries(prof).forEach(([k, v]) => fd.append(k, v));
      
      // JSON Strings
      fd.append('qualifications', JSON.stringify(quals));
      fd.append('certifications', JSON.stringify(certs));
      fd.append('awards', JSON.stringify(awards));
      fd.append('languages', JSON.stringify(languages));
      fd.append('servicesOffered', JSON.stringify(servicesOffered));
      fd.append('experienceDetails', JSON.stringify(experienceList));
      fd.append('availableDays', JSON.stringify(avail.availableDays));
      fd.append('availability', JSON.stringify({ startTime: avail.startTime, endTime: avail.endTime, slotDuration: Number(avail.slotDuration) }));
      fd.append('clinicLocation', JSON.stringify(clinic));

      // Files
      if (docs.medical_license) fd.append('medical_license', docs.medical_license);
      if (docs.id_proof)        fd.append('id_proof', docs.id_proof);
      docs.degree_certificate.forEach(f => fd.append('degree_certificate', f));
      docs.experience_certificate.forEach(f => fd.append('experience_certificate', f));
      docs.other.forEach(f => fd.append('other', f));

      await doctorApi.createProfile(fd);
      setDoctorCtx(prev => ({ ...prev, newUser: false }));
      go(1); // → done step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finish profiling. Ensure all required fields are filled.');
    } finally { 
      setSaving(false); 
    }
  };

  /* ── Array Updaters ── */
  const addTag = (type, val) => {
    if (!val.trim()) return;
    if (type === 'lang' && !languages.includes(val.trim())) setLanguages(p => [...p, val.trim()]);
    if (type === 'serv' && !servicesOffered.includes(val.trim())) setServicesOffered(p => [...p, val.trim()]);
    setTagInput(p => ({ ...p, [type]: '' }));
  };
  const removeTag = (type, val) => {
    if (type === 'lang') setLanguages(p => p.filter(x => x !== val));
    if (type === 'serv') setServicesOffered(p => p.filter(x => x !== val));
  };
  
  const handleFileChange = (e, key, isMultiple) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (isMultiple) setDocs(p => ({ ...p, [key]: [...p[key], ...files] }))
    else setDocs(p => ({ ...p, [key]: files[0] }))
  };

  const removeFile = (key, idx) => {
    if (Array.isArray(docs[key])) setDocs(p => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));
    else setDocs(p => ({ ...p, [key]: null }));
  };

  /* ── Step renderers ────────────────────────────────── */
  const renderStep = () => {
    switch (current.id) {

      case 'welcome': return (
        <div className="text-center space-y-6 py-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center mx-auto shadow-glow-primary">
            <Sparkles size={36} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Welcome to HealthSphere!</h2>
            <p className="text-white/50 mt-2 text-sm leading-relaxed max-w-xs mx-auto">
              Please comprehensively submit your medical portfolio so we can verify and publish your profile.
            </p>
          </div>
          <div className="flex flex-col gap-2 max-w-xs mx-auto">
            {STEPS.slice(1, -1).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 bg-white/3 rounded-xl px-4 py-2.5 border border-white/5">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-400">{i + 1}</div>
                <p className="text-white/60 text-sm">{s.title}</p>
              </div>
            ))}
          </div>
        </div>
      );

      case 'professional': return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
               <Label>Specialization *</Label>
               <Input value={prof.specialization} onChange={e => setProf(p => ({...p, specialization: e.target.value}))} placeholder="Cardiologist" />
             </div>
             <div>
               <Label>Total Experience (Yrs) *</Label>
               <Input type="number" value={prof.totalExperience} onChange={e => setProf(p => ({...p, totalExperience: e.target.value}))} min="0" placeholder="5" />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <Label>Employment Type *</Label>
               <Select value={prof.employmentType} onChange={e => setProf(p => ({...p, employmentType: e.target.value}))}>
                  <option value="independent">Independent Clinic</option>
                  <option value="hospital">Hospital Employed</option>
               </Select>
             </div>
             <div>
               <Label>Consultation Mode *</Label>
               <Select value={prof.consultationMode} onChange={e => setProf(p => ({...p, consultationMode: e.target.value}))}>
                  <option value="both">Both</option>
                  <option value="online">Online Only</option>
                  <option value="offline">Offline Only</option>
               </Select>
             </div>
          </div>
          <div>
            <Label>Consultation Fee (₹) *</Label>
            <div className="relative">
               <IndianRupee size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
               <Input type="number" value={prof.consultationFee} onChange={e => setProf(p => ({...p, consultationFee: e.target.value}))} placeholder="500" className="pl-9" />
            </div>
          </div>
          <div>
            <Label>Bio / About Me</Label>
            <textarea value={prof.bio} onChange={e => setProf(p => ({...p, bio: e.target.value}))} rows={3} placeholder="Tell patients about your expertise..."
              className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 resize-none transition-colors" />
          </div>
          <div>
             <Label>Spoken Languages</Label>
             <div className="flex gap-2 mb-2">
                <Input value={tagInput.lang} onChange={e => setTagInput(p => ({...p, lang: e.target.value}))} onKeyDown={e => e.key === 'Enter' && addTag('lang', tagInput.lang)} placeholder="Add a language and hit Enter" />
                <button type="button" onClick={() => addTag('lang', tagInput.lang)} className="px-4 bg-primary-500/20 text-primary-400 rounded-xl hover:bg-primary-500/30">Add</button>
             </div>
             <div className="flex flex-wrap gap-2">
                {languages.map(l => (
                   <span key={l} className="px-3 py-1 bg-white/10 rounded-full text-xs flex items-center gap-2">{l} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => removeTag('lang', l)} /></span>
                ))}
             </div>
          </div>
        </div>
      );

      case 'qualifications': return (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Services */}
          <div>
             <Label>Services Offered</Label>
             <div className="flex gap-2 mb-2">
                <Input value={tagInput.serv} onChange={e => setTagInput(p => ({...p, serv: e.target.value}))} onKeyDown={e => e.key === 'Enter' && addTag('serv', tagInput.serv)} placeholder="e.g. ECG, Heart Checkup" />
                <button type="button" onClick={() => addTag('serv', tagInput.serv)} className="px-4 bg-primary-500/20 text-primary-400 rounded-xl">Add</button>
             </div>
             <div className="flex flex-wrap gap-2">
                {servicesOffered.map(s => (
                   <span key={s} className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan rounded-full text-xs flex items-center gap-2">{s} <X size={12} className="cursor-pointer hover:text-red-400" onClick={() => removeTag('serv', s)} /></span>
                ))}
             </div>
          </div>

          <hr className="border-white/5" />

          {/* Quals */}
          <div className="space-y-3">
             <Label>Degrees & Education *</Label>
             {quals.map((q, i) => (
               <div key={`q-${i}`} className="p-4 bg-dark-800/40 rounded-xl border border-white/5 space-y-3">
                 <div className="flex justify-between"><p className="text-[10px] text-white/40 uppercase">Degree {i+1}</p> {quals.length>1 && <Trash2 size={13} className="text-red-400 cursor-pointer" onClick={() => setQuals(p => p.filter((_,j)=>j!==i))} />}</div>
                 <div className="grid grid-cols-2 gap-2">
                    <Input value={q.degree} onChange={e => setQuals(p => p.map((x,j) => j===i ? {...x,degree:e.target.value}:x))} placeholder="MBBS" />
                    <Input type="number" value={q.year} onChange={e => setQuals(p => p.map((x,j) => j===i ? {...x,year:e.target.value}:x))} placeholder="Year (2018)" />
                 </div>
                 <Input value={q.institute} onChange={e => setQuals(p => p.map((x,j) => j===i ? {...x,institute:e.target.value}:x))} placeholder="Institute (AIIMS)" />
               </div>
             ))}
             <button type="button" onClick={() => setQuals(p => [...p, {degree:'',institute:'',year:''}])} className="w-full text-xs py-2 text-primary-400 border border-primary-500/30 border-dashed rounded-lg">+ Add Another Degree</button>
          </div>

          <hr className="border-white/5" />

          {/* Certs & Awards */}
          <div className="space-y-3">
             <Label>Certifications (Optional)</Label>
             {certs.map((c, i) => (
               <div key={`c-${i}`} className="p-4 bg-dark-800/40 rounded-xl border border-white/5 space-y-3">
                 <div className="flex justify-between"><p className="text-[10px] text-white/40 uppercase">Cert {i+1}</p> <Trash2 size={13} className="text-red-400 cursor-pointer" onClick={() => setCerts(p => p.filter((_,j)=>j!==i))} /></div>
                 <Input value={c.title} onChange={e => setCerts(p => p.map((x,j) => j===i ? {...x,title:e.target.value}:x))} placeholder="Title (ACLS)" />
                 <div className="grid grid-cols-2 gap-2">
                    <Input value={c.issuedBy} onChange={e => setCerts(p => p.map((x,j) => j===i ? {...x,issuedBy:e.target.value}:x))} placeholder="Issued By" />
                    <Input type="number" value={c.year} onChange={e => setCerts(p => p.map((x,j) => j===i ? {...x,year:e.target.value}:x))} placeholder="Year" />
                 </div>
               </div>
             ))}
             <button type="button" onClick={() => setCerts(p => [...p, {title:'',issuedBy:'',year:''}])} className="w-full text-xs py-2 text-white/40 hover:text-white border border-white/10 border-dashed rounded-lg">+ Add Certification</button>
          </div>

        </div>
      );

      case 'documents': return (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Experience */}
          <div className="space-y-3">
             <Label>Clinical Experience Details (Optional)</Label>
             {experienceList.map((exp, i) => (
               <div key={`e-${i}`} className="p-4 bg-dark-800/40 rounded-xl border border-white/5 space-y-3">
                 <div className="flex justify-between"><p className="text-[10px] text-white/40 uppercase">Exp {i+1}</p> <Trash2 size={13} className="text-red-400 cursor-pointer" onClick={() => setExperienceList(p => p.filter((_,j)=>j!==i))} /></div>
                 <Input value={exp.hospital} onChange={e => setExperienceList(p => p.map((x,j) => j===i ? {...x,hospital:e.target.value}:x))} placeholder="Hospital Name" />
                 <div className="grid grid-cols-2 gap-2">
                    <Input value={exp.role} onChange={e => setExperienceList(p => p.map((x,j) => j===i ? {...x,role:e.target.value}:x))} placeholder="Role (Consultant)" />
                    <Input type="number" value={exp.years} onChange={e => setExperienceList(p => p.map((x,j) => j===i ? {...x,years:e.target.value}:x))} placeholder="Years worked" />
                 </div>
               </div>
             ))}
             <button type="button" onClick={() => setExperienceList(p => [...p, {hospital:'',role:'',years:''}])} className="w-full text-xs py-2 text-primary-400 border border-primary-500/30 border-dashed rounded-lg">+ Add Experience Form</button>
          </div>

          <hr className="border-white/5" />

          {/* Docs */}
          <div>
            <Label>Verification Documents (Images/PDFs)</Label>
            <p className="text-xs text-white/30 mb-4">Required to authenticate your medical credentials securely.</p>
            <div className="space-y-4">
               {[
                 { key: 'medical_license', label: 'Medical License *', mult: false },
                 { key: 'id_proof', label: 'ID Proof (Aadhar/Passport) *', mult: false },
                 { key: 'degree_certificate', label: 'Degree Certificates (Max 5)', mult: true },
                 { key: 'experience_certificate', label: 'Experience Certs (Max 5)', mult: true },
                 { key: 'other', label: 'Other Pertinent Docs (Max 10)', mult: true },
               ].map((d) => (
                 <div key={d.key} className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-semibold text-white/70">{d.label}</span>
                       <label className="text-[10px] bg-primary-500/20 text-primary-400 px-2 py-1 rounded cursor-pointer hover:bg-primary-500/30">
                          Upload
                          <input type="file" multiple={d.mult} accept="image/*,.pdf" className="sr-only" onChange={(e) => handleFileChange(e, d.key, d.mult)} />
                       </label>
                    </div>
                    {/* Render existing files */}
                    <div className="space-y-1">
                      {!d.mult && docs[d.key] && (
                        <div className="text-[11px] flex items-center justify-between bg-dark-900/50 p-1.5 rounded text-emerald-400">
                           <span className="truncate">{docs[d.key].name}</span>
                           <X size={12} className="cursor-pointer text-white/40 hover:text-red-400 shrink-0" onClick={() => removeFile(d.key)} />
                        </div>
                      )}
                      {d.mult && docs[d.key].map((f, i) => (
                        <div key={i} className="text-[11px] flex items-center justify-between bg-dark-900/50 p-1.5 rounded text-emerald-400">
                           <span className="truncate">{f.name}</span>
                           <X size={12} className="cursor-pointer text-white/40 hover:text-red-400 shrink-0" onClick={() => removeFile(d.key, i)} />
                        </div>
                      ))}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      );

      case 'availability': return (
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="grid grid-cols-3 gap-3">
             <div className="col-span-1"><Label>Start Time</Label><Input type="time" value={avail.startTime} onChange={e => setAvail(p => ({...p, startTime: e.target.value}))} /></div>
             <div className="col-span-1"><Label>End Time</Label><Input type="time" value={avail.endTime} onChange={e => setAvail(p => ({...p, endTime: e.target.value}))} /></div>
             <div className="col-span-1"><Label>Slot (mins)</Label><Input type="number" value={avail.slotDuration} onChange={e => setAvail(p => ({...p, slotDuration: e.target.value}))} /></div>
          </div>

          <div>
            <Label>Working Days</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(d => (
                <button key={d} type="button" onClick={() => {
                   setAvail(p => ({...p, availableDays: p.availableDays.includes(d) ? p.availableDays.filter(x => x!==d) : [...p.availableDays, d] }));
                }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    avail.availableDays.includes(d) ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                  }`}>{d.slice(0,3)}</button>
              ))}
            </div>
          </div>

          <hr className="border-white/5" />
          
          <div>
            <Label>Clinic Details</Label>
            <div className="space-y-3 mb-4">
               <Input value={clinic.clinicName} onChange={e => setClinic(p => ({...p, clinicName: e.target.value}))} placeholder="Clinic Name (e.g. City Heart Clinic) *" />
               <Input value={clinic.addressLine} onChange={e => setClinic(p => ({...p, addressLine: e.target.value}))} placeholder="Address Line *" />
               <div className="grid grid-cols-[1fr_1fr_80px] gap-2">
                 <Input value={clinic.city} onChange={e => setClinic(p => ({...p, city: e.target.value}))} placeholder="City *" />
                 <Input value={clinic.state} onChange={e => setClinic(p => ({...p, state: e.target.value}))} placeholder="State *" />
                 <Input value={clinic.pincode} onChange={e => setClinic(p => ({...p, pincode: e.target.value}))} placeholder="PIN *" />
               </div>
            </div>
          </div>

          <div>
             <div className="flex items-center justify-between mb-2">
                <div>
                   <Label>Pin Map Location *</Label>
                   {geocoding && <span className="text-[10px] text-primary-400 animate-pulse ml-2">Fetching address...</span>}
                </div>
                <div className="flex items-center gap-3">
                   <label className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setAutoFill(!autoFill)}>
                      <div className={`w-6 h-3.5 rounded-full relative transition-colors ${autoFill ? 'bg-primary-500' : 'bg-white/10'}`}>
                         <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${autoFill ? 'translate-x-2.5' : ''}`} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-white/40 group-hover:text-white/60">Auto-fill config</span>
                   </label>
                   <button type="button" onClick={handleLiveLocation} disabled={geoLoading}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white/70 transition-colors disabled:opacity-50">
                      {geoLoading ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} className="text-primary-400" />}
                      Use My Location
                   </button>
                </div>
             </div>
             
             <MapPicker lat={clinic.latitude} lng={clinic.longitude} onChange={handleMapPin} />
          </div>

        </div>
      );

      case 'done': return (
        <div className="text-center space-y-6 py-4">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto animate-bounce-slow">
            <Check size={36} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Profile Submitted!</h2>
            <p className="text-white/50 mt-2 text-sm">Your massive multi-part onboarding dataset has been securely saved.</p>
          </div>
          <button onClick={() => navigate('/doctor/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-cyan text-white rounded-xl font-semibold text-sm shadow-glow-primary hover:opacity-90 transition-opacity">
            Go To Dashboard →
          </button>
        </div>
      );

      default: return null;
    }
  };

  const isFinalStep  = current.id === 'availability';
  const canNext = () => {
    if (current.id === 'professional') return prof.specialization && prof.totalExperience && prof.consultationFee;
    if (current.id === 'qualifications') return quals[0].degree && quals[0].institute && quals[0].year;
    return true;
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative">

        {current.id !== 'done' && (
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-shrink-0">
              <Ring step={step} total={totalSteps - 1} />
              <div className="absolute inset-0 flex items-center justify-center rotate-90">
                <span className="text-xs font-bold text-white">{step}/{totalSteps - 2}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex gap-1 mb-2">
                {STEPS.slice(1, -1).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i < step ? 'bg-primary-500' : i === step - 1 ? 'bg-primary-500/60' : 'bg-white/10'
                  }`} />
                ))}
              </div>
              <p className="text-xs text-white/40">Step {step} of {totalSteps - 2}</p>
            </div>
          </div>
        )}

        <div className="glass rounded-2xl p-7 shadow-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
              <current.icon size={18} className="text-primary-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">{current.title}</h2>
              <p className="text-[11px] text-white/40 mt-0.5">{current.desc}</p>
            </div>
          </div>

          <div key={step} className="animate-fade-in">
            {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-start gap-2"><AlertCircle size={14} className="mt-0.5 shrink-0"/> {error}</div>}
            {renderStep()}
          </div>

          {current.id !== 'done' && (
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
              <button onClick={() => step > 0 ? go(-1) : navigate('/doctor/dashboard')} className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white transition-colors text-sm">
                <ChevronLeft size={16} /> {step === 0 ? 'Skip for now' : 'Back'}
              </button>

              {isFinalStep ? (
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-cyan text-white rounded-xl font-semibold text-sm shadow-glow-primary hover:opacity-90 disabled:opacity-60">
                  {saving ? <><Loader2 size={14} className="animate-spin" />Submitting…</> : <><Check size={14} />Submit Profile</>}
                </button>
              ) : (
                <button onClick={() => go(1)} disabled={!canNext()} className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm shadow-glow-primary transition-all disabled:opacity-40">
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorOnboarding;
