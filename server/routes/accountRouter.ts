import express from "express";
import { login, signup } from "../controllers/accountController";

const accountsRoutes = express.Router();

accountsRoutes.post("/signup", signup);

accountsRoutes.post("/login", login);

export default accountsRoutes;
