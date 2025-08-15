import ErrorHandler from "../utils/ErrorHandler";
import cloudinaryConfig from "../config/cloudinaryConfig";

import { Response } from "express";
import { v2 as cloudinary } from "cloudinary";

cloudinaryConfig();

const cloudinaryUpload = async (
  filepath: string,
  options = {},
  res: Response
) => {
  try {
    return await cloudinary.uploader.upload(filepath, options);
  } catch (error: any) {
    return ErrorHandler.send(res, 400, "Error while uploading image");
  }
};

export default cloudinaryUpload;
