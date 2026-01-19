import express from 'express';
import { loginUserController, registerUserController, } from "../controller/auth.Controller";
const authRoutes = express.Router();
authRoutes.post("/login", loginUserController);
authRoutes.post("/register", registerUserController);
export default authRoutes;
