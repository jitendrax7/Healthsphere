import { Outlet } from 'react-router-dom';
import Sidebar from '../components/user/Sidebar';
import Topbar from '../components/user/Topbar';
import AIChatbot from '../components/user/AIChatbot';

const UserDashboardLayout = () => {
  return (
    <div className="flex bg-dark-900 transition-colors duration-300 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col transition-all duration-300">
        <Topbar />
        <div className="p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
      <AIChatbot />
    </div>
  );
};

export default UserDashboardLayout;
