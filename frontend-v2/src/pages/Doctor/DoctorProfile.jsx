import { useState, useEffect, useCallback } from 'react';
import {
  Stethoscope, Save, Loader2, Camera, MapPin, Building2,
  IndianRupee, Briefcase, Pencil, X, Shield, FileText, Clock,
  Trash2, Globe, Heart, GraduationCap, Navigation, Award,
  CheckCircle, AlertTriangle, Star, Calendar, BookOpen, Activity
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { doctorApi } from '../../api/axios';
import { useApp } from '../../context/AppContext';
import ProfilePhotoModal from '../../components/doctor/ProfilePhotoModal';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

/* ── Reverse Geocode ── */
const reverseGeocode = async (lat, lng) => {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { 'Accept-Language': 'en' } });
    const d = await r.json();
    const a = d.address || {};
    const city = a.city || a.town || a.village || a.city_district || '';
    const lineParts = [a.road, a.neighbourhood || a.suburb].filter(Boolean);
    return { addressLine: lineParts.join(', ') || d.display_name?.split(',')[0] || '', city, state: a.state || '', pincode: a.postcode || '' };
  } catch { return {}; }
};

/* ── FlyTo helper ── */
const FlyTo = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => { if (lat && lng) map.flyTo([lat, lng], 15, { duration: 1 }); }, [lat, lng, map]);
  return null;
};

/* ── Map Picker ── */
const MapPicker = ({ lat, lng, onChange }) => {
  const Handler = () => { useMapEvents({ click(e) { onChange(e.latlng.lat, e.latlng.lng); } }); return null; };
  return (
    <div className="h-56 rounded-xl overflow-hidden border border-white/10 relative z-0">
      <MapContainer center={[lat || 20.59, lng || 78.96]} zoom={lat ? 15 : 5} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {lat && lng && <Marker position={[lat, lng]} />}
        <FlyTo lat={lat} lng={lng} />
        <Handler />
      </MapContainer>
    </div>
  );
};

/* ── Small Reusable ── */
const Inp = (p) => <input {...p} className={`w-full bg-dark-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-500/50 transition-colors ${p.className||''}`} />;
const Sel = (p) => <select {...p} className={`w-full bg-dark-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors`}>{p.children}</select>;
const Lbl = ({ c }) => <p className="text-[10px] text-white/40 uppercase tracking-wide font-bold mb-1.5">{c}</p>;

