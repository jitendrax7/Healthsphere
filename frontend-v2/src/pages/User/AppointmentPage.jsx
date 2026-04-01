import { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { appointmentApi } from '../../api/axios';
import DoctorCard from '../../components/user/appointments/DoctorCard';
import AppointmentCard from '../../components/user/appointments/AppointmentCard';
import AppointmentInfoModal from '../../components/user/appointments/AppointmentInfoModal';

const AppointmentPage = () => {
  const [tab, setTab]         = useState('doctors');
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [myAppts, setMyAppts] = useState([]);
  const [history, setHistory] = useState([]);
  const [infoId, setInfoId]           = useState(null);
  const [infoData, setInfoData]       = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);

  const fetchDoctors = () => {
    setLoading(true);
    appointmentApi.getDoctors().then(r => setDoctors(r.data.doctors || [])).catch(() => {}).finally(() => setLoading(false));
  };
  const fetchMyAppts = () => {
    setLoading(true);
    appointmentApi.getUserList().then(r => setMyAppts(r.data.appointments || [])).catch(() => {}).finally(() => setLoading(false));
  };
  const fetchHistory = () => {
    setLoading(true);
    appointmentApi.getHistoryList().then(r => setHistory(r.data.appointments || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (tab === 'doctors') fetchDoctors();
    if (tab === 'my') fetchMyAppts();
    if (tab === 'history') fetchHistory();
  }, [tab]);

  const loadMoreInfo = async (id) => {
    setInfoId(id); setInfoLoading(true); setInfoData(null);
    try {
      const res = await appointmentApi.getAppointment(id);
      setInfoData(res.data);
    } catch {
      setInfoData({ error: 'Failed to load details' });
    } finally { setInfoLoading(false); }
  };

  const TABS = [
    ['doctors', '👨‍⚕️ Doctors'],
    ['my', '🗂️ My Appts'],
    ['history', '🕒 History'],
  ];

  return (
    <div className="space-y-5 animate-fade-in relative min-h-screen">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Appointments</h1>
        <p className="text-white/40 text-sm md:text-base">Find doctors, book slots, and manage your history</p>
      </div>

      <div className="flex gap-1.5 p-1 glass rounded-xl w-full sm:w-fit overflow-x-auto">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              tab === k ? 'bg-primary-600 text-white shadow-glow-primary' : 'text-white/50 hover:text-white'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === 'doctors' && (
        <div className="space-y-4 pt-1">
          {loading && <div className="flex items-center gap-2 text-white/50"><Loader2 size={16} className="animate-spin" /> Loading doctors...</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {doctors.map(d => <DoctorCard key={d.doctorId} doctor={d} />)}
          </div>
        </div>
      )}

      {(tab === 'my' || tab === 'history') && (
        <div className="space-y-4 pt-1">
          {loading && <div className="flex items-center gap-2 text-white/50"><Loader2 size={16} className="animate-spin" /> Loading appointments...</div>}
          {!loading && (tab === 'my' ? myAppts : history).length === 0 && (
            <div className="glass p-10 sm:p-12 rounded-2xl text-center text-white/40 mt-4">
              <Calendar size={36} className="mx-auto mb-3 opacity-30" />
              <p>No {tab === 'my' ? 'upcoming' : 'past'} appointments found.</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(tab === 'my' ? myAppts : history).map(a => (
              <AppointmentCard key={a.id} appointment={a} onMoreInfo={loadMoreInfo} />
            ))}
          </div>
        </div>
      )}

      {infoId && (
        <AppointmentInfoModal
          infoId={infoId}
          infoData={infoData}
          infoLoading={infoLoading}
          onClose={() => setInfoId(null)}
          onRefresh={loadMoreInfo}
        />
      )}
    </div>
  );
};

export default AppointmentPage;
