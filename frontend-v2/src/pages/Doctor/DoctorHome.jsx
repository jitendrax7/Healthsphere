import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, CheckCircle, Clock, XCircle, FileCheck, AlertCircle, Loader2, User,
  ShieldAlert, ToggleLeft, X, ArrowRight, Sparkles
} from 'lucide-react';
import { appointmentApi } from '../../api/axios';
import { useApp } from '../../context/AppContext';

const STATUS_STYLE = {
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const StatCard = ({ label, value, icon: Icon, gradient, loading }) => (
  <div className="stat-card">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
      <Icon size={18} className="text-white" />
    </div>
    {loading
      ? <div className="w-10 h-8 bg-white/10 rounded-lg animate-pulse mb-1" />
      : <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
    }
    <p className="text-white/40 text-xs mt-1">{label}</p>
  </div>
);

const DoctorHome = () => {
  const { user, doctorCtx } = useApp();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [dismissProfile, setDismissProfile]   = useState(false);
  const [dismissBooking, setDismissBooking]   = useState(false);

  useEffect(() => {
    appointmentApi.getAnalytics()
      .then(r => setAnalytics(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const showProfileModal  = !doctorCtx.doctorProfileComplete && !dismissProfile;
  const showBookingBanner = !doctorCtx.bookingEnabled        && !dismissBooking  && doctorCtx.doctorProfileComplete;

  const stats = [
    { label: 'Total Appointments',   value: analytics?.totalAppointments ?? 0,  icon: Calendar,     gradient: 'from-primary-500 to-primary-700'    },
    { label: "Today's Appointments", value: analytics?.todayAppointments  ?? 0,  icon: Clock,        gradient: 'from-accent-cyan to-primary-500'    },
    { label: 'Confirmed',            value: analytics?.confirmed          ?? 0,  icon: CheckCircle,  gradient: 'from-green-500 to-accent-cyan'       },
    { label: 'Pending',              value: analytics?.pending            ?? 0,  icon: AlertCircle,  gradient: 'from-yellow-500 to-accent-orange'    },
    { label: 'Completed',            value: analytics?.completed          ?? 0,  icon: FileCheck,    gradient: 'from-blue-500 to-primary-500'        },
    { label: 'Cancelled',            value: analytics?.cancelled          ?? 0,  icon: XCircle,      gradient: 'from-red-500 to-accent-pink'         },
  ];

  const recent = analytics?.recentAppointments || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="relative bg-dark-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-fade-in overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <button onClick={() => setDismissProfile(true)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-colors">
              <X size={16} />
            </button>
            <div className="flex flex-col items-center text-center gap-5 relative z-10">
              <div className="relative">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <ShieldAlert size={32} className="text-amber-400" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-amber-500 rounded-full animate-ping opacity-60" />
                <span className="absolute -top-1 -right-1 w-4 sm:w-5 h-4 sm:h-5 bg-amber-500 rounded-full" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Profile Incomplete</h2>
                <p className="text-white/50 text-xs sm:text-sm mt-2 leading-relaxed">
                  Complete your profile so patients can discover and book appointments with you.
                </p>
              </div>
              <div className="w-full space-y-2 text-left">
                {['Specialization', 'Consultation Fee', 'Available Days', 'Clinic Location'].map(f => (
                  <div key={f} className="flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-white/70">{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button onClick={() => setDismissProfile(true)}
                  className="w-full sm:flex-1 py-2.5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 rounded-xl text-sm font-medium transition-all order-2 sm:order-1">
                  Later
                </button>
                <button onClick={() => { setDismissProfile(true); navigate('/doctor/profile'); }}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 rounded-xl text-sm font-semibold transition-all order-1 sm:order-2">
                  Complete Profile <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingBanner && (
        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 sm:p-5">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="relative flex-shrink-0 mt-1 sm:mt-0">
                <ToggleLeft size={28} className="text-yellow-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
              </div>
              <div>
                <p className="text-yellow-400 font-semibold text-sm sm:text-base">Booking is disabled</p>
                <p className="text-white/40 text-xs sm:text-sm mt-0.5 max-w-md">Enable booking from your profile so patients can schedule appointments.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button onClick={() => navigate('/doctor/profile')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20 rounded-xl text-xs sm:text-sm font-semibold transition-all">
                Profile <ArrowRight size={13} />
              </button>
              <button onClick={() => setDismissBooking(true)}
                className="p-2 text-white/30 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glass p-5 sm:p-7 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 to-primary-500/10 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-accent-cyan text-xs sm:text-sm font-medium mb-1">Welcome back</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dr. {user?.Name || 'Doctor'} 👋</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1 sm:mt-1.5">Here's your appointment analytics for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-white text-sm sm:text-base">Recent Appointments</h2>
          {!loading && !error && (
            <span className="text-[10px] sm:text-xs text-white/30 bg-white/5 px-2.5 py-1 rounded-full">
              {recent.length} record{recent.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 sm:py-12 gap-3">
            <Loader2 size={20} className="animate-spin text-primary-500" />
            <span className="text-white/40 text-xs sm:text-sm">Loading analytics…</span>
          </div>
        ) : error ? (
          <div className="py-8 sm:py-10 text-center text-red-400/60 text-xs sm:text-sm">
            Failed to load analytics data.
          </div>
        ) : recent.length === 0 ? (
          <div className="py-10 sm:py-12 text-center text-white/30 text-xs sm:text-sm">No recent appointments.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 sm:py-4 hover:bg-white/5 transition-colors gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-br from-accent-cyan/30 to-primary-500/30 flex items-center justify-center flex-shrink-0">
                    <User size={13} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-xs sm:text-sm">
                      {a.Name || a.name || `Appointment #${a.id?.slice(-6)}`}
                    </p>
                    <p className="text-white/40 text-[10px] sm:text-xs mt-0.5">
                      {formatDate(a.date)} &bull; {a.startTime} – {a.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto ml-11 sm:ml-0">
                  {a.cancelledByRole && a.status === 'cancelled' && (
                    <span className="text-[10px] sm:text-[11px] text-white/30 border border-white/10 rounded-full px-2 py-0.5">
                      by {a.cancelledByRole}
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs border font-medium capitalize ${STATUS_STYLE[a.status] || STATUS_STYLE.pending}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorHome;
