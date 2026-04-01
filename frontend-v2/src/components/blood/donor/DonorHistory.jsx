import { useState, useEffect, useCallback } from 'react';
import { Droplets, Building2, Calendar, Heart, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { donorApi } from '../../../api/axios';

const STATUS_CHIP = {
  SCHEDULED:  'bg-sky-500/15 border-sky-500/30 text-sky-400',
  COMPLETED:  'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  CANCELLED:  'bg-white/5 border-white/10 text-white/30',
  NO_SHOW:    'bg-red-500/15 border-red-500/30 text-red-400',
};

const URGENCY_COLOR = {
  CRITICAL: 'text-red-400',
  URGENT:   'text-orange-400',
  NORMAL:   'text-emerald-400',
};

const DonorHistory = () => {
  const [records, setRecords]       = useState([]);
  const [page, setPage]             = useState(1);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await donorApi.getHistory(page);
      const d = res.data.data || {};
      setRecords(d.records || []);
      setTotal(d.total || 0);
      setTotalPages(d.totalPages || 1);
    } catch {}
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  if (loading) return (
    <div className="flex items-center justify-center py-14">
      <div className="w-7 h-7 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white text-sm sm:text-base">Donation History</h2>
        {total > 0 && (
          <span className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {total} record{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {records.length === 0 ? (
        <div className="glass rounded-2xl p-10 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Heart size={20} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm">No donation records yet.</p>
          <p className="text-white/25 text-xs mt-1">Records appear here after you complete a donation.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {records.map((item, i) => {
            const hospital   = item.hospital || {};
            const request    = item.request  || {};
            const statusCls  = STATUS_CHIP[item.status] || STATUS_CHIP.SCHEDULED;
            const urgencyClr = URGENCY_COLOR[request.urgencyLevel] || URGENCY_COLOR.NORMAL;
            return (
              <div key={item._id || i} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                      <Building2 size={13} className="text-rose-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{hospital.hospitalName || '—'}</p>
                      {hospital.city && (
                        <p className="text-[11px] text-white/30 flex items-center gap-1 mt-0.5">
                          <MapPin size={9} className="flex-shrink-0" />{hospital.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${statusCls}`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Droplets size={11} className="text-rose-400" />
                    <span className="font-semibold text-white/70">{item.bloodGroup}</span>
                    {request.urgencyLevel && (
                      <span className={`text-[10px] font-bold ${urgencyClr}`}>{request.urgencyLevel}</span>
                    )}
                  </span>
                  <span>{item.unitsDonated || 1} unit{(item.unitsDonated || 1) !== 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-1 ml-auto">
                    <Calendar size={10} />
                    {new Date(item.donationDate || item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
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

export default DonorHistory;
