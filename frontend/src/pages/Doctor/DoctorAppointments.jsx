import { useState } from "react";
import AppointmentTabs from "../../components/doctor/AppointmentTabs";
import PendingAppointments from "../../components/doctor/PendingAppointments";
import ConfirmedAppointments from "../../components/doctor/ConfirmedAppointments";
import HistoryAppointments from "../../components/doctor/HistoryAppointments";

const DoctorAppointments = () => {

  const [activeTab, setActiveTab] = useState("Pending");

  // Appointments will be passed later via props or fetched inside child components
  const [appointments, setAppointments] = useState([]);

  /* ================= HELPERS ================= */

  const getPending = () =>
    appointments.filter((a) => a.status === "Pending");

  const getConfirmed = () =>
    appointments.filter((a) => a.status === "Confirmed");

  const getHistory = () =>
    appointments.filter(
      (a) => a.status === "Completed" || a.status === "Rejected"
    );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Appointments
      </h1>

      <AppointmentTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="bg-white rounded-xl shadow p-4">

        {activeTab === "Pending" && (
          <PendingAppointments
            data={getPending()}
            setAppointments={setAppointments}
          />
        )}

        {activeTab === "Confirmed" && (
          <ConfirmedAppointments
            data={getConfirmed()}
            setAppointments={setAppointments}
          />
        )}

        {activeTab === "History" && (
          <HistoryAppointments
            data={getHistory()}
          />
        )}

      </div>
    </div>
  );
};

export default DoctorAppointments;