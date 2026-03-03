import { useState, useMemo } from "react";

const HealthcareCamp = () => {

  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  // Dummy Data
  const [camps] = useState([
    {
      id: 1,
      title: "Free Heart Checkup Camp",
      date: "2026-03-15",
      location: "Jabalpur Medical College, Jabalpur",
      purpose: "Free ECG, BP & Heart Screening",
      description:
        "Join our free heart health awareness camp. Early detection saves lives.",
      image:
        "https://img.studyclap.com/img/institute/college/773x343/4253/ddypmchrc-pune-6d6fdac71b.jpg"
    },
    {
      id: 2,
      title: "Diabetes Awareness Camp",
      date: "2026-03-22",
      location: "City Hospital, Bhopal",
      purpose: "Free Sugar Test & Consultation",
      description:
        "Low-cost diabetes screening and lifestyle counseling.",
      image:
        "https://img.studyclap.com/img/institute/college/773x343/4253/ddypmchrc-pune-6d6fdac71b.jpg"
    }
  ]);

  // Unique Locations for Filter Dropdown
  const locations = ["All", ...new Set(camps.map(c => c.location))];

  // Filter + Search + Sort Logic
  const filteredCamps = useMemo(() => {
    let filtered = camps.filter(camp =>
      camp.title.toLowerCase().includes(search.toLowerCase())
    );

    if (filterLocation !== "All") {
      filtered = filtered.filter(camp => camp.location === filterLocation);
    }

    filtered.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

    return filtered;
  }, [search, filterLocation, sortOrder, camps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-12">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-6">

        <div>
          <h1 className="text-4xl font-bold text-blue-900">
            Upcoming Healthcare Camps
          </h1>
          <p className="text-gray-600 mt-3">
            Participate in free & affordable healthcare programs near you.
          </p>
        </div>

        {/* 🔍 SEARCH + FILTER + SORT */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">

          {/* Search */}
          <input
            type="text"
            placeholder="Search camps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />

          {/* Filter */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

        </div>
      </div>

      {/* ================= CAMP GRID ================= */}
      <div className="grid md:grid-cols-3 gap-8">

        {filteredCamps.length > 0 ? (
          filteredCamps.map((camp) => (
            <div
              key={camp.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-500 hover:-translate-y-3 hover:shadow-2xl"
            >

              {/* Camp Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={camp.image}
                  alt={camp.title}
                  className="w-full h-full object-cover transform transition duration-500 hover:scale-110"
                />
              </div>

              {/* Camp Content */}
              <div className="p-6">

                <h2 className="text-xl font-bold text-blue-800 mb-2">
                  {camp.title}
                </h2>

                <p className="text-sm text-gray-500 mb-2">
                  📅 {new Date(camp.date).toDateString()}
                </p>

                <p className="text-sm text-gray-600 mb-2">
                  📍 {camp.location}
                </p>

                <p className="text-sm text-blue-700 font-medium mb-3">
                  {camp.purpose}
                </p>

                <p className="text-gray-600 text-sm mb-4">
                  {camp.description}
                </p>

                {/* Buttons */}
                <div className="flex justify-between items-center">

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      camp.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                  >
                    View on Map
                  </a>

                  <button
                    className="text-sm border border-blue-900 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-900 hover:text-white transition cursor-pointer"
                  >
                    Register
                  </button>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg">
            No camps found.
          </div>
        )}

      </div>
    </div>
  );
};

export default HealthcareCamp;