import { Types } from "mongoose";
import { IDoctorDTO, Role } from "../../interface/index";

class DoctorDTO {
  _id: Types.ObjectId;
  doctorName: string;
  doctorEmail: string;
  password: string;
  role: Role.doctor;
  constructor(doctor: IDoctorDTO) {
    this._id = doctor._id;
    this.doctorName = doctor.doctorName;
    this.doctorEmail = doctor.doctorEmail;
    this.password = doctor.password;
    this.role = doctor.role;
  }
}

export default DoctorDTO;
