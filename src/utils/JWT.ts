import APIError from "../errors/apiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const salt = 10;

export const generatePassword = async (passwrod: string) => {
  try {
    return await bcrypt.hash(passwrod, salt);
  } catch (error: unknown) {
    throw new APIError("Unable to generate password!");
  }
};

export const generateSignature = async (payload: object): Promise<string> => {
  try {
    return await jwt.sign(payload, "schoolSign", { expiresIn: "30d" });
  } catch (error: unknown | any) {
    return "Unable to generate signature from jwt" + error.message
  }
};
