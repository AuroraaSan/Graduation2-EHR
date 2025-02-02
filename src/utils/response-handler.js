import { BaseError } from "./errors.js";

export const sendSuccess = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) =>
  res.status(statusCode).json({
    status: "success",
    message,
    ...(data && { data }),
  });

export const sendError = (res, error) => {
  // Check if the error is a custom error, else default to 500
  const statusCode = error instanceof BaseError ? error.statusCode : 500;
  const message = error.message || "An unexpected error occurred";
  const details = error.details || null;

  res.status(statusCode).json({
    status: "error",
    message,
    ...(details && { details }), // Only include details if they exist
  });
};

// Middleware to handle async errors
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
