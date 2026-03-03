import { MapPin, Navigation } from "lucide-react";

const hospitals = [
  {
    id: 1,
    name: "City Care Hospital",
    address: "Main Road, Jabalpur",
    distance: "2.1 km",
    rating: "4.5",
    open: "Open 24 Hours",
    mapLink: "https://maps.google.com"
  },
  {
    id: 2,
    name: "Apollo Health Center",
    address: "Napier Town, Jabalpur",
    distance: "3.8 km",
    rating: "4.3",
    open: "Open 24 Hours",
    mapLink: "https://maps.google.com"
  }
];

const NearbyHospitals = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {hospitals.map((hospital) => (
        <div
          key={hospital.id}
          className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-semibold text-blue-900">
              {hospital.name}
            </h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
              ⭐ {hospital.rating}
            </span>
          </div>

          <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
            <MapPin size={14} />
            {hospital.address}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            📏 Distance: <span className="font-medium">{hospital.distance}</span>
          </p>

          <p className="text-sm text-green-600 mb-4">
            {hospital.open}
          </p>

          <a
            href={hospital.mapLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition"
          >
            <Navigation size={14} />
            View on Google Maps
          </a>
        </div>
      ))}
    </div>
  );
};

export default NearbyHospitals;