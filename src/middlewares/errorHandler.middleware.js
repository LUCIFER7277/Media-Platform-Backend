import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    // If it's not an ApiError, create one
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, error?.errors || [], err.stack);
    }

    const response = {
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    };

    // Add errors array if it exists
    if (error.errors && error.errors.length > 0) {
        response.errors = error.errors;
    }

    res.status(error.statusCode).json(response);
};

export { errorHandler };
