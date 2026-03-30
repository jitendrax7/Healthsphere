import { useState } from 'react';
import { Tent, LayoutList, PlusCircle } from 'lucide-react';
import CampCreateForm from '../../components/hospital/CampCreateForm';
import CampList from '../../components/hospital/CampList';

const HospitalHealthcareCamp = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'
  const [editingCamp, setEditingCamp] = useState(null);

  const handleEdit = (campData) => {
    setEditingCamp(campData);
    setActiveTab('create');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-fade-in">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-glow-primary flex-shrink-0">
            <Tent size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Healthcare Camps</h1>
            <p className="text-secondary-400 text-sm">Organize and manage your community health events</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 glass rounded-xl">
          <button
            onClick={() => { setEditingCamp(null); setActiveTab('list'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <LayoutList size={16} /> My Camps
          </button>
          <button
            onClick={() => { setEditingCamp(null); setActiveTab('create'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'create' ? 'bg-emerald-500/20 text-emerald-300 shadow-sm' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <PlusCircle size={16} /> Organize New
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {activeTab === 'list' && <CampList onEdit={handleEdit} />}
        {activeTab === 'create' && <CampCreateForm initialData={editingCamp} onFinish={() => { setActiveTab('list'); setEditingCamp(null); }} />}
      </div>

    </div>
  );
};

export default HospitalHealthcareCamp;
