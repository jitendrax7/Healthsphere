import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    navigate("/register");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Go to profile setup
      // navigate("/setup-profile");

      if (data.user.role === "doctor") {
        navigate("/doctor/setup-profile");
      } else {
        navigate("/user/setup-profile");
      }

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`OTP sent to ${email}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Enter the 6-digit verification code
          </p>
        </div>

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full text-center text-2xl tracking-widest p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

      </form>
    </AuthLayout>
  );
};

export default VerifyEmail;