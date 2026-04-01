import {
  Star, Briefcase, IndianRupee, MapPin, Video, Stethoscope,
  Languages, Activity, GraduationCap, Calendar, Clock, Navigation
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DAYS_SHORT = { Monday:'Mon', Tuesday:'Tue', Wednesday:'Wed', Thursday:'Thu', Friday:'Fri', Saturday:'Sat', Sunday:'Sun' };

const Tag = ({ label, color = 'bg-white/5 text-white/60 border-white/10' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${color}`}>{label}</span>
);

const InfoChip = ({ icon: Icon, label, color = 'text-white/50' }) => (
  <span className={`flex items-center gap-1 text-xs font-medium ${color} bg-white/5 border border-white/8 px-2.5 py-1 rounded-full`}>
    <Icon size={10} />{label}
  </span>
);

const DoctorProfileCard = ({ doctor, professional, qualifications, languages, services, clinic, availability }) => (
  <div className="space-y-4">
    <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-xl">
      <div className="h-20 sm:h-24 bg-gradient-to-br from-primary-600/40 via-accent-cyan/20 to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
      </div>
      <div className="px-4 sm:px-6 pb-5 sm:pb-6 -mt-10 sm:-mt-12 relative">
        <div className="flex items-end justify-between mb-4">
          {doctor.profilePhoto ? (
            <img src={doctor.profilePhoto} alt={doctor.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-dark-900 shadow-2xl" />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-cyan flex items-center justify-center text-2xl sm:text-3xl font-bold text-white border-4 border-dark-900 shadow-2xl">
              {doctor.name?.[0]?.toUpperCase() || 'D'}
            </div>
          )}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={11} className={s <= Math.round(doctor.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/15'} />
              ))}
            </div>
            <p className="text-[10px] text-white/40 mt-0.5">{doctor.reviewCount > 0 ? `${doctor.reviewCount} reviews` : 'No reviews yet'}</p>
          </div>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-white">{doctor.name}</h1>
        <p className="text-primary-400 font-semibold text-sm mt-0.5">{professional.specialization}</p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3">
          {professional.experience > 0 && <InfoChip icon={Briefcase} label={`${professional.experience} yrs exp`} />}
          <InfoChip icon={IndianRupee} label={`₹${professional.consultationFee} / visit`} color="text-green-400" />
          {doctor.city && <InfoChip icon={MapPin} label={doctor.city} />}
          {professional.consultationMode && (
            <InfoChip
              icon={professional.consultationMode === 'online' ? Video : Stethoscope}
              label={professional.consultationMode === 'both' ? 'Online & In-person' : professional.consultationMode}
              color="text-accent-cyan"
            />
          )}
        </div>

        {professional.bio && (
          <p className="text-white/60 text-sm leading-relaxed mt-4 pt-4 border-t border-white/8">{professional.bio}</p>
        )}
      </div>
    </div>

    {(languages.length > 0 || services.length > 0) && (
      <div className="glass rounded-2xl p-4 sm:p-5 border border-white/5 space-y-4">
        {languages.length > 0 && (
          <div>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5"><Languages size={11} />Languages</p>
            <div className="flex flex-wrap gap-2">{languages.map(l => <Tag key={l} label={l} />)}</div>
          </div>
        )}
        {services.length > 0 && (
          <div>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5"><Activity size={11} />Services</p>
            <div className="flex flex-wrap gap-2">{services.map(s => <Tag key={s} label={s} color="bg-accent-cyan/8 text-accent-cyan border-accent-cyan/20" />)}</div>
          </div>
        )}
      </div>
    )}

    {qualifications.length > 0 && (
      <div className="glass rounded-2xl p-4 sm:p-5 border border-white/5">
        <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5"><GraduationCap size={11} />Qualifications</p>
        <div className="space-y-2">
          {qualifications.map((q, i) => (
            <div key={i} className="flex gap-3 p-3 bg-white/3 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-primary-500/15 flex items-center justify-center shrink-0">
                <GraduationCap size={14} className="text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{q.degree}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{q.institute}{q.year ? ` · ${q.year}` : ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {availability && (
      <div className="glass rounded-2xl p-4 sm:p-5 border border-white/5">
        <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5"><Calendar size={11} />Availability</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
            <span key={d} className={`px-2 py-1 rounded-lg text-[10px] font-bold ${availability.availableDays?.includes(d) ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-white/3 text-white/20'}`}>
              {DAYS_SHORT[d]}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between bg-white/3 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Clock size={13} className="text-accent-cyan" />
            {availability.startTime} – {availability.endTime}
          </div>
          <span className="text-[11px] font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded">
            {availability.slotDuration}m slots
          </span>
        </div>
        <div className={`mt-3 flex items-center gap-1.5 text-[11px] font-bold ${availability.bookingEnabled ? 'text-green-400' : 'text-red-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${availability.bookingEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          {availability.bookingEnabled ? 'Accepting appointments' : 'Not accepting new appointments'}
        </div>
      </div>
    )}

    {clinic && (
      <div className="glass rounded-2xl p-4 sm:p-5 border border-white/5">
        <p className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-3 flex items-center gap-1.5"><Navigation size={11} />Clinic Location</p>
        <p className="text-sm font-bold text-white mb-1">{clinic.clinicName}</p>
        <p className="text-xs text-white/50 mb-3 leading-relaxed">
          {[clinic.address, clinic.city, clinic.state, clinic.pincode].filter(Boolean).join(', ')}
        </p>
        {clinic.latitude && clinic.longitude && (
          <div className="h-40 sm:h-44 rounded-xl overflow-hidden border border-white/10">
            <MapContainer center={[clinic.latitude, clinic.longitude]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[clinic.latitude, clinic.longitude]} />
            </MapContainer>
          </div>
        )}
      </div>
    )}
  </div>
);

export default DoctorProfileCard;
