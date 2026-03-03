import { useEffect, useState } from "react";

const MyAppointments = () => {
  const token = localStorage.getItem("token");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/my-appointment",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAppointments(data.appointments);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ================= STATUS STYLE ================= */
  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Loading appointments...
      </div>
    );

  /* ================= EMPTY STATE ================= */
  if (appointments.length === 0)
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-xl font-semibold text-gray-700">
          No Appointments Yet
        </h2>
        <p className="text-gray-500 mt-2">
          Book your first appointment to get started.
        </p>
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {appointments.map((appt) => (
        <div
          key={appt._id}
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100"
        >
          {/* Top Section */}
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Doctor"
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
            />

            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800">
                Dr. {appt.doctor?.Name}
              </h3>

              <p className="text-sm text-gray-500">
                {new Date(appt.appointmentDate).toDateString()} • {appt.timeSlot}
              </p>
            </div>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                appt.status
              )}`}
            >
              {appt.status}
            </span>
          </div>

          {/* Reason */}
          {appt.reason && (
            <p className="text-gray-600 mt-4 text-sm">
              <span className="font-medium">Reason:</span> {appt.reason}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">

            <button
              onClick={() => alert("This feature is coming soon!")}
              className="flex-1 border border-blue-900 text-blue-900 py-2 rounded-lg hover:bg-blue-50 transition"
            >
              💬 Chat
            </button>

            <button
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              ✏ Reschedule
            </button>

            <button
              className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition"
            >
              ✖ Cancel
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default MyAppointments;