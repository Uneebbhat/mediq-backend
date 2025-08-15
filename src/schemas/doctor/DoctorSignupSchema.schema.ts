import Joi from "joi";

const DoctorSignupSchema = Joi.object({
  doctorName: Joi.string().required().min(2).max(50).trim().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
  }),

  doctorEmail: Joi.string()
    .required()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please enter a valid email address",
      "string.base": "Email must be a string",
    }),

  password: Joi.string().required().min(8).max(100).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 100 characters",
  }),

  role: Joi.string().valid("doctor").default("doctor"),
});

export default DoctorSignupSchema;
