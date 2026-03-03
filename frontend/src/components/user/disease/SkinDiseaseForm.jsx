import { useState } from "react";
import axios from "axios";

const SkinDiseaseForm = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please upload an image");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", image);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/disease/skin_prediction",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setResult(response.data);

    } catch (err) {
      setError("Prediction failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl">

      <h2 className="text-xl font-semibold mb-4 text-blue-900">
        Skin Disease Prediction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Upload Section */}
        <div>
          <label className="block mb-2 font-medium">
            Upload Skin Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="h-48 rounded-lg shadow"
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
        >
          {loading ? "Analyzing..." : "Predict"}
        </button>

        {error && (
          <p className="text-red-500">{error}</p>
        )}

      </form>

      {/* Result Section */}
      {result && (
        <div className="mt-6 bg-gray-50 p-5 rounded-lg">

          <h3 className="text-lg font-semibold mb-3">
            Prediction Result
          </h3>

          <p className="mb-2">
            Most Probable Disease:
            <span className="ml-2 font-bold text-red-600">
              {result.predicted_class}
            </span>
          </p>

          <p className="mb-4">
            Confidence:
            <span className="ml-2 font-medium">
              {(result.confidence * 100).toFixed(2)}%
            </span>
          </p>

          <div>
            <h4 className="font-medium mb-2">
              All Probabilities:
            </h4>

            {result.probabilities.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-sm mb-1"
              >
                <span>{item.class}</span>
                <span>
                  {(item.probability * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default SkinDiseaseForm;