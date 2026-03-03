import { Outlet } from "react-router-dom";
import DoctorSidebar from "../components/doctor/DoctorSidebar";

const DoctorDashboardLayout = () => {
  return (
    <div className="flex min-h-screen">

      <DoctorSidebar />

      <div className="flex-1 ml-64 bg-gray-100 p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default DoctorDashboardLayout;