import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
// console.log("GROQ KEY:", process.env.GROQ_API_KEY);
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
import diseaseRoutes from "./routes/diseaseRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";

connectDB();

const app = express();

app.use(cors());

// app.use(cors({
//   origin: "http://localhost:3000", // your frontend URL
//   credentials: true
// }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HealthSphere API Running...");
}); 

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/disease", diseaseRoutes);

app.use("/api/doctor", doctorRoutes);

app.use("/api/chatbot", chatRoutes);

app.use("/api/update-location", locationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
