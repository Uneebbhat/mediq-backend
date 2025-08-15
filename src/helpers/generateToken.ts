import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler";

import { Response } from "express";
import { JWT_SECRET } from "../config/constants";

const generateToken = (res: Response, payload: any) => {
  if (!JWT_SECRET) {
    ErrorHandler.send(res, 500, "JWT Secret is not defined.");
  }

  const token = jwt.sign(
    {
      userId: payload._id,
      name: payload.name,
      userEmail: payload.email,
      role: payload.role,
    },
    JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return token;
};

export default generateToken;
