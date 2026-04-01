import { ChevronRight } from 'lucide-react';

const DiseaseCard = ({ id, icon: Icon, title, desc, color, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    className="glass p-5 sm:p-6 rounded-2xl text-left group hover:-translate-y-1 hover:border-white/20 transition-all duration-300 w-full"
  >
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon size={22} className="text-white" />
    </div>
    <h3 className="font-semibold text-white mb-2">{title}</h3>
    <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    <div className="flex items-center gap-1 mt-4 text-primary-400 text-sm font-medium">
      Start Assessment <ChevronRight size={14} />
    </div>
  </button>
);

export default DiseaseCard;
