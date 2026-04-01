import { Outlet, Navigate } from 'react-router-dom';
import DoctorSidebar from '../components/doctor/DoctorSidebar';
import Topbar from '../components/user/Topbar';
import DoctorMobileBottomNav from '../components/doctor/DoctorMobileBottomNav';
import { useApp } from '../context/AppContext';

const DoctorDashboardLayout = () => {
  const { doctorCtx, loading } = useApp();

  if (!loading && doctorCtx?.newUser) {
    return <Navigate to="/doctor/onboarding" replace />;
  }

  return (
    <div className="flex bg-dark-900 transition-colors duration-300 min-h-screen">
      <DoctorSidebar />
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col transition-all duration-300 pb-20 md:pb-0">
        <Topbar />
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
      <DoctorMobileBottomNav />
    </div>
  );
};

export default DoctorDashboardLayout;
