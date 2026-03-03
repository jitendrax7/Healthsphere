import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const DoctorSidebar = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const linkStyle =
    "block px-4 py-2 rounded-lg transition-all duration-200";

  const activeStyle = "bg-blue-600 text-white";
  const inactiveStyle = "text-gray-700 hover:bg-gray-200";

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  /* ================= CLOSE ON OUTSIDE CLICK ================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-64 fixed h-screen bg-white shadow-lg p-5 flex flex-col justify-between">

      {/* Top Section */}
      <div>

        {/* Logo */}
        <h2 className="text-2xl font-bold mb-8 text-blue-700">
          Doctor Panel
        </h2>

        {/* Navigation */}
        <nav className="flex flex-col gap-3">

          <NavLink
            to="/doctor/dashboard"
            end
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            🏠 Dashboard
          </NavLink>

          <NavLink
            to="/doctor/dashboard/appointments"
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            📅 Appointments
          </NavLink>

          <NavLink
            to="/doctor/dashboard/chat"
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            💬 Chat
          </NavLink>

          <NavLink
            to="/doctor/dashboard/blood-donation"
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            🩸 Blood Donation
          </NavLink>

          <NavLink
            to="/doctor/dashboard/profile"
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            👤 Profile
          </NavLink>

          <NavLink
            to="/doctor/dashboard/settings"
            className={({ isActive }) =>
              `${linkStyle} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            ⚙ Settings
          </NavLink>

        </nav>
      </div>

      {/* ================= BOTTOM PROFILE SECTION ================= */}

      <div className="relative" ref={menuRef}>

        {/* Profile Button */}
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition"
        >
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {user?.Name?.charAt(0) || "D"}
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="font-semibold text-sm truncate">
              {user?.Name || "Doctor"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "doctor@email.com"}
            </p>
          </div>
        </div>

        {/* Dropdown */}
        {showMenu && (
          <div className="absolute bottom-16 left-0 w-full bg-white shadow-xl rounded-xl border p-2 animate-fadeIn">

            <NavLink
              to="/doctor/dashboard/profile"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
              onClick={() => setShowMenu(false)}
            >
              👤 View Profile
            </NavLink>

            <NavLink
              to="/doctor/dashboard/settings"
              className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
              onClick={() => setShowMenu(false)}
            >
              ⚙ Account Settings
            </NavLink>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 text-sm"
            >
              🚪 Logout
            </button>

          </div>
        )}
      </div>

    </div>
  );
};

export default DoctorSidebar;