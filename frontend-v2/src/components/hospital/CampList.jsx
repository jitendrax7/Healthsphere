import { useState, useEffect } from 'react';
import { Loader2, Tent, Calendar, Clock, MapPin, Users, Phone, X, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { hospitalApi } from '../../api/axios';

/* ── Leaflet Icon Fix ─────────────────────────────────────── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CampList = ({ onEdit }) => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await hospitalApi.getCamps();
      setCamps(res.data.camps || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch camps');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (campId) => {
    setDetailsLoading(true);
    // acts as a loading placeholder but extracts id robustly 
    // since MongoDB might return id or _id
    setSelectedCamp({ id: campId }); 
    try {
      const res = await hospitalApi.getCampById(campId);
      setSelectedCamp(res.data.camp || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusUpdate = async (campId, newStatus) => {
    setActionLoading(true);
    try {
      await hospitalApi.updateCampStatus(campId, newStatus);
      // Optimistic locally update
      setSelectedCamp(prev => ({ ...prev, status: newStatus }));
      setCamps(prev => prev.map(c => 
         (c._id === campId || c.id === campId) ? { ...c, status: newStatus } : c
      ));
    } catch (err) {
      alert("Failed to update status. " + (err.response?.data?.message || ''));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-white/50 space-y-4 pt-20">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
        <p>Loading your camps...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex flex-col items-center gap-3 mt-10">
        <AlertCircle size={24} />
        <p>{error}</p>
        <button onClick={fetchCamps} className="btn-primary px-4 py-2 mt-2 text-sm">Retry Request</button>
      </div>
    );
  }

  if (camps.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto mt-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
           <Tent size={28} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">No Camps Organized Yet</h3>
          <p className="text-white/40 text-sm max-w-sm mx-auto">
            Organizing healthcare camps is a great way to serve the community. Click "Organize New Camp" to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {camps.map(camp => (
          <div key={camp.id || camp._id} className="glass rounded-2xl p-5 border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full relative overflow-hidden">
            
            {/* Status Badge */}
            <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-lg ${
                camp.status === 'draft' ? 'bg-amber-500/20 text-amber-500 border-b border-l border-amber-500/20' : 
                camp.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-b border-l border-blue-500/20' :
                camp.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-b border-l border-red-500/20' :
                'bg-emerald-500/20 text-emerald-400 border-b border-l border-emerald-500/20'
            }`}>
              {camp.status || 'Published'}
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-[80px] h-[80px] rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 relative">
                {camp.posterImage ? (
                  <img src={camp.posterImage.url || camp.posterImage} alt={camp.title} className="w-full h-full object-cover" />
                ) : (
                  <Tent size={32} className="text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 pr-8">
                <h3 className="text-lg font-bold text-white truncate">{camp.title}</h3>
                <p className="text-xs text-emerald-400 font-medium capitalize mb-2">{camp.campType?.replace('_', ' ')}</p>
                <div className="space-y-1.5 pt-1 border-t border-white/5">
                  <p className="text-xs text-white/50 flex items-center gap-1.5 truncate">
                    <Calendar size={12} className="text-blue-400" /> {new Date(camp.startDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-3">
                    <p className="text-[11px] text-white/50 flex items-center gap-1.25">
                      <Clock size={11} className="text-amber-400 mr-1" /> {camp.startTime} - {camp.endTime}
                    </p>
                    <p className="text-[11px] text-white/50 flex items-center gap-1.25 border-l border-white/10 pl-3">
                      <Users size={11} className="text-emerald-400 mr-1" /> {camp.totalRegistrations} / {camp.maxParticipants}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-5">
              <button onClick={() => handleViewDetails(camp.id || camp._id)} className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10 group-hover:border-emerald-500/30">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCamp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !actionLoading && setSelectedCamp(null)} />
          <div className="glass rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative z-10 animate-fade-in border border-white/10 shadow-2xl overflow-hidden">
            
            <button onClick={() => setSelectedCamp(null)} disabled={actionLoading} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-red-500/80 hover:text-white rounded-full text-white/70 transition-all z-20 backdrop-blur-md">
              <X size={18} />
            </button>

            {detailsLoading || !selectedCamp.title ? (
               <div className="p-20 flex flex-col items-center justify-center text-white/50 gap-4">
                  <Loader2 size={32} className="animate-spin text-emerald-400" />
                  <p>Loading camp details...</p>
               </div>
            ) : (
               <>
                 <div className="overflow-y-auto overflow-x-hidden relative custom-scrollbar flex-1">
                    {/* Banner Header */}
                    <div className="h-48 md:h-64 w-full relative">
                      {selectedCamp.posterImage ? (
                        <img src={selectedCamp.posterImage.url || selectedCamp.posterImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-emerald-500/20 to-teal-900/40 flex items-center justify-center">
                          <Tent size={48} className="text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                         <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 shadow-lg backdrop-blur-md ${
                            selectedCamp.status === 'draft' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 
                            selectedCamp.status === 'completed' ? 'bg-blue-500/40 text-blue-200 border border-blue-400' :
                            selectedCamp.status === 'cancelled' ? 'bg-red-500/40 text-red-200 border border-red-400' :
                            'bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                         }`}>
                            {selectedCamp.status || 'Published'}
                         </span>
                         <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">{selectedCamp.title}</h2>
                         <p className="text-emerald-400 font-medium capitalize flex items-center gap-2">
                           <Tent size={14} /> {selectedCamp.campType?.replace('_', ' ')}
                         </p>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="p-6 md:p-8 space-y-8">
                      
                      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                         <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Description</h4>
                         <p className="text-sm text-white/70 leading-relaxed">{selectedCamp.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex gap-3 items-start">
                           <Calendar className="text-violet-400 mt-1" size={18} />
                           <div>
                             <p className="text-xs text-white/40 mb-1">Date & Time</p>
                             <p className="text-sm text-white font-medium">{new Date(selectedCamp.startDate).toLocaleDateString()}</p>
                             <p className="text-xs text-white/60">{selectedCamp.startTime} - {selectedCamp.endTime}</p>
                           </div>
                         </div>
                         <div className="flex gap-3 items-start">
                           <Users className="text-blue-400 mt-1" size={18} />
                           <div>
                             <p className="text-xs text-white/40 mb-1">Capacity</p>
                             <p className="text-sm text-white font-medium">{selectedCamp.maxParticipants} max</p>
                             <p className="text-xs text-white/60 text-amber-400 truncate">Deadline: {new Date(selectedCamp.registrationDeadline).toLocaleDateString()}</p>
                           </div>
                         </div>
                         <div className="flex gap-3 items-start col-span-2">
                           <MapPin className="text-amber-400 mt-1 min-w-[18px]" size={18} />
                           <div>
                             <p className="text-xs text-white/40 mb-1">Venue Details</p>
                             <p className="text-sm text-white font-medium">{selectedCamp.location?.addressLine}</p>
                             <p className="text-xs text-white/60">{selectedCamp.location?.city}, {selectedCamp.location?.state} - {selectedCamp.location?.pincode}</p>
                           </div>
                         </div>
                      </div>

                      {(selectedCamp.departments?.length > 0 || selectedCamp.services?.length > 0) && (
                        <div className="border-t border-white/5 pt-6 grid sm:grid-cols-2 gap-6">
                           {selectedCamp.departments?.length > 0 && (
                              <div>
                                 <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Departments</h4>
                                 <div className="flex flex-wrap gap-2">
                                   {selectedCamp.departments.map((d, i) => (
                                      <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">{d}</span>
                                   ))}
                                 </div>
                              </div>
                           )}
                           {selectedCamp.services?.length > 0 && (
                              <div>
                                 <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Services</h4>
                                 <div className="flex flex-wrap gap-2">
                                   {selectedCamp.services.map((s, i) => (
                                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">{s}</span>
                                   ))}
                                 </div>
                              </div>
                           )}
                        </div>
                      )}

                      {selectedCamp.doctors?.length > 0 && (
                        <div className="border-t border-white/5 pt-6">
                           <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Organizing Doctors</h4>
                           <div className="grid sm:grid-cols-2 gap-3">
                              {selectedCamp.doctors.map((doc, i) => (
                                 <div key={i} className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/10">
                                    <span className="text-sm font-medium text-white">{doc.doctorName}</span>
                                    <span className="text-xs text-white/40">{doc.specialization}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                      )}

                      {/* Map Display */}
                      {selectedCamp.location?.geo?.coordinates?.length === 2 && (
                        <div className="border-t border-white/5 pt-6">
                           <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2"><MapPin size={14}/> Interactive Map</h4>
                           <div className="rounded-xl overflow-hidden border border-white/10 relative z-0" style={{ height: 200 }}>
                             {/* Lat is coords[1], Lng is coords[0] from Mongo GeoJSON Point */}
                             <MapContainer 
                                center={[selectedCamp.location.geo.coordinates[1], selectedCamp.location.geo.coordinates[0]]} 
                                zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}
                             >
                               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                               <Marker position={[selectedCamp.location.geo.coordinates[1], selectedCamp.location.geo.coordinates[0]]} />
                             </MapContainer>
                           </div>
                        </div>
                      )}

                    </div>
                 </div>

                 {/* Action Bar for Status Updates */}
                 {(selectedCamp.status === 'draft' || selectedCamp.status === 'published') && (
                    <div className="bg-white/5 border-t border-white/10 p-5 flex flex-wrap gap-3 justify-end items-center relative z-20 shrink-0">
                       
                       {selectedCamp.status === 'draft' && (
                         <>
                           <button disabled={actionLoading} onClick={() => onEdit(selectedCamp)} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                              Edit Camp
                           </button>
                           <button disabled={actionLoading} onClick={() => handleStatusUpdate(selectedCamp.id || selectedCamp._id, 'published')} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
                             {actionLoading ? <><Loader2 size={16} className="animate-spin"/> Parsing</> : 'Publish Now'}
                           </button>
                         </>
                       )}

                       {selectedCamp.status === 'published' && (
                         <>
                           <button disabled={actionLoading} onClick={() => handleStatusUpdate(selectedCamp.id || selectedCamp._id, 'cancelled')} className="px-5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all">
                              Cancel Camp
                           </button>
                           <button disabled={actionLoading} onClick={() => handleStatusUpdate(selectedCamp.id || selectedCamp._id, 'completed')} className="px-6 py-2.5 rounded-xl border border-blue-500/30 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-sm font-medium transition-all">
                              Mark Completed
                           </button>
                         </>
                       )}
                    </div>
                 )}
               </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampList;
