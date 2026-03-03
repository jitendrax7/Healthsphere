import axios from "axios";
import UserHealthProfile from "../models/UserHealthProfile.js";
import savePredictionHistory from "../utils/savePredictionHistory.js";
import PredictionHistory from "../models/PredictionHistory.js";
/* ======================================================
   GET DIABETES DATA FROM PROFILE
====================================================== */

export const getUserPredictionHistory = async (req, res) => {
  try {
    const history = await PredictionHistory.find({
      user: req.user._id
    })
      .select("-inputData -__v") // exclude inputData and version field
      .sort({ createdAt: -1 });  // latest first

    const formattedHistory = history.map(item => ({
      id: item._id,
      disease: item.diseaseType,
      date: item.createdAt.toLocaleDateString(),
      time: item.createdAt.toLocaleTimeString(),
      prediction: item.prediction,
      riskLevel: item.riskLevel,
      probability: `${item.probability}%`
    }));

    res.status(200).json({
      message: "Prediction history fetched successfully",
      count: formattedHistory.length,
      data: formattedHistory
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


export const getDiabetesData = async (req, res) => {
  try {
    const profile = await UserHealthProfile.findOne({
      user: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    const responseData = {
      BMI: profile.bmi || null,
      Age: profile.age || null
    };

    res.status(200).json({
      message: "Available diabetes data",
      data: responseData
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

/* ======================================================
   POST DIABETES PREDICTION
====================================================== */
export const predictDiabetes = async (req, res) => {
  try {
    const inputData = req.body;

    const response = await axios.post(
      "http://localhost:5001/diabetes_prediction",
      inputData
    );
    console.log("Diabetes prediction response:", response.data);
    const result = response.data;

    const history = await savePredictionHistory({
      userId: req.user._id,
      diseaseType: "Diabetes",
      prediction: result.prediction,
      probability: result.probability,
      inputData
    });
   
    console.log(history);
    
    res.status(200).json({
      message: "Prediction successful",
      data: history
    });

  } catch (error) {
    res.status(500).json({
      message: "Prediction failed",
      error: error.message
    });
  }
};

/* ======================================================
   GET HEART DATA FROM PROFILE
====================================================== */

export const getHeartData = async (req, res) => {
  try {
    const profile = await UserHealthProfile.findOne({
      user: req.user._id
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    const responseData = {
      BMI: profile.bmi || null,
      Sex: profile.gender === "male" ? 1 : 0,
      AgeCategory: profile.age ? Math.floor(profile.age / 5) : null
    };

    res.status(200).json({
      message: "Available heart prediction data",
      data: responseData
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

/* ======================================================
   POST HEART PREDICTION
====================================================== */
export const predictHeart = async (req, res) => {
  try {
    const inputData = req.body;

    const response = await axios.post(
      "http://localhost:5001/heart_predict",
      inputData
    );

    const result = response.data;

    const history = await savePredictionHistory({
      userId: req.user._id,
      diseaseType: "Heart Disease",
      prediction: result.prediction,
      probability: result.probability,
      inputData
    });

    res.status(200).json({
      message: "Prediction successful",
      data: {
        disease: history.diseaseType,
        date: history.createdAt.toLocaleDateString(),
        time: history.createdAt.toLocaleTimeString(),
        prediction: history.prediction,
        riskLevel: history.riskLevel,
        probability: history.probability
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Prediction failed",
      error: error.message
    });
  }
};