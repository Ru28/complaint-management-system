import express from "express";
import { authVerify } from "../middleware/authVerify";
import { fetchAllComplaints, resolveComplaint } from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.get("/all-complaints", authVerify, fetchAllComplaints);
adminRouter.post("/resolve-complaint", authVerify, resolveComplaint);

export default adminRouter;