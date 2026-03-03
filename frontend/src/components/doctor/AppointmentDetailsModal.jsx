import { useEffect } from "react";

const AppointmentDetailsModal = ({
  appointment,
  onClose,
  showRejectSection = false,
  onReject,
  onConfirm,
  rejectReason,
  setRejectReason,
}) => {
  if (!appointment) return null;

  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const getStatusColor = () => {
    switch (appointment.status) {
      case "Approved":
        return "bg-green-100 text-green-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-yellow-100 text-yellow-600";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3"
      onClick={onClose} 
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Appointment Details
          </h2>

          <span
            className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor()}`}
          >
            {appointment.status || "Pending"}
          </span>
        </div>

        {/* Appointment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Info label="Patient" value={appointment.patient} />
          <Info label="Location" value={appointment.location} />
          <Info label="Requested At" value={appointment.requestTime} />
          <Info label="Appointment Date" value={appointment.appointmentDate} />
          <Info label="Appointment Time" value={appointment.appointmentTime} />
          <Info label="Mode" value={appointment.mode} />
        </div>

        {/* Problem */}
        <div className="mt-5">
          <h3 className="font-semibold text-sm mb-1">
            Problem Description
          </h3>
          <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
            {appointment.problem}
          </p>
        </div>

        {/* Reject Section */}
        {showRejectSection && (
          <div className="mt-6 border-t pt-4">
            <label className="block text-sm font-medium mb-2">
              Reject Reason
            </label>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-400 outline-none"
              placeholder="Enter reason for rejection..."
              rows={3}
            />

            <button
              onClick={() => onReject(appointment.id)}
              disabled={!rejectReason.trim()}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50"
            >
              Confirm Reject
            </button>
          </div>
        )}

        {/* Footer Buttons */}
        {appointment.status === "Pending" && (
          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button
              onClick={() => onConfirm(appointment.id)}
              className="bg-green-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-600 transition"
            >
              Confirm Appointment
            </button>

            <button
              onClick={onClose}
              className="bg-gray-200 px-5 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


const Info = ({ label, value }) => (
  <div>
    <span className="font-semibold">{label}:</span>{" "}
    <span className="text-gray-700">{value}</span>
  </div>
);

export default AppointmentDetailsModal;