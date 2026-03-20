import dotenv from "dotenv";
dotenv.config();
// console.log("GROQ KEY:", process.env.GROQ_API_KEY);
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/users/userRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import docterRoutes from "./routes/docters/doctorRoutes.js";

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
app.use("/api/doctor", docterRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
