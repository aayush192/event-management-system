import express from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import eventRoutes from "./event.route";
const router = express.Router();
router.use("/", userRoutes);
router.use("/auth", authRoutes);
router.use("/event", eventRoutes);

export default router;
