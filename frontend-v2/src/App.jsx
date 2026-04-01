import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Landing     from './pages/Landing';
import Login       from './pages/auth/Login';
import Register    from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';

import ProtectedRoute from './components/ProtectedRoute';

// ── User ──────────────────────────────────────────────
import UserDashboardLayout from './layouts/UserDashboardLayout';
import UserHome            from './pages/User/Home';
import DiseasePrediction   from './pages/User/DiseasePrediction';
import AppointmentPage     from './pages/User/AppointmentPage';
import BookAppointmentPage from './pages/User/BookAppointmentPage';
import HealthcareCamp      from './pages/User/HealthcareCamp';
import CampDetails         from './pages/User/CampDetails';
import NearbyFinderPage    from './pages/User/NearbyFinderPage';
import UserProfile         from './pages/User/UserProfile';
import SettingsModal       from './components/user/SettingsModal';
import BloodDonationPage   from './pages/BloodDonationPage';

// ── Doctor ────────────────────────────────────────────
import DoctorDashboardLayout from './layouts/DoctorDashboardLayout';
import DoctorHome            from './pages/Doctor/DoctorHome';
import DoctorAppointments    from './pages/Doctor/DoctorAppointments';
import DoctorChat            from './pages/Doctor/DoctorChat';
import DoctorProfile         from './pages/Doctor/DoctorProfile';
import DoctorSettingsModal   from './components/doctor/DoctorSettingsModal';
import DoctorOnboarding      from './pages/Doctor/DoctorOnboarding';

// ── Hospital ──────────────────────────────────────────
import HospitalDashboardLayout from './layouts/HospitalDashboardLayout';
import HospitalStatusGate      from './components/hospital/HospitalStatusGate';
import HospitalOnboarding      from './pages/Hospital/HospitalOnboarding';
import HospitalPending         from './pages/Hospital/HospitalPending';
import HospitalRejected        from './pages/Hospital/HospitalRejected';
import HospitalHome            from './pages/Hospital/HospitalHome';
import HospitalBloodDonation   from './pages/Hospital/HospitalBloodDonation';
import HospitalHealthcareCamp  from './pages/Hospital/HospitalHealthcareCamp';
import HospitalProfile         from './pages/Hospital/HospitalProfile';
import HospitalSettings        from './pages/Hospital/HospitalSettings';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public ── */}
        <Route path="/"             element={<Landing />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />

        {/* ── Hospital: pre-auth status pages (inside ProtectedRoute, outside Layout) ── */}
        <Route path="/hospital/onboarding" element={
          <ProtectedRoute role="hospital"><HospitalOnboarding /></ProtectedRoute>
        } />
        <Route path="/hospital/pending" element={
          <ProtectedRoute role="hospital"><HospitalPending /></ProtectedRoute>
        } />
        <Route path="/hospital/rejected" element={
          <ProtectedRoute role="hospital"><HospitalRejected /></ProtectedRoute>
        } />

        {/* ── User ── */}
        <Route path="/user" element={
          <ProtectedRoute role="user"><UserDashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"     element={<UserHome />} />
          <Route path="profile"       element={<UserProfile />} />
          <Route path="settings"      element={<SettingsModal />} />
          <Route path="disease"       element={<DiseasePrediction />} />
          <Route path="appointment"   element={<AppointmentPage />} />
          <Route path="appointment/:id" element={<BookAppointmentPage />} />
          <Route path="healthcarecamp"element={<HealthcareCamp />} />
          <Route path="healthcarecamp/:id" element={<CampDetails />} />
          <Route path="blood-donation"element={<BloodDonationPage />} />
          <Route path="nearby"        element={<NearbyFinderPage />} />
        </Route>

        {/* ── Doctor ── */}
        <Route path="/doctor" element={
          <ProtectedRoute role="doctor"><DoctorDashboardLayout /></ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"    element={<DoctorHome />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="chat"         element={<DoctorChat />} />
          <Route path="blood-donation"element={<BloodDonationPage />} />
          <Route path="profile"      element={<DoctorProfile />} />
          <Route path="settings"     element={<DoctorSettingsModal />} />
        </Route>

        {/* ── Hospital: main dashboard (gated by approval status) ── */}
        <Route path="/hospital" element={
          <ProtectedRoute role="hospital">
            <HospitalStatusGate>
              <HospitalDashboardLayout />
            </HospitalStatusGate>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"       element={<HospitalHome />} />
          <Route path="blood-donation"  element={<HospitalBloodDonation />} />
          <Route path="healthcare-camp" element={<HospitalHealthcareCamp />} />
          <Route path="profile"         element={<HospitalProfile />} />
          <Route path="settings"        element={<HospitalSettings />} />
        </Route>

        {/* ── Catch-all ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
