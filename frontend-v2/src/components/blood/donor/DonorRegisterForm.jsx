import { useState } from 'react';
import { Droplets, Loader2, Calendar, AlertCircle } from 'lucide-react';
import { donorApi } from '../../../api/axios';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['male', 'female', 'other'];

const DonorRegisterForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    bloodGroup: '', age: '', weight: '', gender: '',
    isAvailable: true, isAnonymous: false,
    maxDistance: 15, emergencyAvailable: true,
    lastDonationDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.bloodGroup) { setError('Please select your blood group.'); return; }
    if (!form.gender)     { setError('Please select your gender.'); return; }
    setError('');
    setLoading(true);
    try {
      const payload = {
        bloodGroup: form.bloodGroup,
        age: Number(form.age),
        weight: Number(form.weight),
        gender: form.gender,
        isAvailable: form.isAvailable,
        isAnonymous: form.isAnonymous,
        maxDistance: form.maxDistance,
        emergencyAvailable: form.emergencyAvailable,
        ...(form.lastDonationDate && { lastDonationDate: form.lastDonationDate }),
      };
      await donorApi.register(payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 max-w-lg w-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30 flex-shrink-0">
          <Droplets size={16} className="text-white" />
        </div>
        <div>
          <h2 className="font-bold text-white text-base sm:text-lg">Donor Registration</h2>
          <p className="text-white/40 text-xs">Join the HealthSphere donor network</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">Blood Group</label>
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {BLOOD_GROUPS.map(g => (
              <button key={g} type="button" onClick={() => set('bloodGroup', g)}
                className={`py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all duration-200 ${
                  form.bloodGroup === g
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_14px_rgba(244,63,94,0.35)]'
                    : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
                }`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">Age</label>
            <input type="number" value={form.age} onChange={e => set('age', e.target.value)}
              required min={18} max={65} placeholder="18–65" className="input-dark text-sm py-2.5" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">Weight (kg)</label>
            <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)}
              required min={45} placeholder="min 45" className="input-dark text-sm py-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {GENDERS.map(g => (
              <button key={g} type="button" onClick={() => set('gender', g)}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold capitalize border transition-all ${
                  form.gender === g
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
                }`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
            Last Donation Date <span className="text-white/25 normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Calendar size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input type="date" value={form.lastDonationDate} onChange={e => set('lastDonationDate', e.target.value)}
              className="input-dark pl-10 text-sm py-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => set('emergencyAvailable', !form.emergencyAvailable)}
            className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
              form.emergencyAvailable
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'border-white/10 text-white/40'
            }`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${form.emergencyAvailable ? 'bg-rose-400 animate-pulse' : 'bg-white/20'}`} />
            Emergency Ready
          </button>
          <button type="button" onClick={() => set('isAnonymous', !form.isAnonymous)}
            className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
              form.isAnonymous
                ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                : 'border-white/10 text-white/40'
            }`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${form.isAnonymous ? 'bg-violet-400' : 'bg-white/20'}`} />
            Anonymous
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />{error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25">
          {loading ? <><Loader2 size={15} className="animate-spin" /> Registering...</> : <><Droplets size={15} /> Register as Donor</>}
        </button>
      </form>
    </div>
  );
};

export default DonorRegisterForm;
