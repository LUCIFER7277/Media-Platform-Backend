import { Router } from "express";
import {
    signupAdmin,
    loginAdmin
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(signupAdmin);
router.route("/login").post(loginAdmin);

export default router;
