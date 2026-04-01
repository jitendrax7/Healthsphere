import { Calendar, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const SlotPicker = ({ form, setForm, availableSlots, slotsLoading, today }) => (
  <div>
    <label className="block text-xs text-white/40 mb-2 font-bold uppercase tracking-wider">Select Date</label>
    <div className="relative mb-4">
      <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      <input
        type="date"
        value={form.date}
        onChange={e => setForm({ ...form, date: e.target.value })}
        min={today}
        required
        className="w-full bg-dark-800/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500/50 [&::-webkit-calendar-picker-indicator]:invert-[0.6] [&::-webkit-calendar-picker-indicator]:cursor-pointer transition-colors"
      />
    </div>

    {form.date && (
      <div className="bg-dark-800/40 rounded-2xl border border-white/5 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs text-white/40 font-bold uppercase tracking-wider">Available Slots</label>
          {slotsLoading && <Loader2 size={13} className="animate-spin text-primary-400" />}
        </div>

        {!slotsLoading && availableSlots?.length === 0 && (
          <div className="text-center py-3">
            <XCircle size={22} className="text-white/20 mx-auto mb-2" />
            <p className="text-white/30 text-sm">No slots available for this date.</p>
          </div>
        )}

        {!slotsLoading && availableSlots?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableSlots.map((slot, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setForm(p => ({ ...p, startTime: slot.startTime, endTime: slot.endTime }))}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                  form.startTime === slot.startTime && form.endTime === slot.endTime
                    ? 'bg-primary-500/30 border-primary-500 text-white shadow-glow-primary scale-105'
                    : 'bg-dark-800/60 border-white/10 text-white/60 hover:border-primary-500/40 hover:text-white'
                }`}
              >
                <Clock size={11} /> {slot.startTime} – {slot.endTime}
              </button>
            ))}
          </div>
        )}

        {!slotsLoading && (
          <div className={`${availableSlots?.length > 0 ? 'pt-3 border-t border-white/5' : ''}`}>
            <p className="text-[10px] text-white/30 uppercase font-bold mb-2.5 flex items-center gap-1.5">
              <Clock size={10} /> {availableSlots?.length > 0 ? 'Or enter time manually' : 'Enter preferred time'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-white/30 mb-1.5 font-medium">Start Time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/30 mb-1.5 font-medium">End Time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                  className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500/50 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {form.startTime && form.endTime && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <CheckCircle size={13} className="text-green-400 shrink-0" />
            <p className="text-sm font-bold text-green-300">{form.startTime} – {form.endTime}</p>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, startTime: '', endTime: '' }))}
              className="ml-auto text-[10px] text-white/30 hover:text-red-400 transition-colors font-bold"
            >Clear</button>
          </div>
        )}
      </div>
    )}
  </div>
);

export default SlotPicker;
