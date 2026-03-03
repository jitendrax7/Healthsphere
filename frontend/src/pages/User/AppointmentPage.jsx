import { useState } from "react";
import DoctorList from "../../components/user/appointments/DoctorList";
import MyAppointments from "../../components/user/appointments/MyAppointments";
import ChatWithDoctor from "../../components/user/appointments/ChatWithDoctor";
import AppointmentHistory from "../../components/user/appointments/AppointmentHistory";

const AppointmentPage = () => {
  const [activeTab, setActiveTab] = useState("my");

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ================= TOP NAV ================= */}
      <div className="flex gap-4 mb-6 flex-wrap">

        <button
          onClick={() => setActiveTab("my")}
          className={`px-4 py-2 cursor-pointer rounded ${
            activeTab === "my"
              ? "bg-blue-900 text-white"
              : "bg-white border"
          }`}
        >
          My Appointments
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 cursor-pointer rounded ${
            activeTab === "history"
              ? "bg-blue-900 text-white"
              : "bg-white border"
          }`}
        >
          Appointment History
        </button>

        <button
          onClick={() => setActiveTab("chat")}
          className={`px-4 py-2 cursor-pointer rounded ${
            activeTab === "chat"
              ? "bg-blue-900 text-white"
              : "bg-white border"
          }`}
        >
          Chat With Doctor
        </button>

        <button
          onClick={() => setActiveTab("book")}
          className={`px-4 py-2 cursor-pointer rounded ${
            activeTab === "book"
              ? "bg-blue-900 text-white"
              : "bg-white border"
          }`}
        >
          Book New
        </button>

      </div>

      {/* ================= CONTENT ================= */}
      {activeTab === "my" && <MyAppointments />}
      {activeTab === "history" && <AppointmentHistory />}
      {activeTab === "chat" && <ChatWithDoctor />}
      {activeTab === "book" && <DoctorList />}
    </div>
  );
};

export default AppointmentPage;