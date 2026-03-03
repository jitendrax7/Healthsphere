import { useState } from "react";

const HeartForm = () => {
  const [formData, setFormData] = useState({
    BMI: "",
    Smoking: 0,
    AlcoholDrinking: 0,
    Stroke: 0,
    PhysicalHealth: "",
    MentalHealth: "",
    DiffWalking: 0,
    Sex: 1,
    AgeCategory: "",
    Diabetic: "",
    PhysicalActivity: 0,
    GenHealth: "",
    SleepTime: "",
    Asthma: 0,
    KidneyDisease: 0,
    SkinCancer: 0,
    Race: ""
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleToggle = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      // Convert all values to numbers
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, Number(value)])
      );

      const response = await fetch("http://localhost:5000/api/disease/heart-predict", {
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
        Heart Disease Risk Assessment
      </h3>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-sm border"
      >

        {/* Numeric Fields */}
        <Input label="BMI" name="BMI" value={formData.BMI} onChange={handleChange} />
        <Input label="Physical Health (Days)" name="PhysicalHealth" value={formData.PhysicalHealth} onChange={handleChange} />
        <Input label="Mental Health (Days)" name="MentalHealth" value={formData.MentalHealth} onChange={handleChange} />
        <Input label="Sleep Time (Hours)" name="SleepTime" value={formData.SleepTime} onChange={handleChange} />

        {/* Yes / No Toggles */}
        <Toggle label="Smoking" name="Smoking" value={formData.Smoking} onChange={handleToggle} />
        <Toggle label="Alcohol Drinking" name="AlcoholDrinking" value={formData.AlcoholDrinking} onChange={handleToggle} />
        <Toggle label="Stroke History" name="Stroke" value={formData.Stroke} onChange={handleToggle} />
        <Toggle label="Difficulty Walking" name="DiffWalking" value={formData.DiffWalking} onChange={handleToggle} />
        <Toggle label="Physical Activity" name="PhysicalActivity" value={formData.PhysicalActivity} onChange={handleToggle} />
        <Toggle label="Asthma" name="Asthma" value={formData.Asthma} onChange={handleToggle} />
        <Toggle label="Kidney Disease" name="KidneyDisease" value={formData.KidneyDisease} onChange={handleToggle} />
        <Toggle label="Skin Cancer" name="SkinCancer" value={formData.SkinCancer} onChange={handleToggle} />

        {/* Select Fields */}
        <SelectField
          label="Sex"
          name="Sex"
          value={formData.Sex}
          onChange={handleChange}
          options={[
            { label: "Male", value: 1 },
            { label: "Female", value: 0 }
          ]}
        />

        <SelectField
          label="Age Category"
          name="AgeCategory"
          value={formData.AgeCategory}
          onChange={handleChange}
          options={[
            { label: "18-24", value: 0 },
            { label: "25-29", value: 1 },
            { label: "30-34", value: 2 },
            { label: "35-39", value: 3 },
            { label: "40-44", value: 4 },
            { label: "45-49", value: 5 },
            { label: "50-54", value: 6 },
            { label: "55-59", value: 7 },
            { label: "60-64", value: 8 },
            { label: "65-69", value: 9 },
            { label: "70-74", value: 10 },
            { label: "75-79", value: 11 },
            { label: "80+", value: 12 }
          ]}
        />

        <SelectField
          label="Diabetic"
          name="Diabetic"
          value={formData.Diabetic}
          onChange={handleChange}
          options={[
            { label: "No", value: 0 },
            { label: "Yes", value: 1 },
            { label: "Borderline", value: 2 },
            { label: "During Pregnancy", value: 3 }
          ]}
        />

        <SelectField
          label="General Health"
          name="GenHealth"
          value={formData.GenHealth}
          onChange={handleChange}
          options={[
            { label: "Excellent", value: 0 },
            { label: "Very Good", value: 1 },
            { label: "Good", value: 2 },
            { label: "Fair", value: 3 },
            { label: "Poor", value: 4 }
          ]}
        />

        <SelectField
          label="Race"
          name="Race"
          value={formData.Race}
          onChange={handleChange}
          options={[
            { label: "White", value: 0 },
            { label: "Black", value: 1 },
            { label: "Asian", value: 2 },
            { label: "American Indian", value: 3 },
            { label: "Other", value: 4 }
          ]}
        />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Predict Heart Disease Risk
          </button>
        </div>

      </form>

      {result && !result.error && (
        <div className="mt-8 bg-white border rounded-2xl shadow-lg p-8 transition-all duration-500">

          <h4 className="text-lg font-semibold mb-6 text-gray-800">
            Heart Disease Prediction Result
          </h4>

          {/* Risk Level Badge */}
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

          {/* Probability Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Risk Probability</span>
              <span>{(result.probability ).toFixed(2)}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${result.prediction === 1
                    ? "bg-red-500"
                    : "bg-green-500"
                  }`}
                style={{ width: `${result.probability }%` }}
              />
            </div>
          </div>

          {/* Interpretation */}
          <div className="mt-6 text-sm">
            {result.prediction === 1 ? (
              <div className="text-red-600 font-medium">
                ❤️ High risk detected. Please consult a cardiologist for medical evaluation.
              </div>
            ) : (
              <div className="text-green-600 font-medium">
                💚 Low risk detected. Maintain healthy lifestyle habits.
              </div>
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
        <div className="mt-6 text-blue-600 font-medium animate-pulse">
          🔄 Analyzing cardiovascular risk...
        </div>
      )}

    </div>
  );
};


/* ================= Reusable Components ================= */

const Input = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-2">{label}</label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      required
      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

const Toggle = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-2">{label}</label>
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onChange(name, 1)}
        className={`px-4 py-2 rounded-lg border ${value === 1
          ? "bg-blue-900 text-white"
          : "bg-white text-gray-600"
          }`}
      >
        Yes
      </button>

      <button
        type="button"
        onClick={() => onChange(name, 0)}
        className={`px-4 py-2 rounded-lg border ${value === 0
          ? "bg-blue-900 text-white"
          : "bg-white text-gray-600"
          }`}
      >
        No
      </button>
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600 mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">Select</option>
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default HeartForm;