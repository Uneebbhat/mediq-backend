import sendEmail from "../../services/sendEmail";
import setCookies from "../../helpers/setCookies";
import ErrorHandler from "../../utils/ErrorHandler";
import DoctorDTO from "../../dto/doctor/DoctorDTO.dto";
import generateToken from "../../helpers/generateToken";
import OTPModel from "../../models/doctor/OTPModel.model";
import ResponseHandler from "../../utils/ResponseHandler";
import Doctor from "../../models/doctor/DoctorModel.model";
import DoctorModel from "../../models/doctor/DoctorModel.model";
import DoctorLoginSchema from "../../schemas/doctor/DoctorLoginSchema.schema";
import DoctorSignupSchema from "../../schemas/doctor/DoctorSignupSchema.schema";
import OTPVerificationSchema from "../../schemas/doctor/OTPVerificationSchema.schema";

import { Request, Response } from "express";
import { CLIENT_ID } from "../../config/constants";
import { OAuth2Client } from "google-auth-library";
import {
  comparePassword,
  hashPassword,
} from "../../helpers/passwordEncryptionDecryption";
import { IOTPCode } from "../../interface/OTPInterface";
import { IDoctor } from "../../interface/DoctorInterface";
import { welcomeEmail } from "../../templates/emails/welcomeEmail";

const client = new OAuth2Client(CLIENT_ID);
console.log(CLIENT_ID);

export const doctorSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = DoctorSignupSchema.validate(req.body as IDoctor);
  if (error) {
    ErrorHandler.send(res, 400, error.message);
  }

  try {
    const { doctorName, doctorEmail, password } = req.body as IDoctor;

    const existingDoctor = await Doctor.findOne({ doctorEmail });
    if (existingDoctor) {
      ErrorHandler.send(res, 409, "Doctor already exists");
    } else {
      const hashedPassword = await hashPassword(password);

      const newDoctor = await DoctorModel.create({
        doctorName,
        doctorEmail,
        password: hashedPassword,
        role: "doctor",
      });

      const token = generateToken(res, newDoctor);

      setCookies(res, token);

      const doctorDTO = new DoctorDTO(newDoctor);

      try {
        const emailTemplate = welcomeEmail(newDoctor.doctorName);
        await sendEmail(
          newDoctor.doctorEmail,
          emailTemplate.subject,
          emailTemplate.text
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Failed to send welcome email: ${error.message}`);
        } else {
          console.error(`Unknown error occured`);
        }
      }

      try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTPModel.create({
          otpCode: otp,
          doctorId: newDoctor._id,
          expiresAt: new Date(Date.now() + 1 * 60 * 1000),
          createdAt: Date.now(),
        });

        // Send OTP via email
        const subject = "Your OTP Code";
        const text = `Your OTP code is: ${otp}. It is valid for 1 minute.`;
        await sendEmail(newDoctor.doctorEmail, subject, text);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Failed to send OTP email: ${error.message}`);
        } else {
          console.error(`Unknown error occured while sending OTP`);
        }
      }

      ResponseHandler.send(
        res,
        201,
        "Account created successfully. OTP sent to your email.",
        doctorDTO,
        token
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error Stack: ${error.stack}`);

      ErrorHandler.send(res, 500, `Internal Server Error: ${error.message}`);
    } else {
      console.error(`Unknown error occurred`, error);

      ErrorHandler.send(res, 500, `An unknown error occurred`);
    }
  }
};

export const doctorOtpVerification = async (
  req: Request,
  res: Response
): Promise<void> => {
  // 1. Validate input
  const { error } = OTPVerificationSchema.validate(req.body);
  if (error) {
    ErrorHandler.send(res, 400, error.message);
  }

  try {
    const { otpCode, doctorId } = req.body as IOTPCode;

    // 2. Check if doctor exists
    const existingDoctor = await DoctorModel.findById(doctorId);
    if (!existingDoctor) {
      ErrorHandler.send(res, 404, "Doctor not found");
    }

    // 3. Find OTP record
    const otpRecord = await OTPModel.findOne({
      doctorId,
    });
    if (!otpRecord) {
      ErrorHandler.send(res, 404, "No OTP record found");
    }

    // 4. Check expiry
    if (otpRecord?.expiresAt! < new Date()) {
      ErrorHandler.send(res, 400, "OTP has expired");
    }

    // 5. Compare OTP
    if (otpRecord?.otpCode !== otpCode) {
      ErrorHandler.send(res, 400, "Invalid OTP");
    }

    // 6. OTP valid — delete record to prevent reuse
    await OTPModel.deleteOne({ _id: otpRecord?._id });

    // 7. Send success response
    ResponseHandler.send(res, 200, "OTP verified successfully", {
      doctorId: existingDoctor?._id,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error Stack: ${error.stack}`);
      ErrorHandler.send(res, 500, `Internal Server Error: ${error.message}`);
    } else {
      console.error(`Unknown error occurred`, error);
      ErrorHandler.send(res, 500, `An unknown error occurred`);
    }
  }
};

export const doctorLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { error } = DoctorLoginSchema.validate(req.body);
  if (error) {
    ErrorHandler.send(res, 400, error.message);
  }

  try {
    const { doctorEmail, password } = req.body;

    const doctor = await Doctor.findOne({ doctorEmail });
    if (!doctor) {
      ErrorHandler.send(res, 404, "Doctor not found");
    }

    const isPasswordCorrect = await comparePassword(password, doctor!.password);
    if (!isPasswordCorrect) {
      ErrorHandler.send(res, 400, "Invalid email or password");
    } else {
      const token = generateToken(res, doctor);

      setCookies(res, token);

      const userDTO = new DoctorDTO(doctor!);

      ResponseHandler.send(res, 200, "Login successful", userDTO!);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error Stack: ${error.stack}`);

      ErrorHandler.send(res, 500, `Internal Server Error: ${error.message}`);
    } else {
      console.error(`Unknown error occurred`, error);

      ErrorHandler.send(res, 500, `An unknown error occurred`);
    }
  }
};

export const doctorGoogleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      ErrorHandler.send(res, 400, "ID Token is required");
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      ErrorHandler.send(res, 401, "Invalid Google token");
    }

    const googleId = payload?.sub!;
    const doctorEmail = payload?.email!;
    const doctorName = payload?.name!;
    const picture = payload?.picture ?? null;

    if (!payload?.email_verified) {
      ErrorHandler.send(res, 403, "Email not verified by Google");
    }

    let doctor = await DoctorModel.findOne({ googleId });
    if (!doctor) {
      doctor = await DoctorModel.create({
        doctorName,
        doctorEmail,
        googleId,
        avatar: picture,
        role: "doctor",
      });
    }

    const token = generateToken(res, doctor);

    const doctorDTO = new DoctorDTO(doctor);

    ResponseHandler.send(res, 200, "Google login successfull", {
      doctorDTO,
      token,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error Stack: ${error.stack}`);

      ErrorHandler.send(res, 500, `Internal Server Error: ${error.message}`);
    } else {
      console.error(`Unknown error occurred`, error);

      ErrorHandler.send(res, 500, `An unknown error occurred`);
    }
  }
};
