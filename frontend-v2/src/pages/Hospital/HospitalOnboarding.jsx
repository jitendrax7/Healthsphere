import { useState, useEffect, useCallback } from 'react';
import {
  Building2, MapPin, Phone, Mail, FileText,
  Upload, Check, Loader2, Clock, Globe, Hash,
  AlertCircle, Shield, X, Crosshair
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { hospitalApi } from '../../api/axios';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

/* ── Leaflet Icon Fix ─────────────────────────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ── Constants ────────────────────────────────────────────── */
const HOSPITAL_TYPES = [
  'government', 'private', 'ngo', 'trust', 'clinic'
];

const DOC_TYPES = [
  { key: 'registration_certificate', label: 'Hospital Registration Certificate', required: true },
  { key: 'government_license',       label: 'Government / Medical License',      required: true },
  { key: 'pan',                      label: 'PAN Card',                          required: true },
  { key: 'gst',                      label: 'GST Certificate',                   required: false },
  { key: 'fire_safety',              label: 'Fire Safety Certificate',           required: false },
  { key: 'pollution_certificate',    label: 'Pollution Control Certificate',     required: false },
  { key: 'nabh_certificate',         label: 'NABH Accreditation',                required: false },
  { key: 'other',                    label: 'Other Document',                    required: false },
];

/* ── Map Helpers ──────────────────────────────────────────── */
const reverseGeocode = async (lat, lng) => {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
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
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ height: 300 }}>
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
const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-white/70 mb-2">
    {children}{required && <span className="text-red-400 ml-1">*</span>}
  </label>
);

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />}
    <input {...props} className={`input-dark w-full ${Icon ? 'pl-10' : ''} ${props.className || ''}`} />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PHASE 1: PROFILE CREATION
   ═══════════════════════════════════════════════════════════ */
