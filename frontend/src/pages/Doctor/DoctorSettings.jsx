import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorSettings = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
    availability: true,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Password updated successfully (UI only).");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Settings
      </h1>

      <div className="space-y-8 max-w-2xl">

        {/* ================= PASSWORD SECTION ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="grid gap-4">

            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="p-3 border rounded"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="p-3 border rounded"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-3 border rounded"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Password
            </button>

            {message && (
              <p className="text-green-600 text-sm">{message}</p>
            )}
          </form>
        </div>

        {/* ================= PREFERENCES ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Preferences
          </h2>

          <div className="flex flex-col gap-4">

            <label className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                className="w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between">
              <span>Available for Appointments</span>
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleChange}
                className="w-5 h-5"
              />
            </label>

          </div>
        </div>

        {/* ================= LOGOUT ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            Account
          </h2>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default DoctorSettings;