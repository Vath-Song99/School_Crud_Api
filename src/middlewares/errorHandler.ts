import { Request, Response, NextFunction } from 'express';

// Global error handler middleware
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // Default to 500 if no status code is set
  const statusCode =  req.statusCode;

  //res to client 
  res.json({
    statusCode: statusCode,
    message: err.message,
  });
  next()
}

export default errorHandler
