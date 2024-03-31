import { NextFunction,Request, Response } from "express";
import { BaseCustomError } from "../errors/baseCustomError";
import { ZodSchema } from "zod";
import { StatusCode } from "../utils/consts";



const validateUser =  (Schema: ZodSchema) =>{
        
     return (req: Request, res: Response, _next: NextFunction)=>{
      try{
            
        Schema.parse(req.body)
        _next ()
    }catch(error: unknown |any){
    const userError = new BaseCustomError('username or password is incorrect', StatusCode.Unauthorized) 
        _next(userError)
    }
     }

}

export {validateUser}