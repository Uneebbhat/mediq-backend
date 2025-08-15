import Joi from "joi";

const OTPVerificationSchema = Joi.object({
  otpCode: Joi.string().trim().length(6).pattern(/^\d+$/).required().messages({
    "string.base": "OTP must be a string.",
    "string.empty": "OTP is required.",
    "string.length": "OTP must be exactly 6 digits.",
    "string.pattern.base": "OTP must contain only numbers.",
    "any.required": "OTP is required.",
  }),

  doctorId: Joi.string().trim().required().messages({
    "string.base": "Doctor ID must be a string.",
    "string.empty": "Doctor ID is required.",
    "any.required": "Doctor ID is required.",
  }),
});

export default OTPVerificationSchema;
