const DoctorHome = () => {

  
  // Dummy Data (UI only)
  const stats = [
  { title: "Total Appointments", value: 128 },
  { title: "Today’s Appointments", value: 5 },
  { title: "Confirmed Appointments", value: 120 },
  { title: "Pending Requests", value: 3 },
];

  const recentAppointments = [
    {
      id: 1,
      patient: "Rahul Sharma",
      date: "26 Feb 2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      patient: "Anita Verma",
      date: "26 Feb 2026",
      time: "12:00 PM",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Amit Singh",
      date: "27 Feb 2026",
      time: "09:00 AM",
      status: "Confirmed",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Doctor Dashboard
      </h1>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-gray-500 text-sm">{item.title}</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ================= RECENT APPOINTMENTS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Recent Appointments
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Patient</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{appointment.patient}</td>
                  <td className="p-3">{appointment.date}</td>
                  <td className="p-3">{appointment.time}</td>
                  <td
                    className={`p-3 font-medium ${appointment.status === "Confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                      }`}
                  >
                    {appointment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DoctorHome;