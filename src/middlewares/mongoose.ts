import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export class BaseCustomError extends Error {
  [x: string]: any;
  constructor(message: string | undefined, statusCode: number) {
    super(message); // Call the super constructor (Error class)
    this.statusCode = statusCode; // Custom property to hold status code
    this.name = this.constructor.name; // Set the name of the error to the class name
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}



const validateMongooseId = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    const customError = new BaseCustomError('id Invalide', 404);
    console.log(customError.statusCode)
    _next(customError);
  }
  _next();
};

export { validateMongooseId };
