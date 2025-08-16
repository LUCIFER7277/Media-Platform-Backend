import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

// Rate limiter for view logging
export const viewRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 view logs per windowMs
    message: {
        error: "Too many view requests from this IP, please try again later.",
        retryAfter: "15 minutes"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        throw new ApiError(429, "Too many view requests, please try again later");
    },
    skip: (req) => {
        // Skip rate limiting for testing environment
        return process.env.NODE_ENV === 'test';
    }
});

// Rate limiter for authentication endpoints
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/signup attempts per windowMs
    message: {
        error: "Too many authentication attempts from this IP, please try again later.",
        retryAfter: "15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        throw new ApiError(429, "Too many authentication attempts, please try again later");
    },
    skip: (req) => {
        return process.env.NODE_ENV === 'test';
    }
});

// Rate limiter for media upload
export const uploadRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 uploads per hour
    message: {
        error: "Too many upload requests from this IP, please try again later.",
        retryAfter: "1 hour"
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        throw new ApiError(429, "Too many upload requests, please try again later");
    },
    skip: (req) => {
        return process.env.NODE_ENV === 'test';
    }
});
