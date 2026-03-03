import { useState } from "react";
import NearbyHospitals from "../../components/user/nearby/NearbyHospitals";
import NearbyPharmacies from "../../components/user/nearby/NearbyPharmacies";

const NearbyFinderPage = () => {
  const [activeTab, setActiveTab] = useState("hospital");

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ===== TOP NAV ===== */}
      <div className="flex gap-4 mb-6 flex-wrap">

        <button
          onClick={() => setActiveTab("hospital")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "hospital"
              ? "bg-blue-900 text-white"
              : "bg-white border"
          }`}
        >
          Nearby Hospitals
        </button>

        <button
          onClick={() => setActiveTab("pharmacy")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "pharmacy"
              ? "bg-blue-900 text-white"
              : "bg-white border"
          }`}
        >
          Nearby Pharmacies
        </button>

      </div>

      {/* ===== CONTENT ===== */}
      {activeTab === "hospital" && <NearbyHospitals />}
      {activeTab === "pharmacy" && <NearbyPharmacies />}

    </div>
  );
};

export default NearbyFinderPage;