import { useState } from 'react';
import { Droplets, Eye, EyeOff, Loader2, CheckCircle2, Lock, MapPin } from 'lucide-react';
import { donorApi } from '../../../api/axios';

const Toggle = ({ enabled, onChange, loading, label, description, icon: Icon, activeColor }) => (
  <div className="flex items-center justify-between gap-3 py-3.5">
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${enabled ? activeColor : 'bg-white/5'}`}>
        <Icon size={15} className={enabled ? 'text-white' : 'text-white/30'} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-white/40 leading-tight">{description}</p>
      </div>
    </div>
    <button
      onClick={onChange}
      disabled={loading}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
        enabled ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-white/10'
      }`}
    >
      {loading
        ? <Loader2 size={11} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
        : <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${enabled ? 'left-5' : 'left-0.5'}`} />
      }
    </button>
  </div>
);

const StatPill = ({ label, value, color }) => (
  <div className="flex flex-col items-center px-3 sm:px-4 py-3 rounded-xl bg-white/3 border border-white/8">
    <p className={`text-base sm:text-lg font-black ${color}`}>{value}</p>
    <p className="text-[9px] sm:text-[10px] text-white/30 mt-0.5 text-center leading-tight">{label}</p>
  </div>
);

const DonorProfileCard = ({ profile, onUpdate }) => {
  const [availLoading, setAvailLoading]     = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  const toggleAvailability = async () => {
    setAvailLoading(true);
    try { await donorApi.setAvailability(!profile.isAvailable); onUpdate(); }
    catch {}
    finally { setAvailLoading(false); }
  };

  const togglePrivacy = async () => {
    setPrivacyLoading(true);
    try { await donorApi.setPrivacy(!profile.isAnonymous); onUpdate(); }
    catch {}
    finally { setPrivacyLoading(false); }
  };

  const stats = profile.donationStats || {};

  return (
    <div className="max-w-lg w-full space-y-3">
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-rose-500/30">
                {profile.bloodGroup}
              </div>
              {profile.isAvailable && (
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-dark-900 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-white text-base sm:text-lg truncate">{profile.user?.Name || 'Donor'}</h2>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                <span className="text-xs text-white/40 capitalize">{profile.gender}</span>
                <span className="text-white/15">·</span>
                <span className="text-xs text-white/40">{profile.age} yrs</span>
                <span className="text-white/15">·</span>
                <span className="text-xs text-white/40">{profile.weight} kg</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {profile.isAnonymous && (
              <span className="flex items-center gap-1 bg-violet-500/15 border border-violet-500/30 text-violet-400 text-[10px] px-2 py-0.5 rounded-full">
                <Lock size={9} /> Anon
              </span>
            )}
            <span className={`flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold ${
              profile.isAvailable
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border border-white/10 text-white/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${profile.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
              {profile.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatPill label="Total" value={stats.totalDonations ?? 0}    color="text-rose-400" />
          <StatPill label="Done"  value={stats.successfulDonations ?? 0} color="text-emerald-400" />
          <StatPill label="Cancelled" value={stats.cancelledDonations ?? 0} color="text-white/40" />
        </div>

        {profile.lastDonationDate && (
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 sm:px-4 py-2.5 mb-2">
            <CheckCircle2 size={13} className="text-rose-400 flex-shrink-0" />
            <p className="text-xs text-white/50">
              Last donated: <span className="text-white/80 font-medium">
                {new Date(profile.lastDonationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </p>
            {profile.nextEligibleDate && (
              <span className="ml-auto text-[10px] text-white/30 flex-shrink-0">
                Next: {new Date(profile.nextEligibleDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
        )}

        {profile.maxDistance && (
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 sm:px-4 py-2.5 mb-2">
            <MapPin size={13} className="text-violet-400 flex-shrink-0" />
            <p className="text-xs text-white/50">
              Matches within <span className="text-white/80 font-medium">{profile.maxDistance} km</span>
            </p>
            {profile.emergencyAvailable && (
              <span className="ml-auto flex items-center gap-1 text-[10px] text-rose-400 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                Emergency
              </span>
            )}
          </div>
        )}

        <div className="border-t border-white/5 mt-4 divide-y divide-white/5">
          <Toggle
            enabled={profile.isAvailable}
            onChange={toggleAvailability}
            loading={availLoading}
            label="Available to Donate"
            description="Hospitals can find and invite you"
            icon={Droplets}
            activeColor="bg-emerald-500/20"
          />
          <Toggle
            enabled={profile.isAnonymous}
            onChange={togglePrivacy}
            loading={privacyLoading}
            label="Anonymous Mode"
            description="Hide identity until you accept"
            icon={profile.isAnonymous ? EyeOff : Eye}
            activeColor="bg-violet-500/20"
          />
        </div>
      </div>

      <p className="text-xs text-white/25 text-center px-4">
        Your medical info is never shared publicly.
      </p>
    </div>
  );
};

export default DonorProfileCard;
