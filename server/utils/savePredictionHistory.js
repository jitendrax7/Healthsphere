import PredictionHistory from "../models/PredictionHistory.js";

const savePredictionHistory = async ({
  userId,
  diseaseType,
  prediction,
  probability,
  inputData
}) => {

  const probabilityPercentage = (probability * 100).toFixed(2);

  const riskLevel =
    prediction === 1 ? "High Risk" : "Low Risk";

  const history = await PredictionHistory.create({
    user: userId,
    diseaseType,
    prediction,
    riskLevel,
    probability: probabilityPercentage,
    inputData
  });

  return history;
};

export default savePredictionHistory;