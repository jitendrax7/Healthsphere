import { useState } from 'react';
import { Droplets, AlertTriangle, Phone, MapPin, Send, Loader2, Info, Calendar } from 'lucide-react';
import { bloodRequestApi } from '../../../api/axios';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const URGENCY_LEVELS = [
  { value: 'CRITICAL', label: 'Critical', sub: '< 6 hrs',  activeClass: 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_14px_rgba(239,68,68,0.3)]' },
  { value: 'URGENT',   label: 'Urgent',   sub: '< 24 hrs', activeClass: 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-[0_0_14px_rgba(249,115,22,0.3)]' },
  { value: 'NORMAL',   label: 'Normal',   sub: '2–7 days', activeClass: 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.3)]' },
];

const Field = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide">{label}</label>
    {children}
    {hint && <p className="text-xs text-white/25">{hint}</p>}
  </div>
);

const Section = ({ title, icon: Icon, iconCls, children }) => (
  <div className="glass rounded-2xl p-4 sm:p-6 space-y-4">
    <h2 className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-wider flex items-center gap-2">
      <Icon size={13} className={iconCls} /> {title}
    </h2>
    {children}
  </div>
);

const BloodRequestForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    bloodGroup: '', urgencyLevel: 'URGENT', unitsRequired: 1,
    patientName: '', disease: '', patientAge: '',
    contactPerson: '', contactNumber: '', requiredBeforeDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set    = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const handle    = e => set(e.target.name, e.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.bloodGroup) { setError('Please select a blood group.'); return; }
    setError('');
    setLoading(true);
    try {
      const payload = {
        bloodGroup:    form.bloodGroup,
        unitsRequired: Number(form.unitsRequired),
        urgencyLevel:  form.urgencyLevel,
        ...(form.patientName       && { patientName:       form.patientName }),
        ...(form.disease           && { disease:           form.disease }),
        ...(form.patientAge        && { patientAge:        Number(form.patientAge) }),
        ...(form.contactPerson     && { contactPerson:     form.contactPerson }),
        ...(form.contactNumber     && { contactNumber:     form.contactNumber }),
        ...(form.requiredBeforeDate && { requiredBeforeDate: form.requiredBeforeDate }),
        ...(form.notes             && { notes:             form.notes }),
      };
      await bloodRequestApi.create(payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl w-full">
      <Section title="Request Details" icon={AlertTriangle} iconCls="text-red-400">
        <Field label="Blood Group Required">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {BLOOD_GROUPS.map(bg => (
              <button key={bg} type="button" onClick={() => set('bloodGroup', bg)}
                className={`py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 ${
                  form.bloodGroup === bg
                    ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_14px_rgba(239,68,68,0.3)]'
                    : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
                }`}>
                {bg}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Urgency Level">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {URGENCY_LEVELS.map(({ value, label, sub, activeClass }) => (
              <button key={value} type="button" onClick={() => set('urgencyLevel', value)}
                className={`py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 flex flex-col items-center gap-0.5 ${
                  form.urgencyLevel === value ? activeClass : 'border-white/10 text-white/50 hover:border-white/25'
                }`}>
                <span>{label}</span>
                <span className="text-[9px] sm:text-[10px] font-normal opacity-70">{sub}</span>
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Units Required" hint="1 unit ≈ 450 mL">
            <input type="number" name="unitsRequired" value={form.unitsRequired}
              onChange={handle} min={1} max={50} required className="input-dark py-2.5" />
          </Field>
          <Field label="Required Before">
            <div className="relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="date" name="requiredBeforeDate" value={form.requiredBeforeDate}
                onChange={handle} className="input-dark pl-9 py-2.5" />
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Patient Name">
            <input type="text" name="patientName" value={form.patientName}
              onChange={handle} placeholder="Patient name" className="input-dark py-2.5" />
          </Field>
          <Field label="Patient Age">
            <input type="number" name="patientAge" value={form.patientAge}
              onChange={handle} min={0} placeholder="Age" className="input-dark py-2.5" />
          </Field>
        </div>

        <Field label="Disease / Reason">
          <input type="text" name="disease" value={form.disease}
            onChange={handle} placeholder="e.g. Thalassemia, Surgery" className="input-dark py-2.5" />
        </Field>

        <Field label="Notes">
          <textarea name="notes" value={form.notes} onChange={handle}
            rows={2} placeholder="Any additional context..." className="input-dark resize-none" />
        </Field>
      </Section>

      <Section title="Contact Information" icon={Phone} iconCls="text-violet-400">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Field label="Contact Person">
            <div className="relative">
              <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="text" name="contactPerson" value={form.contactPerson}
                onChange={handle} placeholder="Dr. Sharma / Reception" className="input-dark pl-9 py-2.5" />
            </div>
          </Field>
          <Field label="Contact Number">
            <div className="relative">
              <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="tel" name="contactNumber" value={form.contactNumber}
                onChange={handle} placeholder="+91 98765 43210" className="input-dark pl-9 py-2.5" />
            </div>
          </Field>
        </div>
      </Section>

      <div className="flex items-start gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl px-3 sm:px-4 py-3">
        <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-white/50">
          Up to 50 nearby donors will be automatically notified. Anonymous donors' contact details are revealed only after they accept.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3">
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
          : <><Send size={16} /> Post Blood Request</>
        }
      </button>
    </form>
  );
};

export default BloodRequestForm;
