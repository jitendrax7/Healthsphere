import { MapPin, Navigation } from "lucide-react";

const pharmacies = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    address: "Civic Center, Jabalpur",
    distance: "1.2 km",
    rating: "4.6",
    open: "Open Until 11 PM",
    mapLink: "https://maps.google.com"
  },
  {
    id: 2,
    name: "Medico Medical Store",
    address: "Wright Town, Jabalpur",
    distance: "2.5 km",
    rating: "4.2",
    open: "Open 24 Hours",
    mapLink: "https://maps.google.com"
  }
];

const NearbyPharmacies = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {pharmacies.map((store) => (
        <div
          key={store.id}
          className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-semibold text-blue-900">
              {store.name}
            </h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
              ⭐ {store.rating}
            </span>
          </div>

          <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
            <MapPin size={14} />
            {store.address}
          </p>

          <p className="text-sm text-gray-600 mb-1">
            📏 Distance: <span className="font-medium">{store.distance}</span>
          </p>

          <p className="text-sm text-green-600 mb-4">
            {store.open}
          </p>

          <a
            href={store.mapLink}
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

export default NearbyPharmacies;