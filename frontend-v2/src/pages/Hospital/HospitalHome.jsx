import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2, Droplets, Tent, Users, Activity,
  TrendingUp, ArrowRight, Plus, Heart, Calendar,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Mini stat card ── */
const StatCard = ({ icon: Icon, label, value, sub, color, gradient }) => (
  <div className="glass rounded-2xl p-5 flex items-start gap-4 group hover:scale-[1.02] transition-transform duration-300">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${gradient}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-white leading-tight">{value}</p>
      <p className="text-sm font-medium text-white/70 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </div>
  </div>
);

/* ── Quick action button ── */
const QuickAction = ({ icon: Icon, label, description, to, color }) => (
  <Link
    to={to}
    className={`glass rounded-2xl p-5 flex items-center gap-4 group hover:scale-[1.02] hover:border-${color}-500/40 transition-all duration-300 cursor-pointer`}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-${color}-500/15 group-hover:bg-${color}-500/25 transition-colors`}>
      <Icon size={20} className={`text-${color}-400`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-white/40 mt-0.5">{description}</p>
    </div>
    <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
  </Link>
);

const HospitalHome = () => {
  const { user } = useApp();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const stats = [
    { icon: Droplets,   label: 'Blood Requests',    value: '—', sub: 'Active requests', gradient: 'from-red-500 to-rose-600'     },
    { icon: Tent,       label: 'Healthcare Camps',  value: '—', sub: 'Upcoming camps',  gradient: 'from-emerald-500 to-teal-600' },
    { icon: Users,      label: 'Registered Donors', value: '—', sub: 'Total donors',    gradient: 'from-violet-500 to-purple-600' },
    { icon: Activity,   label: 'Active Services',   value: '2', sub: 'Running now',     gradient: 'from-amber-500 to-orange-600'  },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: 'Create Blood Donation Request',
      description: 'Post urgent blood requirement',
      to: '/hospital/blood-donation',
      color: 'red',
    },
    {
      icon: Tent,
      label: 'Organize Healthcare Camp',
      description: 'Schedule a community health camp',
      to: '/hospital/healthcare-camp',
      color: 'emerald',
    },
    {
      icon: Building2,
      label: 'Manage Hospital Profile',
      description: 'Update info, contact & facilities',
      to: '/hospital/profile',
      color: 'violet',
    },
  ];

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">Live Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
              {user?.organizationName || user?.Name || 'Hospital'}
            </span>
          </h1>
          <p className="text-white/50 mt-1">Manage your hospital services and community health programs</p>
        </div>
        <div className="hidden md:flex items-center gap-2 glass px-4 py-2 rounded-xl text-sm text-white/50">
          <Clock size={14} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <QuickAction key={action.to} {...action} />
          ))}
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-700/10 border border-violet-500/20 p-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
          <Heart size={22} className="text-violet-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">HealthSphere Hospital Network</h3>
          <p className="text-white/50 text-sm mt-1">
            You're part of a growing network helping the community access better healthcare.
            Post blood donation requests and camp announcements to reach patients in need.
          </p>
        </div>
        <Link
          to="/hospital/profile"
          className="hidden md:flex items-center gap-2 ml-auto text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors flex-shrink-0"
        >
          Complete Profile <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default HospitalHome;
