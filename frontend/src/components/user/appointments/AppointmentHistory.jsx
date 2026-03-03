import { useEffect, useState } from "react";

const AppointmentHistory = () => {
  const token = localStorage.getItem("token");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH HISTORY ================= */

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/user/appointments/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setHistory(data.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ================= STATUS STYLE ================= */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Appointment History
      </h2>

      {loading && (
        <p className="text-gray-500">Loading history...</p>
      )}

      {!loading && history.length === 0 && (
        <p className="text-gray-400">
          No completed or rejected appointments yet.
        </p>
      )}

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border p-4 rounded-lg hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {item.doctorName}
              </p>

              <p className="text-sm text-gray-500">
                📅 {new Date(item.appointmentDate).toDateString()}
              </p>

              <p className="text-sm text-gray-500">
                ⏰ {item.startTime} - {item.endTime}
              </p>

              <p className="text-xs text-gray-400">
                Mode: {item.mode}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusStyle(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AppointmentHistory;