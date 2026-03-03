import AIChatbot from "../components/User/AIChatbot";
import Sidebar from "../components/user/Sidebar";
import { Outlet } from "react-router-dom";

const UserDashboardLayout = () => {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-gray-100 p-8">
        <Outlet />
      </div>

      {/* Chatbot */}
      <AIChatbot />

    </div>
  );
};

export default UserDashboardLayout;