import { NextFunction,Request, Response } from "express";
import { userValidation } from "../schema/userValidation.schema";
import { BaseCustomError } from "../utils/baseCustomError";
import { z } from "zod";

type User = z.infer<typeof userValidation>;


const validateUser =  (Schema: z.ZodObject<any, any>) =>{
        
     return (req: Request, res: Response, _next: NextFunction)=>{
      try{
            
        Schema.parse(req.body)
        _next ()
    }catch(error: unknown |any){
    const userError = new BaseCustomError(error.errors[0].message,401) 
        console.log(error)
        _next(userError)
    }
     }

}

export {validateUser}