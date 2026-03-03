import { useEffect, useState } from "react";

const DoctorProfile = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    consultationFee: "",
    hospitalName: "",
    bio: "",
    availableDays: [],
    availableTime: {
      startTime: "",
      endTime: "",
    },
    clinicLocation: {
      clinicName: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    },
    qualifications: [{ degree: "", institute: "", year: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/doctor/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.profile) {
          setFormData(data.profile);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [token]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvailableTimeChange = (e) => {
    setFormData({
      ...formData,
      availableTime: {
        ...formData.availableTime,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleClinicChange = (e) => {
    setFormData({
      ...formData,
      clinicLocation: {
        ...formData.clinicLocation,
        [e.target.name]: e.target.value,
      },
    });
  };

  const toggleDay = (day) => {
    const updated = formData.availableDays.includes(day)
      ? formData.availableDays.filter((d) => d !== day)
      : [...formData.availableDays, day];

    setFormData({ ...formData, availableDays: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await fetch("http://localhost:5000/api/doctor/profile", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setSuccess("Profile saved successfully!");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Doctor Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 space-y-6"
      >
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (years)"
            value={formData.experience}
            onChange={handleChange}
            className="p-3 border rounded-lg"
            required
          />

          <input
            type="number"
            name="consultationFee"
            placeholder="Consultation Fee"
            value={formData.consultationFee}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />

          <input
            name="hospitalName"
            placeholder="Hospital Name"
            value={formData.hospitalName}
            onChange={handleChange}
            className="p-3 border rounded-lg"
          />
        </div>

        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          className="p-3 border rounded-lg w-full"
        />

        {/* Availability */}
        <div>
          <h3 className="font-semibold mb-2">Available Days</h3>
          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-1 rounded-full border ${
                  formData.availableDays.includes(day)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-3">
            <input
              type="time"
              name="startTime"
              value={formData.availableTime.startTime}
              onChange={handleAvailableTimeChange}
              className="p-2 border rounded"
            />
            <input
              type="time"
              name="endTime"
              value={formData.availableTime.endTime}
              onChange={handleAvailableTimeChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Clinic Section */}
        <div>
          <h3 className="font-semibold mb-2">Clinic Details</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              name="clinicName"
              placeholder="Clinic Name"
              value={formData.clinicLocation.clinicName}
              onChange={handleClinicChange}
              className="p-2 border rounded"
            />
            <input
              name="addressLine"
              placeholder="Address Line"
              value={formData.clinicLocation.addressLine}
              onChange={handleClinicChange}
              className="p-2 border rounded"
            />
            <input
              name="city"
              placeholder="City"
              value={formData.clinicLocation.city}
              onChange={handleClinicChange}
              className="p-2 border rounded"
            />
            <input
              name="state"
              placeholder="State"
              value={formData.clinicLocation.state}
              onChange={handleClinicChange}
              className="p-2 border rounded"
            />
            <input
              name="pincode"
              placeholder="Pincode"
              value={formData.clinicLocation.pincode}
              onChange={handleClinicChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {success && (
          <div className="text-green-600 font-medium">{success}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white py-3 px-6 rounded-xl hover:bg-blue-800 transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default DoctorProfile;