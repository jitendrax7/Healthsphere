import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { appointmentApi } from '../../api/axios';
import DoctorProfileCard from '../../components/user/appointments/DoctorProfileCard';
import SlotPicker from '../../components/user/appointments/SlotPicker';
import BookingForm from '../../components/user/appointments/BookingForm';

const BookAppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData]                   = useState(null);
  const [pageLoading, setPageLoading]     = useState(true);
  const [form, setForm]                   = useState({ date: '', startTime: '', endTime: '', reason: '', mode: 'offline' });
  const [msg, setMsg]                     = useState({ type: '', text: '' });
  const [loading, setLoading]             = useState(false);
  const [availableSlots, setAvailableSlots] = useState(null);
  const [slotsLoading, setSlotsLoading]   = useState(false);

  useEffect(() => {
    appointmentApi.getDoctorById(id)
      .then(res => { if (res.data?.doctor) setData(res.data); else navigate('/user/appointment'); })
      .catch(() => navigate('/user/appointment'))
      .finally(() => setPageLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!data || !form.date) { setAvailableSlots(null); return; }
    setSlotsLoading(true);
    setAvailableSlots(null);
    setForm(p => ({ ...p, startTime: '', endTime: '' }));
    const timer = setTimeout(() => {
      appointmentApi.getAvailableSlots(data.doctor.id, form.date)
        .then(res => setAvailableSlots(res.data.availableSlots || []))
        .catch(() => setAvailableSlots([]))
        .finally(() => setSlotsLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [data, form.date]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!form.startTime || !form.endTime) { setMsg({ type: 'error', text: 'Please select a time slot.' }); return; }
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      await appointmentApi.book({ doctorId: data.doctor.id, ...form });
      setMsg({ type: 'success', text: 'Appointment confirmed! Redirecting…' });
      setTimeout(() => navigate('/user/appointment'), 1800);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Booking failed. Please try again.' });
    } finally { setLoading(false); }
  };

  if (pageLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={32} className="animate-spin text-primary-500" />
    </div>
  );
  if (!data) return null;

  const { doctor, professional, qualifications = [], languages = [], services = [], clinic, availability } = data;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-10">

      <button
        onClick={() => navigate('/user/appointment')}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/8 w-fit"
      >
        <ArrowLeft size={15} /> Back to Doctors
      </button>

      <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 items-start">

        <div className="lg:col-span-5">
          <DoctorProfileCard
            doctor={doctor}
            professional={professional}
            qualifications={qualifications}
            languages={languages}
            services={services}
            clinic={clinic}
            availability={availability}
          />
        </div>

        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-5 sm:p-6 lg:p-8 border border-white/5 shadow-xl lg:sticky lg:top-6">
            <div className="flex items-start justify-between mb-5 sm:mb-6 pb-4 sm:pb-5 border-b border-white/8">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Book Appointment</h2>
                <p className="text-white/40 text-sm mt-1">with {doctor.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-black text-white">₹{professional.consultationFee}</p>
                <p className="text-[11px] text-white/30 font-medium">per consultation</p>
              </div>
            </div>

            <div className="space-y-5">
              <SlotPicker
                form={form}
                setForm={setForm}
                availableSlots={availableSlots}
                slotsLoading={slotsLoading}
                today={today}
              />
              <BookingForm
                form={form}
                setForm={setForm}
                professional={professional}
                doctor={doctor}
                handleBook={handleBook}
                loading={loading}
                msg={msg}
                availability={availability}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;
