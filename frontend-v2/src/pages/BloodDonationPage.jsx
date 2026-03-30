import { useState, useEffect } from 'react';
import { Droplets, CheckCircle, User, Phone, MapPin, Loader2 } from 'lucide-react';
import { bloodApi } from '../api/axios';

const BLOOD_GROUPS = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

const BloodDonationPage = () => {
  const [tab, setTab]             = useState('register');
  const [donors, setDonors]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [form, setForm]           = useState({ bloodGroup: '', city: '', contact: '', lastDonationDate: '' });

  useEffect(() => {
    if (tab === 'find') {
      setLoading(true);
      bloodApi.getDonors().then(r => setDonors(r.data.donors || [])).catch(() => {}).finally(() => setLoading(false));
    }
  }, [tab]);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await bloodApi.register(form);
      setSuccess(true);
    } catch { }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Blood Donation</h1>
        <p className="text-white/40">Register as a donor or find blood donors near you</p>
      </div>

      <div className="flex gap-2 p-1 glass rounded-xl w-fit">
        {[['register','🩸 Register as Donor'],['find','🔍 Find Donors']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab===k ? 'bg-accent-pink/80 text-white shadow-glow-purple' : 'text-white/50 hover:text-white'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* REGISTER */}
      {tab === 'register' && !success && (
        <div className="glass p-6 rounded-2xl max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-pink to-accent-orange flex items-center justify-center">
              <Droplets size={18} className="text-white" />
            </div>
            <h2 className="font-semibold text-white">Donor Registration</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Blood Group</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(g => (
                  <button key={g} type="button" onClick={() => setForm({...form, bloodGroup:g})}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                      form.bloodGroup===g ? 'bg-accent-pink/20 border-accent-pink text-accent-pink' : 'border-white/10 text-white/50 hover:border-white/30'
                    }`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">City</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="text" value={form.city} onChange={e => setForm({...form, city:e.target.value})} required
                  placeholder="Your city..." className="input-dark pl-10 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Contact Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="tel" value={form.contact} onChange={e => setForm({...form, contact:e.target.value})} required
                  placeholder="+91..." className="input-dark pl-10 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Last Donation Date (optional)</label>
              <input type="date" value={form.lastDonationDate} onChange={e => setForm({...form, lastDonationDate:e.target.value})}
                className="input-dark text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-accent-pink to-accent-orange text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={15} className="animate-spin"/>Registering...</> : '🩸 Register as Donor'}
            </button>
          </form>
        </div>
      )}

      {success && (
        <div className="glass p-8 rounded-2xl max-w-lg text-center">
          <CheckCircle size={44} className="text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Registered Successfully!</h3>
          <p className="text-white/50 text-sm">Thank you for registering as a blood donor. Your contribution saves lives.</p>
          <button onClick={() => { setSuccess(false); setForm({ bloodGroup:'', city:'', contact:'', lastDonationDate:'' }); }}
            className="btn-primary mt-5 text-sm">Register Another</button>
        </div>
      )}

      {/* FIND DONORS */}
      {tab === 'find' && (
        <div className="space-y-4">
          {loading && <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-accent-pink border-t-transparent rounded-full animate-spin" /></div>}
          {!loading && donors.length === 0 && (
            <div className="glass p-12 rounded-2xl text-center text-white/40">
              <Droplets size={36} className="mx-auto mb-3 opacity-30" />
              <p>No donors found in your area.</p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            {donors.map((d, i) => (
              <div key={i} className="glass p-5 rounded-xl hover:border-white/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-pink to-accent-orange flex items-center justify-center text-sm font-bold text-white">{d.bloodGroup}</div>
                  <div>
                    <p className="font-medium text-white">{d.user?.Name || 'Anonymous'}</p>
                    <p className="text-white/40 text-xs flex items-center gap-1"><MapPin size={10}/>{d.city}</p>
                  </div>
                </div>
                <a href={`tel:${d.contact}`} className="flex items-center gap-1.5 text-accent-pink text-sm hover:opacity-80 transition-opacity">
                  <Phone size={13}/>{d.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodDonationPage;
