import express from "express";
import { authVerify } from "../middleware/authVerify";
import {
  fetchAllComplaints,
  resolveComplaint,
  fetchAllUsers,
  updateUserRole,
} from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.get("/all-complaints", authVerify, fetchAllComplaints);
adminRouter.post("/resolve-complaint", authVerify, resolveComplaint);
adminRouter.get("/users", authVerify, fetchAllUsers);
adminRouter.patch("/users/:id/role", authVerify, updateUserRole);

export default adminRouter;
