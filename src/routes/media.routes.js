import { Router } from "express";
import {
    uploadMedia,
    generateStreamUrl,
    streamMedia,
    logMediaView,
    getMediaAnalytics
} from "../controllers/media.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { viewRateLimit, uploadRateLimit } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Media upload route (authenticated + rate limited)
router.route("/").post(
    uploadRateLimit,
    verifyJWT,
    upload.single("media"),
    uploadMedia
);

// Generate secure streaming URL (authenticated)
router.route("/:id/stream-url").get(verifyJWT, generateStreamUrl);

// Log media view (authenticated + rate limited)
router.route("/:id/view").post(viewRateLimit, verifyJWT, logMediaView);

// Get media analytics (authenticated)
router.route("/:id/analytics").get(verifyJWT, getMediaAnalytics);

// Stream media (public route for actual streaming)
router.route("/stream/:id").get(streamMedia);

export default router;
