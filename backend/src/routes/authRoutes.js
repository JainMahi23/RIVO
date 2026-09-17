import { Router } from "express";
import { register, login, requestOtp, verifyOtp, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/otp/request", requestOtp);
router.post("/otp/verify", verifyOtp);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
