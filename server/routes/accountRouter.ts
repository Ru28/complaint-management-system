import express from "express";
import { login, signup, updateProfile } from "../controllers/accountController";
import { authVerify } from "../middleware/authVerify";

const accountsRoutes = express.Router();

accountsRoutes.post("/signup", signup);
accountsRoutes.post("/login", login);
accountsRoutes.post("/update-profile", authVerify, updateProfile);

export default accountsRoutes;
