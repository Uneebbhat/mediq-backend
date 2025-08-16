import { Types } from "mongoose";

export enum Role {
  doctor = "doctor",
  patient = "patient",
}

export interface IDoctor {
  avatar?: File | string | unknown;
  docId: string;
  googleId?: string;
  doctorName: string;
  doctorEmail: string;
  password: string;
  doctorPhoneNumber: string;
  role: Role.doctor;
}

export interface IDoctorDTO {
  avatar?: File | string | unknown;
  _id: Types.ObjectId;
  docId: string;
  googleId?: string;
  doctorName: string;
  doctorEmail: string;
  password: string;
  doctorPhoneNumber: string;
  role: Role.doctor;
}
