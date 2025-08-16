import { Router } from "express";
import {
    signupAdmin,
    loginAdmin
} from "../controllers/auth.controller.js";
import { authRateLimit } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.route("/signup").post(authRateLimit, signupAdmin);
router.route("/login").post(authRateLimit, loginAdmin);

export default router;
