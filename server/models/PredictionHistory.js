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
    type: Number, // 0 or 1
    required: true
  },

  riskLevel: {
    type: String,
    required: true
  },

  probability: {
    type: Number, // store like 82.34
    required: true
  },

  inputData: {
    type: Object, // store features user entered
    required: true
  }

}, {
  timestamps: true // automatically adds createdAt & updatedAt
});

export default mongoose.model("PredictionHistory", predictionHistorySchema);