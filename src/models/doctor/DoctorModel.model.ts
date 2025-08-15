import mongoose, { Schema, Model } from "mongoose";
import { IDoctor, Role } from "../../interface/index";

const DoctorModel: Schema<IDoctor> = new Schema(
  {
    docProfileImg: {
      type: String,
    },
    doctorName: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    doctorEmail: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [100, "Password cannot exceed 100 characters"],
    },
    role: {
      type: String,
      default: Role.doctor,
    },
    googleId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Doctor: Model<IDoctor> = mongoose.model<IDoctor>("User", DoctorModel);

export default Doctor;
