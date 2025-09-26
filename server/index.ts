import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import accountsRoutes from "./routes/accountRouter";
import complaintRoutes from "./routes/complaintRouter";

export function createServer() {
  dotenv.config();
  const app = express();

  mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("Mongodb Connected"))
  .catch((error)=>console.error("MongoDB connection error"));

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.use("/api/accounts", accountsRoutes);
  app.use("/api/complaint", complaintRoutes);

  return app;
}
