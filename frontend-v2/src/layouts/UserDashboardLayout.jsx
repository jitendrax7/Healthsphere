import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/user/Sidebar';
import Topbar from '../components/user/Topbar';
import AIChatbot from '../components/user/AIChatbot';
import MobileBottomNav from '../components/user/MobileBottomNav';

const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-dark-900 transition-colors duration-300 min-h-screen">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-h-screen flex flex-col transition-all duration-300 md:ml-20 lg:ml-64">
        <Topbar onMenuToggle={() => setSidebarOpen(true)} />
        <div className="p-4 md:p-6 lg:p-8 flex-1 pb-20 md:pb-6">
          <Outlet />
        </div>
        <MobileBottomNav />
      </main>

      <AIChatbot />
    </div>
  );
};

export default UserDashboardLayout;
