import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Login from "./pages/auth/Login";


// User Pages
import UserDashboardLayout from "./layouts/UserDashboardLayout.jsx";
import UserProtectedRoute from "./components/UserProtectedRoute.jsx";
import Home from "./pages/User/Home";
import DiseasePrediction from "./pages/User/DiseasePrediction";
import AppointmentPage from "./pages/User/AppointmentPage";
import HealthcareCamp from "./pages/User/HealthcareCamp";
import BloodDonationPage from "./pages/BloodDonationPage";
import NearbyFinderPage from "./pages/User/NearbyFinderPage";
import UserProfileSetup from "./pages/User/UserProfileSetup";


// Doctor Pages (example)
import DoctorProtectedRoute from "./components/DocterProtectedRoute.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorHome from "./pages/Doctor/DoctorHome.jsx";

import DoctorDashboardLayout from "./layouts/DoctorDashboardLayout";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx";
import DoctorChat from "./pages/Doctor/DoctorChat";
import DoctorBloodDonation from "./pages/Doctor/DoctorBloodDonation";
// import DoctorHealthcareCamp from "./pages/Doctor/DoctorHealthcareCamp";
// import DoctorProfile from "./pages/Doctor/DoctorProfile";
import DoctorSettings from "./pages/Doctor/DoctorSettings";


function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />

        {/* Setup Profile */}
        <Route
          path="/user/setup-profile"
          element={
            <UserProtectedRoute>
              <UserProfileSetup />
            </UserProtectedRoute>
          }
        />

        {/* ================= USER PANEL ================= */}
        <Route
          path="/user/dashboard"
          element={
            <UserProtectedRoute>
              <UserDashboardLayout />
            </UserProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="disease" element={<DiseasePrediction />} />
          <Route path="appointment" element={<AppointmentPage />} />
          <Route path="healthcarecamp" element={<HealthcareCamp />} />
          <Route path="BloodDonationPage" element={<BloodDonationPage />} />
          <Route path="nearby" element={<NearbyFinderPage />} />
        </Route>




        {/* ================= DOCTOR PANEL ================= */}

        <Route
          path="/doctor/setup-profile"
          element={
            <DoctorProtectedRoute>
              <DoctorProfile />
            </DoctorProtectedRoute>
          }
        />

        <Route
          path="/doctor/dashboard"
          element={
            <DoctorProtectedRoute>
              <DoctorDashboardLayout />
            </DoctorProtectedRoute>
          }
        >
          <Route index element={<DoctorHome />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="chat" element={<DoctorChat />} />
          <Route path="blood-donation" element={<BloodDonationPage />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="settings" element={<DoctorSettings />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;