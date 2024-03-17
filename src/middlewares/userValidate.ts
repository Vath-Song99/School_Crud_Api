import { NextFunction,Request, Response } from "express";
import { userValidation } from "../schema/userValidation.schema";
import { BaseCustomError } from "../utils/baseCustomError";

const Schema = userValidation

const validateUser = async (req: Request, res: Response, _next: NextFunction) =>{
        try{
            
            Schema.parse(req.body)

            _next ()
        }catch(error: unknown |any){
        const userError = new BaseCustomError(error.errors[0].message,401) 
            console.log(error)
            _next(userError)
        }
}

export {validateUser}