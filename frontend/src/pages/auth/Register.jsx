import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user" // default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      if (data.otp_sent) {
        navigate("/verify-email", { state: { email: data.email } });
      }

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join HealthSphere and start your smart health journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Full Name
          </label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 234 567 890"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mt-2 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="text-sm font-medium text-gray-600 mb-2 block">
            Register As
          </label>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "user" })}
              className={`p-3 rounded-lg border cursor-pointer text-sm font-medium transition ${formData.role === "user"
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-600"
                }`}
            >
              👤 User
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "doctor" })}
              className={`p-3 rounded-lg border cursor-pointer text-sm font-medium transition ${formData.role === "doctor"
                ? "bg-blue-900 text-white"
                : "bg-white text-gray-600"
                }`}
            >
              🩺 Doctor
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700 font-medium">
            Login
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
};

export default Register;