import { useState, useEffect } from "react";

const BookingModal = ({
  doctor,
  token,
  onClose,
  onSuccess,
}) => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState("online");

  /* ================= FETCH SLOTS ================= */
  const fetchSlots = async (date) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/doctor/${doctor.doctorId}/available-slots?date=${date}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAvailableSlots(data.availableSlots);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= HANDLE BOOK ================= */
  const handleBooking = async () => {
    if (!appointmentDate || !startTime || !endTime) {
      alert("Please select date and time");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/user/appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: doctor.doctorId,
            appointmentDate,
            startTime,
            endTime,
            mode,
            reason,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      onSuccess();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl relative">

        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">
          Book Appointment
        </h2>

        <p className="font-semibold text-blue-900 mb-4">
          Dr. {doctor.name}
        </p>

        {/* Date */}
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          className="w-full p-3 border rounded-lg mb-4"
          value={appointmentDate}
          onChange={(e) => {
            setAppointmentDate(e.target.value);
            fetchSlots(e.target.value);
          }}
        />

        {/* Slots */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Available Slots</h3>

          {availableSlots.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No slots available
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStartTime(slot.startTime);
                    setEndTime(slot.endTime);
                  }}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    selectedSlot?.startTime === slot.startTime
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Editable Time */}
        <div className="flex gap-4 mb-4">
          <input
            type="time"
            className="p-2 border rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            className="p-2 border rounded"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {/* Mode */}
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setMode("online")}
            className={`px-4 py-2 rounded-lg ${
              mode === "online"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Online
          </button>

          <button
            type="button"
            onClick={() => setMode("offline")}
            className={`px-4 py-2 rounded-lg ${
              mode === "offline"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Offline
          </button>
        </div>

        {/* Reason */}
        <textarea
          placeholder="Reason (Optional)"
          className="w-full p-3 border rounded-lg mb-4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button
          onClick={handleBooking}
          className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookingModal;