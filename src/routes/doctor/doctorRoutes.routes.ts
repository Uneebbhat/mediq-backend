import { Router } from "express";
import {
  doctorSignup,
  doctorLogin,
  doctorOtpVerification,
  doctorGoogleLogin,
} from "../../controllers/doctor/doctorAuthController.controller";

const router = Router();

router
  .post("/v1/doctorSignup", doctorSignup)
  .post("/v1/doctorLogin", doctorLogin)
  .post("/v1/doctorOtpVerification", doctorOtpVerification)
  .post("/v1/doctorGoogleLogin", doctorGoogleLogin);

export default router;
