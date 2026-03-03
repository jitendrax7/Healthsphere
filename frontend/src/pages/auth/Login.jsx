import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        // If OTP sent again
        if (data.otp_sent) {
          navigate("/verify-email", { state: { email: formData.email } });
          return;
        }
        throw new Error(data.message);
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      // navigate("/dashboard");
      if(data.user.role === "doctor") {
        navigate("/doctor/dashboard");
      } else  {
        navigate("/user/dashboard");
      }

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your HealthSphere journey"
    >
      <form onSubmit={handleSubmit} className="space-y-6">

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

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-700 font-medium">
            Register
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
};

export default Login;