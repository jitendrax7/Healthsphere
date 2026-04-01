import { Video, Stethoscope, CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';

const BookingForm = ({ form, setForm, professional, doctor, handleBook, loading, msg, availability }) => {
  const consultModes = professional.consultationMode === 'both'
    ? ['offline', 'online']
    : [professional.consultationMode];

  return (
    <form onSubmit={handleBook} className="space-y-5">
      {consultModes.length > 1 ? (
        <div>
          <label className="block text-xs text-white/40 mb-2 font-bold uppercase tracking-wider">Consultation Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {consultModes.map(m => (
              <button
                type="button"
                key={m}
                onClick={() => setForm({ ...form, mode: m })}
                className={`py-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-all capitalize ${
                  form.mode === m
                    ? 'bg-primary-600 border-primary-500 text-white shadow-glow-primary'
                    : 'bg-dark-800/50 border-white/10 text-white/50 hover:border-white/30'
                }`}
              >
                {m === 'online' ? <Video size={15} /> : <Stethoscope size={15} />}
                {m === 'online' ? 'Video Call' : 'In-person'}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-white/3 border border-white/8 rounded-xl">
          {consultModes[0] === 'online' ? <Video size={15} className="text-accent-cyan" /> : <Stethoscope size={15} className="text-primary-400" />}
          <p className="text-sm text-white/70 font-medium capitalize">
            {consultModes[0] === 'online' ? 'Video Call consultation' : 'In-person visit'}
          </p>
        </div>
      )}

      <div>
        <label className="block text-xs text-white/40 mb-2 font-bold uppercase tracking-wider">Reason / Symptoms</label>
        <textarea
          value={form.reason}
          onChange={e => setForm({ ...form, reason: e.target.value })}
          rows={4}
          placeholder="Briefly describe your symptoms or reason for visit..."
          className="w-full bg-dark-800/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-primary-500/50 placeholder-white/20 transition-colors"
        />
      </div>

      {form.date && form.startTime && (
        <div className="bg-primary-500/8 border border-primary-500/20 rounded-xl p-4 space-y-2">
          <p className="text-[11px] text-primary-300 font-bold uppercase tracking-wider">Booking Summary</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
            <span><span className="text-white/40">Date:</span> {new Date(form.date).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' })}</span>
            <span><span className="text-white/40">Time:</span> {form.startTime} – {form.endTime}</span>
            <span><span className="text-white/40">Mode:</span> {form.mode}</span>
            <span><span className="text-white/40">Fee:</span> ₹{professional.consultationFee}</span>
          </div>
        </div>
      )}

      {msg.text && (
        <div className={`flex items-center gap-2 p-3.5 rounded-xl text-sm border font-medium ${
          msg.type === 'success'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />} {msg.text}
        </div>
      )}

      {availability?.bookingEnabled !== false ? (
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3.5 bg-gradient-to-r from-primary-600 to-accent-cyan text-white font-bold text-[15px] rounded-xl shadow-glow-primary hover:opacity-90 disabled:opacity-60 transition-all"
        >
          {loading
            ? <><Loader2 size={18} className="animate-spin" />Confirming…</>
            : <><CheckCircle size={18} />Confirm Appointment</>
          }
        </button>
      ) : (
        <div className="text-center py-3 text-red-400 text-sm font-medium bg-red-500/8 border border-red-500/20 rounded-xl">
          This doctor is not accepting appointments at the moment.
        </div>
      )}

      <p className="text-center text-[11px] text-white/25 flex items-center justify-center gap-1.5">
        <Shield size={10} /> Your data is encrypted and secure.
      </p>
    </form>
  );
};

export default BookingForm;
