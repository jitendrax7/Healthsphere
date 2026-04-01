import { useState, useEffect } from 'react';
import {
  Building2, Mail, Phone, MapPin, Globe,
  Save, Loader2, Edit3, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { hospitalApi } from '../../api/axios';

const Field = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-white/60 mb-2">{label}</label>
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />}
      <input {...props} className={`input-dark w-full ${Icon ? 'pl-10' : ''}`} />
    </div>
  </div>
);

const HospitalProfile = () => {
  const { user, fetchUser } = useApp();
  const [form, setForm] = useState({
    organizationName: '', email: '', phoneNumber: '',
    address: '', city: '', website: '', description: '',
  });
  const [loading, setLoading]  = useState(false);
  const [saved, setSaved]      = useState(false);
  const [error, setError]      = useState('');
  const [editing, setEditing]  = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        organizationName: user.organizationName || user.Name || '',
        email:            user.email            || '',
        phoneNumber:      user.phoneNumber       || '',
        address:          user.address          || '',
        city:             user.city             || '',
        website:          user.website          || '',
        description:      user.description      || '',
      });
    }
  }, [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await hospitalApi.updateProfile(form);
      await fetchUser();
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Hospital Profile</h1>
            <p className="text-white/50 text-sm">Manage your organization's information</p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:border-violet-500/40 transition-all"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* Avatar + name */}
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 shadow-[0_0_24px_rgba(139,92,246,0.35)]">
          {(form.organizationName || 'H')[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{form.organizationName || 'Hospital Name'}</h2>
          <p className="text-white/50 text-sm mt-0.5">{form.email}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
            <Building2 size={10} /> Hospital Organization
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Organization Info */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Organization Details</h2>
          <Field label="Organization / Hospital Name" icon={Building2}
            name="organizationName" value={form.organizationName}
            onChange={handleChange} placeholder="City General Hospital" disabled={!editing} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Email Address" icon={Mail}
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="contact@hospital.com" disabled={!editing} />
            <Field label="Phone Number" icon={Phone}
              type="tel" name="phoneNumber" value={form.phoneNumber}
              onChange={handleChange} placeholder="+91 98765 43210" disabled={!editing} />
          </div>
          <Field label="Website" icon={Globe}
            type="url" name="website" value={form.website}
            onChange={handleChange} placeholder="https://yourHospital.com" disabled={!editing} />
        </div>

        {/* Location */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Location</h2>
          <Field label="Address" icon={MapPin}
            name="address" value={form.address}
            onChange={handleChange} placeholder="123 Healthcare Street" disabled={!editing} />
          <Field label="City" icon={MapPin}
            name="city" value={form.city}
            onChange={handleChange} placeholder="Mumbai" disabled={!editing} />
        </div>

        {/* About */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">About the Hospital</h2>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
            <textarea
              name="description" value={form.description}
              onChange={handleChange} rows={4} disabled={!editing}
              placeholder="A brief description of your hospital, specialties, and facilities..."
              className="input-dark w-full resize-none"
            />
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 rounded-xl">
            <CheckCircle2 size={15} /> Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {editing && (
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="btn-primary flex items-center gap-2">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> Save Changes</>}
            </button>
            <button type="button" onClick={() => setEditing(false)}
              className="glass px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all">
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default HospitalProfile;