const Phase1ProfileCreation = () => {
  const { fetchHospitalStatus } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Map states
  const [autoFill, setAutoFill]     = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geocoding, setGeocoding]   = useState(false);

  const [form, setForm] = useState({
    hospitalName: '', registrationNumber: '', hospitalType: '', establishedYear: '', description: '',
    contactNumber: '', emergencyNumber: '', email: '', website: '',
    addressLine: '', city: '', state: '', pincode: '', latitude: null, longitude: null
  });

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

  const canSubmit = form.hospitalName && form.registrationNumber && form.hospitalType && form.description &&
                    form.contactNumber && form.email && form.addressLine && form.city && form.state &&
                    form.pincode && form.latitude && form.longitude;

  const handleSubmit = async () => {
    setError(''); setSubmitting(true);
    try {
      await hospitalApi.createProfile(form);
      // Fetches status, which should now return 'complete_profile' and trigger re-render to Phase 2
      await fetchHospitalStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Create Hospital Profile</h2>
        <p className="text-white/50 text-sm mt-1">Step 1 of 2: Basic details & location</p>
      </div>

      <div className="glass shadow-card-dark rounded-2xl p-6 md:p-8 space-y-6">
        {/* Basic Details */}
        <div>
          <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label required>Hospital / Organization Name</Label>
              <InputField icon={Building2} value={form.hospitalName} onChange={e => setForm({...form, hospitalName: e.target.value})} placeholder="e.g. City Care Hospital" />
            </div>

            <div>
              <Label required>Hospital Type</Label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {HOSPITAL_TYPES.map(type => (
                  <button key={type} onClick={() => setForm({...form, hospitalType: type})}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all capitalize ${
                      form.hospitalType === type ? 'bg-violet-500/20 border-violet-500 text-violet-300' : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/70'
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label required>Registration Number</Label>
                <InputField icon={Hash} value={form.registrationNumber} onChange={e => setForm({...form, registrationNumber: e.target.value})} placeholder="REG-123456" />
              </div>
              <div>
                <Label>Established Year</Label>
                <InputField icon={Clock} type="number" min="1800" max={new Date().getFullYear()} value={form.establishedYear} onChange={e => setForm({...form, establishedYear: e.target.value})} placeholder="YYYY" />
              </div>
            </div>

            <div>
              <Label required>About the Hospital</Label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} 
                placeholder="Briefly describe your facilities and specialties..." className="input-dark w-full resize-none" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="pt-6 border-t border-white/5">
          <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-4">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label required>Primary Contact Number</Label>
              <InputField icon={Phone} type="tel" value={form.contactNumber} onChange={e => setForm({...form, contactNumber: e.target.value})} placeholder="+91 98765 43210" />
            </div>
            <div>
              <Label>Emergency Number (Optional)</Label>
              <InputField icon={Phone} type="tel" value={form.emergencyNumber} onChange={e => setForm({...form, emergencyNumber: e.target.value})} placeholder="102 / Ambulance" />
            </div>
            <div>
              <Label required>Official Email</Label>
              <InputField icon={Mail} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="contact@hospital.com" />
            </div>
            <div>
              <Label>Website</Label>
              <InputField icon={Globe} type="url" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Location & Map */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider">Location Setup</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setAutoFill(!autoFill)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${autoFill ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'}`}>
                {autoFill ? <Check size={12} /> : <X size={12} />} Auto-fill Address
              </button>
              <button onClick={handleLiveLocation} disabled={geoLoading} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/20 rounded-lg text-xs font-medium transition-all">
                {geoLoading ? <Loader2 size={12} className="animate-spin" /> : <Crosshair size={12} />} My Location
              </button>
            </div>
          </div>

          <p className="text-xs text-secondary-300 flex items-center gap-1.5 mb-3">
            <MapPin size={12} className="text-violet-400" /> Click the map to pin your exact location {autoFill && '(address fields will auto-fill)'}. 
            {geocoding && <span className="text-green-400 italic ml-2">Detecting address...</span>}
          </p>

          <div className="mb-5">
            <MapPicker lat={form.latitude} lng={form.longitude} onChange={handleMapPin} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <Label required>Address Line</Label>
              <InputField icon={MapPin} value={form.addressLine} onChange={e => setForm({...form, addressLine: e.target.value})} placeholder="Street, Neighborhood" />
            </div>
            <div>
              <Label required>City</Label>
              <InputField value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="City" />
            </div>
            <div>
              <Label required>State</Label>
              <InputField value={form.state} onChange={e => setForm({...form, state: e.target.value})} placeholder="State" />
            </div>
            <div>
              <Label required>Pincode</Label>
              <InputField value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} placeholder="Pincode" />
            </div>
          </div>
        </div>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">{error}</div>}

        <div className="pt-4 flex justify-end">
          <button onClick={handleSubmit} disabled={!canSubmit || submitting} className="btn-primary w-full md:w-auto">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Saving Profile...</> : 'Save & Continue to Documents'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PHASE 2: DOCUMENT UPLOADS
   ═══════════════════════════════════════════════════════════ */
const Phase2DocumentUpload = () => {
  const { fetchHospitalStatus, hospitalCtx } = useApp();
  const navigate = useNavigate();
  const [uploadedDocs, setUploadedDocs] = useState({}); // { documentType: { loading: false, success: true } }
  const [submittingApproval, setSubmittingApproval] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (docKey, file) => {
    if (!file) return;
    setUploadedDocs(p => ({ ...p, [docKey]: { loading: true, success: false } }));
    setError('');

    try {
      const fd = new FormData();
      fd.append('document', file);
      fd.append('documentType', docKey);
      
      await hospitalApi.uploadDocuments(fd);
      setUploadedDocs(p => ({ ...p, [docKey]: { loading: false, success: true, fileName: file.name } }));
      
      // Silently refresh context to update documentsUploaded count in background
      fetchHospitalStatus();
    } catch (err) {
      setUploadedDocs(p => ({ ...p, [docKey]: { loading: false, success: false } }));
      setError(err.response?.data?.message || `Failed to upload ${docKey}. Please try again.`);
    }
  };

  const handleFinalSubmit = async () => {
    setError(''); setSubmittingApproval(true);
    console.log('Sending final submit request to /api/hospital/createapproval...');
    try {
      const res = await hospitalApi.submitApproval();
      console.log('Submit approval response:', res.data);
      await fetchHospitalStatus(); // Will now return 'verification_pending' -> Gate auto-redirects
      navigate('/hospital/pending'); 
    } catch (err) {
      console.error('Submit approval error:', err);
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setSubmittingApproval(false);
    }
  };

  // Check if at least 2 documents are successfully uploaded
  const serverCount = hospitalCtx.hospital?.documentsUploaded || 0;
  const localCount  = Object.values(uploadedDocs).filter(d => d.success).length;
  const isSufficientDocs = Math.max(serverCount, localCount) > 1;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">Upload Documents</h2>
        <p className="text-white/50 text-sm mt-1">Step 2 of 2: Verifying your facility</p>
      </div>

      <div className="glass shadow-card-dark rounded-2xl p-6 md:p-8 space-y-6">
        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-white/60">
            Please upload clear, legible copies of your official documents one by one. Accepted formats: PDF, JPG, PNG (max 5MB each).
          </p>
        </div>

        <div className="space-y-4">
          {DOC_TYPES.map(({ key, label, required }) => {
            const status = uploadedDocs[key];
            const isSuccess = status?.success;
            const isLoading = status?.loading;

            return (
              <div key={key} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-colors ${isSuccess ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    {label} {required && <span className="text-red-400 text-xs px-1.5 py-0.5 rounded-md bg-red-500/10">Required</span>}
                  </h4>
                  {isSuccess ? (
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1"><Check size={12}/> {status.fileName} uploaded</p>
                  ) : (
                    <p className="text-xs text-white/40 mt-1">Max 5MB. PDF, JPG, PNG.</p>
                  )}
                </div>

                <div className="relative">
                  <input type="file" id={`file-${key}`} className="sr-only" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleUpload(key, e.target.files[0])} disabled={isLoading} />
                  <label htmlFor={`file-${key}`} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isLoading ? 'opacity-50 cursor-not-allowed bg-white/10 text-white/50' : isSuccess ? 'bg-white/5 text-white/80 hover:bg-white/10 cursor-pointer border border-white/10' : 'bg-violet-600 hover:bg-violet-500 text-white cursor-pointer shadow-glow-primary'}`}>
                    {isLoading ? <><Loader2 size={15} className="animate-spin" /> Uploading...</> : isSuccess ? <><Upload size={15} /> Replace</> : <><Upload size={15} /> Upload</>}
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">{error}</div>}

        <div className="pt-6 border-t border-white/5 flex flex-col items-center">
          <button onClick={handleFinalSubmit} disabled={!isSufficientDocs || submittingApproval} className="btn-primary w-full md:w-auto px-10 py-3 text-base">
            {submittingApproval ? <><Loader2 size={18} className="animate-spin" /> Submitting Application...</> : 'Submit for Verification'}
          </button>
          {!isSufficientDocs && <p className="text-xs text-red-400/80 mt-3 flex items-center gap-1"><AlertCircle size={12}/> Please upload at least 2 documents to continue.</p>}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-white/40">
          <Shield size={12} className="text-blue-400" /> Your documents are encrypted and protected by HealthSphere policies.
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN CONTAINER
   ═══════════════════════════════════════════════════════════ */
const HospitalOnboarding = () => {
  const { hospitalCtx } = useApp();
  const { onboardingStep, statusLoading } = hospitalCtx;

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-4xl relative">
        {/* Glow Effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          {onboardingStep === 'create_profile' && <Phase1ProfileCreation />}
          {onboardingStep === 'complete_profile' && <Phase2DocumentUpload />}
          
          {/* Failsafe if neither matches (though Gate should prevent this) */}
          {!['create_profile', 'complete_profile'].includes(onboardingStep) && (
             <div className="text-center text-white/50 p-10 glass rounded-2xl">
               Determining next step...
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalOnboarding;
