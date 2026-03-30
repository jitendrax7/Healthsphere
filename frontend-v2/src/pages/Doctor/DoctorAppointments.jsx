import { useState } from 'react';
import { Activity, History } from 'lucide-react';
import ActiveAppointments from '../../components/doctor/ActiveAppointments';
import AppointmentHistory from '../../components/doctor/AppointmentHistory';
import { appointmentApi } from '../../api/axios';

const MAIN_TABS = [
  { key: 'active',  label: 'Active',  icon: Activity, desc: 'Pending & Confirmed' },
  { key: 'history', label: 'History', icon: History,  desc: 'Completed, Rejected & Cancelled' },
];

const DoctorAppointments = () => {
  const [tab, setTab]     = useState('active');
  const [acting, setActing] = useState(null);

  const handleAction = async (id, action, remark) => {
    setActing(id + action);
    const statusMap = { confirm: 'confirmed', reject: 'rejected', complete: 'completed', cancel: 'cancelled' };
    try {
      await appointmentApi.updateStatus(id, statusMap[action], remark);
    } catch (_) {}
    finally { setActing(null); }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Page Header + Main Tabs */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">Appointments</h1>
          <p className="text-white/40 mt-1">Manage and review patient appointments</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 glass rounded-2xl">
          {MAIN_TABS.map(({ key, label, icon: Icon, desc }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === key
                  ? key === 'active'
                    ? 'bg-primary-600 text-white shadow-glow-primary'
                    : 'bg-accent-orange/80 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              title={desc}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Section Indicator */}
      <div className={`h-0.5 rounded-full w-full bg-gradient-to-r ${
        tab === 'active' ? 'from-primary-500/40 to-accent-cyan/20' : 'from-accent-orange/40 to-accent-pink/20'
      } transition-all duration-500`} />

      {/* Content */}
      {tab === 'active'
        ? <ActiveAppointments onAction={handleAction} acting={acting} />
        : <AppointmentHistory />
      }

    </div>
  );
};

export default DoctorAppointments;
