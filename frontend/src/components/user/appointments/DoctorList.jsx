import { useEffect, useState } from "react";
import DoctorCard from "./DoctorCard";
import BookingModal from "./BookingModal";
const DoctorList = () => {
  const token = localStorage.getItem("token");

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    startTime: "",
    endTime: "",
    reason: ""
  });
  // const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mode, setMode] = useState("online");




  /* ================= FETCH DOCTORS ================= */
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/user/get-doctors",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setDoctors(data.doctors);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  /* ================= BOOK APPOINTMENT ================= */
  const handleBooking = async () => {
    try {
      if (!formData.appointmentDate) {
        alert("Please select a date");
        return;
      }

      if (!selectedSlot) {
        alert("Please select a time slot");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/user/appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: selectedDoctor.doctorId,
            appointmentDate: formData.appointmentDate,
            startTime: formData.startTime,
            endTime: formData.endTime,
            mode,
            reason: formData.reason,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setShowModal(false);
      setShowSuccess(true);

      // Reset
      setSelectedSlot(null);
      setAvailableSlots([]);
      setFormData({
        appointmentDate: "",
        startTime: "",
        endTime: "",
        reason: "",
      });

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>

      {/* ================= LOADING ================= */}
      {loading && <p>Loading doctors...</p>}

      {/* ================= DOCTOR CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <DoctorCard
            key={doc.doctorId}
            doctor={doc}
            onBook={(doctor) => {
              setSelectedDoctor(doctor);
              setShowModal(true);
            }}
            onViewDetails={(doctor) => {
              setSelectedDoctor(doctor);
              setShowDetailModal(true);
            }}
          />
        ))}
      </div>

      {/* ================= BOOKING MODAL ================= */}
      {showModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          token={token}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setShowSuccess(true);
          }}
        />
      )}

      {showDetailModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-2xl rounded-2xl p-8 shadow-2xl relative overflow-y-auto max-h-[90vh]">

            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setShowDetailModal(false)}
            >
              ✖
            </button>

            {/* Doctor Header */}
            <div className="flex items-center gap-6 mb-6">
              <img
                src={selectedDoctor.user?.profilePhoto || "https://randomuser.me/api/portraits/men/32.jpg"}
                alt="Doctor"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
              />

              <div>
                <h2 className="text-2xl font-bold text-blue-900">
                  Dr. {selectedDoctor.user?.Name}
                </h2>
                <p className="text-gray-600">
                  {selectedDoctor.specialization}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedDoctor.experience} Years Experience
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Hospital:</strong> {selectedDoctor.hospitalName}</p>
              <p>
                <strong>Clinic:</strong>{" "}
                {selectedDoctor.clinic?.clinicName || "Not Available"}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {selectedDoctor.clinic?.city || "Not Available"}
              </p>
              <p><strong>Consultation Fee:</strong> ₹{selectedDoctor.consultationFee}</p>
              <p>
                <strong>About:</strong>
                {selectedDoctor.about || "Experienced and compassionate healthcare professional."}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">
                Patient Reviews
              </h3>

              {selectedDoctor.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {selectedDoctor.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-3">
                      <div className="flex items-center gap-2 text-yellow-500">
                        {"★".repeat(review.rating)}
                      </div>
                      <p className="text-gray-700 mt-1">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-400">
                        — {review.userName || "Anonymous"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No reviews yet.</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= SUCCESS MODAL ================= */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-2xl text-center shadow-2xl">

            <div className="text-green-600 text-5xl mb-4">✔</div>

            <h2 className="text-xl font-bold mb-2">
              Appointment Booked!
            </h2>

            <p className="text-gray-500 mb-6">
              Your appointment request has been sent successfully.
            </p>

            <button
              onClick={() => setShowSuccess(false)}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;