import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/users/userRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import docterRoutes from "./routes/docters/doctorRoutes.js";
import hospitalRoutes from "./routes/hospital/hospitalRoutes.js";

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HealthSphere API Running...");
}); 
  


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", docterRoutes);
app.use("/api/hospital", hospitalRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
    