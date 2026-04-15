import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import cors from "cors";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : ["https://tripzy-frontend-sb5l.onrender.com"];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without origin (like Postman/server-to-server).
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);

await connectDB();

app.get("/",(req,res)=>{
    res.send("API is running...");
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})