import { useState, useEffect } from 'react';
import { Bell, Check, BellOff, Loader2, Droplets, Building2, Clock } from 'lucide-react';
import { donorApi } from '../../../api/axios';

const NOTIF_ICONS = {
  INVITE_RECEIVED:    { icon: Droplets,  cls: 'bg-rose-500/15 border-rose-500/30 text-rose-400' },
  INVITE_ACCEPTED:    { icon: Check,     cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  INVITE_DECLINED:    { icon: Bell,      cls: 'bg-orange-500/15 border-orange-500/30 text-orange-400' },
  INVITE_EXPIRED:     { icon: Clock,     cls: 'bg-white/5 border-white/10 text-white/30' },
  REQUEST_EXPIRED:    { icon: Building2, cls: 'bg-white/5 border-white/10 text-white/30' },
  ELIGIBILITY_RESTORED: { icon: Droplets, cls: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  GENERAL:            { icon: Bell,      cls: 'bg-blue-500/15 border-blue-500/30 text-blue-400' },
};

const DonorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [readingId, setReadingId] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await donorApi.getNotifications();
      const d = res.data.data || {};
      setNotifications(d.notifications || []);
      setUnreadCount(d.unreadCount ?? 0);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async id => {
    setReadingId(id);
    try {
      await donorApi.markNotifRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch {}
    finally { setReadingId(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Notifications</h2>
        {unreadCount > 0 && (
          <span className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
            {unreadCount} unread
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <BellOff size={22} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm">No notifications yet.</p>
          <p className="text-white/25 text-xs mt-1">You'll be notified when hospitals invite you to donate.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
          {notifications.map(n => {
            const cfg = NOTIF_ICONS[n.type] || NOTIF_ICONS.GENERAL;
            const IconCmp = cfg.icon;
            return (
              <div key={n._id}
                className={`flex items-start gap-4 px-5 py-4 transition-all ${!n.isRead ? 'bg-rose-500/5' : 'hover:bg-white/3'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                  n.isRead ? 'bg-white/5 border-white/5' : cfg.cls
                }`}>
                  <IconCmp size={14} className={n.isRead ? 'text-white/30' : ''} />
                </div>
                <div className="flex-1 min-w-0">
                  {n.title && <p className={`text-xs font-bold mb-0.5 ${n.isRead ? 'text-white/40' : 'text-white/70'}`}>{n.title}</p>}
                  <p className={`text-sm leading-relaxed ${n.isRead ? 'text-white/40' : 'text-white font-medium'}`}>{n.message}</p>
                  <p className="text-xs text-white/25 mt-1">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!n.isRead && (
                  <button onClick={() => markRead(n._id)} disabled={readingId === n._id}
                    className="flex-shrink-0 w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                    title="Mark as read">
                    {readingId === n._id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonorNotifications;
