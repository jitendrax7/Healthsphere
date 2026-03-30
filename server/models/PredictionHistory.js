import mongoose from "mongoose";

const predictionHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  diseaseType: {
    type: String,
    required: true,
  },

  prediction: {
    type: Number, 
    required: true
  },

  riskLevel: {
    type: String,
    required: true
  },

  probability: {
    type: Number, 
    required: true
  },

  inputData: {
    type: Object,
    required: true
  }

}, {
  timestamps: true 
});

export default mongoose.model("PredictionHistory", predictionHistorySchema);