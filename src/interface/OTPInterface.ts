import { Types } from "mongoose";

export interface IOTP extends Document {
  otpCode: string;
  doctorId: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

export interface IOTPCode {
  otpCode: string;
  doctorId: string;
}
