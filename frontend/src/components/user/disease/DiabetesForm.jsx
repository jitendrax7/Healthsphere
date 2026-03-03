import { useState } from "react";
import InputField from "./InputField";

const DiabetesForm = ({ gender }) => {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, Number(value)])
      );

      const response = await fetch("http://localhost:5000/api/disease/diabetes-predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(numericData),
      });

      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      setResult({ error: "Prediction failed. Try again." });
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">

      <h3 className="text-xl font-semibold text-gray-800">
        Diabetes Risk Assessment ({gender})
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-sm border"
      >

        {gender === "female" && (
          <InputField
            label="Pregnancies"
            name="Pregnancies"
            value={formData.Pregnancies}
            onChange={handleChange}
          />
        )}

        <InputField label="Glucose Level" name="Glucose" value={formData.Glucose} onChange={handleChange} />
        <InputField label="Blood Pressure" name="BloodPressure" value={formData.BloodPressure} onChange={handleChange} />
        <InputField label="Skin Thickness" name="SkinThickness" value={formData.SkinThickness} onChange={handleChange} />
        <InputField label="Insulin" name="Insulin" value={formData.Insulin} onChange={handleChange} />
        <InputField label="BMI" name="BMI" value={formData.BMI} onChange={handleChange} />
        <InputField label="Diabetes Pedigree Function" name="DiabetesPedigreeFunction" value={formData.DiabetesPedigreeFunction} onChange={handleChange} />
        <InputField label="Age" name="Age" value={formData.Age} onChange={handleChange} />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Predict Diabetes Risk
          </button>
        </div>

      </form>

      {result && !result.error && (
        <div className="mt-8 bg-white border rounded-2xl shadow-md p-8">

          <h4 className="text-lg font-semibold mb-4 text-gray-800">
            Prediction Result
          </h4>

          {/* Risk Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 font-medium">Risk Level</span>
            <span
              className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${result.prediction === 1
                ? "bg-red-600"
                : "bg-green-600"
                }`}
            >
              {result.risk_level}
            </span>
          </div>

          {/* Probability */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Probability</span>
              <span>{(result.probability ).toFixed(2)}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${result.prediction === 1
                  ? "bg-red-500"
                  : "bg-green-500"
                  }`}
                style={{ width: `${result.probability }%` }}
              />
            </div>
          </div>

          {/* Medical Advice */}
          <div className="mt-6 text-sm text-gray-600">
            {result.prediction === 1 ? (
              <p className="text-red-600 font-medium">
                ⚠️ High risk detected. Please consult a healthcare professional for further evaluation.
              </p>
            ) : (
              <p className="text-green-600 font-medium">
                ✅ Low risk detected. Maintain a healthy lifestyle and regular check-ups.
              </p>
            )}
          </div>
        </div>
      )}

      {result?.error && (
        <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-xl text-red-600">
          {result.error}
        </div>
      )}

      {loading && (
        <div className="mt-6 text-blue-600 font-medium">
          🔄 Analyzing data...
        </div>
      )}

    </div>
  );
};

export default DiabetesForm;