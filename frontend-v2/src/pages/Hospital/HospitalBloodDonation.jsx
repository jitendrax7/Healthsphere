import { useState } from 'react';
import { Droplets, Plus, List, CheckCircle2 } from 'lucide-react';
import BloodRequestForm from '../../components/blood/hospital/BloodRequestForm';
import BloodRequestList from '../../components/blood/hospital/BloodRequestList';
import BloodRequestDetail from '../../components/blood/hospital/BloodRequestDetail';

const TABS = [
  { key: 'new',      label: 'New Request', icon: Plus },
  { key: 'requests', label: 'My Requests', icon: List },
];

const HospitalBloodDonation = () => {
  const [tab, setTab]                     = useState('new');
  const [submitted, setSubmitted]         = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
          <Droplets size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Blood Donation</h1>
          <p className="text-white/40 text-xs sm:text-sm">Post requests, manage donors and track blood drives</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 glass rounded-xl w-full sm:w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setTab(key); setSubmitted(false); }}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? 'bg-red-500/20 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {tab === 'new' && (
          submitted ? (
            <div className="glass rounded-2xl p-8 sm:p-12 text-center max-w-md">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Request Submitted!</h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                Matched donors have been notified. Track responses in <strong className="text-white/70">My Requests</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <button
                  onClick={() => { setSubmitted(false); setTab('new'); }}
                  className="btn-primary text-sm flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Post Another
                </button>
                <button
                  onClick={() => { setTab('requests'); setSubmitted(false); }}
                  className="btn-secondary text-sm flex items-center justify-center gap-2"
                >
                  <List size={14} /> View Requests
                </button>
              </div>
            </div>
          ) : (
            <BloodRequestForm onSuccess={() => setSubmitted(true)} />
          )
        )}

        {tab === 'requests' && (
          <BloodRequestList onSelectRequest={setSelectedRequest} />
        )}
      </div>

      {selectedRequest && (
        <BloodRequestDetail
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default HospitalBloodDonation;
