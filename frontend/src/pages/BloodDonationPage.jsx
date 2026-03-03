import { useState } from "react";

const BloodDonationPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    city: "",
    contact: ""
  });

  const donationRequests = [
    {
      id: 1,
      patient: "Rahul Verma",
      bloodGroup: "A+",
      hospital: "City Hospital, Jabalpur",
      urgency: "High"
    },
    {
      id: 2,
      patient: "Priya Sharma",
      bloodGroup: "O-",
      hospital: "Apollo Clinic, Bhopal",
      urgency: "Critical"
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for registering as a blood donor ❤️");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white px-6 py-12">

      {/* ================= HERO SECTION ================= */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-red-700">
          Blood Donation Saves Lives
        </h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Join our community of life-savers. Register as a blood donor
          and help those in urgent need.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="mt-6 bg-red-600 cursor-pointer text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transition duration-300"
        >
          Become a Donor ❤️
        </button>
      </div>

      {/* ================= DONOR REGISTRATION MODAL ================= */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl relative animate-fadeIn">

            <button
              onClick={() => setShowForm(false)}
              className="absolute cursor-pointer top-4 right-4 text-gray-500"
            >
              ✖
            </button>

            <h2 className="text-2xl cup font-bold text-red-700 mb-6 text-center">
              Register as a Blood Donor
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
              />

              <select
                name="bloodGroup"
                required
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>

              <input
                type="text"
                name="city"
                placeholder="City"
                required
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
              />

              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                required
                onChange={handleChange}
                className="p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
              />

              <button
                type="submit"
                className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
              >
                Register Now
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ================= BLOOD REQUESTS ================= */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Urgent Blood Requests
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {donationRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {request.bloodGroup}
                </span>

                <span
                  className={`text-sm font-medium ${
                    request.urgency === "Critical"
                      ? "text-red-600"
                      : "text-orange-500"
                  }`}
                >
                  {request.urgency}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-2">
                {request.patient}
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                {request.hospital}
              </p>

              <button className="w-full bg-red-600 text-white cursor-pointer py-2 rounded-lg hover:bg-red-700 transition">
                Contact Hospital
              </button>
            </div>
          ))}

        </div>
      </div>

      {/* ================= IMPACT SECTION ================= */}
      <div className="mt-20 text-center bg-red-600 text-white p-10 rounded-2xl shadow-lg">

        <h2 className="text-3xl font-bold mb-4">
          One Donation Can Save Up to 3 Lives
        </h2>

        <p className="max-w-2xl mx-auto mb-6">
          Your small act of kindness can make a life-changing
          difference. Join our blood donation mission today.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="bg-white cursor-pointer text-red-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Donate Blood Now
        </button>

      </div>

    </div>
  );
};

export default BloodDonationPage;