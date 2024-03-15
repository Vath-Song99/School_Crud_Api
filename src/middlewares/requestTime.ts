import { Request,NextFunction,Response } from "express";


const requestTimeMiddleware = (req: Request,res: Response, next: NextFunction) =>{
   const requestTime = Date.now();
    console.log(`[${new Date(requestTime)}] ${req.method} ${req.originalUrl}
      `);
    next();
}

export default requestTimeMiddleware