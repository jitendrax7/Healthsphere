import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SetupProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [role, setRole] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===========================
     FETCH USER ROLE
  =========================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setRole(data.user.role);

      } catch (err) {
        setError("Unable to fetch user info");
      }

      setLoadingRole(false);
    };

    fetchUser();
  }, [token]);

  /* ===========================
     HANDLE INPUT CHANGE
  =========================== */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Initialize qualifications if doctor
  useEffect(() => {
    if (role === "doctor") {
      setFormData((prev) => ({
        ...prev,
        qualifications: [
          { degree: "", institute: "", year: "" }
        ]
      }));
    }
  }, [role]);

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [
        ...formData.qualifications,
        { degree: "", institute: "", year: "" }
      ]
    });
  };

  const removeQualification = (index) => {
    const updated = formData.qualifications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      qualifications: updated
    });
  };

  const handleQualificationChange = (index, field, value) => {
    const updated = [...formData.qualifications];
    updated[index][field] = value;

    setFormData({
      ...formData,
      qualifications: updated
    });
  };
  /* ===========================
     SUBMIT FORM
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let url = "";

      if (role === "user") {
        url = "http://localhost:5000/api/user/profile";
      } else if (role === "doctor") {
        url = "http://localhost:5000/api/doctor/profile";
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  if (loadingRole) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">

      <div className="bg-white w-full max-w-2xl rounded-xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          {role === "doctor"
            ? "Complete Doctor Profile"
            : "Complete Health Profile"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* ================= USER FORM ================= */}
          {role === "user" && (
            <>
              <input
                type="number"
                name="age"
                placeholder="Age"
                required
                onChange={handleChange}
                className="p-3 border rounded"
              />

              <select
                name="gender"
                required
                onChange={handleChange}
                className="p-3 border rounded"
              >
                <option value="">Select Gender</option>
                <option>male</option>
                <option>female</option>
                <option>other</option>
              </select>

              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                required
                onChange={handleChange}
                className="p-3 border rounded"
              />

              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                required
                onChange={handleChange}
                className="p-3 border rounded"
              />

              <select
                name="bloodGroup"
                required
                onChange={handleChange}
                className="p-3 border rounded"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>B+</option>
                <option>O+</option>
              </select>
            </>
          )}

          {/* ================= DOCTOR FORM ================= */}
          {/* ================= DOCTOR FORM ================= */}
          {role === "doctor" && (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                required
                onChange={handleChange}
                className="p-3 border rounded"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience (years)"
                required
                onChange={handleChange}
                className="p-3 border rounded"
              />

              <input
                type="number"
                name="consultationFee"
                placeholder="Consultation Fee"
                required
                onChange={handleChange}
                className="p-3 border rounded"
              />

              <input
                type="text"
                name="hospitalName"
                placeholder="Hospital Name"
                onChange={handleChange}
                className="p-3 border rounded"
              />

              <textarea
                name="bio"
                placeholder="Short Bio"
                onChange={handleChange}
                className="p-3 border rounded"
              />

              {/* ================= QUALIFICATIONS ================= */}

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Qualifications</h3>

                {formData.qualifications?.map((q, index) => (
                  <div key={index} className="grid gap-2 mb-3 border p-3 rounded">

                    <input
                      type="text"
                      placeholder="Degree (e.g. MBBS)"
                      value={q.degree}
                      onChange={(e) =>
                        handleQualificationChange(index, "degree", e.target.value)
                      }
                      className="p-2 border rounded"
                    />

                    <input
                      type="text"
                      placeholder="Institute"
                      value={q.institute}
                      onChange={(e) =>
                        handleQualificationChange(index, "institute", e.target.value)
                      }
                      className="p-2 border rounded"
                    />

                    <input
                      type="number"
                      placeholder="Year"
                      value={q.year}
                      onChange={(e) =>
                        handleQualificationChange(index, "year", e.target.value)
                      }
                      className="p-2 border rounded"
                    />

                    <button
                      type="button"
                      onClick={() => removeQualification(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addQualification}
                  className="text-blue-600 text-sm mt-2"
                >
                  + Add Qualification
                </button>
              </div>
            </>
          )}

          {error && <div className="text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-900 text-white py-3 rounded"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SetupProfile;