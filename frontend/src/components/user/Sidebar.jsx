import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Satna");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { name: "Home", path: "/user/dashboard" },
    { name: "Disease Prediction", path: "/user/dashboard/disease" },
    { name: "Appointment", path: "/user/dashboard/appointment" },
    { name: "Healthcare Camps", path: "/user/dashboard/HealthcareCamp" },
    { name: "Blood Donation", path: "/user/dashboard/BloodDonationPage" },
    { name: "Nearby Finder", path: "/user/dashboard/nearby" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLiveLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(
          `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
        );
        setShowLocationModal(false);
      },
      () => {
        alert("Unable to fetch location. Please allow permission.");
      }
    );
  };

  const handleSaveManualLocation = () => {
    if (manualLocation.trim() !== "") {
      setCurrentLocation(manualLocation);
      setManualLocation("");
      setShowLocationModal(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      setLoading(false);
    };

    fetchUser();
  }, [token, navigate]);

  return (
    <>
      <div className="w-64 h-screen bg-blue-900 text-white flex flex-col justify-between fixed">

        {/* ===== Top Section ===== */}
        <div>
          <div className="px-6 py-6 border-b border-blue-700">
            <h1 className="text-xl font-bold">HealthSphere</h1>
          </div>

          <nav className="mt-6 flex flex-col gap-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-3 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-blue-700"
                    : "hover:bg-blue-800"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* ===== Bottom Section ===== */}
        <div className="p-4 border-t border-blue-700 space-y-4">

          {/* Current Location Clickable */}
          <div
            onClick={() => setShowLocationModal(true)}
            className="bg-blue-800 p-3 rounded-lg text-xs cursor-pointer hover:bg-blue-700 transition"
          >
            <p className="font-semibold mb-1">Current Location</p>
            <p className="text-blue-200">📍 {currentLocation}</p>
          </div>

          {loading ? (
            <div className="text-sm text-blue-200">
              Loading profile...
            </div>
          ) : user && (
            <div className="space-y-3">

              <div className="flex items-center gap-3 bg-blue-800 p-3 rounded-lg overflow-hidden">
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate">
                    {user.Name}
                  </span>
                  <span className="text-xs text-blue-200 truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-red-400 hover:bg-red-600 text-white py-2 rounded-lg transition text-sm font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== LOCATION MODAL ===== */}
      {showLocationModal && (
        <div
          onClick={() => setShowLocationModal(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Set Your Location
              </h2>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Live Location */}
            <button
              onClick={handleLiveLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-4 transition"
            >
              📍 Use Live Location
            </button>

            <div className="text-center text-gray-400 text-sm mb-3">
              OR
            </div>

            {/* Manual Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Location Manually
              </label>

              <input
                type="text"
                placeholder="Enter city name..."
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                className="
                  w-full
                  border-2 border-gray-300
                  bg-gray-50
                  text-gray-800
                  rounded-lg
                  px-4 py-2
                  transition
                  duration-200
                  focus:border-blue-600
                  focus:ring-2
                  focus:ring-blue-200
                  focus:bg-white
                  outline-none
                "
              />
            </div>

            <button
              onClick={handleSaveManualLocation}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              Save Location
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;