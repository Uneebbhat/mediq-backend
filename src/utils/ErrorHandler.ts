import { Response } from "express";
import { captureException } from "@sentry/node";

class ErrorHandler {
  static send(res: Response, statusCode: number, error: string | Error) {
    // Normalize to an Error object for Sentry
    if (error instanceof Error) {
      captureException(error);
    } else {
      captureException(new Error(error));
    }

    // Send JSON response
    return res.status(statusCode).json({
      success: false,
      statusCode,
      error: error instanceof Error ? error.message : error,
    });
  }
}

export default ErrorHandler;
