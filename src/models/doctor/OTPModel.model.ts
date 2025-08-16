import mongoose, { Schema } from "mongoose";
import { IOTP } from "../../interface/OTPInterface";

const OTPModel: Schema<IOTP> = new Schema<IOTP>({
  otpCode: {
    type: String,
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OTP = mongoose.model<IOTP>("OTP", OTPModel);

export default OTP;
