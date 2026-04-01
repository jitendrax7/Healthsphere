import { Camera, Loader2, MapPin, Briefcase, IndianRupee } from 'lucide-react';

const VerBadge = ({ status }) => {
  const map = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-green-500/10 text-green-400 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${map[status] || map.pending}`}>{status}</span>;
};

const ProfileHero = ({
  user,
  profilePhoto,
  setShowPhotoModal,
  basic,
  clinic,
  verificationStatus,
  isBookingEnabled,
  handleBookingToggle,
  bookingLoading,
  profileDates,
  fmtDate
}) => {
  return (
    <div className="glass rounded-3xl p-5 sm:p-6 border border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 via-transparent to-accent-cyan/5 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-center sm:items-center justify-between gap-5 sm:gap-4 flex-wrap text-center sm:text-left">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
          <div className="relative shrink-0">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl object-cover border border-white/10 shadow-xl" />
            ) : (
              <div className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-3xl font-bold text-white">
                {user?.Name?.[0] || 'D'}
              </div>
            )}
            <button
              onClick={() => setShowPhotoModal(true)}
              className="absolute -bottom-1.5 -right-1.5 w-8 h-8 sm:w-7 sm:h-7 bg-primary-600 hover:bg-primary-500 rounded-lg flex items-center justify-center shadow-glow-primary transition-colors"
            >
              <Camera size={14} className="text-white" />
            </button>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Dr. {user?.Name || 'Doctor'}</h1>
            <p className="text-accent-cyan text-xs sm:text-sm font-semibold mt-0.5">{basic.specialization || 'Specialist'}</p>
            <p className="text-white/40 text-[10px] sm:text-xs mt-1.5 max-w-xs line-clamp-2 mx-auto sm:mx-0 leading-relaxed">
              {basic.bio || 'No bio yet.'}
            </p>
            
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 flex-wrap">
              <VerBadge status={verificationStatus} />
              {basic.totalExperience && (
                <span className="text-[10px] sm:text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full inline-flex items-center">
                  <Briefcase size={9} className="mr-1" /> {basic.totalExperience} yrs
                </span>
              )}
              {basic.consultationFee && (
                <span className="text-[10px] sm:text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full inline-flex items-center">
                  <IndianRupee size={9} className="mr-1" /> ₹{basic.consultationFee}
                </span>
              )}
              {clinic.city && (
                <span className="text-[10px] sm:text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded-full inline-flex items-center">
                  <MapPin size={9} className="mr-1" /> {clinic.city}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-t-0">
          <button
            onClick={handleBookingToggle}
            disabled={bookingLoading}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all w-full sm:w-auto ${
              isBookingEnabled
                ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
            }`}
          >
            {bookingLoading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <span className={`w-2 h-2 rounded-full ${isBookingEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            )}
            {isBookingEnabled ? 'Accepting Patients' : 'Not Accepting'}
          </button>
          
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto text-left sm:text-right mt-1 sm:mt-0">
            <div>
              <p className="text-[9px] sm:text-[10px] text-white/30 uppercase font-bold tracking-wider">Joined</p>
              <p className="text-[10px] sm:text-xs text-white/60">{fmtDate(profileDates.createdAt)}</p>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-white/30 uppercase font-bold tracking-wider">Updated</p>
              <p className="text-[10px] sm:text-xs text-white/60">{fmtDate(profileDates.updatedAt)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export { ProfileHero, VerBadge };
