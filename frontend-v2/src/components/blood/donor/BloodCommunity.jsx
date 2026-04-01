import { useState, useEffect, useCallback } from 'react';
import {
  Droplets, Building2, MapPin, Phone, Clock, AlertTriangle,
  ChevronLeft, ChevronRight, Users, Search, RefreshCw,
} from 'lucide-react';
import { bloodRequestApi } from '../../../api/axios';

const URGENCY_CONFIG = {
  CRITICAL: { label: 'Critical', cls: 'bg-red-500/15 border-red-500/30 text-red-400',    bar: 'bg-red-500' },
  URGENT:   { label: 'Urgent',   cls: 'bg-orange-500/15 border-orange-500/30 text-orange-400', bar: 'bg-orange-500' },
  NORMAL:   { label: 'Normal',   cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', bar: 'bg-emerald-500' },
};

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const RequestCard = ({ req }) => {
  const urgency  = URGENCY_CONFIG[req.urgencyLevel] || URGENCY_CONFIG.NORMAL;
  const hospital = req.hospital  || {};
  const location = req.location  || {};

  return (
    <div className="glass rounded-xl overflow-hidden hover:border-white/20 transition-all">
      <div className={`h-0.5 w-full ${urgency.bar} opacity-60`} />
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 border border-red-500/30 flex items-center justify-center font-black text-red-300 text-sm flex-shrink-0 shadow-[0_0_16px_rgba(239,68,68,0.15)]">
              {req.bloodGroup}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm">
                {req.unitsRequired} unit{req.unitsRequired !== 1 ? 's' : ''} needed
              </p>
              {req.patientName && <p className="text-xs text-white/40 truncate">{req.patientName}</p>}
              {req.disease     && <p className="text-xs text-white/30 truncate">{req.disease}</p>}
            </div>
          </div>
          <span className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold border px-2 py-0.5 rounded-full flex-shrink-0 ${urgency.cls}`}>
            {req.urgencyLevel === 'CRITICAL' && <AlertTriangle size={8} />}
            {urgency.label}
          </span>
        </div>

        <div className="space-y-1 mb-3">
          {(hospital.hospitalName || location.city) && (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Building2 size={10} className="text-white/30 flex-shrink-0" />
              <span className="font-medium truncate">{hospital.hospitalName || 'Hospital'}</span>
              {location.city && <span className="text-white/30 flex-shrink-0">· {location.city}</span>}
            </div>
          )}
          {location.addressLine && (
            <div className="flex items-center gap-2 text-xs text-white/35">
              <MapPin size={10} className="text-white/25 flex-shrink-0" />
              <span className="truncate">{location.addressLine}</span>
            </div>
          )}
          {req.contactNumber && (
            <a href={`tel:${req.contactNumber}`} onClick={e => e.stopPropagation()}
              className="flex items-center gap-2 text-xs text-rose-400/80 hover:text-rose-400 transition-colors">
              <Phone size={10} className="flex-shrink-0" />
              <span className="truncate">{req.contactPerson ? `${req.contactPerson} — ` : ''}{req.contactNumber}</span>
            </a>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-white/5 flex-wrap gap-1.5">
          <div className="flex items-center gap-3 text-[11px] text-white/30 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock size={9} />
              {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
            {req.acceptedDonorsCount > 0 && (
              <span className="flex items-center gap-1">
                <Users size={9} className="text-emerald-400/60" />
                {req.acceptedDonorsCount} responding
              </span>
            )}
          </div>
          {req.requiredBeforeDate && (
            <span className="text-[10px] text-amber-400/70 font-medium">
              Before {new Date(req.requiredBeforeDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const BloodCommunity = () => {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [bloodFilter, setBloodFilter] = useState('All');
  const [search, setSearch]         = useState('');

  const fetchCommunity = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (bloodFilter !== 'All') params.bloodGroup = bloodFilter;
      if (search.trim())         params.city = search.trim();
      const res = await bloodRequestApi.community(params);
      const d = res.data.data || res.data || {};
      setRequests(d.requests || d.data || []);
      setTotalPages(d.totalPages || 1);
      setTotal(d.total || 0);
    } catch {}
    finally { setLoading(false); }
  }, [page, bloodFilter, search]);

  useEffect(() => { fetchCommunity(); }, [fetchCommunity]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-bold text-white text-sm sm:text-base">Community Requests</h2>
          <p className="text-xs text-white/35 mt-0.5">Active blood requests from hospitals in the network</p>
        </div>
        {total > 0 && (
          <span className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0">
            {total} active
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setPage(1); fetchCommunity(); } }}
            placeholder="Search by city..."
            className="input-dark pl-8 py-2 text-sm h-9 w-full"
          />
        </div>
        <button
          onClick={() => { setPage(1); fetchCommunity(); }}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all flex-shrink-0"
        >
          <RefreshCw size={13} />
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {BLOOD_GROUPS.map(g => (
          <button key={g} onClick={() => { setBloodFilter(g); setPage(1); }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
              bloodFilter === g
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70'
            }`}>
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-14">
          <div className="w-7 h-7 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-2xl p-10 sm:p-14 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Droplets size={20} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm font-medium">No active requests found.</p>
          <p className="text-white/25 text-xs mt-1.5">
            {bloodFilter !== 'All' ? `No open requests for ${bloodFilter}.` : 'Check back later for new requests.'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {requests.map((req, i) => <RequestCard key={req._id || i} req={req} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-all">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-white/50">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BloodCommunity;
