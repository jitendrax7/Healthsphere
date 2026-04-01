import { useState, useEffect, useCallback } from 'react';
import { Droplets, Mail, History, Bell, CheckCircle2, Loader2, Globe } from 'lucide-react';
import { donorApi } from '../api/axios';
import DonorRegisterForm from '../components/blood/donor/DonorRegisterForm';
import DonorProfileCard from '../components/blood/donor/DonorProfileCard';
import DonorInvites from '../components/blood/donor/DonorInvites';
import DonorHistory from '../components/blood/donor/DonorHistory';
import DonorNotifications from '../components/blood/donor/DonorNotifications';
import BloodCommunity from '../components/blood/donor/BloodCommunity';

const TABS = [
  { key: 'community',     label: 'Community',     icon: Globe,    donorOnly: false },
  { key: 'profile',       label: 'Profile',       icon: Droplets, donorOnly: true  },
  { key: 'invites',       label: 'Invites',       icon: Mail,     donorOnly: true  },
  { key: 'history',       label: 'History',       icon: History,  donorOnly: true  },
  { key: 'notifications', label: 'Notifs',        icon: Bell,     donorOnly: true  },
];

const BloodDonationPage = () => {
  const [tab, setTab]                       = useState('community');
  const [donor, setDonor]                   = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [registered, setRegistered]         = useState(false);
  const [notifCount, setNotifCount]         = useState(0);
  const [showRegister, setShowRegister]     = useState(false);

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await donorApi.getProfile();
      setDonor(res.data.data || null);
    } catch {
      setDonor(null);
    }
    finally { setProfileLoading(false); }
  }, []);

  const fetchNotifCount = useCallback(async () => {
    try {
      const res = await donorApi.getNotifications();
      const d = res.data.data || {};
      setNotifCount(d.unreadCount ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchNotifCount();
  }, [fetchProfile, fetchNotifCount]);

  useEffect(() => {
    if (donor) setTab('profile');
  }, [donor]);

  const handleRegistered = () => {
    setRegistered(true);
    setShowRegister(false);
    fetchProfile();
  };

  const visibleTabs = TABS.filter(t => !t.donorOnly || donor);

  return (
    <div className="space-y-5 animate-fade-in"> 

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex gap-1 p-1 glass rounded-xl overflow-x-auto scrollbar-hide w-full sm:w-fit">
          {visibleTabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setShowRegister(false); }}
              className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-1 sm:flex-none justify-center sm:justify-start ${
                tab === key
                  ? key === 'community'
                    ? 'bg-violet-500/20 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                    : 'bg-rose-500/20 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Icon size={13} />
              <span className="hidden xs:inline sm:inline">{label}</span>
              {key === 'notifications' && notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </button>
          ))}

          {!donor && !profileLoading && (
            <button
              onClick={() => { setTab('community'); setShowRegister(r => !r); }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                showRegister
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'text-white/50 hover:text-white border border-rose-500/20 hover:border-rose-500/40'
              }`}
            >
              <Droplets size={13} />
              <span>{showRegister ? 'Cancel' : 'Become a Donor'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="animate-fade-in">
        {profileLoading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white/40 text-sm">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {tab === 'community' && !showRegister && <BloodCommunity />}

            {tab === 'community' && showRegister && (
              <div className="space-y-4">
                {registered ? (
                  <div className="glass rounded-2xl p-8 sm:p-10 text-center max-w-md">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={28} className="text-emerald-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Welcome to the Network!</h3>
                    <p className="text-white/50 text-sm">Your donor profile is being set up.</p>
                    <button onClick={fetchProfile} className="btn-primary mt-5 text-sm flex items-center gap-2 mx-auto">
                      <Loader2 size={14} /> Refresh Profile
                    </button>
                  </div>
                ) : (
                  <DonorRegisterForm onSuccess={handleRegistered} />
                )}
              </div>
            )}

            {tab !== 'community' && donor && (
              <>
                {tab === 'profile'       && <DonorProfileCard profile={donor} onUpdate={fetchProfile} />}
                {tab === 'invites'       && <DonorInvites />}
                {tab === 'history'       && <DonorHistory />}
                {tab === 'notifications' && <DonorNotifications />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BloodDonationPage;
