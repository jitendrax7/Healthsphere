import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfileSetup = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({});
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
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/user/dashboard");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <div className="bg-white w-full max-w-xl rounded-xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold mb-6">Complete Health Profile</h2>

        <form onSubmit={handleSubmit} className="grid gap-4">

          <input type="number" name="age" placeholder="Age"
            required onChange={handleChange} className="p-3 border rounded" />

          <select name="gender" required
            onChange={handleChange} className="p-3 border rounded">
            <option value="">Select Gender</option>
            <option>male</option>
            <option>female</option>
            <option>other</option>
          </select>

          <input type="number" name="height"
            placeholder="Height (cm)" required
            onChange={handleChange} className="p-3 border rounded" />

          <input type="number" name="weight"
            placeholder="Weight (kg)" required
            onChange={handleChange} className="p-3 border rounded" />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 text-white py-3 rounded">
            {loading ? "Saving..." : "Save Profile"}
          </button>

          {error && <p className="text-red-500">{error}</p>}

        </form>
      </div>
    </div>
  );
};

export default UserProfileSetup;