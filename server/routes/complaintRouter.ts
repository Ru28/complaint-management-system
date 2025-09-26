import express from "express";
import { fetchComplaintByUser, raiseComplaint } from "../controllers/complainController";
import { authVerify } from "../middleware/authVerify";


const complaintRoutes= express.Router();


complaintRoutes.post("/raiseComplaint",authVerify,raiseComplaint);
complaintRoutes.get("/myComplaint",authVerify,fetchComplaintByUser);

export default complaintRoutes;