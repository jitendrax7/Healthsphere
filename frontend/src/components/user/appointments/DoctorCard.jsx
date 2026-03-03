import { Star, MapPin, Clock } from "lucide-react";

const DoctorCard = ({ doctor, onBook, onViewDetails }) => {
  const isAvailable = doctor.isAvailable ?? true;

  const averageRating =
    doctor.reviews?.length > 0
      ? (
          doctor.reviews.reduce((acc, r) => acc + r.rating, 0) /
          doctor.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between">

      {/* Top Section */}
      <div>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <img
            src={
              doctor.user?.profilePhoto ||
              "https://randomuser.me/api/portraits/men/32.jpg"
            }
            alt="Doctor"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          />
        </div>

        {/* Info */}
        <div className="text-center space-y-1">

          <h3 className="text-lg font-bold text-gray-800">
            Dr. {doctor.name }
          </h3>

          <p className="text-blue-700 font-medium text-sm">
            {doctor.specialization}
          </p>

          <p className="text-sm text-gray-500">
            {doctor.experience} Years Experience
          </p>

          <p className="text-sm font-semibold text-gray-800">
            ₹{doctor.consultationFee}
          </p>

          {/* Location */}
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <MapPin size={14} />
            {doctor.clinic.city|| "Location not available"}
          </p>

          {/* Availability */}
          <div className="flex items-center justify-center gap-1 text-xs mt-2">
            <Clock size={14} />
            <span className="text-gray-500">
              {doctor.availableTime?.startTime} -{" "}
              {doctor.availableTime?.endTime}
            </span>
          </div>

          {/* Rating */}
          {averageRating ? (
            <div className="flex items-center justify-center gap-1 mt-2 text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-semibold text-gray-700">
                {averageRating}
              </span>
              <span className="text-xs text-gray-400">
                ({doctor.reviews.length})
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-2">
              No reviews yet
            </p>
          )}

          {/* Availability Badge */}
          <div className="mt-3">
            {isAvailable ? (
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                Available
              </span>
            ) : (
              <span className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-600 font-medium">
                Not Available
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6">

        <button
          onClick={() => onViewDetails(doctor)}
          className="flex-1 border border-blue-900 text-blue-900 py-2 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
        >
          More Details
        </button>

        <button
          disabled={!isAvailable}
          onClick={() => onBook(doctor)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            isAvailable
              ? "bg-blue-900 text-white hover:bg-blue-800"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Book
        </button>

      </div>
    </div>
  );
};

export default DoctorCard;