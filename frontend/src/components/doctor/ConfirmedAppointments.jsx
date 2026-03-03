import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

const ConfirmedAppointments = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  /* ================= FETCH CONFIRMED ================= */

  const fetchConfirmedAppointments = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/doctor/myappointment?status=confirmed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const formatted = data.appointments.map((a) => ({
        id: a._id,
        patient: a.user?.Name || "Unknown",
        location: a.user?.location?.city || "Not Available",
        requestTime: new Date(a.createdAt).toLocaleString(),
        appointmentDate: new Date(a.appointmentDate).toDateString(),
        appointmentTime: `${a.startTime} - ${a.endTime}`,
        problem: a.reason || "Not Provided",
        status: a.status,
        mode:
          a.mode?.charAt(0).toUpperCase() + a.mode?.slice(1),
      }));

      setAppointments(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedAppointments();
  }, []);

  /* ================= COMPLETE APPOINTMENT ================= */

  const markAsCompleted = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/doctor/appointment/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Refresh list
      fetchConfirmedAppointments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-sm">
            <th className="p-4">Patient</th>
            <th className="p-4">Location</th>
            <th className="p-4">Requested At</th>
            <th className="p-4">Appointment</th>
            <th className="p-4">Mode</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan="6" className="text-center p-6">
                Loading...
              </td>
            </tr>
          )}

          {!loading &&
            appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">
                  {appointment.patient}
                </td>

                <td className="p-4 text-sm text-gray-600">
                  {appointment.location}
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {appointment.requestTime}
                </td>

                <td className="p-4">
                  <div className="font-medium">
                    {appointment.appointmentDate}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.appointmentTime}
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.mode === "Online"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {appointment.mode}
                  </span>
                </td>

                <td className="p-4 space-x-2">
                  <button
                    onClick={() =>
                      markAsCompleted(appointment.id)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() =>
                      alert("Chat feature coming soon!")
                    }
                    className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900 transition"
                  >
                    Chat
                  </button>

                  <button
                    onClick={() =>
                      setSelectedAppointment(appointment)
                    }
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
                  >
                    More Info
                  </button>
                </td>
              </tr>
            ))}

          {!loading && appointments.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="text-center p-6 text-gray-400"
              >
                No confirmed appointments.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        showRejectSection={false}
      />
    </>
  );
};

export default ConfirmedAppointments;