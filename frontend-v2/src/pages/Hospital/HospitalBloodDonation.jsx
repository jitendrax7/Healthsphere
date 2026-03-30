import { useState } from 'react';
import {
  Droplets, AlertTriangle, Phone, MapPin,
  Send, Loader2, CheckCircle2, Info, ChevronDown,
} from 'lucide-react';
import { hospitalApi } from '../../api/axios';

const BLOOD_TYPES = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];
const URGENCY_LEVELS = [
  { value: 'critical', label: 'Critical (< 6 hrs)', color: 'red'    },
  { value: 'urgent',   label: 'Urgent (< 24 hrs)',  color: 'orange' },
  { value: 'normal',   label: 'Normal (2–7 days)',  color: 'green'  },
];

const Field = ({ label, icon: Icon, hint, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1.5 text-sm font-medium text-white/70">
      {Icon && <Icon size={14} className="text-white/40" />}
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-white/30">{hint}</p>}
  </div>
);

const HospitalBloodDonation = () => {
  const [form, setForm] = useState({
    bloodType: '', urgency: 'urgent', unitsNeeded: 1,
    patientCondition: '', contactName: '', contactPhone: '',
    address: '', additionalNotes: '',
  });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.bloodType) { setError('Please select a blood type.'); return; }
    setError(''); setLoading(true);
    try {
      await hospitalApi.createBloodRequest(form);
      setSuccess(true);
      setForm({
        bloodType: '', urgency: 'urgent', unitsNeeded: 1,
        patientCondition: '', contactName: '', contactPhone: '',
        address: '', additionalNotes: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-2xl p-12 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Request Submitted!</h2>
          <p className="text-white/50 max-w-sm mx-auto">
            Your blood donation request has been posted. Eligible donors in the area will be notified.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-primary mx-auto mt-2"
          >
            Post Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
            <Droplets size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Blood Donation Request</h1>
            <p className="text-white/50 text-sm">Post an urgent blood requirement for patients</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Blood Type + Urgency */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" /> Request Details
          </h2>

          {/* Blood Type grid */}
          <Field label="Blood Type Required" icon={Droplets}>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map(bt => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => setForm({ ...form, bloodType: bt })}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                    form.bloodType === bt
                      ? 'bg-red-600/30 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                      : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/70'
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </Field>

          {/* Urgency */}
          <Field label="Urgency Level" icon={AlertTriangle}>
            <div className="grid grid-cols-3 gap-3">
              {URGENCY_LEVELS.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, urgency: value })}
                  className={`py-3 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                    form.urgency === value
                      ? `bg-${color}-500/20 border-${color}-500 text-${color}-300`
                      : 'border-white/10 text-white/50 hover:border-white/25'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>

          {/* Units */}
          <Field label="Units Needed" hint="1 unit ≈ 450 mL of whole blood">
            <div className="relative">
              <input
                type="number" name="unitsNeeded" value={form.unitsNeeded}
                onChange={handleChange} min={1} max={50} required
                className="input-dark w-full"
              />
            </div>
          </Field>

          {/* Patient condition */}
          <Field label="Patient Condition / Reason">
            <textarea
              name="patientCondition" value={form.patientCondition}
              onChange={handleChange} rows={3} required
              placeholder="e.g., Surgery scheduled for thalassemia patient..."
              className="input-dark w-full resize-none"
            />
          </Field>
        </div>

        {/* Contact Info */}
        <div className="glass rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Phone size={16} className="text-violet-400" /> Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Contact Name" icon={Phone}>
              <input
                type="text" name="contactName" value={form.contactName}
                onChange={handleChange} required placeholder="Dr. Sharma / Reception"
                className="input-dark w-full"
              />
            </Field>
            <Field label="Contact Phone" icon={Phone}>
              <input
                type="tel" name="contactPhone" value={form.contactPhone}
                onChange={handleChange} required placeholder="+91 98765 43210"
                className="input-dark w-full"
              />
            </Field>
          </div>

          <Field label="Hospital / Collection Address" icon={MapPin}>
            <input
              type="text" name="address" value={form.address}
              onChange={handleChange} required placeholder="123 Hospital Road, City"
              className="input-dark w-full"
            />
          </Field>

          <Field label="Additional Notes (optional)">
            <textarea
              name="additionalNotes" value={form.additionalNotes}
              onChange={handleChange} rows={2}
              placeholder="Any special instructions for donors..."
              className="input-dark w-full resize-none"
            />
          </Field>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
          <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-white/50">
            Your request will be visible to registered blood donors on the HealthSphere platform.
            Donors matching the required blood type in your area will be notified.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Submitting Request...</>
            : <><Send size={16} /> Post Blood Donation Request</>}
        </button>
      </form>
    </div>
  );
};

export default HospitalBloodDonation;
