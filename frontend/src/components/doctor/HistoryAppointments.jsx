import { useEffect, useState } from "react";

const HistoryAppointments = () => {
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH HISTORY ================= */

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/doctor/myappointment?status=completed,rejected",
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
        appointmentDate: new Date(a.appointmentDate).toDateString(),
        appointmentTime: `${a.startTime} - ${a.endTime}`,
        mode:
          a.mode?.charAt(0).toUpperCase() + a.mode?.slice(1),
        status:
          a.status.charAt(0).toUpperCase() +
          a.status.slice(1),
      }));

      setAppointments(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-100 text-sm">
          <th className="p-4">Patient</th>
          <th className="p-4">Location</th>
          <th className="p-4">Appointment</th>
          <th className="p-4">Mode</th>
          <th className="p-4">Final Status</th>
        </tr>
      </thead>

      <tbody>

        {loading && (
          <tr>
            <td colSpan="5" className="text-center p-6">
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

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {appointment.status}
                </span>
              </td>
            </tr>
          ))}

        {!loading && appointments.length === 0 && (
          <tr>
            <td
              colSpan="5"
              className="text-center p-6 text-gray-400"
            >
              No appointment history found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default HistoryAppointments;