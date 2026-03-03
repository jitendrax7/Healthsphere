import { useState, useEffect } from "react";
import axios from "axios";
import DiabetesForm from "../../components/user/disease/DiabetesForm";
import HeartForm from "../../components/user/disease/HeartForm";
import SelectionCard from "../../components/user/DiseasePredictionCard";
import SkinDiseaseForm from "../../components/user/disease/SkinDiseaseForm";

const DiseasePrediction = () => {
  const [activeTab, setActiveTab] = useState("predict");
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [gender, setGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const resetFlow = () => {
    setSelectedDisease(null);
    setGender(null);
  };

  /* ===============================
     FETCH REAL PREDICTION HISTORY
  =============================== */
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/disease/history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setHistory(response.data.data);

    } catch (err) {
      setError("Failed to load history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ================= TOP NAV ================= */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("predict")}
          className={`px-4 py-2 rounded cursor-pointer ${activeTab === "predict"
              ? "bg-blue-900 text-white"
              : "bg-white border"
            }`}
        >
          Disease Prediction
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded cursor-pointer ${activeTab === "history"
              ? "bg-blue-900 text-white"
              : "bg-white border"
            }`}
        >
          Prediction History
        </button>
      </div>

      {/* ================= PREDICTION SECTION ================= */}
      {activeTab === "predict" && (
        <div className="space-y-8">

          {!selectedDisease && (
            <div className="grid md:grid-cols-2 gap-6">
              <SelectionCard
                title="🫀 Heart Disease"
                desc="Predict cardiovascular disease risk."
                onClick={() => setSelectedDisease("heart")}
              />

              <SelectionCard
                title="🩸 Diabetes"
                desc="Predict diabetes risk level."
                onClick={() => setSelectedDisease("diabetes")}
              />
              <SelectionCard
                title="🧴 Skin Disease"
                desc="Upload skin image and predict possible skin condition."
                onClick={() => setSelectedDisease("skin")}
              />
            </div>
          )}

          {selectedDisease === "diabetes" && !gender && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">
                Select Gender
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <SelectionCard
                  title="Male"
                  desc="Proceed with male health parameters."
                  onClick={() => setGender("male")}
                />

                <SelectionCard
                  title="Female"
                  desc="Proceed with female health parameters."
                  onClick={() => setGender("female")}
                />

              </div>
            </div>
          )}

          {(selectedDisease || gender) && (
            <button
              onClick={resetFlow}
              className="text-blue-900 hover:underline"
            >
              ← Back
            </button>
          )}

          {selectedDisease === "heart" && <HeartForm />}
          {selectedDisease === "diabetes" && gender && (
            <DiabetesForm gender={gender} />
          )}
          {selectedDisease === "skin" && <SkinDiseaseForm />}
        </div>
      )}

      {/* ================= HISTORY SECTION ================= */}
      {activeTab === "history" && (
        <div>
          {loading ? (
            <p>Loading history...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : history.length === 0 ? (
            <p>No prediction history found.</p>
          ) : (
            <div className="grid gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded shadow"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-lg">
                      {item.disease}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {item.date} | {item.time}
                    </span>
                  </div>

                  <p>
                    Prediction:{" "}
                    <strong>{item.prediction}</strong>
                  </p>

                  <p>
                    Risk Level:{" "}
                    <span
                      className={
                        item.prediction === 1
                          ? "text-red-600 font-medium"
                          : "text-green-600 font-medium"
                      }
                    >
                      {item.riskLevel}
                    </span>
                  </p>

                  <p>
                    Probability: {item.probability}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseasePrediction;