import { Request, Response, NextFunction } from 'express';
import { BaseCustomError } from '../utils/baseCustomError';


// Global error handler middleware
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {

  if (err instanceof BaseCustomError){
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  next()
}

export default errorHandler
