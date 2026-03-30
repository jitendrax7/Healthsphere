import { useState } from 'react';
import { Bell, Lock, Eye, EyeOff, Shield, Save, Loader2 } from 'lucide-react';
import { doctorApi } from '../../api/axios';

const DoctorSettings = () => {
  const [form, setForm]           = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [notifs, setNotifs]       = useState({ email: true, sms: false, appointments: true });
  const [showOld, setShowOld]     = useState(false);
  const [showNew, setShowNew]     = useState(false);
  const [loading, setLoad]        = useState(false);
  const [msg, setMsg]             = useState({ type:'', text:'' });

  const handlePasswordChange = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { setMsg({ type:'error', text:'Passwords do not match.' }); return; }
    setLoad(true); setMsg({ type:'', text:'' });
    try {
      await doctorApi.updateSettings({ password: form.newPassword, oldPassword: form.oldPassword });
      setMsg({ type:'success', text:'Password updated successfully!' });
      setForm({ oldPassword:'', newPassword:'', confirmPassword:'' });
    } catch (err) {
      setMsg({ type:'error', text: err.response?.data?.message || 'Update failed.' });
    } finally { setLoad(false); }
  };

  const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}
      </div>
      <button type="button" onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-primary-600' : 'bg-dark-400'}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
        <p className="text-white/40">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple to-primary-600 flex items-center justify-center"><Bell size={16} className="text-white" /></div>
          <h2 className="font-semibold text-white">Notifications</h2>
        </div>
        <Toggle label="Email Notifications" desc="Receive appointment alerts via email" checked={notifs.email} onChange={() => setNotifs(p => ({ ...p, email: !p.email }))} />
        <Toggle label="SMS Alerts"          desc="Get SMS for new appointments"         checked={notifs.sms}   onChange={() => setNotifs(p => ({ ...p, sms:   !p.sms   }))} />
        <Toggle label="Appointment Reminders" desc="Reminders before consultations"     checked={notifs.appointments} onChange={() => setNotifs(p => ({ ...p, appointments: !p.appointments }))} />
      </div>

      {/* Password */}
      <div className="glass p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-orange to-accent-pink flex items-center justify-center"><Lock size={16} className="text-white" /></div>
          <h2 className="font-semibold text-white">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { label:'Current Password', key:'oldPassword', show:showOld, toggle:() => setShowOld(!showOld) },
            { label:'New Password',     key:'newPassword', show:showNew, toggle:() => setShowNew(!showNew) },
            { label:'Confirm Password', key:'confirmPassword', show:showNew, toggle:() => {} },
          ].map(({ label, key, show, toggle }) => (
            <div key={key}>
              <label className="block text-xs text-white/50 mb-1.5">{label}</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input type={show ? 'text' : 'password'} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}
                  required placeholder="••••••••" className="input-dark pl-10 pr-10 text-sm" />
                <button type="button" onClick={toggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {show ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
          ))}
          {msg.text && (
            <div className={`text-sm px-4 py-3 rounded-xl border ${msg.type==='success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {msg.text}
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><Loader2 size={15} className="animate-spin"/>Updating...</> : <><Save size={15}/>Update Password</>}
          </button>
        </form>
      </div>

      {/* Security badge */}
      <div className="glass p-4 rounded-xl flex items-center gap-3">
        <Shield size={18} className="text-accent-green flex-shrink-0" />
        <p className="text-white/50 text-sm">Your account is protected with JWT authentication and encrypted data storage.</p>
      </div>
    </div>
  );
};

export default DoctorSettings;
