import { Router } from "express";
import {
  doctorSignup,
  doctorLogin,
  doctorOtpVerification,
} from "../../controllers/doctor/doctorAuthController.controller";

const router = Router();

router
  .post("/v1/doctorSignup", doctorSignup)
  .post("/v1/doctorLogin", doctorLogin)
  .post("/v1/doctorOtpVerification", doctorOtpVerification);

export default router;
