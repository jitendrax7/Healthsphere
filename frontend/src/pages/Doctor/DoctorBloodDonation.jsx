import { useState } from "react";

const DoctorBloodDonation = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    lastDonation: "",
    availability: "Available",
  });

  const donationCamps = [
    {
      id: 1,
      name: "City Blood Donation Camp",
      date: "5 March 2026",
      location: "Jabalpur Medical College",
    },
    {
      id: 2,
      name: "Red Cross Blood Drive",
      date: "12 March 2026",
      location: "Community Hall, Jabalpur",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsRegistered(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Blood Donation
      </h1>

      {/* ================= DONOR REGISTRATION ================= */}
      {!isRegistered ? (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Register as Blood Donor
          </h2>

          <form onSubmit={handleRegister} className="grid gap-4 max-w-md">

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
              <option>AB+</option>
            </select>

            <input
              type="date"
              name="lastDonation"
              onChange={handleChange}
              className="p-3 border rounded"
            />

            <select
              name="availability"
              onChange={handleChange}
              className="p-3 border rounded"
            >
              <option>Available</option>
              <option>Not Available</option>
            </select>

            <button
              type="submit"
              className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Register
            </button>

          </form>
        </div>
      ) : (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-8">
          You are registered as a blood donor. Thank you for your contribution ❤️
        </div>
      )}

      {/* ================= UPCOMING CAMPS ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Upcoming Donation Camps
        </h2>

        <div className="grid gap-4">
          {donationCamps.map((camp) => (
            <div
              key={camp.id}
              className="border p-4 rounded-lg hover:shadow transition"
            >
              <h3 className="font-semibold text-lg">{camp.name}</h3>
              <p className="text-gray-600">📅 {camp.date}</p>
              <p className="text-gray-600">📍 {camp.location}</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DoctorBloodDonation;