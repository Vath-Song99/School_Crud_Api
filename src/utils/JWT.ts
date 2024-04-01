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


export const comparePassword = async (payload: {password: string, userPassword: string})=>{
  try{
    const { password , userPassword} = payload
    const passwordMatch = await bcrypt.compare(password, userPassword);
    return passwordMatch
  }catch(error: unknown | any){
    return "Unable to generate signature from jwt" + error.message
  }
}

// export const generateLogin = async (payload: object): Promise<string> =>{
//   try{
//     const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });
//   }catch(error:unknown){
//     throw new APIError("Unable to generateLogin")
//   }
// }