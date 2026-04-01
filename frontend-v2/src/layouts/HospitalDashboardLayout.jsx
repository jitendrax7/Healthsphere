import { Outlet } from 'react-router-dom';
import HospitalSidebar from '../components/hospital/HospitalSidebar';
import HospitalMobileBottomNav from '../components/hospital/HospitalMobileBottomNav';
import Topbar from '../components/user/Topbar';

const HospitalDashboardLayout = () => (
  <div className="flex bg-dark-900 transition-colors duration-300 min-h-screen">
    <HospitalSidebar />
    <main className="flex-1 md:ml-64 min-h-screen flex flex-col transition-all duration-300 pb-20 md:pb-0">
      <Topbar />
      <div className="p-4 sm:p-6 lg:p-8 flex-1">
        <Outlet />
      </div>
    </main>
    <HospitalMobileBottomNav />
  </div>
);

export default HospitalDashboardLayout;
