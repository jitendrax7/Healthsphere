import { Loader2, Save, Pencil, X } from 'lucide-react';

const ProfileSectionCard = ({
  icon: Icon,
  title,
  accent = 'primary',
  saving,
  onSave,
  editKey,
  activeEdit,
  setActiveEdit,
  children
}) => {
  const isEditing = activeEdit === editKey;
  const colors = {
    primary: 'text-primary-400 border-primary-500/30 bg-primary-500/5',
    cyan: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/5',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
    green: 'text-green-400 border-green-500/30 bg-green-500/5',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/5'
  };
  const col = colors[accent] || colors.primary;

  return (
    <div className={`glass rounded-2xl border transition-all duration-300 ${isEditing ? `border-${accent === 'primary' ? 'primary' : accent}-500/40 shadow-lg` : 'border-white/5'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${col.split(' ').slice(1).join(' ')}`}>
            <Icon size={15} className={col.split(' ')[0]} />
          </div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isEditing && onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-xs font-bold shadow-glow-primary disabled:opacity-60 transition-all"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} Save
            </button>
          )}
          <button
            onClick={() => setActiveEdit(isEditing ? null : editKey)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isEditing ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
          >
            {isEditing ? <><X size={11} /> Cancel</> : <><Pencil size={11} /> Edit</>}
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};

export default ProfileSectionCard;
