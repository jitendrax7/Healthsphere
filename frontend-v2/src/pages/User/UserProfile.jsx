import { useState } from 'react';
import { User, Camera, Save, Loader2 } from 'lucide-react';
import { userApi } from '../../api/axios';

const UserProfileSetup = () => {
  const [form, setForm] = useState({ age: '', gender: '', bloodGroup: '', height: '', weight: '', allergies: '', medicalHistory: '', emergencyContact: '' });
  const [loading, setLoad] = useState(false);
  const [success, setOk]   = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setLoad(true); setOk(false);
    try { await userApi.updateProfile(form); setOk(true); }
    catch { }
    finally { setLoad(false); }
  };

  const F = ({ label, name, type='text', placeholder, options }) => (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
      {options
        ? <select value={form[name]} onChange={e => setForm({...form,[name]:e.target.value})} className="input-dark text-sm">
            <option value="">Select...</option>
            {options.map(o => <option key={o}>{o}</option>)}
          </select>
        : <input type={type} value={form[name]} onChange={e => setForm({...form,[name]:e.target.value})}
            placeholder={placeholder} className="input-dark text-sm" />
      }
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Setup Your Profile</h1>
        <p className="text-white/40">Health information to improve AI prediction accuracy</p>
      </div>

      <div className="glass p-8 rounded-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors shadow-glow-primary">
              <Camera size={14} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-white">Profile Photo</p>
            <p className="text-white/40 text-sm mt-0.5">Upload a clear photo (optional)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <F label="Age"          name="age"    type="number" placeholder="25" />
            <F label="Gender"       name="gender" options={['Male','Female','Other']} />
            <F label="Blood Group"  name="bloodGroup" options={['A+','A-','B+','B-','AB+','AB-','O+','O-']} />
            <F label="Height (cm)"  name="height" type="number" placeholder="170" />
            <F label="Weight (kg)"  name="weight" type="number" placeholder="70" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Allergies</label>
            <textarea value={form.allergies} onChange={e => setForm({...form,allergies:e.target.value})}
              rows={2} placeholder="List any known allergies..." className="input-dark text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Medical History</label>
            <textarea value={form.medicalHistory} onChange={e => setForm({...form,medicalHistory:e.target.value})}
              rows={3} placeholder="Previous conditions, surgeries, medications..." className="input-dark text-sm resize-none" />
          </div>
          <F label="Emergency Contact" name="emergencyContact" placeholder="+91 98765 43210" />

          {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl">Profile updated successfully!</div>}

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><Loader2 size={15} className="animate-spin"/>Saving...</> : <><Save size={15}/>Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileSetup;
