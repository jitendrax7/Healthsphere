import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tent, Calendar, MapPin, Users, Clock, Loader2, ArrowLeft, 
  CheckCircle, Activity, Info, Phone, Shield
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { campApi } from '../../api/axios';

const CampDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchCamp = async () => {
      try {
        const res = await campApi.getById(id);
        let fetchedCamp = res.data.camp || res.data;
        
        // Parse "[\"...\"]" if backend sends stringified arrays inside arrays
        try {
           if (Array.isArray(fetchedCamp.departments) && typeof fetchedCamp.departments[0] === 'string' && fetchedCamp.departments[0].startsWith('[')) {
             fetchedCamp.departments = JSON.parse(fetchedCamp.departments[0]);
           }
           if (Array.isArray(fetchedCamp.services) && typeof fetchedCamp.services[0] === 'string' && fetchedCamp.services[0].startsWith('[')) {
             fetchedCamp.services = JSON.parse(fetchedCamp.services[0]);
           }
        } catch(e) {}

        setCamp(fetchedCamp);
        // For now, if the API does not, we initialize generic boolean.
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to locate camp details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCamp();
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await campApi.register(id);
      setIsRegistered(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-white/50 space-y-4">
        <Loader2 size={36} className="animate-spin text-accent-green" />
        <p>Loading camp information...</p>
      </div>
    );
  }

  if (error || !camp) {
    return (
      <div className="glass p-16 rounded-2xl text-center text-white/40 max-w-2xl mx-auto mt-10">
        <Info size={42} className="mx-auto mb-3 opacity-30 text-red-400" />
        <p className="text-red-400 mb-4">{error || 'Camp not found'}</p>
        <button onClick={() => navigate('/user/healthcarecamp')} className="btn-primary text-sm px-6">
           Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in relative">
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/user/healthcarecamp')} 
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm mb-4"
      >
        <ArrowLeft size={16} /> Back to Camps
      </button>

      {/* Hero Header */}
      <div className="glass rounded-3xl overflow-hidden relative shadow-2xl border border-white/10">
        <div className="h-64 md:h-80 w-full relative bg-[#0F172A]">
          {camp.posterImage ? (
             <img src={camp.posterImage.url || camp.posterImage} alt={camp.title} className="w-full h-full object-cover" />
          ) : (
             <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-accent-green/20 to-[#0F172A]/80">
               <Tent size={64} className="text-white/10" />
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full flex flex-col items-start gap-3">
             <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-green/20 border border-accent-green/30 text-accent-green text-[10px] uppercase font-bold tracking-widest backdrop-blur-md">
               {camp.campType?.replace('_', ' ')}
             </span>
             <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl drop-shadow-lg">
               {camp.title}
             </h1>
             {(camp.hospital?.name || camp.hospital?.hospitalName) && (
               <p className="text-lg text-accent-cyan font-medium flex items-center gap-2 drop-shadow-md">
                  <span className="w-5 h-5 rounded-md bg-accent-cyan/20 flex items-center justify-center border border-accent-cyan/30 text-accent-cyan">
                     <Tent size={12} />
                  </span>
                  Organized by {camp.hospital?.name || camp.hospital?.hospitalName}
               </p>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        
        {/* Main Content Pane */}
        <div className="space-y-6">
          
          {/* About */}
          <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
             <h3 className="text-sm font-bold text-accent-green uppercase tracking-wider flex items-center gap-2">
                <Info size={16} /> About this Camp
             </h3>
             <p className="text-white/70 leading-relaxed text-sm">
                {camp.description || "No description provided format for this healthcare camp."}
             </p>

             {(camp.departments?.length > 0 || camp.services?.length > 0) && (
                <div className="pt-6 mt-4 border-t border-white/5 space-y-6">
                   {camp.departments?.length > 0 && (
                      <div className="space-y-3">
                         <h4 className="text-xs font-semibold text-white/40 uppercase">Departments Involved</h4>
                         <div className="flex flex-wrap gap-2">
                           {camp.departments.map((d, i) => (
                              <span key={i} className="px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-lg text-xs font-medium">{d}</span>
                           ))}
                         </div>
                      </div>
                   )}
                   {camp.services?.length > 0 && (
                      <div className="space-y-3">
                         <h4 className="text-xs font-semibold text-white/40 uppercase">Services Provided</h4>
                         <div className="flex flex-wrap gap-2">
                           {camp.services.map((s, i) => (
                              <span key={i} className="px-3 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan rounded-lg text-xs font-medium flex items-center gap-1.5">
                                <Activity size={12} /> {s}
                              </span>
                           ))}
                         </div>
                      </div>
                   )}
                </div>
             )}
          </div>

          {/* Doctors List */}
          {camp.doctors?.length > 0 && (
            <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 space-y-5">
               <h3 className="text-sm font-bold text-accent-green uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} /> Medical Team
               </h3>
               <div className="grid sm:grid-cols-2 gap-4">
                  {camp.doctors.map((doc, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0">
                          <Users size={18} className="text-accent-green" />
                       </div>
                       <div>
                         <h4 className="font-bold text-white text-sm">{doc.doctorName}</h4>
                         <p className="text-xs text-white/40">{doc.specialization}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Map Section */}
          {camp.location?.latitude && camp.location?.longitude && (
             <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-accent-green uppercase tracking-wider flex items-center gap-2">
                   <MapPin size={16} /> Location Map
                </h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start mb-4">
                   <MapPin className="text-amber-400 mt-0.5 shrink-0" size={18} />
                   <div>
                     <p className="text-sm font-medium text-white">{camp.location.addressLine}</p>
                     <p className="text-xs text-white/50 mt-1">{camp.location.city}, {camp.location.state} - {camp.location.pincode}</p>
                   </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/10 z-0 relative shadow-inner" style={{ height: 280 }}>
                   <MapContainer 
                      center={[camp.location.latitude, camp.location.longitude]} 
                      zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}
                   >
                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                     <Marker position={[camp.location.latitude, camp.location.longitude]} />
                   </MapContainer>
                </div>
             </div>
          )}

        </div>

        {/* Sticky Sidebar Right */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-accent-green/20 sticky top-24 shadow-xl">
             
             {/* Date Banner */}
             <div className="flex items-center gap-4 pb-5 border-b border-white/10 mb-5">
               <div className="w-12 h-12 rounded-2xl bg-accent-green/15 text-accent-green flex flex-col items-center justify-center font-bold">
                  <span className="text-xs font-medium uppercase">{new Date(camp.startDate).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg leading-none">{new Date(camp.startDate).getDate()}</span>
               </div>
               <div>
                  <p className="text-sm font-bold text-white">{new Date(camp.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}</p>
                  <p className="text-xs text-amber-400 mt-1 flex items-center gap-1.5"><Clock size={12}/> {camp.startTime} - {camp.endTime}</p>
               </div>
             </div>

             <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                   <span className="text-white/50">Capacity</span>
                   <span className="text-white font-medium">{camp.totalRegistrations} / {camp.maxParticipants} slots filled</span>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                   <div 
                      className="h-full bg-gradient-to-r from-accent-green to-accent-cyan rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (camp.totalRegistrations / camp.maxParticipants) * 100)}%` }}
                   />
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                   <span className="text-white/50">Entry</span>
                   <span className="text-accent-green font-bold bg-accent-green/10 px-2 py-0.5 rounded text-xs border border-accent-green/20">
                      {camp.isFree ? 'FREE' : `₹${camp.campFee}`}
                   </span>
                </div>

                {camp.registrationDeadline && (
                  <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mt-4">
                     <p className="text-xs text-red-400 flex items-center justify-between">
                        <span>Registration Closes:</span>
                        <span className="font-bold">{new Date(camp.registrationDeadline).toLocaleDateString()}</span>
                     </p>
                  </div>
                )}
             </div>

             {/* Action Button */}
             {camp.status !== 'published' ? (
                <div className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-medium flex items-center justify-center gap-2">
                  <Info size={16} /> Camp is {camp.status}
                </div>
             ) : isRegistered ? (
               <div className="w-full py-3.5 rounded-xl border border-accent-green/30 bg-accent-green/5 text-accent-green text-sm font-bold flex items-center justify-center gap-2 shadow-glow-primary">
                 <CheckCircle size={18} /> You are Registered!
               </div>
             ) : (
               <button 
                  onClick={handleRegister} 
                  disabled={registering}
                  className="w-full btn-primary py-3.5 text-sm font-bold shadow-glow-primary flex items-center justify-center gap-2"
               >
                 {registering ? <><Loader2 size={18} className="animate-spin" /> Reserving Spot...</> : 'Reserve My Spot'}
               </button>
             )}
             
             {(camp.hospital?.contactNumber || camp.contactNumber) && (
               <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1.5">
                  <Phone size={12} /> Contact Organizer: {camp.hospital?.contactNumber || camp.contactNumber}
               </p>
             )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default CampDetails;
