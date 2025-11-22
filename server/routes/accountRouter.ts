import express from "express";
import { login, signup, updateProfile, getProfile } from "../controllers/accountController";
import { authVerify } from "../middleware/authVerify";

const accountsRoutes = express.Router();

accountsRoutes.post("/signup", signup);
accountsRoutes.post("/login", login);
accountsRoutes.get("/profile", authVerify, getProfile);
accountsRoutes.post("/update-profile", authVerify, updateProfile);

export default accountsRoutes;
