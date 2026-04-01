import { useNavigate } from 'react-router-dom';
import { MapPin, Stethoscope } from 'lucide-react';

const DoctorCard = ({ doctor: d }) => {
  const navigate = useNavigate();

  return (
    <div className="glass p-3 sm:p-4 rounded-2xl flex flex-col group hover:border-white/20 transition-all overflow-hidden relative">
      <div className="relative w-full h-48 sm:h-64 mb-4 rounded-xl overflow-hidden bg-dark-800 flex-shrink-0">
        {d.image ? (
          <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-accent-cyan/20 flex flex-col items-center justify-center text-primary-400 group-hover:scale-105 transition-transform duration-500">
            <Stethoscope size={40} className="opacity-50 mb-2" />
            <span className="text-xl font-bold opacity-50">{d.name.trim()[0].toUpperCase()}</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-accent-cyan border border-white/10 shadow-lg">
          {d.experience} Yrs Exp
        </div>
      </div>

      <div className="flex-1 px-1 flex flex-col">
        <h3 className="font-bold text-white text-lg leading-tight mb-1 truncate" title={d.name}>{d.name}</h3>
        <p className="text-primary-400 text-sm font-medium mb-3">{d.specialization}</p>

        <div className="space-y-2.5 mb-4 mt-auto">
          <p className="text-white/60 text-sm flex items-start gap-2">
            <MapPin size={15} className="mt-0.5 opacity-70 flex-shrink-0" />
            <span className="line-clamp-2 leading-tight">{d.clinic?.clinicName || 'Clinic'}, {d.clinic?.city || 'Unknown'}</span>
          </p>
          <p className="text-white/80 text-sm flex items-center gap-2 font-medium">
            <span className="text-primary-400 font-bold">₹{d.consultationFee}</span>
            <span className="text-xs font-normal opacity-60 uppercase tracking-wide">Consultation</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/user/appointment/' + (d.doctorId || d._id))}
          className="btn-primary w-full text-sm py-2.5 mt-auto"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
