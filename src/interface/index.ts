import { Types } from "mongoose";

// User Interface
export enum Role {
  doctor = "doctor",
  patient = "patient",
}

export interface IDoctor {
  docId: string;
  googleId?: string;
  docProfileImg: string;
  doctorName: string;
  doctorEmail: string;
  password: string;
  doctorPhoneNumber: string;
  role: Role.doctor;
}

export interface IDoctorDTO {
  _id: Types.ObjectId;
  docId: string;
  googleId?: string;
  docProfileImg: string;
  doctorName: string;
  doctorEmail: string;
  password: string;
  doctorPhoneNumber: string;
  role: Role.doctor;
}

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
