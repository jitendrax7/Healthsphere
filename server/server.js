import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/users/userRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import docterRoutes from "./routes/docters/doctorRoutes.js";
import hospitalRoutes from "./routes/hospital/hospitalRoutes.js";
import donorRoutes from "./routes/blood/donorRoutes.js";
import bloodRoutes from "./routes/blood/bloodRoutes.js";
import { initBloodJobs } from "./jobs/bloodJobs.js";
import errorHandler from "./middleware/errorHandler.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HealthSphere API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/doctor", docterRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/blood", bloodRoutes);

app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initBloodJobs();
});