const SectionCard = ({ icon: Icon, title, accent='primary', saving, onSave, editKey, activeEdit, setActiveEdit, children }) => {
  const isEditing = activeEdit === editKey;
  const colors = { primary: 'text-primary-400 border-primary-500/30 bg-primary-500/5', cyan: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5', amber: 'text-amber-400 border-amber-500/30 bg-amber-500/5', green: 'text-green-400 border-green-500/30 bg-green-500/5', purple: 'text-purple-400 border-purple-500/30 bg-purple-500/5' };
  const col = colors[accent] || colors.primary;
  return (
    <div className={`glass rounded-2xl border transition-all duration-300 ${isEditing ? `border-${accent === 'primary' ? 'primary' : accent}-500/40 shadow-lg` : 'border-white/5'}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${col.split(' ').slice(1).join(' ')}`}>
            <Icon size={15} className={col.split(' ')[0]} />
          </div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && onSave && (
            <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-bold shadow-glow-primary disabled:opacity-60 transition-all">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
            </button>
          )}
          <button onClick={() => setActiveEdit(isEditing ? null : editKey)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isEditing ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}>
            {isEditing ? <><X size={11}/> Done</> : <><Pencil size={11}/> Edit</>}
          </button>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

/* ── Tag Chip ── */
const Tag = ({ label, onRemove, color = 'bg-white/5 text-white/70' }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${color}`}>
    {label} {onRemove && <X size={10} className="cursor-pointer hover:text-red-400 ml-0.5" onClick={onRemove} />}
  </span>
);

/* ── Status Badge ── */
const VerBadge = ({ status }) => {
  const map = { pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20', approved: 'bg-green-500/10 text-green-400 border-green-500/20', rejected: 'bg-red-500/10 text-red-400 border-red-500/20', verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${map[status] || map.pending}`}>{status}</span>;
};

/* ══════════════════════════════════════════════════════════ */
const DoctorProfile = () => {
  const { user } = useApp();
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeEdit, setActiveEdit] = useState(null);
  const [sectionSaving, setSectionSaving] = useState({});
  const [sectionError, setSectionError] = useState({});
  const [isBookingEnabled, setIsBookingEnabled] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  /* ── Section States ── */
  const [basic, setBasic] = useState({ specialization: '', totalExperience: '', consultationFee: '', employmentType: 'independent', consultationMode: 'both', bio: '' });
  const [quals, setQuals] = useState([]);
  const [certs, setCerts] = useState([]);
  const [awards, setAwards] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [services, setServices] = useState([]);
  const [avail, setAvail] = useState({ availableDays: [], startTime: '', endTime: '', slotDuration: 30 });
  const [clinic, setClinic] = useState({ clinicName: '', addressLine: '', city: '', state: '', pincode: '', latitude: null, longitude: null });
  const [documents, setDocuments] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [profileDates, setProfileDates] = useState({ createdAt: '', updatedAt: '' });

  // Map controls
  const [geocoding, setGeocoding] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [autoFill, setAutoFill] = useState(true);

  // Tag inputs
  const [langInput, setLangInput] = useState('');
  const [servInput, setServInput] = useState('');

  // File inputs for doc upload
  const [newDocs, setNewDocs] = useState({ medical_license: null, degree_certificate: [], id_proof: null, experience_certificate: [], other: [] });

  /* ── Fetch ── */
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await doctorApi.getProfile();
      const p = data.profile || {};
      setBasic({ specialization: p.specialization||'', totalExperience: p.totalExperience||'', consultationFee: p.consultationFee||'', employmentType: p.employmentType||'independent', consultationMode: p.consultationMode||'both', bio: p.bio||'' });
      setQuals(p.qualifications || []);
      setCerts(p.certifications || []);
      setAwards(p.awards || []);
      setExperienceList(p.experienceDetails || []);
      setLanguages(p.languages || []);
      setServices(p.servicesOffered || []);
      setAvail({ availableDays: p.availableDays||[], startTime: p.availability?.startTime||'', endTime: p.availability?.endTime||'', slotDuration: p.availability?.slotDuration||30 });
      const loc = p.clinicLocation || {};
      setClinic({ clinicName: loc.clinicName||'', addressLine: loc.addressLine||'', city: loc.city||'', state: loc.state||'', pincode: loc.pincode||'', latitude: loc.latitude||null, longitude: loc.longitude||null });
      setDocuments(p.documents || []);
      setVerificationStatus(p.verificationStatus || 'pending');
      setIsBookingEnabled(p.isBookingEnabled ?? false);
      setProfileDates({ createdAt: p.profileCreatedAt || '', updatedAt: p.lastUpdatedAt || '' });
      if (p.profilePhoto) setProfilePhoto(p.profilePhoto);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  /* ── Section Save Helper ── */
  const sectionSave = async (key, buildFd) => {
    setSectionSaving(p => ({ ...p, [key]: true }));
    setSectionError(p => ({ ...p, [key]: '' }));
    try {
      const fd = buildFd();
      await doctorApi.updateProfile(fd);
      await fetchProfile();
      setActiveEdit(null);
    } catch (err) {
      setSectionError(p => ({ ...p, [key]: err?.response?.data?.message || 'Save failed.' }));
    } finally { setSectionSaving(p => ({ ...p, [key]: false })); }
  };

  /* ── Map Handlers ── */
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
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      setClinic(p => ({ ...p, latitude, longitude }));
      setGeoLoading(false);
      if (!autoFill) return;
      setGeocoding(true);
      const geo = await reverseGeocode(latitude, longitude);
      setClinic(p => ({ ...p, ...geo }));
      setGeocoding(false);
    }, () => setGeoLoading(false));
  }, [autoFill]);

  /* ── Booking Toggle ── */
  const handleBookingToggle = async () => {
    setBookingLoading(true);
    try {
      const next = !isBookingEnabled;
      const r = await doctorApi.toggleBooking(next);
      setIsBookingEnabled(r.data.bookingEnabled ?? next);
    } catch (e) { /* ignore */ } finally { setBookingLoading(false); }
  };

  /* ── Tag helpers ── */
  const addTag = (type, val) => {
    if (!val.trim()) return;
    if (type === 'lang' && !languages.includes(val.trim())) setLanguages(p => [...p, val.trim()]);
    if (type === 'serv' && !services.includes(val.trim())) setServices(p => [...p, val.trim()]);
    type === 'lang' ? setLangInput('') : setServInput('');
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 size={32} className="animate-spin text-primary-500" /></div>;

  /* ── Formatters ── */
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
  const docTypeLabel = { medical_license: 'Medical License', degree_certificate: 'Degree Certificate', id_proof: 'ID Proof', experience_certificate: 'Experience Certificate', other: 'Other' };

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in pb-16">
      {showPhotoModal && <ProfilePhotoModal onClose={() => setShowPhotoModal(false)} onSuccess={(url) => setProfilePhoto(url)} />}

      {/* ── Hero ── */}
      <div className="glass rounded-3xl p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 via-transparent to-accent-cyan/5 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          {/* Left: Identity */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {profilePhoto
                ? <img src={profilePhoto} className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-xl" />
                : <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-3xl font-bold text-white">{user?.Name?.[0] || 'D'}</div>}
              <button onClick={() => setShowPhotoModal(true)} className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary-600 hover:bg-primary-500 rounded-lg flex items-center justify-center shadow-glow-primary transition-colors">
                <Camera size={12} className="text-white" />
              </button>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dr. {user?.Name || 'Doctor'}</h1>
              <p className="text-accent-cyan text-sm font-semibold mt-0.5">{basic.specialization || 'Specialist'}</p>
              <p className="text-white/40 text-xs mt-1 max-w-xs line-clamp-2">{basic.bio || 'No bio yet.'}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <VerBadge status={verificationStatus} />
                {basic.totalExperience && <span className="text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full"><Briefcase size={9} className="inline mr-1" />{basic.totalExperience} yrs</span>}
                {basic.consultationFee && <span className="text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full"><IndianRupee size={9} className="inline mr-1" />₹{basic.consultationFee}</span>}
                {clinic.city && <span className="text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full"><MapPin size={9} className="inline mr-1" />{clinic.city}</span>}
              </div>
            </div>
          </div>

          {/* Right: Booking + Stats */}
          <div className="flex flex-col items-end gap-3">
            <button onClick={handleBookingToggle} disabled={bookingLoading} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${isBookingEnabled ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'}`}>
              {bookingLoading ? <Loader2 size={13} className="animate-spin" /> : <span className={`w-2 h-2 rounded-full ${isBookingEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />}
              {isBookingEnabled ? 'Accepting Patients' : 'Not Accepting'}
            </button>
            <div className="flex items-center gap-4 text-right">
              <div><p className="text-[10px] text-white/30 uppercase font-bold">Joined</p><p className="text-xs text-white/60">{fmtDate(profileDates.createdAt)}</p></div>
              <div><p className="text-[10px] text-white/30 uppercase font-bold">Updated</p><p className="text-xs text-white/60">{fmtDate(profileDates.updatedAt)}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Main column */}
        <div className="lg:col-span-2 space-y-5">

          {/* ── 1. Basic Info ── */}
          <SectionCard icon={Stethoscope} title="Basic Information" accent="primary" saving={sectionSaving.basic} editKey="basic" activeEdit={activeEdit} setActiveEdit={setActiveEdit}
            onSave={() => sectionSave('basic', () => {
              const fd = new FormData();
              Object.entries(basic).forEach(([k, v]) => fd.append(k, v));
              return fd;
            })}>
            {sectionError.basic && <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><AlertTriangle size={12}/>{sectionError.basic}</p>}
            {activeEdit === 'basic' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Lbl c="Specialization" /><Inp value={basic.specialization} onChange={e=>setBasic(p=>({...p,specialization:e.target.value}))} placeholder="e.g. Cardiologist" /></div>
                  <div><Lbl c="Total Experience (Yrs)" /><Inp type="number" value={basic.totalExperience} onChange={e=>setBasic(p=>({...p,totalExperience:e.target.value}))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Lbl c="Consultation Fee (₹)" /><Inp type="number" value={basic.consultationFee} onChange={e=>setBasic(p=>({...p,consultationFee:e.target.value}))} /></div>
                  <div><Lbl c="Employment Type" />
                    <Sel value={basic.employmentType} onChange={e=>setBasic(p=>({...p,employmentType:e.target.value}))}>
                      <option value="independent">Independent</option>
                      <option value="hospital_fulltime">Hospital Full-time</option>
                      <option value="hospital_visiting">Hospital Visiting</option>
                      <option value="consultant">Consultant</option>
                    </Sel>
                  </div>
                </div>
                <div><Lbl c="Consultation Mode" />
                  <Sel value={basic.consultationMode} onChange={e=>setBasic(p=>({...p,consultationMode:e.target.value}))}>
                    <option value="online">Online</option><option value="offline">Offline</option><option value="both">Both</option>
                  </Sel>
                </div>
                <div><Lbl c="Bio" /><textarea value={basic.bio} onChange={e=>setBasic(p=>({...p,bio:e.target.value}))} rows={3} placeholder="Short professional bio..." className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-primary-500/50" /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[['Specialization', basic.specialization], ['Experience', basic.totalExperience ? `${basic.totalExperience} years` : ''], ['Fee', basic.consultationFee ? `₹${basic.consultationFee}` : ''], ['Mode', basic.consultationMode], ['Employment', basic.employmentType?.replace('_', ' ')]].map(([l,v]) => (
                  <div key={l} className="bg-white/3 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase font-bold mb-1">{l}</p>
                    <p className="text-sm text-white font-medium capitalize">{v || <span className="text-white/20 italic text-xs">Not set</span>}</p>
                  </div>
                ))}
                {basic.bio && <div className="col-span-2 bg-white/3 rounded-xl p-3 border border-white/5"><p className="text-[10px] text-white/30 uppercase font-bold mb-1">Bio</p><p className="text-sm text-white/80">{basic.bio}</p></div>}
              </div>
            )}
          </SectionCard>

          {/* ── 2. Languages & Services ── */}
          <SectionCard icon={Globe} title="Languages & Services" accent="cyan" saving={sectionSaving.langserv} editKey="langserv" activeEdit={activeEdit} setActiveEdit={setActiveEdit}
            onSave={() => sectionSave('langserv', () => {
              const fd = new FormData();
              fd.append('languages', JSON.stringify(languages));
              fd.append('servicesOffered', JSON.stringify(services));
              return fd;
            })}>
            {sectionError.langserv && <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><AlertTriangle size={12}/>{sectionError.langserv}</p>}
            {activeEdit === 'langserv' ? (
              <div className="space-y-4">
                <div>
                  <Lbl c="Languages" />
                  <div className="flex gap-2 mb-2">
                    <Inp value={langInput} onChange={e=>setLangInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTag('lang',langInput)} placeholder="Type language & press Enter" />
                    <button onClick={()=>addTag('lang',langInput)} className="px-3 py-2 bg-primary-500/20 text-primary-400 rounded-lg text-xs font-bold hover:bg-primary-500/30">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">{languages.map(l=><Tag key={l} label={l} onRemove={()=>setLanguages(p=>p.filter(x=>x!==l))} />)}</div>
                </div>
                <div>
                  <Lbl c="Services Offered" />
                  <div className="flex gap-2 mb-2">
                    <Inp value={servInput} onChange={e=>setServInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTag('serv',servInput)} placeholder="Type service & press Enter" />
                    <button onClick={()=>addTag('serv',servInput)} className="px-3 py-2 bg-accent-cyan/20 text-accent-cyan rounded-lg text-xs font-bold hover:bg-accent-cyan/30">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">{services.map(s=><Tag key={s} label={s} onRemove={()=>setServices(p=>p.filter(x=>x!==s))} color="bg-accent-cyan/10 text-accent-cyan" />)}</div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div><Lbl c="Languages" /><div className="flex flex-wrap gap-2">{languages.length ? languages.map(l=><Tag key={l} label={l} />) : <span className="text-white/20 text-xs italic">None added</span>}</div></div>
                <div><Lbl c="Services" /><div className="flex flex-wrap gap-2">{services.length ? services.map(s=><Tag key={s} label={s} color="bg-accent-cyan/10 text-accent-cyan" />) : <span className="text-white/20 text-xs italic">None added</span>}</div></div>
              </div>
            )}
          </SectionCard>

          {/* ── 3. Qualifications & Certifications ── */}
          <SectionCard icon={GraduationCap} title="Qualifications & Certifications" accent="purple" saving={sectionSaving.quals} editKey="quals" activeEdit={activeEdit} setActiveEdit={setActiveEdit}
            onSave={() => sectionSave('quals', () => {
              const fd = new FormData();
              fd.append('qualifications', JSON.stringify(quals));
              fd.append('certifications', JSON.stringify(certs));
              return fd;
            })}>
            {sectionError.quals && <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><AlertTriangle size={12}/>{sectionError.quals}</p>}
            {activeEdit === 'quals' ? (
              <div className="space-y-5">
                <div>
                  <Lbl c="Degrees / Qualifications" />
                  <div className="space-y-2 mb-2">
                    {quals.map((q,i) => (
                      <div key={i} className="p-3 bg-dark-800/50 rounded-xl border border-white/5 space-y-2 relative">
                        <button onClick={()=>setQuals(p=>p.filter((_,j)=>j!==i))} className="absolute top-2 right-2"><Trash2 size={12} className="text-red-500" /></button>
                        <Inp value={q.degree} onChange={e=>setQuals(p=>p.map((x,j)=>j===i?{...x,degree:e.target.value}:x))} placeholder="Degree (e.g. MBBS)" />
                        <div className="grid grid-cols-2 gap-2">
                          <Inp value={q.institute} onChange={e=>setQuals(p=>p.map((x,j)=>j===i?{...x,institute:e.target.value}:x))} placeholder="Institute" />
                          <Inp type="number" value={q.year} onChange={e=>setQuals(p=>p.map((x,j)=>j===i?{...x,year:e.target.value}:x))} placeholder="Year" />
                        </div>
                      </div>
                    ))}
                    <button onClick={()=>setQuals(p=>[...p,{degree:'',institute:'',year:''}])} className="w-full py-2 border border-dashed border-primary-500/30 text-primary-400 text-xs rounded-xl hover:bg-primary-500/5">+ Add Degree</button>
                  </div>
                </div>
                <div>
                  <Lbl c="Certifications" />
                  <div className="space-y-2 mb-2">
                    {certs.map((c,i) => (
                      <div key={i} className="p-3 bg-dark-800/50 rounded-xl border border-white/5 space-y-2 relative">
                        <button onClick={()=>setCerts(p=>p.filter((_,j)=>j!==i))} className="absolute top-2 right-2"><Trash2 size={12} className="text-red-500" /></button>
                        <Inp value={c.title} onChange={e=>setCerts(p=>p.map((x,j)=>j===i?{...x,title:e.target.value}:x))} placeholder="Certification Title" />
                        <div className="grid grid-cols-2 gap-2">
                          <Inp value={c.issuedBy} onChange={e=>setCerts(p=>p.map((x,j)=>j===i?{...x,issuedBy:e.target.value}:x))} placeholder="Issued By" />
                          <Inp type="number" value={c.year} onChange={e=>setCerts(p=>p.map((x,j)=>j===i?{...x,year:e.target.value}:x))} placeholder="Year" />
                        </div>
                      </div>
                    ))}
                    <button onClick={()=>setCerts(p=>[...p,{title:'',issuedBy:'',year:''}])} className="w-full py-2 border border-dashed border-purple-500/30 text-purple-400 text-xs rounded-xl hover:bg-purple-500/5">+ Add Certification</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {quals.length > 0 && <div className="space-y-2">{quals.map((q,i)=><div key={i} className="flex gap-3 p-3 bg-white/3 rounded-xl border border-white/5"><div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0"><GraduationCap size={14} className="text-purple-400"/></div><div><p className="text-sm font-bold text-white">{q.degree}</p><p className="text-xs text-white/40">{q.institute}{q.year ? ` · ${q.year}` : ''}</p></div></div>)}</div>}
                {certs.length > 0 && <div className="space-y-2">{certs.map((c,i)=><div key={i} className="flex gap-3 p-3 bg-white/3 rounded-xl border border-white/5"><div className="w-8 h-8 rounded-full bg-accent-cyan/20 flex items-center justify-center shrink-0"><BookOpen size={14} className="text-accent-cyan"/></div><div><p className="text-sm font-bold text-white">{c.title}</p><p className="text-xs text-white/40">{c.issuedBy}{c.year ? ` · ${c.year}` : ''}</p></div></div>)}</div>}
                {!quals.length && !certs.length && <p className="text-white/20 text-xs italic">No qualifications or certifications added yet.</p>}
              </div>
            )}
          </SectionCard>

          {/* ── 4. Awards & Experience ── */}
          <SectionCard icon={Award} title="Awards & Work History" accent="amber" saving={sectionSaving.exp} editKey="exp" activeEdit={activeEdit} setActiveEdit={setActiveEdit}
            onSave={() => sectionSave('exp', () => {
              const fd = new FormData();
              fd.append('awards', JSON.stringify(awards));
              fd.append('experienceDetails', JSON.stringify(experienceList));
              return fd;
            })}>
            {sectionError.exp && <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><AlertTriangle size={12}/>{sectionError.exp}</p>}
            {activeEdit === 'exp' ? (
              <div className="space-y-5">
                <div>
                  <Lbl c="Awards & Recognitions" />
                  <div className="space-y-2 mb-2">
                    {awards.map((a,i) => (
                      <div key={i} className="flex gap-2 items-center p-3 bg-dark-800/50 rounded-xl border border-white/5 relative">
                        <button onClick={()=>setAwards(p=>p.filter((_,j)=>j!==i))} className="absolute top-2 right-2"><Trash2 size={12} className="text-red-500"/></button>
                        <Inp value={a.title} onChange={e=>setAwards(p=>p.map((x,j)=>j===i?{...x,title:e.target.value}:x))} placeholder="Award Title" className="flex-1" />
                        <Inp type="number" value={a.year} onChange={e=>setAwards(p=>p.map((x,j)=>j===i?{...x,year:e.target.value}:x))} placeholder="Year" className="w-24" />
                      </div>
                    ))}
                    <button onClick={()=>setAwards(p=>[...p,{title:'',year:''}])} className="w-full py-2 border border-dashed border-amber-500/30 text-amber-400 text-xs rounded-xl hover:bg-amber-500/5">+ Add Award</button>
                  </div>
                </div>
                <div>
                  <Lbl c="Work Experience" />
                  <div className="space-y-2 mb-2">
                    {experienceList.map((e,i) => (
                      <div key={i} className="p-3 bg-dark-800/50 rounded-xl border border-white/5 space-y-2 relative">
                        <button onClick={()=>setExperienceList(p=>p.filter((_,j)=>j!==i))} className="absolute top-2 right-2"><Trash2 size={12} className="text-red-500"/></button>
                        <Inp value={e.hospital} onChange={ev=>setExperienceList(p=>p.map((x,j)=>j===i?{...x,hospital:ev.target.value}:x))} placeholder="Hospital / Clinic Name" />
                        <div className="grid grid-cols-2 gap-2">
                          <Inp value={e.role} onChange={ev=>setExperienceList(p=>p.map((x,j)=>j===i?{...x,role:ev.target.value}:x))} placeholder="Role" />
                          <Inp type="number" value={e.years} onChange={ev=>setExperienceList(p=>p.map((x,j)=>j===i?{...x,years:ev.target.value}:x))} placeholder="Years" />
                        </div>
                      </div>
                    ))}
                    <button onClick={()=>setExperienceList(p=>[...p,{hospital:'',role:'',years:''}])} className="w-full py-2 border border-dashed border-amber-500/30 text-amber-400 text-xs rounded-xl hover:bg-amber-500/5">+ Add Experience</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {awards.length > 0 && <div className="grid grid-cols-2 gap-2">{awards.map((a,i)=><div key={i} className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl"><p className="text-sm font-bold text-amber-400">{a.title}</p><p className="text-[10px] text-white/40 mt-0.5">{a.year}</p></div>)}</div>}
                {experienceList.length > 0 && <div className="space-y-2">{experienceList.map((e,i)=><div key={i} className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5"><div><p className="text-sm font-bold text-white">{e.hospital}</p><p className="text-xs text-accent-cyan mt-0.5">{e.role}</p></div><span className="text-xs font-bold px-2 py-1 bg-primary-500/10 text-primary-400 rounded-lg">{e.years}y</span></div>)}</div>}
                {!awards.length && !experienceList.length && <p className="text-white/20 text-xs italic">No awards or experience added yet.</p>}
              </div>
            )}
          </SectionCard>

        </div>

        {/* ── Side column ── */}
        <div className="space-y-5">

          {/* ── 5. Schedule ── */}
          <SectionCard icon={Clock} title="Schedule" accent="green" saving={sectionSaving.avail} editKey="avail" activeEdit={activeEdit} setActiveEdit={setActiveEdit}
            onSave={() => sectionSave('avail', () => {
              const fd = new FormData();
              fd.append('availableDays', JSON.stringify(avail.availableDays));
              fd.append('availability', JSON.stringify({ startTime: avail.startTime, endTime: avail.endTime, slotDuration: Number(avail.slotDuration) }));
              return fd;
            })}>
            {sectionError.avail && <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><AlertTriangle size={12}/>{sectionError.avail}</p>}
            {activeEdit === 'avail' ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map(d => <button key={d} type="button" onClick={()=>setAvail(p=>({...p, availableDays: p.availableDays.includes(d)?p.availableDays.filter(x=>x!==d):[...p.availableDays,d]}))} className={`px-2 py-1 rounded text-[11px] font-bold border transition-all ${avail.availableDays.includes(d)?'bg-green-500/20 text-green-400 border-green-500/40':'bg-white/5 text-white/30 border-white/10 hover:border-white/20'}`}>{d.slice(0,3)}</button>)}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div><Lbl c="Start" /><Inp type="time" value={avail.startTime} onChange={e=>setAvail(p=>({...p,startTime:e.target.value}))} /></div>
                  <div><Lbl c="End" /><Inp type="time" value={avail.endTime} onChange={e=>setAvail(p=>({...p,endTime:e.target.value}))} /></div>
                  <div><Lbl c="Slot (m)" /><Inp type="number" value={avail.slotDuration} onChange={e=>setAvail(p=>({...p,slotDuration:e.target.value}))} /></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">{DAYS.map(d=><span key={d} className={`px-2 py-1 rounded text-[10px] font-bold ${avail.availableDays.includes(d)?'bg-green-500/15 text-green-400':'bg-white/3 text-white/20'}`}>{d.slice(0,3)}</span>)}</div>
                <div className="flex items-center justify-between bg-white/3 rounded-xl p-3 border border-white/5">
                  <div><p className="text-[10px] text-white/30 font-bold uppercase">Hours</p><p className="text-sm font-bold text-white mt-0.5">{avail.startTime||'--'} – {avail.endTime||'--'}</p></div>
                  <div className="text-right"><p className="text-[10px] text-white/30 font-bold uppercase">Slot</p><p className="text-sm font-bold text-green-400 mt-0.5">{avail.slotDuration}m</p></div>
                </div>
              </div>
            )}
          </SectionCard>

          {/* ── 6. Clinic Location ── */}
          <SectionCard icon={MapPin} title="Clinic Location" accent="primary" saving={sectionSaving.clinic} editKey="clinic" activeEdit={activeEdit} setActiveEdit={setActiveEdit}
            onSave={() => sectionSave('clinic', () => {
              const fd = new FormData();
              fd.append('clinicLocation', JSON.stringify({ ...clinic, latitude: Number(clinic.latitude), longitude: Number(clinic.longitude) }));
              return fd;
            })}>
            {sectionError.clinic && <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><AlertTriangle size={12}/>{sectionError.clinic}</p>}
            {activeEdit === 'clinic' ? (
              <div className="space-y-3">
                <Inp value={clinic.clinicName} onChange={e=>setClinic(p=>({...p,clinicName:e.target.value}))} placeholder="Clinic Name" />
                <Inp value={clinic.addressLine} onChange={e=>setClinic(p=>({...p,addressLine:e.target.value}))} placeholder="Address Line" />
                <div className="grid grid-cols-[1fr_1fr_70px] gap-2">
                  <Inp value={clinic.city} onChange={e=>setClinic(p=>({...p,city:e.target.value}))} placeholder="City" />
                  <Inp value={clinic.state} onChange={e=>setClinic(p=>({...p,state:e.target.value}))} placeholder="State" />
                  <Inp value={clinic.pincode} onChange={e=>setClinic(p=>({...p,pincode:e.target.value}))} placeholder="PIN" />
                </div>
                {/* Map Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                    {geocoding && <><Loader2 size={10} className="animate-spin text-primary-400"/><span className="text-primary-400">Detecting address…</span></>}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer" onClick={()=>setAutoFill(!autoFill)}>
                      <div className={`w-6 h-3.5 rounded-full relative transition-colors ${autoFill?'bg-primary-500':'bg-white/10'}`}><div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all ${autoFill?'translate-x-2.5':''}`}/></div>
                      <span className="text-[10px] text-white/40 font-bold uppercase">Auto-fill</span>
                    </label>
                    <button type="button" onClick={handleLiveLocation} disabled={geoLoading} className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] text-white/70 font-bold disabled:opacity-50">
                      {geoLoading ? <Loader2 size={11} className="animate-spin"/> : <Navigation size={11} className="text-primary-400"/>} Live Location
                    </button>
                  </div>
                </div>
                <MapPicker lat={clinic.latitude} lng={clinic.longitude} onChange={handleMapPin} />
              </div>
            ) : (
              <div className="space-y-3">
                {clinic.clinicName && <p className="text-sm font-bold text-white">{clinic.clinicName}</p>}
                {(clinic.addressLine || clinic.city) && <p className="text-xs text-white/50 leading-relaxed">{clinic.addressLine}{clinic.city ? `, ${clinic.city}` : ''}{clinic.state ? `, ${clinic.state}` : ''} {clinic.pincode}</p>}
                {clinic.latitude && clinic.longitude && <MapPicker lat={clinic.latitude} lng={clinic.longitude} onChange={()=>{}} />}
                {!clinic.clinicName && !clinic.latitude && <p className="text-white/20 text-xs italic">No location set.</p>}
              </div>
            )}
          </SectionCard>

          {/* ── 7. Documents ── */}
          <SectionCard icon={Shield} title="Documents" accent="green" saving={sectionSaving.docs} editKey="docs" activeEdit={activeEdit} setActiveEdit={setActiveEdit}
            onSave={() => sectionSave('docs', () => {
              const fd = new FormData();
              if (newDocs.medical_license) fd.append('medical_license', newDocs.medical_license);
              if (newDocs.id_proof) fd.append('id_proof', newDocs.id_proof);
              newDocs.degree_certificate.forEach(f => fd.append('degree_certificate', f));
              newDocs.experience_certificate.forEach(f => fd.append('experience_certificate', f));
              newDocs.other.forEach(f => fd.append('other', f));
              return fd;
            })}>
            {sectionError.docs && <p className="text-red-400 text-xs mb-3 flex items-center gap-1"><AlertTriangle size={12}/>{sectionError.docs}</p>}
            {/* Existing documents */}
            <div className="space-y-2 mb-3">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white/3 border border-white/5 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={13} className="text-white/40 shrink-0"/>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{docTypeLabel[doc.documentType] || doc.documentType}</p>
                      <p className="text-[10px] text-white/30">{fmtDate(doc.uploadedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <VerBadge status={doc.verificationStatus} />
                    <a href={doc.documentUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary-400 hover:text-primary-300 font-bold">View</a>
                  </div>
                </div>
              ))}
              {!documents.length && <p className="text-white/20 text-xs italic">No documents uploaded yet.</p>}
            </div>
            {/* Upload new */}
            {activeEdit === 'docs' && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <p className="text-[10px] text-white/30 uppercase font-bold">Upload New / Replace</p>
                {[{key:'medical_license',label:'Medical License',mult:false},{key:'degree_certificate',label:'Degree Certificate',mult:true},{key:'id_proof',label:'ID Proof',mult:false},{key:'experience_certificate',label:'Experience Cert',mult:true}].map(d=>(
                  <div key={d.key} className="flex items-center justify-between p-2.5 bg-white/3 border border-white/8 rounded-xl">
                    <span className="text-xs text-white/60">{d.label}</span>
                    {((d.mult && newDocs[d.key].length > 0) || (!d.mult && newDocs[d.key])) ? (
                      <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded">{d.mult ? `${newDocs[d.key].length} file(s)` : 'Chosen'}</span>
                    ) : (
                      <label className="text-[10px] text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded cursor-pointer hover:bg-primary-500/20 font-bold">
                        Browse<input type="file" multiple={d.mult} accept="image/*,.pdf" className="sr-only" onChange={e=>{const f=Array.from(e.target.files);if(!f.length)return;d.mult?setNewDocs(p=>({...p,[d.key]:[...p[d.key],...f]})):setNewDocs(p=>({...p,[d.key]:f[0]}));}}/>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
