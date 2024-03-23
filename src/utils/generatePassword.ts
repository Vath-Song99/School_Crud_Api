import APIError from "../errors/apiError"
import bcrypt from  "bcrypt";

const salt = 10;

export const generatePassword = async (passwrod: string) =>{
    try{
        return await bcrypt.hash(passwrod,salt);
    }catch(error: unknown){ 
        throw new APIError("Unable to generate password!");
    }
}