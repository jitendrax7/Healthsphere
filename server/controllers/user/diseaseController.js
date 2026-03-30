import axios from "axios";
import UserHealthProfile from "../../models/UserHealthProfile.js";
import savePredictionHistory from "../../utils/savePredictionHistory.js";
import PredictionHistory from "../../models/PredictionHistory.js";
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

    const ageMap = {
      "18-24":0,
      "25-29":1,
      "30-34":2,
      "35-39":3,
      "40-44":4,
      "45-49":5,
      "50-54":6,
      "55-59":7,
      "60-64":8,
      "65-69":9,
      "70-74":10,
      "75-79":11,
      "80+":12
    };

    const raceMap = {
      "White":0,
      "Black":1,
      "Asian":2,
      "American Indian":3,
      "Other":4
    };

    const healthMap = {
      "Excellent":0,
      "Very Good":1,
      "Good":2,
      "Fair":3,
      "Poor":4
    };

    const diabeticMap = {
      "No":0,
      "Yes":1,
      "Borderline":2,
      "During Pregnancy":3
    };

    /* ================= NORMALIZE INPUT ================= */

    let inputData = {

      AgeCategory:
        typeof req.body.AgeCategory === "string"
        ? ageMap[req.body.AgeCategory]
        : Number(req.body.AgeCategory),

      AlcoholDrinking:Number(req.body.AlcoholDrinking),

      Asthma:Number(req.body.Asthma),

      BMI:Number(req.body.BMI),

      Diabetic:
        typeof req.body.Diabetic === "string"
        ? diabeticMap[req.body.Diabetic]
        : Number(req.body.Diabetic),

      DiffWalking:Number(req.body.DiffWalking),

      GenHealth:
        typeof req.body.GenHealth === "string"
        ? healthMap[req.body.GenHealth]
        : Number(req.body.GenHealth),

      KidneyDisease:Number(req.body.KidneyDisease),

      MentalHealth:Number(req.body.MentalHealth),

      PhysicalActivity:Number(req.body.PhysicalActivity),

      PhysicalHealth:Number(req.body.PhysicalHealth),

      Race:
        typeof req.body.Race === "string"
        ? raceMap[req.body.Race]
        : Number(req.body.Race),

      Sex:Number(req.body.Sex),

      SkinCancer:Number(req.body.SkinCancer),

      SleepTime:Number(req.body.SleepTime),

      Smoking:Number(req.body.Smoking),

      Stroke:Number(req.body.Stroke)
    };

    /* ================= VALIDATION ================= */

    for(const [key,value] of Object.entries(inputData)){

      if(value === undefined || value === null || Number.isNaN(value)){
        return res.status(400).json({
          message:`Invalid value for ${key}`
        });
      }

    }

    if(inputData.BMI < 10 || inputData.BMI > 100){
      return res.status(400).json({
        message:"Invalid BMI"
      });
    }

    if(inputData.SleepTime < 0 || inputData.SleepTime > 24){
      return res.status(400).json({
        message:"Invalid sleep hours"
      });
    }

    if(inputData.MentalHealth < 0 || inputData.MentalHealth > 30){
      return res.status(400).json({
        message:"Invalid mental health days"
      });
    }

    if(inputData.PhysicalHealth < 0 || inputData.PhysicalHealth > 30){
      return res.status(400).json({
        message:"Invalid physical health days"
      });
    }

    /* ================= ML CALL ================= */

    const response = await axios.post(
      "http://localhost:5001/heart_predict",
      inputData
    );

    const result = response.data;

    const history = await savePredictionHistory({
      userId:req.user._id,
      diseaseType:"Heart Disease",
      prediction:result.prediction,
      probability:result.probability,
      inputData
    });

    res.status(200).json({

      message:"Prediction successful",

      data:{
        disease:history.diseaseType,
        date:history.createdAt.toLocaleDateString(),
        time:history.createdAt.toLocaleTimeString(),
        prediction:history.prediction,
        riskLevel:history.riskLevel,
        probability:history.probability
      }

    });

  } catch(error){

    console.error(error);

    res.status(500).json({
      message:"Prediction failed",
      error:error.message
    });

  }
};