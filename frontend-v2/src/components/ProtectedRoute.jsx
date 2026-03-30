import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading HealthSphere...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    const redirectMap = {
      doctor:   '/doctor/dashboard',
      hospital: '/hospital/dashboard',
    };
    const dest = redirectMap[user.role] || '/user/dashboard';
    return <Navigate to={dest} replace />;
  }

  return children;
};

export default ProtectedRoute;

