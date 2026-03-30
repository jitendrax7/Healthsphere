import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tent, Calendar, Users, Loader2, ArrowRight, Clock, MapPin } from 'lucide-react';
import { campApi } from '../../api/axios';

const HealthcareCamp = () => {
  const [camps, setCamps]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    campApi.getAll()
      .then(r => setCamps(r.data.camps || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Healthcare Camps</h1>
          <p className="text-white/40 max-w-xl">Discover upcoming medical camps in your area organized by verified hospitals and NGOs. Get free screenings, consultations, and care.</p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-white/50 space-y-4">
          <Loader2 size={32} className="animate-spin text-accent-green" />
          <p>Loading near camps...</p>
        </div>
      )}

      {!loading && camps.length === 0 && (
        <div className="glass p-16 rounded-3xl text-center text-white/40 max-w-2xl mx-auto mt-10">
          <div className="w-16 h-16 rounded-full bg-accent-green/10 flex items-center justify-center mx-auto mb-4 border border-accent-green/20">
             <Tent size={28} className="text-accent-green opacity-80" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Camps Scheduled</h3>
          <p className="max-w-sm mx-auto">There are currently no upcoming healthcare camps. Please check back later.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {camps.map((camp) => (
          <div key={camp._id || camp.id} className="glass p-5 rounded-2xl hover:border-accent-green/30 hover:-translate-y-1 transition-all duration-300 flex flex-col group overflow-hidden relative">
            
            {/* Poster Header */}
            <div className="h-40 -mx-5 -mt-5 mb-4 relative overflow-hidden bg-white/5 border-b border-white/5">
               {camp.posterImage ? (
                  <img src={camp.posterImage.url || camp.posterImage} alt={camp.title} className="w-full h-full object-cover" />
               ) : (
                  <Tent size={42} className="text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/20 to-transparent" />
               
               <div className="absolute top-3 right-3">
                 <span className="text-[10px] bg-black/40 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-full font-medium uppercase tracking-widest shadow-lg">
                   {camp.campType?.replace('_', ' ')}
                 </span>
               </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 leading-tight line-clamp-2">{camp.title}</h3>
            {camp.hospital?.hospitalName && (
               <p className="text-accent-cyan text-[12px] font-medium mb-2">{camp.hospital.hospitalName}</p>
            )}
            {camp.description && <p className="text-white/40 text-[13px] mb-4 line-clamp-2 leading-relaxed">{camp.description}</p>}

            <div className="space-y-2 mt-auto pt-4 border-t border-white/5 mb-5">
              <p className="text-white/60 text-xs flex items-center gap-2">
                <Calendar size={13} className="text-accent-green"/>
                <span className="font-medium text-white/80">{new Date(camp.startDate).toLocaleDateString()}</span>
              </p>
              <p className="text-white/60 text-xs flex items-center gap-2">
                <Clock size={13} className="text-amber-400"/>
                {camp.startTime} - {camp.endTime}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs flex items-center gap-2">
                  <MapPin size={13} className="text-accent-cyan"/>
                  {camp.location?.city}, {camp.location?.state}
                </p>
                <span className="text-white/40 text-[10px]">{camp.totalRegistrations} / {camp.maxParticipants} slots</span>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/user/healthcarecamp/${camp._id || camp.id}`)}
              className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 hover:border-accent-green/30 hover:text-white transition-all group-hover:bg-accent-green/10 group-hover:text-accent-green group-hover:border-accent-green flex items-center justify-center gap-2">
               View Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthcareCamp;
